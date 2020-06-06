import { Component, OnInit, ChangeDetectorRef, NgZone, OnChanges, DoCheck } from '@angular/core';
import { FireBase } from 'src/app/utils/firebase';
import { AngularFireDatabase } from 'angularfire2/database';
import { Globals, Places } from 'src/app/utils/utils';
import { CommonsService } from 'src/app/services/commons.service';
import { Ng2SearchPipe } from 'ng2-search-filter';


@Component({
  selector: 'price-update',
  templateUrl: './price-update.component.html',
  styleUrls: ['./price-update.component.scss']
})
export class PriceUpdateComponent implements OnInit, OnChanges {

  firebase: FireBase;

  products_list: any = {};
  products_list_copy: any = {};

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
  search_result_obj: any = {};
  loading_status_msg: string = "Loading products...";

  /*
  * Whole sale price slider min and max range value
  */
  whole_sale_slider_range: Object = {
    min: 0,
    max: 100
  }

  /*
  * Profit price slider min and max range value
  */
  profit_slider_range: Object = {
    min: 0,
    max: 100
  }

  /*
  * Show off price slider min and max range value
  */
  show_off_slider_range: Object = {
    min: 0,
    max: 150
  }

  //Slider range will be multiplied by 2.
  slider_in_between_range: number = 25;

  /*
  * Active status of product availability
  */
  product_availability_flg: boolean = false;

  constructor(
    private db: AngularFireDatabase,
    private _changeDet: ChangeDetectorRef,
    private _ngZone: NgZone,
    private _service: CommonsService,
    private ng2: Ng2SearchPipe,
  ) {
    this.firebase = new FireBase(this.db);
  }

  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    console.log("cahnge happened");
  }

  ngOnInit() {
    this.weights = this._service.weights;
    this.unit_list = this._service.unit_list;
    this.loading_status_msg = "Loading products...";
    this.fb_writing = true;

    this.firebase.readProducts().subscribe((data: any) => {
      this.fb_writing = false;
      this.loading_status_msg = "";
      this.data = data;
      this.products_list = {};
      for (let keys in this.data) {
        if (!this.products_list[keys]) this.products_list[keys] = [];
        for (var key in this.data[keys]) {
          // this.products_list[keys].push(this.data[keys][key]);
          this.products_list[keys][key] = (this.data[keys][key]);
        }
      }
      this.search_result_obj = JSON.parse(JSON.stringify(this.products_list));
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
      this.product_availability_flg = data.disabled;

      // debugger;
      this.whole_sale_price = this.selectedTarget['p_whole_sale_price'];
      this.profit_percentage = this.selectedTarget['profit_percent'];
      this.show_off_percentage = this.selectedTarget['show_off_percent'];

      this.whole_sale_slider_range = {
        min: ((this.whole_sale_price - this.slider_in_between_range) < 0) ? 0 : (this.whole_sale_price - this.slider_in_between_range),
        max: this.whole_sale_price + this.slider_in_between_range
      }

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

    this.selectedTarget['unit'] = this.selected_unit;
    this.selectedTarget['unit_name'] = this.selected_unit;
    this.selectedTarget['p_grams'] = this.selected_weight;
    this.selectedTarget['disabled'] = this.product_availability_flg;
    // debugger;
    this.loading_status_msg = "Writing in firebase...";

    this.firebase.write_product_prop(this.category, this.target_id, this.selectedTarget, () => {
      // console.log("write success");
      this.loading_status_msg = "";
      this.fb_writing = false;
      this.outsideClick();
      this._changeDet.detectChanges();
    });
  }

  onWeightSelect(evt) {

  }

  onUnitSelect(evt) {

  }

  outsideClick() {
    this.individual_product_view = false;
  }

  product_availability() {
    console.log("flg : " + this.product_availability_flg);

  }

  searchChangeAction(evt) {

    let searchText = evt.currentTarget.value;
    let _ary = [];

    let list_cpy = JSON.parse(JSON.stringify(this.products_list));

    if (searchText != '') {
      for (var cat in list_cpy) {
        // if (cat != 'subs' && cat != 'greens' && cat != 'milk' && cat != 'tender') {
        // if (cat == 'Vegetables' || cat == 'Milk') {
        let ary = []
        ary = this.ng2.transform(list_cpy[cat], searchText);
        this.search_result_obj[cat] = ary;
        _ary = _ary.concat(ary);
        // }
      }
    } else {
      this.search_result_obj = JSON.parse(JSON.stringify(this.products_list));
    }
    console.log(this.products_list);
    // this._changeDet.detectChanges();

  }

}
