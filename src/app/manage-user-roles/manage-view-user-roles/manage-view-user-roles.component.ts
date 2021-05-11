import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';
import { UserRolesService } from '../services/user-roles.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-manage-view-user-roles',
  templateUrl: './manage-view-user-roles.component.html',
  styleUrls: ['./manage-view-user-roles.component.scss']
})
export class ManageViewUserRolesComponent implements OnInit {

  userRoleDetails: any;
  isShowTable = false;
  isActiveFlag = false;
  entityNames: any[];
  entityTypes: any[];
  subscriptions$: any[] = [];

  constructor(public dialogRef: MatDialogRef<ManageViewUserRolesComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private userRoleService: UserRolesService,
              private toastr: ToastrService) { }

  ngOnInit(): void {
    this.isActiveFlag = this.data.isActive;
    this.getUserRoleDetailsByRoleId();
  }
  close() {
    this.dialogRef.close();
  }
  getUserRoleDetailsByRoleId() {
    const observables = [];
    observables.push(this.userRoleService.getUserRoleDetailsByRoleId(this.data.roleId));
    observables.push(this.userRoleService.getEntityNames());
    observables.push(this.userRoleService.getEntityTypes());
    forkJoin(observables).subscribe((res: any) => {
      console.log("res ",res);
      if (res[0]) {
          this.userRoleDetails = res[0];
          this.userRoleDetails.taskQueuesModified = '';
          this.userRoleDetails.isFunctions = false;
          this.userRoleDetails.isTasks = false;
          if (this.userRoleDetails.taskQueues.length > 0) {
            this.userRoleDetails.isTasks = true;
            this.userRoleDetails.taskQueues.forEach(element => {
              if (this.userRoleDetails.taskQueuesModified === '') {
                this.userRoleDetails.taskQueuesModified = element;
              }else {
                this.userRoleDetails.taskQueuesModified = this.userRoleDetails.taskQueuesModified + ', ' + element;
              }
            })
          }
          if (this.userRoleDetails.functionNames.length > 0) {
            this.userRoleDetails.isFunctions = true;
          }
      }

      
      if (res[1] && res[1].length > 0) {
        var entityTypeCd$ = "";
        const filteredEntityNameList = res[1].filter(entityName => {
          if (entityName.entityId === this.userRoleDetails.entityId) {
            entityTypeCd$ = entityName.entityType;
            return entityName;
          }
        });
        if(filteredEntityNameList && filteredEntityNameList.length > 0) {
          this.userRoleDetails.entityName = filteredEntityNameList[0].entityName;
        }
        console.log("entityName ",this.userRoleDetails.entityName);
        if (res[2] && res[2].length > 0) {
          const filteredEntityTypeList = res[2].filter(entityType => {
            if (entityType.code === entityTypeCd$) {
              return entityType;
            }
          });
          if(filteredEntityTypeList && filteredEntityTypeList.length > 0) {
            this.userRoleDetails.entityTypeName = filteredEntityTypeList[0].value;
          }
          console.log("entityTypeName ",this.userRoleDetails.entityTypeName);
        }
      }
      this.isShowTable = true;
    }, (error) => {
      this.toastr.error("Internal Server Error!");
    })

  }
}
