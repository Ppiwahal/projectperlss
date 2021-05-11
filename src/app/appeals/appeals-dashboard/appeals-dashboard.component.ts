import { Component, Input, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { MatTableDataSource } from '@angular/material/table';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { AppealService } from '../services/appeal.service';
import * as customValidation from '../../_shared/constants/validation.constants';
import { ToastrService } from 'ngx-toastr';
import { RightnavToggleService } from 'src/app/_shared/services/rightnav-toggle.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AssignPopupComponent } from 'src/app/workload-management/assign-popup/assign-popup.component';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-appeals-dashboard',
  templateUrl: './appeals-dashboard.component.html',
  styleUrls: ['./appeals-dashboard.component.scss'],
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

export class AppealsDashboardComponent implements OnInit, OnDestroy {

  @ViewChild('applicantNameInput', { static: true }) applicantNameInput: ElementRef;
  @Input() searchResult: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: MatTableDataSource<any>;
  dataSourceAppealsStatus: MatTableDataSource<any>;
  dataSourceAppealsDepartment: MatTableDataSource<any>;
  dataSourceAppealsQueues: MatTableDataSource<any>;
  dataSourceAppealsSearch: MatTableDataSource<any>;

  customValidation = customValidation;
  referralSearchForm: FormGroup;
  searchAppeal = false;
  displayedColumns = ['queueName', 'count'];
  displayedColumnsAppeal = ['appealStatus', 'count'];
  displayedColumnsdepartments = ['departments', 'count'];
  displayedColumnsSearch = [
    'name',
    'prsnId',
    'aplId',
    'aplRcvdDt',
    'aplStatus',
    'aplType',
    'hrngDtTms'
  ];
  expandedElement;
  personId: any;
  panelOpenState = false;
  personOptions: any;
  additionalSerachName = '';
  personDisplayName: string;
  appealStatus = [];
  appealType = [];
  queueName = [];
  taskStatus = [];
  cobStatus = [];
  dashboardResponse: any;
  searchName = '';
  isSearchName = false;
  localStorageLocal: any;
  queueArray = [];
  checkboxColumnHeader = 'SELECT';
  checkboxColumn = 'select';
  selection = new SelectionModel<any>(true, []);
  isAnyTaskSelected = false;
  selectableCheckbox = ['Assigned', 'New'];
  subscriptions$ = [];

  constructor(private router: Router,
              private fb: FormBuilder,
              private appealService: AppealService,
              private toastrService: ToastrService,
              private rightnavToggleService: RightnavToggleService,
              private matDialog: MatDialog) { }

  ngOnInit() {
    this.rightnavToggleService.setRightnavFlag(false);
    this.localStorageLocal = localStorage.getItem('APP_STORAGE_TOKEN');
    this.getAppealStatus();
    this.getAppealType();
    this.getQueueName();
    this.getTaskStatus();
    this.getCOBStatus();
    this.getAllPersonDetails();
    this.appealQueueCount();
    this.referralSearchForm = this.fb.group({
      personDisplayName: [''],
      appealNumber: [''],
      appealStatus: [''],
      appealType: [''],
      hearingDate: [''],
      queueName: [''],
      taskStatus: ['']
    });
    if (window.history.state && window.history.state.isHelpDeskUser) {
      this.toastrService.success('Appeal Successfully Sent to Appeals Unit');
    }
  }

  getAppealStatus() {
    const AppealStatusSubscription$ = this.appealService.getStaticDataValue('APPEAL_STATUS').subscribe(response => {
      this.appealStatus = response;
      this.appealsDashboard();
    });
    this.subscriptions$.push(AppealStatusSubscription$);
  }

  getAppealType() {
    const AppealTypeSubscription$ = this.appealService.getStaticDataValue('APPEAL_TYPE').subscribe(response => {
      this.appealType = response;
    });
    this.subscriptions$.push(AppealTypeSubscription$);
  }

  getQueueName() {
    const QueueNameSubscription$ = this.appealService.getStaticDataValue('TASK_QUEUE').subscribe(response => {
      this.queueName = response;
    });
    this.subscriptions$.push(QueueNameSubscription$);
  }

  getTaskStatus() {
    const TaskStatusSubscription$ = this.appealService.getStaticDataValue('TASK_STATUS').subscribe(response => {
      this.taskStatus = response;
    });
    this.subscriptions$.push(TaskStatusSubscription$);
  }

  getCOBStatus() {
    const COBStatusSubscription$ = this.appealService.getStaticDataValue('COB_STATUS').subscribe(response => {
      this.cobStatus = response;
    });
    this.subscriptions$.push(COBStatusSubscription$);
  }

  formatResults(response) {
    response.forEach(element => {
      this.appealStatus.forEach(ele => {
        if (element.aplStatusCd === ele.code) {
          element.aplStatus = ele.value;
        }
      });
      this.appealType.forEach(ele => {
        if (element.aplTypCd === ele.code) {
          element.aplType = ele.value;
        }
      });
      this.cobStatus.forEach(ele => {
        if (element.cobStatusCd === ele.code) {
          element.cobStatus = ele.value;
        }
      });
      this.taskStatus.forEach(ele => {
        if (element.taskStatusCd === ele.code) {
          element.taskStatus = ele.value;
        }
      });
      this.queueName.forEach(ele => {
        if (element.queueCd === ele.code) {
          element.taskQueue = ele.value;
        }
      });
      if (element.aplTypCd) {
        if (element.aplTypCd === 'EN' || element.aplTypCd === 'DE' || element.aplTypCd === 'PA') {
          element.linkedRecord = element.paeId;
        } else if (element.aplTypCd === 'PR') {
          if (element.clientId) {
            element.linkedRecord = element.clientId;
          } else if (element.episodeId) {
            element.linkedRecord = element.episodeId;
          } else {
            element.linkedRecord = null;
          }
        } else if (element.aplTypCd === 'RF') {
          element.linkedRecord = element.refId;
        } else {
          element.linkedRecord = null;
        }
      }
    });
    this.dataSourceAppealsSearch = new MatTableDataSource(response);
    this.dataSourceAppealsSearch.paginator = this.paginator;
    this.dataSourceAppealsSearch.sort = this.sort;
    this.isSearchName = true;
    this.searchAppeal = true;
  }

  openAppeals() {
    this.isSearchName = false;
    this.searchAppeal = false;
    const OpenAppealsSubscriptions$ = this.appealService.openAppeals().subscribe(response => {
      if (response && response.length > 0) {
        this.searchName = 'Open Appeals';
        this.formatResults(response);
      } else {
        this.toastrService.error('No records found.');
      }
    });
    this.subscriptions$.push(OpenAppealsSubscriptions$);
  }

  nohPastDue() {
    this.isSearchName = false;
    this.searchAppeal = false;
    const NOHPastDueSubscriptions$ = this.appealService.nohPastDue().subscribe(response => {
      if (response && response.length > 0) {
        this.searchName = 'NOH Past Due';
        this.formatResults(response);
      } else {
        this.toastrService.error('No records found.');
      }
    });
    this.subscriptions$.push(NOHPastDueSubscriptions$);
  }

  onsitePastDue() {
    this.isSearchName = false;
    this.searchAppeal = false;
    const OnsitePastDueSubscriptions$ = this.appealService.onsitePastDue().subscribe(response => {
      if (response && response.length > 0) {
        this.searchName = 'Onsite Past Due';
        this.formatResults(response);
      } else {
        this.toastrService.error('No records found.');
      }
    });
    this.subscriptions$.push(OnsitePastDueSubscriptions$);
  }

  anrReviewPastDue() {
    this.isSearchName = false;
    this.searchAppeal = false;
    const ANRReviewPastDueSubscriptions$ = this.appealService.anrReviewPastDue().subscribe(response => {
      if (response && response.length > 0) {
        this.searchName = 'ANR Review Past Due';
        this.formatResults(response);
      } else {
        this.toastrService.error('No records found.');
      }
    });
    this.subscriptions$.push(ANRReviewPastDueSubscriptions$);
  }

  appealQueueCount() {
    // const AppealQueueCountSubscriptions$ = this.appealService.appealQueueCount(JSON.parse(this.localStorageLocal).userName,
    //   JSON.parse(this.localStorageLocal).entityId).subscribe(response => {
    //     if (response && response.appealQueueVOList.length > 0) {
    //       const countArray = [];
    //       this.queueArray = response.appealQueueVOList;
    //       this.queueArray.forEach(element => {
    //         countArray.push(element.taskName);
    //       });
    //       const countObj = {};
    //       countArray.forEach((i) => {
    //         countObj[i] = (countObj[i] || 0) + 1;
    //       });
    //       const queueCountObjectArray = [];
    //       Object.entries(countObj).forEach(([key, value]) => queueCountObjectArray.push({count: value, name: key}));
    //       const queuesCountTable = queueCountObjectArray.sort((a, b) => b.count - a.count);
    //       this.dataSourceAppealsQueues = new MatTableDataSource(queuesCountTable);
    //       this.dataSourceAppealsQueues.paginator = this.paginator;
    //     }
    //   });
    // this.subscriptions$.push(AppealQueueCountSubscriptions$);
  }

  toggleSelectDisplay() {
    if (this.displayedColumnsSearch.indexOf(this.checkboxColumn) > -1) {
      this.displayedColumnsSearch.shift();
      this.checkboxColumnHeader = 'SELECT';
      this.selection.clear();
      this.isAnyTaskSelected = false;
    } else {
      this.displayedColumnsSearch = [...[this.checkboxColumn], ...this.displayedColumnsSearch];
      this.checkboxColumnHeader = 'HIDE';
    }
  }

  showAssignTaskDialog() {
    console.log(this.selection);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '600px';
    dialogConfig.data = {
    };
    this.matDialog.open(AssignPopupComponent, dialogConfig);
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSourceAppealsSearch.data.forEach(row => {
        if (this.selectableCheckbox.indexOf(row.status) !== -1) {
          this.selection.select(row);
        }
      });
    this.isAnyTaskSelected = this.selection.selected && this.selection.selected.length > 0;
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSourceAppealsSearch.data.filter(row => this.selectableCheckbox.indexOf(row.status) !== -1).length;
    return numSelected === numRows;
  }

  handleSelectionRecords(event, row) {
    if (event) {
      this.selection.toggle(row);
      this.isAnyTaskSelected = this.selection.selected && this.selection.selected.length > 0;
    }
  }

  queueCountSearch(search) {
    this.dataSourceAppealsSearch = new MatTableDataSource([]);
    this.searchAppeal = false;
    this.queueArray.forEach(element => {
      if (element.aplTypCd) {
        if (element.aplTypCd === 'EN' || element.aplTypCd === 'DE' || element.aplTypCd === 'PA') {
          element.linkedRecord = element.paeId;
        } else if (element.aplTypCd === 'PR') {
          if (element.clientId) {
            element.linkedRecord = element.clientId;
          } else if (element.episodeId) {
            element.linkedRecord = element.episodeId;
          } else {
            element.linkedRecord = null;
          }
        } else if (element.aplTypCd === 'RF') {
          element.linkedRecord = element.refId;
        } else {
          element.linkedRecord = null;
        }
      }
      if (element.personId) {
        element.prsnId = element.personId;
      }
      this.appealStatus.forEach(ele => {
        if (element.aplStatusCd === ele.code) {
          element.aplStatus = ele.value;
        }
      });
      this.appealType.forEach(ele => {
        if (element.aplTypCd === ele.code) {
          element.aplType = ele.value;
        }
      });
      this.cobStatus.forEach(ele => {
        if (element.cobStatusCd === ele.code) {
          element.cobStatus = ele.value;
        }
      });
      this.taskStatus.forEach(ele => {
        if (element.taskStatus === ele.code) {
          element.taskStatus = ele.value;
        }
      });
      this.queueName.forEach(ele => {
        if (element.queueCd === ele.code) {
          element.taskQueue = ele.value;
        }
      });
    });
    const searchResponse = [];
    this.queueArray.forEach(element => {
      if (element.taskName === search.name) {
        searchResponse.push(element);
      }
    });
    this.dataSourceAppealsSearch = new MatTableDataSource(searchResponse);
    this.dataSourceAppealsSearch.paginator = this.paginator;
    this.dataSourceAppealsSearch.sort = this.sort;
    this.searchAppeal = true;
  }

  countDifferentDepartments(element) {
    this.isSearchName = false;
    this.searchAppeal = false;
    const CountDifferentDepartmentsSubscriptions$ = this.appealService.countDifferentDepartments().subscribe(response => {
      if (response && response.length > 0) {
        this.searchName = element.description;
        const requiredResults = [];
        response.forEach(ele => {
          if (ele.othrDeptNameCd === element.otherDepartment) {
            requiredResults.push(ele);
          }
        });
        if (requiredResults.length > 0) {
          this.formatResults(requiredResults);
        } else {
          this.toastrService.error('No records found.');
        }
      } else {
        this.toastrService.error('No records found.');
      }
    });
    this.subscriptions$.push(CountDifferentDepartmentsSubscriptions$);
  }

  countDifferentStatus(element) {
    this.isSearchName = false;
    this.searchAppeal = false;
    const CountDifferentStatusSubscriptions$ = this.appealService.countDifferentStatus().subscribe(response => {
      if (response && response.length > 0) {
        this.searchName = element.aplStatus ? element.aplStatus : element.description;
        const requiredResults = [];
        response.forEach(ele => {
          if (ele.aplStatusCd === element.aplStatusCd) {
            requiredResults.push(ele);
          }
        });
        if (requiredResults.length > 0) {
          this.formatResults(requiredResults);
        } else {
          this.toastrService.error('No records found.');
        }
      } else {
        this.toastrService.error('No records found.');
      }
    });
    this.subscriptions$.push(CountDifferentStatusSubscriptions$);
  }

  overDueAppeals() {
    this.isSearchName = false;
    this.searchAppeal = false;
    const OverDueAppealsSubscriptions$ = this.appealService.overDueAppeals().subscribe(response => {
      if (response && response.length > 0) {
        this.formatResults(response);
      }
    });
    this.subscriptions$.push(OverDueAppealsSubscriptions$);
  }

  appealsDashboard() {
    const AppealDashboardSubscription$ = this.appealService.appealsDashboard().subscribe(response => {
      this.dashboardResponse = response;
      if (response.appealDashboardByStatusCountVOs) {
        this.appealStatus.forEach(element => {
          response.appealDashboardByStatusCountVOs.forEach(ele => {
            if (ele.aplStatusCd === element.code) {
              ele.aplStatus = element.value;
            }
          });
        });
        const statusCountTable = response.appealDashboardByStatusCountVOs.sort((a, b) => b.count - a.count);
        this.dataSourceAppealsStatus = new MatTableDataSource(statusCountTable);
        this.dataSourceAppealsStatus.paginator = this.paginator;
      }
      if (response.appealDashboardByDepartments) {
        const departmentCountTable = response.appealDashboardByDepartments.sort((a, b) => b.count - a.count);
        this.dataSourceAppealsDepartment = new MatTableDataSource(departmentCountTable);
        this.dataSourceAppealsDepartment.paginator = this.paginator;
      }
    });
    this.subscriptions$.push(AppealDashboardSubscription$);
  }

  applyFilterStatus(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceAppealsStatus.filter = filterValue.trim().toLowerCase();
  }

  applyFilterSearch(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceAppealsSearch.filter = filterValue.trim().toLowerCase();
  }

  handleSelection(option) {
    const date = this.dateFormat(option.prsnDetail.dobDt);
    this.personDisplayName = 'Name: ' + option.prsnDetail.firstName + ' ' + option.prsnDetail.lastName +
      ', DOB: ' + date + ', SSN: ' + option.prsnDetail.ssn + ', PersonId: ' + option.prsnDetail.prsnId;
    if (option.prsnDetail.cntyCd) {
      this.personDisplayName = this.personDisplayName + ', CountyCode: ' + option.prsnDetail.cntyCd;
    }
    this.personId = option.prsnDetail.prsnId;
    this.referralSearchForm.controls.personDisplayName.setValue(this.personDisplayName);
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
    const entityId = JSON.parse(this.localStorageLocal).entityId;
    fromEvent(this.applicantNameInput.nativeElement, 'keyup').pipe(
      map((event: any) => {
        return event.target.value;
      })
      , filter(res => res.length >= 1)
      , debounceTime(500)
      , distinctUntilChanged()
    ).subscribe((text: string) => {
      const PersonDetailsSubscriptions = this.appealService.getPersonDetails(text, entityId).subscribe((res) => {
        this.personOptions = [];
        if (res && res.length > 0) {
          res.forEach(personDetail => {
            this.personOptions.push({
              personId: personDetail.personId,
              prsnDetail: personDetail
            });
          });
        } else {
          this.toastrService.error('No records found.');
        }
      });
      this.subscriptions$.push(PersonDetailsSubscriptions);
    });
  }

  referralAdditionalSearch() {
    this.searchAppeal = false;
    this.isSearchName = false;
    let searcText;
    const objSearch = {};
    if (this.referralSearchForm.value.appealNumber && this.referralSearchForm.value.appealNumber !== '') {
      searcText = 'aplId=' + this.referralSearchForm.value.appealNumber;
    } else if (this.referralSearchForm.value.appealStatus && this.referralSearchForm.value.appealStatus !== '') {
      searcText = 'aplStatusCd=' + this.referralSearchForm.value.appealStatus;
    } else if (this.referralSearchForm.value.appealType && this.referralSearchForm.value.appealType !== '') {
      searcText = 'appealType=' + this.referralSearchForm.value.appealType;
    } else if (this.referralSearchForm.value.queueName && this.referralSearchForm.value.queueName !== '') {
      searcText = 'queuecd=' + this.referralSearchForm.value.queueName;
    } else if (this.referralSearchForm.value.taskStatus && this.referralSearchForm.value.taskStatus !== '') {
      searcText = 'taskstatuscd=' + this.referralSearchForm.value.taskStatus;
    } else if (this.referralSearchForm.value.hearingDate && this.referralSearchForm.value.hearingDate !== '') {
      const selectedDate = new Date(this.referralSearchForm.value.hearingDate);
      const currentTime = new Date();
      const selectedMonth = selectedDate.getMonth() + 1;
      const formattedDate = selectedDate.getFullYear() + '-' + selectedMonth + '-' + selectedDate.getDate() + ' ' +
        currentTime.getHours() + ':' + currentTime.getMinutes() + ':' + currentTime.getSeconds();
      searcText = 'hrngDt=' + formattedDate;
    } else if (this.referralSearchForm.value.personDisplayName && this.referralSearchForm.value.personDisplayName !== '') {
      searcText = 'prsnId=' + this.personId;
    }
    if (this.referralSearchForm.value.appealNumber && this.referralSearchForm.value.appealNumber !== '') {
      Object.assign(objSearch, { aplId: this.referralSearchForm.value.appealNumber });
    }
    if (this.referralSearchForm.value.appealStatus && this.referralSearchForm.value.appealStatus !== '') {
      Object.assign(objSearch, { aplStatusCd: this.referralSearchForm.value.appealStatus });
    }
    if (this.referralSearchForm.value.appealType && this.referralSearchForm.value.appealType !== '') {
      Object.assign(objSearch, { aplTypeCd: this.referralSearchForm.value.appealType });
    }
    if (this.referralSearchForm.value.queueName && this.referralSearchForm.value.queueName !== '') {
      Object.assign(objSearch, { queueCd: this.referralSearchForm.value.queueName });
    }
    if (this.referralSearchForm.value.taskStatus && this.referralSearchForm.value.taskStatus !== '') {
      Object.assign(objSearch, { taskStatusCd: this.referralSearchForm.value.taskStatus });
    }
    if (this.referralSearchForm.value.personDisplayName && this.referralSearchForm.value.personDisplayName !== '') {
      Object.assign(objSearch, { prsnId: this.personId });
    }
    if (searcText) {
      this.appealService.searchAppeals(searcText).subscribe(response => {
        if (response.appealDashboardSearchVOs && response.appealDashboardSearchVOs.length > 0) {
          response.appealDashboardSearchVOs.forEach(element => {
            if (element.aplTypeCd) {
              if (element.aplTypeCd === 'EN' || element.aplTypeCd === 'DE' || element.aplTypeCd === 'PA') {
                element.linkedRecord = element.paeId;
              } else if (element.aplTypeCd === 'PR') {
                if (element.clientId) {
                  element.linkedRecord = element.clientId;
                } else if (element.episodeId) {
                  element.linkedRecord = element.episodeId;
                } else {
                  element.linkedRecord = null;
                }
              } else if (element.aplTypeCd === 'RF') {
                element.linkedRecord = element.refId;
              } else {
                element.linkedRecord = null;
              }
            }
            this.appealStatus.forEach(ele => {
              if (element.aplStatusCd === ele.code) {
                element.aplStatus = ele.value;
              }
            });
            this.appealType.forEach(ele => {
              if (element.aplTypeCd === ele.code) {
                element.aplType = ele.value;
              }
            });
            this.cobStatus.forEach(ele => {
              if (element.cobStatusCd === ele.code) {
                element.cobStatus = ele.value;
              }
            });
            this.taskStatus.forEach(ele => {
              if (element.taskStatusCd === ele.code) {
                element.taskStatus = ele.value;
              }
            });
            this.queueName.forEach(ele => {
              if (element.queueCd === ele.code) {
                element.taskQueue = ele.value;
              }
            });
          });
          const searchResponse = [];
          for (const res of response.appealDashboardSearchVOs) {
            if (this.partialContains(res, objSearch)) {
              searchResponse.push(res);
            }
          }
          this.dataSourceAppealsSearch = new MatTableDataSource(searchResponse);
          this.dataSourceAppealsSearch.paginator = this.paginator;
          this.dataSourceAppealsSearch.sort = this.sort;
          this.searchAppeal = true;
        } else {
          this.toastrService.error(this.customValidation.D1);
        }
      });
    }
  }

  partialContains(object, subObject) {
    const objProps = Object.getOwnPropertyNames(object);
    const subProps = Object.getOwnPropertyNames(subObject);
    if (subProps.length > objProps.length) {
      return false;
    }
    for (const subProp of subProps) {
      if (!object.hasOwnProperty(subProp)) {
        return false;
      }
      if (object[subProp] !== subObject[subProp]) {
        return false;
      }
    }
    return true;
  }

  quickAction(element) {
    const tempObj = {
      aplId: element.aplId ? element.aplId : null,
      paeId: element.paeId ? element.paeId : null,
      applicantName: element.firstName + ' ' + element.lastName,
      prsnId: element.prsnId ? element.prsnId : null,
      refId: element.refId ? element.refId : null
    };
    this.rightnavToggleService.setRightnavFlag(true);
    this.rightnavToggleService.setRightNavCategoryCode('APL');
    this.rightnavToggleService.setRightNavProgramCode('APL');
    this.rightnavToggleService.setRightnavData(tempObj);
    this.router.navigate(['/ltss/appeals/appealsStepper'], { state: { quickActionData: element } });
  }

  continue(element) {
    const tempObj = {
      aplId: element.aplId ? element.aplId : null,
      paeId: element.paeId ? element.paeId : null,
      applicantName: element.firstName + ' ' + element.lastName,
      prsnId: element.prsnId ? element.prsnId : null,
      refId: element.refId ? element.refId : null
    };
    this.rightnavToggleService.setRightnavFlag(true);
    this.rightnavToggleService.setRightnavData(tempObj);
    this.router.navigate(['/ltss/appeals/appealsStepper'], { state: { continueData: element } });
  }

  getAppealResolutionPDF(element) {
    const AppealResolutionPDFSubscriptions = this.appealService.getAppealResolutionPDF(element.aplId).subscribe(response => {
      if (response && response.document) {
        this.debugBase64('data:application/pdf;base64,' + response.document);
      }
    });
    this.subscriptions$.push(AppealResolutionPDFSubscriptions);
  }

  debugBase64(base64URL){
    const win = window.open();
    win.document.write('<iframe src="' + base64URL  + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>');
  }

  navigateToStepper() {
    this.router.navigate(['/ltss/appeals/appealsStepper']);
  }

  ngOnDestroy() {
    if (this.subscriptions$ && this.subscriptions$.length > 0) {
      this.subscriptions$.forEach(subscription$ => subscription$.unsubscribe());
    }
  }
}
