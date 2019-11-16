import { Component, OnInit } from '@angular/core';
import { CommonsService } from 'src/app/services/commons.service';

@Component({
  selector: 'app-unpaid',
  templateUrl: './unpaid.component.html',
  styleUrls: ['./unpaid.component.scss']
})
export class UnpaidComponent implements OnInit {

  userListUpdateObservable: any;
  balance_list: Array<any> = [];

  constructor(
    private _service: CommonsService
  ) {
    // this.userListUpdateObservable = this._service.onUserListUpdate.subscribe((data) => {
    //   debugger;
    // });

    // console.log("this.userList :: " + this._service.userList);
    // debugger;
    this.getRemainingBalance();

  }

  ngOnInit() {
  }

  getRemainingBalance() {
    let balance_list = {};
    for (let key in this._service.userList) {
      balance_list[key] = {};
      balance_list[key]['remaining'] = 0;
      balance_list[key]['name'] = this._service.userList[key].name;
      this.balance_list.push(balance_list[key]);

      for (let history in this._service.userList[key].history) {
        try {
          // console.log(this._service.userList[key].history[history].details.remaining_to_pay);
          balance_list[key]['remaining'] += this._service.userList[key].history[history].details.remaining_to_pay;

        } catch (e) {
          console.log("Error :: " + key);
        }
      }
      //remove the last entry if the balanace amout is 0.
      if (balance_list[key]['remaining'] == 0) this.balance_list.pop();
    }
  }
}
