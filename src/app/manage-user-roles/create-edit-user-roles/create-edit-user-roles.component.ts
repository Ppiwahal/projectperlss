import { Component, Input, OnInit, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { DisplayMode } from '../../_shared/utility/DisplayMode';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserRolesService } from '../services/user-roles.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { EditBusinessFunctionsComponent } from '../edit-business-functions/edit-business-functions.component';
import { EditTaskQueuesComponent } from '../edit-task-queues/edit-task-queues.component';
import * as customValidation from '../../_shared/constants/validation.constants';
import { AuthenticationService } from '../../core/authentication/authentication.service';

const FORM_DEFAULTS = {
  entityType: '',
  entityCd: '',
  roleName: '',
  status: '',
  roleId: ''
}

@Component({
  selector: 'app-create-edit-user-roles',
  templateUrl: './create-edit-user-roles.component.html',
  styleUrls: ['./create-edit-user-roles.component.scss']
})
export class CreateEditUserRolesComponent implements OnInit {

  @Input() displayMode: DisplayMode;
  @Input() selectedRow: any;
  @Input() isReadOnlyUser: boolean;
  @Output() emitDisplayMode = new EventEmitter();
  userRoleForm: FormGroup;
  statusOptions: any[];
  entityTypes: any[];
  entityNames: any[];
  entityNameVals: any[] = [];
  subscriptions$: any[] = [];
  customValidation = customValidation;
  isRoleCreated = false;
  userId;

  constructor(private fb: FormBuilder,
    private userRolesService: UserRolesService,
    private matDialog: MatDialog,
    private toastr: ToastrService,
    private authenticationSevice: AuthenticationService) { }

  ngOnInit(): void {
    console.log("this.selected row ", this.selectedRow);
    this.loadFormValues();
    this.getStatusValues();
    this.getEntityTypes();
    this.getEntityNames();
    this.getCodeValues();
  }
  getCodeValues() {
    const codeValuesSubscriptions$ = this.userRolesService.getstaticCodeValues().subscribe(res => {
      this.userRolesService.accessLevel = res[1];
      this.userRolesService.module = res[0];
      this.userRolesService.dashboardcode=res[2];
    });
    this.subscriptions$.push(codeValuesSubscriptions$);
  }
  getStatusValues() {
    const statusValuesSubscriptions$ = this.userRolesService.getStatusValues().subscribe(res => {
      this.statusOptions = res;
      this.f.status.setValue(this.statusOptions[0].code);
    });
    this.subscriptions$.push(statusValuesSubscriptions$);
  }

  getEntityNames() {
    console.log("fetching entity names");
    const entityNamesSubscriptions$ = this.userRolesService.getEntityNames().subscribe(res => {
      this.entityNames = res;
      console.log("entity Names ",this,this.entityNames)
    });
    this.subscriptions$.push(entityNamesSubscriptions$);
  }

  // callMethod() {
  //   this.displayMode = DisplayMode.CREATE;
  //   this.isRoleCreated = false;
  //   this.loadFormValues();
  // }

  handleEntityChange() {
    const matchingEntityNames = this.entityNames.filter(entityName => {
      if(entityName.entityType === this.f.entityType.value) {
        return entityName;
      }
    });
    const entityNamesWithNullType = this.entityNames.filter(entityName => !entityName.entityType);
    this.entityNameVals = [...matchingEntityNames, ...entityNamesWithNullType];
    console.log("entityNameVals ", this.entityNameVals);
  }


  getEntityTypes() {
    const entityValuesSubscriptions$ = this.userRolesService.getEntityTypes().subscribe(res => {
      this.entityTypes = res;
      console.log("entityTypes ", this.entityTypes);
    });
    this.subscriptions$.push(entityValuesSubscriptions$);
  }

