import { ReferralDashboardService } from './../../core/services/referral/referral-dashboard/referral-dashboard.service';
import { Router} from '@angular/router';
import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Subscription, fromEvent } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as customValidation from '../../_shared/constants/validation.constants';
import { ReferralFilter } from '../../_shared/model/ReferralFilter';
import { MytasksComponent} from '../../inbox/mytasks/mytasks.component';
import { RefEnterIntakeOutcome } from '../../_shared/model/RefEnterIntakeOutcome';
import {forkJoin} from 'rxjs';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { MatTableDataSource } from '@angular/material/table';
import { MatAccordion } from '@angular/material/expansion';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DeleteRecordPopupComponent } from '../../_shared/modal/delete-record-popup/delete-record-popup.component';
import { ReferralService } from 'src/app/core/services/referral/referral.service';
import { ViewportScroller } from '@angular/common';
import { filter, map, debounceTime, distinctUntilChanged} from 'rxjs/operators';
import { UpdateTaskComponent } from 'src/app/inbox/update-task/update-task.component';
import { InboxService } from 'src/app/inbox/services/inbox.service';
import { MatPaginator } from '@angular/material/paginator';
import { SearchUserPopupComponent } from 'src/app/search-user-popup/search-user-popup.component';
import { PaeCommonService } from 'src/app/core/services/pae/pae-common/pae-common.service';
import { RightnavToggleService } from '../../_shared/services/rightnav-toggle.service';
import { MatSort } from '@angular/material/sort';

export interface PeriodicElement {
  QueueId: number;
  Count: number;
}

