import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-save-popup',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './savePopup.component.html',
  styleUrls: ['./savePopup.component.scss']
})

export class SavePopupComponent  {

  route: string;
  nextRoute: string;

  constructor(public dialog: MatDialog,  @Inject(MAT_DIALOG_DATA) data, private router: Router) {
      console.log('data====', data);
      this.route = data.route;
      this.nextRoute =  data.nextRoute;
   }

  cancel() {
    this.dialog.closeAll();
    if(this.nextRoute){
    this.router.navigate([this.nextRoute]);
    }
  }

  continue() {
    this.dialog.closeAll();
    this.router.navigate([this.route]);
  }
}
