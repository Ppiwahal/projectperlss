import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChangeManagementService } from 'src/app/core/services/change-management/change-management.service';
import * as customValidation from '../../_shared/constants/validation.constants';
import { CompleteReferral } from 'src/app/_shared/model/change-management/completeReferral';
import { Subscription } from 'rxjs';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { RightnavToggleService } from 'src/app/_shared/services/rightnav-toggle.service';
import { UploadDocumentsPopupComponent } from '../../rightnav/upload-documents-popup/upload-documents-popup.component';
import { PaeDocumentSummaryService } from 'src/app/core/services/pae/pae-document-Summary/pae-document-summary.service';
import { Router } from '@angular/router';
import { ReferralService } from 'src/app/core/services/referral/referral.service';


@Component({
  selector: 'app-cm-complete-referral',
  templateUrl: './cm-complete-referral.component.html',
  styleUrls: ['./cm-complete-referral.component.scss']
})
export class CmCompleteReferralComponent implements OnInit, OnDestroy {
  customValidation = customValidation;
  submitted = false;
  refrralForm: FormGroup;
  personData: any;
  document = false;
  ismedUploaded = false;
  subscribed: Array<Subscription> = [];
  subscriptions$: any[] = [];
  constructor(private fb: FormBuilder, private router: Router, private changeManagementService: ChangeManagementService, private rightnavToggleService: RightnavToggleService, private paeDocummentSummaryService: PaeDocumentSummaryService,
    private refService: ReferralService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.refrralForm = this.fb.group({
      commentTxt: [''],
    });
    this.subscribed.push(
      this.changeManagementService.personData$.subscribe(personData => {
        this.personData = personData;
        if (this.personData.refStatus === 'TP') {
          this.document = true;
        } else {
          this.document = false;
        }

      })
    );
  }
  getFormData() {
    return this.refrralForm.controls;
  }
  onProceed() {
    this.submitted = true;
    const localStorageLocal = localStorage.getItem('APP_STORAGE_TOKEN');
    const userId = JSON.parse(localStorageLocal).userName;
    const entityId = JSON.parse(localStorageLocal).entityId;
    const entityTypeCd = JSON.parse(localStorageLocal).entityTypeCd;
    if (this.refrralForm.valid) {
      const completeReferral = new CompleteReferral(
        'CRFI',
        this.getFormData().commentTxt.value,
        entityTypeCd,
        this.personData.personId,
        this.personData.refId,
        userId,
      );

      const completeReferralSubscriptions = this.changeManagementService.submitReferral(completeReferral).subscribe((res) => {
        this.refService.setRefId(res['refId']);
        this.refService.setChmTypeCd(res['chmTypeCd']);
        this.refService.setTaskQueue('0');
        this.refService.setTaskId('0');
        this.refService.setRowElement({ taskQueue: 0, personId: this.personData.personId })
        this.router.navigate(['/ltss/referral/referralIntakeActions']);
      });
      this.subscriptions$.push(completeReferralSubscriptions);


    }
  }
  openUploadDocument() {
    this.rightnavToggleService.emitToRightNavComp$.next('UPLOAD_DOC');
  }

  uploadDocument() {
    this.openUploadDocument();
    console.log('upload document');
  }
  getDocumentData() {
    const documentSubscriptions = this.paeDocummentSummaryService.getDocumentSummary(this.personData.refId)
      .subscribe((response) => {
        console.log(response);
        console.log(response[0].documentType);
        console.log(response.length);
        for (let i = 0; i <= response.length; i++) {
          // console.log(response[i].documentType);
          if (response[i].documentType[0]) {
            this.ismedUploaded = true;
          }
        }
      });
    this.subscriptions$.push(documentSubscriptions);


  }
  ngOnDestroy() {
    if (this.subscriptions$ && this.subscriptions$.length > 0) {
      this.subscriptions$.forEach(subscription$ => subscription$.unsubscribe());
    }
  }

}
