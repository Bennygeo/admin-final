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
    // this.todaysDate = new Date();

    // this.todaysDate = this.date_utils.getDateString(this.date_utils.addDaysToCalendar(this.todaysDate, 0), "");
    // console.log("this.todaysDate :: " + this.todaysDate);

    let todayTime = new Date().getHours();
    // debugger;
    if (todayTime <= 11) {
      this.todaysDate = new Date();
      this.todaysDate = this.date_utils.getDateString(this.todaysDate, "");
    } else {
      this.todaysDate = new Date();
      this.todaysDate = this.date_utils.getDateString(this.date_utils.addDaysToCalendar(this.todaysDate, 1), "");
    }

    // }
    this.renderList();
  }

  renderList() {
    this.todaysDateFormatted = this.date_utils.dateFormater(this.todaysDate, "-");

    this.listObservable = this.firebase.readDailyOrders(this.todaysDate).subscribe((data: any) => {
      for (var key in data) {
        // console.log(data[key]);
        for (var items in data[key]) {
          // debugger;

          if (items == "bag") {
            // console.log(data[key][items]);
            // console.log("**********");

            for (var _cat in data[key][items]) {
              if (_cat != 'address') {
                for (var list in data[key][items][_cat]) {
                  // console.log(list);
                  // console.log("------------");
                  if (!this.items_list[list]) this.items_list[list] = [];


                  if (list != 'others') {
                    let _target = data[key][items][_cat][list];

                    for (var item_lists in _target) {
                      // console.log(item_lists);

                      if (item_lists == "product_1") {
                        // debugger;
                        if (_target[item_lists].type == "Large") {
                          if (!this.items_list["tender_large"]) this.items_list["tender_large"] = [];
                          this.items_list["tender_large"].push(_target[item_lists]);
                        }

                        if (_target[item_lists].type == "Medium") {
                          if (!this.items_list["tender_medium"]) this.items_list["tender_medium"] = [];
                          this.items_list["tender_medium"].push(_target[item_lists]);
                        }
                      } else {
                        this.items_list[list].push(_target[item_lists]);
                      }
                    }
                  }
                }
              }
            }
          }

          // if (items == "greens") {
          //   if (data[key]['greens']) {
          //     for (var _green in data[key]['greens'].data) {
          //       console.log(data[key]['greens'].data[_green].count);
          //     }
          //   }
          // }

          // console.log(items);
          // console.log("itrem :: ");

          if (items == "tender") {
            // console.log("key :: " + key);
            // console.log(data[key]);

            if (data[key][items].category == "subs") {

              if (data[key][items].type == "Large") {

                if (!this.items_list[items + "_large"]) this.items_list[items + "_large"] = [];
                this.items_list[items + "_large"].push(data[key][items]);
              }

              if (data[key][items].type == "Medium") {
                if (!this.items_list[items + "_medium"]) this.items_list[items + "_medium"] = [];
                this.items_list[items + "_medium"].push(data[key][items]);
              }


            }
          }

          if (items == "milk") {
            if (data[key][items].category == "subs") {
              if (!this.items_list[items]) this.items_list[items] = [];
              this.items_list[items].push(data[key][items]);
            }
          }
        }
      }

      console.log(this.items_list);
      for (var key in this.items_list) {
        this.total_items[key] = {}
        for (var i = 0; i < this.items_list[key].length; i++) {

          if (!this.total_items[key][this.items_list[key][i].name]) this.total_items[key][this.items_list[key][i].name] = [];
          if (!this.total_items[key]["total"]) this.total_items[key]["total"] = 0;

          // console.log(this.items_list[key][i].name);
          // console.log("-------------");
          // 
          if (this.items_list[key][i].name == "Tender Coconut") {
            if (this.items_list[key][i].category == 'subs') {
              this.total_items[key][this.items_list[key][i].name].push(this.items_list[key][i].per_day);
            } else {
              this.total_items[key][this.items_list[key][i].name].push(this.items_list[key][i].quantity);
            }
            //update total
            if (!this.total_items[key][this.items_list[key][i].name]['total']) this.total_items[key][this.items_list[key][i].name]['total'] = 0;


            if (this.items_list[key][i].category == 'subs') {
              this.total_items[key][this.items_list[key][i].name]['total'] += this.items_list[key][i].per_day;
            } else {
              this.total_items[key][this.items_list[key][i].name]['total'] += this.items_list[key][i].quantity;
            }

          } else if (this.items_list[key][i].name == "Fresh Cow Milk") {

            if (this.items_list[key][i].category == 'subs') {
              this.total_items[key][this.items_list[key][i].name].push(this.items_list[key][i].per_day);
            } else {
              this.total_items[key][this.items_list[key][i].name].push(this.items_list[key][i].quantity);
            }

            //update total
            if (!this.total_items[key][this.items_list[key][i].name]['total']) this.total_items[key][this.items_list[key][i].name]['total'] = 0;

            if (this.items_list[key][i].category == 'subs') {
              this.total_items[key][this.items_list[key][i].name]['total'] += this.items_list[key][i].per_day;
            } else {
              this.total_items[key][this.items_list[key][i].name]['total'] += this.items_list[key][i].quantity;
            }
          } else {

            this.total_items[key][this.items_list[key][i].name].push(this.items_list[key][i].weight);
            //update total
            if (!this.total_items[key][this.items_list[key][i].name]['total']) this.total_items[key][this.items_list[key][i].name]['total'] = 0;
            this.total_items[key][this.items_list[key][i].name]['total'] += this.items_list[key][i].weight;
          }
        }
      }

      // console.log(this.total_items);
      var ffff = this.total_items;
      this._changeDet.detectChanges();
      // console.log("***********88");
      // debugger;

    });
  }

  overlayClickHandler() {

  }

  tabChanged(evt) {

  }

}
