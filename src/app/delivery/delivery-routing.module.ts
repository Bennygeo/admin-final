import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeliveryListComponent } from './delivery-list/delivery-list.component';
import { OrderViewComponent } from './order-view/order-view.component';
import { NoAccessComponent } from '../others/no-access/no-access.component';
import { PageNotFoundComponent } from '../others/page-not-found/page-not-found.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'list'
  },
  {
    path: 'view-order',
    component: OrderViewComponent,
  },
  {
    path: 'list',
    component: DeliveryListComponent,
  }
  // { path: 'no-access', component: NoAccessComponent },
  // { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeliveryRoutingModule { }
