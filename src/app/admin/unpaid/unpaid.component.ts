import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonsService } from 'src/app/services/commons.service';
import { DateUtils } from 'src/app/utils/date-utils';
import { FireBase } from 'src/app/utils/firebase';
import { AngularFireDatabase } from 'angularfire2/database';

@Component({
  selector: 'app-unpaid',
  templateUrl: './unpaid.component.html',
  styleUrls: ['./unpaid.component.scss']
})
export class UnpaidComponent implements OnInit {

  firebase: FireBase;

  userListUpdateObservable: any;
  balance_list: Array<any> = [];
  list: any = [];
  trace: any = console.log;

  current_target_index: number = 0;
  current_target_history_id: number = 0;
  packageData: any;

  overlay: boolean = false;
  priceVal: number = 0;

  constructor(
    private _service: CommonsService,
    private date_utils: DateUtils,
    private db: AngularFireDatabase,
    private _changeDet: ChangeDetectorRef
  ) {
    // this.userListUpdateObservable = this._service.onUserListUpdate.subscribe((data) => {
    //   debugger;
    // });

    // console.log("this.userList :: " + this._service.userList);
    // debugger;
    this.getRemainingBalance();
    this.firebase = new FireBase(this.db);

  }

  ngOnInit() {
  }

  getRemainingBalance() {
    let balance_list = {};
    let _index = -1;
    let array_index = -1;

    for (let key in this._service.userList) {
      // debugger;
      balance_list[key] = {};
      balance_list[key]['remaining'] = 0;
      balance_list[key]['name'] = this._service.userList[key].name;
      balance_list[key]['mobile'] = key;
      this.balance_list.push(balance_list[key]);

      let item = this._service.userList[key].history;
      array_index++;

      balance_list[key]['details'] = [];
      _index = -1;
      for (let history in item) {
        try {
          if (item[history].details.remaining_to_pay > 0) {
            _index++;

            balance_list[key]['details'][_index] = {};

            var tmp = Object.keys(item[history].dates);

            var order_length = tmp.length;
            // console.log("order_length :: " + order_length);
            var sort_date_ary = [];
            for (var j = 0; j < order_length; j++) {
              sort_date_ary[j] = new Date(this.date_utils.stdDateFormater(this.date_utils.dateFormater(tmp[j], "-"), "/"));
            }

            sort_date_ary.sort(function (a, b) {
              // Turn your strings into dates, and then subtract them
              // to get a value that is either negative, positive, or zero.
              return a.getTime() - b.getTime();
            });

            // obj[Object.keys(obj)[0]]
            // this.trace(item[history].dates[Object.keys(item[history].dates)[0]]);
            // this.trace("============================");

            balance_list[key].details[_index] = {
              "balance": item[history].details.remaining_to_pay,
              "start_date": sort_date_ary[0].toDateString(),
              "end_date": sort_date_ary[order_length - 1].toDateString(),
              "history": _index,
              "history_id": history,
              "index": array_index,
              "product_name": item[history].details.name,
              "count": item[history].dates[Object.keys(item[history].dates)[0]].count,
              "total_days": item[history].details.no_of_days,
              "paid": item[history].details.paid_amt,
              "total": item[history].details.total_price
            }
          }
          balance_list[key]['remaining'] += item[history].details.remaining_to_pay;
        } catch (e) {
          console.log("Error :: " + key);
        }
      }
      //remove the last entry if the balanace amout is 0.
      if (balance_list[key]['remaining'] == 0) {
        this.balance_list.pop();
        array_index--;
      }
    }
    this.trace(this.balance_list);
  }


  pay_click_action(evt) {

    this.overlay = true;
    let _tmp = evt.currentTarget.id.split("_");
    this.current_target_index = _tmp[1] * 1;
    this.current_target_history_id = _tmp[2] * 1;
    this.priceVal = this.balance_list[this.current_target_index].details[this.current_target_history_id].balance
  }

  overlayClickHandler(): void {
    console.log("overlayClickHandler");
    (this.overlay) ? this.overlay = false : this.overlay = true;
  }

  modalSaveAction() {
    console.log("modalSaveAction");
    this.packageData = this.balance_list[this.current_target_index].details[this.current_target_history_id];
    let remaining = this.packageData.balance - this.priceVal;//this.packageData.remaining_to_pay - this.packageData.paid_amt;
    let paid = Math.abs(remaining - this.packageData.total);
    let status = "";
    if (paid == this.packageData.total) {
      status = "Paid";
    } else if (paid != 0 && paid < this.packageData.total) {
      status = "Partially paid";
    } else {
      status = "Not paid";
    }
    // this.trace("remaining :: " + remaining);

    // this.firebase.packageInfoUpdate(this.balance_list[this.current_target_index].mobile, this.packageData.history_id,
    //   {
    //     "total_price": this.packageData.total,
    //     "paid_amt": paid,
    //     "remaining_to_pay": remaining,
    //     "paid_status": status
    //   }, () => {
    //     (this.overlay) ? this.overlay = false : this.overlay = true;
    //     this.packageData.balance = remaining;
    //     this.packageData.paid += remaining;
    //     this._changeDet.detectChanges();
    //   });

    this.firebase.packagePaidHistoryUpdate(this.balance_list[this.current_target_index].mobile, this.packageData.history_id, this.priceVal, () => {
      this._changeDet.detectChanges();
    });

    let content = "";
    if (remaining == 0) {
      content = `Dear Customer!\nThank you for your payment of Rs.${this.priceVal} towards your ${this.packageData.count}x${this.packageData.total_days} days of ${this.packageData.product_name} subscription from ${this.packageData.start_date} to ${this.packageData.end_date}.\nStay Healthy!\nwww.thinkspot.in`;
    } else if (remaining < 0) {
      content = `Dear Customer!\nThank you for you payment of Rs.${this.priceVal} towards your order total of Rs.${this.packageData.balance} for ${this.packageData.count}x${this.packageData.total_days} days of ${this.packageData.product_name} subscription from ${this.packageData.start_date} to ${this.packageData.end_date}. Kindly collect the balance of Rs.${Math.abs(remaining)} on your next delivery. Thank you.\nStay Healthy!\nwww.thinkspot.in`;
    } else if (remaining > 0) {
      content = `Dear Customer!\nThank you for you payment of Rs.${this.priceVal} towards your order total of Rs.${this.packageData.balance} for ${this.packageData.count}x${this.packageData.total_days} days of ${this.packageData.product_name} subscription from ${this.packageData.start_date} to ${this.packageData.end_date}. Kindly pay the balance of Rs.${remaining} on your next delivery. Thank you.\nStay Healthy!\nwww.thinkspot.in`;
    }
    // this.trace(content);
    // this.trace("++++++++++++++++");


    this._service.send_bulk_sms({
      'mobile_nos': [this.balance_list[this.current_target_index].mobile],
      'fName': "",
      'content': content
    }, () => { 
      this.modalCancelAction();
    });

  }

  modalCancelAction() {
    (this.overlay) ? this.overlay = false : this.overlay = true;
  }
}
