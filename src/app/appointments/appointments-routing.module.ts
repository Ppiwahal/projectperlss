import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AppointmentsComponent} from './appointments.component';
import {AppointmentsDetailsComponent} from './appointments-details/appointments-details.component';
import {AppointmentsSearchComponent} from './appointments-search/appointments-search.component';
import {AppointmentsDashboardComponent} from './appointments-dashboard/appointments-dashboard.component';


const routes: Routes = [
  {
    path: '',
    component: AppointmentsComponent,
    children: [
      {path: '', pathMatch: 'full', redirectTo: 'appointmentsDashboard'},
      {path: 'appointmentsDashboard', component: AppointmentsDashboardComponent},
      {path: 'detail', component: AppointmentsDetailsComponent},
      {path: 'detail/:id', component: AppointmentsDetailsComponent},
      {path: 'search', component: AppointmentsSearchComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppointmentsRoutingModule { }
