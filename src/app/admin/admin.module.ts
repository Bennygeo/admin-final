import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { TestComponent } from './test/test.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatOptionModule, MatSelectModule, MatButtonModule, MatInputModule, MatDialogModule, MatSnackBarModule, MatCheckboxModule, MatIconModule, MatRadioModule, MatDialogRef, MatTabsModule, MatProgressSpinnerModule } from '@angular/material';
import { Ng2SearchPipeModule, Ng2SearchPipe } from 'ng2-search-filter';
import { AddressComponent } from './address/address.component';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { CustomerViewComponent } from './customer-view/customer-view.component';
import { HomeComponent } from './home/home.component';
import { BookOrderComponent } from './book-order/book-order.component';
import { Utils } from '../utils/utils';
import { DateUtils } from '../utils/date-utils';
import { PlusMinusComponent } from '../utils/plus-minus/plus-minus.component';
import { CommonsService } from '../services/commons.service';
import { MatDialogComponent } from '../others/mat-dialog/mat-dialog.component';
import { ScrollDispatchModule } from '@angular/cdk/scrolling';
import { Daterangepicker } from 'ng2-daterangepicker';
import { ReportComponent } from './report/report.component';
import { UnpaidComponent } from './unpaid/unpaid.component';
import { MultidatepickerComponent } from '../utils/multidate/multidatepicker.component';
import { ItemListComponent } from './item-list/item-list.component';

@NgModule({
  declarations: [
    TestComponent,
    AddressComponent,
    CustomerListComponent,
    CustomerViewComponent,
    HomeComponent,
    BookOrderComponent,
    PlusMinusComponent,
    MatDialogComponent,
    ReportComponent,
    UnpaidComponent,
    MultidatepickerComponent,
    ItemListComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    MatFormFieldModule, MatOptionModule, MatSelectModule, MatButtonModule, MatInputModule, MatSnackBarModule, MatCheckboxModule, MatIconModule, MatRadioModule,
    MatDialogModule,
    Ng2SearchPipeModule,
    ScrollDispatchModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    Daterangepicker,
  ],
  entryComponents: [
    MatDialogComponent
  ],
  providers: [
    // AuthService,
    {
      provide: MatDialogRef, useValue: {}
    },
    Utils,
    CommonsService,
    DateUtils,
    Ng2SearchPipe,
    // MatDialogRef
  ],
})
export class AdminModule { }
