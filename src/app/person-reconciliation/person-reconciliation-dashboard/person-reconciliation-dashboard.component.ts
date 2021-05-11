import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PersonReconciliationService } from '../services/person-reconciliation.service';
import * as customValidation from '../../_shared/constants/validation.constants';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MDMLookupPopupComponent } from '../mdm-lookup-popup/mdm-lookup-popup.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-person-reconciliation-dashboard',
  templateUrl: './person-reconciliation-dashboard.component.html',
  styleUrls: ['./person-reconciliation-dashboard.component.scss']
})
export class PersonReconciliationDashboardComponent implements OnInit, OnDestroy {

  prsnId = '';
  subscriptions$ = [];
  mdmLookupForm: FormGroup;
  customValidation = customValidation;
  constructor(private personReconciliationService: PersonReconciliationService,
              private formBuilder: FormBuilder,
              private toastr: ToastrService,
              private matDialog: MatDialog) { }

  ngOnInit() {
    this.mdmLookupForm = this.formBuilder.group({
      personId: ['', Validators.required]
    });
  }

  get f() {
    return this.mdmLookupForm.controls;
  }

  showMDMLookupPopup() {
    if (this.mdmLookupForm.valid) {
      const payload = {
        sourceSystemId: 'PERLSS',
        sourceRecipientId: this.mdmLookupForm.value.personId,
        requestSourceData: 'PERLSS',
        messageHeader: {
          referenceId: '10101',
          originatorId: 'ws-perlss',
          dateTimestamp: '2002-05-30T09:00:00'
        }
      };
      const MDMRecipientSubscriptions = this.personReconciliationService.getMDMRecipient(payload).subscribe(response => {
        if(response && response.errorCode) {
          this.toastr.error(response.errorCode[0].description);
        } 
        else {
          this.mdmLookupForm.reset();
          const dialogConfig = new MatDialogConfig();
          dialogConfig.disableClose = true;
          dialogConfig.autoFocus = true;
          dialogConfig.width = '625px';
          dialogConfig.height = '450px';
          dialogConfig.data = {
            recipient: response,
            personId: this.mdmLookupForm.value.personId
          };
          this.matDialog.open(MDMLookupPopupComponent, dialogConfig);
        }
      }, (error) => {
        this.toastr.error("There was an issue contacting MDM - please report to your system administrator.");
      });
      this.subscriptions$.push(MDMRecipientSubscriptions);
    }
  }

  ngOnDestroy() {
    if (this.subscriptions$ && this.subscriptions$.length > 0) {
      this.subscriptions$.forEach(subscription$ => subscription$.unsubscribe());
    }
  }

}
