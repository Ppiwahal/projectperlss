import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserProfileService } from '../services/user-profile.service';
import * as customValidation from '../../_shared/constants/validation.constants';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from '../../core/authentication/authentication.service';

@Component({
  selector: 'app-edit-user-profile',
  templateUrl: './edit-user-profile.component.html',
  styleUrls: ['./edit-user-profile.component.scss']
})
export class EditUserProfileComponent implements OnInit, OnDestroy {

  editUserProfileForm: FormGroup;
  userProfile: any;
  subscriptions$: any[] = [];
  entityName: any;
  entityOptions: any;
  entity: any;
  secUserRole: any;
  classificationList: any;
  userStatus: any;
  regionCdList: any;
  secUserRoles: any;
  userRole: any;
  roleList: any;
  managedUserRole: any;
  managedRoleList: any;
  displayRegion = false;
  isSaved = false;
  customValidation = customValidation;
  isReadOnlyUser: boolean;

  constructor(private fb: FormBuilder, 
              public dialogRef: MatDialogRef<EditUserProfileComponent>, 
              private userProfileService: UserProfileService, 
              @Inject(MAT_DIALOG_DATA) public userProfileEntitydata: any, 
              private toastr: ToastrService, 
              private authenticationSevice: AuthenticationService) {
                this.isReadOnlyUser = authenticationSevice.isCurrentPageReadOnly();
              }

  ngOnInit(): void {
    this.editUserProfileForm = this.fb.group({
      userRoles: ['', Validators.required],
      classification: ['', Validators.required],
      region: ['', Validators.required],
      managedUserRoles: ['', Validators.required],
      status: ['', Validators.required]
    });
    this.userProfile = this.userProfileEntitydata.element;
    console.log("userProfile ", this.userProfile);
    this.entityOptions = this.userProfileEntitydata.entityOptions;
    this.secUserRole = this.getAssignableRoles();
    console.log("this.secUserRole ", this.secUserRole);
    this.userStatus = this.userProfileEntitydata.statusOptions;
    this.classificationList = this.userProfileEntitydata.classificationList;
    this.regionCdList = this.userProfileEntitydata.regionOptions;
    this.entityName = this.userProfile.entityDetails ?
      this.userProfile.entityDetails.entityId ?
        this.getEntityName() : null : null;
    this.displayRegion = this.entityName === 'DIDD' ? true : false;
    this.roleList = this.userProfile.entityDetails ?
      this.getRoleNames()
      : "--";
    if(this.displayRegion) {
      this.editUserProfileForm.controls['region'].setValidators(Validators.required);
    } else {
      this.editUserProfileForm.controls['region'].clearValidators();
    }
    this.managedRoleList = this.userProfile.entityDetails.userManagedRoleList ?
      this.getManagedRoleNames()
      : null;
    let managedUserRoles = null;
    if(this.managedRoleList && this.managedRoleList.length > 0) {
      if (this.userProfile.entityDetails.classificationCd === 'L') {
        managedUserRoles = this.managedRoleList.map(item => item.roleId);
      } else if (this.userProfile.entityDetails.classificationCd === 'M') {
        managedUserRoles = this.managedRoleList[0].roleId;
        console.log("managedUserRoles ",managedUserRoles);
      }
    }
    if(this.userProfile.entityDetails.classificationCd !== 'M' && this.userProfile.entityDetails.classificationCd !== 'L') {
      this.editUserProfileForm.controls['managedUserRoles'].clearValidators();
    }
    const roleIdList = this.roleList.map(item => item.roleId);
    let selectedRegion = this.userProfile.regionCd;
    console.log("roleIdList ",roleIdList);
    if(roleIdList.indexOf(70001) > -1) {
      selectedRegion = 'ALL';
    }
    console.log("roleIdList ",roleIdList);
    this.editUserProfileForm.patchValue({
      userRoles: roleIdList,
      classification: this.userProfile.entityDetails.classificationCd,
      region: selectedRegion,
      managedUserRoles: managedUserRoles,
      status: this.userProfile.entityDetails.status
    });
    if(this.isReadOnlyUser) {
      this.editUserProfileForm.disable();
    }
  }

