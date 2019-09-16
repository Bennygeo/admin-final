import { Component, OnInit, NgZone, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FireBase } from 'src/app/utils/firebase';
import { AngularFireDatabase } from 'angularfire2/database';
import { CommonsService } from 'src/app/services/commons.service';

@Component({
  selector: 'order-view',
  templateUrl: './order-view.component.html',
  styleUrls: ['./order-view.component.scss']
})
export class OrderViewComponent implements OnInit, OnDestroy {

  data: any;
  sub: any;
  overlay: boolean = false;
  priceVal: number = 0;
  firebase: FireBase
  historyLength: any;
  packageData: any = {
    'no_of_days': 0
  };
  readOrders: any;

  constructor(
    private _ngZone: NgZone,
    private _router: Router,
    private _location: Location,
    private _activatedRoute: ActivatedRoute,
    private _changeDet: ChangeDetectorRef,
    private _db: AngularFireDatabase,
    private _service: CommonsService
  ) {
    console.log("order view constructor.");
    this.sub = this._router.events.subscribe((data: any) => {
      console.log("router subscriber");
      // debugger;
      // console.log(data);
      try {
        this.data = JSON.parse(data.snapshot.params.data);
        this.priceVal = this.data.totalPrice;
        this._changeDet.detectChanges();
        // this._ngZone.run(() => { });
      } catch (e) { }
      // debugger;
      this.readPackageInfo();
      this.sub.unsubscribe();
    });
    this.firebase = new FireBase(this._db);

  }

  ngOnInit() {
    console.log("init");
  }

  readPackageInfo() {
    console.log("readPackageInfo");
    this.readOrders = this.firebase.readOrders(this.data.m_no).subscribe((data: any) => {
      try {
        this.historyLength = Object.keys(data).length || 0;
      } catch (e) {
        this.historyLength = 0;
      }
      this.packageData = data[this.historyLength].details;
      this._changeDet.detectChanges();
    });
  }

  clickToGoBack() {
    this._location.back();
  }

  deliveredAction(): void {

  }

  notDeliveredAction(): void {

  }

  payAction(): void {
    this.priceVal = this.data.remaining_to_pay;
    (this.overlay) ? this.overlay = false : this.overlay = true;
    this._ngZone.run(() => { });
  }

  modalSaveAction() {
    console.log("modalSaveAction");
    (this.overlay) ? this.overlay = false : this.overlay = true;

    // console.log("this.packageData.total_price :: " + this.packageData.total_price);
    // console.log("this.priceVal :: " + this.priceVal);
    // console.log("paid amt :: " + (this.packageData.remaining_to_pay - this.priceVal));
    let remaining = this.packageData.remaining_to_pay - this.priceVal;//this.packageData.remaining_to_pay - this.packageData.paid_amt;
    let paid = Math.abs(remaining - this.packageData.total_price);
    let status = "";
    // console.log("paid : " + paid);
    // console.log("remaining : " + remaining);
    // debugger;
    // this.firebase.write_tc_orders(this.data.date, this.data.m_no, this.data);

    if (paid == this.packageData.total_price) {
      status = "Paid";
    } else if (paid != 0 && paid < this.packageData.total_price) {
      status = "Partially paid";
    } else {
      status = "Not paid";
    }

    this.firebase.packageInfoUpdate(this.data.m_no, this.historyLength,
      {
        "total_price": this.packageData.total_price,
        "paid_amt": paid,
        "remaining_to_pay": remaining,
        "paid_status": status
      },
      this.data.date, () => {
        // debugger;
        this._changeDet.detectChanges();
      });
  }

  modalCancelAction() {
    (this.overlay) ? this.overlay = false : this.overlay = true;
  }

  overlayClickHandler(): void {
    console.log("overlayClickHandler");
    (this.overlay) ? this.overlay = false : this.overlay = true;
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
    this.readOrders.unsubscribe();
  }

}
