import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { TransitionDashboardService } from 'src/app/core/services/Transitions/transition-dashboard.service'
import { ChangeManagementService } from '../core/services/change-management/change-management.service';
import { TransitionFilter } from 'src/app/_shared/model/TransitionFilter'
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-transitions',
  templateUrl: './transitions.component.html',
  styleUrls: ['./transitions.component.scss'],
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
export class TransitionsComponent implements OnInit {
  isAdditonalFilterCriteriaDropDownToggled = false;
  displayedColumn: string[] = ['key', 'value'];
  dataSource : MatTableDataSource<any>;
  dataSource2 : MatTableDataSource<any>;
  expandedElement;
  displayedColumns = [
    'firstName',
    'ssn',
    'TransitionId',
    'TransitionTo',
    'RequestedDate',
    'TransitionStatus'
  ];
  isMyOpenTasksClicked = false;
  searchTransitionsClicked = false;
  localStorageLocal = localStorage.getItem('APP_STORAGE_TOKEN');
  userId = JSON.parse(this.localStorageLocal).userName;
  entityId = JSON.parse(this.localStorageLocal).entityId;
  // userId='dcu7222';
  // entityId='20133';
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dashboardCd = 'TRN';
  taskQueueCountData: any;
  taskQueueCountDataTemp: any[];
  taskStatusCd = 'NW';
  records: any;
  result: any = [];
  queueTableShowresult = false;
  taskQueue =
  [
   {code: 77, value: 'Revise Transition Request',activateSW: 'Y' },
   {code: 78, value: 'ECF CHOICES Transition Nurse Review',activateSW: 'Y' },
   {code: 79, value: 'ECF CHOICES Transition IARC Review',activateSW: 'Y' },
   {code: 80, value: 'ECF CHOICES Group 6 Transition Add LON',activateSW: 'Y' },
   {code: 81, value: 'ECF CHOICES Group 6 Transition Complete SIS Assessment',activateSW: 'Y' },
   {code: 84, value: 'Withdraw Transition Request',activateSW: 'Y' },
   {code: 86, value: 'ECF Internal Transition Slot Assignment',activateSW: 'Y' },
   ];

   transitionStatus = 
   [{"code": "PAE", "value":"Pending Submission","activateSW":"Y"},
   {"code": "SIS", "value":"Pending SIS Assessment","activateSW":"Y"},
   {"code": "TEN", "value":"TennCare Review","activateSW":"Y"},
   {"code": "APP", "value":"Approved","activateSW":"Y"},
   {"code": "DEN", "value":"Denied","activateSW":"Y"},
   {"code": "REV", "value":"Pending Revision","activateSW":"Y"},
   {"code": "WIT", "value":"Withdrawn","activateSW":"Y"}];

   enrollmentGroup = 
[{"code": "CG1", "value":"CHOICES Group 1","activateSW":"Y"},
{"code": "CG2", "value":"CHOICES Group 2","activateSW":"Y"},
{"code": "CG3", "value":"CHOICES Group 3","activateSW":"Y"},
{"code": "EC4", "value":"ECF CHOICES Group 4","activateSW":"Y"},
{"code": "EC5", "value":"ECF CHOICES Group 5","activateSW":"Y"},
{"code": "EC6", "value":"ECF CHOICES Group 6","activateSW":"Y"},
{"code": "EC7", "value":"ECF CHOICES Group 7","activateSW":"Y"},
{"code": "EC8", "value":"ECF CHOICES Group 8","activateSW":"Y"},
{"code": "PACE", "value":"PACE","activateSW":"Y"},
{"code": "ICF", "value":"ICF/IID","activateSW":"Y"},
{"code": "CAC", "value":"CAC","activateSW":"Y"},
{"code": "KBA", "value":"Katie Beckett Part A","activateSW":"Y"},
{"code": "KBB", "value":"Katie Beckett Part B","activateSW":"Y"},
{"code": "SED", "value":"Self-Determination Waiver","activateSW":"Y"},
{"code": "STW", "value":"Statewide Waiver","activateSW":"Y"},
{"code": "SED", "value":"Self-Determination Waiver","activateSW":"Y"},
{"code": "STW", "value":"Statewide Waiver","activateSW":"Y"}];
   
