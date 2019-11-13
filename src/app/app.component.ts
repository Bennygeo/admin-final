import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from './utils/storage.service';
import { LoginService } from './login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Thinkspot admin';
  localStorage: any;

  constructor(private _router: Router,
    private _storageService: StorageService,
    private _loginService: LoginService
  ) {
    this.localStorage = this._storageService.readData('thinkspot_login');
    if (this.localStorage) {
      this.localStorage = JSON.parse(this.localStorage);

      if (this.localStorage.who == 'admin') {
        this._router.navigate(["admin/customer_list"]);
        this._loginService.setLoginStatus('admin', !true);
      } else if (this.localStorage.who == 'agent') {
        this._loginService.setLoginStatus('agent', !true);
      } else {
        this._loginService.setLoginStatus('agent', !false);
      }
    }
    this._loginService.setLoginStatus('agent', !false);
  }
}
