import { Injectable, EventEmitter, NgZone } from '@angular/core';
import { FireBase } from '../utils/firebase';
import { AngularFireDatabase } from 'angularfire2/database';
import { MatSnackBar } from '@angular/material';
import * as $ from 'jquery';
import { environment } from 'src/environments/environment';
import { NuType } from '../utils/utils';

@Injectable({
  providedIn: 'root'
})
export class CommonsService {

  userList: Object = {};
  orders: Object = {};
  deliveryBoysList: Object = {};

  onUserListUpdate: EventEmitter<any> = new EventEmitter();
  userOrdersUpdate: EventEmitter<any> = new EventEmitter();
  sendCustomerMsg: EventEmitter<any> = new EventEmitter();
  deliveryBoysUpdate: EventEmitter<any> = new EventEmitter();
  historyLength: number = 0;

  private firebase: FireBase;
  delivery_boys_observable: any;
  delivery_boys_list: Array<String> = [];

  nutTypes: Array<NuType> = [
    { value: "Large", viewValue: 1, price: 45, minCount: 2 },
    { value: "Medium", viewValue: 2, price: 31.5, minCount: 3 },
  ];

  constructor(
    private _snackBar: MatSnackBar,
    private _db: AngularFireDatabase,
    private _change_det: NgZone
  ) {
    this.firebase = new FireBase(this._db);
    // console.log("common service emit..");
    this.delivery_boys_observable = this.firebase.readDeliverBoys().subscribe((data: any) => {
      // debugger;
      for (let key in data) {
        this.delivery_boys_list.push(data[key]);
      }
      this.deliveryBoysUpdate.emit(this.delivery_boys_list);
    });
  }

  public openSnackBar(message: string, action: string) {
    // this._snackBar.dismiss();
    this._snackBar.open(message, action, {
      duration: 1000,
    });
    this._change_det.run(() => { });
  }

  public readCustomerList(flg) {
    //if flg is false and length is 0 read from firebase 
    //else return the local object
    // debugger;
    // console.log("readCustomerList " + flg);
    if (!flg && Object.keys(this.userList).length != 0) {
      window.setTimeout((val) => {
        this.onUserListUpdate.emit(val);
        // console.log("user list emit 1");
      }, 0, this.userList);
    } else {
      this.firebase.readUsers().subscribe((val: any) => {
        this.userList = val;
        window.setTimeout((val) => {
          this.onUserListUpdate.emit(val);
          // console.log("user list emit 1");
        }, 0, val);
        // this.onUserListUpdate.emit(val);
      });
    }
  }

  public readDeliverBoys() {
    // this._fb.readDeliverBoys().subscribe((data: any) => {
    //   this.deliveryBoysList = data;
    // });
  }

  send_bulk_sms(data, callBack) {
    // console.log(data);
    // let headerOptions = new HttpHeaders();
    // headerOptions.append('Access-Control-Allow-Origin', '*');
    // headerOptions.append('Access-Control-Allow-Origin', 'http://thinkspot.in/');
    // headerOptions.append('Access-Control-Request-Headers', '*');
    // headerOptions.append('Content-Type', 'application/json');
    // headerOptions.append('Access-Control-Allow-Methods', 'POST');


    // const httpParams = new URLSearchParams();
    // httpParams.set('mobile', data.mobile_nos[0]);
    // httpParams.set('name', data.fName);
    // httpParams.set('otp', '0936');
    // // debugger;
    // console.log("envronment url");
    // console.log(environment.url);
    // // this.http.post(environment.url + 'otp.php', httpParams).subscribe(() => {
    // //   console.log("sucess");
    // // }, (error) => {
    // //   console.log("Error");
    // // });

    // this.http.post(environment.url + "otp.php", httpParams).subscribe(() => {
    //   console.log("sucess");
    // }, (error) => {
    //   console.log("Error");
    // });


    var request = $.ajax({
      url: environment.url + "bulk_sms.php",
      type: "POST",
      // contentType: "application/json",
      data: {
        name: data.fName,
        mobile: data.mobile_nos,
        content: data.content,
        // otp: '333'
      }
    });

    request.done(function (response, textStatus, jqXHR) {
      // Log a message to the console
      console.log("bulk sms, it worked!");
      callBack();
      // debugger;
    });

    // Callback handler that will be called on failure
    request.fail(function (jqXHR, textStatus, errorThrown) {
      // Log the error to the console
      console.error(
        "The following error occurred: " +
        textStatus, errorThrown
      );
    });
  }

}
