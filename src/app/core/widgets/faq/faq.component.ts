import { Component, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-faq',  
  templateUrl: './faq.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./faq.component.scss']
})

export class FaqComponent {
  constructor(public dialog: MatDialog) { }

  faqClose() {
    this.dialog.closeAll();
  }
  
}
