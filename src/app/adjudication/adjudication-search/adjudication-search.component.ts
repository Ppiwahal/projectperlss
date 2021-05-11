import {Component, OnInit, ViewChild} from '@angular/core';
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
import { MatPaginator } from '@angular/material/paginator';

interface ReferenceTable {
  code: string;
  description: string;
}

export interface AdjudicationSearchElements {
  id: number,
  person: string;
  ssn: string;
  paeId: string;
  enrollmentGroup: string;
  adjudicationStatus: string;
  adjudicationDueDate: string;
  birthDate: any;
  personId : number;
  receivedInQueue: any;
  paeSubmissionDate: any;
  taskStatus: string;
  queueName: string;
  assignedUser: string;
}


const ELEMENT_DATA: AdjudicationSearchElements[] = [
  {
    id: 1,
    person : "Jessica Jones",
    ssn : "235-24-1414",
    paeId : "PAE3583582",
    enrollmentGroup : "ECF CHOICES 6",
    adjudicationStatus : "New",
    adjudicationDueDate : "5 Days",
    birthDate : "05/12/2009",
    personId : 352362626,
    receivedInQueue : "05/19/2020",
    paeSubmissionDate : "05/19/2020",
    taskStatus : "New",
    queueName : "ADJ: Complete New Adjudication - ECF",
    assignedUser : "Admin"
  },
  {
    id: 1,
    person : "John Smith",
    ssn : "1231231231",
    paeId : "PAE123456",
    enrollmentGroup : "Code",
    adjudicationStatus : "Status",
    adjudicationDueDate : "5 Days",
    birthDate : "1989/10/02",
    personId : 1231231,
    receivedInQueue : "Queue Name",
    paeSubmissionDate : "2020/08/01",
    taskStatus : "TaskStatus",
    queueName : "QueueName",
    assignedUser : "Admin"
  }
];

