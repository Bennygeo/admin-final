import { Component, OnInit, ChangeDetectorRef, Input, Output, EventEmitter, HostListener, OnDestroy, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonsService } from 'src/app/services/commons.service';
import { FireBase } from 'src/app/utils/firebase';
import { AngularFireDatabase } from 'angularfire2/database';
import { Utils, NuType } from 'src/app/utils/utils';
import { DateUtils } from 'src/app/utils/date-utils';
import { DaterangePickerComponent } from 'ng2-daterangepicker';

@Component({
  selector: 'app-customer-view',
  templateUrl: './customer-view.component.html',
  styleUrls: ['./customer-view.component.scss']
})

export class CustomerViewComponent implements OnInit, OnDestroy {


  /*
  * Tender types
  */
  types: Array<string> = ["Medium", "Large"];
  type: string;

  /*
  * discount price
  */
  discount: number = 5;

  priceWithoutDiscount: number = 0;

  /*
  * Straw price and flags
  */
  strawPrice: number = 2;
  strawFlag: boolean = false;

  /*
  * Subscription flags
  */
  subsFlag: boolean = true;
  subsBtnVisibility: boolean = true;
  customSubsBtnVisibility: boolean = true;

  /*
  * Straw price and flags
  */
  changeDetecter: boolean = false;

  totalPrice: number = 0;
  originalPrice: number = 0;
  offerPrice: number = 0;

  addToCartBtnDisabled: boolean = false;
  /*
  * Nut type
  */
  nutType: string = "Large";
  nutTypes: Array<NuType>;

  nutVarieties: Array<string> = ["Water", "Hard", "Orange"];
  selectedNutVariety: string;
  /*
  * delivery charges
  */
  deliveryCharges: number = 10;
  selectedNutType: string;// = this.nutTypes[0]["value"];
  price: number;// = this.nutTypes[0]["price"];
  minCount: number;// = this.nutTypes[0]["minCount"];
  /*
  * total number of units per day
  */
  unitsPerDay: number;// = this.nutTypes[0]["minCount"];
  editedUnitsPerDay: number;// = this.nutTypes[0]["minCount"];
  /*
  * Subscribed days
  */
  subscribedDays = 1;

  tenderDetails: Object;

  weekdays: Array<string>;
  selectedDays: Object;
  packageOptions: Object;
  priceOption: number;

  subscribeActiveFlgs: Object;
  subscribe_type: string = "std";
  subscribeVisibilityFlg: boolean = false;
  diff: number = 0;

  start_date: Date;
  end_date: Date;
  firebase: FireBase;

  //orders;
  orders: Array<any>;
  order_start_date: any;
  order_end_date: any;
  historyObj: Object = {};
  orderInfo: Object = {};
  msg: string;
  btnsView: boolean = false;
  ordersExist: boolean = true;

  start_d: any;
  end_d: any;

  mobile: any;
  status: any;
  c_name: any;

  selectedDateItem: any;
  selectedDateIndex: number = 0;
  editEnabled: boolean = false;

  postponeEnabled: boolean = false;
  noOfDaysToPostpone: number = 1;

  noOfReplacements: number = 0;
  delivery_boys_list: Array<string> = [];
  assigned_to: string = 'nil';
  assigned_to_index: number = -1;
  delivered_by: string = 'nil';
  dayExpired: boolean = false;

  //delete
  stopEnabled: boolean = false;

  infoEnabled: boolean = true;
  total_nut_cnt: number = 0;
  pay_status: string = "";
  paid_history: Array<any> = [];
  _route_index: any;

  sub: any;
  orders_subscriber: any;
  delete_subscriber: any;
  delete_orders_subscriber: any;
  sendMsgBtnFlg: boolean = false;
  trace: any;
  // save_btn_flg:boolean = true;


  // http://www.daterangepicker.com/#options
  //Date range picker properties
  public daterange: any = {};
  public options: any = {
    locale: { format: 'DD-MM-YYYY' },
    startDate: "27-11-2019",
    minDate: "27-11-2019",
    endDate: "30-11-2019",
    maxDate:'27-12-2019',
    showDropdowns:false,
    showWeekNumbers:false,
    showCustomRangeLabel:false,
    opens:'center',
    drops:'up',
    singleDatePicker:false,
    alwaysShowCalendars: false,
  };
  public rangepicker_data: any = {};

  //customer msg
  customerMsgFlag: boolean = true;
  warn_msg_info: string = "..";
  warn_msg_to_pay: string = "";

  constructor(
    private _service: CommonsService,

    private _utils: Utils,
    private date_utils: DateUtils,
    private db: AngularFireDatabase,
    private _activatedRoute: ActivatedRoute,
    private _changeDet: ChangeDetectorRef,
    private _ngZone: NgZone,
    private _router: Router
  ) {

    this.nutTypes = this._service.nutTypes;

    this.selectedNutType = this.nutTypes[0]["value"];
    this.price = this.nutTypes[0]["price"];
    this.minCount = this.nutTypes[0]["minCount"];
    /*
    * total number of units per day
    */
    this.unitsPerDay = this.nutTypes[0]["minCount"];
    this.editedUnitsPerDay = this.nutTypes[0]["minCount"];

    this.type = this.types[0];
    this.weekdays = this._utils.weekdays.slice(this._utils.todayNo + 1, 7).concat(this._utils.weekdays.slice(0, this._utils.todayNo + 1));
    this.selectedDays = {
      "1": 1, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0
    }

    this.subscribeActiveFlgs = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0
    }
    this.selectedNutVariety = this.nutVarieties[0];
    this.date_utils = new DateUtils();
    this.start_date = new Date();
    this.firebase = new FireBase(this.db);
    this.orders = [];

