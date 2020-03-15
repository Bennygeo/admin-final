import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { CustomerViewComponent } from './customer-view/customer-view.component';
import { BookOrderComponent } from './book-order/book-order.component';
import { AddressComponent } from './address/address.component';
import { NoAccessComponent } from '../others/no-access/no-access.component';
import { PageNotFoundComponent } from '../others/page-not-found/page-not-found.component';
import { ReportComponent } from './report/report.component';
import { UnpaidComponent } from './unpaid/unpaid.component';
import { ItemListComponent } from './item-list/item-list.component';

const routes: Routes = [

  {
    // customer-list
    path: 'customer_list',
    component: CustomerListComponent,
  },
  {
    path: 'report',
    component: ReportComponent,
  },
  {
    path: 'unpaid',
    component: UnpaidComponent,
  },
  {
    path: 'address',
    component: AddressComponent,
    // outlet: 'homeOutlet'
  },
  {
    path: 'customer_view/:id',
    // pathMatch: 'full',
    component: CustomerViewComponent
  },
  {
    // customer-list
    path: 'book_order',
    component: BookOrderComponent,
    // outlet: 'homeOutlet'
  },
  {
    // customer-list
    path: 'list',
    component: ItemListComponent,
    // outlet: 'homeOutlet'
  },
  // { path: 'no-access', component: NoAccessComponent },
  // { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
