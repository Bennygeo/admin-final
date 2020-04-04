import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from './utils/storage.service';
import { LoginService } from './login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'Thinkspot admin';
  localStorage: any;

  constructor(private _router: Router,
    private _storageService: StorageService,
    private _loginService: LoginService
  ) {
    this.localStorage = this._storageService.readData('thinkspot_login');
  }

  ngOnInit() {
    if (this.localStorage) {
      this.localStorage = JSON.parse(this.localStorage);

      if (this.localStorage.who == 'admin') {
        this._loginService.setLoginStatus('admin', true);
        this._router.navigate(["admin/update_price"]);
      } else if (this.localStorage.who == 'agent') {
        this._loginService.setLoginStatus('agent', true);
        this._router.navigate(["delivery", { name: this.localStorage.name, mno: this.localStorage.target }]);
      } else {
        this._loginService.setLoginStatus('agent', false);
      }
    }
  }
}
