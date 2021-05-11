import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-record-popup',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './delete-record-popup.component.html',
  styleUrls: ['./delete-record-popup.component.scss']
})
export class DeleteRecordPopupComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DeleteRecordPopupComponent>) { }

  ngOnInit(): void {
  }

  closePopup() {
    this.dialogRef.close({isDelete: false});
  }
  delete(){
    this.dialogRef.close({isDelete: true});
  }
}
