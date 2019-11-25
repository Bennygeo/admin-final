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
    let index = -1;
    let tmpName = ""
    for (let key in this._service.userList) {
      // debugger;
      balance_list[key] = {};
      balance_list[key]['remaining'] = 0;
      balance_list[key]['name'] = this._service.userList[key].name;
      balance_list[key]['mobile'] = key;
      this.balance_list.push(balance_list[key]);
      var _my_index = -1;

      let item = this._service.userList[key].history;
      for (let history in item) {
        try {
          // if (key == "9486140936") debugger;
          this.trace("key :: " + key);
          this.trace("ramininig :: " + item[history].details.remaining_to_pay);
          if (item[history].details.remaining_to_pay > 0) {
            _my_index++;
            let k = _my_index;
            this.trace("_my_index++ :: " + _my_index);
            if (balance_list[key]['name'] != tmpName) index++;
            // this.trace("balance_list[key]['name'] :: "  +balance_list[key]['name']);

            debugger;
            // this.list.push(balance_list[key]);
            balance_list[key]['details'] = [];

            // this.trace(item[k].dates);
            // for (let k: any = history; k >= 1; k--) {
            var tmp = Object.keys(item[k].dates);
            this.trace("tmp :: " + tmp.length);

            // debugger;  
            var order_length = tmp.length;
            // console.log("order_length :: " + order_length);
            var sort_date_ary = [];
            for (var j = 0; j < order_length; j++) {
              sort_date_ary[j] = new Date(this.date_utils.stdDateFormater(this.date_utils.dateFormater(tmp[j], "-"), "/"));
            }
            // console.log("sort_date_ary len :: " + sort_date_ary.length);
            sort_date_ary.sort(function (a, b) {
              // Turn your strings into dates, and then subtract them
              // to get a value that is either negative, positive, or zero.
              return a.getTime() - b.getTime();
            });

            // this.trace("k :: " + k);
            // this.trace("k :: " + (k+1));

            balance_list[key].details[k] = {
              "balance": item[k + 1].details.remaining_to_pay,
              "start_date": sort_date_ary[0],
              "end_date": sort_date_ary[order_length - 1],
              "history": k + 1,
              "index": k,
              "paid": item[k + 1].details.paid_amt,
              "total": item[k + 1].details.total_price
            }
            // }
            // balance_list[key]['package' + history].remaining = {
            //   "balance": this._service.userList[key].history[history].details.remaining_to_pay,
            //   "start_date": sort_date_ary[0],
            //   "end_date": sort_date_ary[order_length - 1],
            //   "history":history
            // }
          }
          balance_list[key]['remaining'] += item[history].details.remaining_to_pay;
          // console.log("balance :: " + balance_list[key]['remaining'])
        } catch (e) {
          console.log("Error :: " + key);
        }
        tmpName = balance_list[key]['name'];
      }
      //remove the last entry if the balanace amout is 0.
      if (balance_list[key]['remaining'] == 0) this.balance_list.pop();
    }
    // debugger;
    console.log(this.balance_list);
    this.list = balance_list;
  }


  pay_click_action(evt) {

    this.overlay = true;
    // this.trace("id :: " + evt.currentTarget.id);
    let _tmp = evt.currentTarget.id.split("_");
    this.current_target_index = _tmp[1] * 1;
    this.current_target_history_id = _tmp[2] * 1;
    // this.trace(this.balance_list[this.current_target_index].details[this.current_target_history_id - 1]);
    this.priceVal = this.balance_list[this.current_target_index].details[this.current_target_history_id - 1].balance
  }

  overlayClickHandler(): void {
    console.log("overlayClickHandler");
    (this.overlay) ? this.overlay = false : this.overlay = true;

  }

  modalSaveAction() {
    console.log("modalSaveAction");

    this.packageData = this.balance_list[this.current_target_index].details[this.current_target_history_id - 1];
    // debugger;
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

    // this.trace("status :: " + status);
    // debugger;
    this.firebase.packageInfoUpdate(this.balance_list[this.current_target_index].mobile, this.packageData.history,
      {
        "total_price": this.packageData.total,
        "paid_amt": paid,
        "remaining_to_pay": remaining,
        "paid_status": status
      }, () => {
        (this.overlay) ? this.overlay = false : this.overlay = true;
        // this.trace("package updated");
        this.packageData.balance = remaining;
        this.packageData.paid += remaining;
        // debugger;
        this._changeDet.detectChanges();
        // this.renderList();
      });

    this.firebase.packagePaidHistoryUpdate(this.balance_list[this.current_target_index].mobile, this.packageData.history, this.priceVal, () => {
      this._changeDet.detectChanges();
    });

    let content = "";
    if (remaining == 0) {
      content = "Your payment of Rs." + paid + " is recieved by our delivery agent. Thank you!\nwww.thinkspot.in\n7200015551";
    } else if (remaining < 0) {
      content = "Your payment of Rs." + paid + " is recieved by our delivery agent and you have Rs." + remaining + " in your account. Thank you!\nwww.thinkspot.in\n7200015551";
    } else if (remaining > 0) {
      content = "Your payment of Rs." + paid + " is recieved by our delivery agent and you have Rs." + remaining + " remaining to pay. Thank you!\nwww.thinkspot.in\n7200015551";
    }
  }

  modalCancelAction() {
    (this.overlay) ? this.overlay = false : this.overlay = true;
  }
}
