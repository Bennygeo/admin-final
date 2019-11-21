import { Component, OnInit } from '@angular/core';
import { FireBase } from '../utils/firebase';
import { AngularFireDatabase } from 'angularfire2/database';
import { Router } from '@angular/router';
import { LoginService } from '../login.service';
import { StorageService } from '../utils/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  fb: FireBase;
  deliveryBoysObservale: any;
  credentialOwner: string = "";
  pswdFlg: boolean = false;
  loginData: any;
  username: any;
  pswd: string;
  submit_btn_disable: boolean = false;
  pswdErr: boolean = false;

  constructor(
    private _db: AngularFireDatabase,
    private _router: Router,
    private _loginSerice: LoginService,
    private _storageService: StorageService
  ) {
    this.fb = new FireBase(this._db);
  }

  ngOnInit() {
    this.deliveryBoysObservale = this.fb.readLoginDetails().subscribe((data) => {
      // debugger;
      this.loginData = data;
    });
  }

  onLoginAction(evt) {
    let flg = false;
    this.pswdErr = false;
    this.credentialOwner = "Invalid user ID."

    if (this.loginData[this.username]) {
      // console.log(this.username, this.pswd);
      flg = true;
      this.credentialOwner = "Hello " + this.loginData[this.username].name + "!";
      this.pswdFlg = true;
    } else {
      this.credentialOwner = "Invalid user ID."
      this.pswdFlg = false;
    }

    if (flg) {
      // console.log("this.pswd :: " + this.pswd);
      if (this.username == "9486140936" || this.username == "8072129358") {
        if (this.pswd == this.loginData[this.username].pswd) {
          // console.log("Good");
          this.submit_btn_disable = true;
          this._loginSerice.setLoginStatus('admin', true);
          this._router.navigate(["admin/customer_list"]);
          this._storageService.writeData("thinkspot_login", { who: 'admin', isLogged: true, target: this.username, name: 'admin' });
        } else if (this.pswd == undefined || this.pswd == "") {
          console.log("Empty");
          this._loginSerice.setLoginStatus('admin', false);
          // this._storageService.writeData("thinkspot_login", { who: 'admin', isLogged: false, target: this.username, name: this.loginData[this.username].name });
          this.pswdErr = false;
        } else {
          // console.log("Bad");
          this.pswdErr = true;
          this._loginSerice.setLoginStatus('admin', false);
          // this._storageService.writeData("thinkspot_login", { who: 'admin', isLogged: false, target: this.username });
        }
      } else if (this.username == "8870029847" || this.username == "9500948808" || this.username == "9884380539" || this.username == "6382942615") {
        if (this.pswd == this.loginData[this.username].pswd) {
          // console.log("delivery boy logged");
          this.submit_btn_disable = true;
          this._loginSerice.setLoginStatus('agent', true);
          this._storageService.writeData("thinkspot_login", { who: 'agent', isLogged: true, target: this.username, name: this.loginData[this.username].name });
          this._router.navigate(["delivery", { name: this.loginData[this.username].name, mno: this.username }]);
        } else {
          // console.log("delivery boy logged :: error");
          this.pswdErr = true;
          this._loginSerice.setLoginStatus('agent', false);
          // this._storageService.writeData("thinkspot_login", { who: 'agent', isLogged: false, target: this.username, name: this.loginData[this.username].name });
        }
      }
    }
    return false;
  }

  onFocusAction() {
    // console.log("focus");
    // this.credentialOwner = "";
    // this.username = "8870029847";
    // this.username = "9486140936";
    // this.username = "9884380539";
    // this.username = "";
    this.pswdErr = false;
  }

  ngOnDestroy(): void {
    this.deliveryBoysObservale.unsubscribe();
    // throw new Error("Method not implemented.");
  }

}
