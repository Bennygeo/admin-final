import { Component, OnInit, NgZone, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FireBase } from 'src/app/utils/firebase';
import { AngularFireDatabase } from 'angularfire2/database';
import { CommonsService } from 'src/app/services/commons.service';
import { DateUtils } from 'src/app/utils/date-utils';

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
  dates: any;
  packageData: any = {
    'no_of_days': 0
  };
  readOrders: any;
  start_delivery_date: any;
  last_delivery_date: any;
  remaining_days: number = 0;

  constructor(
    private _ngZone: NgZone,
    private _router: Router,
    private _location: Location,
    private _activatedRoute: ActivatedRoute,
    private _changeDet: ChangeDetectorRef,
    private _db: AngularFireDatabase,
    private _service: CommonsService,
    private date_utils: DateUtils
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
    let sort_date_ary = [];
    this.readOrders = this.firebase.readOrders(this.data.m_no).subscribe((data: any) => {
      try {
        this.historyLength = Object.keys(data).length || 0;
      } catch (e) {
        this.historyLength = 0;
      }
      this.packageData = data[this.historyLength].details;
      // debugger;

      this.dates = data[this.historyLength].dates;
      let order_length = Object.keys(this.dates).length - 1;

      sort_date_ary = [];
      let tmp = Object.keys(this.dates);
      for (let j = 0; j <= order_length; j++) {
        sort_date_ary.push(new Date(this.date_utils.stdDateFormater(this.date_utils.dateFormater(tmp[j], "-"), "/")));
      }

      // /* Do sort the dates array */
      sort_date_ary.sort(function (a, b) {
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        return a.getTime() - b.getTime();
      });

      this.start_delivery_date = sort_date_ary[0].toDateString();
      this.last_delivery_date = sort_date_ary[order_length].toDateString();

      this.remaining_days = this.date_utils.dateDiff(new Date(), sort_date_ary[order_length]);

      this._changeDet.detectChanges();
    });
    // debugger;
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

    let remaining = this.packageData.remaining_to_pay - this.priceVal;//this.packageData.remaining_to_pay - this.packageData.paid_amt;
    let paid = Math.abs(remaining - this.packageData.total_price);
    let status = "";
    // debugger;
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

    this.firebase.packagePaidHistoryUpdate(this.data.m_no, this.historyLength, this.priceVal, () => {
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
