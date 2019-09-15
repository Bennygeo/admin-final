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
      var historyLength = 0;
      try {
        historyLength = Object.keys(data).length || 0;
      } catch (e) {
        historyLength = 0;
      }
      this.packageData = data[historyLength];
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
    if (this.priceVal == this.data.totalPrice) {
      // this.data.delivery_status = "Delivered";
      this.data.paid_amt = this.priceVal;
      this.data.paid = "paid";
      this.data.remaining_to_pay = 0;
    } else if (this.priceVal > 0 && this.priceVal < this.data.totalPrice) {
      this.data.paid_amt = this.priceVal;
      this.data.paid = "partially paid";
      this.data.remaining_to_pay = this.data.totalPrice - this.priceVal;
    } else {
      this.data.paid = "Not paid";
      this.data.remaining_to_pay = this.data.totalPrice;
    }
    (this.overlay) ? this.overlay = false : this.overlay = true;
    // debugger;
    // this.firebase.write_tc_orders(this.data.date, this.data.m_no, this.data);

    // this.firebase.editupdateWrite(this.mobile, this._service.historyLength,
    //   {
    //     "total_price": _total_price,
    //     "remaining_to_pay": _total_price - this.historyObj['paid_amt'],
    //     "paid_status": ""
    //   },
    //   date, () => {
    //     // debugger;
    //     this._changeDet.detectChanges();
    //   });
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
