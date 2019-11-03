import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonsService } from 'src/app/services/commons.service';
import { DateUtils } from 'src/app/utils/date-utils';
import { FireBase } from 'src/app/utils/firebase';
import { AngularFireDatabase } from 'angularfire2/database';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {

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

  daily_large_nuts_cnt: any = 0;
  daily_orange_nuts_cnt: any = 0;
  daily_small_nuts_cnt: any = 0;

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

  stock_retry_cnt = 0;
  remaining_stocks: any = {
    large: 0, orange: 0, small: 0
  }

  yesterday_date: any = "";
  yesterday_date_formatted: string = "";
  yesterday_stock_report: any = {}

  stock_price_diff: any = {
    large: 0,
    small: 0,
    orange: 0
  }

  total_price: number = 0;

  // stock_large_nuts_cnt: any = 0;
  // stock_orange_nuts_cnt: any = 0;
  // stock_small_nuts_cnt: any = 0;

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
      this.yesterday_date = this._dateUtils.addDays(this.todaysDate, -1);
      this.yesterday_date_formatted = this._dateUtils.getDateString(this.yesterday_date, "");
      this.todaysDateFormatted = this._dateUtils.getDateString(this.todaysDate, "");
    } else {
      this.todaysDate = new Date();
      this.yesterday_date = this._dateUtils.addDays(this.todaysDate, 0);
      this.yesterday_date_formatted = this._dateUtils.getDateString(this.yesterday_date, "");
      this.todaysDate = this._dateUtils.addDays(this.todaysDate, 0);
      this.todaysDateFormatted = this._dateUtils.getDateString(this._dateUtils.addDays(this.todaysDate, 1), "");
    }

    //daily rental
    this.rent_per_day = this.monthly_rental / this._dateUtils.daysInMonth(new Date().getMonth() + 1, new Date().getFullYear());
    // this.trace("this.rent_per_day :: " + this.rent_per_day);
  }

  ngOnInit() {
    console.log("Report init constructor.");
    if (Object.keys(this._service.deliveryBoysList).length != 0) {
      this.delivery_boys = this._service.delivery_boys_list;
      deliveryBoysUpdate.call(this);
    } else {
      this.delilvery_boy_subscriber = this.firebase.readDeliverBoys().subscribe((data: any) => {
        for (let key in data) {
          this.delivery_boys.push(data[key]);
        }
        deliveryBoysUpdate.call(this);
      });
    }

    //Stocks data
    this.readStocks(new Date().getFullYear(), new Date().getMonth() + 1, (data) => {
      this.remaining_stocks = {
        large: 0, orange: 0, small: 0
      }
      let len = data.length;
      if (len == 0) return;
      this.trace("readStocks");

      //get the total stocks count
      let details = JSON.parse(data[0].remaining);
      this.remaining_stocks.large = details.large * 1;
      this.remaining_stocks.small = details.small * 1;
      this.remaining_stocks.orange = details.orange * 1;

      /*
      * Read yesterday stock report from firebase
      */
      this.stock_report_data = this.firebase.read_stock_status_update_by_date(this.yesterday_date_formatted).subscribe((data: any) => {
        if (data) {
          this.yesterday_stock_report = JSON.parse(data['remaining']);
          // debugger;

          //updtae the remaining stocks
          this.remaining_stocks = {
            large: this.yesterday_stock_report.large - this.large_nut_cnt,
            small: this.yesterday_stock_report.small - this.small_nut_cnt,
            orange: this.yesterday_stock_report.orange - this.orange_nut_cnt
          }
        } else {

          this.remaining_stocks = {
            large: this.remaining_stocks.large - this.large_nut_cnt,
            small: this.remaining_stocks.small - this.small_nut_cnt,
            orange: this.remaining_stocks.orange - this.orange_nut_cnt
          }
        }

        /*
          * Write the todays stock report
          */
        this.firebase.daily_stock_status_update(this.todaysDateFormatted, {
          total: (this.large_nut_cnt + this.orange_nut_cnt + this.small_nut_cnt),
          remaining: JSON.stringify(this.remaining_stocks),
          large: this.large_nut_cnt,
          small: this.small_nut_cnt,
          orange: this.orange_nut_cnt,
          local: this.local_nut_cnt,
          others: this.other_nut_cnt
        });

        /*
        * write stock status update
        * get the nut price from stock (if the stock gets empty read from next stock update it)
        * 
        */

        if (this.stocks.length > 1) {
          if ((this.remaining_stocks.large - (this.stocks[1].large_count * 1)) > this.stocks[1].large_count * 1) {
            this.large_nut_price = this.stocks[1].large_unit_price;
          } else if ((this.remaining_stocks.large - (this.stocks[1].large_count * 1)) < this.stocks[1].large_count * 1) {
            this.large_nut_price = this.stocks[0].large_unit_price;
          }

          if ((this.remaining_stocks.small - (this.stocks[1].small_count * 1)) > this.stocks[1].small_count * 1) {
            this.small_nut_price = this.stocks[1].small_unit_price;
          } else if ((this.remaining_stocks.small - (this.stocks[1].small_count * 1)) < this.stocks[1].small_count * 1) {
            this.small_nut_price = this.stocks[0].small_unit_price;
          }

          if ((this.remaining_stocks.orange - (this.stocks[1].orange_count * 1)) > this.stocks[1].orange_count * 1) {
            this.orange_nut_price = this.stocks[1].orange_unit_price;
          } else if ((this.remaining_stocks.orange - (this.stocks[1].orange_count * 1)) < this.stocks[1].orange_count * 1) {
            this.orange_nut_price = this.stocks[0].orange_unit_price;
          }

          /* 
          * Stocks will have different pricing. 
          * When current stock got empty and while moving to next we should have the difference to move further. 
          */
          this.stock_price_diff = {
            large: (this.remaining_stocks.large - (this.stocks[1].large_count * 1)),
            small: (this.remaining_stocks.small - (this.stocks[1].small_count * 1)),
            orange: (this.remaining_stocks.orange - (this.stocks[1].orange_count * 1))
          }

          let stocks_copy = this.stocks.splice(0).reverse();

          /*
          * If difference in stock
          */
          let updateStock = (data1, data2, diff) => {
            let stock_1 = JSON.parse(stocks_copy[data1].remaining);
            let stock_2 = JSON.parse(stocks_copy[data2].remaining);

            stock_1.large = 0;
            stock_2.large = stock_2.large - diff - this.large_nut_cnt;
          }

          for (let i = 0; i <= stocks_copy.length; i++) {
            let data = JSON.parse(stocks_copy[i].remaining);
            if (data.large != 0) {
              let diff = data.large - this.large_nut_cnt;
              if (Math.sign(diff) == -1) {
                updateStock(stocks_copy[i], stocks_copy[i + 1], diff);
              } else {
                data.large = data.large - this.large_nut_cnt;
              }
            }

            if (data.small! = 0) {
              let diff = data.small - this.small_nut_cnt;
              if (Math.sign(diff) == -1) {
                updateStock(stocks_copy[i], stocks_copy[i + 1], diff);
              } else {
                data.small = data.small - this.small_nut_cnt;
              }
            }

            if (data.orange! = 0) {
              let diff = data.orange - this.orange_nut_cnt;
              if (Math.sign(diff) == -1) {
                updateStock(stocks_copy[i], stocks_copy[i + 1], diff);
              } else {
                data.orange = data.orange - this.orange_nut_cnt;
              }
            }
          }


        } else if (this.stocks.length == 1) {
          /*
          * When we have only one stock
          */
          this.large_nut_price = this.stocks[0].large_unit_price;
          this.small_nut_price = this.stocks[0].small_unit_price;
          this.orange_nut_price = this.stocks[0].orange_unit_price;

          this.remaining_stocks.large = this.stocks[0].large_count;
          this.remaining_stocks.small = this.stocks[0].small_count;
          this.remaining_stocks.orange = this.stocks[0].orange_count;

          this.stock_price_diff = {
            large: this.remaining_stocks.large,
            small: (this.remaining_stocks.small),
            orange: (this.remaining_stocks.orange)
          }

          /*
          * When we have no stocks
          */
        } else {
          this.trace("No stocks exist!");
        }

        //total revenue update
        this.total_revenue = (this.large_nut_cnt * this.large_nut_selling_price) + (this.small_nut_cnt * this.small_nut_selling_price) + (this.orange_nut_cnt * this.orange_nut_selling_price);
        //total price update
        this.total_price = (this.large_nut_cnt * this.large_nut_price) + (this.small_nut_cnt * this.small_nut_price) + (this.orange_nut_cnt * this.orange_nut_price);

        //total profit update
        this.total_profit = this.total_revenue - this.total_price - this.rent_per_day - (this.delivery_boys_salary * this.no_of_delivery_boys);

        this._changeDet.detectChanges();
        this.stock_report_data.unsubscribe();
      });
    });

    // this.delilvery_boy_subscriber = this._service.deliveryBoysUpdate.subscribe((data) => {
    //   this.trace("deliveryBoysUpdate");
    // });

    /*
    * Read the delivery boys from firebase  
    */
    function deliveryBoysUpdate() {
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

    this.listObservable = this.firebase.readDailyOrders(this.todaysDateFormatted).subscribe((data: any) => {
      this.trace("readDailyOrders");
      for (let key in data) {
        let _data = JSON.parse(data[key].tender);
        for (let _agents = 0; _agents < this.delivery_boys.length; _agents++) {
          if (_data.assigned_to == this.delivery_boys[_agents]) {
            let _index = this.delivery_boys.indexOf(_data.assigned_to);
            // this.trace("_index :: " + _index);
            // debugger;
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

            // if (_data.nut_variety == "Orange") {
            //   this.reportAry[_index].orangeNuts++;
            // }

            // if (_data.nut_variety == "Orange") {
            //   this.reportAry[_index].orangeNuts++;
            // }
          }
        }
      }
      for (let i = this.stocks.length - 1; i >= 0; i--) {
        // debugger;
        let details = JSON.parse(this.stocks[i].remaining);
        if (details.large > 0) {

          var diff = details.large - this.large_nut_cnt;
          if (diff >= 0) {
            console.log("Not exceeded.");
            details.large -= this.large_nut_cnt;

            for (var j = i; j >= 0; j--) {
              if (this.stocks[j]) {
                details = JSON.parse(this.stocks[j].remaining);
                details.large -= this.large_nut_cnt;
              }
            }
            // if (this.stocks[i - 2]) {
            //   details = JSON.parse(this.stocks[i - 2].remaining);
            //   details.large -= this.large_nut_cnt;
            // }

          } else {
            this.trace("Exceeded");
            details.large = 0;
            if (this.stocks[i - 1]) {
              details = JSON.parse(this.stocks[i - 1].remaining);
              details.large -= diff;
              details.large -= this.large_nut_cnt;
            }

            if (this.stocks[i - 2]) {
              details = JSON.parse(this.stocks[i - 2].remaining);
              details.large -= this.large_nut_cnt;
            }
          }
          break;
        }

        if (details.orange > 0) {
          details.orange -= this.orange_nut_cnt;
        }

        if (details.small > 0) {
          details.small -= this.small_nut_cnt;
        }
        // console.log();
      }
      // debugger;
      this._changeDet.detectChanges();
    });



  }

  readStocks(year, month, callback) {

    /*
    * Read stock entry from firebase
    */
    this.read_stock = this.firebase.read_stock(year, month).subscribe((data: any) => {
      // this.trace("read stock");
      if (!data) {
        this.trace("No stocks exist!");
        // window.alert("No stocks exist!");
        callback([]);
        this.read_stock.unsubscribe();
      }

      for (let key in data) {
        this.stocks.push(data[key]);
      }
      this.stocks.reverse();

      if (this.stocks.length >= 2) {
        callback(this.stocks);
        this.read_stock.unsubscribe();
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
    console.log(evt);
    // debugger;
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
    this.stock_update_status = "Writing...";

    // debugger;
    // this.todaysDateFormatted
    this.firebase.stock_update(new Date().getFullYear(), (new Date().getMonth() + 1), new Date().getDate(), {
      "total_price": this.total_stock_price,
      "large_unit_price": this.large_stock_price,
      "small_unit_price": this.small_stock_price,
      "orange_unit_price": this.orange_stock_price,
      "large_count": this.stock_large_nuts_cnt,
      "small_count": this.stock_small_nuts_cnt,
      "orange_count": this.stock_orange_nuts_cnt,
      "remaining": JSON.stringify({
        large: this.stock_large_nuts_cnt * 1 + (this.remaining_stocks.large * 1),
        small: this.stock_small_nuts_cnt * 1 + (this.remaining_stocks.small * 1),
        orange: this.stock_orange_nuts_cnt * 1 + (this.remaining_stocks.orange * 1)
      })
    }, () => {
      this.total_stock_price = 0;
      this.stock_large_nuts_cnt = 0;
      this.stock_orange_nuts_cnt = 0;
      this.stock_small_nuts_cnt = 0;

      this.large_stock_price = 0;
      this.small_stock_price = 0;
      this.orange_stock_price = 0;

      this.stock_update_status = "Success.";
      this._changeDet.detectChanges();
    });
    this.disable_update_btn = true;
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
