import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ContactComponent } from '../contact/contact.component';
import { FaqComponent } from '../faq/faq.component';
import { FormComponent } from '../form/form.component';
import { WorkflowAnalyticsPopupComponent } from '../workflow-analytics-popup/workflow-analytics-popup.component';

@Component({
  selector: 'app-widgets',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './widgets.component.html',
  styleUrls: ['./widgets.component.scss']
})
export class WidgetsComponent implements OnInit {

  constructor(private dialog: MatDialog,
              private matDialogRef: MatDialogRef<WidgetsComponent>) { }

  ngOnInit(): void {
  }

  openFaq(): void {
    this.dialog.open(FaqComponent, {
      width: 'auto',
      height: 'auto',
      panelClass: 'exp_popup'
    });
  }

  openContact() {
    this.dialog.open(ContactComponent, {
      width: 'auto',
      height: 'auto',
      panelClass: 'exp_popup'
    });
    this.matDialogRef.close();
  }

  openForms() {
    this.dialog.open(FormComponent, {
      width: '600px',
      autoFocus: false
      // height: '400px'
    });
    this.matDialogRef.close();
  }
  openAnalytics(){
    this.dialog.open(WorkflowAnalyticsPopupComponent, {
      width: '990px',
      // height: '400px'
    });
    this.matDialogRef.close();

  }
}
