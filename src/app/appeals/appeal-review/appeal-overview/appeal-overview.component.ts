import { Component, OnInit, OnDestroy, EventEmitter, Output, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppealService } from '../../services/appeal.service';
import * as customValidation from '../../../_shared/constants/validation.constants';
import * as Constants from '../../../_shared/constants/application.constants';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-appeal-overview',
  templateUrl: './appeal-overview.component.html',
  styleUrls: ['./appeal-overview.component.scss']
})
export class AppealOverviewComponent implements OnInit, OnDestroy {
  customValidation = customValidation;
  appealTimeDetails: any[] = [];
  exceptionReasonDetails: any[] = [];
  subscriptions$:any[] = [];
  issueCOBDetails: any[] = [];
  radioOptions: any[] =  [{code:'Y', value:'Submit for Appeals Nurse Review'},{code:'N', value:'Continue with Appeals Review'}];
  appealOverViewDetailsForm: FormGroup;
  showEreason:string = '';
  progReqForCob: any;
  showCobDetails: any;
  showDisenrollDetails: boolean = false;
  @Input() appealType: any;
  enrolledInAnotProg: boolean = true;
  @Input() appealReviewOnLoad: any;
  @Output() emitSaveAppealOverview: EventEmitter<any> = new EventEmitter<any>();
  showCOB: boolean;
  showOptions: boolean;
  @Input() programTypeCd: any;
  submitted: boolean;
  startDate = new Date();

  constructor(private formBuilder: FormBuilder, private appealService: AppealService) { }

  ngOnInit(): void {

    const timeTravelData = localStorage.getItem('TIME_TRAVEL_DATA');
    if(timeTravelData) {
      const timeTravelDataJson = JSON.parse(CryptoJS.AES.decrypt(timeTravelData, Constants.APP_ENC_DECRYPT_KEY).toString(CryptoJS.enc.Utf8));
      console.log("timeTravelDataJson ", timeTravelDataJson);
      if(timeTravelDataJson.timeTravelFlag && timeTravelDataJson.currentDate) {
        this.startDate = new Date(timeTravelDataJson.currentDate);
      }
    }

    const appealTimelySub$ =  this.appealService.getAppealDropdowns('APPEAL_TIMELY').subscribe(res => {
      this.appealTimeDetails = res;
    });
    this.subscriptions$.push(appealTimelySub$)
    const exceptionReasonSub$ =  this.appealService.getAppealDropdowns('EXCEPTION_REASON').subscribe(res => {
      this.exceptionReasonDetails = res;
    });
    this.subscriptions$.push(exceptionReasonSub$)
    const yesOrNoSub$ =  this.appealService.getAppealDropdowns('YES_NO').subscribe(res => {
      this.issueCOBDetails = res;
    });
    this.subscriptions$.push(yesOrNoSub$)
    const progReqFrCob$ =  this.appealService.getAppealDropdowns('GROUP_NAME').subscribe(res => {
      this.progReqForCob = res;
    });
    this.subscriptions$.push(progReqFrCob$)
    this.initializeAppealOverviewForm();
  }

  ngOnChanges(){
    if(this.appealType && this.appealReviewOnLoad){
      console.log(this.programTypeCd);
      let passrReasonCd: any;
       if(this.appealReviewOnLoad?.linkedRecordPasVO !== null){
        passrReasonCd = this.appealReviewOnLoad.linkedRecordPasVO.pasrrRsnCd;
       }
      if(this.appealType == 'PA' || this.appealType == 'DE' || 
         (this.appealType == "PR" && (passrReasonCd == 'LC' || passrReasonCd == 'NC'))){
          this.showCOB = true;
      } else {
        this.showCOB = false;
      }
      if(this.appealReviewOnLoad.appealReviewOverviewResponseVO){
        this.onAppealTimelyChange(this.appealReviewOnLoad.appealReviewOverviewResponseVO.aplReviewOverviewVO.aplTimelyCd)
        this.appealOverViewDetailsForm.controls['appealTimelyDetail'].setValue(this.appealReviewOnLoad.appealReviewOverviewResponseVO.aplReviewOverviewVO.aplTimelyCd);
        this.appealOverViewDetailsForm.controls['exceptionReasons'].setValue(this.appealReviewOnLoad.appealReviewOverviewResponseVO.aplReviewOverviewVO.excpRsnCd);
        this.appealOverViewDetailsForm.controls['issueCOB'].setValue(this.appealReviewOnLoad.appealReviewOverviewResponseVO.aplReviewOverviewVO.issueCobSw);
        this.appealOverViewDetailsForm.controls['radioButtonSelected'].setValue(this.appealReviewOnLoad.appealReviewOverviewResponseVO.aplReviewOverviewVO.submitAnrSw);
        this.onCobChange(this.appealReviewOnLoad.appealReviewOverviewResponseVO.aplReviewOverviewVO.issueCobSw)
        if(this.appealReviewOnLoad.appealReviewOverviewResponseVO.aplReviewOverviewVO.issueCobSw === 'Y'){
          this.appealOverViewDetailsForm.controls['disenrollFrnEnrPrg'].setValue(this.appealReviewOnLoad.appealReviewOverviewResponseVO.aplReviewOverviewCobVO.cobDisenrSw);
          this.appealOverViewDetailsForm.controls['progReqFrCob'].setValue(this.appealReviewOnLoad.appealReviewOverviewResponseVO.aplReviewOverviewCobVO.cobProgramCd);
          this.appealOverViewDetailsForm.controls['cobStartDate'].setValue(this.appealReviewOnLoad.appealReviewOverviewResponseVO.aplReviewOverviewCobVO.cobStartDt);
          this.appealOverViewDetailsForm.controls['cobCreationReason'].setValue(this.appealReviewOnLoad.appealReviewOverviewResponseVO.aplReviewOverviewCobVO.rsnCobCretn);
        }
      }
    }
  }

