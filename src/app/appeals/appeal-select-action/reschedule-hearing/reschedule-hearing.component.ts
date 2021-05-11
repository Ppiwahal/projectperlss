import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { RightnavToggleService } from 'src/app/_shared/services/rightnav-toggle.service';
import { AppealService } from '../../services/appeal.service';
import * as customValidation from '../../../_shared/constants/validation.constants';
import * as Constants from '../../../_shared/constants/application.constants';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-reschedule-hearing',
  templateUrl: './reschedule-hearing.component.html',
  styleUrls: ['./reschedule-hearing.component.scss']
})
export class RescheduleHearingComponent implements OnInit, OnDestroy {

  @Input() searchElement: any;

  continuanceReason = [];
  rescheduleHearingForm: FormGroup;
  dummyForRadioButtons: string[] = ['Yes', 'No'];
  todayDate: any;
  customValidation = customValidation;
  documentTypes = [];
  isShowErrors = false;
  subscriptions$ = [];
  startDate = new Date();

  constructor(private fb: FormBuilder,
              private appealService: AppealService,
              private toastrService: ToastrService,
              private rightnavToggleService: RightnavToggleService) { }

  ngOnInit() {
    const timeTravelData = localStorage.getItem('TIME_TRAVEL_DATA');
    if(timeTravelData) {
      const timeTravelDataJson = JSON.parse(CryptoJS.AES.decrypt(timeTravelData, Constants.APP_ENC_DECRYPT_KEY).toString(CryptoJS.enc.Utf8));
      console.log("timeTravelDataJson ", timeTravelDataJson);
      if(timeTravelDataJson.timeTravelFlag && timeTravelDataJson.currentDate) {
        this.startDate = new Date(timeTravelDataJson.currentDate);
      }
    }
    this.getContinuanceReason();
    this.getDocumentType();
    this.todayDate = new Date('01/01/1901');
    this.rescheduleHearingForm = this.fb.group({
      reasonForContinuance: ['', Validators.required],
      tolledDate: ['', Validators.required],
      briefDescription: ['', Validators.required],
      hearingDate: ['', Validators.required],
      judgeName: ['', Validators.required],
      attorneyName: ['', Validators.required],
      hearingTime: ['', Validators.required],
      isHearingDateAndTime: ['', Validators.required],
      selectDocumentTypes: [''],
      isTolledDate: ['', Validators.required],
      isJudgeAndAttorney: ['', Validators.required]
    });
  }

  getContinuanceReason() {
    const ContinuanceReasonSubscriptions$ = this.appealService.getStaticDataValue('CONTINUANCE_REASON').subscribe(response => {
      this.continuanceReason = response;
    });
    this.subscriptions$.push(ContinuanceReasonSubscriptions$);
  }

  getDocumentType() {
    const DocumentTypeSubscriptions$ = this.appealService.getStaticDataValue('DOCUMENT_TYPE').subscribe(response => {
      this.documentTypes = response;
    });
    this.subscriptions$.push(DocumentTypeSubscriptions$);
  }

  rescheduleHearing() {
    if (this.rescheduleHearingForm.valid) {
      this.isShowErrors = false;
      const date1 = new Date(this.rescheduleHearingForm.value.tolledDate);
      const selectedMonth = date1.getMonth() + 1;
      const selectedDate = date1.getDate();
      let formattedDate = '';
      let formattedMonth = '';
      if (selectedMonth < 10) {
        formattedMonth = '0' + selectedMonth.toString();
      } else {
        formattedMonth = selectedMonth.toString();
      }
      if (selectedDate < 10) {
        formattedDate = '0' + selectedDate.toString();
      } else {
        formattedDate = selectedDate.toString();
      }
      const formattedTolledDate = date1.getFullYear() + '-' + formattedMonth + '-' + formattedDate;
      const date2 = new Date(this.rescheduleHearingForm.value.hearingDate).toISOString().substring(0, 10);
      const hearingDateTime = new Date(date2 + ' ' + this.rescheduleHearingForm.value.hearingTime + ' UTC');
      const payload = {
        actionPerformedCd: 'TB',
        aplId: this.searchElement.aplId,
        aplHrngDtlsId: 10,
        hrngDtTms: hearingDateTime,
        hrngPrsnlCd: 'CD',
        hrngPrsnlName: 'Tester', // judge name or attorney name depending on hrngPrsnlName
        hrngPrsnlUpdatedDtlsSw: this.rescheduleHearingForm.value.isJudgeAndAttorney === 'No' ? 'N' : 'Y',
        briefDescription: this.rescheduleHearingForm.value.briefDescription,
        tolledDtSw: this.rescheduleHearingForm.value.isTolledDate === 'No' ? 'N' : 'Y',
        newHrngDtSw: this.rescheduleHearingForm.value.isHearingDateAndTime === 'No' ? 'N' : 'Y',
        rschlngRsnCd: this.rescheduleHearingForm.value.reasonForContinuance,
        tolledDt: formattedTolledDate
      };
      const RescheduleHearingSubscriptions$ = this.appealService.rescheduleHearing(payload).subscribe(response => {
        if (response && response.successMessage) {
          this.toastrService.success(customValidation.B7);
        }
      });
      this.subscriptions$.push(RescheduleHearingSubscriptions$);
    } else {
      Object.keys(this.rescheduleHearingForm.controls).forEach(field => {
        const control = this.rescheduleHearingForm.get(field);
        control.markAsTouched({ onlySelf: true });
      });
      this.isShowErrors = true;
    }
  }

  openUploadRightNav() {
    this.rightnavToggleService.setAppealSelectUploadFlag(true);
  }

  cancel() {
    this.rescheduleHearingForm.reset();
  }

  ngOnDestroy() {
    if (this.subscriptions$ && this.subscriptions$.length > 0) {
      this.subscriptions$.forEach(subscription$ => subscription$.unsubscribe());
    }
  }

}
