import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { LoginService } from '../login.service';

@Injectable({
  providedIn: 'root'
})
export class CanActivateTeamService implements CanActivate {

  constructor(private authService: LoginService) { }

  canActivate() {
    return this.authService.isLoggedin();
  }
}

