import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DeliveryRoutingModule } from './delivery-routing.module';
import { TestComponent } from './test/test.component';
import { FormsModule } from '@angular/forms';
import { DeliveryListComponent } from './delivery-list/delivery-list.component';
import { Ng2SearchPipe } from 'ng2-search-filter';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { OrderViewComponent } from './order-view/order-view.component';
import { MatProgressSpinnerModule, MatSnackBarModule, MatTabsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatCheckboxModule } from '@angular/material';
import { CommonsService } from '../services/commons.service';
import { HttpClientModule } from '@angular/common/http';
import { DateUtils } from '../utils/date-utils';

@NgModule({
  declarations: [
    TestComponent,
    DeliveryListComponent,
    OrderViewComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    DeliveryRoutingModule,
    FormsModule,
    DragDropModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatCheckboxModule,
    MatTabsModule, MatSelectModule,
    MatFormFieldModule, FormsModule, MatInputModule
  ],
  providers: [
    Ng2SearchPipe,
    CommonsService,
    DateUtils,
  ]
})
export class DeliveryModule { }
