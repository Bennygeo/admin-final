import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonsService } from 'src/app/services/commons.service';
import { DateUtils } from 'src/app/utils/date-utils';
import { FireBase } from 'src/app/utils/firebase';
import { AngularFireDatabase } from 'angularfire2/database';
import { NuType } from 'src/app/utils/utils';
import { AnonymousSubject } from 'rxjs/internal/Subject';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {

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

  noOfStocks: any = "";
  stockUnitPrice: any = "";
  stockOrangeNuts: number = 0;
  currentStockPrice: number = 0;
  disable_update_btn: boolean = false;
  stock_update_status: string = "";
  nut_types: any;

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
    this.delilvery_boy_subscriber = this._service.deliveryBoysUpdate.subscribe((data) => {
      this.delivery_boys = this._service.delivery_boys_list;

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
      this.delilvery_boy_subscriber.unsubscribe();
      this._changeDet.detectChanges();
    });

    let todayTime = new Date().getHours();
    // debugger;
    if (todayTime <= 16) {
      this.todaysDate = new Date();
      this.todaysDateFormatted = this._dateUtils.getDateString(this.todaysDate, "");
    } else {
      this.todaysDate = new Date();
      this.todaysDate = this._dateUtils.addDays(this.todaysDate, 0);
      this.todaysDateFormatted = this._dateUtils.getDateString(this._dateUtils.addDays(this.todaysDate, 1), "");
    }

    this.listObservable = this.firebase.readDailyOrders(this.todaysDateFormatted).subscribe((data: any) => {
      
      for (let key in data) {
        let _data = JSON.parse(data[key].tender);
        for (let _agents = 0; _agents < this.delivery_boys.length; _agents++) {
          if (_data.assigned_to == this.delivery_boys[_agents]) {
            let _index = this.delivery_boys.indexOf(_data.assigned_to);
            // this.trace("_index :: " + _index);
            // debugger;
            if (_data.type == "Large") {
              this.reportAry[_index].largeNuts++;
            }

            if (_data.type == "Medium") {
              this.reportAry[_index].smallNuts++;
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
      // debugger;
      for (var key in this.reportAry) {

      }
      this._changeDet.detectChanges();
    });
  }

  ngOnInit() {
    console.log("Report init constructor.");

  }

  public selectedDateRangePicker(evt, data) {
    console.log(evt, data);
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
    this.currentStockPrice = (this.noOfStocks * this.stockUnitPrice);
    // this.trace("stockUpdateHandler :: " + this.currentStockPrice);
  }

  stockUpdateHandler() {
    this.currentStockPrice = (this.noOfStocks * this.stockUnitPrice);
    this.stock_update_status = "Writing...";
    // this.trace("stockUpdateHandler :: " + this.currentStockPrice);
    this.firebase.stock_price_update(new Date().getTime(), {
      "count": this.noOfStocks,
      "total_price": this.currentStockPrice,
      "unit_price": this.stockUnitPrice,
      "regular": "",
      "medium": "",
      "orange": this.stockOrangeNuts
    }, () => {
      this.currentStockPrice = 0;
      this.stockUnitPrice = 0;
      this.stockOrangeNuts = 0;
      this.noOfStocks = 0;
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
