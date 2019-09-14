import { Component, OnInit, NgZone, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'order-view',
  templateUrl: './order-view.component.html',
  styleUrls: ['./order-view.component.scss']
})
export class OrderViewComponent implements OnInit, OnDestroy {

  data: any;
  sub: any;
  overlay: boolean = false;
  priceVal: number = 0;

  constructor(
    private _ngZone: NgZone,
    private _router: Router,
    private _location: Location,
    private _activatedRoute: ActivatedRoute,
    private _changeDet: ChangeDetectorRef
  ) {
    console.log("order view constructor.");
    this.sub = this._router.events.subscribe((data: any) => {
      try {
        this.data = JSON.parse(data.snapshot.params.data);
        this._changeDet.detectChanges();
      } catch (e) { }
    });

  }

  ngOnInit() {
    console.log("init");
  }

  clickToGoBack() {
    // this._router.navigate(["/delivery/"]);
    this._location.back();
  }

  deliveredAction(): void {

  }

  notDeliveredAction(): void {

  }

  payAction(): void {
    // console.log("pay action");
    (this.overlay) ? this.overlay = false : this.overlay = true;
    this._ngZone.run(() => { console.log("onosdf") });
  }

  modalSaveAction() {

  }

  modalCancelAction() {
    (this.overlay) ? this.overlay = false : this.overlay = true;
  }


  overlayClickHandler(): void {
    console.log("overlayClickHandler");
    (this.overlay) ? this.overlay = false : this.overlay = true;
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
