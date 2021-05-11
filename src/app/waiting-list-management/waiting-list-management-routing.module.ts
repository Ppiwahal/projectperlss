import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WaitingListManagementComponent } from './waiting-list-management.component';
import { WaitingListDetailsComponent } from './waiting-list-details/waiting-list-details.component';
import { WaitingListDashboardComponent } from './waiting-list-dashboard/waiting-list-dashboard.component'


const routes: Routes = [
  {
    path: '',
    component: WaitingListManagementComponent,
    children: [
      {path: '', pathMatch: 'full', redirectTo: 'waitingListDashboard'},
      {path: 'waitingListDashboard', component: WaitingListDashboardComponent},

      {path: 'waitingListdetails', component: WaitingListDetailsComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WaitingListManagementRoutingModule { }
