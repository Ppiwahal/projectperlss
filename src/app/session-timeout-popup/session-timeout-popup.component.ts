import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-session-timeout-popup',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './session-timeout-popup.component.html',
  styleUrls: ['./session-timeout-popup.component.scss']
})
export class SessionTimeoutPopupComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<SessionTimeoutPopupComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    console.log('data', data);
  }

  ngOnInit(): void {
  }
  closePopup() {
    this.dialogRef.close();
  }

}
