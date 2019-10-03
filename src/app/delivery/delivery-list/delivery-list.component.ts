import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireDatabase } from 'angularfire2/database';
import { FireBase } from 'src/app/utils/firebase';
import { DateUtils } from 'src/app/utils/date-utils';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { CommonsService } from 'src/app/services/commons.service';

@Component({
  selector: 'delivery-list',
  templateUrl: './delivery-list.component.html',
  styleUrls: ['./delivery-list.component.scss']
})
export class DeliveryListComponent implements OnInit, OnDestroy {

  trace: any = console.log;
  firebase: FireBase;
  mobile: string;
  name: string;
  list: Array<any> = [];
  listObservable: any;
  selectedIndex: number = NaN;
  selectedTarget: any;

  dateUtils: DateUtils;
  todaysDate: any;
  todaysDateFormatted: any;
  listFlg: boolean = true;
  sub: any;
  deliveredStatus: string = "Delivered";
  deliveredFlg: boolean = false;
  //subscribers from firebase
  orders_subscriber: any;
  userListUpdateObservable: any;

  undelivered_list: Array<any> = [];
  delivered_list: Array<any> = [];

  total_deliveries: number = 0;
  total_undelivered: number = 0;
  total_delivered: number = 0;
  tab_index: number = 0;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private db: AngularFireDatabase,
    private changeDet: ChangeDetectorRef,
    private _router: Router,
    private _service: CommonsService
  ) {
    this.firebase = new FireBase(this.db);
    this.dateUtils = new DateUtils();
  }

  ngOnInit() {

    this.sub = this._activatedRoute.paramMap.subscribe(params => {
      this.mobile = params.get('mobile');
      this.name = params.get('name');
    });

    let todayTime = new Date().getHours();
    if (todayTime <= 11) {
      this.todaysDate = new Date();
      this.todaysDate = this.dateUtils.getDateString(this.todaysDate, "");
    } else {
      this.todaysDate = new Date();
      this.todaysDate = this.dateUtils.getDateString(this.dateUtils.addDays(this.todaysDate, 1), "");
    }

    this._service.readCustomerList(false);
    this.userListUpdateObservable = this._service.onUserListUpdate.subscribe((user_data) => {
      this.trace("list updfate observavle");

      this.todaysDateFormatted = this.dateUtils.dateFormater(this.todaysDate, "-");

      this.listObservable = this.firebase.readDailyOrders(this.todaysDate).subscribe((data: any) => {
        this.listFlg = false;
        let index = 0;

        this.trace("listObservable");
        //reset both arrays
        this.undelivered_list = [];
        this.delivered_list = [];
        this.total_deliveries = 0;
        this.total_delivered = 0;
        this.total_undelivered = 0;


        for (let key in data) {
          index++;
          let _data = JSON.parse(data[key].tender);

          let deliveryFlg = (_data.delivery_status == "Delivered") ? true : false;
          this.deliveredStatus = (deliveryFlg) ? "Done" : "Delivered";
          if (_data.assigned_to == this.name) {
            this.total_deliveries += _data.per_day;

            // debugger;
            if (!deliveryFlg) {
              this.total_undelivered += _data.per_day;
              this.undelivered_list.push({
                'no': key,
                'delivery_status': deliveryFlg,
                'delivery_string': this.deliveredStatus,
                'data': _data,
                'apartment': user_data[key].aprtment,
                'address': user_data[key].address.address1
              });
              // debugger;
            } else {
              this.total_delivered += _data.per_day;
              this.delivered_list.push({
                'no': key,
                'delivery_status': deliveryFlg,
                'delivery_string': this.deliveredStatus,
                'data': _data,
                'apartment': user_data[key].aprtment,
                'address': user_data[key].address.address1
              });
            }
          }
        }
        // debugger;
        this.userListUpdateObservable.unsubscribe();
        this.changeDet.detectChanges();
      });
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.undelivered_list, event.previousIndex, event.currentIndex);
    // console.log(event.previousIndex, event.currentIndex);
  }

  viewAction(e) {
    this.selectedIndex = e.currentTarget.id.split("_")[1] * 1;
    // debugger;
    if (this.tab_index == 0) this.list = this.undelivered_list;
    if (this.tab_index == 1) this.list = this.delivered_list;

    this.selectedTarget = this.list[this.selectedIndex].data;
    this.selectedTarget.date = this.todaysDate;
    // debugger;
    this._router.navigate(['/delivery/view-order/', { data: JSON.stringify(this.selectedTarget) }]);
    // this.ngZone.run(() => console.log("view route."));
  }

  deliveredAction(e) {
    // console.log("deliverd");
    if (this.tab_index == 0) this.list = this.undelivered_list;
    if (this.tab_index == 1) this.list = this.delivered_list;

    this.selectedIndex = e.currentTarget.id.split("_")[1] * 1;
    this.selectedTarget = this.list[this.selectedIndex].data;

    let calbackFlg1 = false;
    let calbackFlg2 = false;
    // debugger;
    this.selectedTarget.delivery_status = "Delivered";
    // update order history
    this.firebase.update_delivery_status_order(this.selectedTarget.m_no, this.selectedTarget, this.todaysDate, () => {
      calbackFlg1 = true;
      if (calbackFlg1 && calbackFlg2) {
        this.changeDet.detectChanges();
        this.trace("render change1s");
      }
    });
    // //update user history
    // // console.log("this.todaysDate :: " + this.todaysDate);
    this.firebase.update_delivery_status_user_history(this.selectedTarget.m_no, this.selectedTarget.history_id, this.todaysDate, {
      delivered: true,
      delivered_by: this.selectedTarget.assigned_to
    }, () => {
      calbackFlg2 = true;
      if (calbackFlg1 && calbackFlg2) {
        this.changeDet.detectChanges();
        this.trace("render changes2");
      }
    });
  }

  tabChanged(evt) {
    this.tab_index = evt.index;
  }

  ngOnDestroy(): void {
    this.listObservable.unsubscribe();
    this.sub.unsubscribe();
  }

}
