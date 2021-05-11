import { Component, OnInit } from '@angular/core';
import {CalendarOptions} from '@fullcalendar/angular';
import * as moment from 'moment';
import {AppointmentsService} from '../services/appointments.service';
import {Router} from '@angular/router';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {AppointmentSummaryComponent} from "../appointment-summary/appointment-summary.component";


@Component({
  selector: 'app-appointments-dashboard',
  templateUrl: './appointments-dashboard.component.html',
  styleUrls: ['./appointments-dashboard.component.scss']
})
export class AppointmentsDashboardComponent implements OnInit {

  data: any;
  appointmentDates = [];
  missAppointments =0;
  upcomingAppointments = 0;
  today = new Date();
  calendarOptions: CalendarOptions;


  constructor(private appointmentService: AppointmentsService,
  private router: Router,
  private matDialog: MatDialog) { }

  ngOnInit(): void {
    this.getAppointments();
  }

  showSummaryDialog(appointmentId) {
    const dialogConfig =  new MatDialogConfig();
    dialogConfig.minWidth = '550px';
    dialogConfig.minHeight = '405px';
    dialogConfig.panelClass = 'dialog-container';
    dialogConfig.data = {appointmentId : appointmentId};
    this.matDialog.open(AppointmentSummaryComponent, dialogConfig);
  }

  navigateToSearch(type: string) {
    if (type === 'upcomingAppoints' && this.upcomingAppointments) {
      const data = this.data.upcomingAppoints;
      this.router.navigate(['/ltss/appointments/search'], {state: {data}});
      return;
    }
    if (type === 'missedAppointments' && this.missAppointments) {
        const data = this.data.missedAppoints;
        this.router.navigate(['/ltss/appointments/search'], {state: {data}});
    }
  }

  async getAppointments() {
    try {
      const localStorageLocal = localStorage.getItem('APP_STORAGE_TOKEN');
      const userId = JSON.parse(localStorageLocal).userName;
      let appointments = await this.appointmentService.getAppointments(userId);
      console.log(appointments);
      this.data = appointments['body'];
      this.upcomingAppointments = this.data.upcomingAppointsCount;
      this.missAppointments = this.data.missedAppointsCount;
      this.calendarOptions = {
        initialView: 'dayGridMonth',
        showNonCurrentDates: false,
        fixedWeekCount: false,
        customButtons: {
          custom1: {
            text: 'Katie Beckeet',
            click: () => {
              console.log('clicked');
            }
          },
          custom2: {
            text: 'ECF',
            click: () => {
              console.log('clicked');
            }
          }
        },
        events: (() => {

          if(this.data && this.data.upcomingAppoints && this.data.upcomingAppoints.length) {

            return this.data.upcomingAppoints.map((a) => ({
              start: new Date(moment(a['appointmentDate'], 'MM/DD/YYYY hh:mm A').toDate()),
              end: new Date(moment(a['appointmentDate'], 'MM/DD/YYYY hh:mm A').toDate()),
              className:a['programCd'] === 'KB' ? 'kb-event' : 'ecf-event',
              title: moment(a['appointmentDate'], 'MM/DD/YYYY hh:mm A').format('hh:mm A'),
              appointmentId: a['id'] }));
          }else {
            return  [];
          }
        })(),
        eventClick: (info) => {
          this.showSummaryDialog(info.event.extendedProps.appointmentId);
        },
        displayEventTime: false,
        dayMaxEventRows: true,
        views: {
          dayGrid: {
            dayMaxEventRows: 2
          }
        },
        headerToolbar: {
          left: 'title',
          center: '',
          right: 'custom1 custom2'
        },
        buttonText: {
          prev: '< Previous',
          next: 'Next >'
        },
        footerToolbar: {
          left: '',
          center: '',
          right: 'prev next'
        }
      };
    }catch(err) {
      console.log(err);
    }
  }

}
