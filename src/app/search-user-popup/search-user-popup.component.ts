import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
interface IUserInfo {
  name: string,
  userName: string,
  group: string,
  role: string,
  status: string,
  entityId: number,
  roleId: number
}
@Component({
  selector: 'app-search-user-popup',
  templateUrl: './search-user-popup.component.html',
  styleUrls: ['./search-user-popup.component.scss']
})
export class SearchUserPopupComponent implements OnInit {
  userProfile: IUserInfo[] = [];
  filteredUserProfile: IUserInfo[] = [];
  displayedColumns = [
    'name',
    'userName',
    'group',
    'role',
    'status'
  ];
  dataSource: MatTableDataSource<any>;
  selectedRow: IUserInfo;
  constructor(public dialog: MatDialog, private dialogRef: MatDialogRef<SearchUserPopupComponent>, @Inject(MAT_DIALOG_DATA) private data) {
    console.log('data====', data);
  }
  ngOnInit(): void {
    if (this.data && this.data.userProfiles) {
      this.userProfile = [];
      this.filteredUserProfile = [];
      this.data.userProfiles.forEach(element => {
        this.userProfile.push({
          name: (element.firstName ? element.firstName + ' ' : '') + (element.mi ? element.mi + ' ' : '') + (element.lastName ? element.lastName : ''),
          group: element.entityName,
          role: element.roleName,
          entityId: element.entityId,
          roleId: element.roleId,
          userName: element.userId,
          status: element.statusCd === 'AC' ? 'Active' : 'InActive'
        })
      });
      this.filteredUserProfile = this.userProfile;
      this.dataSource = new MatTableDataSource([]);
    }
  }
  onrowSelect(row) {
    this.selectedRow = row;
    console.log(row)
  }

  validateInput(event) {
    const regex = new RegExp("^[a-z0-9-', ]{1,65}$");
    if (event && !regex.test(event.key)) {
      event.preventDefault();
      return false;
    }
  }

  onSearch(searchValue) {
    console.log(searchValue);
    var filterRespose = this.userProfile;
    searchValue.split(',').forEach(value => {
      filterRespose = filterRespose.filter(res => {
        return (
          (res.name.toLowerCase().indexOf(value.toLowerCase()) !== -1) ||
          (res.group.toLowerCase().indexOf(value.toLowerCase()) !== -1) ||
          (res.role.toLowerCase().indexOf(value.toLowerCase()) !== -1) ||
          (res.userName.toLowerCase().indexOf(value.toLowerCase()) !== -1) ||
          (res.status.toLowerCase().startsWith(value.toLowerCase()))
        )
      })
    });
    delete this.selectedRow;
    this.dataSource = new MatTableDataSource(filterRespose);    
  }
  close() {
    this.dialog.closeAll();
  }
  confirm() {
    this.dialogRef.close({ data: this.selectedRow });
  }
}
