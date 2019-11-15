import { Component, OnInit } from '@angular/core';
import { CommonsService } from 'src/app/services/commons.service';

@Component({
  selector: 'app-unpaid',
  templateUrl: './unpaid.component.html',
  styleUrls: ['./unpaid.component.scss']
})
export class UnpaidComponent implements OnInit {

  userListUpdateObservable: any;

  constructor(
    private _service: CommonsService
  ) {

    this.userListUpdateObservable = this._service.onUserListUpdate.subscribe((data) => {
      debugger;
    });

  }

  ngOnInit() {
  }

}
