import { Component, OnInit, ChangeDetectorRef, OnDestroy, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireDatabase } from 'angularfire2/database';
import { FireBase } from 'src/app/utils/firebase';
import { DateUtils } from 'src/app/utils/date-utils';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { CommonsService } from 'src/app/services/commons.service';
import { StorageService } from 'src/app/utils/storage.service';
import { Ng2SearchPipe } from 'ng2-search-filter';
import { Utils } from 'src/app/utils/utils';
import * as $ from 'jquery';
import * as moment from 'moment/moment';

@Component({
  selector: 'delivery-list',
  templateUrl: './delivery-list.component.html',
  styleUrls: ['./delivery-list.component.scss']
})

export class DeliveryListComponent implements OnInit, OnDestroy {
  trace: any = console.log;
  firebase: FireBase;
  mobile: string;
  name: string;
  list: Array<any> = [];
  listObservable: any;
  selectedIndex: number = NaN;
  selectedTarget: any;

  date_utils: DateUtils;
  todaysDate: any;
  todaysDateFormatted: any;
  listFlg: boolean = true;
  sub: any;
  deliveredStatus: string = "Delivered";
  deliveredFlg: boolean = false;
  //subscribers from firebase
  orders_subscriber: any;
  userListUpdateObservable: any;

  undelivered_list: Array<any> = [];
  delivered_list: Array<any> = [];

  total_deliveries: number = 0;
  total_undelivered: number = 0;
  total_delivered: number = 0;
  tab_index: any = 0;

  collected_amt: number = 0;
  paid_customers_list: Array<Object> = [];
  search_ary: Array<any> = [];
  target_ary: Array<any> = [];

  overlay: boolean = false;
  priceVal: number = 0;

  user_data: any;

  tc_selection: boolean = false;
  rtp: number = 0;
  packageData: any;

  sortVals: Array<any> = ["Apartment", "Block"];

  orange_count: number = 0;
  green_count: number = 0;

  products: any = {};
  address: any = {};
  users: any = [];

