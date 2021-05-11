import {Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {StaticDataMapService} from '../../../core/helpers/static.data.map.service';
import { WorkloadManagementService } from '../../services/workload-management.service';
import { forkJoin } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
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
  selector: 'app-assign-task',
  templateUrl: './assign-task.component.html',
  styleUrls: ['./assign-task.component.scss']
})
export class AssignTaskComponent implements OnInit,OnDestroy {

  displayedColumns: string[] = ['firstName', 'userId', 'entityCd', 'roleName','userStatus'];
  dataSource: MatTableDataSource<UserRoleDetail>;
  subscriptions$: any[] = [];
  @Input() taskDetails: any;
  @Input() taskIds;
  selectedRow: any;
  taskArray: any[] = [];
  constructor(private workLoadService:WorkloadManagementService,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private staticDataService: StaticDataMapService,
              private toastr: ToastrService ) {
                this.workLoadService.refreshWorkloadComponent$$.subscribe(res => {
                  if(res) {
                    this.ngOnInit();
                  }
                });
              }

  ngOnInit(): void {
    const observables = [];
    observables.push(this.workLoadService.getAssignTaskDetails(this.data.data.taskMasterId));
    observables.push(this.workLoadService.getEntityNames());
    observables.push(this.workLoadService.getRoleNames());

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

          const userObj = { ...user, ...{ entityCd: entityId }, ...{ 'entityName': entityName }, ...{ 'roleName': roleName } };

          userList.push(userObj);
        });
      });
      this.dataSource = new MatTableDataSource(userList);
    });
    this.subscriptions$.push(AssignTaskDetailsSubscriptions$);
    this.taskIds ? this.taskArray.push(this.taskIds) : this.taskIds;
    this.taskIds = this.data.taskId ? this.data.taskId : this.taskArray

  }

  selectRow(row) {
    this.selectedRow = row;
  }

  getStatusValueByCode(queueCode) {
    const taskNameQueues = this.staticDataService.getStaticDataKeyValue('USER_STATUS');
    const filteredTaskQueue = taskNameQueues.filter(item => item.code === queueCode);
    return (filteredTaskQueue && filteredTaskQueue.length > 0) ? filteredTaskQueue[0].value : ' ';
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
    const reassignTaskSubscriptions$ = this.workLoadService.reassignTask(payload).subscribe(res => {
      this.toastr.success(res.successMsgDescription);
      this.workLoadService.refreshWorkloadComponent$$.next(true);
    }, err => {
      this.toastr.error('Service Error!');
    });
    this.subscriptions$.push(reassignTaskSubscriptions$);
  }

  sendBackToQueue() {
    const sendBackToQueueSubscriptions$ = this.workLoadService.sendBackToQueue(this.taskDetails.taskId).subscribe(res => {
      this.toastr.success(res.successMsgDescription);
      this.workLoadService.refreshWorkloadComponent$$.next(true);
    }, err => {
      this.toastr.error('Service Error!');
    });
    this.subscriptions$.push(sendBackToQueueSubscriptions$);
  }
c
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnDestroy() {
    if (this.subscriptions$ && this.subscriptions$.length > 0) {
      this.subscriptions$.forEach(subscription$ => subscription$.unsubscribe());
    }
  }
}
