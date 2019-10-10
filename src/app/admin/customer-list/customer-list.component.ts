import { Component, OnInit, NgZone, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonsService } from 'src/app/services/commons.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { DateUtils } from 'src/app/utils/date-utils';
import { Ng2SearchPipe } from 'ng2-search-filter';
import { FireBase } from 'src/app/utils/firebase';
import { AngularFireDatabase } from 'angularfire2/database';

@Component({
  selector: 'customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerListComponent implements OnInit, OnDestroy {

  userList: Array<any> = [];
  searchText: string = "";
  //contains the pipe returned data
  searchAry: Array<any> = [];

  todaysDate: any;

  checkedCnt: number = 0;
  customers: Array<any> = [];
  //customer status
  active: boolean = false;
  //customer's remaining orders
  remainingDays: number = 0;

  //active customers
  activeCustomers: Array<any> = [];
  //inactive customer
  inActiveCustomers: Array<any> = [];

  orderStatus: string = "";
  assignBtnFlg: boolean = true;

  delivery_boys_list: any;
  selected_delivery_boy: string = "nil";

  readDataObservable: any;
  userListObservable: any;
  userListUpdateObservable: any;
  msgBtnSubscriber: any;

  checkboxSelectors: CustomSelctors = {
    all: false,
    active: false,
    inactive: false
  }
  overlay: boolean = false;

  private firebase: FireBase;

  constructor(
    private _service: CommonsService,
    private _router: Router,
    public dialog1: MatDialog,
    private ngZone: NgZone,
    private date_utils: DateUtils,
    private ng2: Ng2SearchPipe,
    private _db: AngularFireDatabase,
    private _changeDet: ChangeDetectorRef
  ) {
    this.firebase = new FireBase(this._db);
    // console.log("customer list class");
    this._service.readCustomerList(false);
  }

  ngOnInit() {
    // console.log("customer list class :: oninit");
    // debugger;
    let trace = console.log;
    //todays time in hours(24 hr format)
    let todayTime = new Date().getHours();
    if (todayTime <= 11) {
      this.todaysDate = new Date();
    } else {
      this.todaysDate = new Date();
      this.todaysDate = this.date_utils.getDateString(this.date_utils.addDays(this.todaysDate, 1), "");
    }

    // this.userListObservable = this.firebase.readDeliverBoys().subscribe((data: any) => {
    //   var index = -1;
    //   for (let key in data) {
    //     index++;
    //     this.delivery_boys_list.push(data[key]);
    //   }
    // });

    this._service.deliveryBoysUpdate.subscribe(() => {
      this.delivery_boys_list = this._service.delivery_boys_list;
    });

    this.userListUpdateObservable = this._service.onUserListUpdate.subscribe((data) => {
      let trace = console.log;
      this.userList = [];
      let sort_date_ary = [];
      // debugger;

      for (let key in data) {
        data[key].mobile = key;
        data[key].checked = false;

        sort_date_ary = [];
        try {

          data[key].start_date = new Date();
          data[key].end_date = new Date();

          data[key].active = "expired/others";
          this.orderStatus = "in-active";
          data[key].remainingDays = 0;

          //history length
          let len = Object.keys(data[key].history).length;

          //orders length
          let order_length = Object.keys(data[key].history[len].dates).length - 1;
          data[key].active = "active";
          this.orderStatus = "active";

          let cnt = 0, _len = data[key].history[len].dates, postponedCnt = 0, todayIndex = 0;

          let tmp = Object.keys(data[key].history[len].dates);
          for (let j = 0; j <= order_length; j++) {
            sort_date_ary.push(new Date(this.date_utils.stdDateFormater(this.date_utils.dateFormater(tmp[j], "-"), "/")));
          }

          // /* Do sort the dates array */
          sort_date_ary.sort(function (a, b) {
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return a.getTime() - b.getTime();
          });

          let startDate = sort_date_ary[0];
          let lastDeliveryDate = sort_date_ary[order_length];

          let _diff = this.date_utils.dateDiff(new Date(), lastDeliveryDate);

          if (_diff < 0) data[key].active = "expired/others";

          let diff = this.date_utils.dateDiff(startDate, lastDeliveryDate);
          let diff_start_current = this.date_utils.dateDiff(new Date(), startDate);
          // debugger;


          // data[key].history[len].dates.sort();
          for (let date in data[key].history[len].dates) {
            if (data[key].history[len].dates[date].index == "postponed") {
              postponedCnt++;
            }
          }

          console.log(key + " : " + _diff);
          // if (key == "6382009070") debugger;
          // trace("postpooned cnt :: " + postponedCnt);
          if (_diff > -1) {
            // data[key].remainingDays = (diff - postponedCnt);
            data[key].remainingDays = Math.abs(_diff);
            data[key].package = diff;
            data[key].rtp = data[key].history[len].details.remaining_to_pay;
            data[key].start_date = startDate;
            data[key].end_date = lastDeliveryDate;
          } else {
            data[key].active = "expired";
          }

          if (_diff == 0) {
            data[key].active = "done";
          }

        } catch (e) { }
        this.userList.push(data[key]);
      }
      this.searchAry = this.userList;
      // this.ngZone.run(() => this._router.navigate(['customer_list']));
      // this.ngZone.run(() => console.log("ng on init."));
      this._changeDet.detectChanges();

    });

    // debugger;
    // console.log(this._service.sendCustomerMsg.observers.length);
    // trace("**************");
    if (this._service.sendCustomerMsg.observers.length == 0) {
      this._service.sendCustomerMsg.subscribe(() => {
        console.log("message btn clicked.");
        (this.overlay) ? this.overlay = false : this.overlay = true;
        console.log("this.overlay :: " + this.overlay);
      });
    }
  }

  onCustomerClick(evt, index, mobile) {
    let trace = console.log;
    trace("customer view");
    // this.userList[index].checked = (this.userList[index].checked) ? false : true;
    this.searchAry[index].checked = (this.searchAry[index].checked) ? false : true;

    if (this.searchAry[index].checked) this.assignBtnFlg = false;

    this.checkedItemCnt();
    // trace(this.checkedCnt, this.userList.length);
    if (this.checkedCnt == this.userList.length) {
      this.checkboxSelectors['all'] = true;
    } else {
      this.checkboxSelectors['all'] = false;
    }

    if (evt.target.innerText == "View") {
      // console.log("book an order");
      // debugger;
      this.bookAnOrder(mobile, this.searchAry[index].active, this.searchAry[index].name, this.searchAry[index].start_date.toDateString(), this.searchAry[index].end_date.toDateString());
    }
    // return false;
  }

  inputTxtChanged(evt) {
    // console.log(evt);
    this.searchText = evt;
    this.searchAry = this.ng2.transform(this.userList, this.searchText);
    // this.renderSearchList(this.searchAry, false);
    // let data = this._service.userList;
    // https://stackblitz.com/edit/angular-search-filter

    this.checkboxSelectors['active'] = false;
    this.checkboxSelectors['all'] = false;
    this.checkboxSelectors['inactive'] = false;
  }

  bookAnOrder(mobile, status, name, startDate, endDate) {
    // debugger;
    this._router.navigate(['/admin/customer_view/' + Date.now(), { mobile: mobile, status: status, name: name, start: startDate, end: endDate }]);
  }

  assign() {
    // console.log("Assign deliveries.");
    this.assignBtnFlg = true;
    let modifiedData = [];
    // debugger;
    let _date = this.date_utils.dateFormater(this.todaysDate, "");
    // console.log("datre :: " + _date);
    this.readDataObservable = this.firebase.readDailyOrders(_date).subscribe((data) => {
      this.assignBtnFlg = false;
      // debugger;

      for (let key in this.searchAry) {
        if (this.searchAry[key].active == "active" && this.searchAry[key].checked) {

          let tmp = JSON.parse(data[this.searchAry[key].mobile].tender);
          tmp.assigned_to = this.selected_delivery_boy;
          modifiedData[this.searchAry[key].mobile] = tmp;

          //write orders
          this.firebase.writeDailyOrders(this.searchAry[key].mobile, _date, JSON.stringify(tmp));
          // console.log();
          //write user history orders
          // Object.keys(data[key].history).length
          this.firebase.update_user_info(this.searchAry[key].mobile, _date, Object.keys(this.searchAry[key].history).length, this.selected_delivery_boy);
          this.assignBtnFlg = true;
        }
      }

      try {
        this.readDataObservable.unsubscribe();
      } catch (e) {

      }
    }, (err) => {
      console.log("customer list :: read error.");
    });
  }

  checkedItemCnt() {
    this.checkedCnt = 0;
    for (let i = 0; i < this.userList.length; i++) {
      if (this.userList[i].checked) {
        this.checkedCnt++;
      }
    }
  }

  onAllClick(e) {
    this.checkboxSelectors['all'] = e.checked;
    // for (let i = 0; i < this.userList.length; i++) {
    //   this.userList[i].checked = e.checked;
    // }

    for (let i = 0; i < this.searchAry.length; i++) {
      this.searchAry[i].checked = e.checked;
    }

    // this.searchAry = this.userList;
    if (e.checked) {
      this.renderSearchList(this.searchAry, true);
    } else {
      this.renderSearchList(this.searchAry, false);
    }
  }

  onActiveClick(e) {
    this.checkboxSelectors['active'] = true;
    this.checkboxSelectors['inactive'] = false;

    if (this.checkedCnt != this.userList.length) {
      this.checkboxSelectors['all'] = false;
    }
    if (e.checked) {
      this.searchText = "active";
      this.searchAry = this.ng2.transform(this.userList, this.searchText);
      // this.renderSearchList(this.searchAry, true);
    } else {
      this.searchText = "";
      this.searchAry = this.userList;
      // this.renderSearchList(this.searchAry, false);
    }
  }

  onAInactiveClick(e) {
    // console.log("in  active");
    this.checkboxSelectors['active'] = false;
    this.checkboxSelectors['inactive'] = true;

    if (this.checkedCnt != this.userList.length) {
      this.checkboxSelectors['all'] = false;
    }

    if (e.checked) {
      this.searchText = "expired";
      this.searchAry = this.ng2.transform(this.userList, this.searchText);
      // this.renderSearchList(this.searchAry, true);
    } else {
      this.searchText = "";
      this.searchAry = this.userList;
      // this.renderSearchList(this.searchAry, false);
    }
  }

  renderSearchList(ary, flg) {
    if (ary.length != 0) {
      for (let i = 0; i < ary.length; i++) {
        ary[i].checked = flg;
      }
    }

    if (flg) {
      this.assignBtnFlg = false;
    } else {
      this.assignBtnFlg = true;
    }
  }

  onDeliveryBoyChange(evt): void {
    // console.log(evt.value);
    this.selected_delivery_boy = evt.value;
  }

  overlayClickHandler() {
    (this.overlay) ? this.overlay = false : this.overlay = true;
  }

  sendMessageCancelAction() {
    (this.overlay) ? this.overlay = false : this.overlay = true;
  }

  sendMessageAction(val) {
    // (this.overlay) ? this.overlay = false : this.overlay = true;
    let trace = console.log;
    let selected: Array<string> = [];
    for (let i = 0; i < this.userList.length; i++) {
      if (this.userList[i].checked) {
        // debugger;
        this.checkedCnt++;
        selected.push(this.userList[i].mobile);
      }
    }
    // trace(selected);
    // trace("**********");
    this._service.send_bulk_sms({
      'mobile_nos': selected,
      'fName': 'Benny',
      'content': val.value
    });
    (this.overlay) ? this.overlay = false : this.overlay = true;
  }

  ngOnDestroy(): void {
    console.log("ng destroy");
    // this.userListObservable.unsubscribe();
    this.userListUpdateObservable.unsubscribe();
    // this.msgBtnSubscriber.unsubscribe();
    try {
      this.readDataObservable.unsubscribe();
    } catch (e) {

    }
    // throw new Error("Method not implemented.");
  }
}


interface CustomSelctors {
  all: boolean,
  active: boolean,
  inactive: boolean
}

