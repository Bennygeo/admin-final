import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'order-view',
  templateUrl: './order-view.component.html',
  styleUrls: ['./order-view.component.scss']
})
export class OrderViewComponent implements OnInit {

  constructor(
    private _ngZone: NgZone,
    private _router: Router,
    private _location: Location
  ) { }

  ngOnInit() {
    console.log("init");
    this._ngZone.run(() => { console.log("onosdf") });
  }

  clickToGoBack() {
    // this._router.navigate(["/delivery/"]);
    this._location.back();
  }

}
