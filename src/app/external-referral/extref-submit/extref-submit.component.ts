import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ReferralService } from '../../core/services/referral/referral.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RefSubmission } from '../../_shared/model/RefSubmission';
import { ReferralFlowSeq } from '../../_shared/utility/ReferralFlowSeq';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SavePopupComponent } from '../../savePopup/savePopup.component';
import * as customValidation from '../../_shared/constants/validation.constants';
import { CustomvalidationService } from '../../_shared/utility/customvalidation.service';
import { ExternalreferralService } from '../services/externalreferral.service';
import { ToastrService } from 'ngx-toastr';
import * as CryptoJS from 'crypto-js';
import * as Constants from '../../_shared/constants/application.constants';
@Component({
  selector: 'app-extref-submit',
  templateUrl: './extref-submit.component.html',
  styleUrls: ['./extref-submit.component.scss']
})
export class ExtrefSubmitComponent implements OnInit {

  @Output() completedSubmit: EventEmitter<any> = new EventEmitter<any>();
  event: string;
  submitted = false;
  pageId: string = 'PERSU';
  refSubmissionForm: FormGroup;
  customValidation = customValidation;
  livingArrangementType: any;
  submitterType: any;
  relation: any;
  enableNext = true;
  minDate: Date;
  maxDate: Date;
  today = new Date();
  startDate = new Date();
  showSpinner = false;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private referralService: ReferralService,
    private customValidator: CustomvalidationService,
    private dialog: MatDialog,
    private extRefService: ExternalreferralService,
    private toastr: ToastrService
  ) { }

  submitter: string;
  contactPerson: string;
  nextPath: string;
  ngOnInit(): void {
    const timeTravelData = localStorage.getItem('TIME_TRAVEL_DATA');
    if(timeTravelData) {
      const timeTravelDataJson = JSON.parse(CryptoJS.AES.decrypt(timeTravelData, Constants.APP_ENC_DECRYPT_KEY).toString(CryptoJS.enc.Utf8));
      console.log("timeTravelDataJson ", timeTravelDataJson);
      if(timeTravelDataJson.timeTravelFlag && timeTravelDataJson.currentDate) {
        this.startDate = new Date(timeTravelDataJson.currentDate);
      }
    }
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 119, 0, 1);
    this.maxDate = new Date();
    this.refSubmissionForm = this.fb.group({
      whoIsSubmittingCd: ['', [Validators.required]],
      relationshipCd: [''],
      expeditedReviewSw: [''],
      admissionDt: ['', [Validators.required]],
      planTrnstnDt: ['', [Validators.required, this.customValidator.dateInPast()]],
      refContactCd: ['', [Validators.required]],
      refContactName: ['', [Validators.required, this.customValidator.nameValidator()]],
      othRelationshipCd: [''],
      email: [''],
      phNum: [''],
      signature: ['', [Validators.required, this.customValidator.nameValidator()]],
      contactPerson: []

    });
    this.getSubmitter();
    this.getrelation();
    this.extRefService.stepReady(this.refSubmissionForm, "five");
  }


  getFormData() {
    return this.refSubmissionForm.controls;
  }

  onFocusOutEvent(event: any){
    console.log(event.target.value);
  
    const valid = this.today > event.target.value.split("/").pop();
    if(!valid){
     return  this.refSubmissionForm.controls['planTrnstnDt'].setErrors({ matDatepickerMin: true }); 
    }
    
    return null;
   
 }

  saveAndExit() {
    this.event = 'SaveAndExit';
    this.saveRefSubmission(true);
  }
  // showPopup() {
  //   const dialogConfig = new MatDialogConfig();
  //   dialogConfig.data = { route: 'ltss/referral' };
  //   dialogConfig.panelClass = 'exp_popup';
  //   dialogConfig.width = '600px';
  //   this.dialog.open(SavePopupComponent, dialogConfig);
  // }

  next() {
   this.submitted = true;
    this.event = 'Next';
    console.log(this.getFormData());
    if (this.refSubmissionForm.valid) {
      this.enableNext = false;
      this.showSpinner = true;
      this.saveRefSubmission();
    } else {
      this.toastr.error("PLease fill the necessary values")

    }
  }

  back() {
    const previousForm = 'PERCS';
    this.completedSubmit.emit(ReferralFlowSeq[previousForm]);
  }

  saveRefSubmission(showPopup?: boolean) {
    const refSubmission = new RefSubmission(null,
      this.getFormData().admissionDt.value,
      this.getFormData().email.value,
      this.getFormData().expeditedReviewSw.value,
      this.getFormData().othRelationshipCd.value,
      this.getFormData().phNum.value,
      this.getFormData().planTrnstnDt.value,
      this.getFormData().refContactCd.value,
      this.getFormData().refContactName.value,
      null,
      this.getFormData().relationshipCd.value,
      this.getFormData().signature.value,
      this.getFormData().whoIsSubmittingCd.value,
      'PERSU');


    const referralVO = this.extRefService.applicantInfoData$$.value;
    const contactInfoData = this.extRefService.contactInfoData$$.value;
    const schoolAndServiceData = this.extRefService.schoolWorkData$$.value;
    const careAndSupportData = this.extRefService.careSupportData$$.value;

    const reqBody = {
      referralVO,
      refAppContactDtlVO: contactInfoData,
      refSchAndWorkVO: schoolAndServiceData,
      refCareAndSupportVO: careAndSupportData,
      refSubmissionVO: refSubmission,
      reqPageId: ""
    };

    const ecfSlotDetails$ = this.extRefService.saveExtReferralSubmission(reqBody).subscribe(response => {
      if (response) {
      const META_DATA ={refId: response.refId}
      sessionStorage.setItem('ACTIVE_SESSION_DATA', CryptoJS.AES.encrypt(JSON.stringify(META_DATA), Constants.APP_ENC_DECRYPT_KEY).toString());
      this.router.navigate(['/externalreferral/extreferralConfirmation']);
      //  this.extRefService.refId$$.next(response.refId);
      //  this.extRefService.refId=response.refId;

        // if (showPopup) {
        //   this.showPopup();
        // } else {
        //   //this.extRefService.refId=response.refId;
        //   const that = this;
        //   if (that.event === 'Next') {
        //     that.router.navigate(['/externalreferral/extreferralConfirmation']);
        //   }
        // }
      }
    });
   
   
  }

  get f() {
    return this.refSubmissionForm.controls;
  }

  onSelect(event) {
    this.livingArrangementType = this.extRefService.livingArrangementType$$.value;
    this.submitter = event.value;
    this.getFormData().refContactName.setValue(null);
    this.getFormData().refContactName.markAsUntouched();
    this.getFormData().relationshipCd.setValue(null);
    this.getFormData().relationshipCd.markAsUntouched();
    this.getFormData().expeditedReviewSw.setValue(null);
    this.getFormData().expeditedReviewSw.markAsUntouched();
    this.getFormData().email.setValue(null);
    this.getFormData().email.markAsUntouched();
    this.getFormData().phNum.setValue(null);
    this.getFormData().phNum.markAsUntouched();
    this.getFormData().othRelationshipCd.setValue(null);
    this.getFormData().othRelationshipCd.markAsUntouched();
    this.getFormData().refContactCd.setValue(null);
    this.getFormData().refContactCd.markAsUntouched();
    this.getFormData().refContactName.updateValueAndValidity();
    this.getFormData().relationshipCd.updateValueAndValidity();
    this.getFormData().expeditedReviewSw.updateValueAndValidity();
    this.getFormData().email.updateValueAndValidity();
    this.getFormData().phNum.updateValueAndValidity();
    this.getFormData().othRelationshipCd.updateValueAndValidity();
    this.getFormData().refContactCd.updateValueAndValidity();
    if (event.value === 'FM' || event.value === 'OTHR') {
      this.setFamilyValidations();
    } else if (event.value === 'MCO' && this.livingArrangementType === "RMH") {
      this.setMcoValidations();
      this.clearFamilyValidations();     
    }
    else {
      this.clearSelfValidation();
    }
  }

  setFamilyValidations() {
    this.refSubmissionForm.get('relationshipCd').setValidators(Validators.required);
    this.refSubmissionForm.get('refContactName').setValidators(Validators.required);
    this.refSubmissionForm.get('othRelationshipCd').setValidators(Validators.required);
    this.refSubmissionForm.get('phNum').setValidators([Validators.required,
    Validators.maxLength(10), this.customValidator.phonenumberValidator()]);
    this.refSubmissionForm.get('relationshipCd').updateValueAndValidity();
    this.refSubmissionForm.get('refContactName').updateValueAndValidity();
    this.refSubmissionForm.get('othRelationshipCd').updateValueAndValidity();
    this.refSubmissionForm.get('phNum').updateValueAndValidity();
  }
  clearFamilyValidations() {
    this.refSubmissionForm.get('relationshipCd').clearValidators();
    this.refSubmissionForm.get('refContactName').clearValidators();
    this.refSubmissionForm.get('othRelationshipCd').clearValidators();
    this.refSubmissionForm.get('phNum').clearValidators();
    this.refSubmissionForm.get('relationshipCd').updateValueAndValidity();
    this.refSubmissionForm.get('refContactName').updateValueAndValidity();
    this.refSubmissionForm.get('othRelationshipCd').updateValueAndValidity();
    this.refSubmissionForm.get('phNum').updateValueAndValidity();

  }
  setMcoValidations() {
    this.refSubmissionForm.get('expeditedReviewSw').setValidators(Validators.required);
    this.refSubmissionForm.get('admissionDt').setValidators(Validators.required);
    this.refSubmissionForm.get('planTrnstnDt').setValidators(Validators.required);
    this.refSubmissionForm.get('expeditedReviewSw').updateValueAndValidity();
    this.refSubmissionForm.get('admissionDt').updateValueAndValidity();
    this.refSubmissionForm.get('planTrnstnDt').updateValueAndValidity();
  }
  clearMcoValidations() {
    this.refSubmissionForm.get('expeditedReviewSw').clearValidators();
    this.refSubmissionForm.get('admissionDt').clearValidators();
    this.refSubmissionForm.get('planTrnstnDt').clearValidators();
    this.refSubmissionForm.get('expeditedReviewSw').updateValueAndValidity();
    this.refSubmissionForm.get('admissionDt').updateValueAndValidity();
    this.refSubmissionForm.get('planTrnstnDt').updateValueAndValidity();
  }

  clearSelfValidation() {
    this.clearFamilyValidations();
    this.clearMcoValidations();
  }

  getSubmitter(): any {
    this.extRefService.getSearchDropdowns('WHO_IS_SUBMITTING').subscribe(res => {
      this.submitterType = res;
    });
  }
  getrelation(): any {
    this.extRefService.getSearchDropdowns('RELATIONSHIP').subscribe(res => {
      this.relation = res;
    });
  }

  onContactPersonSelect(event) {
    this.contactPerson = event.value;
    if(this.contactPerson === 'SE'){
      this.getFormData().refContactName.setValue(null);
      this.getFormData().refContactName.markAsUntouched();
      this.getFormData().refContactName.clearValidators();
      this.getFormData().email.setValue(null);
      this.getFormData().email.markAsUntouched();
      this.getFormData().email.clearValidators();
      this.getFormData().phNum.setValue(null);
      this.getFormData().phNum.markAsUntouched();
      this.getFormData().phNum.clearValidators();
      // this.getFormData().othRelationshipCd.setValue(null);
      // this.getFormData().othRelationshipCd.markAsUntouched();
    }
    else if(this.contactPerson === 'OTH'){
      this.getFormData().refContactName.setValidators([Validators.required,this.customValidator.nameValidator()]);
      this.getFormData().email.setValidators([this.customValidator.emailValidator()]);
      this.getFormData().phNum.setValidators([Validators.required, Validators.maxLength(10), this.customValidator.phonenumberValidator()]);
    }
    this.getFormData().refContactName.updateValueAndValidity();
    this.getFormData().email.updateValueAndValidity();
    this.getFormData().phNum.updateValueAndValidity();
    // this.getFormData().othRelationshipCd.updateValueAndValidity();
  }
}
