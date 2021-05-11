import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ReferralListManagementComponent} from './referral-list-management.component';
import {ReferralListDetailsComponent} from './referral-list-details/referral-list-details.component';
import {ReferralDashboardComponent} from './referral-dashboard/referral-dashboard.component';


const routes: Routes = [
  {
    path: '',
    component: ReferralListManagementComponent,
    children: [
      {path: '', pathMatch: 'full', redirectTo: 'referralListDashboard'},
      {path: 'referralListDashboard', component: ReferralDashboardComponent},
      {path: 'referralListdetails', component: ReferralListDetailsComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReferralListRoutingModule { }
