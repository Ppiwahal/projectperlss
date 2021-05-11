import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

const ELEMENT_DATA: any[] = [
  { name: 'sam cook', userName: "sam123", entity: 'Ne', role:"new", userStatus:"new"},
  { name: 'test2', userName: "test346", entity: 'Ne', role:"new", userStatus:"new"},
  { name: 'test3', userName: "sam123", entity: 'Ne', role:"new", userStatus:"new"},
  { name: 'test4', userName: "sam123", entity: 'Ne', role:"new", userStatus:"new"},
  { name: 'test5', userName: "sam123", entity: 'Ne', role:"new", userStatus:"new"}
];

@Component({
  selector: 'app-assign-popup',
  templateUrl: './assign-popup.component.html',
  styleUrls: ['./assign-popup.component.scss']
})
export class AssignPopupComponent implements OnInit {

  displayedColumns: string[] = ['name', 'userName', 'entity', 'role', 'userStatus'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  constructor(public dialogRef: MatDialogRef<AssignPopupComponent>) { }

  ngOnInit(): void {
  }

  closeDialog() {
    this.dialogRef.close();
  }

  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
