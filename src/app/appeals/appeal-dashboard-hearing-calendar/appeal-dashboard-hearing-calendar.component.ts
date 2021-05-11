import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatAccordion } from '@angular/material/expansion';
import { CalendarOptions } from '@fullcalendar/angular';
import * as moment from 'moment';
import { HearingSummaryComponent } from '../hearing-summary/hearing-summary.component';
import { AppealService } from '../services/appeal.service';

@Component({
  selector: 'app-appeal-dashboard-hearing-calendar',
  templateUrl: './appeal-dashboard-hearing-calendar.component.html',
  styleUrls: ['./appeal-dashboard-hearing-calendar.component.scss']
})

export class AppealDashboardHearingCalendarComponent implements OnInit {

  @ViewChild('accordion', { static: true }) Accordion: MatAccordion;
  @ViewChild('fullCalendar') fullCalendar: any;

  appealCalendarOptions: CalendarOptions;
  appealData: any;
  today = new Date();

  constructor(private appealService: AppealService, private matDialog: MatDialog) { }

  ngOnInit() {
    this.getAppeals();
  }

  async getAppeals() {
    try {
      const appeals = await this.appealService.hearingcalendar();
      appeals.body.forEach(element => {
        if (element.aplStatusCd === 'CD') {
          element.className = 'appeal-closed';
        } else if (element.aplStatusCd !== 'CD' && element.newHrngDtSw !== 'Y') {
          element.className = 'schedule-hearing';
        } else if (element.aplStatusCd !== 'CD' && element.newHrngDtSw === 'Y') {
          element.className = 'reschedule-hearing';
        }
      });
      this.appealData = appeals.body.filter(element => {
        if (element.className) {
          return element;
        }
      });
      this.appealCalendarOptions = {
        initialView: 'dayGridMonth',
        showNonCurrentDates: false,
        fixedWeekCount: false,
        customButtons: {
          customAll: {
            text: 'ALL',
            click: () => {
              this.all();
            }
          },
          custom1: {
            text: 'Scheduled Hearings',
            click: () => {
              this.scheduledHearing();
            }
          },
          custom2: {
            text: 'Hearing to be Rescheduled',
            click: () => {
              this.rescheduledHearing();
            }
          },
          custom3: {
            text: 'Appeal Status - Closed',
            click: () => {
              this.closedAppeals();
            }
          }
        },
        events: (() => {
          if (this.appealData && this.appealData.length > 0) {
            return this.appealData.map((element) => ({
              start: new Date(moment(element.hrngDtTms).toDate()),
              end: new Date(moment(element.hrngDtTms).toDate()),
              className: element.className,
              title: element.name,
              aplId: element.aplId
            }));
          } else {
            return [];
          }
        })(),
        eventClick: (info) => {
          this.showHearingSummary(info.event.extendedProps.aplId);
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
          right: 'customAll custom1 custom2 custom3'
        },
        buttonText: {
          prev: '< Previous',
          next: 'Next >'
        },
        footerToolbar: {
          left: '',
          center: '',
          right: 'prev next'
        },
      };
    } catch (err) {
      console.log(err);
    }
  }

  all() {
    const allAppeals = [];
    this.appealData.forEach(element => {
      const obj = {
        start: new Date(moment(element.hrngDtTms).toDate()),
        end: new Date(moment(element.hrngDtTms).toDate()),
        className: element.className,
        title: element.name,
        aplId: element.aplId
      };
      allAppeals.push(obj);
    });
    this.appealCalendarOptions.events = allAppeals;
  }

  scheduledHearing() {
    const scheduledHearing = [];
    this.appealData.forEach(element => {
      if (element.aplStatusCd !== 'CD' && element.newHrngDtSw !== 'Y') {
        const obj = {
          start: new Date(moment(element.hrngDtTms).toDate()),
          end: new Date(moment(element.hrngDtTms).toDate()),
          className: element.className,
          title: element.name,
          aplId: element.aplId
        };
        scheduledHearing.push(obj);
      }
    });
    this.appealCalendarOptions.events = scheduledHearing;
  }

  rescheduledHearing() {
    const rescheduledHearing = [];
    this.appealData.forEach(element => {
      if (element.aplStatusCd !== 'CD' && element.newHrngDtSw === 'Y') {
        const obj = {
          start: new Date(moment(element.hrngDtTms).toDate()),
          end: new Date(moment(element.hrngDtTms).toDate()),
          className: element.className,
          title: element.name,
          aplId: element.aplId
        };
        rescheduledHearing.push(obj);
      }
    });
    this.appealCalendarOptions.events = rescheduledHearing;
  }

  closedAppeals() {
    const closedAppeal = [];
    this.appealData.forEach(element => {
      if (element.aplStatusCd === 'CD') {
        const obj = {
          start: new Date(moment(element.hrngDtTms).toDate()),
          end: new Date(moment(element.hrngDtTms).toDate()),
          className: element.className,
          title: element.name,
          aplId: element.aplId
        };
        closedAppeal.push(obj);
      }
    });
    this.appealCalendarOptions.events = closedAppeal;
  }

  showHearingSummary(aplId) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.minWidth = '550px';
    dialogConfig.minHeight = '405px';
    dialogConfig.panelClass = 'dialog-container';
    dialogConfig.data = { appealId: aplId };
    this.matDialog.open(HearingSummaryComponent, dialogConfig);
  }

}
