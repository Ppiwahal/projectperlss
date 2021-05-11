import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ManageViewUserRolesComponent} from '../manage-view-user-roles/manage-view-user-roles.component';
import {UserRolesService} from '../services/user-roles.service';
import {UserRoleDetail} from '../../_shared/model/UserRoleDetail';
import {forkJoin} from 'rxjs';
import {AuthenticationService} from '../../core/authentication/authentication.service';

@Component({
  selector: 'app-user-roles-table',
  templateUrl: './user-roles-table.component.html',
  styleUrls: ['./user-roles-table.component.scss']
})
export class UserRolesTableComponent implements OnInit, OnChanges {

  displayedColumns: string[] = ['entityName', 'roleName', 'regionCd', 'lastModifiedDt', 'roleStatusCd', 'actions'];
  dataSource: MatTableDataSource<UserRoleDetail>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input() showOnlyActive: boolean;
  @Output() emitRolesCount = new EventEmitter();
  @Output() emitUserRoleEditMode = new EventEmitter<any>();
  subscriptions$: any[] = [];
  selectedPageSize: any;
  pageOptions: any[] = [];
  userId;
  entityId;
  isReadOnlyUser: boolean;

  constructor(private matDialog: MatDialog, private userRoleService: UserRolesService, private authenticationSevice: AuthenticationService) {
    this.isReadOnlyUser = authenticationSevice.isCurrentPageReadOnly();
  }

  ngOnInit(): void {
    this.getRolesByUserid();
  }

  getRolesByUserid(){
    const localStorageforLocal = localStorage.getItem('APP_STORAGE_TOKEN');
    this.userId = JSON.parse(localStorageforLocal).userName;
    this.entityId = JSON.parse(localStorageforLocal).entityId;
    const observables = [];
    observables.push( this.userRoleService.getUserRoles(this.userId, this.entityId));
    observables.push( this.userRoleService.getStatusValues());
    observables.push(this.userRoleService.getPagingOptions());
    observables.push(this.userRoleService.getGrandRegion());
    observables.push(this.userRoleService.getUserRoleByRoleId());

    const rolesDetailsSubscriptions$ = forkJoin(observables).subscribe((res: any) => {
      const tableRecords = [];
      if (res[0] && res[0].length > 0) {

        res[0].forEach(row => {

          if (res[1] && res[1].length > 0) {
            const statusObj =  res[1].filter(rec => rec.code ===  row.roleStatusCd);
            if (statusObj && statusObj.length > 0) {
              row.roleStatus =  statusObj[0].value;
            }else {
              row.roleStatus = '';
            }
          }

          if (res[2] && res[2].length > 0) {
            this.pageOptions = res[2].map(pageOption => pageOption.value);
            this.selectedPageSize = 10;
          }

          if (res[3] && res[3].length > 0) {
            const regionObj =  res[3].filter(rec => rec.code ===  row.regionCd);
            if (regionObj && regionObj.length > 0) {
              row.regionCd =  regionObj[0].value;
            }else {
              row.regionCd = '';
            }
          }
          tableRecords.push(row);
        });
      }
      this.dataSource = new MatTableDataSource(tableRecords);
      const activeRolesCount = this.dataSource.data.filter(userRole => userRole.roleStatusCd === 'A').length;
      this.emitRolesCount.emit(activeRolesCount);
      this.paginator.pageSizeOptions = this.pageOptions;
      this.paginator.pageSize = this.selectedPageSize;
      this.dataSource.paginator = this.paginator;
    }, (error) => {
    });
    this.subscriptions$.push(rolesDetailsSubscriptions$);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['showOnlyActive'] && this.showOnlyActive && this.dataSource.data) {
      this.dataSource.data = this.dataSource.data.filter(userRole => userRole.roleStatusCd === 'A');
    }

  }


  viewUserProfileDialog(row: UserRoleDetail) {
    console.log(row);
    const dialogConfig =  new MatDialogConfig();
    dialogConfig.minWidth = '800px';
    dialogConfig.height = '550px';
    dialogConfig.data = {
      selectedRow : row,
      roleId: row.roleId,
      isActive: row.roleStatusCd === 'A'
    };
    this.matDialog.open(ManageViewUserRolesComponent, dialogConfig);
  }

  editUserRole(row: UserRoleDetail) {
    this.emitUserRoleEditMode.emit({rowData: row});
    console.log(row);
  }

}
