import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { FireBase } from 'src/app/utils/firebase';
import { DateUtils } from 'src/app/utils/date-utils';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireDatabase } from 'angularfire2/database';
import { CommonsService } from 'src/app/services/commons.service';
import { StorageService } from 'src/app/utils/storage.service';
import { Ng2SearchPipe } from 'ng2-search-filter';
import { Utils } from 'src/app/utils/utils';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss']
})
export class ItemListComponent implements OnInit {

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
  public categories = ["Vegetables", "subs", "Pome", "Greens", "Woodpressed", "Sprouts", "Batter"];

  //it contains list of list of all arders by its category
  items_list: any = {};
  total_items: any = {};

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

    this.todaysDate = this.date_utils.getDateString(this.date_utils.addDaysToCalendar(this.todaysDate, 0), "");
    // console.log("this.todaysDate :: " + this.todaysDate);
    // }
    this.renderList();
  }

  renderList() {
    this.todaysDateFormatted = this.date_utils.dateFormater(this.todaysDate, "-");

    this.listObservable = this.firebase.readDailyOrders(this.todaysDate).subscribe((data: any) => {
      // debugger;
      for (var key in data) {
        // console.log(data[key]);
        for (var items in data[key]) {
          // debugger;

          if (items == "bag") {
            // console.log(data[key][items]);
            for (var _cat in data[key][items]) {
              // console.log(_cat);
              if (_cat != 'address') {
                for (var list in data[key][items][_cat]) {
                  // console.log(list);
                  if (!this.items_list[list]) this.items_list[list] = [];

                  // console.log(list);
                  if (list != 'others') {
                    for (var item_lists in data[key][items][_cat][list]) {
                      this.items_list[list].push(data[key][items][_cat][list][item_lists]);
                    }
                  }
                }

              }
            }
          }

          if (items == "greens") {

          }


          if (items == "tender") {

          }


          if (items == "milk") {

          }

        }
      }

      // console.log(this.items_list);
      for (var key in this.items_list) {
        this.total_items[key] = {}
        for (var i = 0; i < this.items_list[key].length; i++) {

          if (!this.total_items[key][this.items_list[key][i].name]) this.total_items[key][this.items_list[key][i].name] = [];
          if (!this.total_items[key]["total"]) this.total_items[key]["total"] = 0;

          if (this.items_list[key][i].name == "Tender Coconut") {
            this.total_items[key][this.items_list[key][i].name].push(this.items_list[key][i].quantity);
            //update total
            this.total_items[key]["total"] += this.items_list[key][i].quantity;

          } else if (this.items_list[key][i].name == "Fresh Cow Milk") {
            this.total_items[key][this.items_list[key][i].name].push(this.items_list[key][i].quantity);

            //update total
            this.total_items[key]["total"] += this.items_list[key][i].quantity;

          } else {
            this.total_items[key][this.items_list[key][i].name].push(this.items_list[key][i].weight);

            //update total
            if (!this.total_items[key][this.items_list[key][i].name]['total']) this.total_items[key][this.items_list[key][i].name]['total'] = 0;
            this.total_items[key][this.items_list[key][i].name]['total'] += this.items_list[key][i].weight;
          }

        }
      }

      console.log(this.total_items);
      this._changeDet.detectChanges();
      console.log("***********88");

    });
  }

  overlayClickHandler() {

  }

  tabChanged(evt) {

  }

}
