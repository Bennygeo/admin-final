import { Component, OnInit } from '@angular/core';
import { CommonsService } from 'src/app/services/commons.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {

  delilvery_boy_subscriber: any;

  delivery_boys: Array<any> = [];
  constructor(private _service: CommonsService) {
    console.log("Report constructor.");
    // console.log(this._service.delivery_boys_list);
    // console.log("_---------------------------------------");
    this.delilvery_boy_subscriber = this._service.deliveryBoysUpdate.subscribe(() => {
      // console.log();
      this.delivery_boys = this._service.delivery_boys_list;
      this.delilvery_boy_subscriber.unsubscribe();
      console.log(this._service.delivery_boys_list);
      console.log("****************************");
    });
  }

  ngOnInit() {
    console.log("Report init constructor.");
    this._service.deliveryBoysUpdate.emit();
  }

}
