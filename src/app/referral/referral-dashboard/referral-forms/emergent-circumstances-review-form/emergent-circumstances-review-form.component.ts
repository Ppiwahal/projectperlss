import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as customValidation from '../../../../_shared/constants/validation.constants';
import { CustomvalidationService } from '../../../../_shared/utility/customvalidation.service';
import { EmergentCircumstancesFormService } from './../../../../core/services/referral/referral-intake/Emergent-Circumstances-Form.service';
import { IntakeOutcomeService } from 'src/app/core/services/referral/intake-outcome/intake-outcome.service';

@Component({
  selector: 'app-emergent-circumstances-review-form',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './emergent-circumstances-review-form.component.html',
  styleUrls: ['./emergent-circumstances-review-form.component.scss']
})
export class EmergentCircumstancesReviewFormComponent implements OnInit {

  submitted = false;
  otherClicked = false;
  customValidation = customValidation;
  reqPageId: string;
  saved = false;
  errorText: any = {};
  intakeOutcomeId: string;
  myForm: FormGroup;
  emergentCircumstancesResponse: any;
  checkboxControls = ['adaptBehLsaResSw', 'legalDocsSw', 'phyclClinicalNoteSw',
  'verifTrgtPoplationSw', 'othrSw'];

  constructor(
    public dialogRef: MatDialogRef<EmergentCircumstancesReviewFormComponent>,
    private fb: FormBuilder,
    private emergentCircumstancesFormService: EmergentCircumstancesFormService,
    private customValidator: CustomvalidationService,
    private intakeOutcomeService: IntakeOutcomeService
  ) { }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      abuseCurrLivSw: ['', [Validators.required]],
      adaptBehLsaResSw: [null],
      addCurrEmrgTxt: ['', [Validators.required, this.customValidator.nameValidator()]],
      adltTrnstnCustdySw: ['', [Validators.required]],
      anticipateChngSupTxt: ['', [Validators.required, this.customValidator.nameValidator()]],
      behHlthCrisisPrevSw: ['', [Validators.required]],
      caregvrPermIncapSw: ['', [Validators.required]],
      cargvrRecentIncapSw: ['', [Validators.required]],
      criticalCircumTxt: ['', [Validators.required, this.customValidator.nameValidator()]],
      currTreatBehCondTxt: ['', [Validators.required, this.customValidator.nameValidator()]],
      electronicSignature: ['', [Validators.required, this.customValidator.nameValidator()]],
      enrolEcfTranLongSw: ['', [Validators.required]],
      howPrsnIsSupTxt: ['', [Validators.required, this.customValidator.nameValidator()]],
      intakeAssessorObservTxt: ['', [Validators.required, this.customValidator.nameValidator()]],
      justification: [''],
      legalDocsSw: [''],
      optTriedNotWorkTxt: ['', [Validators.required, this.customValidator.nameValidator()]],
      othrDesc: [null],
      othrSupAvailTxt: ['', [Validators.required, this.customValidator.nameValidator()]],
      othrSw: [' '],
      ovr21AdltEnrolEcfSw: ['', [Validators.required]],
      phyclClinicalNoteSw: [null],
      rcntEvntCurCircuTxt: ['', [Validators.required, this.customValidator.nameValidator()]],
      srvcUrgntNeededSw: ['', [Validators.required]],
      supNeededTxt: ['', [Validators.required, this.customValidator.nameValidator()]],
      verifTrgtPoplationSw: [null]

    });

    this.intakeOutcomeId = this.intakeOutcomeService.getIntakeOutcomeId();
    let that = this;
    this.emergentCircumstancesFormService.getEmergentCircunstancesForm(this.intakeOutcomeId).then(response => {
      let data = response.body;
      if (data.intakeOutcomeId != null) {
        let map = { T: true, F: false };
        that.checkboxControls.forEach(key => {
          data[key] = data[key] ? map[data[key]] : null;
        });
        that.myForm.patchValue(data);
        that.saved = true;
      }
    }).catch(reason => {
      console.log('loadMultipleComplexFormError error: ' + reason);
      that.saved = false;
    });

    ['addCurrEmrgTxt','anticipateChngSupTxt','criticalCircumTxt',
    'currTreatBehCondTxt','howPrsnIsSupTxt',
    'intakeAssessorObservTxt','justification','optTriedNotWorkTxt',
    'othrSupAvailTxt','rcntEvntCurCircuTxt','supNeededTxt'].forEach(cn => {
      if (that.f[cn].value == null) {
        that.f[cn].setValue('');
      }
    });

  }

  get f() {
    return this.myForm.controls;
  };

  closePopup() {
    this.intakeOutcomeService.setDialogResult('refIntakeEmergentRvw', this.saved);
    this.dialogRef.close();
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

  otherClick() {

    let that = this;
    let timeout = setTimeout(function () {
      let value = that.myForm.get('othrSw').value;
      that.otherClicked = value;
      that.myForm.get('othrDesc').setValidators(value === 'true' ? [Validators.required, this.customValidator.nameValidator()] : null);
    }, 100)
  }


  onSubmit() {
    this.submitted = true;
    this.reqPageId = 'PRIOMP';
    let that = this;

    if (this.myForm.valid) {
      let data = this.myForm.value;
      data.reqPageId = this.reqPageId;
      this.checkboxControls.forEach(key => {
        data[key] = data[key] ? 'T' : 'F';
      });

      data.intakeOutcomeId = this.intakeOutcomeService.getIntakeOutcomeId();
      console.log("emergent circumstance form request", data);

      this.emergentCircumstancesFormService.saveEmergentCircunstancesForm(data).then(response => {
        this.emergentCircumstancesResponse = response;
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
}