   taskQueueMap = new Map();
  response: any;
  myForm: FormGroup;
  pendingPae: any;
  tennCareReview: any;
  approvedCount: any;
  deniedCount: any;
  deniedCountVO: any[];
  approvedCountVO: any[];
  tennCareReviewVO: any[];
  pendingPaeVO: any[];
  personIdDetail = '';
  personOptions: any[];
  personId = '';
  additionalSerachName: any;
  @ViewChild(MatSort) sort: MatSort;
  transitionFilterRequest: TransitionFilter;
  transStatusMap = new Map();
  transEnrMap = new Map();

   
  public orderByKey(a, b) {
    return a.key;
  }

  
  @ViewChild('applicantNameInput', {static: true}) applicantNameInput: ElementRef;

  constructor(private transitionDashboardService: TransitionDashboardService,
    private fb: FormBuilder,
    private route: Router,
    private changeManagementService: ChangeManagementService) { }

  ngOnInit(){
    this.transitionData();
    this.getQueueTableData();
    this.myForm = this.fb.group({
      personId: [''],
      transitionId: [''],
      transitionStatus: [''],
      transitionFrom: [''],
      transitionTo:['']
    })

    for (const taskQueue of this.taskQueue) {
      this.taskQueueMap.set(taskQueue.code, taskQueue.value);
    }
    for (const transitionStatus of this.transitionStatus) {
      this.transStatusMap.set(transitionStatus.code, transitionStatus.value);
    }

    for (const transENR of this.enrollmentGroup) {
      this.transEnrMap.set(transENR.code, transENR.value);
    }

  }

  ngAfterViewInit() {
    //this.dataSource2.paginator = this.paginator;
    this.getAllPersonDetails();
  }


  openTasks()
  {
    if (!this.isMyOpenTasksClicked) {
      this.searchTransitionsClicked = true;
      this.transitionDashboardService
        .getOpenTaskData(this.userId, this.dashboardCd)
        .subscribe((response) => {
          console.log(response)
          // this.dataSource2.paginator = this.paginator;
          this.dataSource2 = new MatTableDataSource(response);

        });
    }
    this.isMyOpenTasksClicked = true;
    const element = document.getElementById('dashboardTable');
    if (element !== null) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  pendingDueData(dueCount) {
    this.searchTransitionsClicked = true;

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


  getQueueTableData() {
    this.transitionDashboardService
      .getQueueData(this.userId, this.dashboardCd, this.entityId, this.taskStatusCd)
      .subscribe((data) => {
        this.records = data;
        this.dataSource = this.records.queueCdCountMap
        console.log(this.dataSource);
        this.result = Object.keys(this.dataSource).map((key) => [Number(key), this.dataSource[key]]);
        console.log(this.result);
        this.result.sort((a, b) => {​​​​​
          return b[1]-a[1];
        }​​​​​);
      console.log("By count"+ JSON.stringify(this.result));
            this.result = new Map(this.result);
            this.dataSource = this.result;
            this.queueTableShowresult = true;

        this.taskQueueCountData = this.records.tnsQueueVOList;
        console.log(this.taskQueueCountData);
      
      });

  }
  transitionData()
  {
    this.transitionDashboardService.getTransitionData(this.userId)
    .subscribe((data)=> {
      this.response = data;
      this.pendingPae = data.pendingSubmissionCount.transitionsCount;
      this.tennCareReview = data.underTenncareReviewCount.transitionsCount;
      this.approvedCount = data.approvedCount.transitionsCount;
      this.deniedCount = data.deniedCount.transitionsCount;
      this.pendingPaeVO = data.pendingSubmissionCount.responseVOs;
      this.tennCareReviewVO = data.underTenncareReviewCount.responseVOs;
      this.approvedCountVO = data.approvedCount.responseVOs;
      this.deniedCountVO =  data.deniedCount.responseVOs;
    });
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
      this.changeManagementService.getPersonDetails(text,this.entityId).subscribe((res) => {
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

      transitionAdditionalSearch()
      {
        this.searchTransitionsClicked = true;

        this.transitionFilterRequest = new TransitionFilter(
            this.personIdDetail,
            this.getFormData().transitionId.value,
            this.getFormData().transitionStatus.value,
            this.getFormData().transitionFrom.value,
            this.getFormData().transitionTo.value
    
          );
        this.transitionDashboardService
            .getTransitionSearchData(this.transitionFilterRequest, this.userId, this.entityId)
            .subscribe((transitionSearchResponse) => {
              this.dataSource2 = new MatTableDataSource(transitionSearchResponse);
              setTimeout(() => this.dataSource.paginator = this.paginator);
              setTimeout(() => this.dataSource.sort = this.sort);
            });
        this.searchTransitionsClicked = true;
          
      }

      newTransition()
      {
        this.route.navigate(['/ltss/transitionsDetails']);
      }
  
  }


