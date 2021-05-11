import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaeService } from '../../core/services/pae/pae.service';
import { PaeCommonService } from './../../core/services/pae/pae-common/pae-common.service';
import * as customValidation from '../../_shared/constants/validation.constants';
import { CustomvalidationService } from '../../_shared/utility/customvalidation.service';
import { PaeTransportationSpeciality } from 'src/app/_shared/model/PaeTransportationSpeciality';
import { PaeAdditionalBehavioural } from 'src/app/_shared/model/PaeAdditionalBehavioral';
import { MatRadioChange } from '@angular/material/radio';
import { Router } from '@angular/router';
import { LeavePagePopupComponent } from 'src/app/leave-page-popup/leave-page-popup.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SavePopupComponent } from 'src/app/savePopup/savePopup.component';
import { PaeFlowSeq } from 'src/app/_shared/utility/PaeFlowSeq';
import { ComponentCanDeactivate } from 'src/app/core/helpers/pending-change.guard';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-pae-additional-behavioral-qualifiers',
  templateUrl: './pae-additional-behavioral-qualifiers.component.html',
  styleUrls: ['./pae-additional-behavioral-qualifiers.component.scss']
})
export class PaeAdditionalBehavioralQualifiersComponent implements OnInit, ComponentCanDeactivate {
  myForm: FormGroup;
  event: string;
  reqPageId: string;
  paeId = 'PAE1000007';
  customValidation = customValidation;
  submitted = false;
  transportSelected = false;
  transportNoneSelected = false;
  transportCheckboxSelectedCount = 0;
  id: string;
  reqPsychatricTreatSw: boolean;
  pageId: string;
  isSamePageNavigation: boolean;
  applicantName: any;

  constructor(private fb: FormBuilder,
    private customValidator: CustomvalidationService,
    private paeService: PaeService,
    private paeCommonService: PaeCommonService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.pageId = this.paeCommonService.paeId;
    this.myForm = this.fb.group({
      reqPsychatricTreatSw: ['', Validators.required],
      engageSelfInjPhyAgrSw: ['', Validators.required],
      createdBy: [null],
      createdDt: [null],
      lastModifiedBy: [null],
      lastModifiedDt: [null],
      recordVersion: [null],
      archivedDt: [null]
    });

    if (this.paeCommonService.getApplicantName() === null || this.paeCommonService.getApplicantName() === ''
    || this.paeCommonService.getApplicantName() === undefined){
      this.getApplicantName();
    } else {
      this.applicantName =  this.paeCommonService.getApplicantName();
    }
   }

   getApplicantName(){
    this.paeService.getPaeApplicantInformation(this.paeCommonService.getPaeId(), this.pageId).then((response) => {
      console.log('reponseforName' + JSON.stringify(response.body.firstName));
      this.applicantName =  response.body.firstName + ' ' + response.body.lastName;
      this.paeCommonService.setApplicantName(this.applicantName);
    });
  }

  getFormData() {
    return this.myForm.controls;
  }

  savePaeAdditionalQualifier(eventType) {
    this.submitted = true;
    this.reqPageId = 'PPPNTF';
    if (this.myForm.valid) {
      const paeAdditionalBehavioural = new PaeAdditionalBehavioural(
        this.reqPageId,
        null,
        this.paeId,
        this.getFormData().reqPsychatricTreatSw.value,
        this.getFormData().engageSelfInjPhyAgrSw.value,
        null,
        null,
        null,
        null,
        null,
        null

      );
      this.paeService.savePaeAdditionalQualifier(paeAdditionalBehavioural).then((res) => {
        if (res.status === 200) {
          if (eventType !== 'Next') {
            const dialogConfig = new MatDialogConfig();
            dialogConfig.data = { route: '/ltss/pae' };
            dialogConfig.panelClass = 'exp_popup';
            dialogConfig.width = '648px';
            dialogConfig.height = '360px';

            this.dialog.open(SavePopupComponent, dialogConfig);
          } else {
            this.router.navigate(['/ltss/pae/paeStart/aggressiveBehavior'])
          }
        }
      });
    }

    console.log(this.paeId);
  }

  onChange(mrChange: MatRadioChange) {
    if (mrChange.value === 'no') {
      this.reqPsychatricTreatSw = false;
      this.myForm.get('reqPsychatricTreatSw').clearValidators();
    }
    else if (mrChange.value === 'yes') {
      this.reqPsychatricTreatSw = true;
      this.myForm.get('reqPsychatricTreatSw').setValidators(Validators.required);
    }
  }

  next() {
    this.isSamePageNavigation =  true;
    this.event = 'Next';
    this.submitted = true;
    console.log('this.myForm.valid===', this.myForm.valid);
    if (this.myForm.valid) {
      this.savePaeAdditionalQualifier(this.event);
    }
    console.log(this.myForm);
  }
  goBack() {
    this.isSamePageNavigation =  true;
    this.paeService.getChidPageNavigation(this.paeId, this.pageId).subscribe(response => {
      const backPath = PaeFlowSeq[response.prevPageId];
      const path = '/ltss/pae/paeStart/' + backPath;
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = { route: path };
      dialogConfig.panelClass = 'exp_popup';
      dialogConfig.width = '600px';
      this.dialog.open(LeavePagePopupComponent, dialogConfig);
    })
  }
  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    console.log(this.myForm) 
   return this.isSamePageNavigation ? true : !this.myForm.dirty;
  }

  resetForm(){
    this.myForm.reset();
  }
}
