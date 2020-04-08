import { Component, OnInit, Input } from '@angular/core';
import { CommonsService } from 'src/app/services/commons.service';

@Component({
  selector: 'product-view',
  templateUrl: './product-view.component.html',
  styleUrls: ['./product-view.component.scss']
})
export class ProductViewComponent implements OnInit {

  @Input() data: Object = {};

  selectedTarget: Object = {};
  price: number = 0;
  offer_flg: boolean = true;

  constructor(
    private _service: CommonsService,
  ) {

  }

  ngOnInit() {
    // debugger;
    this.data['original_price'] = Number(this.data['p_whole_sale_price'] * (1 + this.data['show_off_percent'] / 100)).toFixed(2);
    this.data['total_price'] = (this.data['p_whole_sale_price'] * (1 + this.data['profit_percent'] / 100));
  }

  /*
   * on view product action
   */
  viewProduct(target) {
    //recieved by price-update component
    this._service.on_individual_product_view_dispatch.emit(this.data);
  }
}
