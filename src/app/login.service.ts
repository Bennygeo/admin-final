import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  logged: boolean = true;
  who: string = "";

  constructor() { }

  setLoginStatus(who, logged): void {
    this.who = who;
    this.logged = logged;
  }

  isLoggedin(): boolean {
    return this.logged;
  }

}
