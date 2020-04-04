import { Component, OnInit, Input, ChangeDetectorRef, NgZone, ViewChild } from '@angular/core';
import { CommonsService } from 'src/app/services/commons.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'product-view',
  templateUrl: './product-view.component.html',
  styleUrls: ['./product-view.component.scss']
})
export class ProductViewComponent implements OnInit {

  @Input() data: Object = {};
  unit_list: Array<Object>;

  constructor(
    private _service: CommonsService,
    private _changeDet: ChangeDetectorRef,
    private _ngZone: NgZone,
  ) {

  }

  ngOnInit() {
    this.unit_list = this._service.unit_list;

  }

  onUnitSelect(val) {
    // console.log("unit select");

    console.log("val : " + val);
    // this._changeDet.detectChanges();
    this._ngZone.run(() => { });
  }

  updateProduct() {

  }

  mousedownAction(evt) {
    console.log("mouse down");
    this._ngZone.run(() => { });
    // this._changeDet.detectChanges();
  }
}
