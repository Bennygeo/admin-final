import { Component, OnInit, NgZone, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
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

  delivery_boys_list: Array<string> = [];
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
  overlay:boolean = true;

  private firebase: FireBase;

  constructor(
    private _service: CommonsService,
    private _router: Router,
    public dialog1: MatDialog,
    private ngZone: NgZone,
    private date_utils: DateUtils,
    private ng2: Ng2SearchPipe,
    private _db: AngularFireDatabase,
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

    this.userListObservable = this.firebase.readDeliverBoys().subscribe((data: any) => {
      var index = -1;
      for (let key in data) {
        index++;
        this.delivery_boys_list.push(data[key]);
      }
    });

    this.userListUpdateObservable = this._service.onUserListUpdate.subscribe((data) => {
      let trace = console.log;
      this.userList = [];
      for (let key in data) {
        data[key].mobile = key;
        data[key].checked = false;

        try {
          data[key].active = "expired/others";
          this.orderStatus = "in-active";
          data[key].remainingDays = 0;
          //history length
          let len = Object.keys(data[key].history).length;
          // trace("history len :: " + len);
          //orders length
          // let ordersLen = Object.keys(data[key].history[len].dates).length + 1;
          // trace("ordersLen :: " + ordersLen);
          data[key].active = "active";
          this.orderStatus = "active";

          let cnt = 0, _len = data[key].history[len].dates, postponedCnt = 0, todayIndex = 0;

          let lastDeliveryDate = Object.keys(data[key].history[len].dates).sort()[Object.keys(data[key].history[len].dates).length - 1];
          let __date = this.date_utils.dateFormater(lastDeliveryDate, "-");
          let diff = this.date_utils.dateDiff(new Date(), new Date(this.date_utils.stdDateFormater(__date, "/")));
          // debugger;

          // data[key].history[len].dates.sort();
          for (let date in data[key].history[len].dates) {
            if (data[key].history[len].dates[date].index == "postponed") {
              postponedCnt++;
            }
          }

          // trace("postpooned cnt :: " + postponedCnt);
          if (diff > 0) {
            // data[key].remainingDays = (diff - postponedCnt);
            data[key].remainingDays = (diff);
          } else {
            // this.orderStatus = "in-active";
            data[key].active = "expired";
            // trace("in activbe");

          }
          // trace("diff :: " + diff);
          // trace("postponedCnt :: " + postponedCnt);
          // trace("key :: " + key);
          // trace("data[key].remainingDays :: " + data[key].remainingDays);
        } catch (e) { }
        this.userList.push(data[key]);
      }
      this.searchAry = this.userList;
      // this.ngZone.run(() => this._router.navigate(['customer_list']));
      this.ngZone.run(() => console.log("ng on init."));
    });

    // debugger;
    // console.log(this._service.sendCustomerMsg.observers.length);
    // trace("**************");
    if (this._service.sendCustomerMsg.observers.length == 0) {
      this._service.sendCustomerMsg.subscribe(() => {
        console.log("message btn clicked.");
        let selected: Array<string> = [];
        for (let i = 0; i < this.userList.length; i++) {
          if (this.userList[i].checked) {
            // debugger;
            this.checkedCnt++;
            selected.push(this.userList[i].mobile);
          }
        }
        trace(selected);
        trace("**********");
        // this._service.send_bulk_sms({
        //   'mobile_nos': ['9486140936','8072129358'],
        //   'fName':'Benny'
        // });
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
      this.bookAnOrder(index, mobile, this.searchAry[index].active, this.searchAry[index].name);
    }
    return false;
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

  bookAnOrder(index, mobile, status, name) {
    // console.log("bookAnOrder");
    // customer_view
    // this._router.navigate([{ outlets: { dialogeOutlet: null } }]);
    // console.log("index :: " + index);
    this._router.navigate(['/admin/customer_view/' + Date.now(), { mobile: mobile, index: index, status: status, name: name }]);
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

      for (let key in this.searchAry) {
        if (this.searchAry[key].active == "active" && this.searchAry[key].checked) {

          // debugger;
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

  ngOnDestroy(): void {
    console.log("ng destroy");
    this.userListObservable.unsubscribe();
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

