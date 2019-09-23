import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { NoAccessComponent } from './others/no-access/no-access.component';
import { PageNotFoundComponent } from './others/page-not-found/page-not-found.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
  },


  // {
  //   path: 'admin',
  //   loadChildren: './admin/admin.module#AdminModule'
  // },
  {
    path: 'delivery',
    loadChildren: './delivery/delivery.module#DeliveryModule'
  },
  { path: 'no-access', component: NoAccessComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
