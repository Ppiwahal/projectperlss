import { CustomvalidationService } from '../../_shared/utility/customvalidation.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { RefSchAndWork } from '../../_shared/model/RefSchAndWork';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { ReferralService } from '../../core/services/referral/referral.service';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SavePopupComponent } from '../../savePopup/savePopup.component';
import { HttpResponse } from '@angular/common/http';
import { ReferralFlowSeq } from '../../_shared/utility/ReferralFlowSeq';
import { Validators } from '@angular/forms';
import * as customValidation from '../../_shared/constants/validation.constants';
import { ToastrService } from 'ngx-toastr';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MatDatepicker} from '@angular/material/datepicker';
import moment, * as _moment from 'moment';
import {default as _rollupMoment, Moment} from 'moment';

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
@Component({
  selector: 'app-referral-school-work',
  templateUrl: './referral-school-work.component.html',
  styleUrls: ['./referral-school-work.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class ReferralSchoolWorkComponent implements OnInit {
  @Output() completedSchoolWork: EventEmitter<any> = new EventEmitter<any>();
  pageId: string = 'PERSW';
  inSchool = false;
  submitted = false;
  schAndWorkForm: FormGroup;
  hlthDisSw = false;
  jobNowSw: string;
  jobOfferSw: string;
  lostJobSw: string;
  noJobSw: string;
  noJobExplWorkSw: string;
  noWorkIntrstSw: string;
  nextPath: string;
  nextForm: string;
  event: string;
  enableNext = true;
  showSpinner = false;
  isSamePageNavigation: boolean;
  customValidation = customValidation;
  maxDate: Date;
  // jobVocRehabSw: string;

  age: number;
  jobSituationCd: string;

  toastrBack = false;
  toastRef: any;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private referralService: ReferralService,
    private dialog: MatDialog,
    private customValidator: CustomvalidationService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.age = this.referralService.getAge();
    console.log(this.age);
    this.maxDate = new Date();
    this.schAndWorkForm = this.fb.group({
      curSchoolSw: ['', [Validators.required]],
      leaveSchoolSw: ['', [Validators.required]],
      vocRehabSw: ['', [Validators.required]],
      srvcCallExplreSw: ['', [Validators.required]],
      jobSituationCd: ['', [Validators.required]],
      empName: [''],
      jobEndDt: new FormControl(moment(), Validators.required),
      jobEndReasonCd: ['', [Validators.required]],
      needSrvcsForJobSw: ['', [Validators.required]],
      hlthDisabilitySw: [''],
      liveDoThingsSw: [''],
      jobVocRehabSw: ['', [Validators.required]],
    });

    if(this.referralService.getRefId() !== null && this.referralService.getRefId() !== undefined){
      this.dataPatchup();
    }
  }

  dataPatchup(){
    const loadData = this.referralService.getRefSchWrkDetails(this.referralService.getRefId(), this.pageId)
    .then(response => {
      let receivedData = response;
      console.log("receivedData" + JSON.stringify(receivedData));
      this.schAndWorkForm.patchValue(receivedData.body);
      const jobStat = receivedData.body.jobSituationCd;
      if(jobStat === 'JNOW'){
        this.getFormData().jobSituationCd.setValue('jobNow');
        this.jobNowSw = 'Y';
      }
      else if(jobStat === 'OFF'){
        this.getFormData().jobSituationCd.setValue('jobOfferSw');
        this.jobOfferSw = 'Y';
      }
      else if(jobStat === 'JLOS'){
        this.getFormData().jobSituationCd.setValue('lostJobSw');
        this.lostJobSw = 'Y';
      }
      else if(jobStat === 'JNEH'){
        this.getFormData().jobSituationCd.setValue('needJobHelp');
      }
      else if(jobStat === 'JEXP'){
        this.getFormData().jobSituationCd.setValue('noJobExplore');
        this.noJobExplWorkSw = 'Y';
      }
      else if(jobStat === 'NOTI'){
        this.getFormData().jobSituationCd.setValue('notIntrestedInWork');
      }

      if(receivedData.body.curSchoolSw === 'Y'){
        this.inSchool = true;
      }
    });
  }

  chosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.schAndWorkForm.controls.jobEndDt.value;
    ctrlValue.year(normalizedYear.year());
    this.schAndWorkForm.controls.jobEndDt.setValue(ctrlValue);
  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.schAndWorkForm.controls.jobEndDt.value;
    ctrlValue.month(normalizedMonth.month());
    this.schAndWorkForm.controls.jobEndDt.setValue(ctrlValue);
    datepicker.close();
  }
  saveSchoolAndWork(showPopup?: boolean) {
    this.isSamePageNavigation =  true;
    const refId = this.referralService.getRefId();
    const personId = this.referralService.getPersonId();
    const refSchAndWork = new RefSchAndWork(
      'PERSW',
      null,
      this.getFormData().curSchoolSw.value,
      this.getFormData().empName.value,
      this.getFormData().hlthDisabilitySw.value,
      this.getFormData().jobEndDt.value,
      this.getFormData().jobEndReasonCd.value,

      this.jobSituationCd,
      this.getFormData().jobVocRehabSw.value,
      this.getFormData().leaveSchoolSw.value,
      this.getFormData().liveDoThingsSw.value,
      this.getFormData().needSrvcsForJobSw.value,
      refId,

      this.getFormData().srvcCallExplreSw.value,
      this.getFormData().vocRehabSw.value
    );
    const response = this.referralService.saveReferralSchAndWork(refSchAndWork);
    console.log(this.schAndWorkForm);
    this.nextForm = 'PERCS';
    const that = this;
    response.then(function (response: HttpResponse<any>) {
      that.showSpinner = false;
      that.enableNext = true;
      if (showPopup) {
        that.showSaveAndExitPopup();
      }
      else {
        that.nextForm = response.headers.get('next');
        response = response.body;
        that.nextPath = ReferralFlowSeq[that.nextForm];
        if (that.event === 'Next') {
          that.completedSchoolWork.emit(ReferralFlowSeq[that.nextForm]);
        }
        const element = document.getElementById('pM');
        if (element !== null) {
            element.scrollIntoView(true);
        }
      }
    });
  }

  getFormData() {
    return this.schAndWorkForm.controls;
  }
  onCurSchool(event) {
    if (event.value === 'Y') {
      this.inSchool = true;
      this.getFormData().curSchoolSw.setValidators([Validators.required]);
      this.getFormData().curSchoolSw.updateValueAndValidity();
      this.getFormData().leaveSchoolSw.setValidators([Validators.required]);
      this.getFormData().leaveSchoolSw.updateValueAndValidity();
      this.getFormData().vocRehabSw.setValidators([Validators.required]);
      this.getFormData().vocRehabSw.updateValueAndValidity();
      this.getFormData().jobVocRehabSw.setValidators([Validators.required]);
      this.getFormData().jobVocRehabSw.updateValueAndValidity();
    } else {
      this.inSchool = false;
      this.getFormData().curSchoolSw.clearValidators();
      this.getFormData().curSchoolSw.updateValueAndValidity();
      this.getFormData().leaveSchoolSw.setValue(null);
      this.getFormData().leaveSchoolSw.clearValidators();
      this.getFormData().leaveSchoolSw.markAsUntouched();
      this.getFormData().leaveSchoolSw.updateValueAndValidity();
      this.getFormData().vocRehabSw.clearValidators();
      this.getFormData().vocRehabSw.updateValueAndValidity();
      this.getFormData().vocRehabSw.markAsUntouched();
      this.getFormData().vocRehabSw.setValue(null);
      this.getFormData().jobVocRehabSw.clearValidators();
      this.getFormData().jobVocRehabSw.updateValueAndValidity();
      this.getFormData().jobVocRehabSw.markAsUntouched();
      this.getFormData().jobVocRehabSw.setValue(null);
    }
  }

  onHeathDisablity(event) {
    if (event.source.value === 'Y') {
      this.hlthDisSw = false;
    } else if(event.source.value === 'N'){
      this.hlthDisSw = true;
    }
  }

  onJobOptSelection(event) {
    if (event.value === 'jobNow') {
      this.jobNowSw = 'Y';
      this.jobSituationCd = 'JNOW';
      this.jobNowSetValidators();
    } else {
      this.jobNowSw = 'N';
      this.jobNowClearValidators();
      if (event.value === 'jobOfferSw') {
        this.jobSituationCd = 'OFF';
        this.jobOfferSetValidators();
      } else if (event.value === 'lostJobSw') {
        this.lostJobSetValidators();
      }
    }

    if (event.value === 'jobOfferSw') {
      this.jobOfferSw = 'Y';
      this.jobOfferSetValidators();
    } else {
      this.jobOfferSw = 'N';
      this.jobOfferClearValidators();

      if (event.value === 'jobNow') {
        this.jobNowSetValidators();
      } else if (event.value === 'lostJobSw') {
        this.lostJobSetValidators();
      }
    }

    if (event.value === 'lostJobSw') {
      this.jobSituationCd = 'JLOS';
      this.lostJobSw = 'Y';
      this.lostJobSetValidators();
    } else {
      this.lostJobSw = 'N';
      this.lostJobClearValid();
      if (event.value === 'jobNow') {
        this.jobNowSetValidators();
      } else if (event.value === 'jobOfferSw') {
        this.jobOfferSetValidators();
      }
    }

    if (event.value === 'needJobHelp') {
      this.jobSituationCd = 'JNEH';
      this.noJobSw = 'Y';
    } else {
      this.noJobSw = 'N';
    }

    if (event.value === 'noJobExplore') {
      this.jobSituationCd = 'JEXP';
      this.noJobExplWorkSw = 'Y';
      this.getFormData().srvcCallExplreSw.setValidators([Validators.required]);
      this.getFormData().srvcCallExplreSw.updateValueAndValidity();
    } else {
      this.noJobExplWorkSw = 'N';
      this.getFormData().srvcCallExplreSw.setValue(null);
      this.getFormData().srvcCallExplreSw.markAsUntouched();
      this.getFormData().srvcCallExplreSw.clearValidators();
      this.getFormData().srvcCallExplreSw.updateValueAndValidity();
    }
    if (event.value === 'notIntrestedInWork') {
      this.jobSituationCd = 'NOTI';
      this.noWorkIntrstSw = 'Y';
    } else {
      this.noWorkIntrstSw = 'N';
    }
  }

  jobNowSetValidators() {
    this.getFormData().empName.setValidators([
      Validators.required,
      Validators.maxLength(100),
    ]);
    this.getFormData().empName.updateValueAndValidity();
    this.getFormData().needSrvcsForJobSw.setValidators([Validators.required]);
    this.getFormData().needSrvcsForJobSw.updateValueAndValidity();
  }

  jobNowClearValidators() {
    this.getFormData().empName.setValue(null);
    this.getFormData().empName.clearValidators();
    this.getFormData().empName.markAsUntouched();
    this.getFormData().empName.updateValueAndValidity();
    this.getFormData().needSrvcsForJobSw.setValue(null);
    this.getFormData().needSrvcsForJobSw.markAsUntouched();
    this.getFormData().needSrvcsForJobSw.clearValidators();
    this.getFormData().needSrvcsForJobSw.updateValueAndValidity();
  }

  lostJobClearValid() {
    this.getFormData().empName.setValue(null);
    this.getFormData().empName.markAsUntouched();
    this.getFormData().empName.clearValidators();
    this.getFormData().empName.updateValueAndValidity();
    this.getFormData().jobEndDt.setValue(null);
    this.getFormData().jobEndDt.markAsUntouched();
    this.getFormData().jobEndDt.clearValidators();
    this.getFormData().jobEndDt.updateValueAndValidity();
    this.getFormData().jobEndReasonCd.setValue(null);
    this.getFormData().jobEndReasonCd.markAsUntouched();
    this.getFormData().jobEndReasonCd.clearValidators();
    this.getFormData().jobEndReasonCd.updateValueAndValidity();
  }

  lostJobSetValidators() {
    this.getFormData().empName.setValidators([
      Validators.required,
      Validators.maxLength(100)
    ]);
    this.getFormData().empName.updateValueAndValidity();
    // this.getFormData().jobEndDt.setValidators([
    //   Validators.required,
    //   Validators.pattern('^(0[1-9]|1[0-2])\/(19|20)\d{2}$'),
    // ]);
    // this.getFormData().jobEndDt.updateValueAndValidity();
    this.getFormData().jobEndReasonCd.setValidators([Validators.required]);
    this.getFormData().jobEndReasonCd.updateValueAndValidity();
  }

  jobOfferClearValidators() {
    this.getFormData().empName.setValue(null);
    this.getFormData().empName.markAsUntouched();
    this.getFormData().empName.clearValidators();
    this.getFormData().empName.updateValueAndValidity();
  }
  jobOfferSetValidators() {
    this.getFormData().empName.setValidators([
      Validators.required,
      Validators.maxLength(100)
    ]);
    this.getFormData().empName.updateValueAndValidity();
  }

  saveAndExit() {
    this.event = 'SaveAndExit';
    this.submitted = true;
    this.saveSchoolAndWork(true);
  }
  showSaveAndExitPopup() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = { route: 'ltss/referral' };
    dialogConfig.panelClass = 'exp_popup';
    dialogConfig.width = '600px';
    dialogConfig.height = '360px';
    this.dialog.open(SavePopupComponent, dialogConfig);
  }

  next() {
    this.isSamePageNavigation =  true;
    this.event = 'Next';
    this.submitted = true;
    if (this.schAndWorkForm.valid) {
      this.enableNext = false;
      this.showSpinner = true;
      this.saveSchoolAndWork();
    }
  }

  back() {
    console.log(this.schAndWorkForm);
    const previousForm = 'PERCI';
    if (this.schAndWorkForm.touched) {
      this.toastRef = this.toastr.warning(this.customValidation.C1, '', {
        tapToDismiss: true,
        disableTimeOut: true,
        positionClass: 'toast-top-full-width',
      });
      if (this.toastrBack) {
        this.toastr.clear(this.toastRef.ToastId);

        this.completedSchoolWork.emit(ReferralFlowSeq[previousForm]);
        this.schAndWorkForm.reset();
        this.toastrBack = false;
      }
      this.toastrBack = true;
      console.log("school and work back button touched", previousForm);
    }
    if (!this.schAndWorkForm.touched) {
      this.completedSchoolWork.emit(ReferralFlowSeq[previousForm]);
      this.toastrBack = false;
      console.log("school and work back button not touched", previousForm);
    }
  }
}