 initializeAppealOverviewForm(){
  this.appealOverViewDetailsForm = this.formBuilder.group({
    appealTimelyDetail:[null, Validators.required],
    exceptionReasons:[null],
    issueCOB:[null],
    cobStartDate:[null],
    progReqFrCob:[null],
    cobCreationReason:[null],
    disenrollFrnEnrPrg:[null],
    radioButtonSelected:[null]
  })
 }

 onAppealTimelyChange(value){
     this.showEreason = value;
     this.showOptions = true;
     this.appealOverViewDetailsForm.get('exceptionReasons').setValidators([Validators.required]);
     this.appealOverViewDetailsForm.get('issueCOB').setValidators(null);
     this.appealOverViewDetailsForm.get('radioButtonSelected').setValidators(null);
     this.appealOverViewDetailsForm.get('exceptionReasons').setValidators(null);
     this.appealOverViewDetailsForm.get('cobStartDate').setValidators(null);
     this.appealOverViewDetailsForm.get('progReqFrCob').setValidators(null);
     this.appealOverViewDetailsForm.get('cobCreationReason').setValidators(null);
     this.appealOverViewDetailsForm.get('disenrollFrnEnrPrg').setValidators(null);
     if(value === 'Y'){
      if(this.showCOB){
        this.appealOverViewDetailsForm.get('issueCOB').setValidators([Validators.required]);
      }
      this.appealOverViewDetailsForm.get('radioButtonSelected').setValidators([Validators.required]);
      
    } else if(value === 'GC'){
      if(this.showCOB){
        this.appealOverViewDetailsForm.get('issueCOB').setValidators([Validators.required]);
      }
      this.appealOverViewDetailsForm.get('exceptionReasons').setValidators([Validators.required]);
      this.appealOverViewDetailsForm.get('radioButtonSelected').setValidators([Validators.required]);
      
    } else if(value === 'N'){
      this.showOptions = false;
    }
     this.appealOverViewDetailsForm.get('issueCOB').updateValueAndValidity();
     this.appealOverViewDetailsForm.get('radioButtonSelected').updateValueAndValidity();
     this.appealOverViewDetailsForm.get('exceptionReasons').updateValueAndValidity();
     this.appealOverViewDetailsForm.get('cobStartDate').updateValueAndValidity();
     this.appealOverViewDetailsForm.get('progReqFrCob').updateValueAndValidity();
     this.appealOverViewDetailsForm.get('cobCreationReason').updateValueAndValidity();
     this.appealOverViewDetailsForm.get('disenrollFrnEnrPrg').updateValueAndValidity();       
 }

 onCobChange(value){
  this.showCobDetails = value;
  if(value === 'Y'){
    this.appealOverViewDetailsForm.get('progReqFrCob').setValidators([Validators.required]);
    this.appealOverViewDetailsForm.get('cobStartDate').setValidators([Validators.required]);
    this.appealOverViewDetailsForm.get('cobCreationReason').setValidators([Validators.required]);
  } else {
    this.appealOverViewDetailsForm.get('progReqFrCob').setValidators(null);
    this.appealOverViewDetailsForm.get('cobStartDate').setValidators(null);
    this.appealOverViewDetailsForm.get('cobCreationReason').setValidators(null);
  }
  this.appealOverViewDetailsForm.get('cobStartDate').updateValueAndValidity();
  this.appealOverViewDetailsForm.get('progReqFrCob').updateValueAndValidity();
  this.appealOverViewDetailsForm.get('cobCreationReason').updateValueAndValidity();
  this.appealOverViewDetailsForm.get('disenrollFrnEnrPrg').updateValueAndValidity();
 }

 saveAppealReview(personDetailsForm){
   this.submitted = true;
  if(personDetailsForm.valid){
    this.emitSaveAppealOverview.emit(personDetailsForm);
  } else {
    return;
  }
 }

 ngOnDestroy() {
  if(this.subscriptions$ && this.subscriptions$.length > 0) {
    this.subscriptions$.forEach(subscription$ => subscription$.unsubscribe());
  }
}

}
