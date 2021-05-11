import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AdjudicationDashboardService } from 'src/app/core/services/adjudication/adjudication-dashboard.service'
import { fromEvent, Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { AdjudicationSearch } from 'src/app/_shared/model/AdjuducationSearch';
import { PaeCommonService } from 'src/app/core/services/pae/pae-common/pae-common.service';
import { ReferralService } from 'src/app/core/services/referral/referral.service';
import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { ChangeManagementService } from 'src/app/core/services/change-management/change-management.service';
import { HasElementRef } from '@angular/material/core/common-behaviors/color';

@Component({
  selector: 'app-adjudication-dashboard',
  templateUrl: './adjudication-dashboard.component.html',
  styleUrls: ['./adjudication-dashboard.component.scss'],
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



export class AdjudicationDashboardComponent implements OnInit, OnDestroy {
  displayedColumn: string[] = ['key', 'value'];
  adjudicationTable:any = [];
  @ViewChild('applicantNameInput', {read: ElementRef}) applicantNameInput: ElementRef;
  //applicantNameInput:ElementRef;

  //paeId = this.paeCommonService.getPaeId();
 paeId = this.paeCommonService.getPaeId();



  dashboardCd = 'ADJ'
  expandedElement;
  pastDueCount: number;
  countsReady = false;
  dueNext1day: number;
  isSearchClicked = false;
  dueNextThreeDaysCount: number;
  waitingOnSisCount: number;
  sisReturnedCount: number;
  waitingOnSafetyCount: number;
  safetyReturnedCount: number;
  adjCompletedPastWeekCount: number;
  adjCompletedTodayCount: number;
  adjCompletedPast4WeeksCount: number;
  isMyOpenTasksClicked = false;
  subscription1$: Subscription;
  subscription2$: Subscription;
  subscription3$: Subscription;
  subscription4$: Subscription;
  subscription5$: Subscription;
  subscription6$: Subscription;
  subscriptions: Subscription[] = [];
  myForm: FormGroup;
  searchReferralClicked = false;
  dataSource2: MatTableDataSource<any>;
  isAdditonalFilterCriteriaDropDownToggled = false;
  adjudicationNewTaskDueIn3DaysCount = [];
  adjudicationNewTaskPastDueCount = [];

  localStorageLocal = localStorage.getItem('APP_STORAGE_TOKEN');
  userId = JSON.parse(this.localStorageLocal).userName;
  entityId = JSON.parse(this.localStorageLocal).entityId;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  //entityId = '8001';

  displayedColumns = [
    'firstName',
    'paeId',
    'submitter',
    'enrollmentGroup',
    'adjudicationStatus',
    'adjudicationDuedate',
    'assignedUser'
  ];

  adjudictionDueRt = [
    { code: '1D', description: '1 Day' },
    { code: '2D', description: '2 Days' },
    { code: '3D', description: '3 Days' },
    { code: '4D', description: '4 Days' },
    { code: '5D', description: '5 Days' },
    { code: '6D', description: '6 Days' },
    { code: '7D', description: '7 Days' },
    { code: '8D', description: '8 Days' }
  ];

  acuityScoreRt = [
    { "name": "ONE", "value": "1 - 8", "activateSW": "Y" },
    { "name": "NIN", "value": "9 - 12", "activateSW": "Y" },
    { "name": "THI", "value": "13+", "activateSW": "Y" }];


  applicantAgeRt = [
    { "name": "ONE", "value": " 1 - 20", "activateSW": "Y" },
    { "name": "TWE", "value": "21 - 40", "activateSW": "Y" },
    { "name": "FOR", "value": "41 - 60", "activateSW": "Y" },
    { "name": "SIX", "value": "61 - 84", "activateSW": "Y" },
    { "name": "SIX", "value": "85+", "activateSW": "Y" }];

  enrollmentGroupRt = [
    { code: 'CG1', description: 'CHOICES Group 1' },
    { code: 'CG2', description: 'CHOICES Group 2' },
    { code: 'CG3', description: 'CHOICES Group 3' },
    { code: 'EC4', description: 'ECF CHOICES Group 4' },
    { code: 'EC5', description: 'ECF CHOICES Group 5' },
    { code: 'EC6', description: 'ECF CHOICES Group 6' },
    { code: 'EC7', description: 'ECF CHOICES Group 7' },
    { code: 'EC8', description: 'ECF CHOICES Group 8' },
    { code: 'PACE', description: 'PACE' },
    { code: 'ICF', description: 'ICF/IID' },
    { code: 'CAC', description: 'CAC' },
    { code: 'KBA', description: 'Katie Beckett Part A' },
    { code: 'KBB', description: 'Katie Beckett Part B' },
    { code: 'SED', description: 'Self-Determination Waiver' },
    { code: 'STW', description: 'Statewide Waiver' }
  ];

  adjudicationStatusRt = [
    { code: 'NE', description: 'New' },
    { code: 'IN', description: 'In Progress' },
    { code: 'WP', description: 'Waiting on Safety' },
    { code: 'SI', description: 'Waiting on SIS' },
    { code: 'LO', description: 'Add LON' },
    { code: 'CO', description: 'Complete' }
  ];


  taskQueue = [
    { code: 30, value: 'Adjudicate ECF PAE', activateSW: 'Y' },
    { code: 31, value: 'Adjudicate Transition to ECF PAE', activateSW: 'Y' },
    { code: 32, value: 'Adjudicate PACE PAE', activateSW: 'Y' },
    { code: 33, value: 'Adjudicate Transition to PACE PAE', activateSW: 'Y' },
    { code: 34, value: 'Adjudicate ICF PAE', activateSW: 'Y' },
    { code: 35, value: 'Adjudicate CAC PAE', activateSW: 'Y' },
	{ code: 36, value: 'SIS Assessment Review', activateSW: 'Y' },
    { code: 37, value: 'Safety Assessment Review', activateSW: 'Y' },
    { code: 38, value: 'Recertification Review - ECF', activateSW: 'Y' },
    { code: 39, value: 'Recertification Review - PACE', activateSW: 'Y' },
    { code: 40, value: 'LON Change Request', activateSW: 'Y' },
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
	{ code: 91, value: 'Complete CEA Review', activateSW: 'Y' },
  ];




  taskStatusRt = [
    { code: 'NW', description: 'New' },
    { code: 'AS', description: 'Assigned' },
    { code: 'IP', description: 'In Progress' },
    { code: 'CL', description: 'Closed' }
  ];
  records: any;
  taskQueueMap = new Map();
  taskQueueCountData: any;
  taskQueueCountDataTemp: any[];
  adjudicationSearchResult: AdjudicationSearch;
  panelOpenState: boolean;
  adjudicationData: any[];
  assignedUserId: any;
  taskStatusCd = 'NW';
  pastDueCountList: any[];
  dueNext1dayList: any[];
  dueNextThreeDaysCountList: any[];
  waitingOnSisCountList: any[];
  sisReturnedCountList: any[];
  waitingOnSafetyCountList: any[];
  adjCompletedPast4WeeksVOList: any[];
  adjCompletedPastWeekCountList: any[];
  adjCompletedTodayCountList: any[];
  safetyReturnedCountList: any[];
  adjudicationNewTaskPastDueCountList: any[];
  adjudicationNewTaskDueIn3DaysCountList: any[];
  taskStatusMap = new Map();
  enrGrpMap = new Map();
  adjStatusMap = new Map();
  refId = this.referralService.getRefId();
  taskId = this.paeCommonService.getTaskId();
  result: any = [];
  queueTableShowresult = false;
  person: string;
  personId = '';
  additionalSerachName: any;
  personOptions: any[];
  personDisplayName: string;
  subscriptions$: any[] = [];
  userProfiles: any[];
  personsearch = null;


  public orderByKey(a, b) {
    return a.key;
  }

  constructor(
    private adjudicationDashboardService: AdjudicationDashboardService,
    private router: Router, private fb: FormBuilder,
    private paeCommonService: PaeCommonService,
    private referralService: ReferralService,
    private changeManagementService: ChangeManagementService,

  ) { }

  ngOnInit() {
    this.adjudicationPastDue();


    this.myForm = this.fb.group({
      personDisplayName: [''],
      searchText: [null],
      paeId: [''],
      assignedUserId: [''],
      submitDtFrom: [''],
      submitDtTo: [''],
      adjDueDt: [''],
      submittedEnrGrpCd: [''],
      adjStatusCd: [''],
      queueNameCd: [''],
      applicantAge: [''],
      taskStatusCd: [''],
      acutyScrore: ['']
    });

    this.getQueueTableData();



    for (const taskQ of this.taskQueue) {
      this.taskQueueMap.set(taskQ.code, taskQ.value);
    }

    for (const taskStatus of this.taskStatusRt) {
      this.taskStatusMap.set(taskStatus.code, taskStatus.description);
    }

    for (const taskQueue of this.taskQueue) {
      this.taskQueueMap.set(taskQueue.code, taskQueue.value);
    }

    for (const enrGrp of this.enrollmentGroupRt) {
      this.enrGrpMap.set(enrGrp.code, enrGrp.description);
    }

    for (const adjStatus of this.adjudicationStatusRt) {
      this.adjStatusMap.set(adjStatus.code, adjStatus.description);
    }

    this.dataSource2 = new MatTableDataSource([]);
    this.dataSource2.paginator = this.paginator;


  }

  ngAfterViewInit() {
    this.dataSource2.paginator = this.paginator;
    this.getAllPersonDetails();
    //this.applicantNameInput.nativeElement.value;
  }

  getSSNMask(ssn: string) {
    if (ssn) {
      const formstring = ssn.substr(0,3) + '-' + ssn.substr(3,2) + '-' + ssn.substr(5,4);
      return formstring;
    }
  }

  pendingDueData(dueCount) {
    this.searchReferralClicked = true;
    if (dueCount === 'pastDueCount') {
      if (this.pastDueCount !== null) {
        this.dataSource2 = new MatTableDataSource(this.pastDueCountList);
      }
    }

    if (dueCount === 'dueNextDayCount') {
      if (this.dueNext1day !== null) {
        this.dataSource2 = new MatTableDataSource(this.dueNext1dayList);
      }
    }

    if (dueCount === 'dueNextThreeDaysCount') {
      if (this.dueNextThreeDaysCount !== null) {
        this.dataSource2 = new MatTableDataSource(this.dueNextThreeDaysCountList);
      }
    }

    if (dueCount === 'waitingOnSisCount') {
      if (this.waitingOnSisCount !== null) {
        this.dataSource2 = new MatTableDataSource(this.waitingOnSisCountList);
      }
    }

    if (dueCount === 'sisReturnedCount') {
      if (this.sisReturnedCount !== null) {
        this.dataSource2 = new MatTableDataSource(this.sisReturnedCountList);
      }
    }

    if (dueCount === 'waitingOnSafetyCount') {
      if (this.waitingOnSafetyCount !== null) {
        this.dataSource2 = new MatTableDataSource(this.waitingOnSafetyCountList);
      }
    }

    if (dueCount === 'safetyReturnedCount') {
      if (this.safetyReturnedCount !== null) {
        this.dataSource2 = new MatTableDataSource(this.safetyReturnedCountList);
      }
    }


    if (dueCount === 'adjCompletedTodayCount') {
      if (this.adjCompletedTodayCount !== null) {
        this.dataSource2 = new MatTableDataSource(this.adjCompletedTodayCountList);
      }
    }


    if (dueCount === 'adjCompletedPastWeekCount') {
      if (this.adjCompletedPastWeekCount !== null) {
        this.dataSource2 = new MatTableDataSource(this.adjCompletedPastWeekCountList);

      }
    }


    if (dueCount === 'adjCompletedPast4WeeksCount') {
      if (this.adjCompletedPast4WeeksVOList !== null) {
        this.dataSource2 = new MatTableDataSource(this.adjCompletedPast4WeeksVOList);
      }
    }


    if (dueCount === 'adjudicationNewTaskPastDueCount') {
      if (this.adjudicationNewTaskPastDueCount !== null) {
        this.dataSource2 = new MatTableDataSource(this.adjudicationNewTaskPastDueCountList);
        console.log(this.adjudicationNewTaskPastDueCount);

      }
    }

    if (dueCount === 'adjudicationNewTaskDueIn3DaysCount') {
      if (this.adjudicationNewTaskDueIn3DaysCount !== null) {
        this.dataSource2 = new MatTableDataSource(this.adjudicationNewTaskDueIn3DaysCountList);
        console.log(this.adjudicationNewTaskDueIn3DaysCount);
      }
    }

    let countDataPrefix = dueCount.split(':')[0];
    let countDataPostfix = dueCount.split(':')[1];

    if (countDataPrefix !== null && countDataPrefix === 'taskCount'
      && Number(countDataPostfix) !== NaN) {
      if (this.taskQueueCountData !== null) {
        this.taskQueueCountDataTemp = [];
        for ( const rowData of this.taskQueueCountData) {
          if(rowData.taskQueue ===  Number(countDataPostfix)){
            this.taskQueueCountDataTemp.push(rowData);
          }

          this.dataSource2 = new MatTableDataSource(this.taskQueueCountDataTemp);
        }
      }
    }
    this.dataSource2.paginator = this.paginator;
    const element = document.getElementById('dashboardTable');
    if (element !== null) {
      element.scrollIntoView({ behavior: 'smooth' });
    }

  }


  adjudicationPastDue() {
    this.subscription1$ = this.adjudicationDashboardService
      .getAdjudicationData(this.userId, this.paeId, this.entityId)
      .subscribe((response) => {
        this.countsReady = true;
        this.pastDueCount = response.adjAssignedTasksCountVO.pastDueCount;
        this.dueNext1day = response.adjAssignedTasksCountVO.dueNextDayCount;
        this.dueNextThreeDaysCount = response.adjAssignedTasksCountVO.dueNextThreeDaysCount;
        this.waitingOnSisCount = response.adjPendingReviewCountVO.waitingOnSisCount;
        this.sisReturnedCount = response.adjPendingReviewCountVO.sisReturnedCount;
        this.waitingOnSafetyCount = response.adjPendingReviewCountVO.waitingOnSafetyCount;
        this.safetyReturnedCount = response.adjPendingReviewCountVO.safetyReturnedCount;
        this.adjCompletedTodayCount = response.adjCompletedCountVO.adjCompletedTodayCount;
        this.adjCompletedPastWeekCount = response.adjCompletedCountVO.adjCompletedPastWeekCount;
        this.adjCompletedPast4WeeksCount = response.adjCompletedCountVO.adjCompletedPast4WeeksCount;
        this.pastDueCountList = response.adjAssignedTasksCountVO.adjudicationPastDueCountList;
        this.dueNext1dayList = response.adjAssignedTasksCountVO.adjAssignedTasksDueNextDayList;
        this.dueNextThreeDaysCountList = response.adjAssignedTasksCountVO.adjAssignedTasksDueNextThreeDaysVO;
        this.waitingOnSisCountList = response.adjPendingReviewCountVO.waitingOnSisCountList;
        this.sisReturnedCountList = response.adjPendingReviewCountVO.sisReturnedList;
        this.safetyReturnedCountList = response.adjPendingReviewCountVO.safetyReturnedList;
        this.waitingOnSafetyCountList = response.adjPendingReviewCountVO.waitingOnSisCountList;
        this.adjCompletedPast4WeeksVOList = response.adjCompletedCountVO.adjCompletedPast4WeeksVOList;
        this.adjCompletedPastWeekCountList = response.adjCompletedCountVO.adjCompletedPastWeekVOList;
        this.adjCompletedTodayCountList = response.adjCompletedCountVO.adjCompletedTodayVOList;


      }, (error) => {
        console.log("error");

      });
    this.subscriptions.push(this.subscription1$);
  }

  checkPAE() {
    let paeValue = this.getDateRangeForm().paeId.value;
    if (!isNaN(paeValue) || typeof paeValue == 'number') {
      return "Please enter valid PAE Id."
    }
    //return this.getDateRangeForm().paeId.hasError
  }

  myOpenTasks() {
    if (!this.isMyOpenTasksClicked) {
      this.searchReferralClicked = true;
      this.subscription2$ = this.adjudicationDashboardService
        .getOpenTaskData(this.userId, this.dashboardCd)
        .subscribe((response) => {
          console.log(response)
          this.dataSource2.paginator = this.paginator;
          this.dataSource2 = new MatTableDataSource(response);

        });

      this.subscriptions.push(this.subscription2$);
    }
    this.isMyOpenTasksClicked = true;
    const element = document.getElementById('dashboardTable');
    if (element !== null) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  getQueueTableData() {
    this.subscription3$ = this.adjudicationDashboardService
      .getQueueData(this.userId, this.dashboardCd, this.entityId, this.taskStatusCd)
      .subscribe((data) => {
        this.records = data;
        this.adjudicationTable = this.records.response.queueCdCountMap
        this.result = Object.keys(this.adjudicationTable).map((key) => [Number(key), this.adjudicationTable[key]]);
        console.log(this.result);
        this.result.sort((a, b) => {​​​​​
          return b[1]-a[1];
        }​​​​​);
      console.log("By count"+ JSON.stringify(this.result));
            this.result = new Map(this.result);
            this.adjudicationTable = this.result;
            this.queueTableShowresult = true;

        this.taskQueueCountData = this.records.response.adjQueueRecordVOList;
        console.log(this.taskQueueCountData);
        this.adjudicationNewTaskDueIn3DaysCount = this.records.response.adjudicationNewTaskDueIn3DaysCount;
        this.adjudicationNewTaskPastDueCount = this.records.response.adjudicationNewTaskPastDueCount;
        this.adjudicationNewTaskDueIn3DaysCountList = this.records.response.adjudicationNewTaskDueIn3DaysCountList;
        this.adjudicationNewTaskPastDueCountList = this.records.response.adjudicationNewTaskPastDueCountList;
        console.log(this.adjudicationNewTaskDueIn3DaysCount);
      });

    this.subscriptions.push(this.subscription3$);
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

  toggleDropDown(dropDown) {
    if (dropDown === 'additonalFilterCriteria') {
      this.isAdditonalFilterCriteriaDropDownToggled = !this.isAdditonalFilterCriteriaDropDownToggled;
    }
  }


  getDateRangeForm() {
    return this.myForm.controls;
  }

  getFormData() {
    return this.myForm.controls;
  }

  handleSelection(option) {
    const date = option.prsnDetail.dobDt;
    this.personDisplayName = 'Name: ' + option.prsnDetail.firstName + ' ' + option.prsnDetail.lastName + ', DOB: ' + date + ', SSN: '
    + option.prsnDetail.ssn + ', PersonId: ' + option.prsnDetail.prsnId;
    if (option.prsnDetail.cntyCd) {
      this.personDisplayName = this.personDisplayName + ', CountyCode: ' + option.prsnDetail.cntyCd;
    }
    this.personId = option.prsnDetail.prsnId;
    this.myForm.controls.personDisplayName.setValue(this.personDisplayName);
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
      const PersonDetailsSubscriptions = this.changeManagementService.getPersonDetails(text,this.entityId).subscribe((res) => {
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


  initiateReviewClicked(element) {
    this.paeCommonService.setProgramName(element.enrollmentGroup);
    this.paeCommonService.setTaskId(element.taskId);
    this.paeCommonService.setRowElement(element);
    this.paeCommonService.setTaskStatus(element.taskStatus);
    this.paeCommonService.setTaskQueue(element.taskQueue);
    this.paeCommonService.setPersonId(element.personId);
    this.paeCommonService.setAssignedUser(element.assignedUser);
    this.paeCommonService.setPaeId(element.paeId);
    this.paeCommonService.setAdjId(element.adjId);
    this.paeCommonService.setEntityId(element.entityId);
    this.paeCommonService.setProgramCd(element.programCd);
    this.paeCommonService.setAdjudicationStatusCd(element.adjStatusCd);
    console.log(element);
    this.subscription5$ = this.adjudicationDashboardService
    .getInitiateIntake(this.paeCommonService.getPaeId(), this.paeCommonService.getTaskId(), this.userId)
    .subscribe((initiateIntakeResponse) => {
      console.log('initiateIntakeResponse' + initiateIntakeResponse);
	  this.router.navigate(['ltss/adjudicationDetail']);
    });

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
    this.paeCommonService.setAdjId(element.adjId);
    this.paeCommonService.setEntityId(element.entityId);
    this.paeCommonService.setProgramCd(element.programCd);
    this.paeCommonService.setAdjudicationStatusCd(element.adjStatusCd);

    console.log('element:::::::::::::::::'+element);
	this.router.navigate(['ltss/adjudicationDetail']);

	/*this.subscription6$ = this.adjudicationDashboardService
    .getInitiateIntake(this.paeCommonService.getPaeId(), this.paeCommonService.getTaskId(), this.userId)
    .subscribe((initiateIntakeResponse) => {
      console.log('initiateIntakeResponse' + initiateIntakeResponse);

    });

    this.subscriptions.push(this.subscription6$);*/
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
    this.paeCommonService.setAdjId(element.adjId);
    this.paeCommonService.setEntityId(element.entityId);
    this.paeCommonService.setProgramCd(element.programCd);
    this.paeCommonService.setAdjudicationStatusCd(element.adjStatusCd);

    this.router.navigate(['ltss/adjudicationDetail']);
  }


  displayTableToggle() {

    console.log("inside Search button was clicked!");
    this.isAdditonalFilterCriteriaDropDownToggled = !this.isAdditonalFilterCriteriaDropDownToggled;
    this.searchReferralClicked = true;

    let submitDtFrom = JSON.stringify(this.getDateRangeForm().submitDtFrom.value);
    let submitDtTo = JSON.stringify(this.getDateRangeForm().submitDtTo.value);
    submitDtFrom = submitDtFrom.replace(/['"]+/g, '');
    submitDtTo = submitDtTo.replace(/['"]+/g, '');

    let personObj = this.getDateRangeForm().person;
    this.panelOpenState = false;
    
      this.adjudicationSearchResult = new AdjudicationSearch(
        this.personId,
        this.getFormData().paeId.value,
        this.getFormData().assignedUserId.value,
        submitDtFrom,
        submitDtTo,
        this.getFormData().adjDueDt.value,
        this.getFormData().adjStatusCd.value,
        this.getFormData().queueNameCd.value,
        this.getFormData().taskStatusCd.value,
        this.getFormData().applicantAge.value,
        this.getFormData().acutyScrore.value
      );
      console.log(this.getFormData().adjStatusCd.value);
      this.subscription4$ = this.adjudicationDashboardService
      .searchAdjudication(this.adjudicationSearchResult,this.entityId)
        .subscribe((adjSearchResponse) => {
          this.dataSource2.paginator = this.paginator;
          this.dataSource2 = new MatTableDataSource(adjSearchResponse);
        });
      this.searchReferralClicked = true;
      this.subscriptions.push(this.subscription4$);
    

  }

  gotoNext() {
    this.router.navigate(['ltss/adjudicationDetail']);
  }


  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    console.log('Adj dashboard Unsubscribed');
  }

}

