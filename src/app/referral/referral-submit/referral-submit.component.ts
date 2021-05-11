import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ReferralService } from '../../core/services/referral/referral.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RefSubmission } from '../../_shared/model/RefSubmission';
import { HttpResponse } from '@angular/common/http';
import { ReferralFlowSeq } from '../../_shared/utility/ReferralFlowSeq';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SavePopupComponent } from '../../savePopup/savePopup.component';
import * as customValidation from '../../_shared/constants/validation.constants';
import { CustomvalidationService } from '../../_shared/utility/customvalidation.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-referral-submit',
  templateUrl: './referral-submit.component.html',
  styleUrls: ['./referral-submit.component.scss']
})
export class ReferralSubmitComponent implements OnInit {
  @Output() completedSubmit: EventEmitter<any> = new EventEmitter<any>();
  pageId: string = 'PERSU';
  event: string;
  refSubmissionForm: FormGroup;
  customValidation = customValidation;

  toastrBack = false;
  enableNext = true;
  showSpinner = false;
  isSamePageNavigation: boolean;
  toastRef: any;
  submittingList = [
    {code: 'NO', value:'None',activateSW:'Y'},
    {code: 'SE', value:'Self (person who wants services)',activateSW:'Y'},
    {code: 'FR', value:'Friend',activateSW:'Y'},
    {code: 'CLR', value:'Conservator or legal representative',activateSW:'Y'},
    {code: 'FM', value:'Family Member',activateSW:'Y'},
    {code: 'DI', value:'DIDD',activateSW:'Y'},
    {code: 'MCO', value:'MCO',activateSW:'Y'},
    {code: 'DCS', value:'Department of Child Services',activateSW:'Y'},
    {code: 'APS', value:'APS',activateSW:'Y'},
    {code: 'RM', value:'RMHI',activateSW:'Y'},
    {code: 'SP', value:'Service Provider',activateSW:'Y'},
    {code: 'OTH', value:'Other',activateSW:'Y'}
  ];
  relationshipList = [
    {code: 'AUN', value:'Aunt',activateSW:'Y'},
    {code: 'BRO', value:'Brother',activateSW:'Y'},
    {code: 'DAU', value:'Daughter',activateSW:'Y'},
    {code: 'FAO', value:'Father',activateSW:'Y'},
    {code: 'FCO', value:'First cousin',activateSW:'Y'},
    {code: 'GDO', value:'Granddaughter',activateSW:'Y'},
    {code: 'GFO', value:'Grandfather',activateSW:'Y'},
    {code: 'GMO', value:'Grandmother',activateSW:'Y'},
    {code: 'MOO', value:'Mother',activateSW:'Y'},
    {code: 'NEP', value:'Nephew',activateSW:'Y'},
    {code: 'NIE', value:'Niece',activateSW:'Y'},
    {code: 'NRT', value:'Not related',activateSW:'Y'},
    {code: 'SON', value:'Son',activateSW:'Y'},
    {code: 'SBR', value:'Stepbrother',activateSW:'Y'},
    {code: 'SDA', value:'Stepdaughter',activateSW:'Y'},
    {code: 'SFA', value:'Stepfather',activateSW:'Y'},
    {code: 'SPO', value:'Spouse',activateSW:'Y'},
    {code: 'SMO', value:'Stepmother',activateSW:'Y'},
    {code: 'SSI', value:'Stepsister',activateSW:'Y'},
    {code: 'SSO', value:'Stepson',activateSW:'Y'},
    {code: 'UNC', value:'Uncle',activateSW:'Y'},
    {code: 'RIO', value:'Related in another way',activateSW:'Y'},
    {code: 'SIS', value:'Sister',activateSW:'Y'},
    {code: 'GSO', value:'Grandson',activateSW:'Y'},
    {code: 'HOS', value:'Holding out spouse',activateSW:'Y'}
  ];
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private referralService: ReferralService,
    private customValidator: CustomvalidationService,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) { }

  submitter: string;
  contactPerson: string;
  nextPath: string;
  currentLivingArrengment: string;

  ngOnInit(): void {
    this.refSubmissionForm = this.fb.group({
      whoIsSubmittingCd: ['', [Validators.required]],
      relationshipCd: ['',  [Validators.required]],
      expeditedReviewSw: [''],
      admissionDt:[''],
      planTrnstnDt: [''],
      whoToCntctCd: ['', [Validators.required]],
      refCntctName: [''],
      othRelationshipCd: [''],
      email: [''],
      phNum: [''],
      signature: ['', [Validators.required]]
    });
    if(this.referralService.getRefId() !== null && this.referralService.getRefId() !== undefined){
      this.dataPatchup();
    }
    this.currentLivingArrengment = this.referralService.getCurrentLivingArrangementCd();
  }

  dataPatchup(){
    const loadData = this.referralService.getRefSubmitDetails(this.referralService.getRefId(), this.pageId)
    .then(response => {
      let receivedData = response;
      console.log("receivedData" + JSON.stringify(receivedData));
      this.refSubmissionForm.patchValue(receivedData.body);
    });
  }

  getFormData() {
    return this.refSubmissionForm.controls;
  }

  showPopup() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = { route: 'ltss/referral' };
    dialogConfig.panelClass = 'exp_popup';
    dialogConfig.width = '600px';
    this.dialog.open(SavePopupComponent, dialogConfig);
  }

  next() {
    this.isSamePageNavigation =  true;
    this.event = 'Next';
    console.log(this.getFormData());
    if (this.refSubmissionForm.valid) {
      this.enableNext = false;
      this.showSpinner = true;
      this.saveRefSubmission();
    }
  }

  back() {
    console.log(this.refSubmissionForm);
    const previousForm = 'PERCS';
    if (this.refSubmissionForm.touched) {
      this.toastRef = this.toastr.warning(this.customValidation.C1, '', {
        tapToDismiss: true,
        disableTimeOut: true,
        positionClass: 'toast-top-full-width',
      });
      if (this.toastrBack) {
        this.toastr.clear(this.toastRef.ToastId);

        this.completedSubmit.emit(ReferralFlowSeq[previousForm]);
        this.refSubmissionForm.reset();
        this.toastrBack = false;
      }
      this.toastrBack = true;
    }
    if (!this.refSubmissionForm.touched) {
      this.completedSubmit.emit(ReferralFlowSeq[previousForm]);
      this.toastrBack = false;
    }
  }

  saveRefSubmission(showPopup?: boolean) {
    this.isSamePageNavigation =  true;
    const refId = this.referralService.getRefId();
    const refSubmission = new RefSubmission(
      null,
      this.getFormData().admissionDt.value,
      this.getFormData().email.value,
      this.getFormData().expeditedReviewSw.value,
      this.getFormData().othRelationshipCd.value,
      this.getFormData().phNum.value,
      this.getFormData().planTrnstnDt.value,
      this.getFormData().whoToCntctCd.value,
      this.getFormData().refCntctName.value,
      refId,
      this.getFormData().relationshipCd.value,
      this.getFormData().signature.value,
      this.getFormData().whoIsSubmittingCd.value,
      'PERSU');

   // this.referralService.saveReferralSubmission(refSubmission);
    const response = this.referralService.saveReferralSubmission(refSubmission);
    let nextPage = '';
    const that = this;
    response.then(function(response: HttpResponse<any>) {
      that.enableNext = true;
		  that.showSpinner = false;
      if (showPopup) {
        that.showPopup();
      } else {
      nextPage = response.headers.get('next');
      response = response.body;
      that.nextPath = ReferralFlowSeq[nextPage];
      if (that.event === 'Next') {
         that.router.navigate(['/ltss/referral/' + that.nextPath]);
        }
      }
    });
  }

  get f() {
    return this.refSubmissionForm.controls;
  }

  onSelect(event){
    this.submitter = event.value;
    this.getFormData().refCntctName.setValue(null);
    this.getFormData().refCntctName.markAsUntouched();
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
    this.getFormData().whoToCntctCd.setValue(null);
    this.getFormData().whoToCntctCd.markAsUntouched();
    this.getFormData().refCntctName.updateValueAndValidity();
    this.getFormData().relationshipCd.updateValueAndValidity();
    this.getFormData().expeditedReviewSw.updateValueAndValidity();
    this.getFormData().email.updateValueAndValidity();
    this.getFormData().phNum.updateValueAndValidity();
    this.getFormData().othRelationshipCd.updateValueAndValidity();
    this.getFormData().whoToCntctCd.updateValueAndValidity();
    if (event.value === 'FM'  || event.value === 'OTH'){
        this.setFamilyValidations();
        } else if (event.value === 'MCO') {
        this.setMcoValidations();
        this.clearSelfValidation();
        }
        else {
          this.clearSelfValidation();
        }
  }

  setFamilyValidations(){
    this.refSubmissionForm.get('relationshipCd').setValidators(Validators.required);
    // this.refSubmissionForm.get('refCntctName').setValidators(Validators.required);
    // this.refSubmissionForm.get('othRelationshipCd').setValidators(Validators.required);
    // this.refSubmissionForm.get('phNum').setValidators([Validators.required,
      // Validators.maxLength(10), this.customValidator.phonenumberValidator()]);
    this.refSubmissionForm.get('relationshipCd').updateValueAndValidity();
    // this.refSubmissionForm.get('refCntctName').updateValueAndValidity();
    // this.refSubmissionForm.get('othRelationshipCd').updateValueAndValidity();
    // this.refSubmissionForm.get('phNum').updateValueAndValidity();
  }
  clearFamilyValidations(){
    this.refSubmissionForm.get('relationshipCd').clearValidators();
    // this.refSubmissionForm.get('refCntctName').clearValidators();
    // this.refSubmissionForm.get('othRelationshipCd').clearValidators();
    // this.refSubmissionForm.get('phNum').clearValidators();
    this.refSubmissionForm.get('relationshipCd').updateValueAndValidity();
    // this.refSubmissionForm.get('refCntctName').updateValueAndValidity();
    // this.refSubmissionForm.get('othRelationshipCd').updateValueAndValidity();
    // this.refSubmissionForm.get('phNum').updateValueAndValidity();

  }
  setMcoValidations(){
    this.refSubmissionForm.get('expeditedReviewSw').setValidators(Validators.required);
    this.refSubmissionForm.get('admissionDt').setValidators(Validators.required);
    this.refSubmissionForm.get('planTrnstnDt').setValidators(Validators.required);
    this.refSubmissionForm.get('expeditedReviewSw').updateValueAndValidity();
    this.refSubmissionForm.get('admissionDt').updateValueAndValidity();
    this.refSubmissionForm.get('planTrnstnDt').updateValueAndValidity();
  }
  clearMcoValidations(){
    this.refSubmissionForm.get('expeditedReviewSw').clearValidators();
    this.refSubmissionForm.get('admissionDt').clearValidators();
    this.refSubmissionForm.get('planTrnstnDt').clearValidators();
    this.refSubmissionForm.get('expeditedReviewSw').updateValueAndValidity();
    this.refSubmissionForm.get('admissionDt').updateValueAndValidity();
    this.refSubmissionForm.get('planTrnstnDt').updateValueAndValidity();

  }

  clearSelfValidation(){
    this.clearFamilyValidations();
    this.clearMcoValidations();
  }

  onContactPersonSelect(event){
    this.contactPerson = event.value;
    if(this.contactPerson === 'SLF'){
      this.getFormData().refCntctName.setValue(null);
      this.getFormData().refCntctName.markAsUntouched();
      this.getFormData().refCntctName.clearValidators();
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
      this.getFormData().refCntctName.setValidators(Validators.required);
      this.getFormData().email.setValidators([this.customValidator.emailValidator()]);
      this.getFormData().phNum.setValidators([Validators.required, Validators.maxLength(10), this.customValidator.phonenumberValidator()]);
    }
    this.getFormData().refCntctName.updateValueAndValidity();
    this.getFormData().email.updateValueAndValidity();
    this.getFormData().phNum.updateValueAndValidity();
    // this.getFormData().othRelationshipCd.updateValueAndValidity();
  }
}