@Component({
  selector: 'app-adjudication-search',
  templateUrl: './adjudication-search.component.html',
  styleUrls: ['./adjudication-search.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class AdjudicationSearchComponent implements OnInit {
  adjudicationSearchResponse: string[] = ['Person Name', 'SSN', 'PAE ID', /* 'assignedUser', */
  /* 'paeSubmisstionFromDate', 'paeSubmisstionToDate', */ 'Enrollment Group',
  'Adjudication Status', 'Adjudication Due Date'/* , 'queueName', 'taskStatus' */];

  columnsToDisplay: string[] = ['Person Name', 'SSN', 'PAE ID', 'Enrollment Group',
  'Adjudication Status', 'Adjudication Due Date'/* , 'details' */];
  adjudicationSearchRes: string[] = ['person', 'ssn', 'paeId', 'enrollmentGroup',
  'adjudicationStatus', 'adjudicationDueDate'];
  isAdditonalFilter = true;
  isSearchClicked = false;
  myForm: FormGroup;
  searchForm: FormGroup;
  range: FormGroup;
  dataSource: MatTableDataSource<any>;
  dataSource2 = ELEMENT_DATA;
  isAdditonalFilterCriteriaDropDownToggled = false;
  adjudicationSearchResponseJSON: any = (data as any).default;
  adjudicationSearchResponseJSON2: any = (data2 as any).default;


  expandedElement: AdjudicationSearchElements | null;

  @ViewChild(MatPaginator) paginator : MatPaginator;

  /* ADJUDICATION_DUE_RT:  ReferenceTables.ADJUDICATION_DUE_RT; */
  //enrollmentGroupRt  = this.referenceTables.ENROLLMENT_GROUP_RT;

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
    this.dataSource.paginator = this.paginator;
  }

  getDateRangeForm() {
    return this.myForm.controls;
  }

  displayTableToggle() {
    console.log("inside Search button was clicked!");
    this.isAdditonalFilterCriteriaDropDownToggled = !this.isAdditonalFilterCriteriaDropDownToggled;
    this.isSearchClicked = true;

    let paeSubmisstionFromDate = JSON.stringify(this.getDateRangeForm().paeSubmisstionFromDate.value);
    let paeSubmisstionToDate = JSON.stringify(this.getDateRangeForm().paeSubmisstionToDate.value);
    paeSubmisstionFromDate = paeSubmisstionFromDate.replace(/['"]+/g, '');
    paeSubmisstionToDate = paeSubmisstionToDate.replace(/['"]+/g, '');

    let personObj = this.getDateRangeForm().person;

    /* const auditSearchparameters = new AdjudicationSearch(this.getDateRangeForm().person.value,
      this.getDateRangeForm().paeid.value,
      this.getDateRangeForm().assignedUser.value,
      paeSubmisstionFromDate,
      paeSubmisstionToDate,
      this.getDateRangeForm().adjudicationDueDays.value,
      this.getDateRangeForm().enrollmentGroup.value,
      this.getDateRangeForm().adjudicationStatus.value,
      this.getDateRangeForm().queueName.value,
      this.getDateRangeForm().taskStatus.value
      );
    this.adjudicationSearchService.searchAdjudication(auditSearchparameters).subscribe(
      res => {
        res = this.adjudicationSearchResponseJSON;
        console.log(res);
        this.dataSource = new MatTableDataSource(res);
      },
      err => console.log('HTTP Error', err),
      () => console.log('HTTP request completed.')); */

      console.log(this.adjudicationSearchResponseJSON);
      console.log(this.adjudicationSearchResponseJSON2);
      this.dataSource = this.adjudicationSearchResponseJSON;
      //this.dataSource = this.adjudicationSearchResponseJSON2;
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
    let paeValue = this.getDateRangeForm().paeId.value;
    if(!isNaN(paeValue) || typeof paeValue == 'number'){
      return "Please enter valid PAE Id."
    }
    //return this.getDateRangeForm().paeId.hasError
  }

  adjudictionDueRt : ReferenceTable[] = [
    {code: '1D', description: '1 Day'},
    {code: '2D', description: '2 Days'},
    {code: '3D', description: '3 Days'},
    {code: '4D', description: '4 Days'},
    {code: '5D', description: '5 Days'},
    {code: '6D', description: '6 Days'},
    {code: '7D', description: '7 Days'},
    {code: '8D', description: '8 Days'}
  ];

  acuityScoreRt : ReferenceTable[] = [
    {code: '1A', description: '1'},
    {code: '2A', description: '2'},
    {code: '3A', description: '3'},
    {code: '4A', description: '4'},
    {code: '5A', description: '5'},
    {code: '6A', description: '6'},
    {code: '7A', description: '7'},
    {code: '8A', description: '8'}
  ];

  applicantAgeRt : ReferenceTable[] = [
    {code: '1G', description: '1'},
    {code: '2G', description: '2'},
    {code: '3G', description: '3'},
    {code: '4G', description: '4'},
    {code: '5G', description: '5'},
    {code: '6G', description: '6'},
    {code: '7G', description: '7'},
    {code: '8G', description: '8'},
    {code: '9G', description: '9'},
    {code: '10G', description: '10'},
    {code: '11G', description: '11'},
    {code: '12G', description: '12'},
    {code: '13G', description: '13'},
    {code: '14G', description: '14'},
    {code: '15G', description: '15'},
    {code: '16G', description: '16'},
    {code: '17G', description: '17'},
    {code: '18G', description: '18'},
    {code: '19G', description: '19'},
    {code: '20G', description: '20'}
  ];

  enrollmentGroupRt : ReferenceTable[] = [
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

  adjudicationStatusRt: ReferenceTable[] = [
    {code: 'NE', description: 'New'},
    {code: 'IN', description: 'In Progress'},
    {code: 'WP', description: 'Waiting on Safety'},
    {code: 'SI', description: 'Waiting on SIS'},
    {code: 'LO', description: 'Add LON'},
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
  {code: 'CCC', description: "PAE: Change in caregiver's condition"},
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

  gotoNext() {
    this.router.navigate(['ltss/adjudicationDetail']);
  }
}
