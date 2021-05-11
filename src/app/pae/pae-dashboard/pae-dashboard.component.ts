import { trigger, state, style, transition, animate } from '@angular/animations';
import { AfterViewInit, Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatAccordion } from '@angular/material/expansion';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { PaeCommonService } from '../../core/services/pae/pae-common/pae-common.service';
import { PaeService } from '../../core/services/pae/pae.service';
import { PaeDashboardService } from '../../core/services/pae/pae-dashboard/pae-dashboard.service';
import { PaeFilter } from '../../_shared/model/PaeFilter';
import { DeleteRecordPopupComponent } from '../../_shared/modal/delete-record-popup/delete-record-popup.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { InboxService } from '../../inbox/services/inbox.service';
import { RightnavToggleService } from '../../_shared/services/rightnav-toggle.service';
import { MatPaginator } from '@angular/material/paginator';
import { forkJoin, fromEvent } from 'rxjs';
import { UpdateTaskComponent } from 'src/app/inbox/update-task/update-task.component';
import { ChangeManagementService } from 'src/app/core/services/change-management/change-management.service';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { MatSort } from '@angular/material/sort';
@Component({
  selector: 'app-pae-dashboard',
  templateUrl: './pae-dashboard.component.html',
  styleUrls: ['./pae-dashboard.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ]
})
export class PaeDashboardComponent implements OnInit, OnDestroy, AfterViewInit {
  isMyOpenTasksClicked = false;
  panelOpenState = false;
  @ViewChild('accordion', { static: true }) Accordion: MatAccordion;
  paeSearch: FormGroup;
  searchReferralClicked = false;
  localStorageLocal = localStorage.getItem('APP_STORAGE_TOKEN');
  userId = JSON.parse(this.localStorageLocal).userName;
  entityId = JSON.parse(this.localStorageLocal).entityId;
  supervisorRole = false;
  showPagination = false;
  dashboardCd = 'PAE';
  taskStatusCd = 'NW';
  records: any;
  taskQueueMap = new Map();
  taskStatusMap = new Map();
  searchData = [];
  paeFilterRequest: any;
  pendingPaeCountData: any;
  subscription1$: Subscription;
  subscription2$: Subscription;
  subscription3$: Subscription;
  subscription4$: Subscription;
  subscription5$: Subscription;
  subscriptions: Subscription[] = [];
  pendinPaeCount: any;
  pendingAdjData: any;
  pendingAdj: number;
  approved: number;
  approvedData: any;
  denied: number;
  deniedData: any;
  paeCount: any;
  taskQueueCountData: any;
  taskQueueCountDataTemp: any = [];
  selectedPageSize: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Output() emitTasksCount = new EventEmitter();
  taskTableShowResult = false;
  pendingPaeCountReady = false;
  paeFilterData: any;
  pageOptions: any[] = [];
  result: any = [];
  isAdditonalFilterCriteriaDropDownToggled = false;
  taskId: any;
  countReady = false;

  // My queue count: request param initilization

  taskTable: MatTableDataSource<any>;
  displayedColumnsTaskTable: string[] = ['key', 'value'];
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

  paeStatusList = [
    {
      code: 'PS',
      value: 'Pending Submission',
      activateSW: 'Y'
    },
    {
      code: 'AD',
      value: 'Pending Adjudication',
      activateSW: 'Y'
    },
    {
      code: 'AP',
      value: 'Approved',
      activateSW: 'Y'
    },
    {
      code: 'AA',
      value: 'Approved At Risk',
      activateSW: 'Y'
    },
    {
      code: 'DN',
      value: 'Denied',
      activateSW: 'Y'
    },
    {
      code: 'CL',
      value: 'Closed',
      activateSW: 'Y'
    },
    {
      code: 'WI',
      value: 'Withdrawn',
      activateSW: 'Y'
    },
    {
      code: 'IN',
      value: 'Inactive',
      activateSW: 'Y'
    }
  ];

  enrollmentGroupList = [
    {
      code: 'CG1',
      value: 'CHOICES Group 1',
      activateSW: 'Y'
    },
    {
      code: 'CG2',
      value: 'CHOICES Group 2',
      activateSW: 'Y'
    },
    {
      code: 'CG3',
      value: 'CHOICES Group 3',
      activateSW: 'Y'
    },
    {
      code: 'EC4',
      value: 'ECF CHOICES Group 4',
      activateSW: 'Y'
    },
    {
      code: 'EC5',
      value: 'ECF CHOICES Group 5',
      activateSW: 'Y'
    },
    {
      code: 'EC6',
      value: 'ECF CHOICES Group 6',
      activateSW: 'Y'
    },
    {
      code: 'EC7',
      value: 'ECF CHOICES Group 7',
      activateSW: 'Y'
    },
    {
      code: 'EC8',
      value: 'ECF CHOICES Group 8',
      activateSW: 'Y'
    },
    {
      code: 'PACE',
      value: 'PACE',
      activateSW: 'Y'
    },
    {
      code: 'ICF',
      value: 'ICF/IID',
      activateSW: 'Y'
    },
    {
      code: 'CAC',
      value: 'CAC',
      activateSW: 'Y'
    },
    {
      code: 'KBA',
      value: 'Katie Beckett Part A',
      activateSW: 'Y'
    },
    {
      code: 'KBB',
      value: 'Katie Beckett Part B',
      activateSW: 'Y'
    },
    {
      code: 'SED',
      value: 'Self-Determination Waiver',
      activateSW: 'Y'
    },
    {
      code: 'STW',
      value: 'Statewide Waiver',
      activateSW: 'Y'
    }
  ];

  grandRegionList = [
    { code: 'WR', value: 'West Region', activateSW: 'Y' },
    { code: 'MR', value: 'Middle Region', activateSW: 'Y' },
    { code: 'ER', value: 'East Region', activateSW: 'Y' },
  ];

  displayedColumns = [
    'firstName',
    'ssn',
    'grandRegion',
    'paeId',
    'enrollmentGroup',
    'paeStatus',
  ];
  countyList = [
    { code: '001', value: 'Anderson', activateSW: 'Y' },
    { code: '002', value: 'Bedford', activateSW: 'Y' },
    { code: '003', value: 'Benton', activateSW: 'Y' },
    { code: '004', value: 'Bledsoe', activateSW: 'Y' },
    { code: '005', value: 'Blount', activateSW: 'Y' },
    { code: '006', value: 'Bradley', activateSW: 'Y' },
    { code: '007', value: 'Campbell', activateSW: 'Y' },
    { code: '008', value: 'Cannon', activateSW: 'Y' },
    { code: '009', value: 'Carroll', activateSW: 'Y' },
    { code: '010', value: 'Carter', activateSW: 'Y' },
    { code: '011', value: 'Cheatham', activateSW: 'Y' },
    { code: '012', value: 'Chester', activateSW: 'Y' },
    { code: '013', value: 'Claiborne', activateSW: 'Y' },
    { code: '014', value: 'Clay', activateSW: 'Y' },
    { code: '015', value: 'Cocke', activateSW: 'Y' },
    { code: '016', value: 'Coffee', activateSW: 'Y' },
    { code: '017', value: 'Crockett', activateSW: 'Y' },
    { code: '018', value: 'Cumberland', activateSW: 'Y' },
    { code: '019', value: 'Davidson', activateSW: 'Y' },
    { code: '020', value: 'Decatur', activateSW: 'Y' },
    { code: '021', value: 'DeKalb', activateSW: 'Y' },
    { code: '022', value: 'Dickson', activateSW: 'Y' },
    { code: '023', value: 'Dyer', activateSW: 'Y' },
    { code: '024', value: 'Fayette', activateSW: 'Y' },
    { code: '025', value: 'Fentress', activateSW: 'Y' },
    { code: '026', value: 'Franklin', activateSW: 'Y' },
    { code: '027', value: 'Gibson', activateSW: 'Y' },
    { code: '028', value: 'Giles', activateSW: 'Y' },
    { code: '029', value: 'Grainger', activateSW: 'Y' },
    { code: '030', value: 'Greene', activateSW: 'Y' },
    { code: '031', value: 'Grundy', activateSW: 'Y' },
    { code: '032', value: 'Hamblen', activateSW: 'Y' },
    { code: '033', value: 'Hamilton', activateSW: 'Y' },
    { code: '034', value: 'Hancock', activateSW: 'Y' },
    { code: '035', value: 'Hardeman', activateSW: 'Y' },
    { code: '036', value: 'Hardin', activateSW: 'Y' },
    { code: '037', value: 'Hawkins', activateSW: 'Y' },
    { code: '038', value: 'Haywood', activateSW: 'Y' },
    { code: '039', value: 'Henderson', activateSW: 'Y' },
    { code: '040', value: 'Henry', activateSW: 'Y' },
    { code: '041', value: 'Hickman', activateSW: 'Y' },
    { code: '042', value: 'Houston', activateSW: 'Y' },
    { code: '043', value: 'Humphreys', activateSW: 'Y' },
    { code: '044', value: 'Jackson', activateSW: 'Y' },
    { code: '045', value: 'Jefferson', activateSW: 'Y' },
    { code: '046', value: 'Johnson', activateSW: 'Y' },
    { code: '047', value: 'Knox', activateSW: 'Y' },
    { code: '048', value: 'Lake', activateSW: 'Y' },
    { code: '049', value: 'Lauderdale', activateSW: 'Y' },
    { code: '050', value: 'Lawrence', activateSW: 'Y' },
    { code: '051', value: 'Lewis', activateSW: 'Y' },
    { code: '052', value: 'Lincoln', activateSW: 'Y' },
    { code: '053', value: 'Loudon', activateSW: 'Y' },
    { code: '054', value: 'Macon', activateSW: 'Y' },
    { code: '055', value: 'Madison', activateSW: 'Y' },
    { code: '056', value: 'Marion', activateSW: 'Y' },
    { code: '057', value: 'Marshall', activateSW: 'Y' },
    { code: '058', value: 'Maury', activateSW: 'Y' },
    { code: '059', value: 'Meigs', activateSW: 'Y' },
    { code: '060', value: 'Monroe', activateSW: 'Y' },
    { code: '061', value: 'Montgomery', activateSW: 'Y' },
    { code: '062', value: 'Moore', activateSW: 'Y' },
    { code: '063', value: 'Morgan', activateSW: 'Y' },
    { code: '064', value: 'McMinn', activateSW: 'Y' },
    { code: '065', value: 'McNairy', activateSW: 'Y' },
    { code: '066', value: 'Obion', activateSW: 'Y' },
    { code: '067', value: 'Overton', activateSW: 'Y' },
    { code: '068', value: 'Perry', activateSW: 'Y' },
    { code: '069', value: 'Pickett', activateSW: 'Y' },
    { code: '070', value: 'Polk', activateSW: 'Y' },
    { code: '071', value: 'Putnam', activateSW: 'Y' },
    { code: '072', value: 'Rhea', activateSW: 'Y' },
    { code: '073', value: 'Roane', activateSW: 'Y' },
    { code: '074', value: 'Robertson', activateSW: 'Y' },
    { code: '075', value: 'Rutherford', activateSW: 'Y' },
    { code: '076', value: 'Scott', activateSW: 'Y' },
    { code: '077', value: 'Sequatchie', activateSW: 'Y' },
    { code: '078', value: 'Sevier', activateSW: 'Y' },
    { code: '079', value: 'Shelby', activateSW: 'Y' },
    { code: '080', value: 'Smith', activateSW: 'Y' },
    { code: '081', value: 'Stewart', activateSW: 'Y' },
    { code: '082', value: 'Sullivan', activateSW: 'Y' },
    { code: '083', value: 'Sumner', activateSW: 'Y' },
    { code: '084', value: 'Tipton', activateSW: 'Y' },
    { code: '085', value: 'Trousdale', activateSW: 'Y' },
    { code: '086', value: 'Unicoi', activateSW: 'Y' },
    { code: '087', value: 'Union', activateSW: 'Y' },
    { code: '088', value: 'Van Buren', activateSW: 'Y' },
    { code: '089', value: 'Warren', activateSW: 'Y' },
    { code: '090', value: 'Washington', activateSW: 'Y' },
    { code: '091', value: 'Wayne', activateSW: 'Y' },
    { code: '092', value: 'Weakley', activateSW: 'Y' },
    { code: '093', value: 'White', activateSW: 'Y' },
    { code: '094', value: 'Williamson', activateSW: 'Y' },
    { code: '095', value: 'Wilson', activateSW: 'Y' },
    { code: '999', value: 'Out of State', activateSW: 'Y' }
  ];
  taskStatusList = [
    { name: 'NW', value: 'New', activateSW: 'Y' },
    { name: 'AS', value: 'Assigned', activateSW: 'Y' },
    { name: 'IP', value: 'In Progress', activateSW: 'Y' },
    { name: 'CL', value: 'Closed', activateSW: 'Y' },
  ];
  dataSource: MatTableDataSource<any>;
  expandedElement;
  paeStatusMap = new Map();
  enrollmentGroupMap = new Map();
  grandRegionMap = new Map();
  countyMap = new Map();
  paeQueueVOList: any;
  matDialogRef: any;
  subscription6$: Subscription;
  personId: any;
  additionalSerachName: any;
  subscriptions$: any = [];
  personOptions: any;
  @ViewChild('applicantNameInput', {static: true}) applicantNameInput: ElementRef;
  personIdDetail = '';
  public orderByKey(a, b) {
    return a.key;
  }


  constructor(private fb: FormBuilder,
              private router: Router,
              private paeCommonService: PaeCommonService,
              private paeService: PaeService,
              private paeDashboardService: PaeDashboardService,
              private dialog: MatDialog,
              private matDialog: MatDialog,
              private inboxService: InboxService,
              private rightnavToggleService: RightnavToggleService,
              private changeManagementService: ChangeManagementService) { }

  ngOnInit() {

    this.rightnavToggleService.setRightnavFlag(false);
    this.paeSearch = this.fb.group({
      personId: [''],
      referralId: [''],
      paeId: [''],
      paeStatus: [''],
      grandRegion: [''],
      enrollmentGroup: [''],
    });
    for (const paeStatus of this.paeStatusList) {
      this.paeStatusMap.set(paeStatus.code, paeStatus.value);
    }
    for (const enrollmentGroup of this.enrollmentGroupList) {
      this.enrollmentGroupMap.set(enrollmentGroup.code, enrollmentGroup.value);
    }
    for (const row of this.grandRegionList) {
      this.grandRegionMap.set(row.code, row.value);
    }
    for (const row of this.taskStatusList) {
      this.taskStatusMap.set(row.name, row.value);
    }
    for (const row of this.countyList) {
      this.countyMap.set(row.code, row.value);
    }
    this.countPending();
    this.countPaeSubmissions();
    this.loadTaskTableData();
    for (const taskQ of this.taskQueue) {
      this.taskQueueMap.set(taskQ.code, taskQ.value);
    }

    this.dataSource = new MatTableDataSource([]);
    setTimeout(() => this.dataSource.paginator = this.paginator);
    setTimeout(() => this.dataSource.sort = this.sort);
  }

  ngAfterViewInit() {
    setTimeout(() => this.dataSource.paginator = this.paginator);
    setTimeout(() => this.dataSource.sort = this.sort);
    this.getAllPersonDetails();
  }

  getSSNMask(ssn: string) {
    if (ssn) {
      const formstring = ssn.substr(0, 3) + '-' + ssn.substr(3, 2) + '-' + ssn.substr(5, 4);
      return formstring;
    }
  }

  toggleDropDown(dropDown) {
    if (dropDown === 'additonalFilterCriteria') {
      this.isAdditonalFilterCriteriaDropDownToggled = !this.isAdditonalFilterCriteriaDropDownToggled;
    }
  }


  pendingPaeSubmission(countData) {
    this.searchReferralClicked = true;
    if (countData === 'totalPendingSubmission') {
      if (this.pendingPaeCountData !== null) {
        this.dataSource = new MatTableDataSource(this.pendingPaeCountData);
      }
    }
    if (countData === 'pendingAdjData') {
      if (this.pendingAdjData !== null) {
        this.dataSource = new MatTableDataSource(this.pendingAdjData);
      }
    }
    if (countData === 'approvedData') {
      if (this.approvedData !== null) {
        this.dataSource = new MatTableDataSource(this.approvedData);
      }
    }
    if (countData === 'deniedData') {
      if (this.deniedData !== null) {
        this.dataSource = new MatTableDataSource(this.deniedData);
      }
    }
    const countDataPrefix = countData.split(':')[0];
    const countDataPostfix = countData.split(':')[1];

    if (countDataPrefix !== null && countDataPrefix === 'taskCount'
      && Number(countDataPostfix) !== NaN) {
      if (this.taskQueueCountData !== null) {
        this.taskQueueCountDataTemp = [];
        for (const row of this.taskQueueCountData) {
          if (row.taskQueue === Number(countDataPostfix)) {
            this.taskQueueCountDataTemp.push(row);
          }
        }

        this.dataSource = new MatTableDataSource(this.taskQueueCountDataTemp);
      }
    }
    if (this.dataSource.data.length > 10){
      this.showPagination = true;
    }
    if (this.dataSource.data.length < 10){
      this.showPagination = false;
    }
    setTimeout(() => this.dataSource.paginator = this.paginator);
    setTimeout(() => this.dataSource.sort = this.sort);
    const element = document.getElementById('dashboardTable');
    if (element !== null) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  handleSelection(option) {
    const date = option.prsnDetail.dobDt;
    this.personId = 'Name: ' + option.prsnDetail.firstName + ' ' + option.prsnDetail.lastName + ', DOB: ' + date + ', SSN: '
    + option.prsnDetail.ssn + ', PersonId: ' + option.prsnDetail.prsnId;
    if (option.prsnDetail.cntyCd) {
      this.personId = this.personId + ', CountyCode: ' + option.prsnDetail.cntyCd;
    }
    this.personIdDetail = option.prsnDetail.prsnId;
    this.paeSearch.controls.personId.setValue(this.personId);
    this.additionalSerachName = option.prsnDetail.firstName;
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
      const PersonDetailsSubscriptions = this.changeManagementService.getPersonDetails(text, this.entityId).subscribe((res) => {
        this.personOptions = [];
        if (res && res.length > 0) {
          res.forEach(personDetail => {
            this.personOptions.push({
              personIdDetail: personDetail.personIdDetail,
              prsnDetail: personDetail
            });
          });
        }
      });
      this.subscriptions$.push(PersonDetailsSubscriptions);
    });
  }

  dateFormat(date) {
    const previousDate = new Date(date);
    const dobDate = String(previousDate.getDate()).padStart(2, '0');
    const dobMonth = String(previousDate.getMonth() + 1).padStart(2, '0');
    const dobYear = previousDate.getFullYear();
    return dobMonth + '/' + dobDate + '/' + dobYear;
  }

  showUpdateTaskDialog(row) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.minWidth = '800px';
    dialogConfig.maxWidth = '500px';
    dialogConfig.minHeight = '405px';
    dialogConfig.data = { taskId: row.taskId, taskMasterId: row.taskMasterId, taskName: row.taskName };
    const dialogRef = this.matDialog.open(UpdateTaskComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(data => {
      this.getTaskDetails();
    });
  }


  getTaskDetails() {
    // MOCK
    const userId = 'dcu3891';
    const entityId = '8001';
    const observables = [];
    observables.push(this.inboxService.getMyTaskDetails(userId, entityId));
    observables.push(this.inboxService.getModuleValues());
    observables.push(this.inboxService.getTaskStatusCodes());
    observables.push(this.inboxService.getTaskPriorityCodes());
    observables.push(this.inboxService.getTaskQueues());
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
            const moduleObj = res[1].filter(rec => rec.name === row.moduleCode);
            if (moduleObj && moduleObj.length > 0) {
              row.moduleCode = moduleObj[0].value;
            } else {
              row.moduleCode = '';
            }
          }
          if (res[2] && res[2].length > 0) {
            const priorityObj = res[2].filter(rec => rec.code === row.status);
            if (priorityObj && priorityObj.length > 0) {
              row.status = priorityObj[0].value;
            }
          }
          if (res[3] && res[3].length > 0) {
            const statusObj = res[3].filter(rec => rec.code === row.priority);
            if (statusObj && statusObj.length > 0) {
              row.priority = statusObj[0].value;
            }
          }
          if (res[4] && res[4].length > 0) {
            const taskQueueObj = res[4].filter(rec => rec.code === row.taskName);
            if (taskQueueObj && taskQueueObj.length > 0) {
              row.taskName = taskQueueObj[0].value;
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
      this.dataSource = new MatTableDataSource(tableRecords);
      setTimeout(() => this.dataSource.paginator = this.paginator);
      setTimeout(() => {
        this.emitTasksCount.emit(this.dataSource.data.length);
      });

    });
    this.subscriptions.push(TaskDetailsSubscriptions$);
  }


  countPending() {
    this.subscription1$ = this.paeDashboardService
      .getCountPendingPae(this.userId)
      .subscribe((pendingPaeCountResponse) => {
        this.pendinPaeCount = pendingPaeCountResponse.paeCount;
        this.pendingPaeCountData = pendingPaeCountResponse.responseVOs;
        this.pendingPaeCountReady = true;
      });
    this.subscriptions.push(this.subscription1$);
  }

  countPaeSubmissions() {
    this.subscription2$ = this.paeDashboardService
      .getPaeSubmissions(this.userId)
      .subscribe((PaeSubmissionsResponse) => {
        this.pendingAdj = PaeSubmissionsResponse.pendingAdj.paeCount;
        this.pendingAdjData = PaeSubmissionsResponse.pendingAdj.responseVOs;

        this.approved = PaeSubmissionsResponse.approved.paeCount;
        this.approvedData = PaeSubmissionsResponse.approved.responseVOs;

        this.denied = PaeSubmissionsResponse.denied.paeCount;
        this.deniedData = PaeSubmissionsResponse.denied.responseVOs;
        this.countReady = true;
      });
    this.subscriptions.push(this.subscription2$);
  }

  loadTaskTableData() {
    this.subscription3$ = this.paeDashboardService
      .getPaeQueueCount(this.userId, this.entityId, this.dashboardCd, this.taskStatusCd)
      .subscribe(data => {
        this.records = data;
        console.log('records :' + this.records);
        this.taskTable = this.records.queueCdCountMap;
        this.result = Object.keys(this.taskTable).map((key) => [Number(key), this.taskTable[key]]);
        console.log(this.result);
        this.result.sort((a, b) => {
          return b[1] - a[1];
        });
        console.log('By count' + JSON.stringify(this.result));
        this.result = new Map(this.result);
        this.taskTable = this.result;
        // if (this.taskTable != null) {
        this.taskTableShowResult = true;
        // }
        console.log('queue map :' + this.records.queueCdCountMap);
        this.taskQueueCountData = this.records.paeQueueVOList;
        console.log('taskTable : ' + this.taskTable);
        // this.displayTable = true;
      });
    // this.taskTableShowResult = true;
    this.subscriptions.push(this.subscription3$);
  }

  startNewPae() {
    // TODO redirection
    this.paeCommonService.setRowElement(null);
    this.paeCommonService.setPaeId(null);
    this.paeCommonService.setContinueMenu(false);
    this.paeCommonService.setMenuId('DSH');
    this.rightnavToggleService.setRightnavFlag(false);
    this.paeCommonService.setProgramName(null);
    this.router.navigate(['/ltss/pae/paeStart/applicantInformation']);
  }

  myOpenTasks() {
    if (!this.isMyOpenTasksClicked) {
      this.searchReferralClicked = true;
      this.paeDashboardService
        .getOpenTaskData(this.userId, this.dashboardCd)
        .subscribe((openTaskresponse) => {
          this.searchData = openTaskresponse;
          this.dataSource = new MatTableDataSource(this.searchData);
          setTimeout(() => this.dataSource.paginator = this.paginator);
          setTimeout(() => this.dataSource.sort = this.sort);
        });
    }
    const element = document.getElementById('referralTable');
    if (element !== null) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  getFormData() {
    return this.paeSearch.controls;
  }

  getDateRangeForm() {
    return this.paeSearch.controls;
  }

  paeAdditionalSearch() {

    this.searchReferralClicked = true;

    this.paeFilterRequest = new PaeFilter(
        this.personIdDetail,
        this.getFormData().referralId.value,
        this.getFormData().paeId.value,
        this.getFormData().paeStatus.value,
        this.getFormData().grandRegion.value,
        this.getFormData().enrollmentGroup.value

      );
    this.subscription6$ = this.paeDashboardService
        .getSearchData(this.paeFilterRequest, this.entityId)
        .subscribe((paeSearchResponse) => {
          this.dataSource = new MatTableDataSource(paeSearchResponse);
          setTimeout(() => this.dataSource.paginator = this.paginator);
          setTimeout(() => this.dataSource.sort = this.sort);
        });
    this.searchReferralClicked = true;
    this.subscriptions.push(this.subscription6$);
    this.Accordion.closeAll();

  }

  deleteButtonClicked(paeId) {
    const paeIdToDelete = paeId;
    this.matDialogRef = this.dialog.open(DeleteRecordPopupComponent, {
      width: '810px',
      height: 'auto',
    });
    this.subscription4$ = this.matDialogRef.afterClosed()
      .subscribe((isDelete) => {
        if (isDelete) {
          console.log('Delete Confirm');
          this.subscription4$ = this.paeDashboardService
            .deletePae(paeIdToDelete)
            .subscribe((deleteResponse) => {
              console.log(deleteResponse);
            });
          this.subscriptions.push(this.subscription4$);
        } else {
          console.log('Delete Rejected');
        }
      });
    const index = this.dataSource.data.findIndex(x => x.paeId === paeIdToDelete);
    this.dataSource.data.splice(index, 1);
    this.dataSource = new MatTableDataSource(this.dataSource.data);
    setTimeout(() => this.dataSource.paginator = this.paginator);
    setTimeout(() => this.dataSource.sort = this.sort);
    this.countPending();
    this.subscriptions.push(this.subscription4$);
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    console.log(this.dataSource.filter);
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  viewDetailsClicked(element) {
    this.paeCommonService.setProgramName(element.enrollmentGroup);
    this.paeCommonService.setTaskId(element.taskQueue);
    this.paeCommonService.setRowElement(element);
    this.paeCommonService.setTaskStatus(element.taskStatus);
    this.paeCommonService.setTaskQueue(element.taskQueue);
    this.paeCommonService.setPersonId(element.personId);
    this.paeCommonService.setAssignedUser(element.assignedUser);
    this.paeCommonService.setPaeId(element.paeId);
	   this.paeCommonService.setPaeStatus(element.paeStatus);
	   this.paeCommonService.setApplicantName(element.firstName + ' ' + element.lastName);

    this.router.navigate(['/ltss/pae/paeStart/welcome']);
  }

  initiateIntakeClicked(element, paeId, taskId) {
    this.paeCommonService.setProgramName(element.enrollmentGroup);
    this.paeCommonService.setTaskId(element.taskId);
    this.paeCommonService.setRowElement(element);
    this.paeCommonService.setTaskStatus(element.taskStatus);
    this.paeCommonService.setTaskQueue(element.taskQueue);
    this.paeCommonService.setPersonId(element.personId);
    this.paeCommonService.setAssignedUser(element.assignedUser);
    this.paeCommonService.setPaeId(element.paeId);
	   this.paeCommonService.setPaeStatus(element.paeStatus);
	   this.paeCommonService.setUserId(this.userId);
    this.paeCommonService.setDueDate(element.dueDt);
	   this.paeCommonService.setApplicantName(element.firstName + ' ' + element.lastName);
    // const tempObj = {
    //   aplId: null,
    //   paeId: element.paeId ? element.paeId : null,
    //   applicantName: element.firstName + ' ' + element.lastName,
    //   prsnId: element.personId ? element.personId : null,
    //   refId: element.refId ? element.refId : null
    // };
    // this.rightnavToggleService.setRightnavFlag(true);
    // this.rightnavToggleService.setRightNavCategoryCode('PAE');
    // this.rightnavToggleService.setRightNavProgramCode(element.enrollmentGoup);
    // this.rightnavToggleService.setRightnavData(tempObj);

    if (element.taskQueue === 7 || 16 || 17 || 18 || 19 || 20 || 22 || 83) {
      this.paeCommonService.setMenuId('ECF');
    }
    this.router.navigate(['/ltss/pae/paeStart/welcome']);
  }
  paeSummary() {
    this.router.navigate(['/ltss/pae/paeStart/paeSummary']);
  }
  continueClicked(paeId, element, continueClicked) {
    this.paeCommonService.setPaeId(paeId);
    this.paeCommonService.setPaeStatus(element.paeStatus);
    this.paeCommonService.setRowElement(element);
    this.paeCommonService.setDueDate(element.dueDt);
    if ((element.taskQueue !== null && (element.taskQueue === 7 || 16 || 17 || 18 || 19 || 20 || 21 || 22))) {
      this.paeCommonService.setTaskId(element.taskId);
    }
    this.paeCommonService.setApplicantName(element.firstName + ' ' + element.lastName);

    this.paeCommonService.setContinueMenu(continueClicked);
    // const tempObj = {
    //   aplId: null,
    //   paeId: element.paeId ? element.paeId : null,
    //   applicantName: element.firstName + ' ' + element.lastName,
    //   prsnId: element.personId ? element.personId : null,
    //   refId: element.refId ? element.refId : null
    // };
    // this.rightnavToggleService.setRightnavFlag(true);
    // this.rightnavToggleService.setRightNavCategoryCode('PAE');
    // this.rightnavToggleService.setRightNavProgramCode(element.enrollmentGoup);
    // this.rightnavToggleService.setRightnavData(tempObj);
    this.router.navigate(['/ltss/pae/paeStart/welcome']);
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
    console.log('PAE-dashboard Unsubscribed');
  }

}