  loadFormValues() {
    const idDisabled = this.displayMode === 'EDIT';
    const selectedRow = this.selectedRow ? this.selectedRow : FORM_DEFAULTS;
    console.log('selectedRow ', this.selectedRow);
    let entityCode = '';
    if(this.entityTypes) {
      const matchedEntityType = this.entityTypes.filter(entityType => entityType.value === selectedRow.entityType);
      entityCode = (matchedEntityType && matchedEntityType.length > 0) ? matchedEntityType[0].code : '';
    }
    this.userRoleForm = this.fb.group({
      entityType: [{ value: entityCode, disabled: idDisabled }],
      entity: [{ value: '', disabled: idDisabled }],
      userRoleName: [{value:selectedRow.roleName, disabled : this.isReadOnlyUser}],
      status: [selectedRow.roleStatusCd],
      roleId: [selectedRow.roleId]
    });
    let entityNameCode = '';
    if(this.entityNames) {
      this.handleEntityChange();
      console.log("this.entityNameVals ", this.entityNameVals);
      console.log("selectedRow.entityName ", selectedRow.entityName);
      const matchedEntityName = this.entityNameVals.filter(entityName => entityName.entityName === selectedRow.entityName);
      console.log("matchedEntityName ", matchedEntityName);
      entityNameCode = (matchedEntityName && matchedEntityName.length > 0) ? matchedEntityName[0].entityId : '';
      console.log("entityNameCode ",entityNameCode);
      this.userRoleForm.controls.entity.setValue(entityNameCode.toString());
    }

  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedRow'] || changes['displayMode']) {
      if((changes['selectedRow'] && changes['selectedRow'].currentValue === null) || (changes['displayMode'] && changes['displayMode'].currentValue === 'CREATE')) {
        this.isRoleCreated = false;
      } else {
        this.isRoleCreated = true;
      }
      this.loadFormValues();
    }
  }


  get f() { return this.userRoleForm.controls; }


  saveOrEditUserRole() {
    //const userId = 'dcu8487';
    const localStorageforLocal = localStorage.getItem('APP_STORAGE_TOKEN');
    this.userId= JSON.parse(localStorageforLocal).userName;
    if (this.userRoleForm.invalid) {
      return;
    }
    const entityObj = this.entityNameVals.filter(entityObj => entityObj.entityId === Number(this.f.entity.value));
    
    let createPayload = {
      "userId": this.userId,
      "entityId": this.f.entity.value ? this.f.entity.value : null,
      "entityType": this.f.entityType.value ? this.f.entityType.value : null,
      "roleName": this.f.userRoleName.value ? this.f.userRoleName.value : null,
      "roleStatusCd": this.f.status.value
    }
    console.log("createPayload ",createPayload);

    let editPayload = {
      "userId": this.userId,
      "entityId": this.f.entity.value ? this.f.entity.value : null,
      "entityType": this.f.entityType.value ? this.f.entityType.value : null,
      "roleName": this.f.userRoleName.value ? this.f.userRoleName.value : null,
      "roleStatusCd": this.f.status.value
    }
    console.log("createPayload ",editPayload);
    if (this.displayMode === 'CREATE') {
      const createUserRoleSubscriptions$ = this.userRolesService.createUserRole(createPayload).subscribe(res => {
        console.log("response ", res);
        if(res && res.errorCode && res.errorCode.length > 0 && res.errorCode[0].description){
          this.toastr.error(res.errorCode[0].description);
        }else {
          if(res && res.successMsgDescription) {
            this.toastr.success(res.successMsgDescription);
          }
          this.displayMode = DisplayMode.EDIT;
          this.isRoleCreated = true;

          const matchedEntityType = this.entityTypes.filter(entityType => entityType.code === this.f.entityType.value);
          const entityType = (matchedEntityType && matchedEntityType.length > 0) ? matchedEntityType[0].value : '';

          const selectedRow = {entityType: entityType, entityName:this.f.entity.value, roleName:this.f.userRoleName.value, roleStatusCd: this.f.status.value, roleId: this.f.roleId.value };

          this.emitDisplayMode.emit({displayMode : DisplayMode.EDIT, selectedRow:selectedRow })
        }

        // this.toastr.success(res.successMsgDescription);
        // this.displayMode = DisplayMode.EDIT;
        // this.isRoleCreated = true;
      }, err => {
        this.toastr.error('Service Error!');
        //this.displayMode = DisplayMode.EDIT;
        //this.isRoleCreated = true;
        //this.emitDisplayMode.emit({displayMode : DisplayMode.EDIT})
      });
      this.subscriptions$.push(createUserRoleSubscriptions$);
    } else if (this.displayMode === 'EDIT') {
      editPayload["roleId"] = this.f.roleId.value;
      const editUserRoleSubscriptions$ = this.userRolesService.editUserRole(editPayload).subscribe(res => {
        if(res.errorCode && res.errorCode[0].description){
          this.toastr.error(res.errorCode[0].description);
        }else {
          this.toastr.success(res.successMsgDescription);
          this.isRoleCreated = true;
        }
      }, err => {
        this.toastr.error('Service Error!');
      });
      this.subscriptions$.push(editUserRoleSubscriptions$);
    }
  }

  editBusinessFunctionDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.minWidth = '900px';
    dialogConfig.height = '850px';
    dialogConfig.panelClass = 'dialog-container';
    dialogConfig.data = {
      "roleId": this.f.roleId.value,
      "roleName": this.f.userRoleName.value
    }
    this.matDialog.open(EditBusinessFunctionsComponent, dialogConfig);

  }
  editTaskQueuesDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.minWidth = '900px';
    dialogConfig.height = '850px';
    dialogConfig.panelClass = 'dialog-container';
    dialogConfig.data = {
      "roleId": this.f.roleId.value,
      "roleName": this.f.userRoleName.value
    }
    this.matDialog.open(EditTaskQueuesComponent, dialogConfig);
  }

  ngOnDestroy() {
    if (this.subscriptions$ && this.subscriptions$.length > 0) {
      this.subscriptions$.forEach(subscription$ => subscription$.unsubscribe());
    }
  }

}
