import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { LoginService } from '../login.service';

@Injectable({
  providedIn: 'root'
})
export class CanActivateTeamService implements CanActivate {

  constructor(private authService: LoginService) { }

  canActivate() {
    console.log("can activate :: " + this.authService.isLoggedin());
    return this.authService.isLoggedin();
  }

  canDeactivate() {
    return !this.authService.isLoggedin();
  }
}

