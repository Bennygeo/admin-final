import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { FireBase } from 'src/app/utils/firebase';
import { AngularFireDatabase } from 'angularfire2/database';
import { Globals, Places } from 'src/app/utils/utils';
import { CommonsService } from 'src/app/services/commons.service';


@Component({
  selector: 'price-update',
  templateUrl: './price-update.component.html',
  styleUrls: ['./price-update.component.scss']
})
export class PriceUpdateComponent implements OnInit {

  firebase: FireBase;

  products_list: Object = {};

  places: Places[] = Globals.Places;
  individual_product_view: boolean = false;

  unit_list: Array<Object>;
  weights: Array<string> = [];

  selectedTarget: Object = {};

  whole_sale_price: number = 0;
  profit_percentage: number = 0;
  show_off_percentage: number = 0;

  selected_weight: string = "";
  selected_unit: string = "";

  category: string = "";
  target_id: number = 0;

  fb_writing: boolean = false;

  data: any;

  constructor(
    private db: AngularFireDatabase,
    private _changeDet: ChangeDetectorRef,
    private _ngZone: NgZone,
    private _service: CommonsService
  ) {
    this.firebase = new FireBase(this.db);
  }

  ngOnInit() {

    this.weights = this._service.weights;
    this.unit_list = this._service.unit_list;

    this.firebase.readProducts().subscribe((data: any) => {
      this.data = data;
      this.products_list ={};
      for (let keys in this.data) {
        if (!this.products_list[keys]) this.products_list[keys] = [];
        for (var key in this.data[keys]) {
          // this.products_list[keys].push(this.data[keys][key]);
          this.products_list[keys][key]=(this.data[keys][key]);
        }
      }
      this._changeDet.detectChanges();
      // this._ngZone.run(()=>{});
    });

    this._service.on_individual_product_view_dispatch.subscribe((data) => {

      this.category = data.category;
      this.target_id = data.id.slice(-2) * 1 - 1;
      // debugger;
      this.selected_unit = data['unit_name'];
      this.selected_weight = String(data['p_grams']);
      this.selectedTarget = data;

      this.selectedTarget['weight'] = this.selected_weight;
      this.selectedTarget['unit'] = this.selected_unit;

      // debugger;
      this.whole_sale_price = this.selectedTarget['p_whole_sale_price'];
      this.profit_percentage = this.selectedTarget['profit_percent'];
      this.show_off_percentage = this.selectedTarget['show_off_percent'];

      // this.selectedTarget['profit_percent'] = this.profit_percentage;
      // this.selectedTarget['show_off_percent'] = this.show_off_percentage;

      this.update_price();

      this.individual_product_view = true;
      this._ngZone.run(() => { });
    });
  }

  onSliderChangeAction() {

  }

  whole_sale_change_action(evt) {
    this.whole_sale_price = evt.value;
    this.update_price();
  }

  profit_percent_action(evt) {
    this.profit_percentage = evt.value;
    this.update_price();
  }

  show_off_percent_action(evt) {
    this.show_off_percentage = evt.value;
    this.update_price();
  }

  update_price() {
    this.selectedTarget['whole_sale_price'] = this.whole_sale_price;
    this.selectedTarget['profit_percent'] = this.profit_percentage;
    this.selectedTarget['show_off_percent'] = this.show_off_percentage;

    this.selectedTarget["total_price"] = Number(this.selectedTarget['whole_sale_price'] * (1 + this.selectedTarget['profit_percent'] / 100)).toFixed(2);
    this.selectedTarget['original_price'] = Number(this.selectedTarget['whole_sale_price'] * (1 + this.selectedTarget['show_off_percent'] / 100)).toFixed(2);
    // this.selectedTarget['offer_percentage'] = Number(this.selectedTarget['show_off_percent'] - (this.selectedTarget['profit_percent'])).toFixed(2);
    this.selectedTarget['offer_percentage'] = -Number(((this.selectedTarget['total_price'] / this.selectedTarget["original_price"]) * 100) - 100).toFixed(2);
  }

  update_to_firebase(evt) {
    this.fb_writing = true;
    this.firebase.write_product_prop(this.category, this.target_id, this.selectedTarget, () => {
      // console.log("write success");
      this.fb_writing = false;

      // this.products_list = {};
      // if (!this.products_list[this.category]) this.products_list[this.category] = [];
      // this.products_list[this.category][this.target_id] = this.selectedTarget;

      // for (let keys in this.data) {
      //   if (!this.products_list[keys]) this.products_list[keys] = [];
      //   for (var key in this.data[keys]) {
      //     this.products_list[keys].push(this.data[keys][key]);
      //   }
      // }

      this.outsideClick();
      this._changeDet.detectChanges();
      // this._ngZone.run(()=>{});

    });
  }

  outsideClick() {
    this.individual_product_view = false;
  }

}
