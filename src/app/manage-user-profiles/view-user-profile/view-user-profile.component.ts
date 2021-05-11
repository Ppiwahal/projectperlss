import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as ViewUserProfileDetail from '../../../assets/data/view-userProfile.json';
import { UserProfileService } from '../services/user-profile.service';

@Component({
  selector: 'app-view-user-profile',
  templateUrl: './view-user-profile.component.html',
  styleUrls: ['./view-user-profile.component.scss']
})

export class ViewUserProfileComponent implements OnInit {
  data: any;
  userRole: string;
  userManageRole: string;
  statusOptions: any;
  entityOptions: any;
  userStatusCd: any;
  regionStatusCd: any;
  entityName: any;
  entity: any;
  userStatus: any;
  region: any;
  secUserRoles: any;
  roleList: any;
  roleNameList : any = "";
  managedUserRole: any = "";
  managedRoleList: any;
  managedRoleNameList: string;
  newPhoneNum: any;
  statusDate: any;
  constructor(public dialogRef: MatDialogRef<ViewUserProfileComponent>,
    @Inject(MAT_DIALOG_DATA) public userProfileEntitydata: any,
    public userProfileService: UserProfileService) { }
  close() {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.data = this.userProfileEntitydata.element;
    this.userManageRole = this.data.entityDetails.userManagedRoleList.toString();
    this.entityName = this.data.entityDetails ?
      this.data.entityDetails.entityId ?
        this.getEntityName() : null : null;
    this.userStatus = this.data.entityDetails ?
      this.data.entityDetails.status ?
        this.getUserStatus()
        : "--" : "--";
    this.region = this.data.regionCd ?
      this.getRegion()
      : "--";
    this.roleNameList = this.data.entityDetails.userRoleList ?
      this.getRoleNames()
      : "--";
    this.managedRoleList = this.data.entityDetails.userManagedRoleList ?
      this.getManagedRoleNames()
      :null
    this.newPhoneNum =  this.data.phone? this.formatPhoneNumber(this.data.phone) : null ;
    this.statusDate = this.data.entityDetails ? this.data.entityDetails.statusDate : "--";
  }

  formatPhoneNumber(phoneNumberString) {
    const cleaned = ('' + phoneNumberString).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    } else {
      return '---'
    }
  }
  

  getEntityName(): string {
    this.entityOptions = this.userProfileEntitydata.entityOptions;
    this.entity = this.entityOptions.filter(element => {
      return this.data.entityDetails.entityId === element.entityId
    });
    return this.entity ? this.entity[0].entityName : null;
  }

  getUserStatus(): string {
    this.userStatusCd = this.userProfileEntitydata.statusOptions;
    this.userStatus = this.userStatusCd.filter(element => {
      return this.data.entityDetails.status === element.code
    });
    return this.userStatus ? this.userStatus[0].value : "--";
  }

  getRegion(): string {
    this.regionStatusCd = this.userProfileEntitydata.regionOptions;
    this.region = this.regionStatusCd.filter(element => {
      return this.data.regionCd === element.code
    });
    return this.region[0] ? this.region[0].value : "--";
  }

  getRoleNames(): any {
    this.secUserRoles = this.userProfileEntitydata.secUserRoles;
    this.userRole = this.data.entityDetails.userRoleList;
    this.roleList = this.secUserRoles.filter(element => {
      return this.userRole.includes(element.roleId)
    });
    for(var i = 0 ; i < this.roleList.length ; i ++){
      this.roleNameList = this.roleList[i].roleName.toString() + ", " + this.roleNameList ;
    }
    this.roleNameList = this.roleNameList.substring(0, this.roleNameList.length - 2);
    return this.roleNameList;
  }
  

  getManagedRoleNames(): any {
    this.secUserRoles = this.userProfileEntitydata.secUserRoles;
    this.managedUserRole = this.data.entityDetails.userManagedRoleList;
    this.managedRoleList = this.secUserRoles.filter(element => {
      return this.managedUserRole.includes(element.roleId)
    });
    for(var i = 0 ; i < this.managedRoleList.length ; i ++){
      this.managedRoleNameList = this.managedRoleList[i].roleName.toString(); + ", " + this.managedRoleNameList ;
    }
    return this.managedRoleNameList;
  }


}