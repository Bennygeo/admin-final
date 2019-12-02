import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonsService } from 'src/app/services/commons.service';
import { DateUtils } from 'src/app/utils/date-utils';
import { FireBase } from 'src/app/utils/firebase';
import { AngularFireDatabase } from 'angularfire2/database';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit, OnDestroy {


  //range picker
  options: any;

  delilvery_boy_subscriber: any;
  report: Report;
  reportAry: Array<Report> = [];
  rangepicker_data: any;
  trace: any;

  delivery_boys: Array<any> = [];
  todaysDate: any;
  todaysDateFormatted: any;
  listObservable: any;
  firebase: FireBase;

  //decalaration for stock entry
  stock_orange_nuts_cnt: any = 0;
  stock_large_nuts_cnt: any = 0;
  stock_small_nuts_cnt: any = 0;

  large_stock_price: any = 0;
  orange_stock_price: any = 0;
  small_stock_price: any = 0;

  total_stock_price: any = 0;

  disable_update_btn: boolean = false;
  stock_update_status: string = "";
  nut_types: any;

  //Report generation
  /*
  * Count of the today
  */
  large_nut_cnt: number = 0;
  small_nut_cnt: number = 0;
  orange_nut_cnt: number = 0;

  /*
  * Stock price
  */
  large_nut_price: number = 0;
  small_nut_price: number = 0;
  orange_nut_price: number = 0;

  /*
  * Actual rate of selling price
  */
  large_nut_selling_price: number = 50;
  small_nut_selling_price: number = 36.5;
  orange_nut_selling_price: number = 50;

  total_revenue: number = 0;
  total_profit: number = 0;
  /*
  * Expenses
  * Salary of a delivery boys/day
  */
  delivery_boys_salary: number = 200;
  monthly_rental: number = 4150;
  rent_per_day: number = 0;
  no_of_delivery_boys: number = 0;

  total_large_price: number = 0;
  total_small_price: number = 0;
  total_orange_price: number = 0;

  remaining_stock: number = 0;
  local_nut_cnt: number = 0;

  /*
  * replacements
  * compliments
  * Damage
  * comes under other_nut_cnt
  */
  other_nut_cnt: number = 0;

  //Observables
  read_stock: any;
  stock_report_data: any;

  //firebase data array
  stocks: Array<any> = [];
  stocks_copy: Array<any> = [];
  stocks_pricings: Array<any> = [];
  stocks_data: Object = {};

  stock_retry_cnt = 0;
  remaining_stocks: any = {
    large: 0, orange: 0, small: 0
  }

  yesterday_date: any = "";
  yesterday_date_formatted: string = "";
  yesterday_stock_report: any = {}

  /*
  * If nuts had been taken from two different stocks
  */
  stock_price_diff: any = {
    large: 0,
    small: 0,
    orange: 0
  }

  total_price: number = 0;
  tmp_cnt = 0;

  /*
  * This will be calculated based on the stock price
  */
  total_nut_price: any = {
    large: 0,
    orange: 0,
    small: 0
  }

  /*
  * Local sale variables
  */
  local_selling_large_nuts: any = '';
  local_selling_small_nuts: any = '';
  local_selling_orange_nuts: any = ''
  local_selling_price: any = '';
  local_sale_update_status: string = '';
  read_local_sale_subs: any;

  local_sales: any = {
    large: 0,
    large_price: 0,
    small: 0,
    small_price: 0,
    orange: 0,
    orange_price: 0
  }

  local_firebase_data: any;
  local_stocks: Array<any> = [];

  local_revenue: number = 0;

  constructor(
    private _service: CommonsService,
    private _dateUtils: DateUtils,
    private db: AngularFireDatabase,
    private _changeDet: ChangeDetectorRef
  ) {
    //retrieve nut types from service class
    this.nut_types = this._service.nutTypes;

    this.firebase = new FireBase(this.db);
    this.trace = console.log;

    let todayTime = new Date().getHours();

    if (todayTime <= 12) {
      this.todaysDate = new Date();
      this.yesterday_date = this._dateUtils.addDaysToCalendar(this.todaysDate, -1);
      this.yesterday_date_formatted = this._dateUtils.getDateString(this.yesterday_date, "");
      this.todaysDateFormatted = this._dateUtils.getDateString(new Date(), "");
    } else {
      this.todaysDate = new Date();
      this.yesterday_date = this._dateUtils.addDaysToCalendar(this.todaysDate, 0);
      this.yesterday_date_formatted = this._dateUtils.getDateString(this.yesterday_date, "");
      this.todaysDate = this._dateUtils.addDaysToCalendar(this.todaysDate, 0);
      this.todaysDateFormatted = this._dateUtils.getDateString(this._dateUtils.addDaysToCalendar(this.todaysDate, 1), "");
    }

    //daily rental
    this.rent_per_day = this.monthly_rental / this._dateUtils.daysInMonth(new Date().getMonth() + 1, new Date().getFullYear());
    // this.trace("this.rent_per_day :: " + this.rent_per_day);
  }

  ngOnInit() {
    console.log("Report init constructor.");
    /*
    * Read the delivery boys from firebase  
    */
    if (Object.keys(this._service.deliveryBoysList).length != 0) {
      this.delivery_boys = this._service.delivery_boys_list;
      this.deliveryBoysUpdate.call(this);
    } else {
      this.delilvery_boy_subscriber = this.firebase.readDeliverBoys().subscribe((data: any) => {
        for (let key in data) {
          this.delivery_boys.push(data[key]);
        }
        this.deliveryBoysUpdate.call(this);
      });
    }
    this.onLoad();
  }

  onLoad() {
    this.read_local_sale_subs = this.firebase.read_local_sales(this.todaysDateFormatted).subscribe((data: any) => {
      // debugger;
      this.local_firebase_data = data;
    });

    //Stocks data
    this.readStocks(new Date().getFullYear(), new Date().getMonth() + 1, (data) => {
      this.remaining_stocks = {
        large: 0, orange: 0, small: 0
      }
      let len = data.length;

      if (len == 0) return;
      this.trace("readStocks");

      //get the total stocks count
      let details = data[0];
      this.listObservable = this.firebase.readDailyOrders(this.todaysDateFormatted).subscribe((data: any) => {
        try {
          this.listObservable.unsubscribe();
        } catch (e) { }

        // this.trace("readDailyOrders");
        for (let key in data) {
          let _data = JSON.parse(data[key].tender);
          for (let _agents = 0; _agents < this.delivery_boys.length; _agents++) {
            // this.trace("_data.assigned_to :: " + _data.assigned_to);
            if (_data.assigned_to == this.delivery_boys[_agents]) {
              let _index = this.delivery_boys.indexOf(_data.assigned_to);
              // this.trace("_index :: " + _index);
              if (_data.type == "Large") {
                this.reportAry[_index].largeNuts++;
                this.large_nut_cnt++;
              }

              if (_data.type == "Medium") {
                this.reportAry[_index].smallNuts++;
                this.small_nut_cnt++;
              }

              if (_data.type == "Orange") {
                this.reportAry[_index].orangeNuts++;
                this.orange_nut_cnt++;
              }
              this.reportAry[_index].total++;
            }
          }
        }

        /*
              * Local sale data from firebase
              * Read the data and add it with the public appropriate nuts
              */
        for (let key in this.local_firebase_data) {

          if (this.local_firebase_data[key].large > 0) {
            this.local_sales['large'] += (this.local_firebase_data[key].large * 1);
          }

          if (this.local_firebase_data[key].small > 0) {
            this.local_sales['small'] += (this.local_firebase_data[key].small * 1);
          }

          if (this.local_firebase_data[key].orange > 0) {
            this.local_sales['orange'] += (this.local_firebase_data[key].orange * 1);
          }

          this.local_stocks.push({
            'large': this.local_sales['large'],
            'small': this.local_sales['small'],
            'orange': this.local_sales['orange'],
            // 'large_price': (this.local_firebase_data[key]['price'] * 1) / this.local_sales['large'],
            // 'small_price': (this.local_sales['small'] > 0) ? (this.local_firebase_data[key]['price'] * 1) / this.local_sales['small'] : 0,
            // 'orange_price': (this.local_sales['orange'] > 0) ? (this.local_firebase_data[key]['price'] * 1) / this.local_sales['orange'] : 0,
            'large_price': (this.local_firebase_data[key]['price'] * 1),
            'small_price': (this.local_sales['small'] > 0) ? (this.local_firebase_data[key]['price'] * 1) : 0,
            'orange_price': (this.local_sales['orange'] > 0) ? (this.local_firebase_data[key]['price'] * 1) : 0
          });

          //reset local_sales
          this.local_sales = {
            large: 0,
            large_price: 0,
            small: 0,
            small_price: 0,
            orange: 0,
            orange_price: 0
          }
        }

        /*
        * Overwrite the local sale variable to
        * get the total local sales individually and
        * then add it to large_nut_cnt and minus it from the stock
        * 
        */
        for (let key in this.local_stocks) {
          if (this.local_stocks[key]['large']) {
            this.local_sales['large'] += this.local_stocks[key]['large'];
          }
          if (this.local_stocks[key]['small']) {
            this.local_sales['small'] += this.local_stocks[key]['small'];
          }
          if (this.local_stocks[key]['orange']) {
            this.local_sales['orange'] += this.local_stocks[key]['orange'];
          }
        }

        // debugger;
        var nuts = ["large", "orange", "small"];
        var cnt = 0;

        for (var key in nuts) {
          cnt++;
          for (let i = this.stocks_copy.length - 1; i >= 0; i--) {
            let details = (this.stocks_copy[i]);
            if (details[nuts[key]] > 0) {
              var diff = details[nuts[key]] - (this[nuts[key] + "_nut_cnt"] + this.local_sales[nuts[key]]);

              if (diff >= 0) {
                console.log("Not exceeded.");
                // for (var j = i; j > 0; j--) {
                if (this.stocks_copy[i]) {
                  details = (this.stocks_copy[i]);
                  details[nuts[key]] -= (this[nuts[key] + "_nut_cnt"] + this.local_sales[nuts[key]]);
                  this.total_nut_price[nuts[key]] += (this[nuts[key] + "_nut_cnt"] + this.local_sales[nuts[key]]) * (details[nuts[key] + '_price'] * 1);
                  this.stocks_copy[i][nuts[key]] = details[nuts[key]];
                }
                break;
                // }
              } else {
                this.trace("Exceeded");
                this.total_nut_price[nuts[key]] += ((this[nuts[key] + "_nut_cnt"] + this.local_sales[nuts[key]]) + diff) * (this.stocks_copy[i][nuts[key] + '_price'] * 1);
                details[nuts[key]] = 0;

                if (this.stocks_copy[i]) {

                  this.stocks_copy[i][nuts[key]] = 0;

                  for (var j = i - 1; j >= 0; j--) {
                    if (this.stocks_copy[j]) {
                      details = (this.stocks_copy[j]);
                      //diff should be applied only once and it must be reset to 0.
                      if (diff < 0) {
                        details[nuts[key]] -= Math.abs(diff);
                        this.stock_price_diff[nuts[key]] = Math.abs(diff);
                        this.total_nut_price[nuts[key]] += Math.abs(diff) * (details[nuts[key] + '_price'] * 1);
                      } else {
                        this.total_nut_price[nuts[key]] += (this[nuts[key] + "_nut_cnt"] + this.local_sales[nuts[key]]) * (details[nuts[key] + '_price'] * 1);
                      }
                      diff = 0;
                      this.stocks_copy[j][nuts[key]] = details[nuts[key]];
                    }
                  }
                  break;
                }
              }
            }
          }

          if (cnt == 3) {
            this.stocks_copy.reverse();
            var cnt1 = -1;

            //write the array data into the object
            for (var yr in this.stocks_data) {
              for (var mnth in this.stocks_data[yr]) {
                for (var day in this.stocks_data[yr][mnth]) {
                  cnt1++;
                  this.stocks_data[yr][mnth][day] = this.stocks_copy[cnt1];
                  this.remaining_stocks['large'] += this.stocks_copy[cnt1].large * 1;
                  this.remaining_stocks['orange'] += this.stocks_copy[cnt1].orange * 1;
                  this.remaining_stocks['small'] += this.stocks_copy[cnt1].small * 1;

                  this.firebase.stock_remaining_update(yr, mnth, day, this.todaysDateFormatted, this.stocks_copy[cnt1], () => { });
                }
              }
            }

            for (var key in this.local_stocks)
              this.local_revenue += (this.local_stocks[key]['large_price'] * 1);

            //total revenue update
            this.total_revenue = (this.large_nut_cnt * this.large_nut_selling_price) + (this.small_nut_cnt * this.small_nut_selling_price) + (this.orange_nut_cnt * this.orange_nut_selling_price);
            //total price update
            this.total_price = (this.total_nut_price.large) + (this.total_nut_price.small) + (this.total_nut_price.orange);

            //total profit update
            this.total_profit = (this.total_revenue + this.local_revenue) - this.total_price - this.rent_per_day - (this.delivery_boys_salary * this.no_of_delivery_boys);

            /*
          * Write the todays stock report
          */
            this.firebase.daily_stock_status_update(this.todaysDateFormatted, {
              total: (this.large_nut_cnt + this.orange_nut_cnt + this.small_nut_cnt),
              remaining: JSON.stringify(this.remaining_stocks),
              large: this.large_nut_cnt,
              small: this.small_nut_cnt,
              orange: this.orange_nut_cnt,
              local: JSON.stringify(this.local_stocks),
              stock_total: this.total_nut_price.large,
              total_local: this.local_revenue,
              profit: this.total_profit,
              rent: this.rent_per_day,
              salary: (this.delivery_boys_salary * this.no_of_delivery_boys),
              others: this.other_nut_cnt
            });

            this._changeDet.detectChanges();

          }
        }
        this._changeDet.detectChanges();
      });
    });
  }

  readStocks(year, month, callback) {
    this.trace("readStocks .......................");
    /*
    * Read stock entry from firebase
    */
    this.read_stock = this.firebase.read_stock(year, month).subscribe((data: any) => {
      // this.trace("read stock");
      // debugger;
      this.tmp_cnt++;
      if (!data) {
        this.trace("No stocks exist!");
        // window.alert("No stocks exist!");
        callback([]);
        this.read_stock.unsubscribe();
        if (this.tmp_cnt > 5) return;
      }

      this.stocks_data[year] = {};
      this.stocks_data[year][month] = {};

      for (let key in data) {
        let _tmp_data = [];
        //sort the object by date wise
        let _dates = Object.keys(data[key].remaining).sort((a, b) => {
          return new Date(this._dateUtils.stdDateFormater(this._dateUtils.dateFormater(String(a), "-"), "/")).getTime() - new Date(this._dateUtils.stdDateFormater(this._dateUtils.dateFormater(String(b), "-"), "/")).getTime();
        });
        for (var key1 in _dates) {
          if (_dates[key1] != this.todaysDateFormatted) {
            this.trace("todays date");
            data[key].remaining[_dates[key1]].large_price = data[key].large_unit_price;
            data[key].remaining[_dates[key1]].small_price = data[key].small_unit_price;
            data[key].remaining[_dates[key1]].orange_price = data[key].orange_unit_price;
            _tmp_data.push(data[key].remaining[_dates[key1]]);
          }
        }
        if (_tmp_data.length == 0) {
          _tmp_data.push({
            'large': data[key].large_count,
            'small': data[key].small_count,
            'orange': data[key].orange_count,
            'large_price': data[key].large_unit_price,
            'small_price': data[key].small_unit_price,
            'orange_price': data[key].orange_unit_price,
          });
        }

        //write in an object
        this.stocks_data[year][month][key] = _tmp_data[_tmp_data.length - 1];
        this.stocks.push(_tmp_data[_tmp_data.length - 1]);
        this.stocks_copy.push(_tmp_data[_tmp_data.length - 1]);
        this.stocks_pricings.push({
          'large': data[key].large_unit_price,
          'orange': data[key].orange_unit_price,
          'small': data[key].small_unit_price
        });
      }
      this.stocks_pricings.reverse();
      this.stocks_copy.reverse();
      this.stocks.reverse();

      // this.trace("Line 503 :: " + this.stocks.length);
      if (this.stocks.length >= 2) {
        callback(this.stocks);
        try {
          this.read_stock.unsubscribe();
        } catch (e) { }
      }

      if (this.stocks.length < 2) {
        // this.trace("read stock < 2");
        // this.trace("this.stock_retry_cnt :: " + this.stock_retry_cnt);
        this.stock_retry_cnt++;
        if (this.stock_retry_cnt > 4) {
          callback(this.stocks);
          this.read_stock.unsubscribe();
        }
        // 
        if ((month - 1) >= 0) {
          this.stock_retry_cnt++;
          this.read_stock.unsubscribe();
          this.readStocks(new Date().getFullYear(), month - 1, callback);
        } else if (month <= 0) {
          this.stock_retry_cnt++;
          this.read_stock.unsubscribe();
          this.readStocks(new Date().getFullYear() - 1, 12, callback);
        }
      }
      this._changeDet.detectChanges();
    });
  }

  public selectedDateRangePicker(evt) {
    this.rangepicker_data = {
      evt: evt,
      start: evt.start._d.toDateString(),
      end: evt.end._d.toDateString()
    };
    let _diff = this._dateUtils.dateDiff(evt.start._d, evt.end._d);
    // this.trace("diff :: " + _diff);
  }

  stockChangeHandler() {
    this.total_stock_price = (this.stock_large_nuts_cnt * this.large_stock_price) + (this.stock_small_nuts_cnt * this.small_stock_price) + (this.stock_orange_nuts_cnt * this.orange_stock_price);
    // this.trace("stockUpdateHandler :: " + this.currentStockPrice);
  }

  stockUpdateHandler() {
    this.total_stock_price = (this.stock_large_nuts_cnt * this.large_stock_price) + (this.stock_small_nuts_cnt * this.small_stock_price) + (this.stock_orange_nuts_cnt * this.orange_stock_price);

    // this.todaysDateFormatted
    if (this.stock_large_nuts_cnt > 0) {
      this.stock_update_status = "Writing...";
      this.firebase.stock_update(new Date().getFullYear(), (new Date().getMonth() + 1), new Date().getDate(), {
        "total_price": this.total_stock_price,
        "large_unit_price": this.large_stock_price,
        "small_unit_price": this.small_stock_price,
        "orange_unit_price": this.orange_stock_price,
        "large_count": this.stock_large_nuts_cnt,
        "small_count": this.stock_small_nuts_cnt,
        "orange_count": this.stock_orange_nuts_cnt,
        "remaining": {
          [this.todaysDateFormatted]: {
            large: this.stock_large_nuts_cnt * 1,
            small: this.stock_small_nuts_cnt * 1,
            orange: this.stock_orange_nuts_cnt * 1
          }
        }
      }, () => {

        this.report;
        // debugger;
        for (var i = 0; i < this.delivery_boys.length; i++) {
          this.reportAry[i] = {
            name: this.delivery_boys[i],
            smallNuts: 0,
            largeNuts: 0,
            orangeNuts: 0,
            total: 0,
            replacements: 0,
            missed: 0,
            collection: 0
          }
        }

        this.stock_orange_nuts_cnt = 0;
        this.stock_large_nuts_cnt = 0;
        this.stock_small_nuts_cnt = 0;

        this.large_stock_price = 0;
        this.orange_stock_price = 0;
        this.small_stock_price = 0;

        this.total_stock_price = 0;

        this.disable_update_btn = true;
        this.nut_types;

        //Report generation
        /*
        * Count of the today
        */
        this.large_nut_cnt = 0;
        this.small_nut_cnt = 0;
        this.orange_nut_cnt = 0;

        /*
        * Stock price
        */
        this.large_nut_price = 0;
        this.small_nut_price = 0;
        this.orange_nut_price = 0;


        this.total_revenue = 0;
        this.total_profit = 0;

        this.rent_per_day = 0;

        this.total_large_price = 0;
        this.total_small_price = 0;
        this.total_orange_price = 0;

        this.remaining_stock = 0;
        this.local_nut_cnt = 0;

        /*
        * replacements
        * compliments
        * Damage
        * comes under other_nut_cnt
        */
        this.other_nut_cnt = 0;


        //firebase data array
        this.stocks = [];
        this.stocks_copy = [];
        this.stocks_pricings = [];
        this.stocks_data = {};

        this.stock_retry_cnt = 0;
        this.remaining_stocks = {
          large: 0, orange: 0, small: 0
        }

        this.stock_price_diff = {
          large: 0,
          small: 0,
          orange: 0
        }

        this.total_price = 0;
        this.tmp_cnt = 0;

        /*
        * This will be calculated based on the stock price
        */
        this.total_nut_price = {
          large: 0,
          orange: 0,
          small: 0
        }

        this.stock_update_status = "Success.";
        this.onLoad();
        // this._changeDet.detectChanges();
      });
      this.disable_update_btn = true;
    } else {
      alert("Large nut size is 0.")
    }
  }

  deliveryBoysUpdate() {
    this.delivery_boys = this._service.delivery_boys_list;
    this.no_of_delivery_boys = this.delivery_boys.length;

    for (var i = 0; i < this.delivery_boys.length; i++) {
      this.reportAry[i] = {
        name: this.delivery_boys[i],
        smallNuts: 0,
        largeNuts: 0,
        orangeNuts: 0,
        total: 0,
        replacements: 0,
        missed: 0,
        collection: 0
      }
    }
    this.stock_update_status = "";
    try {
      this.delilvery_boy_subscriber.unsubscribe();
    } catch (e) { }
    // this._changeDet.detectChanges();
  }

  localSaleHandler() {
    this.local_sale_update_status = "...";
  }

  stockLocalUpdateHandler() {
    if ((this.local_selling_large_nuts > 0 || this.local_selling_small_nuts > 0 || this.local_selling_orange_nuts > 0) && this.local_selling_price > 0) {
      this.local_sale_update_status = "Writing...";
      this.firebase.local_sale_update(this.todaysDateFormatted, new Date().getTime(), {
        'large': this.local_selling_large_nuts,
        'small': this.local_selling_small_nuts,
        'orange': this.local_selling_orange_nuts,
        'price': this.local_selling_price
      }, () => {
        // this.stock_update_status = "Saved";
        this.local_selling_large_nuts = '';
        this.local_selling_small_nuts = '';
        this.local_selling_orange_nuts = '';
        this.local_selling_price = '';
        this.local_sale_update_status = "Saved..";
        window.setTimeout(() => {
          this.local_sale_update_status = "...";
        }, 3000)
        this._changeDet.detectChanges();
      });
    } else {
      alert("Enter a valid sale!");
    }
  }

  ngOnDestroy(): void {
    this.read_stock.unsubscribe();
    try {
      this.read_local_sale_subs.unsubscribe();
    } catch (e) { }
  }
}

class Report {
  name: string;
  smallNuts: number = 0;
  largeNuts: number = 0;
  orangeNuts: number = 0;
  replacements: number = 0;
  missed: number = 0;
  total: number = 0;
  collection: number = 0;
  constructor() { }
}
