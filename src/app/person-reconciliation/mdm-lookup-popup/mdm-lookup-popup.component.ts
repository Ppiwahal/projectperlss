import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PersonReconciliationDashboardComponent } from '../person-reconciliation-dashboard/person-reconciliation-dashboard.component';

@Component({
  selector: 'app-mdm-lookup-popup',
  templateUrl: './mdm-lookup-popup.component.html',
  styleUrls: ['./mdm-lookup-popup.component.scss']
})
export class MDMLookupPopupComponent implements OnInit {

  recipientData: any;
  personId: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<PersonReconciliationDashboardComponent>) { }

  ngOnInit() {
    this.recipientData = this.data.recipient.recipient[0];
    this.personId = this.data.personId;
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
