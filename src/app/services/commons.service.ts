import { Injectable, EventEmitter, OnDestroy } from '@angular/core';
import { FireBase } from '../utils/firebase';
import { AngularFireDatabase } from 'angularfire2/database';
import { MatSnackBar } from '@angular/material';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as $ from 'jquery';
import { environment } from 'src/environments/environment';
import { Options } from 'selenium-webdriver';

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
  historyLength: number = 0;

  private _fb: FireBase;

  constructor(
    private _snackBar: MatSnackBar,
    private _db: AngularFireDatabase,
    private http: HttpClient
  ) {
    this._fb = new FireBase(this._db);
  }

  public openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 1000,
    });
  }

  public readCustomerList(flg) {
    //if flg is false and length is 0 read from firebase 
    //else return the local object
    // debugger;
    console.log("readCustomerList " + flg);
    if (!flg && Object.keys(this.userList).length != 0) {
      window.setTimeout((val) => {
        this.onUserListUpdate.emit(val);
        console.log("user list emit 1");
      }, 0, this.userList);
    } else {
      this._fb.readUsers().subscribe((val: any) => {
        this.userList = val;
        window.setTimeout((val) => {
          this.onUserListUpdate.emit(val);
          console.log("user list emit 1");
        }, 0, val);
        // this.onUserListUpdate.emit(val);
      });
    }
  }

  public readOrdersList() {
    this._fb.readOrders("9486140936").subscribe((val: any) => {
      // debugger;
      this.orders = val;
      window.setTimeout((val) => {
        this.userOrdersUpdate.emit(val);
      }, 0, val);
    });
  }

  public readDeliverBoys() {
    // this._fb.readDeliverBoys().subscribe((data: any) => {
    //   this.deliveryBoysList = data;
    // });
  }

  send_bulk_sms(data) {
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
