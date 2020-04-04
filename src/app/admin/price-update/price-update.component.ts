import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FireBase } from 'src/app/utils/firebase';
import { AngularFireDatabase } from 'angularfire2/database';

@Component({
  selector: 'price-update',
  templateUrl: './price-update.component.html',
  styleUrls: ['./price-update.component.scss']
})
export class PriceUpdateComponent implements OnInit {

  firebase: FireBase;

  products_list: Object = {};

  constructor(
    private db: AngularFireDatabase,
    private _changeDet: ChangeDetectorRef
  ) {
    this.firebase = new FireBase(this.db);
  }

  ngOnInit() {

    this.firebase.readProducts().subscribe((data: any) => {
      for (let keys in data) {
        if (!this.products_list[keys]) this.products_list[keys] = [];
        for (var key in data[keys]) {
          this.products_list[keys].push(data[keys][key]);
        }
      }
      this._changeDet.detectChanges();
    });
  }

  
}
