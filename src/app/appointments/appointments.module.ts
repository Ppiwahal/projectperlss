import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentsRoutingModule } from './appointments-routing.module';
import {AppointmentsComponent} from './appointments.component';
import {AppointmentsDetailsComponent} from './appointments-details/appointments-details.component';
import {AppointmentsSearchComponent} from './appointments-search/appointments-search.component';
import {AppMaterialModule} from '../_shared/app-material.module';
import {ReactiveFormsModule} from '@angular/forms';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { FullCalendarModule } from '@fullcalendar/angular'; // the main connector. must go first
import dayGridPlugin from '@fullcalendar/daygrid';
import { AppointmentsDashboardComponent } from './appointments-dashboard/appointments-dashboard.component'; // a plugin
import {CancelAppointmentComponent} from './cancel-appointment/cancel-appointment.component';
import {AppointmentSummaryComponent} from './appointment-summary/appointment-summary.component';
import {SharedModule} from '../shared/shared.module';
import { NgxMaskModule } from 'ngx-mask';

FullCalendarModule.registerPlugins([ // register FullCalendar plugins
  dayGridPlugin
]);


@NgModule({
  declarations: [
    AppointmentsComponent, 
    AppointmentsDetailsComponent, 
    AppointmentsSearchComponent,
    CancelAppointmentComponent, 
    AppointmentsDashboardComponent, 
    AppointmentSummaryComponent],
  imports: [
    CommonModule,
    SharedModule,
    AppointmentsRoutingModule,
    AppMaterialModule,
    ReactiveFormsModule,
    FullCalendarModule,
    NgxMaterialTimepickerModule,
    NgxMaskModule.forRoot()
  ]
})
export class AppointmentsModule { }
