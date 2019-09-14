import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeliveryListComponent } from './delivery-list/delivery-list.component';
import { OrderViewComponent } from './order-view/order-view.component';


const routes: Routes = [
  {
    path: '',
    redirectTo:'list'
  },
  {
    path: 'view-order',
    component: OrderViewComponent,
  },
  {
    path: 'list',
    component: DeliveryListComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeliveryRoutingModule { }
