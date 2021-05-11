import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MapBusinessFunctionsService } from '../services/map-business-functions.service';
import * as customValidation from '../../_shared/constants/validation.constants';

@Component({
  selector: 'app-map-business-functions-dashboard',
  templateUrl: './map-business-functions-dashboard.component.html',
  styleUrls: ['./map-business-functions-dashboard.component.scss'],
})

export class MapBusinessFunctionsDashboardComponent implements OnInit, OnDestroy {

  subscriptions$ = [];
  selectRoleForm: FormGroup;
  customValidation = customValidation;
  entityTypeDropDown = [];
  entityDropDown = [];
  userRoleDropDown = [];
  accessChangeDropDown = [
    'Read',
    'Read/Write'
  ];
  responseEntity = [];
  responseUserRole = [];
  isShowList = false;
  roleIdList = [];
  userRoleName: any;
  accessLevelResponse: any;
  selectedAccess: any;

  constructor(private mapBusinessFunctionsService: MapBusinessFunctionsService,
              private fb: FormBuilder) {
                this.getEntity();
                this.getUserRole();
                this.getEntityType();
                this.getAccessLevel();
  }

  ngOnInit() {
    this.selectRoleForm = this.fb.group({
      entityType: [''],
      entity:[''],
      userRole:['', Validators.required],
      access:[''],
    });
  }

  getAccessLevel() {
    const AccessLevelSubscription = this.mapBusinessFunctionsService.getSearchDropdowns('ACCESS_LEVEL').subscribe(response => {
      if (response && response.length > 0) {
        this.accessLevelResponse = response;
      }
    });
    this.subscriptions$.push(AccessLevelSubscription);
  }

  getEntityType() {
    const EntityTypeSubscriptions = this.mapBusinessFunctionsService.getSearchDropdowns('ENTITY_TYPE').subscribe(response => {
      this.entityTypeDropDown = response;
    }, error => {
    });
    this.subscriptions$.push(EntityTypeSubscriptions);
  }

  getEntity() {
    const EntitySubscriptions = this.mapBusinessFunctionsService.getEntityNames().subscribe(response => {
      this.responseEntity = response;
    }, error => {
    });
    this.subscriptions$.push(EntitySubscriptions);
  }

  getUserRole() {
    const UserRolesSubscription = this.mapBusinessFunctionsService.getUserRoles().subscribe(response => {
      this.responseUserRole = response;
      this.userRoleDropDown = response;
    }, error => {
    });
    this.subscriptions$.push(UserRolesSubscription);
  }

  entityTypeChange(event) {
    this.userRoleDropDown = [];
    let entityTypeIds:any[] = [];
    this.entityDropDown = this.responseEntity.filter(element => {
      entityTypeIds.push(element.entityTypeId);
      return event.value.code === element.entityType;
    });

    this.userRoleDropDown = this.responseUserRole.filter(element => {
      return entityTypeIds.includes(element.entityTypeId)
    });
  }

  entityChange(event) {
    this.userRoleDropDown = this.responseUserRole.filter(element => {
      return event.value.entityId === element.entityId;
    });
  }

  executeSearch() {
    this.isShowList = false;
    if (this.selectRoleForm.valid) {
      const roleId = this.selectRoleForm.value.userRole.roleId;
      this.userRoleName = this.selectRoleForm.value.userRole.roleName;
      this.selectedAccess = this.selectRoleForm.value.access;
      const MapFunctionsByRoleIdSubscriptions = this.mapBusinessFunctionsService.getMapFunctionsByRoleId(roleId).subscribe(response => {
        if (response && response.length > 0) {
          this.roleIdList = response;
          this.isShowList = true;
        }
      }, error => {
      });
      this.subscriptions$.push(MapFunctionsByRoleIdSubscriptions);
    }
  }

  ngOnDestroy() {
    if (this.subscriptions$ && this.subscriptions$.length > 0) {
      this.subscriptions$.forEach(subscription$ => subscription$.unsubscribe());
    }
  }

}