  prev_target: any = 0;
  cashbacks: any = {};
  data: any;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private db: AngularFireDatabase,
    private changeDet: ChangeDetectorRef,
    private _router: Router,
    private _service: CommonsService,
    private _storage: StorageService,
    private ng2: Ng2SearchPipe,
    private _ngZone: NgZone,
    private _commons: CommonsService,
    private _changeDet: ChangeDetectorRef,
    private _utils: Utils,
    private _dateUtils: DateUtils
  ) {
    this.firebase = new FireBase(this.db);
    this.date_utils = new DateUtils();
  }

  ngOnInit() {
    if (this._storage.readData("tabindex"))
      this.tab_index = this._storage.readData("tabindex") * 1;
    // this.trace("this.tab_index :: " + this.tab_index);

    this.sub = this._activatedRoute.paramMap.subscribe(params => {
      this.mobile = params.get('mobile');
      this.name = params.get('name');
    });

    // let todayTime = new Date().getHours();
    // if (todayTime <= 15) {
    //   this.todaysDate = new Date();
    //   this.todaysDate = this.date_utils.getDateString(this.todaysDate, "");
    // } else {
    this.todaysDate = new Date();
    this.todaysDate = this.date_utils.getDateString(this.date_utils.addDaysToCalendar(this.todaysDate, 1), "");
    // }
    this.renderList();
  }

  renderList() {
    // this.trace("renderList");
    this._service.readCustomerList(false);
    // this.userListUpdateObservable = this._service.onUserListUpdate.subscribe((user_data) => {
    // this.user_data = user_data;
    this.todaysDateFormatted = this.date_utils.dateFormater(this.todaysDate, "-");

    this.listObservable = this.firebase.readDailyOrders(this.todaysDate).subscribe((data: any) => {
      // console.log(data);
      this.data = data;
      this.listFlg = false;
      let index = 0;

      //reset both arrays
      this.undelivered_list = [];
      this.delivered_list = [];
      this.total_deliveries = 0;
      this.total_delivered = 0;
      this.total_undelivered = 0;

      this.products = {};

      this.address = {};

      this.users = Object.keys(data);

      for (let key in data) {
        this.products[key] = [];
        this.address[key] = [];
        this.cashbacks[key] = 0;
        debugger;
        for (var item in data[key]) {
          index++;

          if (item == "address") {
            this.address[key] = JSON.parse(data[key]['address']);
            // debugger;
          }
          // debugger;

          if (item != 'address') {
            // console.log("item :: " + item);
            if (item == 'bag') {
              let _data = data[key]['bag'];

              for (let _items in _data) {
                console.log("items :: " + _items);

                let deliveryFlg = (_data.delivery_status == "Delivered") ? true : false;
                this.deliveredStatus = (deliveryFlg) ? "Done" : "Delivered";

                _data.assigned_to = "Bala";
                if (_data.assigned_to == this.name) {
                  //   // debugger;
                  let _product = {};

                  if (_items != "address") {
                    for (var key1 in _data[_items]) {
                      if (key1 != "assigned_to") {

                        if (key1 == 'others') {
                          // debugger;
                          this.cashbacks[key] += Number(_data[_items][key1].cashback);
                        }

                        if (key1 != 'others') {
                          for (let val in _data[_items][key1]) {
                            _product = {
                              name: _data[_items][key1][val].name,
                              nut_variety: _data[_items][key1][val]["category"],
                              per_day: _data[_items][key1][val].weight + " " + _data[_items][key1][val]["unit_name"],
                              category: _data[_items][key1][val]["category"],
                              p_id: _data[_items][key1][val]["id"],
                              timestamp_id: _items
                            }
                            this.products[key].push(_product);
                          }
                        }
                      }
                    }
                  }
                }
              }
            }

            if (item == 'milk' || item == 'tender') {

              let _data = data[key][item];
              let deliveryFlg = (_data.delivery_status == "Delivered") ? true : false;
              this.deliveredStatus = (deliveryFlg) ? "Done" : "Delivered";

              _data.assigned_to = "Bala";

              if (_data.assigned_to == this.name) {
                //   // debugger;
                let _product = {};

                // debugger;
                _product = {
                  name: data[key][item].name,
                  nut_variety: data[key][item]["nut_variety"] + " - " + data[key][item]['original_weight'] + "" + data[key][item]['unit_name'],
                  per_day: data[key][item]["per_day"],
                  category: "subs"
                }
                this.products[key].push(_product);
              }
            }

            if (item == "greens") {
              // debugger;
              let _data = data[key][item];
              let deliveryFlg = (_data.delivery_status == "Delivered") ? true : false;
              this.deliveredStatus = (deliveryFlg) ? "Done" : "Delivered";

              _data.assigned_to = "Bala";

              if (_data.assigned_to == this.name) {
                let _product = {};

                for (let _greens in data[key][item]['data']) {
                  // debugger;
                  _product = {
                    name: data[key][item]['data'][_greens].name[0],
                    nut_variety: 'greens',
                    per_day: data[key][item]['data'][_greens]["count"],
                    category: "subs"
                  }
                  this.products[key].push(_product);
                }
              }
            }
          }

          // let _data = data[key].tender;
          // let _data = data[key][item];
          // // console.log(_data);
          // // this.trace(_data);
          // let deliveryFlg = (_data.delivery_status == "Delivered") ? true : false;
          // this.deliveredStatus = (deliveryFlg) ? "Done" : "Delivered";

          // _data.assigned_to = "Bala";
          // if (_data.assigned_to == this.name) {
          //   // debugger;
          //   let _product = {};
          //   if (item != 'bag') {
          //     _product = {
          //       name: data[key][item].name,
          //       nut_variety: data[key][item].nut_variety,
          //       per_day: data[key][item].per_day
          //     }
          //     this.products[key].push(_product);

          //   } else if (item == 'bag') {
          //     // console.log(data[key][item]);
          //     for (var key1 in data[key][item]) {
          //       // console.log(key1);
          //       if (key1 != "assigned_to") {
          //         // debugger;
          //         _product = {
          //           name: data[key][item][key1].name,
          //           nut_variety: data[key][item][key1]["category"],
          //           per_day: data[key][item][key1].weight + " " + data[key][item][key1]["unit_name"]
          //         }
          //         this.products[key].push(_product);
          //       }
          //     }
          //   }

          //   if (item != 'bag')
          //     this.address[key] = JSON.parse(data[key][item]['address']);
          //   else {
          //     // debugger;
          //     for (var i = 0; i < Object.keys(data[key][item]).length; i++) {
          //       // console.log("i :: " + i);
          //       if (Object.keys(data[key][item])[i] != "assigned_to") {
          //         this.address[key] = data[key][item][Object.keys(data[key][item])[0]].address;
          //         break;
          //       }
          //     }
          //   }

          // this.total_deliveries += _data.per_day;

          // debugger;
          // let addr = JSON.parse(_data.address);
          // // let updated_address = addr.street;
          // let updated_address = addr.building + ", " + addr.block + ", " + addr.floor + ", " + addr.door;

          // debugger;
          // if (_data.nut_variety == "orange" || _data.nut_variety == "Orange") this.orange_count += _data.per_day;
          // else this.green_count += _data.per_day;

          // this.trace(user_data[key].history[history_len].notes);
          // this.trace("--------------------");

          // debugger;
          // if (!deliveryFlg) {
          //   this.total_undelivered += (_data.per_day + (_data.replacement * 1 || 0));
          //   this.undelivered_list.push({
          //     [_data.name]: {
          //       'name': addr.name,
          //       'no': key,
          //       'apartment': addr.apartment,
          //       'block': addr.block,
          //       'floor': addr.floor,
          //       'door': addr.door,
          //       'area': addr.area,
          //       'delivery_status': deliveryFlg,
          //       'delivery_string': this.deliveredStatus,
          //       'nut_type': _data.nut_variety,
          //       'data': _data,
          //       'address': updated_address,
          //       // 'rtp': user_data[key].history[history_len].details.remaining_to_pay,
          //       // 'paid': user_data[key].history[history_len].details.paid_amt,
          //       // 'instructions': addr.inst,
          //       // "notes": user_data[key].history[history_len].notes
          //     }
          //   });
          // } else {
          //   this.total_delivered += (_data.per_day + (_data.replacement * 1 || 0));
          //   this.delivered_list.push({
          //     [_data.name]: {
          //       'name': addr.name,
          //       'no': key,
          //       'apartment': addr.apartment,
          //       'block': addr.block,
          //       'floor': addr.floor,
          //       'door': addr.door,
          //       'area': addr.area,
          //       'nut_type': _data.nut_variety,
          //       'delivery_status': deliveryFlg,
          //       'delivery_string': this.deliveredStatus,
          //       'data': _data,
          //       'address': updated_address,
          //       // 'rtp': user_data[key].history[history_len].details.remaining_to_pay,
          //       // 'paid': user_data[key].history[history_len].details.paid_amt,
          //       // 'instructions': user_data[key].history[history_len].details.instructions,
          //       // "notes": user_data[key].history[history_len].notes
          //     }
          //   });
          // }
          // }

        }
      }

      this.target_ary = [];
      if (this.tab_index == 0) this.target_ary = this.undelivered_list;
      if (this.tab_index == 1) this.target_ary = this.delivered_list;

      // debugger;

      this.target_ary.sort(compare);
      function compare(a, b) {
        if (a.apartment < b.apartment) {
          return -1;
        }
        if (a.apartment > b.apartment) {
          return 1;
        }
        return 0;
      }

      // this.userListUpdateObservable.unsubscribe();
      this.changeDet.detectChanges();
    });
    // });
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.undelivered_list, event.previousIndex, event.currentIndex);
    // console.log(event.previousIndex, event.currentIndex);
  }

  viewAction(e) {
    // this.selectedIndex = e.currentTarget.id.split("_")[1] * 1;
    // // debugger;
    // if (this.tab_index == 0) this.list = this.undelivered_list;
    // if (this.tab_index == 1) this.list = this.delivered_list;

    // this.selectedTarget = this.target_ary[this.selectedIndex].data;
    // this.selectedTarget.date = this.todaysDate;

    // // this.trace(this.selectedTarget);
    // // debugger;
    // this._router.navigate(['/delivery/view-order/', { data: JSON.stringify(this.selectedTarget) }]);
    // this.ngZone.run(() => console.log("view route."));
  }

  deliveredAction(e) {

    console.log("deliveredAction");

    this.tc_selection = true;
    if (!this.tc_selection) {
      this._commons.openSnackBar("Tick the delivered items.", "");
    } else {
      // if (this.tab_index == 0) this.list = this.undelivered_list;
      // if (this.tab_index == 1) this.list = this.delivered_list;

      this.selectedIndex = e.currentTarget.id.split("_")[1] * 1;
      $('#deliver_' + this.selectedIndex).attr({ 'disabled': 'true' });
      $('#deliver_' + this.selectedIndex).css({ 'pointer-events': 'none' });
      // debugger;
      this.selectedTarget = this.products[this.users[this.selectedIndex]];


      let _check = moment(new Date(), 'YYYY/MM/DD');
      let _month = moment(_check.format('M'), 'MM').format('MMMM');//check.format('M');
      let _day = _check.format('D');
      let _year = _check.format('YYYY');

      // debugger;
      let _past_timestamp = "";
      for (var key in this.products[this.users[this.selectedIndex]]) {
        // console.log(this.products[this.users[this.selectedIndex]][key]);
        // debugger;
        let timestamp = this.products[this.users[this.selectedIndex]][key]["timestamp_id"];
        // console.log("timestamp :: " + timestamp);

        if (timestamp != _past_timestamp) {
          // console.log("called");
          // console.log(this.users[this.selectedIndex], _year, _month, _day, timestamp, "delivered");
          if (this.products[this.users[this.selectedIndex]][key]['category'] != "subs") {
            this.firebase.update_user_history_status(this.users[this.selectedIndex], _year, _month, _day, timestamp, "delivered", () => {

            })
          }
        }
        _past_timestamp = timestamp;
      }

      // debugger;
      if (this.cashbacks[this.users[this.selectedIndex]] != 0) {
        // console.log(this.users[this.selectedIndex]);
        // console.log("--------");

        // debugger;
        this.firebase.readUserInfo("users", String(this.users[this.selectedIndex])).subscribe((data) => {
          let _wallet = data['wallet'] + this.cashbacks[this.users[this.selectedIndex]];
          let _ledger = data['ledger'];
          // debugger;
          // id, obj, callback, pageName
          this.firebase.write_wallet(this.users[this.selectedIndex], { wallet: _wallet, ledger: _ledger }, () => { alert("wallet successfully updated."); }, "delivery-app");
          let type = "Credit";
          this.firebase.write_wallet_history(new Date().getTime(), this.users[this.selectedIndex], { type: type, amt: this.cashbacks[this.users[this.selectedIndex]], razor_id: "" }, () => {
            alert("Cashback successfully credited to your account.");
          })
        });
      }

      // debugger;
      let calbackFlg1 = false;
      let calbackFlg2 = false;
      // debugger;
      this.selectedTarget.delivery_status = "Delivered";
      // update order history
      // this.firebase.update_delivery_status_order(this.selectedTarget.m_no, this.selectedTarget, this.todaysDate, () => {
      //   calbackFlg1 = true;
      //   if (calbackFlg1 && calbackFlg2) {
      //     this.changeDet.detectChanges();
      //     // this.trace("render change1s");
      //   }
      // });
      // // //update user history
      // // // console.log("this.todaysDate :: " + this.todaysDate);
      // this.firebase.update_delivery_status_user_history(this.selectedTarget.m_no, this.selectedTarget.history_id, this.todaysDate, {
      //   delivered: true,
      //   delivered_by: this.selectedTarget.assigned_to
      // }, () => {
      //   calbackFlg2 = true;
      //   if (calbackFlg1 && calbackFlg2) {
      //     this.changeDet.detectChanges();
      //     // this.trace("render changes2");
      //   }
      // });
    }
  }

  tabChanged(evt) {
    this.tab_index = evt.index;
    this._storage.writeData("tabindex", this.tab_index);
    if (this.tab_index == 0) this.target_ary = this.undelivered_list;
    if (this.tab_index == 1) this.target_ary = this.delivered_list;
    // this.trace("this.tab_index  :: " + this.tab_index);
  }

  inputTxtChanged(evt) {
    if (this.tab_index == 0) this.target_ary = this.undelivered_list;
    if (this.tab_index == 1) this.target_ary = this.delivered_list;
    this.target_ary = this.ng2.transform(this.target_ary, evt);
    // console.log(evt);
  }

  sortChange(evt) {
    // this.trace("evt :: " + evt);
    this.target_ary.sort(compare);
    function compare(a, b) {
      if (a.block < b.block) {
        return -1;
      }
      if (a.block > b.block) {
        return 1;
      }
      return 0;
    }
  }

  payAction(e): void {

    // if (this.tab_index == 0) this.list = this.undelivered_list;
    // if (this.tab_index == 1) this.list = this.delivered_list;

    // this.selectedIndex = e.currentTarget.id.split("_")[1] * 1;
    // this.selectedTarget = this.list[this.selectedIndex].data;

    // this.packageData = this.user_data[this.selectedTarget.m_no].history[this.selectedTarget.history_id].details;

    // this.priceVal = this.packageData.remaining_to_pay;

    // (this.overlay) ? this.overlay = false : this.overlay = true;
    // this._ngZone.run(() => { });
  }

  overlayClickHandler(): void {
    // console.log("overlayClickHandler");
    (this.overlay) ? this.overlay = false : this.overlay = true;
  }

  selection_change_handler(evt): void {
    // debugger;
    // console.log("evt.source.id :: " + evt.source.id.split("_"));
    let user_id = evt.source.id.split("_")[2];
    let items_id = evt.source.id.split("_")[1];
    let target_mobile = this.users[user_id]

    // debugger;
    // console.log(evt.checked);
    // console.log(this.products[target_mobile][items_id]);

    this.tc_selection = evt.checked;
    // this._ngZone.run(() => { });
    this.changeDet.detectChanges();
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

    //sort the object and returns the start and end day of the package
    let item = this._utils.sortDateObject(this.user_data[this.selectedTarget.m_no].history[this.selectedTarget.history_id], this.date_utils);

    let dates = this.user_data[this.selectedTarget.m_no].history[this.selectedTarget.history_id].dates;

    let details = {
      "start_date": item.start_date.toDateString(),
      "end_date": item.end_date.toDateString(),
      "count": dates[Object.keys(dates)[0]].count,
      "total_days": this.packageData.no_of_days,
      "paid": this.packageData.paid_amt,
      "remaining": this.packageData.remaining_to_pay,
      "total": this.packageData.total_price,
      "product_name": this.selectedTarget.name
    }

    this.firebase.packageInfoUpdate(this.selectedTarget.m_no, this.selectedTarget.history_id,
      {
        "total_price": this.packageData.total_price,
        "paid_amt": paid,
        "remaining_to_pay": remaining,
        "paid_status": status
      }, () => {
        // debugger;
        this._changeDet.detectChanges();
        this.renderList();
      });

    this.firebase.packagePaidHistoryUpdate(this.selectedTarget.m_no, this.selectedTarget.history_id, this.priceVal, () => {
      this._changeDet.detectChanges();
    });

    let content = "";
    if (remaining == 0) {
      content = `Dear Customer!\nThank you for your payment of Rs.${this.priceVal} towards your ${details.count}x${details.total_days} days of ${details.product_name} subscription from ${details.start_date} to ${details.end_date}.\nStay Healthy!\nwww.thinkspot.in`;
    } else if (remaining < 0) {
      content = `Dear Customer!\nThank you for you payment of Rs.${this.priceVal} towards your order total of Rs.${details.total} for ${details.count}x${details.total_days} days of ${details.product_name} subscription from ${details.start_date} to ${details.end_date}. Kindly collect the balance of Rs.${Math.abs(remaining)} on your next delivery. Thank you.\nStay Healthy!\nwww.thinkspot.in`;
    } else if (remaining > 0) {
      content = `Dear Customer!\nThank you for you payment of Rs.${this.priceVal} towards your order total of Rs.${details.total} for ${details.count}x${details.total_days} days of ${details.product_name} subscription from ${details.start_date} to ${details.end_date}. Kindly pay the balance of Rs.${remaining} on your next delivery. Thank you.\nStay Healthy!\nwww.thinkspot.in`;
    }
    // this.trace(content);
    // console.log("this.mobile  :: " + this.data.m_no);
    // this._service.send_bulk_sms({
    //   'mobile_nos': [this.selectedTarget.m_no],
    //   'fName': "",
    //   'content': content
    // }, () => { });
  }

  modalCancelAction() {
    (this.overlay) ? this.overlay = false : this.overlay = true;
  }

  onUserClick(evt, target) {
    $('#box_' + this.prev_target).css({ "display": "none" });
    $('#box_' + target).css({ "display": "block" });
    this.prev_target = target;
  }

  ngOnDestroy(): void {
    this.listObservable.unsubscribe();
    this.sub.unsubscribe();
  }

}