    this.trace = console.log;
    // this.daterangepickerOptions.skipCSS = true;
  }

  ngOnInit() {
    // this.delivery_boys_list = this._service.deliveryBoysList;
    this.packageOptions = {
      "pack7": this.price - this.discount + this.deliveryCharges + ((this.strawFlag) ? 2 : 0),
      "3andmore": this.price - this.discount + this.deliveryCharges + ((this.strawFlag) ? 2 : 0),
      "std": this.price + this.deliveryCharges + ((this.strawFlag) ? 2 : 0),
    }

    /*
    * write the initial pack
    */
    this.priceOption = this.packageOptions["std"];
    this.renderChanges();

    this.firebase.readDeliverBoys().subscribe((data: any) => {
      let index = -1;
      for (let key in data) {
        index++;
        this.delivery_boys_list[index] = data[key];
      }
    });

    this.sub = this._activatedRoute.paramMap.subscribe(params => {
      // this.trace("params subscriber");
      this.mobile = params.get('mobile');
      this.status = params.get('status');
      this.c_name = params.get('name');
      this.start_d = params.get('start');
      this.end_d = params.get('end');
      // this._route_index = params.get('index');

      // console.log("this.mobile :: " + this.mobile);
      this.orders_subscriber = this.firebase.readOrders(this.mobile).subscribe((data: any) => {
        // debugger;
        // console.log("this.orders_subscriber.unsubscribe();");

        //todays time in hours(24 hr format)
        let todayTime = new Date().getHours();

        try {
          this._service.historyLength = Object.keys(data).length || 0;
        } catch (e) {
          this._service.historyLength = 0;
        }

        // this.trace("todayTime :: " + todayTime);
        // debugger;
        // if(this.mobile == "9841014473") debugger;

        if (!data || this.status != 'active' && (this.status == 'done' && todayTime > 16)) {
          this.msg = "No active ordres.";
          this.ordersExist = false;
          return;
        };

        if (this.status == "expired") {
          this.ordersExist = false;
          return;
        }

        this.ordersExist = true;
        // debugger;
        // console.log("this._service.historyLength :: " + this._service.historyLength);
        let _data = data[this._service.historyLength];

        // debugger;
        this.historyObj = _data;
        this.orderInfo = _data.details;
        this.paid_history = [];
        if (_data.details['history']) {
          for (let val in _data.details['history']) {
            // debugger;
            this.paid_history.push("Paid " + _data.details['history'][val] + " on " + new Date(Number(val)).toDateString() + " " + new Date(Number(val)).toLocaleTimeString());
          }
        }
        // debugger;
        let cnt = -1;

        this.total_nut_cnt = 0;
        let todayFlg = false;
        for (var key in _data["dates"]) {
          cnt++;
          var __date = this.date_utils.dateFormater(key, "-");
          //day difference from todays date
          let diff = (this.date_utils.dateDiff(new Date(), new Date(this.date_utils.stdDateFormater(__date, "/"))));

          this.total_nut_cnt += _data["dates"][key].count;
          todayFlg = (Math.sign(this.date_utils.dateDiff(new Date(), new Date(this.date_utils.stdDateFormater(__date, "/"))))) == 0 ? true : false;
          if (todayFlg && todayTime <= 10) todayFlg = false;

          this.orders[cnt] = {
            index: _data["dates"][key].index,
            date: this.date_utils.dateFormater(key, "-"),
            count: _data["dates"][key].count,
            assigned_to: _data["dates"][key].assigned_to,
            //set expired if days or less than today || todaysTime >= 11            
            // expired: (Math.sign(this.date_utils.dateDiff(new Date(), new Date(this.date_utils.stdDateFormater(__date, "/")))) == -1 || todayFlg) ? true : false,
            expired: (Math.sign(this.date_utils.dateDiff(new Date(), new Date(this.date_utils.stdDateFormater(__date, "/")))) == -1 || _data["dates"][key].delivered || todayFlg) ? true : false,
            postponed: (_data["dates"][key].index == 'postponed') ? true : false,
            stopped: (_data["dates"][key].index == 'Stopped') ? true : false,
            today: diff == 0 ? true : false,
            actualIndex: _data["dates"][key].actualIndex,
            delivered: (_data["dates"][key].delivered),
            delivered_by: (_data["dates"][key].delivered_by == 'nil') ? "Undelivered" : "Delivered"
          };
        }

        this.orders.sort(function (a, b) {
          return a.actualIndex - b.actualIndex
        });

        /*
        * For notifying customer
        * Get the grammatical strings
        */
        let remaining_days = this.date_utils.dateDiff(new Date(), new Date(this.end_d));
        let grammer_rule = {};
        if (remaining_days == 1) {
          grammer_rule['first'] = "is";
          grammer_rule['second'] = "day";
        } else {
          grammer_rule['first'] = "are";
          grammer_rule['second'] = "days";
        }

        //render month and day from the toDateString method.
        let start_date_g = null;
        let last_date;
        if (this.start_d) {
          start_date_g = this.start_d.split(" ");
          start_date_g = start_date_g[1] + " " + start_date_g[2];

          last_date = this.end_d.split(" ");
          last_date = last_date[1] + " " + last_date[2];
        }

        if (this.historyObj['details']['remaining_to_pay'] > 0) {
          this.warn_msg_to_pay = `Dear Customer,\nThere ${grammer_rule['first']} only ${remaining_days} ${grammer_rule['second']} left in your ${this.unitsPerDay} x ${_data.details.no_of_days} days of ${_data.details.name} subscription pack. Your current subscription ends on ${last_date}. Kindly renew your subscription.\nStay Healthy!\nwww.thinkspot.in`;
        } else if (this.historyObj['details']['remaining_to_pay'] <= 0) {
          this.warn_msg_to_pay = `Dear Customer,\nThe amount of Rs. ${this.historyObj['details']['remaining_to_pay']} for your ${this.unitsPerDay}x${_data.details.no_of_days} days of ${_data.details.name} subscription pack starting ${start_date_g} to ${last_date} is due. Kindly pay it before ${last_date}.\nStay Healthy!\nwww.thinkspot.in`
        }
        // this._changeDet.detectChanges();
        this._ngZone.run(() => { });

      });
    });
  }

  @Input() data: any = {
    p_name: "Tender Coconut"
  };

  @Output() stockValueChange = new EventEmitter();

  plusMinusValue(val) {
    this.unitsPerDay = val;
    this.renderChanges();
  }

  daysClickAction(e) {
    // debugger;
    this.setSubscribeSetActiveButton(null);
    let targetDay = e.target.id.slice(-1) * 1;
    this.selectedDays[(targetDay + 1)] = (this.selectedDays[(targetDay + 1)]) ? 0 : 1;
    this.changeDetecter = true;
    this.renderChanges();
  }

  onStrawChange() {
    // console.log(this.strawFlag);
    this.renderChanges();
  }

  public renderChanges() {
    this.customSubsBtnVisibility = true;
    this.subsBtnVisibility = false;
    this.packageOptions = {
      "pack7": this.price - this.discount + this.deliveryCharges + ((this.strawFlag) ? 2 : 0),
      "3andmore": this.price - this.discount + this.deliveryCharges + ((this.strawFlag) ? 2 : 0),
      "std": this.price + this.deliveryCharges + ((this.strawFlag) ? 2 : 0),
      "custom_pack": this.price - this.discount + this.deliveryCharges + ((this.strawFlag) ? 2 : 0),
    }

    let totalDays: number = 0;
    let alternateCnt_A = 0, alternateCnt_B = 0, thrice_a_week_cnt = 0;
    for (var key in this.selectedDays) {
      if (this.selectedDays[key]) {
        totalDays++;
        let b = Number(key);
        if ((b % 2) != 0) {
          alternateCnt_A++;
        } else {
          alternateCnt_B++;
        }
        if ((b % 3) == 1) thrice_a_week_cnt++;
      }
    }
    this.subscribedDays = totalDays;

    if (!this.subsFlag) totalDays = 1;

    if (alternateCnt_A == 4 && totalDays == 4) this.setSubscribeSetActiveButton(1);
    if (alternateCnt_B == 3 && totalDays == 3) this.setSubscribeSetActiveButton(1);
    if (thrice_a_week_cnt == 3 && totalDays == 3) this.setSubscribeSetActiveButton(2);

    if (totalDays == 7) this.subscribe_type = "7 days pack";

    if (totalDays == 7 || this.unitsPerDay > this.unitsPerDay - 1) {
      this.priceOption = this.packageOptions["pack7"];
    } else {
      this.priceOption = this.packageOptions["std"];
    }

    // if (this.strawFlag) this.priceOption += 2;
    //if total days is 7 set 7 days button as active
    if (totalDays == 7) this.setSubscribeSetActiveButton(0);

    if (this.subsFlag) {
      this.totalPrice = this.priceOption * this.subscribedDays * this.unitsPerDay;
      this.originalPrice = (this.packageOptions['std'] * this.unitsPerDay * this.subscribedDays);
      this.diff = Math.abs((this.priceOption * this.subscribedDays *
        this.unitsPerDay) - (this.packageOptions['std'] * this.unitsPerDay * this.subscribedDays));

    } else {
      this.subscribedDays = 1;
      this.totalPrice = this.priceOption * this.unitsPerDay;

      this.originalPrice = (this.packageOptions['std'] * this.unitsPerDay);

      this.diff = Math.abs((this.priceOption *
        this.unitsPerDay) - (this.packageOptions['std'] * this.unitsPerDay));
    }

    // console.log("subscribed days :: " + this.subscribedDays);
    this.end_date = this.date_utils.addDays(new Date(), this.subscribedDays);

    this.tenderDetails = {
      // "category": "Vegetables",
      "name": this.data["p_name"],
      "c_name": this.c_name,
      "m_no": this.mobile,
      // "img": "assets/products/veg/tender.jpg",
      "id": "product_1",
      // "price": this.originalPrice,
      "type": this.selectedNutType,
      // "quantity": (this.unitsPerDay * this.subscribedDays),
      // "totalPrice": this.totalPrice,
      "per_day": this.unitsPerDay,
      // "total": (this.unitsPerDay * this.subscribedDays),
      // "paid_amt": 0,
      // "remaining_to_pay": this.totalPrice,
      // "no_of_days": this.subscribedDays,
      // "sub_type": this.subscribe_type,
      // "subscribe": this.subsFlag,
      // "offers": this.diff,
      // "delivery_charge": this.deliveryCharges * (this.unitsPerDay * this.subscribedDays),
      // "straw": this.strawFlag,
      // "strawPrice": (this.strawFlag) ? (this.strawPrice * this.unitsPerDay) : 0,
      // "units": 1,
      "delivery_status": "Not delivered",
      // "start_date": this.date_utils.getDateString(this.start_date, "-"),
      // "end_date": this.date_utils.getDateString(this.end_date, "-"),
      // "paid": "No",
      // "nut_type": "sweet",
      // "DND": "No",
      "nut_variety": this.selectedNutVariety,
      "assigned_to": this.assigned_to,
      "history_id": this._service.historyLength + 1
    }
  }

  onNutVarietyChange(e): void {
    // console.log(e.value);
    this.selectedNutVariety = e.value;
  }

  public onNutTypeChange(e) {
    this.price = this.nutTypes[e.value - 1]["price"];
    this.selectedNutType = this.nutTypes[e.value - 1]["value"];
    this.minCount = this.nutTypes[e.value - 1]["minCount"];
    this.unitsPerDay = this.minCount;
    // Utils.trace("min  :: " + this.minCount);
    this.renderChanges();
    // this.ref.detectChanges();
  }

  subscribeBtn() {
    // console.log("subscribe");
    this.subscribeVisibilityFlg = true;
  }

  sevenDaysClick() {
    this.subscribe_type = "Seven days pack";
    this.setSubscribeSetActiveButton(0);
    // debugger;
    for (let key in this.selectedDays) this.selectedDays[key] = 1;
    this.changeDetecter = true;
    this.renderChanges();
    return false;
  }

  fifteenDaysClick() {

    return false;
  }

  thirtyDaysClick() {
    return false;
  }

  alternateDaysClick() {
    this.subscribe_type = "Alternate days pack";
    this.setSubscribeSetActiveButton(1);
    for (let key in this.selectedDays) {
      let b = Number(key);
      if ((b % 2) == 0)
        this.selectedDays[key] = 0;
      else
        this.selectedDays[key] = 1;
    }
    this.changeDetecter = true;
    this.renderChanges();
  }

  every3DaysClick() {
    this.subscribe_type = "Thrice a week pack";
    this.setSubscribeSetActiveButton(2);
    for (let key in this.selectedDays) {
      let b = Number(key);
      if ((b % 3) == 1)
        this.selectedDays[key] = 1;
      else
        this.selectedDays[key] = 0;
    }
    this.changeDetecter = true;
    this.renderChanges();
  }

  setSubscribeSetActiveButton(index) {
    //reset flags
    for (let key in this.subscribeActiveFlgs) this.subscribeActiveFlgs[key] = 0;
    //active button
    this.subscribeActiveFlgs[index] = 1;
  }

  onResetClick() {
    this.subsBtnVisibility = true;
    this.customSubsBtnVisibility = true;
    for (let key in this.subscribeActiveFlgs) this.subscribeActiveFlgs[key] = 0;
    for (let key in this.selectedDays) this.selectedDays[key] = 0;
    this.selectedDays[1] = 1;
    this.renderChanges();
    this.changeDetecter = false;
  }

  onSubscribeChange() {
    this.addToCartBtnDisabled = this.subsFlag;
    this.renderChanges();
  }

  addToCart() {
    // debugger;
    for (let i = 0; i < this.subscribedDays; i++) {
      let _date = this.date_utils.addDays(new Date(), i);
      // console.log(i + " : date : " + this.date_utils.getDateString(_date, ""));
    }
  }

  addToSubscriptionBag() {
    this.subsBtnVisibility = true;
    let index = 0, actualIndex = 0;
    // debugger;

    this.trace("this.assigned_to :: " + this.assigned_to);

    this.historyObj = {
      "details": {
        // "start_date": this.date_utils.getDateString(this.start_date, "-"),
        // "end_date": this.date_utils.getDateString(this.end_date, "-"),
        "total_price": this.totalPrice,
        "remaining_to_pay": this.totalPrice,
        // "per_day": this.unitsPerDay,
        "straw": this.strawFlag,
        // "offers": this.diff,
        "no_of_days": this.subscribedDays,
        "active": "yes",
        "nut_variety": this.selectedNutVariety,
        // "price": this.originalPrice,
        // "paused": false,
        "nut_price": this.price + this.deliveryCharges - this.discount,
        "paid_status": "No",
        "paid_amt": 0,
        "nut_type": "",
        "DND": "No",
        "instructions": "hole and open",
        "special_notes": "",
        "assigned_to": this.assigned_to,
        "name": this.data["p_name"],
      },
      "dates": {}
    }

    // console.log("addToSubscriptionBag");
    for (var key in this.selectedDays) {
      index++;

      if (this.selectedDays[key] == 1) {
        // debugger;
        actualIndex++;
        // this.trace("index :: " + index);
        // this.trace("key :: " + key);
        let _date = this.date_utils.addDays(new Date(), key);
        this.firebase.write_tc_orders(this.date_utils.getDateString(_date, ""), this.mobile, this.tenderDetails);

        // this.trace("*****************");
        // this.trace("this.assigned_to :: " + this.assigned_to);
        // this.trace("*****************");
        this.historyObj['dates'][this.date_utils.getDateString(_date, "")] = {
          index: actualIndex,
          actualIndex: index,
          'delivered': false,
          'missed': false,
          'replacement': 0,
          'assigned_to': this.assigned_to,
          'delivered_by': 'nil',
          'count': this.unitsPerDay
        }
      }
    }
    // let start = this.date_utils.stdDateFormater(this.historyObj['start_date']);
    // console.log("this._service.historyLength + 1 :: " + (this._service.historyLength * 1 + 1));
    this.firebase.user_history(this.mobile, this.historyObj, "yes", (this._service.historyLength * 1 + 1), () => {
      // console.log("added to the history.");
      this.subsBtnVisibility = true;
      this.ordersExist = true;
      this._router.navigate(['/admin/customer_view/' + Date.now(), { mobile: this.mobile, status: 'active', name: this.c_name }]);
      // this._changeDet.detectChanges();
    });
  }

  @HostListener('document:click', ['$event.target'])
  public onClick(targetElement) {

  }

  closeOutsideSidenav() {
    console.log("closeOutsideSidenav");
  }

  onUserDatesClick(evt, data) {
    this.infoEnabled = false;
    this.selectedDateIndex = data.index;
    this.selectedDateItem = data;
    this.dayExpired = data.expired;

    let date = this.date_utils.dateFormater(data.date, "");

    this.editEnabled = false;
    this.postponeEnabled = false;
    this.stopEnabled = false;

    // console.log("expired :: " + this.historyObj['dates'][date]["expired"])
    if (!this.historyObj['dates'][date]["delivered"] && !this.historyObj['dates'][date]["expired"]) {
      this.btnsView = true;
    } else {
      this.btnsView = false;
    }

    this._changeDet.detectChanges();
    return false;
  }

  editAction() {
    console.log("Edit");
    this.editEnabled = true;
    this.btnsView = false;
  }

  postponeAction() {
    this.btnsView = false;
    this.postponeEnabled = true;
    console.log("Postpone");

  }

  deleteAction() {
    console.log("Delete");
  }

  pauseAction() {
    console.log("Pause");
  }

  orderCountUpdate(val) {
    this.editedUnitsPerDay = val;
  }

  editUpdateAction() {
    let date = this.date_utils.dateFormater(this.selectedDateItem.date, "");
    // this.historyObj['dates'][date]['replacement'] = this.noOfReplacements;
    // this.historyObj['dates'][date]['count'] = this.editedUnitsPerDay;

    this.historyObj['dates'][date].count = this.editedUnitsPerDay;
    // debugger;
    //total nut count
    let _cnt = 0;
    for (let key in this.historyObj['dates']) {
      _cnt += this.historyObj['dates'][key].count;
    }

    // debugger;
    let _total_price = _cnt * (this.price + this.deliveryCharges - this.discount);
    console.log("remainig amt :: " + (_total_price - this.historyObj["details"]['paid_amt']));
    // debugger;
    this.firebase.editupdateWrite(this.mobile, this._service.historyLength,
      {
        count: this.editedUnitsPerDay,
        replacement: this.noOfReplacements,
        assigned_to: this.assigned_to,
        "total_price": _total_price,
        "remaining_to_pay": _total_price - this.historyObj["details"]['paid_amt'],
        "paid_status": ""
      },
      date, () => {
        // debugger;
        this.editEnabled = false;
        this.btnsView = true;
        this._changeDet.detectChanges();
      });

    this.orderInfo = this.historyObj["details"];
    // this.tenderDetails = {
    //   "category": "Vegetables",
    //   "name": this.data["p_name"],
    //   "c_name": this.c_name,
    //   "m_no": this.mobile,
    //   "img": "assets/products/veg/tender.jpg",
    //   "id": "product_1",
    //   "price": this.originalPrice,
    //   "type": this.selectedNutType,
    //   "quantity": (this.unitsPerDay * this.subscribedDays),
    //   "totalPrice": this.totalPrice,
    //   "per_day": this.unitsPerDay,
    //   "total": (this.unitsPerDay * this.subscribedDays),
    //   "no_of_days": this.subscribedDays,
    //   "sub_type": this.subscribe_type,
    //   "subscribe": this.subsFlag,
    //   "offers": this.diff,
    //   "delivery_charge": this.deliveryCharges * (this.unitsPerDay * this.subscribedDays),
    //   "straw": this.strawFlag,
    //   "strawPrice": (this.strawFlag) ? (this.strawPrice * this.unitsPerDay) : 0,
    //   "units": 1,
    //   "delivery_status": "Not delivered",
    //   "start_date": this.date_utils.getDateString(this.start_date, "-"),
    //   "end_date": this.date_utils.getDateString(this.end_date, "-"),
    //   "paid": "No",
    //   "nut_type": "sweet",
    //   "DND": "No",
    //   "assigned_to": this.assigned_to,
    // }

    this.tenderDetails['per_day'] = this.editedUnitsPerDay;
    this.tenderDetails['replacement'] = this.noOfReplacements;
    this.tenderDetails['assigned_to'] = this.assigned_to;
    this.tenderDetails['c_name'] = this.c_name;
    this.tenderDetails['m_no'] = this.mobile;

    // debugger;
    this.firebase.write_tc_orders(date, this.mobile, this.tenderDetails);

    this.infoEnabled = true;
  }

  editCancelAction() {
    console.log("editCancelAction");
    this.editEnabled = false;
    this.btnsView = true;
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  onDeliveryBoyChange(evt): void {
    this.assigned_to = evt.value;
    this.assigned_to_index = this.delivery_boys_list.indexOf(this.assigned_to);
    // console.log("this.assigned_to_index :: " + this.assigned_to_index);
  }

  postponeUpdateAction() {
    let trace = console.log;
    let pastPostponeCount = 0;

    let remainingDays = (this.orders.length - this.selectedDateIndex + 1);
    // trace("remainingDays :: " + remainingDays);
    let ordersToPostpone = [];

    // debugger;
    //copy the days from postpone date
    for (let i = 0; i < remainingDays; i++) {
      let index = (this.selectedDateIndex + i) - 1;
      ordersToPostpone[i] = JSON.parse(JSON.stringify(this.orders[index]));
    }

    // debugger;

    let tmp;
    //update the orders object
    for (let i = 0; i < remainingDays; i++) {
      let index1 = (this.selectedDateIndex - 1) * 1 + (this.noOfDaysToPostpone * 1) + i - pastPostponeCount;
      // let actualIndex = (this.selectedDateIndex) * 1 + this.noOfDaysToPostpone * 1 + i;
      // trace("index 1 :: " + index1 + " actualIndex :: " + actualIndex);
      //default date format
      let targetDate = new Date(this.date_utils.stdDateFormater(ordersToPostpone[i].date, "/"));

      // trace("ordersToPostpone[i].index :: " + ordersToPostpone[i].index);
      //update the orders object from the copied object     

      tmp = ordersToPostpone.slice() || undefined;
      if (ordersToPostpone[i].index != 'postponed') {
        ordersToPostpone[i].index = (index1 - this.noOfDaysToPostpone * 1) + 1 - pastPostponeCount;
        ordersToPostpone[i].actualIndex = (index1 + this.noOfDaysToPostpone * 1);
      } else {
        pastPostponeCount++;
      }
      // trace("pastPostponeCount :: " + pastPostponeCount);
      let updateDate = this.date_utils.addDays(targetDate, this.noOfDaysToPostpone * 1);
      ordersToPostpone[i].date = this.date_utils.getDateString(updateDate, "-");
      ordersToPostpone[i].delivered = false;

      this.orders[index1] = ordersToPostpone[i];

      //histroy update for write firebase
      let history_date = this.date_utils.getDateString(updateDate, "");
      if (ordersToPostpone[i].index != 'postponed') {
        this.historyObj['dates'][history_date] = {
          'delivered': false,
          'missed': false,
          'replacement': 0,
          'assigned_to': this.assigned_to,
          'delivered_by': 'nil',
          'count': ordersToPostpone[i].count
        }
      } else {
        this.historyObj['dates'][history_date] = {
          index: 'postponed',
          'delivered': false,
          'missed': false,
          'replacement': 0,
          'assigned_to': this.assigned_to,
          'delivered_by': 'nil',
          'count': 0
        }
      }

      // if the subscription type other than regular days

      if (ordersToPostpone[i + 1] && ordersToPostpone[i].actualIndex != "postponed" && ordersToPostpone[i + 1].actualIndex != "postponed") {
        if ((ordersToPostpone[i + 1].actualIndex - ordersToPostpone[i].actualIndex) > 1) {
          trace("loop breaked 1");
          break;
        }
      }
    }

    for (let i = 0; i < this.noOfDaysToPostpone; i++) {
      // console.log("postpone :: " + i);
      let target = (this.selectedDateIndex + i) - 1;
      let start_target = (this.selectedDateIndex + 0) - 1;
      let _targetDate = new Date(this.date_utils.stdDateFormater(this.orders[start_target].date, "/"));
      let _updateDate = this.date_utils.addDays(_targetDate, i);


      // debugger;
      this.delete_orders_subscriber = this.firebase.deleteUserOrder(this.mobile, this.date_utils.getDateString(_updateDate, ""), () => {
        if (i == this.noOfDaysToPostpone - 1) {
          console.log("remove order subscriber.");
          this.delete_orders_subscriber.unsubscribe();
        }
      })

      this.orders[target] = {};
      this.orders[target].date = this.date_utils.getDateString(_updateDate, "-");
      this.orders[target].count = 0;
      this.orders[target].postpone = true;
      this.orders[target].index = "postponed";
      this.orders[target].delivered = false;
      // debugger;
      let history_date = this.date_utils.getDateString(_updateDate, "");
      this.historyObj['dates'][history_date] = {
        index: "postponed",
        'delivered': false,
        'missed': false,
        'replacement': 0,
        'assigned_to': 'nil',
        'delivered_by': 'nil',
        'count': 0,
      }

      // if the subscription type other than regular days
      if (ordersToPostpone[i + 1] && ordersToPostpone[i].actualIndex != "postponed" && ordersToPostpone[i + 1].actualIndex != "postponed") {
        if ((ordersToPostpone[i + 1].actualIndex - ordersToPostpone[i].actualIndex) > 1) {
          trace("loop breaked");
          this.orders.splice(i + 2, 0, tmp[i + 1]);
          break;
        }
      }
    }

    // debugger;
    //index update for both local and firebase object.
    let actualIndex = 0, index = 0;
    for (let key in this.orders) {
      actualIndex++;
      // trace("actualIndex :: " + actualIndex);
      // trace(this.orders[key]);
      // trace("_________");
      this.orders[key].actualIndex = actualIndex;
      if (this.orders[key].index != 'postponed') {
        index++;
        this.orders[key].index = index;
      }
    }

    let actualIndex1 = 0, index1 = 0;
    Object.keys(this.historyObj['dates']).sort().map((key, index) => {
      actualIndex1++;
      this.historyObj['dates'][key].actualIndex = actualIndex1;
      if (this.historyObj['dates'][key].index != 'postponed') {
        index1++;
        this.historyObj['dates'][key].index = index1;
      }
    });
    this.firebase.user_history(this.mobile, this.historyObj, "yes", this._service.historyLength, () => { });

    // debugger;
  }

  postponeCancelAction() {
    this.postponeEnabled = false;
    this.btnsView = true;
  }

  stopAction() {
    console.log("Stop");
    this.stopEnabled = true;
    this.btnsView = false;
  }

  stopUpdateAction() {
    // console.log("stopUpdateAction");
    let remainingDays = (this.orders.length - this.selectedDateIndex + 1);
    let trace = console.log;
    let targetDate = new Date(this.date_utils.stdDateFormater(this.orders[this.selectedDateIndex - 2].date, "/"));

    // for (let i = this.selectedDateIndex - 1; i < this.orders.length; i++) {
    //   this.orders[i].index = "Stopped";
    //   this.orders[i].count = 0;
    // }
    // debugger;

    // its like a double M.A. job. Kind of diverting the context.

    this.orders.splice(this.selectedDateIndex - 1, this.orders.length);

    let _nut_price = this.historyObj['details']['nut_price'] * 1;
    let _nut_count = 0;
    for (let i = 0; i < remainingDays; i++) {
      let updateDate = this.date_utils.addDays(targetDate, 1);
      let _date = this.date_utils.getDateString(updateDate, "");
      if (this.historyObj['dates'][_date].index != "Stopped" || this.historyObj['dates'][_date].index != "postponed")
        _nut_count += this.historyObj['dates'][_date].count * 1;

      // this.historyObj['dates'][_date].index = "Stopped";
      // this.historyObj['dates'][_date].count = 0;
      // this.historyObj['dates'][_date].expired = true;
      delete this.historyObj['dates'][_date];

      this.delete_orders_subscriber = this.firebase.deleteUserOrder(this.mobile, this.date_utils.dateFormater(_date, "-"), () => {
        if (i == remainingDays - 1) {
          console.log("remove order subscriber.");
          this.delete_orders_subscriber.unsubscribe();
        }
      });

    }
    // console.log("final amout :: " + (_nut_count * _nut_price));
    let _after_total = (_nut_count * _nut_price);
    // debugger;
    this.historyObj['details']['remaining_to_pay'] = this.historyObj['details']['remaining_to_pay'] * 1 - _after_total;
    this.historyObj['details']['total_price'] = this.historyObj['details']['total_price'] * 1 - _after_total;
    // debugger;
    this.firebase.user_history(this.mobile, this.historyObj, "yes", this._service.historyLength, () => { this._changeDet.detectChanges(); });
  }

  stopCancelAction() {
    this.stopEnabled = false;
    this.btnsView = true;
  }

  public selectedDate(value: any, datepicker?: any) {
    // this is the date the iser selected
    console.log(value);

    // any object can be passed to the selected event and it will be passed back here
    datepicker.start = value.start;
    datepicker.end = value.end;

    // or manupulat your own internal property
    this.daterange.start = value.start;
    this.daterange.end = value.end;
    this.daterange.label = value.label;
  }

  public selectedDateRangePicker(evt, data) {
    console.log(evt, data);
    // debugger;
    this.rangepicker_data = {
      evt: evt,
      start: evt.start._d.toDateString(),
      end: evt.end._d.toDateString()
    };
    let _diff = this.date_utils.dateDiff(evt.start._d, evt.end._d);
    // console.log("diff :: " + _diff);
    // this.trace(evt.start._d, evt.end._d);
    this.onResetClick();
    this.customSubsBtnVisibility = false;
    this.subsBtnVisibility = true;
    this.subscribedDays = _diff;
  }

  public addToCustomSubscriptionBag() {
    this.packageOptions = {
      "custom_pack": this.price - this.discount + this.deliveryCharges + ((this.strawFlag) ? 2 : 0)
    }
    this.totalPrice = this.priceOption * this.subscribedDays * this.unitsPerDay;
    this.originalPrice = (this.packageOptions['custom_pack'] * this.unitsPerDay * this.subscribedDays);
    this.diff = Math.abs((this.priceOption * this.subscribedDays *
      this.unitsPerDay) - (this.packageOptions['custom_pack'] * this.unitsPerDay * this.subscribedDays));

    this.tenderDetails = {
      "name": this.data["p_name"],
      "c_name": this.c_name,
      "m_no": this.mobile,
      "id": "product_1",
      "type": this.selectedNutType,
      "per_day": this.unitsPerDay,
      "delivery_status": "Not delivered",
      "assigned_to": this.assigned_to,
      "history_id": (this._service.historyLength * 1) + 1
    }
    // this.subsBtnVisibility = true;
    this.customSubsBtnVisibility = true;

    this.historyObj = {
      "details": {
        "name": this.data["p_name"],
        "total_price": this.totalPrice,
        "remaining_to_pay": this.totalPrice,
        "straw": this.strawFlag,
        "no_of_days": this.subscribedDays,
        "active": "yes",
        "nut_price": this.price + this.deliveryCharges - this.discount,
        "paid_status": "No",
        "paid_amt": 0,
        "nut_type": "",
        "DND": "No",
        "instructions": "hole and open",
        "special_notes": "",
      },
      "dates": {}
    }

    let _dates = [];
    _dates.push(this.rangepicker_data.start);
    for (let i = 0; i < this.subscribedDays - 1; i++) {
      let _date = this.date_utils.addDays(new Date(this.rangepicker_data.start), i + 1);
      _dates.push(_date.toDateString());
    }
    let index = 0;
    for (let i = 0; i < _dates.length; i++) {
      index++;
      let _date = new Date(_dates[i]);
      // this.trace(_date);
      this.firebase.write_tc_orders(this.date_utils.getDateString(_date, ""), this.mobile, this.tenderDetails);
      this.historyObj['dates'][this.date_utils.getDateString(_date, "")] = {
        "index": index,
        "actualIndex": index,
        'delivered': false,
        'missed': false,
        'replacement': 0,
        'assigned_to': this.assigned_to,
        'delivered_by': 'nil',
        'count': this.unitsPerDay
      }
    }
    // let start = this.date_utils.stdDateFormater(this.historyObj['start_date']);
    // console.log("this._service.historyLength + 1 :: " + (this._service.historyLength * 1 + 1));
    this.firebase.user_history(this.mobile, this.historyObj, "yes", ((this._service.historyLength * 1) + 1), () => {
      // console.log("added to the history.");
      this.subsBtnVisibility = true;
      this.ordersExist = true;
      // debugger;
      this._router.navigate(['/admin/customer_view/' + Date.now(), { mobile: this.mobile, index: 0, status: 'active', name: this.c_name }]);
      // this._changeDet.detectChanges();
    });

    if (this.customerMsgFlag) {
      this._service.send_bulk_sms({
        'mobile_nos': [this.mobile],
        'fName': this.c_name,
        'content': `Confirmed: Order for ${this.tenderDetails['per_day']} tender coconuts for ${this.historyObj['details']['no_of_days']} day(s) is successfully placed & will be delivered from/on ${this.start_d}.Thank you!\nwww.thinkspot.in\n7200015551`
      }, () => { });
    }

  }

  paySaveAction(val: any) {
    // console.log("Save action :: " + val.value);

    let inpVal = val.value;
    let remaining = Math.abs(val.value - this.orderInfo['remaining_to_pay']);//this.packageData.remaining_to_pay - this.packageData.paid_amt;
    let paid = Math.abs(remaining - this.orderInfo['total_price']);
    let status = "";

    if (paid == this.orderInfo['total_price']) {
      status = "Paid";
    } else if (paid != 0 && paid < this.orderInfo['total_price']) {
      status = "Partially paid";
    } else {
      status = "Not paid";
    }

    if (val.value && val.value != 0) {
      // debugger;
      this.firebase.packageInfoUpdate(this.mobile, this._service.historyLength, {
        "total_price": this.orderInfo['total_price'],
        "paid_amt": paid,
        "remaining_to_pay": remaining,
        "paid_status": status
      }, () => {
        this._changeDet.detectChanges();
      });

      this.firebase.packagePaidHistoryUpdate(this.mobile, this._service.historyLength, inpVal, () => {
        // this._changeDet.detectChanges();
      });
    }


    // let content = "";
    // if (remaining == 0) {
    //   content = "Your payment of Rs." + paid + " is recieved by our delivery agent. Thank you!\nwww.thinkspot.in\n7200015551";
    // } else if (remaining < 0) {
    //   content = "Your payment of Rs." + paid + " is recieved by our delivery agent and you have Rs." + remaining + " in your account. Thank you!\nwww.thinkspot.in\n7200015551";
    // } else if (remaining > 0) {
    //   content = "Your payment of Rs." + paid + " is recieved by our delivery agent and you have Rs." + remaining + " remaining to pay. Thank you!\nwww.thinkspot.in\n7200015551";
    // }

    // console.log("this.mobile  :: " + this.data.m_no);
    // this._service.send_bulk_sms({
    //   'mobile_nos': [this.data.m_no],
    //   'fName': "",
    //   'content': content
    // });

    //empty the value;
    val.value = 0;
  }

  payCancelAction() {
    console.log("Cancel action.");
  }

  deleteOrderAction() {
    // console.log("delete order action.", this._service.historyLength, this.mobile);
    this.delete_subscriber = this.firebase.deleteUserHistory(this.mobile, this._service.historyLength, () => {
      // this._router.navigate(["admin/customer_list"]);
      this.ordersExist = false;
      // this._service.historyLength -= 1;
      // console.log("History lenght after delete :: " + this._service.historyLength);
      this.orders = [];
      this._changeDet.detectChanges();
      this.delete_subscriber.unsubscribe();
    });

    for (let i = 0; i < this.orders.length; i++) {
      this.delete_orders_subscriber = this.firebase.deleteUserOrder(this.mobile, this.date_utils.dateFormater(this.orders[i].date, "-"), () => {
        if (i == this.orders.length - 1) {
          console.log("remove order subscriber.");
          this.delete_orders_subscriber.unsubscribe();
        }
      })
    }

  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
    this.orders_subscriber.unsubscribe();
  }

  onCustomerMsgChange() {
    console.log("customerMsgFlag :: " + this.customerMsgFlag);
  }

  SendMsgAction() {
    // console.log("SendMsgAction");
    // this.trace("Hello " + this.c_name +"!\nYou have only " + this.date_utils.dateDiff(new Date(), new Date(this.end_d)) + " day(s) left. Please pay asap.");
    this.warn_msg_info = "sending...";
    this.sendMsgBtnFlg = true;
    this._service.send_bulk_sms({
      'mobile_nos': [this.mobile],
      'fName': this.c_name,
      'content': this.warn_msg_to_pay
    }, () => {
      this.warn_msg_info = "sent";
      window.setTimeout(() => {
        this.warn_msg_info = "";
        this.sendMsgBtnFlg = false;
      }, 5000);
    });

  }
}

