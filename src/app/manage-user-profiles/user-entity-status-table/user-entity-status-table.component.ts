import { Component, OnInit, ViewChild, Input, EventEmitter, Output } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { EditUserProfileComponent } from './../edit-user-profile/edit-user-profile.component';
import { ViewUserProfileComponent } from './../view-user-profile/view-user-profile.component';
import { UserProfileService } from '../services/user-profile.service';

@Component({
  selector: 'app-user-entity-status-table',
  templateUrl: './user-entity-status-table.component.html',
  styleUrls: ['./user-entity-status-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})

export class UserEntityStatusTableComponent implements OnInit {
  displayedColumns: string[] = ['userName', 'firstName', 'lastName', 'userRoleList', 'entityCd', 'status'];
  checkboxColumnHeader: string = 'Select';
  selectableCheckbox: string[] = ['Assigned', 'New'];
  userRoleList: any;
  manageUserRoleList: any;
  expandedElement;
  selection = new SelectionModel<any>(true, []);
  isAnyTaskSelected: boolean = false;
  @Input() userProfileData: any[] = [];
  dataSource: MatTableDataSource<any> = new MatTableDataSource(this.userProfileData);
  private paginator: MatPaginator;
  entityOptions: any;
  statusOptions: any;
  regionOptions: any;
  secUserRoles: any;
  classificationList: any;
  searchFilter: boolean = false;
  searchText = '';
  @Output() reloadData: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.fixingPaginationIssue();
  }

  constructor(private matDialog: MatDialog, private readonly userProfileService: UserProfileService) { }
  displayTable: boolean;

  ngOnInit(): void {
    this.userProfileService.getEntityDropdown().subscribe(res => {
      this.entityOptions = res;
    });

    this.userProfileService.getSearchDropdowns('USER_STATUS').subscribe(res => {
      this.statusOptions = res;
    });

    this.userProfileService.getSearchDropdowns('GRAND REGION').subscribe(res => {
      this.regionOptions = res;
    });

    this.userProfileService.getSecRoleDetails().subscribe(res => {
      this.secUserRoles = res;
    });

    this.userProfileService.getClassification('CLASSIFICATION').subscribe(res => {
      this.classificationList = res;
    });
  }


  ngOnChanges(changes) {
    if (changes['userProfileData']) {
      this.userProfileData.forEach(data => {
        data.entityDetails.userManagedRoleList.toString();
        data.entityDetails.userRoleList.toString();
      })
      this.fixingPaginationIssue();
    }
  }

  fixingPaginationIssue() {
      if (this.userProfileData.length > 0) {
        this.displayTable = true;
        this.userProfileData.forEach( element => {
          element["userRoleListValues"] = this.getNameByCode(element.entityDetails.userRoleList,'UR');
          element["entityIdDetails"] = this.getNameByCode(element.entityDetails.entityId,'ET');
          element["entityDetailsStatus"] = this.getNameByCode(element.entityDetails.status,'ST');
          element["userManagedRoleListDetails"] = this.getRoleNameList(element.entityDetails.userManagedRoleList);
        })
        this.dataSource = new MatTableDataSource(this.userProfileData);
        this.dataSource.paginator = this.paginator;
        this.dataSource.filter = this.searchText.toLowerCase();
      } else {
        this.displayTable = false;
    }
  }

  getRoleNameList(roleList): any {
    const managedRoleList = this.secUserRoles.filter(element => {
      return roleList.includes(element.roleId)
    });
    return managedRoleList.map(manageRole => manageRole.roleName);
  }

  getNameByCode(code: string, entity: string) {
    if (entity === 'ST' && code) {
      let result = [];
      if (this.statusOptions && this.statusOptions.length > 0) {
        result = this.statusOptions.filter(item => item.code === code);
      }
      return result.length > 0 ? result[0].value : '';
    }
    if (entity === 'ET' && code) {
      let result = [];
      if (this.entityOptions && this.entityOptions.length > 0) {
        result = this.entityOptions.filter(item => item.entityId === code);
      }
      return result.length > 0 ? result[0].entityName : '';
    }
    if (entity === 'UR' && code) {
      let finalResult = "";
      let result = [];
      if (this.secUserRoles && this.secUserRoles.length > 0) {
      result = this.secUserRoles.filter(item => {
        return code.includes(item.roleId);
      });
    }
      for (var i = 0; i < result.length; i++) {
        finalResult = result[i].roleName.toString() + ", " + finalResult;
      }
      finalResult = finalResult.substring(0, finalResult.length - 2);
      return finalResult;
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
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
        if (this.selectableCheckbox.indexOf(row.status) !== -1) {
          this.selection.select(row);
        }
      });
    this.isAnyTaskSelected = this.selection.selected && this.selection.selected.length > 0;
  }

  handleSelection(event, row) {
    if (event) {
      this.selection.toggle(row);
      this.isAnyTaskSelected = this.selection.selected && this.selection.selected.length > 0;
    }
  }

  editUserProfileDialog(element) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.minWidth = '850px';
    dialogConfig.panelClass = 'dialog-container';
    dialogConfig.data = {
      element, entityOptions: this.entityOptions, statusOptions: this.statusOptions,
      regionOptions: this.regionOptions, secUserRoles: this.secUserRoles, classificationList: this.classificationList
    };
    const dialogRef = this.matDialog.open(EditUserProfileComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(data => {
      if(data && data.success) {
        this.reloadData.emit();
      }
    })
  }

  openDialog(element) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.minHeight = '350px';
    dialogConfig.minWidth = '850px';
    dialogConfig.data = {
      element, entityOptions: this.entityOptions, statusOptions: this.statusOptions,
      regionOptions: this.regionOptions, secUserRoles: this.secUserRoles
    };
    this.matDialog.open(ViewUserProfileComponent, dialogConfig);
  }


  applyFilter(event: Event) {
    this.searchFilter = true;
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


}
