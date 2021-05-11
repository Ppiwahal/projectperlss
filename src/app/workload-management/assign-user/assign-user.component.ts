import { Component, Inject, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { WorkloadManagementService } from '../services/workload-management.service';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, observable } from 'rxjs';

export interface UserRoleDetail {
  entityCd: string;
  firstName: string;
  lastName: string;
  roleName: string;
  sufName: string;
  userId: string;
  entityIdsList: any[];
}

@Component({
  selector: 'app-assign-user',
  templateUrl: './assign-user.component.html',
  styleUrls: ['./assign-user.component.scss']
})
export class AssignUserComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['firstName', 'userId', 'entityCd', 'roleName', 'statusName'];
  dataSource: MatTableDataSource<UserRoleDetail>;
  selectedRow: any;
  subscriptions$: any[] = [];
  @Input() displayMode;
  @Input() taskIds;
  @Input() taskMasterId;
  @Input() showCloseButton = false;
  taskArray: any[] = [];
  showAssignTask = false;
  constructor(
    public dialogRef: MatDialogRef<AssignUserComponent>,
    private workloadManagementService: WorkloadManagementService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) private data) {
   
  }

  ngOnInit(): void {
    var distinctTaskMasterIds =[];
    //selection: this.selection.selected,source:'showAssignTask'
    console.log(this.data.data.selection);
    if(this.data.data.source && this.data.data.source == 'showAssignTask'){
    this.showAssignTask = true;
     var taskMasterIds =[];
     this.data.data.selection.forEach(element => {
       taskMasterIds.push(element.taskMasterId);
     });
     distinctTaskMasterIds = [...new Set(taskMasterIds)]
     console.log(distinctTaskMasterIds);
    }else{
    if (!this.taskMasterId) {
      this.taskMasterId = this.data.taskMasterId;
      distinctTaskMasterIds.push(this.taskMasterId);
    }
    if (!this.displayMode) {
      this.displayMode = this.data.displayMode;
    }
    if (!this.showCloseButton) {
      this.showCloseButton = this.data.showCloseButton;
    }
  } 

    var staticDataParsed;
    var userStatus;
    const observables = [];
    observables.push(this.workloadManagementService.getAssignTaskDetails(distinctTaskMasterIds));
    observables.push(this.workloadManagementService.getEntityNames());
    observables.push(this.workloadManagementService.getRoleNames());
   // observables.push(this.workloadManagementService.getRoleNames());

   // const taskNameQueues = this.staticDataService.getStaticDataKeyValue('USER_STATUS');

    staticDataParsed = JSON.parse(localStorage.getItem('STATIC_DATA_MAP'));
    if (staticDataParsed) {
    userStatus=staticDataParsed.staticDataMap['USER_STATUS'];
    }
    const AssignTaskDetailsSubscriptions$ = forkJoin(observables).subscribe((res: any[]) => {
      console.log("res ", res);
      const userList = [];
      res[0].forEach(user => {
        user.entityIdsList.forEach(entityId => {
          const matchedEntity = res[1].filter(entity => entity.entityId === entityId);
          let entityName = '';
          if (matchedEntity && matchedEntity.length > 0) {
            entityName = matchedEntity[0].entityName;
          }
          let roleName = '';
          const matchedRole = res[2].filter(role => role.roleId === user.roleId);
          if (matchedRole && matchedRole.length > 0) {
            roleName = matchedRole[0].roleName;
          }

          let statusName = '';
          const matchedStatus=userStatus.filter(x=>x.code === user.statusCd);
          if(matchedStatus && matchedStatus.length>0){
            statusName = matchedStatus[0].value;
          }
          
          const userObj = { ...user, ...{ entityCd: entityId }, ...{ 'entityName': entityName }, ...{ 'roleName': roleName }, ...{ 'statusName' : statusName} };

          userList.push(userObj);
        });
      });
      this.dataSource = new MatTableDataSource(userList);
    });
    this.subscriptions$.push(AssignTaskDetailsSubscriptions$);
    this.taskIds ? this.taskArray.push(this.taskIds) : this.taskIds;
    this.taskIds = this.data.taskIds ? this.data.taskIds : this.taskArray
  }
  
  selectRow(row) {
    this.selectedRow = row;
  }


  assignTask() {
    console.log("selectedRow ", this.selectedRow);
    this.dialogRef.close(this.selectedRow);
  }

  close() {
    this.dialogRef.close();
  }

  filterUsers(userName: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  reassignTask() {
    if (!this.selectedRow) {
      return;
    }
    let payload = {
      taskIds: this.taskIds,
      assignedUserId: this.selectedRow.userId,
      entityId: this.selectedRow.entityCd,
      roleId: this.selectedRow.roleId
    };
    const reassignTaskSubscriptions$ = this.workloadManagementService.reassignTask(payload).subscribe(res => {
      this.toastr.success(res.successMsgDescription);
      this.workloadManagementService.reloadWorkfloadComponent$$.next();
    }, err => {
      this.toastr.error('Service Error!');
    });
    this.subscriptions$.push(reassignTaskSubscriptions$);
  }


  sendBackToQueue() {
    const sendBackToQueueSubscriptions$ = this.workloadManagementService.sendBackToQueue(this.taskIds).subscribe(res => {
      this.toastr.success(res.successMsgDescription);
      this.workloadManagementService.reloadWorkfloadComponent$$.next();
    }, err => {
      this.toastr.error('Service Error!');
    });
    this.subscriptions$.push(sendBackToQueueSubscriptions$);
  }

  ngOnDestroy() {
    if (this.subscriptions$ && this.subscriptions$.length > 0) {
      this.subscriptions$.forEach(subscription$ => subscription$.unsubscribe());
    }
  }
}
