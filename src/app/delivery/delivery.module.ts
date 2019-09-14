import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DeliveryRoutingModule } from './delivery-routing.module';
import { TestComponent } from './test/test.component';
import { FormsModule } from '@angular/forms';
import { DeliveryListComponent } from './delivery-list/delivery-list.component';
import { Ng2SearchPipe } from 'ng2-search-filter';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { OrderViewComponent } from './order-view/order-view.component';

@NgModule({
  declarations: [
    TestComponent,
    DeliveryListComponent,
    OrderViewComponent,
  ],
  imports: [
    CommonModule,
    DeliveryRoutingModule,
    FormsModule,
    DragDropModule
  ],
  providers: [
    Ng2SearchPipe
  ]
})
export class DeliveryModule { }
