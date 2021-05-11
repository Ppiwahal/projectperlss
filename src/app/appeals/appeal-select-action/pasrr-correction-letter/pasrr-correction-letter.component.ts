import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { RightnavToggleService } from 'src/app/_shared/services/rightnav-toggle.service';
import { AppealService } from '../../services/appeal.service';
import * as customValidation from '../../../_shared/constants/validation.constants';
import * as Constants from '../../../_shared/constants/application.constants';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-pasrr-correction-letter',
  templateUrl: './pasrr-correction-letter.component.html',
  styleUrls: ['./pasrr-correction-letter.component.scss']
})
export class PasrrCorrectionLetterComponent implements OnInit, OnDestroy {

  @Input() searchElement: any;

  pasrrCorrectionLetterForm: FormGroup;
  continuanceReason = [];
  isShowErrors = false;
  customValidation = customValidation;
  subscriptions$ = [];
  startDate = new Date();

  constructor(private formBuilder: FormBuilder,
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
    this.pasrrCorrectionLetterForm = this.formBuilder.group({
      clientId: [null, Validators.required],
      episodeId: [null, Validators.required],
      correctionDate: [null, Validators.required],
      effectiveApprovalDate: [null, Validators.required]
    });
    this.pasrrdetails();
  }

  pasrrdetails() {
    const PASRRDetailsSubscriptions$ = this.appealService.pasrrdetails(this.searchElement.aplId).subscribe(response => {
      if (response && response.clientId) {
        this.pasrrCorrectionLetterForm.get('clientId').setValue(response.clientId);
      }
    });
    this.subscriptions$.push(PASRRDetailsSubscriptions$);
  }

  pasrrCorrectionLetter() {
    if (this.pasrrCorrectionLetterForm.valid) {
      const correctionDate = new Date(this.pasrrCorrectionLetterForm.value.correctionDate);
      const effectiveApprovalDate = new Date(this.pasrrCorrectionLetterForm.value.effectiveApprovalDate);
      const month1 = correctionDate.getMonth() + 1;
      const month2 = effectiveApprovalDate.getMonth() + 1;
      const date1 = correctionDate.getDate();
      const date2 = effectiveApprovalDate.getDate();
      let formattedDate1 = '';
      let formattedMonth1 = '';
      let formattedDate2 = '';
      let formattedMonth2 = '';
      if (month1 < 10) {
        formattedMonth1 = '0' + month1.toString();
      } else {
        formattedMonth1 = month1.toString();
      }
      if (month2 < 10) {
        formattedMonth2 = '0' + month2.toString();
      } else {
        formattedMonth2 = month2.toString();
      }
      if (date1 < 10) {
        formattedDate1 = '0' + date1.toString();
      } else {
        formattedDate1 = date1.toString();
      }
      if (date2 < 10) {
        formattedDate2 = '0' + date2.toString();
      } else {
        formattedDate2 = date2.toString();
      }
      const formattedCorrectionDate = correctionDate.getFullYear() + '-' + formattedMonth1 + '-' + formattedDate1;
      const formattedEffectiveApprovalDate = effectiveApprovalDate.getFullYear() + '-' + formattedMonth2 + '-' + formattedDate2;
      const payload = {
        aplId: this.searchElement.aplId,
        clientId: this.pasrrCorrectionLetterForm.value.clientId ? this.pasrrCorrectionLetterForm.value.clientId : null,
        episodeId: this.pasrrCorrectionLetterForm.value.episodeId ? this.pasrrCorrectionLetterForm.value.episodeId : null,
        pasrrEffectiveDt: formattedEffectiveApprovalDate,
        pasrrRsbmsnDt: formattedCorrectionDate
      };
      const PASRRCorrectionLetterSubscriptions$ = this.appealService.pasrrCorrectionLetter(payload).subscribe(response => {
        if (response && response.successMessage) {
          this.toastrService.success(customValidation.B7);
        }
      });
      this.subscriptions$.push(PASRRCorrectionLetterSubscriptions$);
    } else {
      Object.keys(this.pasrrCorrectionLetterForm.controls).forEach(field => {
        const control = this.pasrrCorrectionLetterForm.get(field);
        control.markAsTouched({ onlySelf: true });
      });
      this.isShowErrors = true;
    }
  }

  openUploadRightNav() {
    this.rightnavToggleService.setAppealSelectUploadFlag(true);
  }

  cancel() {
    this.pasrrCorrectionLetterForm.reset();
  }

  ngOnDestroy() {
    if (this.subscriptions$ && this.subscriptions$.length > 0) {
      this.subscriptions$.forEach(subscription$ => subscription$.unsubscribe());
    }
  }

}
