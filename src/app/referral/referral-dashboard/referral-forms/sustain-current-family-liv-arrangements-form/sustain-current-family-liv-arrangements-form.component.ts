import { SustainCurrentFamilyLiveArrangementsFormService } from './../../../../core/services/referral/referral-intake/sustain-current-family-live-arrangements-form.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as customValidation from '../../../../_shared/constants/validation.constants';
import { CustomvalidationService } from '../../../../_shared/utility/customvalidation.service';
import { MatDialogRef } from '@angular/material/dialog';
import { IntakeOutcomeService } from 'src/app/core/services/referral/intake-outcome/intake-outcome.service';

@Component({
  selector: 'app-sustain-current-family-liv-arrangements-form',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './sustain-current-family-liv-arrangements-form.component.html',
  styleUrls: ['./sustain-current-family-liv-arrangements-form.component.scss']
})
export class SustainCurrentFamilyLivArrangementsFormComponent implements OnInit {

  susCurrFamLivArrForm: FormGroup;
  submitted = false;
  customValidation = customValidation;
  reqPageId: string;
  signDate: string;
  myForm: FormGroup;
  intakeOutcomeId: string;
  errorText: any = {};
  saved = false;
  otherClicked = false;
  
  checkboxControls: Array<string> = ['complxChrHlthCondSw', 'condExpctdContSw', 'hlthSignifiBarEmpSw', 'urgntNeedOfSupSw',
    'legalDocsSw', 'mediDocumentationSw', 'adaptBehLsaResSw', 'phyclClinicalNoteSw', 'verifTrgtPopulatinSw', 'othrSw'];

  constructor(
    private fb: FormBuilder,
    private customValidator: CustomvalidationService,
    private sustainCurrentFamilyLiveArrangementsFormService: SustainCurrentFamilyLiveArrangementsFormService,
    private intakeOutcomeService: IntakeOutcomeService,
    public dialogRef: MatDialogRef<SustainCurrentFamilyLivArrangementsFormComponent>
  ) { }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      antiChngsExpTimeTxt: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9\' \-]+$')]],
      currHlthCondnTxt: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9\' \-]+$')]],
      electronicSignature: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9\' \-]+$')]],
      evntsFamStruggTxt: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9\' \-]+$')]],
      howPrsnIsSupTxt: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9\' \-]+$')]],
      legalDocsSw: [null],
      adaptBehLsaResSw: [null],
      medBehNeedsStruggSw: ['', [Validators.required]],
      naturalFamPrsonSw: ['', [Validators.required]],
      optDidNotWorkTxt: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9\' \-]+$')]],
      othrDesc: [''],
      othrSw: [null],
      othrSupResAvalTxt: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9\' \-]+$')]],
      phyclClinicalNoteSw: [null],
      primaryCarWillngSupSw: ['', [Validators.required]],
      prsnDsntQualifyTxt: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9\' \-]+$')]],
      prsnUrgntSupSw: ['', [Validators.required]],
      rsnCurrFamArrangTxt: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9\' \-]+$')]],
      trtmntThrpyRcvdTxt: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9\' \-]+$')]],
      verifTrgtPopulnSw: [null]
    });

    this.intakeOutcomeId = this.intakeOutcomeService.getIntakeOutcomeId();
    let that = this;
    this.sustainCurrentFamilyLiveArrangementsFormService.getSustainCurrentFamilyLiveArrangementsForm(this.intakeOutcomeId).then(response => {
      let data = response.body;
      if (data.intakeOutcomeId != null) {
        let map = {T: true, F: false};
        that.checkboxControls.forEach(key => {
          data[key] = data[key] ? map[data[key]] : null;
        });
        that.myForm.patchValue(data);
        that.saved = true;
      }
    }).catch(reason => {
      console.log('SustainCurrentFamilyFormError error: ' + reason);
      that.saved = false;
    });
  }

  get f() {
    return this.myForm.controls;
  }

  otherClick() {
    let that = this;
    let timeout = setTimeout(function () {
      let value = that.myForm.get('othrSw').value;
      that.otherClicked = value;
      that.myForm.get('othrDesc').setValidators(value === 'true' ? [Validators.required, this.customValidator.nameValidator()] : null);
    }, 100)
  }


  closePopup() {
    this.intakeOutcomeService.setDialogResult('refIntakeLvngArngmtRvw', this.saved);
    this.dialogRef.close();
  }

  onSubmit() {
    this.submitted = true;
    this.reqPageId = 'PRIOMP';
    let that = this;
    
    if (this.myForm.valid) {
      let data = this.myForm.value;
      data.id = 0;
      data.reqPageId = 'RIOPTR';
      this.checkboxControls.forEach(key => {
        data[key] = data[key] ? 'T' : 'F';
      });
      data.signDate = new Date();
      data.intakeOutcomeId = this.intakeOutcomeService.getIntakeOutcomeId();
      
      this.sustainCurrentFamilyLiveArrangementsFormService.saveSustainCurrentFamilyLiveArrangementsForm(data).then(response => {
        that.saved = true;
        that.closePopup();
      });

    } else {
      let result = [];
      Object.keys(this.myForm.controls).forEach(controlName => {
        if (!that.myForm.controls[controlName].valid) {
          result.push(controlName);
        }
      });
      console.log("Invalid: " + result.join(','));
    }
  }

  controlError(controlName: string): boolean {
    try {
      let control = this.myForm.controls[controlName];
      let errorText: string = null;
      if ((control.touched || this.submitted) && control.errors) {
        if (control.errors.required) {
          errorText = this.customValidation.A1;
        } else if (control.errors.specialCharacterValidator || control.errors.pattern) {
          errorText = this.customValidation.A2;
        } else {
          errorText = "Unexpected Error"
        }
      }
      this.errorText[controlName] = errorText;
      return errorText !== null;
    } catch (e) {
      let errMsg = 'Validation setup error: ' + controlName;
      console.log(errMsg);
      this.errorText[controlName] = errMsg;
      return true;
    }
  }

}
