import { Component, Inject, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { InboxService } from '../services/inbox.service';
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
  displayedColumns: string[] = ['firstName', 'userId', 'entityCd', 'roleName'];
  dataSource: MatTableDataSource<UserRoleDetail>;
  selectedRow: any;
  subscriptions$: any[] = [];
  @Input() displayMode;
  @Input() taskIds;
  @Input() taskMasterId;
  @Input() showCloseButton = false;
  taskArray: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<AssignUserComponent>,
    private inboxService: InboxService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) private data) {
    if (!this.taskMasterId) {
      this.taskMasterId = data.taskMasterId;
    }
    if (!this.displayMode) {
      this.displayMode = data.displayMode;
    }
    if (!this.showCloseButton) {
      this.showCloseButton = data.showCloseButton;
    }
  }

  ngOnInit(): void {
    const observables = [];
    observables.push(this.inboxService.getAssignTaskDetails(this.taskMasterId));
    observables.push(this.inboxService.getEntityNames());
    observables.push(this.inboxService.getRoleNames());

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
    const reassignTaskSubscriptions$ = this.inboxService.reassignTask(payload).subscribe(res => {
      this.toastr.success(res.successMsgDescription);
      this.inboxService.reloadInboxComponent$$.next();
    }, err => {
      this.toastr.error('Service Error!');
    });
    this.subscriptions$.push(reassignTaskSubscriptions$);
  }


  sendBackToQueue() {
    const sendBackToQueueSubscriptions$ = this.inboxService.sendBackToQueue(this.taskIds).subscribe(res => {
      this.toastr.success(res.successMsgDescription);
      this.inboxService.reloadInboxComponent$$.next();
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
