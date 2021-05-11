import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-leave-page-popup',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './leave-page-popup.component.html',
  styleUrls: ['./leave-page-popup.component.scss']
})
export class LeavePagePopupComponent implements OnInit {
route: string;
  constructor(public dialog: MatDialog,  @Inject(MAT_DIALOG_DATA) data, private router: Router) {
    this.route = data.route;
  }

  ngOnInit(): void {

  }

  goBackSummary() {
    this.router.navigate([this.route]);
    this.dialog.closeAll();
  }

  closePopup() {
    this.dialog.closeAll();
  }
  cancel() {
    this.dialog.closeAll();
  }

}
