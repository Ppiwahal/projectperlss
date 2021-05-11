import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-pae-adjudication-denial-details',
  templateUrl: './pae-adjudication-denial-details.component.html',
  styleUrls: ['./pae-adjudication-denial-details.component.scss']
})
export class PaeAdjudicationDenialDetailsComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<PaeAdjudicationDenialDetailsComponent>) { }

  ngOnInit(): void {
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