  handleManagedUserRoles() {
    let managedUserRoles = null;
    if(this.managedRoleList && this.managedRoleList.length > 0) {
      console.log("this.f.classification", this.editUserProfileForm.controls);
      if (this.f.classification.value === 'L') {
        managedUserRoles = this.managedRoleList.map(item => item.roleId);
      } else if (this.f.classification.value === 'M') {
        managedUserRoles = this.managedRoleList[0].roleId;
      }
      this.editUserProfileForm.controls['managedUserRoles'].setValidators(Validators.required);
    }
    this.editUserProfileForm.patchValue({
      managedUserRoles: managedUserRoles
    });
    if(this.f.classification.value !== 'L' && this.f.classification.value !== 'M') {
      this.editUserProfileForm.controls['managedUserRoles'].clearValidators();
      this.editUserProfileForm.controls['managedUserRoles'].setErrors(null);
    }

  }



  close() {
    if (this.isSaved === false) {
      this.isSaved = true
      this.toastr.warning('Are you sure you would like to leave this page? Your information will not be saved. If you wish to proceed, please click "X" again');
    } else {
      this.dialogRef.close();
    }

  }

  get f() { 
    return this.editUserProfileForm.controls; 
  }

  handleUserRoleChange() {
    console.log("change ",this.f.userRoles.value);
    console.log("index ",this.f.userRoles.value.indexOf(70001));
    if(this.displayRegion && this.f.userRoles.value.indexOf(70001) > -1) {
      this.editUserProfileForm.patchValue({
        region: 'ALL'
      });
    }
  }

  editUserProfile() {
    if (this.editUserProfileForm.valid) {
      let manageUserRoleIds = [];
      if(this.f.classification.value === 'L'){
        manageUserRoleIds = this.f.managedUserRoles.value;
      } else if(this.f.classification.value === 'M') {
        manageUserRoleIds = [this.f.managedUserRoles.value];
      }

      let payload = {
        "classificationCd": this.f.classification.value,
        "entityId": this.userProfile?.entityDetails.entityId,
        "manageUserRoleIds": manageUserRoleIds,
        "regionCd": this.f.region.value,
        "statusCd": this.f.status.value,
        "userId": this.userProfile?.userName,
        "userRoleIds": this.f.userRoles.value,
        "createdBy": this.userProfile?.userName
      };
      const saveProfileSubscription$ = this.userProfileService.saveUserProfile(payload).subscribe(
        res => {
          this.toastr.success("Saved successfully");
          this.dialogRef.close({success: true});
          this.isSaved = true;
        },
        error => {
          this.toastr.error('Service Error');

        }
      );
      this.subscriptions$.push(saveProfileSubscription$)
    }
  }

  getEntityName(): any {

    this.entity = this.entityOptions.filter(element => {
      return this.userProfile.entityDetails.entityId === element.entityId && element.entityName;
    });
    return this.entity ? this.entity[0].entityName : null;
  }

  getRoleNames(): any {
    const secUserRole = this.userProfileEntitydata.secUserRoles;
    this.userRole = this.userProfile.entityDetails.userRoleList;
    this.roleList = secUserRole.filter(element => {
      return this.userRole.includes(element.roleId)
    });
    return this.roleList;
  }

  getAssignableRoles(): any {
    const secUserRole = this.userProfileEntitydata.secUserRoles;
      console.log("entityId ", this.userProfile.entityDetails.entityId);
    if (this.userProfile.entityDetails.entityId !== null) {
      const matchedEntityList = this.entityOptions.filter(option => option.entityId === this.userProfile.entityDetails.entityId).map(entity => entity.entityTypeId);
      console.log("matchedEntityTypeList ", matchedEntityList);
      return secUserRole.filter(element => {
        return ((matchedEntityList && matchedEntityList.indexOf(element.entityTypeId) > -1)  || (this.userProfile.entityDetails.entityId === element.entityId));
      });
    } else {
      return secUserRole;
    }
  }

  getManagedRoleNames(): any {
    const secUserRole = this.userProfileEntitydata.secUserRoles;
    this.managedUserRole = this.userProfile.entityDetails.userManagedRoleList;
    this.managedRoleList = this.secUserRole.filter(element => {
      return this.managedUserRole.includes(element.roleId)
    });
    return this.managedRoleList;
  }

  ngOnDestroy() {
    if (this.subscriptions$ && this.subscriptions$.length > 0) {
      this.subscriptions$.forEach(subscription$ => subscription$.unsubscribe());
    }
  }

}
