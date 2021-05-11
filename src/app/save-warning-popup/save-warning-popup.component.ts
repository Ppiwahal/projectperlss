import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'; 

@Component({
  selector: 'app-save-warning-popup',
  templateUrl: './save-warning-popup.component.html',
  styleUrls: ['./save-warning-popup.component.scss']
})
export class SaveWarningPopupComponent {
  route = null;
  constructor(private dialogRef:MatDialogRef<SaveWarningPopupComponent>,
     public dialog: MatDialog) { }
 
  continue() {
    this.dialog.closeAll();
    this.dialogRef.close({data:true}); 
  }

  close() {
    this.dialog.closeAll();
    this.dialogRef.close({data:false}); 
  }
}
