import { Component, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AssignUserComponent } from '../assign-user/assign-user.component';
import { TaskDetailsComponent } from '../task-details/task-details.component';
import { UpdateTaskComponent } from '../update-task/update-task.component';
import { InboxService } from '../services/inbox.service';
import { forkJoin } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as CryptoJS from 'crypto-js';
import * as Constants from '../../_shared/constants/application.constants';

export interface Task {
  module: string;
  recordId: string;
  taskQueue: string;
  dueDate : string;
  status: string;
  priority:string;
  taskMasterId: number;
  taskId: any;
}


@Component({
  selector: 'app-mytasks',
  templateUrl: './mytasks.component.html',
  styleUrls: ['./mytasks.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class MytasksComponent implements OnInit {

  displayedColumns: string[] = ['module','taskQueue', 'recordId','dueDate','status', 'priority'];
  checkboxColumn: string = 'select';
  checkboxColumnHeader:string = 'Select';
  selectableCheckbox: string[] = ['Assigned','New'];
  dataSource: MatTableDataSource<any>;
  expandedElement;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  selection = new SelectionModel<Task>(true, []);
  @Output() emitTasksCount = new EventEmitter();
  isAnyTaskSelected: boolean = false;
  myTaskDetails:any;
  subscriptions$:any[] = [];
  pageOptions:any[] = [];
  userId;
  entityId;

  constructor(private matDialog: MatDialog,
              private inboxService: InboxService,
              private toastr: ToastrService, 
              private router: Router) { }

  ngOnInit(): void {
    this.getTaskDetails();
  }

  getTaskDetails(){
    const localStorageforLocal = localStorage.getItem('APP_STORAGE_TOKEN');
    this.userId= JSON.parse(localStorageforLocal).userName;
    this.entityId = JSON.parse(localStorageforLocal).entityId;
    let observables = [];
    observables.push( this.inboxService.getMyTaskDetails(this.userId, this.entityId));
    observables.push( this.inboxService.getModuleValues());
    observables.push( this.inboxService.getTaskStatusCodes());
    observables.push( this.inboxService.getTaskPriorityCodes());
    observables.push( this.inboxService.getTaskQueues());
    observables.push(this.inboxService.getPagingOptions());

    const TaskDetailsSubscriptions$ = forkJoin(observables).subscribe((res : any) => {
      let tableRecords = [];
      if(res[0] && res[0].length > 0) {

        res[0].sort((a, b) => {
          if (a.priority > b.priority) return 1;
          if (b.priority > a.priority) return -1;
          return 0;
        });

        res[0].forEach(row => {
          if (row.userIdResponseVO) {
            let recordIds = [];
            if (row.userIdResponseVO.paeId) recordIds.push(row.userIdResponseVO.paeId);
            if (row.userIdResponseVO.referralId) recordIds.push(row.userIdResponseVO.referralId);
            if (row.userIdResponseVO.appealId) recordIds.push(row.userIdResponseVO.appealId);
            if (row.userIdResponseVO.transitionId) recordIds.push(row.userIdResponseVO.transitionId);
            if (row.userIdResponseVO.enrollmentId) recordIds.push(row.userIdResponseVO.enrollmentId);
            row['recordId'] = recordIds.join();
          }
          if(res[1] && res[1].length > 0) {
            let moduleObj =  res[1].filter(rec => rec.code ===  row['moduleCode']);
            if(moduleObj && moduleObj.length > 0) {
              row['moduleCode'] =  moduleObj[0].value;
            } else {
              row['moduleCode'] = '';
            }
          }
          if(res[2] && res[2].length > 0) {
            let priorityObj =  res[2].filter(rec => rec.code ===  row['status']);
            if(priorityObj && priorityObj.length > 0) {
              row['status'] =  priorityObj[0].value;
            }
          }
          if(res[3] && res[3].length > 0) {
            let statusObj =  res[3].filter(rec => rec.code ===  row['priority']);
            if(statusObj && statusObj.length > 0) {
              row['priority'] =  statusObj[0].value;
            }
          }
          if(res[4] && res[4].length > 0) {
            let taskQueueObj =  res[4].filter(rec => rec.code ===  row['taskName']);
            if(taskQueueObj && taskQueueObj.length > 0) {
              row['taskName'] =  taskQueueObj[0].value;
            }
          }
          if(row['status'].toLowerCase() !== 'closed') {
            tableRecords.push(row);
          }
          if(res[5] && res[5].length > 0) {
            this.pageOptions = res[5].map(pageOption => pageOption.value);
            }
        })

      }
      this.dataSource = new MatTableDataSource(tableRecords);
      this.dataSource.paginator = this.paginator;
      setTimeout (() => {
        this.emitTasksCount.emit(this.dataSource.data.length);
      });

    })
    this.subscriptions$.push(TaskDetailsSubscriptions$);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  showUpdateTaskDialog(row) {
    const dialogConfig =  new MatDialogConfig();
    dialogConfig.minWidth = '800px';
    dialogConfig.maxWidth = '500px';
    dialogConfig.minHeight = '405px';
    dialogConfig.data = {taskId: row.taskId, taskMasterId: row.taskMasterId, taskName: row.taskName};
    const dialogRef = this.matDialog.open(UpdateTaskComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(data => {
      this.getTaskDetails();
    })
  }

  navigatingToScreen(row){
    const searchData = {requestType: '', personId:'', personId2:'', ...row};
    if(row.taskName.toUpperCase().indexOf('UNLINK TWO INDIVIDUALS') > -1) {
        searchData.requestType = 'Unlink';
      } else if (row.taskName.toUpperCase().indexOf('LINK TWO INDIVIDUALS') > -1) {
        searchData.requestType = 'Link';
      } else if (row.taskName.toUpperCase().indexOf('TEDS LINK ACKNOWLEDGMENT') > -1) {
      searchData.hideIndividualSection = true;
      searchData.showConfirmLink = true;
    }
    searchData.personId = row.taskResponseVO.personId;
    searchData.personId2 = row.taskResponseVO.personId2;
    searchData.paeId = row.userIdResponseVO.paeId;
    searchData.referralId = row.userIdResponseVO.referralId;
    searchData.taskId = row.taskId;
    sessionStorage.setItem('ACTIVE_SESSION_DATA', CryptoJS.AES.encrypt(JSON.stringify(searchData), Constants.APP_ENC_DECRYPT_KEY).toString());
    const taskMid = row.taskMasterId;
    const searchPerson$ = this.inboxService.getPageId(taskMid).subscribe(res => {
      if(res) {
        this.router.navigate([res["path"]]);
        let payload = {
            "taskId": row.taskId,
            "taskStatusCd": row.status
        }
        const updateTask$ = this.inboxService.updateTask(payload).subscribe(res => {
          if(res) {
            this.toastr.success(res.message)
          } else {
            this.toastr. error(res.error);
          }
        }, err => {
          this.toastr.error('Service Error!');
        })
        this.subscriptions$.push(updateTask$)
      } else {
        this.toastr.error("Error!");
      }
    }, err => {
      this.toastr.error('Service Error!');
    })
    this.subscriptions$.push(searchPerson$)
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.filter(row => this.selectableCheckbox.indexOf(row.status) !== -1).length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => {
        if(this.selectableCheckbox.indexOf(row.status) !== -1) {
          this.selection.select(row);
        }
      });
    this.isAnyTaskSelected = this.selection.selected && this.selection.selected.length > 0;
  }

  handleSelection(event, row) {
    if(event) {
      this.selection.toggle(row);
      this.isAnyTaskSelected = this.selection.selected && this.selection.selected.length > 0;
    }
  }

  toggleSelectDisplay() {
    if(this.displayedColumns.indexOf(this.checkboxColumn) > -1) {
      this.displayedColumns.shift();
      this.checkboxColumnHeader = 'Select';
      this.selection.clear();
      this.isAnyTaskSelected = false;
    } else {
      this.displayedColumns = [...[this.checkboxColumn],...this.displayedColumns];
      this.checkboxColumnHeader = 'Hide';
    }
    this.selection.selected.forEach(s => console.log(s.recordId));
  }

  openTaskDetailsDialog(row) {
    const dialogConfig =  new MatDialogConfig();
    dialogConfig.width = '500px';
    dialogConfig.height = '340px';
    dialogConfig.panelClass = 'edit-profile-container';
    dialogConfig.data =  {rowData : row};
    this.matDialog.open(TaskDetailsComponent, dialogConfig);
  }

  showAssignUserDialog() {
    const taskMasterIds = this.selection.selected.map(row => row.taskMasterId);
    const taskIds = this.selection.selected.map(row => row.taskId);
    const dialogConfig =  new MatDialogConfig();
    dialogConfig.minWidth = '800px';
    dialogConfig.minHeight = '405px';
    dialogConfig.panelClass = 'edit-profile-container';
    dialogConfig.data = {taskMasterId: taskMasterIds.join(), taskIds, displayMode : 'update', showCloseButton: true};
    this.matDialog.open(AssignUserComponent, dialogConfig);
  }

  ngOnDestroy() {
    if(this.subscriptions$ && this.subscriptions$.length > 0) {
      this.subscriptions$.forEach(subscription$ => subscription$.unsubscribe());
    }
  }

}
