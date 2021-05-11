import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-file-upload',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {
route: string;
  constructor(public dialog: MatDialog,  @Inject(MAT_DIALOG_DATA) data, private router: Router) {
    this.route = data.route;
  }

  ngOnInit(): void {

  }

  
  Uploadfile() {
    this.dialog.closeAll();
  }

  closePopup() {
    this.dialog.closeAll();
  }
  cancel() {
    this.dialog.closeAll();
  }

}
