import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-mmis-verify-eligibility-lookup-popup',
  templateUrl: './mmis-verify-eligibility-lookup-popup.component.html',
  styleUrls: ['./mmis-verify-eligibility-lookup-popup.component.scss']
})
export class MmisVerifyEligibilityLookupPopupComponent implements OnInit {

  displayedColumns = [
    'ltssBenefitPlan',
    'assignedMCO',
    'effectiveDate',
    'endDate'
  ];
  expandedElement;
  lookupData: any;
  infoTableData = [];
  dataSource: MatTableDataSource<any>;
  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<MmisVerifyEligibilityLookupPopupComponent>, @Inject(MAT_DIALOG_DATA) private data) {
    console.log('data====', data);
  }

  ngOnInit(): void {
    console.log(this.data.lookupData)
    if (this.data && this.data.lookupData) {
      if (this.data.lookupData.body) {
        this.lookupData = this.data.lookupData.body.verifyEligibilityResponse
      }
      if (this.data.lookupData.infoTableData) {
        this.infoTableData = this.data.lookupData.infoTableData;
        this.dataSource = new MatTableDataSource(this.infoTableData)
      }
    }
  }
  closeDialog() {
    this.dialogRef.close();
  }
}