@Component({
  selector: 'app-referral-dashboard',
  templateUrl: './referral-dashboard.component.html',
  styleUrls: ['./referral-dashboard.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class ReferralDashboardComponent implements OnInit, OnDestroy, AfterViewInit {

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private referralDashboardService: ReferralDashboardService,
    private dialog: MatDialog,
    private referralService: ReferralService,
    private matDialog: MatDialog,
    private paeCommonService: PaeCommonService,
    private inboxService: InboxService,
    private rightnavToggleService: RightnavToggleService
  ) { }
  pendingReferralCount: number;
  personDisplayName: string;
  additionalSerachName = '';
  personId: string = '';
  personOptions: any;
  subscriptions$: any[] = [];
  pendingReferralCountData: any;
  customValidation = customValidation;
  futureDues5Days: number;
  futureDues5DaysData: any;
  pastDuesPendingCount: number;
  pastDuesPendingCountData: any;
  totalPendingCount: number;
  totalPendingCountData: any;
  taskQueueCountData: any;
  taskQueueCountDataTemp: any = [];
  subscription1$: Subscription;
  subscription2$: Subscription;
  subscription3$: Subscription;
  subscription4$: Subscription;
  subscription5$: Subscription;
  subscription6$: Subscription;
  subscription7$: Subscription;
  subscription8$: Subscription;
  subscription9$: Subscription;
  subscription10$: Subscription;
  subscriptions: Subscription[] = [];
  alertPastDue = false;
  kbAlertPastDue = false;
  isSupervisorSwitch = false;
  isMyOpenTasksClicked = false;
  searchReferralClicked = false;
  @ViewChild('applicantNameInput', { static: true }) applicantNameInput: ElementRef;



  // My open Task: request param initilization
  localStorageLocal = localStorage.getItem('APP_STORAGE_TOKEN');
  userId = JSON.parse(this.localStorageLocal).userName; //'dcu7356';
  entityId = JSON.parse(this.localStorageLocal).entityId;//'1001';
  userRolesList = JSON.parse(this.localStorageLocal).userRolesList;

  dashboardCd = 'REF';
  taskStatusCd = 'IP';
  dataSource2 = [];
  referralQueueVOList: any;
  queueCdCountMap: any;
  taskTable: MatTableDataSource<any>;
  taskTableShowResult: boolean = false;
  pendingReferralCountReady: boolean = false;
  intakeVisitCountReady: boolean = false;
  searchTableResultsReady: boolean = false;
  records: any;
  taskQueueMap = new Map();
  grandRegionMap = new Map();
  taskStatusMap  = new Map();
  countyMap = new Map();
  twentyDaysOlderPendingCount: number;
  twentyDaysOlderPendingCountData: any;
  kbReferralPendingCount: number;
  kbReferralPendingCountData: any;
  mytasksComponentHolder: any;
  displayedColumnsTaskTable: string[] = ['key', 'value'];
  pageOptions: any[] = [];
  selectedPageSize: any;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild('accordion', { static: true }) Accordion: MatAccordion;
  @ViewChild(MatSort) sort: MatSort;
  @Output() emitTasksCount = new EventEmitter();
  reload = false;
  result: any = [];
  isAdditonalFilterCriteriaDropDownToggled = false;


  taskQueue = [
    { code: 1, value: 'New ECF CHOICES Intake', activateSW: 'Y' },
    { code: 2, value: 'LTSS Referral Reassignment Review', activateSW: 'Y' },
    { code: 3, value: 'Nurse Review for ECF CHOICES', activateSW: 'Y' },
    { code: 4, value: 'Complete IARC Review', activateSW: 'Y' },
    { code: 5, value: 'DIDD IARC Submission', activateSW: 'Y' },
    { code: 6, value: 'Additional Information Requested for a Referral', activateSW: 'Y' },
    { code: 7, value: 'Complete ECF PAE', activateSW: 'Y' },
    { code: 8, value: 'Pending FE determination', activateSW: 'Y' },
    { code: 9, value: 'DIDD Part B Supervisor Review Queue', activateSW: 'Y' },
    { code: 10, value: 'Complete Part A Assessment', activateSW: 'Y' },
    { code: 11, value: 'Complete SIS Assessment Request', activateSW: 'Y' },
    { code: 12, value: 'Physician Review for KB Part A', activateSW: 'Y' },
    { code: 13, value: 'Nurse Review for KB Part A', activateSW: 'Y' },
    { code: 14, value: 'Complete ECF Recertification', activateSW: 'Y' },
    { code: 15, value: 'Complete PACE Recertification/Reassessment', activateSW: 'Y' },
    { code: 16, value: 'Transition ECF PAE Needed', activateSW: 'Y' },
    { code: 17, value: 'Transition CHOICES NF PAE Needed', activateSW: 'Y' },
    { code: 18, value: 'Transition CHOICES HCBS PAE Needed', activateSW: 'Y' },
    { code: 19, value: 'Transition CAC PAE Needed', activateSW: 'Y' },
    { code: 20, value: 'Transition ICF PAE Needed', activateSW: 'Y' },
    { code: 21, value: 'New Katie Beckett Referral Received - DIDD', activateSW: 'Y' },
    { code: 22, value: 'Transition PACE PAE Needed', activateSW: 'Y' },
    { code: 23, value: 'Waiver - Annual LOC Reassessment', activateSW: 'Y' },
    { code: 24, value: 'Katie Beckett - Part A Annual LOC Reassessment', activateSW: 'Y' },
    { code: 25, value: 'ECF - Annual LOC Reassessment', activateSW: 'Y' },
    { code: 26, value: 'CHOICES - Annual LOC Reassessment', activateSW: 'Y' },
    { code: 27, value: 'ICF - Annual LOC Reassessment', activateSW: 'Y' },
    { code: 28, value: 'Katie Beckett - Part B Annual LOC Reassessment', activateSW: 'Y' },
    { code: 29, value: 'KB A/C Age-Out Review', activateSW: 'Y' },
    { code: 30, value: 'Adjudicate ECF PAE', activateSW: 'Y' },
    { code: 31, value: 'Adjudicate Transition to ECF PAE', activateSW: 'Y' },
    { code: 32, value: 'Adjudicate PACE PAE', activateSW: 'Y' },
    { code: 33, value: 'Adjudicate Transition to PACE PAE', activateSW: 'Y' },
    { code: 34, value: 'Adjudicate ICF PAE', activateSW: 'Y' },
    { code: 35, value: 'Adjudicate CAC PAE', activateSW: 'Y' },
    { code: 141, value: 'Complete Appeal Filing Process', activateSW: 'Y' },
    { code: 36, value: 'SIS Assessment Review', activateSW: 'Y' },
    { code: 37, value: 'Safety Assessment Review', activateSW: 'Y' },
    { code: 38, value: 'Recertification Review - ECF', activateSW: 'Y' },
    { code: 39, value: 'Recertification Review - PACE', activateSW: 'Y' },
    { code: 40, value: 'LON Change Request', activateSW: 'Y' },
    { code: 41, value: 'LON Change Implementation', activateSW: 'Y' },
    { code: 42, value: 'Cost Cap Exception Implementation', activateSW: 'Y' },
    { code: 43, value: 'Cost Cap Exception Review', activateSW: 'Y' },
    { code: 44, value: 'Review Audit Submission', activateSW: 'Y' },
    { code: 45, value: 'Review Differential Audit', activateSW: 'Y' },
    { code: 46, value: 'Perform Audit', activateSW: 'Y' },
    { code: 47, value: 'Adjudicate Transition to CAC PAE', activateSW: 'Y' },
    { code: 48, value: 'Adjudicate Transition to ICF PAE', activateSW: 'Y' },
    { code: 49, value: 'Adjudicate Transition to CHOICES HCBS PAE', activateSW: 'Y' },
    { code: 50, value: 'Adjudicate Transition to CHOICES NF PAE', activateSW: 'Y' },
    { code: 51, value: 'Adjudicate CHOICES HCBS PAE', activateSW: 'Y' },
    { code: 52, value: 'Adjudicate CHOICES NF PAE', activateSW: 'Y' },
    { code: 53, value: 'Recertification Review - CHOICES 1', activateSW: 'Y' },
    { code: 54, value: 'ERC Addition/Extension Review', activateSW: 'Y' },
    { code: 55, value: 'Complete New Enrollment - ECF CHOICES', activateSW: 'Y' },
    { code: 56, value: 'Complete Transition Enrollment - ECF CHOICES', activateSW: 'Y' },
    { code: 57, value: 'Complete New Enrollment - CHOICES Group 2', activateSW: 'Y' },
    { code: 58, value: 'Complete New Enrollment - CHOICES Group 1', activateSW: 'Y' },
    { code: 59, value: 'Complete Transition Enrollment - CHOICES Group 2', activateSW: 'Y' },
    { code: 60, value: 'Complete Transition Enrollment - CHOICES Group 1', activateSW: 'Y' },
    { code: 61, value: 'Complete New Enrollment - CHOICES Group 3', activateSW: 'Y' },
    { code: 62, value: 'Complete Transition Enrollment - CHOICES Group 3', activateSW: 'Y' },
    { code: 63, value: 'Complete New Enrollment - PACE', activateSW: 'Y' },
    { code: 64, value: 'Complete Transition Enrollment - PACE', activateSW: 'Y' },
    { code: 65, value: 'Complete New Enrollment - ICF', activateSW: 'Y' },
    { code: 66, value: 'Complete Transition Enrollment - ICF', activateSW: 'Y' },
    { code: 67, value: 'Complete New Enrollment - CAC', activateSW: 'Y' },
    { code: 68, value: 'Complete Transition Enrollment - CAC', activateSW: 'Y' },
    { code: 69, value: 'Complete Disenrollment Request', activateSW: 'Y' },
    { code: 70, value: 'Review Disenrollment Request', activateSW: 'Y' },
    { code: 71, value: 'Override PAE Update Review', activateSW: 'Y' },
    { code: 72, value: 'Update Enrollment based on Appeal Outcome', activateSW: 'Y' },
    { code: 73, value: 'Add Group 3 Interest Details', activateSW: 'Y' },
    { code: 74, value: 'Enter MOPD', activateSW: 'Y' },
    { code: 75, value: 'Complete Safety Assessment Request', activateSW: 'Y' },
    { code: 76, value: 'Complete Annual Outreach', activateSW: 'Y' },
    { code: 77, value: 'Revise Transition Request', activateSW: 'Y' },
    { code: 78, value: 'ECF CHOICES Transition Nurse Review', activateSW: 'Y' },
    { code: 79, value: 'ECF CHOICES Transition IARC Review', activateSW: 'Y' },
    { code: 80, value: 'ECF CHOICES Group 6 Transition Add LON', activateSW: 'Y' },
    { code: 81, value: 'ECF CHOICES Group 6 Transition Complete SIS Assessment', activateSW: 'Y' },
    { code: 82, value: 'KB Transition Submit Referral', activateSW: 'Y' },
    { code: 83, value: 'Transition Out Of PACE Submit PAE', activateSW: 'Y' },
    { code: 84, value: 'Withdraw Transition Request', activateSW: 'Y' },
    { code: 102, value: 'Appeal is Ready for Review', activateSW: 'Y' },
    { code: 103, value: 'Appeal Nurse Review', activateSW: 'Y' },
    { code: 85, value: 'Add Service Initiation/Actual Transition/Actual Discharge Date', activateSW: 'Y' },
    { code: 86, value: 'ECF Internal Transition Slot Assignment', activateSW: 'Y' },
    { code: 87, value: 'ECF External Transition Slot Assignment', activateSW: 'Y' },
    { code: 88, value: 'Appellant Requires a Slot', activateSW: 'Y' },
    { code: 89, value: 'Appeal Outcome Update Slot', activateSW: 'Y' },
    { code: 90, value: 'Resolve Slot Conflict', activateSW: 'Y' },
    { code: 91, value: 'Complete CEA Review', activateSW: 'Y' },
    { code: 92, value: 'CEA Slot Review', activateSW: 'Y' },
    { code: 93, value: 'Review CHOICES 2 Slot', activateSW: 'Y' },
    { code: 94, value: 'Caregiver Change Review', activateSW: 'Y' },
    { code: 95, value: 'Review Slot Assignment', activateSW: 'Y' },
    { code: 96, value: 'Reserved Capacity Slot Assignment', activateSW: 'Y' },
    { code: 97, value: 'Remove from ECF Referral List', activateSW: 'Y' },
    { code: 98, value: 'Part A Waiting List Removal Request', activateSW: 'Y' },
    { code: 99, value: 'Remove from Part A Waiting List', activateSW: 'Y' },
    { code: 100, value: 'Remove from Part B Waiting List', activateSW: 'Y' },
    { code: 101, value: 'Review ECF Slot for New FE', activateSW: 'Y' },
    { code: 104, value: 'Upload Requested Documents', activateSW: 'Y' },
    { code: 105, value: 'Review Uploaded Documents', activateSW: 'Y' },
    { code: 106, value: 'Perform Onsite Assessment', activateSW: 'Y' },
    { code: 107, value: 'Request Onsite to be Put On-hold', activateSW: 'Y' },
    { code: 108, value: 'Complete clinical review of onsite assessment', activateSW: 'Y' },
    { code: 109, value: 'To be Set for Hearing', activateSW: 'Y' },
    { code: 110, value: 'Create Case Referral Packet', activateSW: 'Y' },
    { code: 111, value: 'Create and Upload NOH', activateSW: 'Y' },
    { code: 112, value: 'Review Notice of Hearing', activateSW: 'Y' },
    { code: 113, value: 'OGC to Reschedule a Hearing', activateSW: 'Y' },
    { code: 114, value: 'Upload the Order', activateSW: 'Y' },
    { code: 115, value: 'Update order decision details', activateSW: 'Y' },
    { code: 116, value: 'Create a Supplemental', activateSW: 'Y' },
    { code: 117, value: 'Correction Required for Onsite Assessment', activateSW: 'Y' },
    { code: 118, value: 'Update PASRR', activateSW: 'Y' },
    { code: 119, value: 'Add Cost Effective Alternative Interest', activateSW: 'Y' },
    { code: 120, value: 'Change in caregivers condition', activateSW: 'Y' },
    { code: 121, value: 'Review member submitted ECF Changes', activateSW: 'Y' },
    { code: 122, value: 'Review member submitted Katie Beckett Changes', activateSW: 'Y' },
    { code: 123, value: 'MMIS - Assign Benefit Error', activateSW: 'Y' },
    { code: 124, value: 'Complete Demographic Update Restricted by Case Status', activateSW: 'Y' },
    { code: 125, value: 'Review the MCO', activateSW: 'Y' },
    { code: 126, value: '<MMIS- DCSâ€“ Pending Enrollment>', activateSW: 'Y' },
    { code: 127, value: '<MMIS â€“ Assign Benefit COB Error>', activateSW: 'Y' },
    { code: 128, value: 'Reinstatement Implementation', activateSW: 'Y' },
    { code: 129, value: 'DD to ID Change Implementation', activateSW: 'Y' },
    { code: 130, value: 'ERC Enrollment Addition/Extension', activateSW: 'Y' },
    { code: 131, value: '<MMIS- Incarceration â€“ In-flight Enrollment>', activateSW: 'Y' },
    { code: 132, value: 'Update/Enter Enrollment End Date', activateSW: 'Y' },
    { code: 133, value: 'Person Match', activateSW: 'Y' },
    { code: 134, value: 'Input SSN for Pending PAE', activateSW: 'Y' },
    { code: 135, value: 'Link Two Individuals', activateSW: 'Y' },
    { code: 136, value: 'Katie Beckett Part BDisenrollment', activateSW: 'Y' },
    { code: 137, value: 'Katie Beckett Part A Disenrollment', activateSW: 'Y' },
    { code: 138, value: 'TEDS Link Acknowledgment', activateSW: 'Y' },
    { code: 139, value: 'Unlink Two Individuals', activateSW: 'Y' },
    { code: 140, value: 'Select Action to Complete Appeal Resolution', activateSW: 'Y' },
    { code: 142, value: 'Create Enrollment Record for Appeal', activateSW: 'Y' },
    { code: 143, value: 'Implement Order Granting Service', activateSW: 'Y' },
    { code: 144, value: 'Appeal Decision is Approval', activateSW: 'Y' },
    { code: 145, value: 'Onsite Amendment Required', activateSW: 'Y' },
    { code: 146, value: 'Update Comparable Cost of Care', activateSW: 'Y' },
    { code: 147, value: 'Multiple Approved PAE Resolution', activateSW: 'Y' },
    { code: 148, value: 'Approve Comparable Cost of Care', activateSW: 'Y' },
    { code: 149, value: 'NOH Correction Required', activateSW: 'Y' },
    { code: 150, value: 'Create COB', activateSW: 'Y' },
    { code: 151, value: 'Close Appeal', activateSW: 'Y' }
  ];
  ecfStatusList = [
    { name: 'PS', value: 'Pending Submission', activateSW: 'Y' },
    { name: 'NW', value: 'New', activateSW: 'Y' },
    { name: 'IN', value: 'Intake', activateSW: 'Y' },
    { name: 'RR', value: 'Request for Reassignment', activateSW: 'Y' },
    { name: 'NR', value: 'Nurse Review', activateSW: 'Y' },
    { name: 'IA', value: 'IARC Review', activateSW: 'Y' },
    { name: 'IR', value: 'Information Requested', activateSW: 'Y' },
    { name: 'SA', value: 'Pending Slot Assignment', activateSW: 'Y' },
    { name: 'RL', value: 'On Referral List', activateSW: 'Y' },
    { name: 'PE', value: 'Pending PAE', activateSW: 'Y' },
    { name: 'TP', value: 'TP Denied', activateSW: 'Y' },
    { name: 'CP', value: 'Complete', activateSW: 'Y' },
    { name: 'EN', value: 'Ended', activateSW: 'Y' },
    { name: 'UC', value: 'Unable to Contact', activateSW: 'Y' },
    { name: 'IE', value: 'Intake Ended by Applicant Request', activateSW: 'Y' },
    { name: 'RE', value: 'To be Removed from Referral List', activateSW: 'Y' },
    { name: 'CL', value: 'Closed', activateSW: 'Y' },
  ];
  kbStatusList = [
    { name: 'NE', value: 'New', activateSW: 'Y' },
    { name: 'IN', value: 'Intake', activateSW: 'Y' },
    { name: 'PP', value: 'Pending PAE', activateSW: 'Y' },
    { name: 'CO', value: 'Complete', activateSW: 'Y' },
    { name: 'EN', value: 'Ended', activateSW: 'Y' },
    { name: 'OW', value: 'On Waiting List', activateSW: 'Y' },
    { name: 'RE', value: 'To Be Removed from Waiting List', activateSW: 'Y' },
    { name: 'CL', value: 'Closed', activateSW: 'Y' },
  ];
  referralStatusList = [
    { name: 'PS', value: 'Pending Submission', activateSW: 'Y' },
    { name: 'NW', value: 'New', activateSW: 'Y' },
    { name: 'IN', value: 'Intake', activateSW: 'Y' },
    { name: 'RR', value: 'Request for Reassignment', activateSW: 'Y' },
    { name: 'NR', value: 'Nurse Review', activateSW: 'Y' },
    { name: 'IA', value: 'IARC Review', activateSW: 'Y' },
    { name: 'IR', value: 'Information Requested', activateSW: 'Y' },
    { name: 'SA', value: 'Pending Slot Assignment', activateSW: 'Y' },
    { name: 'RL', value: 'On Referral List', activateSW: 'Y' },
    { name: 'PE', value: 'Pending PAE', activateSW: 'Y' },
    { name: 'TP', value: 'TP Denied', activateSW: 'Y' },
    { name: 'CP', value: 'Complete', activateSW: 'Y' },
    { name: 'EN', value: 'Ended', activateSW: 'Y' },
    { name: 'UC', value: 'Unable to Contact', activateSW: 'Y' },
    { name: 'IE', value: 'Intake Ended by Applicant Request', activateSW: 'Y' },
    { name: 'RE', value: 'To be Removed from Referral List', activateSW: 'Y' },
    { name: 'IT',	value: 'Ended - Initiated Transition', activateSW: 'Y'},
    { name: 'CL', value: 'Closed', activateSW: 'Y' },
  ];
  grandRegionList = [
    { name: 'WR', value: 'West Region', activateSW: 'Y' },
    { name: 'MR', value: 'Middle Region', activateSW: 'Y' },
    { name: 'ER', value: 'East Region', activateSW: 'Y' },
  ];
  taskQueueList = [
    {
      name: '2',
      value: 'REF: LTSS Referral Reassignment Review',
      activateSW: 'Y',
    },
    {
      name: 'CROA',
      value: 'APL: Correction Required for Onsite Assessment',
      activateSW: 'Y',
    },
    { name: 'ARS', value: 'SLT: Appeallant Requires a Slot', activateSW: 'Y' },
    {
      name: 'RDAN',
      value: 'APL: Review Additional Documents',
      activateSW: 'Y',
    },
    {
      name: 'RDOC',
      value: 'APL: Review Additional Documents',
      activateSW: 'Y',
    },
    {
      name: 'CNHR',
      value: 'APL: Complete a Nurse Hearing Reference Form',
      activateSW: 'Y',
    },
    { name: 'CNOH', value: 'APL: Correct NOH', activateSW: 'Y' },
    { name: 'AP', value: 'APL: Approve PASRR', activateSW: 'Y' },
    { name: 'CS', value: 'APL: Create a Supplemental', activateSW: 'Y' },
    /*{
      name: 'UIO',
      value: 'REF: Update Intake Outcome Based on Appeal Decision',
      activateSW: 'Y',
    },
    {
      name: 'ADPI',
      value: 'REF: Appeal Decision Process- Intake Outcome',
      activateSW: 'Y',
    },*/
    { name: 'AOHS', value: 'SLT: Appeal Outcome Hold a Slot', activateSW: 'Y' },
    {
      name: 'UEAO',
      value: 'ENR: Update Enrollment based on Appeal Outcome',
      activateSW: 'Y',
    },
    {
      name: 'COBE',
      value: 'ENR: <MMIS – Assign Benefit COB Error>',
      activateSW: 'Y',
    },
    { name: 'OPUR', value: 'ENR: Override PAE Update Review', activateSW: 'Y' },
    {
      name: 'ROPO',
      value: 'APL: Request Onsite to be Put On-hold',
      activateSW: 'Y',
    },
    { name: 'ARR', value: 'APL: Appeal is Ready for Review', activateSW: 'Y' },
    {
      name: 'RRE',
      value: 'ADJ: Recertification Review - ECF',
      activateSW: 'Y',
    },
    {
      name: 'MABE',
      value: 'ENR: MMIS - Assign Benefit Error',
      activateSW: 'Y',
    },
    { name: 'RI', value: 'ENR: Reinstatement Implementation', activateSW: 'Y' },
    {
      name: 'DICI',
      value: 'ENR: DD to ID Change Implementation',
      activateSW: 'Y',
    },
    { name: 'LCI', value: 'ENR: LON Change Implementation', activateSW: 'Y' },
    {
      name: 'CTEC',
      value: 'ENR: Complete Transition Enrollment - CAC',
      activateSW: 'Y',
    },
    {
      name: 'CTEI',
      value: 'ENR: Complete Transition Enrollment - ICF',
      activateSW: 'Y',
    },
    {
      name: 'CTEP',
      value: 'ENR: Complete Transition Enrollment - PACE',
      activateSW: 'Y',
    },
    {
      name: 'CTE3',
      value: 'ENR: Complete Transition Enrollment - CHOICES Group 3',
      activateSW: 'Y',
    },
    {
      name: 'CTE2',
      value: 'ENR: Complete Transition Enrollment - CHOICES Group 2',
      activateSW: 'Y',
    },
    {
      name: 'CTE1',
      value: 'ENR: Complete Transition Enrollment - CHOICES Group 1',
      activateSW: 'Y',
    },
    {
      name: 'CTEE',
      value: 'ENR: Complete Transition Enrollment - ECF CHOICES',
      activateSW: 'Y',
    },
    { name: 'CSR', value: 'SLT: CEA Slot Review', activateSW: 'Y' },
    { name: 'RC2S', value: 'SLT: Review CHOICES 2 Slot', activateSW: 'Y' },
    { name: 'CCR', value: 'SLT: Caregiver Change Review', activateSW: 'Y' },
    { name: 'RSA', value: 'SLT: Review Slot Assignment', activateSW: 'Y' },
    { name: 'PM', value: 'PER: Person Match', activateSW: 'Y' },
    { name: 'ISPP', value: 'PER: Input SSN for Pending PAE', activateSW: 'Y' },
    { name: '1', value: 'REF: New ECF CHOICES Intake', activateSW: 'Y' },
    {
      name: 'CCEI',
      value: 'ENR: Cost Cap Exception Implementation',
      activateSW: 'Y',
    },
    /*{
      name: 'TECI',
      value: 'REF: Transition ECF CHOICES Intake',
      activateSW: 'Y',
    },*/
    {
      name: 'PRKA',
      value: 'PAE: Physician Review for KB Part A',
      activateSW: 'Y',
    },
    { name: 'NRKA', value: 'PAE: Nurse Review for KB Part A', activateSW: 'Y' },
    { name: 'CEAR', value: 'ADJ: Complete CEA Review', activateSW: 'Y' },
    { name: 'SISR', value: 'ADJ: SIS Assessment Review', activateSW: 'Y' },
    {
      name: '3',
      value: 'REF: Nurse Review for ECF CHOICES',
      activateSW: 'Y',
    },
    {
      name: 'EEAE',
      value: 'ENR: ERC Enrollment Additon/Extension',
      activateSW: 'Y',
    },
    { name: 'RNOH', value: 'APL: Review Notice of Hearing', activateSW: 'Y' },
    {
      name: 'UODD',
      value: 'APL: Update order decision details',
      activateSW: 'Y',
    },
    { name: 'ANR', value: 'APL: Appeal Nurse Review', activateSW: 'Y' },
    {
      name: 'RDUM',
      value: 'APL: Review Documents Uploaded by the MCO',
      activateSW: 'Y',
    },
    { name: 'RLSA', value: 'APL: Review the Returned LSA', activateSW: 'Y' },
    {
      name: 'CROA',
      value: 'APL: Complete clinical review of onsite assessment',
      activateSW: 'Y',
    },
    {
      name: 'CNEC',
      value: 'ENR: Complete New Enrollment - CAC',
      activateSW: 'Y',
    },
    { name: 'MCOP', value: 'ENR: <MMIS- MCO_Update – PAE>', activateSW: 'Y' },
    {
      name: 'MCOR',
      value: 'ENR: <MMIS - MCO_Update – at-risk MCO>',
      activateSW: 'Y',
    },
    {
      name: 'MIFE',
      value: 'ENR: <MMIS In-flight Enrollment>',
      activateSW: 'Y',
    },
    { name: 'MCOR', value: 'ENR: Review the MCO', activateSW: 'Y' },
    {
      name: 'CNEI',
      value: 'ENR: Complete New Enrollment - ICF',
      activateSW: 'Y',
    },
    {
      name: 'CNEP',
      value: 'ENR: Complete New Enrollment - PACE',
      activateSW: 'Y',
    },
    {
      name: 'CNE3',
      value: 'ENR: Complete New Enrollment - CHOICES Group 3',
      activateSW: 'Y',
    },
    {
      name: 'CNE2',
      value: 'ENR: Complete New Enrollment - CHOICES Group 2',
      activateSW: 'Y',
    },
    {
      name: 'CNE1',
      value: 'ENR: Complete New Enrollment - CHOICES Group 1',
      activateSW: 'Y',
    },
    {
      name: 'CNEE',
      value: 'ENR: Complete New Enrollment - ECF CHOICES',
      activateSW: 'Y',
    },
    {
      name: 'CDR',
      value: 'ENR: Complete Disenrollment Request',
      activateSW: 'Y',
    },
    {
      name: 'CCC',
      value: 'PAE: Change in caregiver\'s condition',
      activateSW: 'Y',
    },
    { name: 'LONC', value: 'ADJ: LON Change Request', activateSW: 'Y' },
    { name: 'CCER', value: 'ADJ: Cost Cap Exception Review ', activateSW: 'Y' },
    { name: 'RAS', value: 'ADJ: Review Audit Submission', activateSW: 'Y' },
    { name: 'PA', value: 'ADJ: Perform Audit', activateSW: 'Y' },
    { name: 'RSC', value: 'SLT: Resolve Slot Conflict', activateSW: 'Y' },
    {
      name: 'CRDU',
      value: 'GEN: Complete Demographic Update Restricted by Case Status',
      activateSW: 'Y',
    },
    {
      name: 'CSIS',
      value: 'PAE: Complete SIS Assessment Request',
      activateSW: 'Y',
    },
    {
      name: '6',
      value: 'REF: Additional Information Requested for a Referral',
      activateSW: 'Y',
    },
    {
      name: 'RRWL',
      value: 'SLT: Remove from Referral/Wait List',
      activateSW: 'Y',
    },
    { name: 'SLSA', value: 'APL: Send for LSA', activateSW: 'Y' },
    { name: 'POA', value: 'APL: Perform Onsite Assessment', activateSW: 'Y' },
    {
      name: 'KBSR',
      value: 'PAE: DIDD Part B Supervisor Review Queue',
      activateSW: 'Y',
    },
    {
      name: 'ATC',
      value: 'ADJ: Adjudicate Transition to CAC PAE',
      activateSW: 'Y',
    },
    {
      name: 'ATI',
      value: 'ADJ: Adjudicate Transition to ICF PAE',
      activateSW: 'Y',
    },
    {
      name: 'KBWR',
      value: 'PAE: Review KB Withdrawal Request - DIDD',
      activateSW: 'Y',
    },
    {
      name: 'ATP',
      value: 'ADJ: Adjudicate PACE Transition PAE',
      activateSW: 'Y',
    },
    {
      name: 'ATCH',
      value: 'ADJ: Adjudicate CHOICES HCBS Transition PAE',
      activateSW: 'Y',
    },
    {
      name: 'ATCN',
      value: 'ADJ: Adjudicate CHOICES NF Transition PAE',
      activateSW: 'Y',
    },
    {
      name: 'ATE',
      value: 'ADJ: Adjudicate ECF Transition PAE',
      activateSW: 'Y',
    },
    { name: 'ANC', value: 'ADJ: Adjudicate CAC PAE', activateSW: 'Y' },
    { name: 'ANI', value: 'ADJ: Adjudicate ICF PAE', activateSW: 'Y' },
    { name: 'ANP', value: 'ADJ: Adjudicate PACE PAE', activateSW: 'Y' },
    {
      name: 'ANCH',
      value: 'ADJ: Adjudicate CHOICES HCBS PAE',
      activateSW: 'Y',
    },
    { name: 'ANCN', value: 'ADJ: Adjudicate CHOICES NF PAE', activateSW: 'Y' },
    { name: 'ANE', value: 'ADJ: Adjudicate ECF PAE', activateSW: 'Y' },
    {
      name: 'ERCR',
      value: 'ADJ: ERC Addition/Extension Review ',
      activateSW: 'Y',
    },
    {
      name: 'PRR',
      value: 'ADJ: Recertification Review - PACE',
      activateSW: 'Y',
    },
    {
      name: 'C1RR',
      value: 'ADJ: Recertification Review - CHOICES 1',
      activateSW: 'Y',
    },
    {
      name: 'ACEA',
      value: 'PAE: Add Cost Effective Alternative Interest',
      activateSW: 'Y',
    },
    {
      name: 'CSAR',
      value: 'PAE: Complete Safety Assessment Request',
      activateSW: 'Y',
    },
    { name: '4', value: 'REF: Complete IARC Review ', activateSW: 'Y' },
    { name: '5', value: 'REF: DIDD IARC Submission ', activateSW: 'Y' },
    {
      name: 'ECFR',
      value: 'PAE: Complete ECF Recertification',
      activateSW: 'Y',
    },
    /*{
      name: 'ECFW',
      value: 'REF: Review ECF Withdrawal Request',
      activateSW: 'Y',
    },*/
    { name: 'CPAA', value: 'PAE: Complete Part A Assessment', activateSW: 'Y' },
    {
      name: 'KBTP',
      value: 'PAE: Transition Katie Beckett PAE Needed - DIDD',
      activateSW: 'Y',
    },
    {
      name: 'CPC',
      value: 'PAE: Complete PACE Recertification/Reassessment',
      activateSW: 'Y',
    },
    { name: 'ETP', value: 'PAE: Transition ECF PAE Needed', activateSW: 'Y' },
    {
      name: 'CNTP',
      value: 'PAE: Transition CHOICES NF PAE Needed',
      activateSW: 'Y',
    },
    {
      name: 'AC3I',
      value: 'PAE: Add Group 3 Interest Details ',
      activateSW: 'Y',
    },
    {
      name: 'CHTP',
      value: 'PAE: Transition CHOICES HCBS PAE Needed',
      activateSW: 'Y',
    },
    { name: 'ENP', value: 'PAE: Complete ECF PAE', activateSW: 'Y' },
    { name: 'CTP', value: 'PAE: Transition CAC PAE Needed', activateSW: 'Y' },
    { name: 'ITP', value: 'PAE: Transition ICF PAE Needed', activateSW: 'Y' },
    {
      name: '21',
      value: 'REF: New Katie Beckett Referral Received - DIDD',
      activateSW: 'Y',
    },
    {
      name: '82',
      value: 'REF: KB Transition Submit Referral',
      activateSW: 'Y',
    },
    {
      name: 'RMSC',
      value: 'PAE: Review member submitted ECF/Katie Beckett Changes',
      activateSW: 'Y',
    },
    { name: 'PTP', value: 'PAE: Transition PACE PAE Needed', activateSW: 'Y' },
    {
      name: 'CCRP',
      value: 'APL: Create Case Referral Packet',
      activateSW: 'Y',
    },
    { name: 'CAO', value: 'PAE: Complete Annual Outreach', activateSW: 'Y' },
    {
      name: 'WLR',
      value: 'PAE: Waiver - Annual LOC Reassessment',
      activateSW: 'Y',
    },
    {
      name: 'KALR',
      value: 'PAE: Katie Beckett - Part A Annual LOC Reassessment',
      activateSW: 'Y',
    },
    {
      name: 'ELR',
      value: 'PAE: ECF - Annual LOC Reassessment',
      activateSW: 'Y',
    },
    {
      name: 'CLR',
      value: 'PAE: CHOICES - Annual LOC Reassessment',
      activateSW: 'Y',
    },
    {
      name: 'ILR',
      value: 'PAE: ICF - Annual LOC Reassessment',
      activateSW: 'Y',
    },
    {
      name: 'KBLR',
      value: 'PAE: Katie Beckett - Part B Annual LOC Reassessment',
      activateSW: 'Y',
    },
    { name: 'KAAO', value: 'PAE: KB A/C Age-Out Review', activateSW: 'Y' },
    { name: 'AURD', value: 'APL: Upload Requested Documents', activateSW: 'Y' },
   // { name: 'ICAP', value: 'REF: ICAP Request', activateSW: 'Y' },
    { name: 'MOPD', value: 'PAE: Enter MOPD', activateSW: 'Y' },
    { name: 'SAR', value: 'ADJ: Safety Assessment Review', activateSW: 'Y' },
    {
      name: 'ITDD',
      value:
        'PAE: Add Service Initiation/Actual Transition/Actual Discharge Date',
      activateSW: 'Y',
    },
    /*{
      name: 'AIIR',
      value: 'REF: Additional Information Request from IARC Review',
      activateSW: 'Y',
    },*/
    {
      name: 'KTCE',
      value: 'ENR: Transition within Katie Beckett - Complete Enrollment',
      activateSW: 'Y',
    },
    { name: 'PFE', value: 'ENR: Pending FE determination', activateSW: 'Y' },
    { name: 'SH', value: 'APL: To be Set for Hearing', activateSW: 'Y' },
    { name: 'MCOA', value: 'GEN: <MMIS at-risk MCO>', activateSW: 'Y' },
    {
      name: 'UEEE',
      value: 'ENR: Update/Enter Enrollment End Date',
      activateSW: 'Y',
    },
    { name: 'TLA', value: 'PER: TEDS Link Acknowledgment', activateSW: 'Y' },
    { name: 'L2I', value: 'PER: Link Two Individuals', activateSW: 'Y' },
    { name: 'U2I', value: 'PER: Unlink Two Individuals', activateSW: 'Y' },
    { name: 'UO', value: 'APL: Upload the Order', activateSW: 'Y' },
    { name: 'ORH', value: 'APL: OGC to Reschedule a Hearing', activateSW: 'Y' },
    { name: 'UNOH', value: 'APL: Create and Upload NOH ', activateSW: 'Y' },
  ];
  taskStatusList = [
    { name: 'NW', value: 'New', activateSW: 'Y' },
    { name: 'AS', value: 'Assigned', activateSW: 'Y' },
    { name: 'IP', value: 'In Progress', activateSW: 'Y' },
    { name: 'CL', value: 'Closed', activateSW: 'Y' },
  ];
  countyList = [
    {code: '001', value:'Anderson', activateSW:'Y'},
    {code: '002', value:'Bedford', activateSW:'Y'},
    {code: '003', value:'Benton', activateSW:'Y'},
    {code: '004', value:'Bledsoe', activateSW:'Y'},
    {code: '005', value:'Blount', activateSW:'Y'},
    {code: '006', value:'Bradley', activateSW:'Y'},
    {code: '007', value:'Campbell', activateSW:'Y'},
    {code: '008', value:'Cannon', activateSW:'Y'},
    {code: '009', value:'Carroll', activateSW:'Y'},
    {code: '010', value:'Carter', activateSW:'Y'},
    {code: '011', value:'Cheatham', activateSW:'Y'},
    {code: '012', value:'Chester', activateSW:'Y'},
    {code: '013', value:'Claiborne', activateSW:'Y'},
    {code: '014', value:'Clay', activateSW:'Y'},
    {code: '015', value:'Cocke', activateSW:'Y'},
    {code: '016', value:'Coffee', activateSW:'Y'},
    {code: '017', value:'Crockett', activateSW:'Y'},
    {code: '018', value:'Cumberland', activateSW:'Y'},
    {code: '019', value:'Davidson', activateSW:'Y'},
    {code: '020', value:'Decatur', activateSW:'Y'},
    {code: '021', value:'DeKalb', activateSW:'Y'},
    {code: '022', value:'Dickson', activateSW:'Y'},
    {code: '023', value:'Dyer', activateSW:'Y'},
    {code: '024', value:'Fayette', activateSW:'Y'},
    {code: '025', value:'Fentress', activateSW:'Y'},
    {code: '026', value:'Franklin', activateSW:'Y'},
    {code: '027', value:'Gibson', activateSW:'Y'},
    {code: '028', value:'Giles', activateSW:'Y'},
    {code: '029', value:'Grainger', activateSW:'Y'},
    {code: '030', value:'Greene', activateSW:'Y'},
    {code: '031', value:'Grundy', activateSW:'Y'},
    {code: '032', value:'Hamblen', activateSW:'Y'},
    {code: '033', value:'Hamilton', activateSW:'Y'},
    {code: '034', value:'Hancock', activateSW:'Y'},
    {code: '035', value:'Hardeman', activateSW:'Y'},
    {code: '036', value:'Hardin', activateSW:'Y'},
    {code: '037', value:'Hawkins', activateSW:'Y'},
    {code: '038', value:'Haywood', activateSW:'Y'},
    {code: '039', value:'Henderson', activateSW:'Y'},
    {code: '040', value:'Henry', activateSW:'Y'},
    {code: '041', value:'Hickman', activateSW:'Y'},
    {code: '042', value:'Houston', activateSW:'Y'},
    {code: '043', value:'Humphreys', activateSW:'Y'},
    {code: '044', value:'Jackson', activateSW:'Y'},
    {code: '045', value:'Jefferson', activateSW:'Y'},
    {code: '046', value:'Johnson', activateSW:'Y'},
    {code: '047', value:'Knox', activateSW:'Y'},
    {code: '048', value:'Lake', activateSW:'Y'},
    {code: '049', value:'Lauderdale', activateSW:'Y'},
    {code: '050', value:'Lawrence', activateSW:'Y'},
    {code: '051', value:'Lewis', activateSW:'Y'},
    {code: '052', value:'Lincoln', activateSW:'Y'},
    {code: '053', value:'Loudon', activateSW:'Y'},
    {code: '054', value:'Macon', activateSW:'Y'},
    {code: '055', value:'Madison', activateSW:'Y'},
    {code: '056', value:'Marion', activateSW:'Y'},
    {code: '057', value:'Marshall', activateSW:'Y'},
    {code: '058', value:'Maury', activateSW:'Y'},
    {code: '059', value:'Meigs', activateSW:'Y'},
    {code: '060', value:'Monroe', activateSW:'Y'},
    {code: '061', value:'Montgomery', activateSW:'Y'},
    {code: '062', value:'Moore', activateSW:'Y'},
    {code: '063', value:'Morgan', activateSW:'Y'},
    {code: '064', value:'McMinn', activateSW:'Y'},
    {code: '065', value:'McNairy', activateSW:'Y'},
    {code: '066', value:'Obion', activateSW:'Y'},
    {code: '067', value:'Overton', activateSW:'Y'},
    {code: '068', value:'Perry', activateSW:'Y'},
    {code: '069', value:'Pickett', activateSW:'Y'},
    {code: '070', value:'Polk', activateSW:'Y'},
    {code: '071', value:'Putnam', activateSW:'Y'},
    {code: '072', value:'Rhea', activateSW:'Y'},
    {code: '073', value:'Roane', activateSW:'Y'},
    {code: '074', value:'Robertson', activateSW:'Y'},
    {code: '075', value:'Rutherford', activateSW:'Y'},
    {code: '076', value:'Scott', activateSW:'Y'},
    {code: '077', value:'Sequatchie', activateSW:'Y'},
    {code: '078', value:'Sevier', activateSW:'Y'},
    {code: '079', value:'Shelby', activateSW:'Y'},
    {code: '080', value:'Smith', activateSW:'Y'},
    {code: '081', value:'Stewart', activateSW:'Y'},
    {code: '082', value:'Sullivan', activateSW:'Y'},
    {code: '083', value:'Sumner', activateSW:'Y'},
    {code: '084', value:'Tipton', activateSW:'Y'},
    {code: '085', value:'Trousdale', activateSW:'Y'},
    {code: '086', value:'Unicoi', activateSW:'Y'},
    {code: '087', value:'Union', activateSW:'Y'},
    {code: '088', value:'Van Buren', activateSW:'Y'},
    {code: '089', value:'Warren', activateSW:'Y'},
    {code: '090', value:'Washington', activateSW:'Y'},
    {code: '091', value:'Wayne', activateSW:'Y'},
    {code: '092', value:'Weakley', activateSW:'Y'},
    {code: '093', value:'White', activateSW:'Y'},
    {code: '094', value:'Williamson', activateSW:'Y'},
    {code: '095', value:'Wilson', activateSW:'Y'},
    {code: '999', value:'Out of State', activateSW:'Y'}
  ];
  fileteredtaskQueueList =  this.filterByValue(this.taskQueueList, 'ref:');
  ecfStatusRegions = '';
  ecfStatusCategory = '';
  kbStatusRegions = '';
  referralFilterRequest: any;
  referralFilterData: any;
  displayedColumns = [
    'firstName',
    'ssn',
    'refId',
    'grandRegion',
    'submissionDt',
    'intakeDueDate',
    'refStatus',
  ];
  dataSource: MatTableDataSource<any>;
  expandedElement;
  showPagination = false;
  ecfReferralStatusCount: any;
  kbMap = new Map();
  ecfMap = new Map();
  kbReferralStatusCount: any;
  ecfReferralQueue: any;
  kbReferralQueue: any;
  referralCount: any;
  referralSearch: FormGroup;
  panelOpenState = false;
  matDialogRef: any;
  userProfiles = [];
  ecfTableToggled = false;
  kbTableToggled = false;
  taskStatusCondition = false;
  public orderByKey(a, b) {
    return a.key;
  }

  ngOnInit() {
    this.referralService.getUserProfilesByEntityId(this.entityId).subscribe(res => {
      this.userProfiles = res;
    });
    this.getAllPersonDetails();
    this.rightnavToggleService.setRightnavFlag(false);
    this.referralSearch = this.fb.group({
      personDisplayName: [''],
      searchText: [null],
      referralId: [''],
      referralStatus: [''],
      referralRecievedDate: [null],
      grandRegion: [''],
      taskStatus: [''],
      taskQueue: [''],
    });
    
    for (const ecfReferral of this.ecfStatusList) {
      this.ecfMap.set(ecfReferral.name, ecfReferral.value);
    }
    for (const kbReferral of this.kbStatusList) {
      this.kbMap.set(kbReferral.name, kbReferral.value);
    }
    for ( const row of this.grandRegionList){
      this.grandRegionMap.set(row.name, row.value);
    }
    for (const row of this.taskStatusList){
      this.taskStatusMap.set(row.name, row.value);
    }
    for ( const row of this.countyList){
      this.countyMap.set(row.code, row.value);
    }
    this.countPending();
    this.countIntakeStats();
    this.loadTaskTableData();
    for (const taskQ of this.taskQueue) {
      this.taskQueueMap.set(taskQ.code, taskQ.value);
    }
    this.ecfStatusCount();
    this.kbStatusCount();

    this.dataSource = new MatTableDataSource([]);
    setTimeout(() => this.dataSource.paginator = this.paginator);
    setTimeout(() => this.dataSource.sort = this.sort);

    this.isSupervisor();
  }
  ngAfterViewInit() {
    setTimeout(() => this.dataSource.paginator = this.paginator);
    setTimeout(() => this.dataSource.sort = this.sort);

  }

  searchUserPopup(element) {
    console.log('userProfiel', this.userProfiles)
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = { userProfiles: this.userProfiles};
    // dialogConfig.data = { route: 'ltss/pae' , nextRoute: '/ltss/pae/paeStart/' + this.nextPath };
    dialogConfig.panelClass = 'exp_popup';
    dialogConfig.width = '65vw';
    dialogConfig.autoFocus = false;
    const dialogRef = this.dialog.open(SearchUserPopupComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(res => {
      if (res && res.data) {
        element.assignedUserId = res.data.userName;
        element.userSelected = true;
        //backend call to update this username
        const reqObj = {
          "assignedUserId": res.data.userName,
          "entityId": res.data.entityId,
          "roleId": res.data.roleId,
          "taskIds": [
              element.taskId
          ]
        }
        this.referralService.updateUserId(reqObj).subscribe(res => {
          console.log('Updated result', res);

        })
      }
      console.log('from popup close', res);
    })
  }


  filterByValue(array, string) {
    return array.filter(o =>
        Object.keys(o).some(k => o[k].toLowerCase().includes(string.toLowerCase())));
  }

  getFormData() {
    return this.referralSearch.controls;
  }

  getSSNMask (ssn:string) {
    if (ssn) {
      const formstring = ssn.substr(0,3) + '-' + ssn.substr(3,2) + '-' + ssn.substr(5,4);
      return formstring;
    }
  }

  handleSelection(option) {
    const date = option.prsnDetail.dobDt;
    this.personDisplayName = 'Name: ' + option.prsnDetail.firstName + ' ' + option.prsnDetail.lastName + ', DOB: ' + date + ', SSN: '
    + option.prsnDetail.ssn + ', PersonId: ' + option.prsnDetail.prsnId;
    if (option.prsnDetail.cntyCd) {
      this.personDisplayName = this.personDisplayName + ', CountyCode: ' + option.prsnDetail.cntyCd;
    }
    this.personId = option.prsnDetail.prsnId;
    this.referralSearch.controls.personDisplayName.setValue(this.personDisplayName);
    this.additionalSerachName = option.prsnDetail.firstName;
  }

  dateFormat(date) {
    const previousDate = new Date(date);
    const dobDate = String(previousDate.getDate()).padStart(2, '0');
    const dobMonth = String(previousDate.getMonth() + 1).padStart(2, '0');
    const dobYear = previousDate.getFullYear();
    return dobMonth + '/' + dobDate + '/' + dobYear;
  }

  getAllPersonDetails() {
    fromEvent(this.applicantNameInput.nativeElement, 'keyup').pipe(
      map((event: any) => {
        return event.target.value;
      })
      , filter(res => res.length >= 1)
      , debounceTime(500)
      , distinctUntilChanged()
    ).subscribe((text: string) => {
      const PersonDetailsSubscriptions = this.referralDashboardService.getPersonDetails(text,this.entityId).subscribe((res) => {
        this.personOptions = []
        if (res && res.length > 0) {
          res.forEach(personDetail => {
            this.personOptions.push({
              personId: personDetail.personId,
              prsnDetail: personDetail
            });
          });
        }
      });
      this.subscriptions$.push(PersonDetailsSubscriptions);
    });
  }

  toggleDropDown(dropDown) {
    if (dropDown === 'additonalFilterCriteria') {
      this.isAdditonalFilterCriteriaDropDownToggled = !this.isAdditonalFilterCriteriaDropDownToggled;
    }
  }
  pendingReferralSubmission(countData){
    this.searchReferralClicked = true;
    if (countData === 'pendingSubmission') {
      if (this.pendingReferralCountData !== null) {
        this.dataSource = new MatTableDataSource(this.pendingReferralCountData);
      }
    }
    if (countData === 'futureDues5DaysData') {
      if (this.futureDues5DaysData !== null) {
        this.dataSource = new MatTableDataSource(this.futureDues5DaysData);
      }
    }
    if (countData === 'pastDuesPendingCountData') {
      if (this.pastDuesPendingCountData !== null) {
        this.dataSource = new MatTableDataSource(this.pastDuesPendingCountData);
      }
    }
    if (countData === 'totalPendingCountData') {
      if (this.totalPendingCountData !== null) {
        this.dataSource = new MatTableDataSource(this.totalPendingCountData);
      }
    }
    const countDataPrefix = countData.split(':')[0] ;
    const countDataPostfix = countData.split(':')[1] ;

    if (countDataPrefix !== null && countDataPrefix === 'taskCount'
      && Number(countDataPostfix) !== NaN ) {
      if (this.taskQueueCountData !== null) {
        this.taskQueueCountDataTemp = [];
        for ( const row of this.taskQueueCountData) {
          if (row.taskQueue ===  Number(countDataPostfix)){
            this.taskQueueCountDataTemp.push(row);
          }
        }

        this.dataSource = new MatTableDataSource(this.taskQueueCountDataTemp);
      }
    }
    if (countData === 'twentyDaysOlderPendingCountData'){
      if (this.twentyDaysOlderPendingCountData !== null) {
        this.dataSource = new MatTableDataSource(this.twentyDaysOlderPendingCountData);
      }
    }
    if (countData === 'kbReferralPendingCountData'){
      if (this.kbReferralPendingCountData !== null) {
        this.dataSource = new MatTableDataSource(this.kbReferralPendingCountData);
      }
    }
    if (this.dataSource.data.length > 0) {
      this.searchTableResultsReady = true;
      setTimeout(() => this.dataSource.paginator = this.paginator);
      setTimeout(() => this.dataSource.sort = this.sort);
      const element = document.getElementById('dashboardTable');
      if (element !== null) {
        element.scrollIntoView({behavior:'smooth'});
      }
    }
    else if (this.dataSource.data.length === 0){
      this.searchTableResultsReady = true;
    }
    else if (this.dataSource.data.length > 10){
      this.showPagination = true;
    }
    else if (this.dataSource.data.length < 10){
      this.showPagination = false;
    }
    setTimeout(() => this.dataSource.paginator = this.paginator);

  }

  matTableCountData(dataForTable){
    this.searchReferralClicked = true;
    if (dataForTable !== null) {
      console.log(dataForTable);
      this.dataSource = new MatTableDataSource(dataForTable);
    }
    setTimeout(() => this.dataSource.paginator = this.paginator);
    if (this.dataSource && this.dataSource.data && this.dataSource.data.length > 0) {
        this.searchTableResultsReady = true;
      }
    const element = document.getElementById('dashboardTable');
    if (element !== null) {
      element.scrollIntoView({behavior:'smooth'});
    }
  }

  ecfStatusRegion(region) {
    this.ecfStatusRegions = region;
    this.ecfStatusCount();
    this.ecfTableToggled = true;
  }

  ecfStatusEntity(entity) {
    this.ecfStatusCategory = entity;
    this.ecfStatusCount();
    this.ecfTableToggled = true;
  }

  ecfStatusCount() {
    this.subscription3$ = this.referralDashboardService
      .getEcfReferralStats(this.ecfStatusRegions, this.ecfStatusCategory)
      .subscribe((ecfReferralStats) => {
        this.ecfReferralStatusCount = ecfReferralStats;
        console.log(ecfReferralStats);
      });
    this.subscriptions.push(this.subscription3$);
  }

  kbStatusRegion(region) {
    this.kbStatusRegions = region;
    this.kbStatusCount();
    this.kbTableToggled = true;
  }

  kbStatusCount() {
    this.subscription4$ = this.referralDashboardService
      .getKbReferralStats(this.kbStatusRegions)
      .subscribe((kbReferralStats) => {
        this.kbReferralStatusCount = kbReferralStats;
        console.log(kbReferralStats);
      });
    this.subscriptions.push(this.subscription4$);
  }

  isSupervisor() {
    console.log("User Role List: " + this.userRolesList);
    if(this.userRolesList
      && this.userRolesList!=null
      && this.userRolesList
      .filter(e => e.getRoleId()!==null && e.getRoleId()===80009)){
        this.isSupervisorSwitch = true;
    }
  }

  startReferral() {
    this.referralService.setRefId(null);
    this.router.navigate(['/ltss/referral/startReferral']);
  }

  countPending() {
    this.subscription1$ = this.referralDashboardService
      .getCountPendingReferral(this.userId)
      .subscribe((pendingReferralCountResponse) => {
        this.pendingReferralCount = pendingReferralCountResponse.referralCount;
        this.pendingReferralCountData = pendingReferralCountResponse.responseVOs;
        if (this.pendingReferralCount >= 0) {
          this.pendingReferralCountReady = true;
        }
      });
    this.subscriptions.push(this.subscription1$);
  }
  countIntakeStats() {
    this.subscription2$ = this.referralDashboardService
      .getIntakeStats(this.userId)
      .subscribe((intakeStatsResponse) => {
        this.futureDues5Days = intakeStatsResponse.futureDues5Days.referralCount;
        this.futureDues5DaysData = intakeStatsResponse.futureDues5Days.responseVOs;

        this.pastDuesPendingCount = intakeStatsResponse.pastDuesPendingCount.referralCount;
        this.pastDuesPendingCountData = intakeStatsResponse.pastDuesPendingCount.responseVOs;

        this.totalPendingCount = intakeStatsResponse.totalPendingCount.referralCount;
        this.totalPendingCountData = intakeStatsResponse.totalPendingCount.responseVOs;

        this.twentyDaysOlderPendingCount = intakeStatsResponse.twentyDaysOlderPendingCount.referralCount;
        this.twentyDaysOlderPendingCountData = intakeStatsResponse.twentyDaysOlderPendingCount.responseVOs;

        this.kbReferralPendingCount = intakeStatsResponse.kbReferralPastDueVosCount.referralCount;
        this.kbReferralPendingCountData = intakeStatsResponse.kbReferralPastDueVosCount.responseVOs;

        if(this.futureDues5Days>=0 && this.pastDuesPendingCount>=0 && this.totalPendingCount>=0){
          this.intakeVisitCountReady = true;
        }
        if (this.twentyDaysOlderPendingCount > 0) {
          this.alertPastDue = true;
        }
        if (this.kbReferralPendingCount > 0) {
          this.kbAlertPastDue = true;
        }
      });
    this.subscriptions.push(this.subscription2$);
  }

  // supervisor() {
  //  // if (!this.isMyOpenTasksClicked) {
  //     this.searchReferralClicked = true;
  //     this.subscription5$ = this.referralDashboardService
  //       .getEcfReferralStats(this.regionCd, this.entityId )
  //       .subscribe((referralQueueResponse) => {
  //         //console.log(referralQueueResponse.body.referralQueueVOList);
  //         this.dataSource =  new MatTableDataSource(referralQueueResponse.referralQueueVOList);;
  //         //this.queueCdCountMap =  referralQueueResponse.body.queueCdCountMap;

  //         this.ecfReferralQueue = referralQueueResponse.body.ecfRefReviewCount;
  //         this.kbReferralQueue = referralQueueResponse.body.katieBeckettRefReviewCount;
  //       });
  //     this.subscriptions.push(this.subscription5$);
  //  // }
  //   this.isMyOpenTasksClicked = true;
  // }

  loadTaskTableData() {
    this.subscription9$ = this.referralDashboardService
      .getReferralQueueCount(this.userId, this.entityId, this.dashboardCd, this.taskStatusCd)
      .subscribe(data => {
        this.records = data;
        console.log('records :' + this.records);
        this.taskTable = this.records.queueCdCountMap;
        this.result = Object.keys(this.taskTable).map((key) => [Number(key), this.taskTable[key]]);
        console.log(this.result);
        this.result.sort((a, b) => {​​​​​
          return b[1]-a[1];
        }​​​​​);
      console.log("By count"+ JSON.stringify(this.result));
            this.result = new Map(this.result);
            this.taskTable = this.result;
        // if(this.taskTable!=null){
          this.taskTableShowResult = true;
        // }
        console.log('queue map :' + this.records.queueCdCountMap);
        this.taskQueueCountData = this.records.referralQueueVOList;
        console.log('taskTable : ' + JSON.stringify(this.taskTable));
        // this.displayTable = true;
      });
    this.subscriptions.push(this.subscription9$);
  }

  myOpenTasks() {
    // if (!this.isMyOpenTasksClicked) {
    this.searchReferralClicked = true;
    this.subscription5$ = this.referralDashboardService
      .getReferralMyOpenTaskList(this.userId, this.dashboardCd)
      .subscribe((referralQueueResponse) => {
        this.dataSource = new MatTableDataSource(referralQueueResponse);
        setTimeout(() => this.dataSource.paginator = this.paginator);
        this.searchTableResultsReady = true;
      });
    this.subscriptions.push(this.subscription5$);
    // }
       this.isMyOpenTasksClicked = true;

       const element = document.getElementById('dashboardTable');
       if (element !== null) {
      element.scrollIntoView({behavior:'smooth'});
    }

   }

  referralAdditionalSearch() {
    let recievedDateStringFormat = '';
    if (this.getFormData().referralRecievedDate.value !== null) {
      recievedDateStringFormat = this.getFormData().referralRecievedDate.value.toJSON();
    }
    this.panelOpenState = false;
    if (
      this.getFormData().searchText.value === null ||
      this.getFormData().searchText.value === ''
    ) {


      this.referralFilterRequest = new ReferralFilter(
        this.personId,
        this.getFormData().grandRegion.value,
        this.getFormData().referralId.value,
        recievedDateStringFormat,
        this.getFormData().referralStatus.value,
        this.getFormData().taskQueue.value,
        this.getFormData().taskStatus.value
      );
      console.log(this.referralFilterRequest);
      if (this.getFormData().taskStatus.value === 'CL') {
        this.taskStatusCondition = true;
      }else {
        this.taskStatusCondition = false;
      }
      this.subscription8$ = this.referralDashboardService
        .getReferralSearch(this.referralFilterRequest, this.entityId)
        .subscribe((referralSearchResponse) => {
          this.referralFilterData = referralSearchResponse;
          console.log('ReferralAdditionalSearch response' + referralSearchResponse);
          this.dataSource = new MatTableDataSource(this.referralFilterData);
          setTimeout(() => this.dataSource.paginator = this.paginator);
          this.searchTableResultsReady = true;
        });
      this.subscriptions.push(this.subscription8$);
      this.Accordion.closeAll();
      this.searchReferralClicked = true;
      // this.dataSource = new MatTableDataSource(this.referralFilterData);
      // this.dataSource = new MatTableDataSource(responseFromAPI);
    }
  }

  initiateIntakeClicked(refId, taskStatus, taskQueue, personId, taskId, assignedUser, programCd, element) {
    this.referralService.setRefId(refId);
    this.referralService.setTaskStatus(taskStatus);
    this.referralService.setTaskQueue(taskQueue);
    this.referralService.setPersonId(personId);
    this.referralService.setTaskId(taskId);
    this.referralService.setAssignedUser(assignedUser);
    this.referralService.setRowElement(element);

    this.subscription10$ = this.referralDashboardService
    .initiateIntake(refId, taskId, this.userId)
    .subscribe((initiateIntakeResponse) => {
      console.log('initiateIntakeResponse' + initiateIntakeResponse);
    });

    if (taskQueue !== null && taskQueue !== '' && taskQueue === 21) {
      // this.paeCommonService.setMenuId('KB');
      this.paeCommonService.setMenuId('KB');
      this.paeCommonService.setRowElement(element);
      this.paeCommonService.setTaskId(element.taskId);
      this.paeCommonService.setApplicantName(element.firstName + ' ' + element.lastName);
      this.router.navigate(['/ltss/pae/paeStart/welcome']);
    } else if (taskQueue !== null && taskQueue !== '' && (taskQueue === 3  ||  taskQueue === 4 )) {
      const refEnterIntakeOutcome = new RefEnterIntakeOutcome(
        this.referralService.getRefId(),
        'Y',
        '',
        '',
        '',
        null,
        (element.taskQueue === 3) ? 'NRS' : 'IRC',
        null
      );
      this.referralDashboardService.postEnterIntakeOutcome(refEnterIntakeOutcome).then((response) => {​​​​​
        this.router.navigate(['/ltss/referral/referralIntakeOutcome']);
      }​​​​​);
    } else if (element.taskQueue !== null && element.taskQueue !== '' && (element.taskQueue === 21  ||  element.taskQueue === 82 )){
      this.paeCommonService.setMenuId('KB');
      this.paeCommonService.setRowElement(element);
      this.paeCommonService.setTaskId(element.taskId);
      this.paeCommonService.setApplicantName(element.firstName + ' ' + element.lastName);
      this.router.navigate(['/ltss/pae/paeStart/welcome']);
    }
    else {
      this.router.navigate(['/ltss/referral/referralIntakeActions']);
    }
  }
    viewDetailsClicked(refId, taskStatus, taskQueue, personId, taskId, assignedUser, programCd, element) {
        this.referralService.setRefId(refId);
        this.referralService.setTaskStatus(taskStatus);
        this.referralService.setTaskQueue(taskQueue);
        this.referralService.setPersonId(personId);
        this.referralService.setTaskId(taskId);
        this.referralService.setAssignedUser(assignedUser);
        this.referralService.setRowElement(element);

        this.router.navigate(['/ltss/referral/referralIntakeActions']);
      }
 deleteButtonClicked(refId) {
  const referralIdToDelete = refId;
  this.matDialogRef = this.dialog.open(DeleteRecordPopupComponent, {
    width: '500px',
    height: 'auto',
  });
  this.subscription6$ = this.matDialogRef.afterClosed()
    .subscribe((data) => {
      if (data.isDelete) {
        console.log('Delete Confirm');
        this.subscription7$ =  this.referralDashboardService
          .deleteReferral(referralIdToDelete)
          .subscribe((deleteResponse) => {
             console.log(deleteResponse);
             const index = this.dataSource.data.findIndex(x => x.refId === referralIdToDelete);
             this.dataSource.data.splice( index, 1);
             this.dataSource = new MatTableDataSource(this.dataSource.data);
             setTimeout(() => this.dataSource.paginator = this.paginator);
             this.countPending();
          });
      } else {
        console.log('Delete Rejected');
      }
    });

   this.subscriptions.push(this.subscription7$);

  this.subscriptions.push(this.subscription6$);
   }

  showUpdateTaskDialog(row){
    const dialogConfig =  new MatDialogConfig();
    dialogConfig.minWidth = '800px';
    dialogConfig.maxWidth = '500px';
    dialogConfig.minHeight = '405px';
    dialogConfig.data = {taskId: row.taskId, taskMasterId: row.taskQueue, taskName: row.taskName};
    const dialogRef = this.matDialog.open(UpdateTaskComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(data => {
      this.getTaskDetails();
    });
  }



  getTaskDetails(){
    const observables = [];
    observables.push( this.inboxService.getMyTaskDetails(this.userId, this.entityId));
    observables.push( this.inboxService.getModuleValues());
    observables.push( this.inboxService.getTaskStatusCodes());
    observables.push( this.inboxService.getTaskPriorityCodes());
    observables.push( this.inboxService.getTaskQueues());
    observables.push(this.inboxService.getPagingOptions());

    const TaskDetailsSubscriptions$ = forkJoin(observables).subscribe((res: any) => {
      console.log('raw res ', res);
      const tableRecords = [];
      if (res[0] && res[0].length > 0) {

        res[0].sort((a, b) => {
          if (a.priority > b.priority) { return 1; }
          if (b.priority > a.priority) { return -1; }

          return 0;
        });

        res[0].forEach(row => {
          row.closureConditions = '';
          row.taskDesc = '';
          if (row.userIdResponseVO) {
            const recordIds = [];
            if (row.userIdResponseVO.paeId) { recordIds.push(row.userIdResponseVO.paeId); }
            if (row.userIdResponseVO.referralId) { recordIds.push(row.userIdResponseVO.referralId); }
            if (row.userIdResponseVO.appealId) { recordIds.push(row.userIdResponseVO.appealId); }
            if (row.userIdResponseVO.transitionId) { recordIds.push(row.userIdResponseVO.transitionId); }
            if (row.userIdResponseVO.enrollmentId) { recordIds.push(row.userIdResponseVO.enrollmentId); }
            row.recordId = recordIds.join();
          }
          if (res[1] && res[1].length > 0) {
            const moduleObj =  res[1].filter(rec => rec.name ===  row.moduleCode);
            if (moduleObj && moduleObj.length > 0) {
              row.moduleCode =  moduleObj[0].value;
            } else {
              row.moduleCode = '';
            }
          }
          if (res[2] && res[2].length > 0) {
            const priorityObj =  res[2].filter(rec => rec.code ===  row.status);
            if (priorityObj && priorityObj.length > 0) {
              row.status =  priorityObj[0].value;
            }
          }
          if (res[3] && res[3].length > 0) {
            const statusObj =  res[3].filter(rec => rec.code ===  row.priority);
            if (statusObj && statusObj.length > 0) {
              row.priority =  statusObj[0].value;
            }
          }
          if (res[4] && res[4].length > 0) {
            const taskQueueObj =  res[4].filter(rec => rec.code ===  row.taskName);
            if (taskQueueObj && taskQueueObj.length > 0) {
              row.taskName =  taskQueueObj[0].value;
            }
          }
          if (row.status.toLowerCase() !== 'closed') {
            tableRecords.push(row);
          }
          if (res[5] && res[5].length > 0) {
            this.pageOptions = res[5].map(pageOption => pageOption.value);
            this.selectedPageSize = 10;
            }
        });

      }
      console.log('table records ', tableRecords);
      // this.dataSource = new MatTableDataSource(tableRecords);
      this.referralAdditionalSearch();
      setTimeout(() => this.dataSource.paginator = this.paginator);
      setTimeout (() => {
        this.emitTasksCount.emit(this.dataSource.data.length);
      });

    });
    this.subscriptions.push(TaskDetailsSubscriptions$);
  }

  continueClicked(refId, element){
    this.referralService.setRefId(refId);
    this.referralService.setRowElement(element);
    this.router.navigate(['/ltss/referral/startReferral']);
  }

  continueNonPending(refId, element){
    this.referralService.setRefId(refId);
    this.referralService.setRowElement(element);

    if (element.taskQueue !== null && element.taskQueue !== ''
    && (element.taskQueue === 3  ||  element.taskQueue === 4 )) {
      const refEnterIntakeOutcome = new RefEnterIntakeOutcome(
        this.referralService.getRefId(),
        'Y',
        '',
        '',
        '',
        null,
        (element.taskQueue === 3) ? 'NRS' : 'IRC',
        null
      );
      this.referralDashboardService.postEnterIntakeOutcome(refEnterIntakeOutcome);
      this.referralDashboardService.postEnterIntakeOutcome(refEnterIntakeOutcome).then((response) => {​​​​​
        this.router.navigate(['/ltss/referral/referralIntakeOutcome']);
      }​​​​​);
    } else if (element.taskQueue !== null && element.taskQueue !== '' && (element.taskQueue === 21  ||  element.taskQueue === 82 )){
      this.paeCommonService.setMenuId('KB');
      this.paeCommonService.setRowElement(element);
      this.paeCommonService.setTaskId(element.taskId);
      this.paeCommonService.setApplicantName(element.firstName + ' ' + element.lastName);
      this.router.navigate(['/ltss/pae/paeStart/welcome']);

    }
     else{
      this.router.navigate(['/ltss/referral/referralIntakeActions']);
    }
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    console.log(this.dataSource.filter);
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getPageSizeOptions(){
    if (this.dataSource.data.length > 30) {
      return [10, 20, 30, this.dataSource.data.length];
    }
    else {
     return [10, 20, 30];
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    console.log('referral-dashboard Unsubscribed');
  }
}
