import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.scss']
})
export class TaskDetailsComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<TaskDetailsComponent>,  @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
