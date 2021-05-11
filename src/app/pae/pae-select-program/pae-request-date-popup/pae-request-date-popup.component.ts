import { Component, HostListener, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CustomvalidationService } from '../../../_shared/utility/customvalidation.service';
import * as customValidation from '../../../_shared/constants/validation.constants';
import { PaeProgramSelectService } from '../../../core/services/pae/pae-program-select/pae-program-select.service';
import { PaeService } from '../../../core/services/pae/pae.service';
import { PaeRequestDate } from '../../../_shared/model/PaeRequestDate';
import { MatRadioChange } from '@angular/material/radio';
import { Observable } from 'rxjs';
import { ComponentCanDeactivate } from 'src/app/core/helpers/pending-change.guard';
import * as Constants from '../../../_shared/constants/application.constants';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-pae-request-date-popup',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './pae-request-date-popup.component.html',
  styleUrls: ['./pae-request-date-popup.component.scss'],
})
export class PaeRequestDatePopupComponent implements OnInit{
  localStorageLocal = localStorage.getItem('APP_STORAGE_TOKEN');
  entityTypeCd = JSON.parse(this.localStorageLocal).entityTypeCd;
  customValidation = customValidation;
  isMCO = false;
  choicesGroupOne = false;
  actualDischargeDate = null;
  minDate: Date;
  maxDate: Date;
  paeRequestDateForm: any;
  isChoicesGroup3 = false;
  paeId: any;
  reqPageId: any;
  startDate = new Date();
  constructor(
    public dialogRef: MatDialogRef<PaeRequestDatePopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private paeProgramSelectService: PaeProgramSelectService,
    private paeService: PaeService
  ) {}

  ngOnInit() {
    const timeTravelData = localStorage.getItem('TIME_TRAVEL_DATA');
    if (timeTravelData) {
    const timeTravelDataJson = JSON.parse(CryptoJS.AES.decrypt(timeTravelData, Constants.APP_ENC_DECRYPT_KEY).toString(CryptoJS.enc.Utf8));
    console.log("timeTravelDataJson ", timeTravelDataJson);
    if (timeTravelDataJson.timeTravelFlag && timeTravelDataJson.currentDate) {
      this.startDate = new Date(timeTravelDataJson.currentDate);
    }
  }
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 119, 0, 1);
    this.maxDate = new Date();
    this.maxDate.setDate(this.maxDate.getDate() + 10);
    console.log(this.data.selectedProgram);
    if (this.data.selectedProgram === 'CG1') {
      this.choicesGroupOne = true;
    }
    this.paeRequestDateForm = this.fb.group({
      programRequestDt: [null, [Validators.required]],
      choicesGroup3Sw: [null],
      actualDischargeDt: [null],
    });

    if (this.isMCO) {
      this.getFormData().choicesGroup3Sw.setValidators([Validators.required]);
      this.getFormData().choicesGroup3Sw.updateValueAndValidity();
    }
  }

  getFormData() {
    return this.paeRequestDateForm.controls;
  }
  closePopup() {
    this.dialogRef.close();
  }

  cancel() {
    this.dialogRef.close();
  }

  choicesGroupChange($event: MatRadioChange) {
    if ($event.value === 'Y') {
        this.isChoicesGroup3 = true;
        this.getFormData().actualDischargeDt.setValidators([Validators.required]);
        this.getFormData().actualDischargeDt.updateValueAndValidity();
    }
    else {
      this.isChoicesGroup3 = false;
    }
}

  continue() {
    console.log(this.paeRequestDateForm);
    if (this.paeRequestDateForm.valid) {
      this.reqPageId = 'PPPSP';
      if (this.getFormData().actualDischargeDt.value !== null) {
        this.actualDischargeDate = this.getFormData().actualDischargeDt.value.toJSON();
      }
      const programRequestDt = this.getFormData().programRequestDt.value.toJSON();
      const paeProgramRequestDate = new PaeRequestDate(
        this.reqPageId,
        this.actualDischargeDate,
        this.getFormData().choicesGroup3Sw.value,
        programRequestDt,
        this.data.selectedProgram,
        this.data.paeId
      );
      console.log(paeProgramRequestDate);
      const response = this.paeProgramSelectService.savePaeProgramRequestDate(
        paeProgramRequestDate
      );
      response.then((data) => {
        const nextPage = data.headers.get('next');
        this.dialogRef.close(nextPage);
        console.log(data);
      });
    }
  }
  
}
