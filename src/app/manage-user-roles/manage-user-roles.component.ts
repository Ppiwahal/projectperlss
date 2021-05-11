import { Component, OnInit } from '@angular/core';
import { DisplayMode } from '../_shared/utility/DisplayMode';
import { UserRoleDetail } from '../_shared/model/UserRoleDetail';
import { AuthenticationService } from '../core/authentication/authentication.service';


@Component({
  selector: 'app-manage-user-roles',
  templateUrl: './manage-user-roles.component.html',
  styleUrls: ['./manage-user-roles.component.scss']
})
export class ManageUserRolesComponent implements OnInit {

  rolesCount: number = 0;
  showUserRoleScreen: boolean = false;
  displayMode: DisplayMode;
  selectedRow: UserRoleDetail = null;
  showOnlyActive: boolean;
  isLTSSRole: boolean;
  isReadOnlyUser: boolean;
  //MOCK
  entityRole = 'LTSS';

  constructor( private authenticationSevice: AuthenticationService) {
    this.isReadOnlyUser = authenticationSevice.isCurrentPageReadOnly();
  }

  ngOnInit(): void {
    this.isLTSSRole = (this.entityRole === 'LTSS');
  }

  showActiveRecords() {
    this.showOnlyActive = true;
  }

  handleDisplayMode(event) {
    this.displayMode = event.displayMode;
    this.selectedRow = event.selectedRow;
  }

  createUserRole() {
    this.showUserRoleScreen = true;
    this.displayMode = DisplayMode.CREATE;
    this.selectedRow = null;
  }

  editUserRole(event) {
    this.showUserRoleScreen = true;
    this.displayMode = DisplayMode.EDIT;
    this.selectedRow = event.rowData;
  }
}
