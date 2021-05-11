import {Component, EventEmitter, Inject, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { AssignUserComponent } from '../../inbox/assign-user/assign-user.component';
import { RightNavTaskService } from '../services/rightnav.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as customValidation from '../../_shared/constants/validation.constants';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import * as Constants from '../../_shared/constants/application.constants';
import * as CryptoJS from 'crypto-js';
export interface Task {
  AssignedTasks: string;
  ReceivedDate: string;
}

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class TasksComponent implements OnInit, OnChanges, OnDestroy {
  showCreateNewTaskContent = false;
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['AssignedTasks', 'ReceivedDate'];
  expandedElement;
  personDetails: any;
  closeNotes: string;
  subscriptions$: any[] = [];
  customValidation = customValidation;
  taskQueuesOptions = [];
  taskPriorities = [];
  selectedTaskMasterId = '';
  allTaskMasterList = [];
  docDesc = '';
  createTaskForm: FormGroup;
  userId = '';
  showDueDate = false;
  prsn2Id = false;
  minDate: Date;
  maxDate: Date;
  selectedRecord: any;
  isShow = true;
  userIdLocal: any;
  today = this.toDateTimeLocal(new Date());
  startDate = new Date();
  @Input() data: any;
  @Output() closeDialogEvent = new EventEmitter();
  toastr: any;

  toDateTimeLocal(date: Date) {
    const checkDate = (i) => {
      return (i < 10 ? '0' : '') + i;
    };
    return date.getFullYear() + '-' + checkDate(date.getMonth() + 1) + '-' + checkDate(date.getDate()) + 'T' + checkDate(date.getHours()) + ':' + checkDate(date.getMinutes());
  }

  constructor(private matDialog: MatDialog,
              private rightNavTaskService: RightNavTaskService,
              private formBuilder: FormBuilder,
              private toastrService: ToastrService) { }

  ngOnInit(): void {
    const timeTravelData = localStorage.getItem('TIME_TRAVEL_DATA');
    if(timeTravelData) {
      const timeTravelDataJson = JSON.parse(CryptoJS.AES.decrypt(timeTravelData, Constants.APP_ENC_DECRYPT_KEY).toString(CryptoJS.enc.Utf8));
      console.log("timeTravelDataJson ", timeTravelDataJson);
      if(timeTravelDataJson.timeTravelFlag && timeTravelDataJson.currentDate) {
        this.startDate = new Date(timeTravelDataJson.currentDate);
      }
    }
    const localStorageforLocal = localStorage.getItem('APP_STORAGE_TOKEN');
    this.userIdLocal = JSON.parse(localStorageforLocal).userName;
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 119, 0, 1);
    this.maxDate = new Date();
    this.createTaskForm = this.formBuilder.group({
      selecttaskQueuesOption: [''],
      selectModuleOption: [''],
      selectRecordType0: '',
      assignUser: '',
      selectRecordId0: '',
      personId1: [''],
      personId2: [''],
      taskDetails: [''],
      priorityCode: [''],
      dueDate: [''],
    });
    this.getTaskPriorityCodes();
  }

  ngOnChanges(changes: SimpleChanges) {
    if ((changes.data && (changes.data.previousValue !== changes.data.currentValue))) {
      this.getAssignedTasks();
      this.getAllTaskNames();
    }
  }

  createNewTask() {
    this.showCreateNewTaskContent = true;
  }

  close() {
    this.closeDialogEvent.emit();
  }

  getPersonDetails() {
    const personSubscriptions$ = this.rightNavTaskService
    .getPersonDetailsByPersonId(this.userIdLocal, this.data.prsnId, this.data.refId)
      .subscribe(res => {
        this.personDetails = res;
      });
    this.subscriptions$.push(personSubscriptions$);
  }

  getAllTaskNames() {
    const AllTaskNames$ = this.rightNavTaskService.getAllTaskNames(this.userIdLocal).subscribe(response => {
      const tempArray = [];
      if (this.data.paeId) {
        response.forEach(element => {
          if (element.paeIdSw === 'Y') {
            tempArray.push(element);
          }
        });
      }
      if (this.data.refId) {
        response.forEach(element => {
          if (element.refIdSw === 'Y') {
            tempArray.push(element);
          }
        });
      }
      if (this.data.aplId) {
        response.forEach(element => {
          if (element.aplIdSw === 'Y') {
            tempArray.push(element);
          }
        });
      }
      this.allTaskMasterList = response;
      const allTaskRecords = tempArray.filter(task => task.manualSw === 'Y');
      this.taskQueuesOptions = allTaskRecords.map(taskRec => taskRec.taskName).sort();
    }, error => {
      this.toastrService.error("Internal Server Error!");
    });
    this.subscriptions$.push(AllTaskNames$);
  }

  getTaskPriorityCodes() {
    const TaskPriorityCodesSubscription$ = this.rightNavTaskService.getTaskPriorityCodes().subscribe(response => {
      this.taskPriorities = response;
    });
    this.subscriptions$.push(TaskPriorityCodesSubscription$);
  }

  cancel() {
    this.createTaskForm.reset();
  }

  handleCreateTask() {
    const assignedUser = this.createTaskForm.value.assignUser;
    if (assignedUser) {
      this.userId = assignedUser.split(';')[0].split('=')[1].trim();
    }
    const payload = {
      adminDocVO: {
        taskMasterId: this.selectedTaskMasterId
      },
      appealId: this.data.aplId,
      assignedUserId: this.userId ? this.userId : null,
      mergedPersonId: this.createTaskForm.value.personId2 ? this.createTaskForm.value.personId2 : null,
      moduleCode: null,
      paeId: this.data.paeId,
      personId: this.data.prsnId.toString(),
      priorityCd: this.createTaskForm.value.priorityCode ? this.createTaskForm.value.priorityCode : null,
      referalId: this.data.refId,
      taskDetailDesc: this.createTaskForm.value.taskDetails ? this.createTaskForm.value.taskDetails : null,
      transitionId: null,
      undefined: null,
      dueDate: this.createTaskForm.value.dueDate
    };
    this.rightNavTaskService.createTask(payload).subscribe(response => {
      if (response && !response.errorCode) {
        this.toastrService.success(response.successMsgDescription);
        this.getAssignedTasks();
      } else {
        this.toastrService.error(response.errorCode.description);
      }
    }, error => {
      this.toastrService.error('Error creating the task');
    });
  }

  getAssignedTasks() {
    let searchId = '';
    if (this.data.paeId) {
      searchId = searchId + 'paeId=' + this.data.paeId;
    }
    if (this.data.refId) {
      if (searchId === '') {
        searchId = 'refId=' + this.data.refId;
      } else {
        searchId = searchId + '&refId=' + this.data.refId;
      }
    }
    if (this.data.aplId) {
      if (searchId === '') {
        searchId = 'aplId=' + this.data.aplId;
      } else {
        searchId = searchId + '&aplId=' + this.data.aplId;
      }
    }
    this.dataSource = new MatTableDataSource([]);
    this.isShow = false;
    const observables = [];
    observables.push(this.rightNavTaskService.getAssignedTasks(this.userIdLocal, this.data.prsnId, searchId));
    observables.push(this.rightNavTaskService.getTaskStatusCodes());

    const assignmentTasksSubscriptions$ = forkJoin(observables).subscribe((res: any) => {
      const tableRecords = [];
      if (res[0] && res[0].length > 0) {
        this.isShow = true;
        res[0].forEach(row => {
          if (res[1] && res[1].length > 0) {
            const statusObj =  res[1].filter(rec => rec.code ===  row.taskStatusCd);
            if (statusObj && statusObj.length > 0) {
              row.taskStatusCd =  statusObj[0].value;
            } else {
              row.taskStatusCd = '';
            }
          }
          tableRecords.push(row);
        });
        this.dataSource = new MatTableDataSource(tableRecords);
      }
    }, error => {
    });
    this.subscriptions$.push(assignmentTasksSubscriptions$);
  }

  handleTaskQueueChange(event) {
    const selectedTaskQueue = this.createTaskForm.controls['selecttaskQueuesOption'].value;
    const selectedRecord = this.allTaskMasterList.filter(taskRec => taskRec.taskName === selectedTaskQueue);
    if (selectedRecord && selectedRecord.length > 0) {
      this.selectedRecord = selectedRecord[0];
      this.selectedRecord.dueDateCd === 'O' ? this.showDueDate = true : this.showDueDate = false;
    }
    if (selectedRecord && selectedRecord.length > 0) {
      this.selectedRecord = selectedRecord[0];
      this.selectedRecord.prsn2IdSw === 'Y' ? this.prsn2Id = true : this.prsn2Id = false;
    }
    this.allTaskMasterList.forEach(element => {
      if (element.taskName === event.value) {
        this.selectedTaskMasterId = element.taskMasterId;
      }
    });
  }

  showAssignUserDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.minWidth = '800px';
    dialogConfig.minHeight = '405px';
    dialogConfig.position = {
      top: '216px',
      right: '360px'
    };
    dialogConfig.width = '720px';
    dialogConfig.height = '324px';
    dialogConfig.panelClass = 'edit-profile-container';
    dialogConfig.data = {
      taskMasterId: this.selectedTaskMasterId
    };
    const dialogRef = this.matDialog.open(AssignUserComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      const assignUser = 'userid = ' + result.userId + ' ; ' + 'roleId = ' + result.roleId;
      this.createTaskForm.controls.assignUser.patchValue(assignUser);
    });
  }

  closeTask(taskId) {
    if (!this.closeNotes) {
      return;
    }
    const taskClosureSubscription$ = this.rightNavTaskService.updateTaskClosure(taskId, this.closeNotes).subscribe(response => {
      if (response && !response.errorCode) {
        this.toastrService.success(response.successMsgDescription);
        this.getAssignedTasks();
      }
    }, error => {
      this.toastrService.error("Internal Server Error!");
    });
    this.subscriptions$.push(taskClosureSubscription$);
  }

  ngOnDestroy() {
    if (this.subscriptions$ && this.subscriptions$.length > 0) {
      this.subscriptions$.forEach(subscription$ => subscription$.unsubscribe());
    }
  }

}
