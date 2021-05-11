import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-extref-person-match',
  templateUrl: './extref-person-match.component.html',
  styleUrls: ['./extref-person-match.component.scss']
})
export class ExtrefPersonMatchComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ExtrefPersonMatchComponent>) { }

  close() {
  	this.dialogRef.close();
  }
  
  ngOnInit(): void {
  }

}
