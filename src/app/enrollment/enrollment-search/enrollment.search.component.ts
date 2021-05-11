import {Component, OnInit} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {Form, FormBuilder, FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {AdjudicationSearch} from '../../_shared/model/AdjuducationSearch';
import {AdjudicationSearchService} from '../../core/services/adjudication/adjudication-search.service';
import {AdjudicationDetailsService} from '../../core/services/adjudication/adjudication-details.service';
import {Router} from '@angular/router';
import { Person } from 'src/app/_shared/model/Person';
import * as data from './mockResponse.json';
import * as data2 from './mockResponse2.json';
import {animate, state, style, transition, trigger} from '@angular/animations';

interface ReferenceTable {
  code: string;
  description: string;
}

export interface EnrollmentSearchElements {
  id: number;
  person: string;
  ssn: string;
  paeId: string;
  enrollmentGroup: string;
  adjudicationStatus: string;
  adjudicationDueDate: string;
  birthDate: any;
  personId: number;
  receivedInQueue: any;
  paeSubmissionDate: any;
  taskStatus: string;
  queueName: string;
  assignedUser: string;
}




export interface QueueNameCount {
  queueName: string;
  count: number;
}

const QUEUE_COUNT_DATA: QueueNameCount[] = [
  {count: 27, queueName: 'Pre-enrollment - New ECF CHOICES'},
  {count: 16, queueName: 'Pre-enrollment - New NF CHOICES Group 1'},
  {count: 27, queueName: 'Pre-enrollment - New HCBS CHOICES Group 2'},
  {count: 16, queueName: 'Pre-enrollment - New HCBS CHOICES Group 3'},
  {count: 16, queueName: 'Pre-enrollment - New PACE'},
  {count: 4, queueName: 'Pre-enrollment - New ICF'},
  {count: 7, queueName: 'Pre-enrollment - New CAC'},
  {count: 4, queueName: 'Pre-enrollment - Transition 1915c to CHOICES'},
  {count: 2, queueName: 'Pre-enrollment - Transition CHOICES to ECF'}
];


const ELEMENT_DATA: EnrollmentSearchElements[] = [
  {
    id: 1,
    person : 'John Smith',
    ssn : '1231231231',
    paeId : 'PAE123456',
    enrollmentGroup : 'Code',
    adjudicationStatus : 'Status',
    adjudicationDueDate : '5 Days',
    birthDate : '1989/10/02',
    personId : 1231231,
    receivedInQueue : 'Queue Name',
    paeSubmissionDate : '2020/08/01',
    taskStatus : 'TaskStatus',
    queueName : 'QueueName',
    assignedUser : 'Admin'
  }];

@Component({
  selector: 'app-enrollment-search',
  templateUrl: './enrollment.search.component.html',
  styleUrls: ['./enrollment.search.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class EnrollmentSearchComponent implements OnInit {
  enrollmentSearchResponse: string[] = ['Person Name', 'SSN', 'PAE ID', 'Enrollment Group',
    'Enrollment Status', 'Authorization Date'];
  displayedColumnsForenrolmntStatusTble: string[] = ['position', 'name', 'weight', 'symbol'];
  displayedColumnsForQueueCountTble: string[] = ['queueName', 'count'];
  queueCountdataSource = QUEUE_COUNT_DATA;
  enrollmentGroupRt: ReferenceTable[] = [
    {code: 'CG1', description: 'CHOICES Group 1'},
    {code: 'CG2', description: 'CHOICES Group 2'},
    {code: 'CG3', description: 'CHOICES Group 3'},
    {code: 'EC4', description: 'ECF CHOICES Group 4'},
    {code: 'EC5', description: 'ECF CHOICES Group 5'},
    {code: 'EC6', description: 'ECF CHOICES Group 6'},
    {code: 'EC7', description: 'ECF CHOICES Group 7'},
    {code: 'EC8', description: 'ECF CHOICES Group 8'},
    {code: 'PACE', description: 'PACE'},
    {code: 'ICF', description: 'ICF/IID'},
    {code: 'CAC', description: 'CAC'},
    {code: 'KBA', description: 'Katie Beckett Part A'},
    {code: 'KBB', description: 'Katie Beckett Part B'},
    {code: 'SED', description: 'Self-Determination Waiver'},
    {code: 'STW', description: 'Statewide Waiver'}
  ];

  enRollmntStatusRt: ReferenceTable[] = [
    {code: 'NE', description: 'Approved'},
    {code: 'IN', description: 'In Progress'},
    {code: 'DN', description: 'Denied'},
    {code: 'CO', description: 'Complete'}
  ];

  taskQueueRt: ReferenceTable[] = [
    {code: 'LRRR', description: 'REF: LTSS Referral Reassignment Review'},
    {code: 'CROA', description: 'APL: Correction Required for Onsite Assessment'},
    {code: 'ARS', description: 'SLT: Appeallant Requires a Slot'},
    {code: 'RDAN', description: 'APL: Review Additional Documents'},
    {code: 'RDOC', description: 'APL: Review Additional Documents'},
    {code: 'CNHR', description: 'APL: Complete a Nurse Hearing Reference Form'},
    {code: 'CNOH', description: 'APL: Correct NOH'},
    {code: 'AP', description: 'APL: Approve PASRR'},
    {code: 'CS', description: 'APL: Create a Supplemental'},
    {code: 'UIO', description: 'REF: Update Intake Outcome Based on Appeal Decision'},
    {code: 'ADPI', description: 'REF: Appeal Decision Process- Intake Outcome'},
    {code: 'AOHS', description: 'SLT: Appeal Outcome Hold a Slot'},
    {code: 'UEAO', description: 'ENR: Update Enrollment based on Appeal Outcome'},
    {code: 'COBE', description: 'ENR: <MMIS – Assign Benefit COB Error>'},
    {code: 'OPUR', description: 'ENR: Override PAE Update Review'},
    {code: 'ROPO', description: 'APL: Request Onsite to be Put On-hold'},
    {code: 'ARR', description: 'APL: Appeal is Ready for Review'},
    {code: 'RRE', description: 'ADJ: Recertification Review - ECF'},
    {code: 'MABE', description: 'ENR: MMIS - Assign Benefit Error'},
    {code: 'RI', description: 'ENR: Reinstatement Implementation'},
    {code: 'DICI', description: 'ENR: DD to ID Change Implementation'},
    {code: 'LCI', description: 'ENR: LON Change Implementation'},
    {code: 'CTEC', description: 'ENR: Complete Transition Enrollment - CAC'},
    {code: 'CTEI', description: 'ENR: Complete Transition Enrollment - ICF'},
    {code: 'CTEP', description: 'ENR: Complete Transition Enrollment - PACE'},
    {code: 'CTE3', description: 'ENR: Complete Transition Enrollment - CHOICES Group 3'},
    {code: 'CTE2', description: 'ENR: Complete Transition Enrollment - CHOICES Group 2'},
    {code: 'CTE1', description: 'ENR: Complete Transition Enrollment - CHOICES Group 1'},
    {code: 'CTEE', description: 'ENR: Complete Transition Enrollment - ECF CHOICES'},
    {code: 'CSR', description: 'SLT: CEA Slot Review'},
    {code: 'RC2S', description: 'SLT: Review CHOICES 2 Slot'},
    {code: 'CCR', description: 'SLT: Caregiver Change Review'},
    {code: 'RSA', description: 'SLT: Review Slot Assignment'},
    {code: 'PM', description: 'PER: Person Match'},
    {code: 'ISPP', description: 'PER: Input SSN for Pending PAE'},
    {code: 'NECI', description: 'REF: New ECF CHOICES Intake'},
    {code: 'CCEI', description: 'ENR: Cost Cap Exception Implementation'},
    {code: 'TECI', description: 'REF: Transition ECF CHOICES Intake'},
    {code: 'PRKA', description: 'PAE: Physician Review for KB Part A'},
    {code: 'NRKA', description: 'PAE: Nurse Review for KB Part A'},
    {code: 'CEAR', description: 'ADJ: Complete CEA Review'},
    {code: 'SISR', description: 'ADJ: SIS Assessment Review'},
    {code: 'NREC', description: 'REF: Nurse Review for ECF CHOICES'},
    {code: 'EEAE', description: 'ENR: ERC Enrollment Additon/Extension'},
    {code: 'RNOH', description: 'APL: Review Notice of Hearing'},
    {code: 'UODD', description: 'APL: Update order decision details'},
    {code: 'ANR', description: 'APL: Appeal Nurse Review'},
    {code: 'RDUM', description: 'APL: Review Documents Uploaded by the MCO'},
    {code: 'RLSA', description: 'APL: Review the Returned LSA'},
    {code: 'CROA', description: 'APL: Complete clinical review of onsite assessment'},
    {code: 'CNEC', description: 'ENR: Complete New Enrollment - CAC'},
    {code: 'MCOP', description: 'ENR: <MMIS- MCO_Update – PAE>'},
    {code: 'MCOR', description: 'ENR: <MMIS - MCO_Update – at-risk MCO>'},
    {code: 'MIFE', description: 'ENR: <MMIS In-flight Enrollment>'},
    {code: 'MCOR', description: 'ENR: Review the MCO'},
    {code: 'CNEI', description: 'ENR: Complete New Enrollment - ICF'},
    {code: 'CNEP', description: 'ENR: Complete New Enrollment - PACE'},
    {code: 'CNE3', description: 'ENR: Complete New Enrollment - CHOICES Group 3'},
    {code: 'CNE2', description: 'ENR: Complete New Enrollment - CHOICES Group 2'},
    {code: 'CNE1', description: 'ENR: Complete New Enrollment - CHOICES Group 1'},
    {code: 'CNEE', description: 'ENR: Complete New Enrollment - ECF CHOICES'},
    {code: 'CDR', description: 'ENR: Complete Disenrollment Request'},
    {code: 'CCC', description: 'PAE: Change in caregiver\'s condition'},
    {code: 'LONC', description: 'ADJ: LON Change Request'},
    {code: 'CCER', description: 'ADJ: Cost Cap Exception Review '},
    {code: 'RAS', description: 'ADJ: Review Audit Submission'},
    {code: 'PA', description: 'ADJ: Perform Audit'},
    {code: 'RSC', description: 'SLT: Resolve Slot Conflict'},
    {code: 'CRDU', description: 'GEN: Complete Demographic Update Restricted by Case Status'},
    {code: 'CSIS', description: 'PAE: Complete SIS Assessment Request'},
    {code: 'AINR', description: 'REF: Additional Information Request from Nurse Review'},
    {code: 'RRWL', description: 'SLT: Remove from Referral/Wait List'},
    {code: 'SLSA', description: 'APL: Send for LSA'},
    {code: 'POA', description: 'APL: Perform Onsite Assessment'},
    {code: 'KBSR', description: 'PAE: DIDD Part B Supervisor Review Queue'},
    {code: 'ATC', description: 'ADJ: Adjudicate Transition to CAC PAE'},
    {code: 'ATI', description: 'ADJ: Adjudicate Transition to ICF PAE'},
    {code: 'KBWR', description: 'PAE: Review KB Withdrawal Request - DIDD'},
    {code: 'ATP', description: 'ADJ: Adjudicate PACE Transition PAE'},
    {code: 'ATCH', description: 'ADJ: Adjudicate CHOICES HCBS Transition PAE'},
    {code: 'ATCN', description: 'ADJ: Adjudicate CHOICES NF Transition PAE'},
    {code: 'ATE', description: 'ADJ: Adjudicate ECF Transition PAE'},
    {code: 'ANC', description: 'ADJ: Adjudicate CAC PAE'},
    {code: 'ANI', description: 'ADJ: Adjudicate ICF PAE'},
    {code: 'ANP', description: 'ADJ: Adjudicate PACE PAE'},
    {code: 'ANCH', description: 'ADJ: Adjudicate CHOICES HCBS PAE'},
    {code: 'ANCN', description: 'ADJ: Adjudicate CHOICES NF PAE'},
    {code: 'ANE', description: 'ADJ: Adjudicate ECF PAE'},
    {code: 'ERCR', description: 'ADJ: ERC Addition/Extension Review '},
    {code: 'PRR', description: 'ADJ: Recertification Review - PACE'},
    {code: 'C1RR', description: 'ADJ: Recertification Review - CHOICES 1'},
    {code: 'ACEA', description: 'PAE: Add Cost Effective Alternative Interest'},
    {code: 'CSAR', description: 'PAE: Complete Safety Assessment Request'},
    {code: 'IARC', description: 'REF: Complete IARC Review '},
    {code: 'ECFR', description: 'PAE: Complete ECF Recertification'},
    {code: 'ECFW', description: 'REF: Review ECF Withdrawal Request'},
    {code: 'CPAA', description: 'PAE: Complete Part A Assessment'},
    {code: 'KBTP', description: 'PAE: Transition Katie Beckett PAE Needed - DIDD'},
    {code: 'CPC', description: 'PAE: Complete PACE Recertification/Reassessment'},
    {code: 'ETP', description: 'PAE: Transition ECF PAE Needed'},
    {code: 'CNTP', description: 'PAE: Transition CHOICES NF PAE Needed'},
    {code: 'AC3I', description: 'PAE: Add Group 3 Interest Details '},
    {code: 'CHTP', description: 'PAE: Transition CHOICES HCBS PAE Needed'},
    {code: 'ENP', description: 'PAE: Complete ECF PAE'},
    {code: 'CTP', description: 'PAE: Transition CAC PAE Needed'},
    {code: 'ITP', description: 'PAE: Transition ICF PAE Needed'},
    {code: 'KBNP', description: 'PAE: New Katie Beckett Referral Received - DIDD'},
    {code: 'RMSC', description: 'PAE: Review member submitted ECF/Katie Beckett Changes'},
    {code: 'PTP', description: 'PAE: Transition PACE PAE Needed'},
    {code: 'CCRP', description: 'APL: Create Case Referral Packet'},
    {code: 'CAO', description: 'PAE: Complete Annual Outreach'},
    {code: 'WLR', description: 'PAE: Waiver - Annual LOC Reassessment'},
    {code: 'KALR', description: 'PAE: Katie Beckett - Part A Annual LOC Reassessment'},
    {code: 'ELR', description: 'PAE: ECF - Annual LOC Reassessment'},
    {code: 'CLR', description: 'PAE: CHOICES - Annual LOC Reassessment'},
    {code: 'ILR', description: 'PAE: ICF - Annual LOC Reassessment'},
    {code: 'KBLR', description: 'PAE: Katie Beckett - Part B Annual LOC Reassessment'},
    {code: 'KAAO', description: 'PAE: KB A/C Age-Out Review'},
    {code: 'AURD', description: 'APL: Upload Requested Documents'},
    {code: 'ICAP', description: 'REF: ICAP Request'},
    {code: 'MOPD', description: 'PAE: Enter MOPD'},
    {code: 'SAR', description: 'ADJ: Safety Assessment Review'},
    {code: 'ITDD', description: 'PAE: Add Service Initiation/Actual Transition/Actual Discharge Date'},
    {code: 'AIIR', description: 'REF: Additional Information Request from IARC Review'},
    {code: 'KTCE', description: 'ENR: Transition within Katie Beckett - Complete Enrollment'},
    {code: 'PFE', description: 'ENR: Pending FE determination'},
    {code: 'SH', description: 'APL: To be Set for Hearing'},
    {code: 'MCOA', description: 'GEN: <MMIS at-risk MCO>'},
    {code: 'UEEE', description: 'ENR: Update/Enter Enrollment End Date'},
    {code: 'TLA', description: 'PER: TEDS Link Acknowledgment'},
    {code: 'L2I', description: 'PER: Link Two Individuals'},
    {code: 'U2I', description: 'PER: Unlink Two Individuals'},
    {code: 'UO', description: 'APL: Upload the Order'},
    {code: 'ORH', description: 'APL: OGC to Reschedule a Hearing'},
    {code: 'UNOH', description: 'APL: Create and Upload NOH '}];


  taskStatusRt: ReferenceTable[] = [
    {code: 'NW', description: 'New'},
    {code: 'AS', description: 'Assigned'},
    {code: 'IP', description: 'In Progress'},
    {code: 'CL', description: 'Closed'}
  ];

  enrollmentSearchRes: string[] = ['person', 'ssn', 'paeId', 'enrollmentGroup',
    'adjudicationStatus', 'adjudicationDueDate', 'details'];
  isAdditonalFilter = true;
  isSearchClicked = false;
  myForm: FormGroup;
  searchForm: FormGroup;
  range: FormGroup;
  dataSource: MatTableDataSource<any>;
  dataSource2 = ELEMENT_DATA;
  isAdditonalFilterCriteriaDropDownToggled = false;
  enrollmentSearchResponseJSON: any = (data as any).default;
  enrollmentSearchResponseJSON2: any = (data2 as any).default;


  expandedElement: EnrollmentSearchElements | null;

  constructor(private fb: FormBuilder,
              private router: Router ,
              private adjudicationSearchService: AdjudicationSearchService,
              private adjudicationDetailsService: AdjudicationDetailsService
  ) { }

  ngOnInit()  {
    this.myForm = this.fb.group({
      person: [''],
      paeid: [''],
      assignedUser: [''],
      paeSubmisstionFromDate: [''],
      paeSubmisstionToDate: [''],
      adjudicationDueDays: [''],
      enrollmentGroup: [''],
      adjudicationStatus: [''],
      queueName: [''],
      taskStatus: ['']
    });

    this.searchForm = this.fb.group({
      searchFilter: ['']
    });
  }

  getDateRangeForm() {
    return this.myForm.controls;
  }

  displayTableToggle() {
    console.log('inside Search button was clicked!');
    this.isAdditonalFilterCriteriaDropDownToggled = !this.isAdditonalFilterCriteriaDropDownToggled;
    this.isSearchClicked = true;

    let paeSubmisstionFromDate = JSON.stringify(this.getDateRangeForm().paeSubmisstionFromDate.value);
    let paeSubmisstionToDate = JSON.stringify(this.getDateRangeForm().paeSubmisstionToDate.value);
    paeSubmisstionFromDate = paeSubmisstionFromDate.replace(/['"]+/g, '');
    paeSubmisstionToDate = paeSubmisstionToDate.replace(/['"]+/g, '');

    const personObj = this.getDateRangeForm().person;

    console.log(this.enrollmentSearchResponseJSON);
    console.log(this.enrollmentSearchResponseJSON2);
    this.dataSource = this.enrollmentSearchResponseJSON;
  }

  selectAdjudicationRow(row: any) {
    this.adjudicationDetailsService.setAdjudicationSearchParentId(row.parentId);
    this.router.navigate(['/ltss/adjudicationSearch']);
  }

  toggleDropDown(dropDown) {
    if (dropDown === 'additonalFilterCriteria') {
      this.isAdditonalFilterCriteriaDropDownToggled = !this.isAdditonalFilterCriteriaDropDownToggled;
    }

  }

  checkPAE(){
    const paeValue = this.getDateRangeForm().paeId.value;
    // tslint:disable-next-line:triple-equals
    if (!isNaN(paeValue) || typeof paeValue == 'number'){
      return 'Please enter valid PAE Id.';
    }
  }
}
