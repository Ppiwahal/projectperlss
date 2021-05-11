import { Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { fromEvent, Subscription } from 'rxjs';
import { EnrollmentDashboardService} from '../../core/services/enrollment/enrollment-dashboard.service';
import { EnrollmentFilter} from '../../_shared/model/EnrollmentFilter';
import { Person } from 'src/app/_shared/model/Person';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { PaeCommonService } from 'src/app/core/services/pae/pae-common/pae-common.service';
import { ReferralService } from 'src/app/core/services/referral/referral.service';
import { ChangeManagementService } from 'src/app/core/services/change-management/change-management.service';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-enrollment-dashboard',
  templateUrl: './enrollment-dashboard.component.html',
  styleUrls: ['./enrollment-dashboard.component.scss'],
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
export class EnrollmentDashboardComponent implements OnInit{

    displayedColumns: string[] = ['key', 'value'];
    displayedColumn = [
      'firstName',
      'ssn',
      'paeId',
      'enrollmentGroup',
      'enrollmentStatus',
      'authorizationDate'
    ];
    dataSource : MatTableDataSource<any>;
    isAdditonalFilterCriteriaDropDownToggled = false;
    myForm: FormGroup;
    searchReferralClicked = false;
    subscription1$: Subscription;
    subscription2$: Subscription;
    subscription3$: Subscription;
    subscription4$: Subscription;
    subscription5$: Subscription;
    subscriptions: Subscription[] = [];
    dataSource2 : MatTableDataSource<any>;
    expandedElement;
    dashboardCd = "ENR";

    localStorageLocal = localStorage.getItem('APP_STORAGE_TOKEN');
    userId = JSON.parse(this.localStorageLocal).userName;
    entityId = JSON.parse(this.localStorageLocal).entityId;
    //entityId = '8001'
    taskStatusCd = "NW";
    paeId = this.paeCommonService.getPaeId();
    pastDueData = [];
    dueNext1day = [];
    dueNext3day = [];
    transitionData =[];
    enrollmentFilterRequest: any;
    initiationData = [];
    dischargeData = [];
    groupInterest = [];
    financialElgibilty = [];
    completedToday = [];
    completedPastweek = [];
    completedPast4week = [];
    isMyOpenTasksClicked = false;
    searchData = [];
    countsReady = false;
    panelOpenState = false;
    taskQueueMap = new Map();
    taskQueueCountData:any;
    enrollmentFilterData:any;
    authorizationDate:any;
    records:any;
    taskQueueCountDataTemp:any = [];
  enrStatusMap = new Map();
  taskStatusMap  = new Map();
  enrGrpMap  = new Map();
  refId = this.referralService.getRefId();
  result: any = [];
  queueTableShowResult = false;
  totalCountsReady = false;
  pastDueDataCount: any = [];
  dueNext3dayCount: any = [];
  dueNext1dayCount: any = [];
  completedPast4weekCount: any = [];
  completedPastweekCount: any = [];
  completedTodayCount: any = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  transitionDataCount: any;
  initiationDataCount: any;
  dischargeDataCount: any;
  groupInterestCount: any;
  financialElgibiltyCount: any;
  subscriptions$: any;
  additionalSerachName: any;
  personIdDetail = '';
  personOptions: any[];
  personId = '';


  public orderByKey(a, b) {
    return a.key;
  }

    enrollmentGroupRt = [
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

  enrollmentStatusRt = [
  {"code": "NEE", "value":"New","activateSW":"Y"},
  {"code": "PRO", "value":"In Progress","activateSW":"Y"},
  {"code": "MOP", "value":"Pending MOPD","activateSW":"Y"},
  {"code": "PDD", "value":"Pending Discharge Date","activateSW":"Y"},
  {"code": "PFE", "value":"Pending Financial Eligibility","activateSW":"Y"},
  {"code": "PTD", "value":"Pending Transition Date","activateSW":"Y"},
  {"code": "SSI", "value":"Pending SSI Resolution","activateSW":"Y"},
  {"code": "ENR", "value":"Enrolled","activateSW":"Y"},
  {"code": "DEN", "value":"Denied","activateSW":"Y"},
  {"code": "WNF", "value":"Withdrawn by NF","activateSW":"Y"},
  {"code": "WMC", "value":"Withdrawn by MCO/AAAD","activateSW":"Y"},
  {"code": "ERS", "value":"Enrolled in Reserve Slot","activateSW":"Y"},
  {"code": "RWL", "value":"Referred to Waiting List","activateSW":"Y"},
  {"code": "DIS", "value":"Disenrolled","activateSW":"Y"}]
    ;

    taskStatusList = [
      { name: 'NW', value: 'New', activateSW: 'Y' },
      { name: 'AS', value: 'Assigned', activateSW: 'Y' },
      { name: 'IP', value: 'In Progress', activateSW: 'Y' },
      { name: 'CL', value: 'Closed', activateSW: 'Y' },
    ];

   taskQueue = [
      { code: 8, value: 'Pending FE determination', activateSW: 'Y' },
      { code: 41, value: 'LON Change Implementation', activateSW: 'Y' },
      { code: 42, value: 'Cost Cap Exception Implementation', activateSW: 'Y' },
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
      { code: 71, value: 'Override PAE Update Review', activateSW: 'Y' },
      { code: 72, value: 'Update Enrollment based on Appeal Outcome', activateSW: 'Y' },
	  { code: 123, value: 'MMIS - Assign Benefit Error', activateSW: 'Y' },
      { code: 125, value: 'Review the MCO', activateSW: 'Y' },
      { code: 126, value: '<MMIS- DCS Pending Enrollment>', activateSW: 'Y' },
      { code: 127, value: '<MMIS- Assign Benefit COB Error>', activateSW: 'Y' },
      { code: 128, value: 'Reinstatement Implementation', activateSW: 'Y' },
      { code: 129, value: 'DD to ID Change Implementation', activateSW: 'Y' },
      { code: 130, value: 'ERC Enrollment Addition/Extension', activateSW: 'Y' },
      { code: 131, value: '<MMIS- Incarceration In-flight Enrollment>', activateSW: 'Y' },
      { code: 132, value: 'Update/Enter Enrollment End Date', activateSW: 'Y' },
      { code: 142, value: 'Create Enrollment Record for Appeal', activateSW: 'Y' },
      { code: 147, value: 'Multiple Approved PAE Resolution', activateSW: 'Y' },

    ];

    @ViewChild('applicantNameInput', {static: true}) applicantNameInput: ElementRef;

    constructor(
      private enrollmentDashboardService : EnrollmentDashboardService,
      private router: Router, private fb: FormBuilder,
      private paeCommonService: PaeCommonService,
      private referralService:ReferralService,
      private changeManagementService: ChangeManagementService  ) { }

  ngOnInit()
  {
    this.myForm = this.fb.group({
      personId: [''],
      paeId: [''],
      assignedUserId: [''],
      enrollmentGroup: [''],
      enrollmentStatus:[''],
      authorizationDate: [''],
      authorizationFromDate: [''],
      authorizationToDate: ['']

    });

    for (const taskQ of this.taskQueue) {
      this.taskQueueMap.set(taskQ.code, taskQ.value);
    }

    for (const enrollmentGrp of this.enrollmentGroupRt) {
      this.enrGrpMap.set(enrollmentGrp.code, enrollmentGrp.description);}

    for (const taskStatus of this.taskStatusList) {
        this.taskStatusMap.set(taskStatus.name, taskStatus.value);}

    for (const enrStatus of this.enrollmentStatusRt) {
        this.enrStatusMap.set(enrStatus.code, enrStatus.value);}

    this.enrollmentPastDue();
    this. enrollmentHold();
    this.getQueueTableData();
    //this.dataSource.sort = this.sort;

this.dataSource2 = new MatTableDataSource([]);
this.dataSource2.paginator = this.paginator;
  }

  ngAfterViewInit() {
    this.dataSource2.paginator = this.paginator;
    this.getAllPersonDetails();
  }


  getSSNMask (ssn:string) {
    if (ssn) {
      const formstring = ssn.substr(0,3) + '-' + ssn.substr(3,2) + '-' + ssn.substr(5,4);
      return formstring;
    }
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

  myOpenTasks()
{
  if (!this.isMyOpenTasksClicked) {
    this.searchReferralClicked = true;
    this.subscription1$ = this.enrollmentDashboardService
  .getOpenTaskData(this.userId, this.dashboardCd)
  .subscribe((openTaskresponse) => {
    this.searchData = openTaskresponse
    this.dataSource2.paginator = this.paginator;
    this.dataSource2 = new MatTableDataSource(this.searchData);
});
this.subscriptions.push(this.subscription1$);
}
const element = document.getElementById('dashboardTable');
    if (element !== null) {
      element.scrollIntoView({behavior:'smooth'});
    }
}
  getDateRangeForm() {
    return this.myForm.controls;
  }

  getQueueTableData() {
    this.subscription2$ = this.enrollmentDashboardService
          .getQueuecount(this.userId, this.dashboardCd, this.entityId,this.taskStatusCd)
          .subscribe((data) => {
            this.records = data;
            this.dataSource = this.records.queueCdCountMap;
            this.result = Object.keys(this.dataSource).map((key) => [Number(key), this.dataSource[key]]);
            console.log(this.result);
            this.result.sort((a, b) => {​​​​​
              return b[1]-a[1];
            }​​​​​);
            console.log("By count"+ JSON.stringify(this.result));
            this.result = new Map(this.result);
            this.dataSource = this.result;
            this.queueTableShowResult = true;
            this.taskQueueCountData = this.records.enrQueueVOList;
            console.log(this.records.queueCdCountMap);
            console.log(this.dataSource);
          });

          this.subscriptions.push(this.subscription2$);
      }


      initiateReviewClicked(element) {
        this.paeCommonService.setProgramName(element.enrollmentGroup);
        this.paeCommonService.setTaskId(element.taskId);
        this.paeCommonService.setRowElement(element);
        this.paeCommonService.setTaskStatus(element.taskStatus);
        this.paeCommonService.setTaskQueue(element.taskQueue);
        this.paeCommonService.setPersonId(element.personId);
        this.paeCommonService.setAssignedUser(element.assignedUser);
        this.paeCommonService.setPaeId(element.paeId);

        this.subscription5$ = this.enrollmentDashboardService
        .getInitiateIntake(this.paeId, this.refId, element.taskId, this.userId)
        .subscribe((initiateIntakeResponse) => {
          console.log('initiateIntakeResponse' + initiateIntakeResponse);
        });

        this.router.navigate(['ltss/enrollmentDetail']);
        this.subscriptions.push(this.subscription5$);
      }

      continueClicked(element)
      {
        this.paeCommonService.setProgramName(element.enrollmentGroup);
        this.paeCommonService.setTaskId(element.taskId);
        this.paeCommonService.setRowElement(element);
        this.paeCommonService.setTaskStatus(element.taskStatus);
        this.paeCommonService.setTaskQueue(element.taskQueue);
        this.paeCommonService.setPersonId(element.personId);
        this.paeCommonService.setAssignedUser(element.assignedUser);
        this.paeCommonService.setPaeId(element.paeId);

        this.router.navigate(['ltss/enrollmentDetail']);
        const elm = document.getElementById('pM');
        if (elm !== null) {
            elm.scrollIntoView(true);
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

        this.router.navigate(['ltss/enrollmentDetail']);
        const elm = document.getElementById('pM');
        if (elm !== null) {
            elm.scrollIntoView(true);
          }
      }


  // matTableCountData(dataForTable){
  //   this.searchReferralClicked = true;
  //   if (dataForTable !== null) {
  //     console.log(dataForTable);
  //     this.dataSource2 = new MatTableDataSource(dataForTable);
  //   }
  //   const element = document.getElementById('dashboardTable');
  //   if (element !== null) {
  //     element.scrollIntoView({behavior:'smooth'});
  //   }
  // }

  pendingReferralSubmission(countData){

    this.searchReferralClicked = true;

    if (countData === 'pastDue') {
      console.log(this.pastDueData)
      if (this.pastDueDataCount !== null) {
        this.dataSource2 = new MatTableDataSource(this.pastDueDataCount);
      }
    }

    if (countData === 'dueNext1day') {
      if (this.dueNext1dayCount !== null) {
        this.dataSource2 = new MatTableDataSource(this.dueNext1dayCount);
      }
    }
    if (countData === 'dueNext3day') {
      if (this.dueNext3dayCount !== null) {
        this.dataSource2 = new MatTableDataSource(this.dueNext3dayCount);
      }
    }
    if (countData === 'transitionData') {
      if (this.transitionData !== null) {
        this.dataSource2 = new MatTableDataSource(this.transitionData);
      }
    }
    if (countData === 'initiationData') {
      if (this.initiationData !== null) {
        this.dataSource2 = new MatTableDataSource(this.initiationData);
      }
    }
    if (countData === 'dischargeData') {
      if (this.dischargeData !== null) {
        this.dataSource2 = new MatTableDataSource(this.dischargeData);
      }
    }
    if (countData === 'groupInterest') {
      console.log(this.groupInterest);
      if (this.groupInterest !== null) {
        this.dataSource2 = new MatTableDataSource(this.groupInterest);
      }
    }
    if (countData === 'financialElgibilty') {
      if (this.financialElgibilty !== null) {
        this.dataSource2 = new MatTableDataSource(this.financialElgibilty);
      }
    }
    if (countData === 'completedToday') {
      if (this.completedTodayCount !== null) {
        this.dataSource2 = new MatTableDataSource(this.completedTodayCount);
      }
    }
    if (countData === 'completedPastweek') {
      if (this.completedPastweekCount !== null) {
        this.dataSource2 = new MatTableDataSource(this.completedPastweekCount);
      }
    }
    if (countData === 'completedPast4week') {
      if (this.completedPast4weekCount !== null) {
        this.dataSource2 = new MatTableDataSource(this.completedPast4weekCount);
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

        this.dataSource2 = new MatTableDataSource(this.taskQueueCountDataTemp);
      }
    }
    this.dataSource2.paginator = this.paginator;
    const element = document.getElementById('dashboardTable');
    if (element !== null) {
      element.scrollIntoView({behavior:'smooth'});
    }
  }

  enrollmentPastDue()
{
 this.subscription3$ = this.enrollmentDashboardService
  .getEnrollmentData(this.userId)
  .subscribe((response) => {
    this.pastDueData = response.detailsCdCountMap.PAST_DUE;
    this.dueNext1day = response.detailsCdCountMap.DUE_IN_NEXTDAY;
    this.dueNext3day = response.detailsCdCountMap.DUE_IN_3DAYS;
    this.completedToday = response.detailsCdCountMap.COMPLETED_TODAY;
    this.completedPastweek = response.detailsCdCountMap.COMPLETED_PAST_WEEK;
    this.completedPast4week = response.detailsCdCountMap.COMPLETED_PAST_4WEEK;
    this.pastDueDataCount = response.dasshBoardDetails.PAST_DUE;
    this.dueNext1dayCount = response.dasshBoardDetails.DUE_IN_NEXTDAY;
    this.dueNext3dayCount = response.dasshBoardDetails.DUE_IN_3DAYS;
    this.completedPast4weekCount = response.dasshBoardDetails.COMPLETED_PAST_4WEEK;
    this.completedPastweekCount = response.dasshBoardDetails.COMPLETED_PAST_WEEK;
    this.completedTodayCount = response.dasshBoardDetails.COMPLETED_TODAY;
    this.totalCountsReady = true;

  },(error)=> {
    console.log("error");
  });

  this.subscriptions.push(this.subscription3$);
  }

  enrollmentHold()
  {
    this.subscription4$ = this.enrollmentDashboardService
  .getEnrollmentHoldData(this.userId)
  .subscribe((response) => {
      this.countsReady = true;
    this.transitionData = response.dasshBoardDetails.PTD;
    this.initiationData = response.dasshBoardDetails.SSI;
    this.dischargeData = response.dasshBoardDetails.PDD;
    this.groupInterest = response.dasshBoardDetails.MOP;
    this.financialElgibilty = response.dasshBoardDetails.PFE;
    this.transitionDataCount = response.detailsCdCountMap.PTD;
    this.initiationDataCount = response.detailsCdCountMap.SSI;
    this.dischargeDataCount = response.detailsCdCountMap.PDD;
    this.groupInterestCount = response.detailsCdCountMap.MOP;
    this.financialElgibiltyCount = response.detailsCdCountMap.PFE;
    this.countsReady = true;
  },(error)=> {
    console.log("error");
  });
  this.subscriptions.push(this.subscription4$);
}


handleSelection(option) {
  const date = option.prsnDetail.dobDt;
  this.personId = 'Name: ' + option.prsnDetail.firstName + ' ' + option.prsnDetail.lastName + ', DOB: ' + date + ', SSN: '
  + option.prsnDetail.ssn + ', PersonId: ' + option.prsnDetail.prsnId;
  if (option.prsnDetail.cntyCd) {
    this.personId = this.personId + ', CountyCode: ' + option.prsnDetail.cntyCd;
  }
  this.personIdDetail = option.prsnDetail.prsnId;
  this.myForm.controls.personId.setValue(this.personId);
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
    const PersonDetailsSubscriptions = this.changeManagementService.getPersonDetails(text,this.entityId).subscribe((res) => {
      this.personOptions = []
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

    getFormData() {
      return this.myForm.controls;
    }

    enrollmentAdditionalSearch()
    {

      console.log("inside Search button was clicked!");
    //this.isAdditonalFilterCriteriaDropDownToggled = !this.isAdditonalFilterCriteriaDropDownToggled;
    this.searchReferralClicked = true;

    let authorizationFromDate = JSON.stringify(this.getDateRangeForm().authorizationFromDate.value);
    let authorizationToDate = JSON.stringify(this.getDateRangeForm().authorizationToDate.value);
    authorizationFromDate = authorizationToDate.replace(/['"]+/g, '');
    authorizationToDate = authorizationToDate.replace(/['"]+/g, '');

    let personObj = this.getDateRangeForm().person;
      this.panelOpenState = false;
     
        this.enrollmentFilterRequest = new EnrollmentFilter(
          this.personIdDetail,
          this.getFormData().paeId.value,
          this.getFormData().enrollmentGroup.value,
          this.getFormData().enrollmentStatus.value,

        );
        this.subscription5$ = this.enrollmentDashboardService
        .getsearchEnrollment(this.enrollmentFilterRequest,this.entityId)
        .subscribe((referralSearchResponse) => {
          this.enrollmentFilterData = referralSearchResponse;
          this.dataSource2.paginator = this.paginator;
          this.dataSource2 = new MatTableDataSource(this.enrollmentFilterData);
        });
        this.searchReferralClicked = true;
        this.subscriptions.push(this.subscription5$);

      
    }

    gotoNext() {
      this.router.navigate(['ltss/enrollmentDetail']);
    }




ngOnDestroy() {
  this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  console.log('ENR dashboard Unsubscribed');
}

  }





