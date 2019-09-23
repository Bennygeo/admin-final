import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireDatabase } from 'angularfire2/database';
import { FireBase } from 'src/app/utils/firebase';
import { DateUtils } from 'src/app/utils/date-utils';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'delivery-list',
  templateUrl: './delivery-list.component.html',
  styleUrls: ['./delivery-list.component.scss']
})
export class DeliveryListComponent implements OnInit, OnDestroy {

  fb: FireBase;
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

  constructor(
    private _activatedRoute: ActivatedRoute,
    private db: AngularFireDatabase,
    private changeDet: ChangeDetectorRef,
    private _router: Router,
  ) {
    this.fb = new FireBase(this.db);
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

    this.todaysDateFormatted = this.dateUtils.dateFormater(this.todaysDate, "-");

    this.listObservable = this.fb.readDailyOrders(this.todaysDate).subscribe((data: any) => {
      this.listFlg = false;
      for (let key in data) {
        let _data = JSON.parse(data[key].tender);
        let deliveryFlg = (_data.delivery_status == "Delivered") ? true : false;
        this.deliveredStatus = (deliveryFlg) ? "Done" : "Delivered";
        if (_data.assigned_to == this.name) {
          this.list.push({
            no: key,
            delivery_status: deliveryFlg,
            delivery_string: this.deliveredStatus,
            data: _data
          });
        }
      }
      // debugger;
      this.changeDet.detectChanges();
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.list, event.previousIndex, event.currentIndex);
    console.log(event.previousIndex, event.currentIndex);
  }

  viewAction(e) {
    this.selectedIndex = e.currentTarget.id.split("_")[1] * 1;
    this.selectedTarget = this.list[this.selectedIndex].data;
    this.selectedTarget.date = this.todaysDate;
    // debugger;
    this._router.navigate(['/delivery/view-order/', { data: JSON.stringify(this.selectedTarget) }]);
    // this.ngZone.run(() => console.log("view route."));
  }

  deliveredAction(e) {
    // console.log("deliverd");
    this.selectedIndex = e.currentTarget.id.split("_")[1] * 1;
    this.selectedTarget = this.list[this.selectedIndex].data;

    // debugger;
    this.selectedTarget.delivery_status = "Delivered";
    // update order history
    this.fb.update_delivery_status_order(this.selectedTarget.m_no, this.selectedTarget, this.todaysDate);
    // //update user history
    // // console.log("this.todaysDate :: " + this.todaysDate);
    this.fb.update_delivery_status_user_history(this.selectedTarget.m_no, this.selectedTarget.history_id, this.todaysDate, {
      delivered: true,
      delivered_by: this.selectedTarget.assigned_to
    });
  }

  ngOnDestroy(): void {
    this.listObservable.unsubscribe();
    this.sub.unsubscribe();
  }

}
