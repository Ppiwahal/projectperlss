import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef, ChangeDetectionStrategy, ComponentRef } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { CustomvalidationService } from '../../../../_shared/utility/customvalidation.service';
import { ReferralService } from '../../../../core/services/referral/referral.service';
import * as customValidation from '../../../../_shared/constants/validation.constants';
import { PlannedTransitionFormService } from './../../../../core/services/referral/referral-intake/planned-transition-form.service';
import { IntakeOutcomeService } from '../../../../core/services/referral/intake-outcome/intake-outcome.service';
import { HttpResponse } from '@angular/common/http';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-planned-transition-popup',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './planned-transition-popup.component.html',
  styleUrls: ['./planned-transition-popup.component.scss'],
})
export class PlannedTransitionPopupComponent implements OnInit {

  myForm: FormGroup;
  customValidation = customValidation;
  get f() {
    return this.myForm.controls;
  };
  otherClicked = false;
  saved = false;
  errorText: any = {};
  submitted = false;
  checkboxControls = [
    'verifTrgtPopulnSw', 'adaptBehLsaResSw', 'legalDocsSw', 'phyclClinicalNoteSw', 'othrSw'
  ];

  constructor(
    private ref: ChangeDetectorRef,
    public dialogRef: MatDialogRef<PlannedTransitionPopupComponent>,
    private fb: FormBuilder,
    private customValidator: CustomvalidationService,
    private referralService: ReferralService,
    private intakeOutcomeService: IntakeOutcomeService,
    private plannedTransitionFormService: PlannedTransitionFormService
  ) { }

  ngOnInit(): void {

    this.myForm = this.fb.group({

      adaptBehLsaResSw: [''],
      amtTimeCareAsstTxt: [''],
      cannotLiveIndSupSw: ['', [Validators.required]],
      cargvrPartiPlanTxt: [''],
      cargvrPoorHlthSw: ['', [Validators.required]],
      currHlthCondTxt: [''],
      currLvngArrngTxt: [''],
      electronicSignature: ['', [Validators.required]],
      legalDocsSw: [''],
      naturalOnlyFmlySw: ['', [Validators.required]],
      needSupSmoothTrnstnSw: ['', [Validators.required]],
      notQualifiedEnrolPcTxt: [''],
      othrDesc: [''],
      othrSupAvailTxt: [''],
      othrSw: [''],
      personPartiPlanTxt: [''],
      phyclClinicalNoteSw: [''],
      prsnPartiPlanTxt: [''],
      rsnForPlannTrnstnTxt: [''],
      supCaregvrInhomeTxt: [''],
      verifTrgtPopulnSw: [''],
      willPartPlnndTrnstnSw: ['', [Validators.required]]
    });

    let that = this;
    Object.keys(this.myForm.controls).forEach(key => {
      that.errorText[key] = null;
    });

    this.plannedTransitionFormService.getPlannedTransitionForm(
      this.intakeOutcomeService.getIntakeOutcomeId()).then(response => {
        let data = response.body;
        if (data.intakeOutcomeId != null) {
          that.checkboxControls.forEach(key => {
            data[key] = data[key] === 'T';
          });
          that.myForm.patchValue(data);
          that.saved = true;
        }
      });
    
  }

  otherClick() {

    let that = this;
    let timeout = setTimeout(function () {
      let value = that.myForm.get('othrSw').value;
      that.otherClicked = value;
      that.myForm.get('othrDesc').setValidators(value === 'true' ? [Validators.required] : null);
    }, 100)
  }

  submit() {

    this.submitted = true;
    if (this.myForm.valid) {

      let data = this.myForm.value;
      data.reqPageId = 'RIOPTR';
      this.checkboxControls.forEach(key => {
        data[key] = data[key] ? 'T' : 'F';
      });

      data.intakeOutcomeId = this.intakeOutcomeService.getIntakeOutcomeId();
      console.log('Planned Transition Post:' + JSON.stringify(data, null, '  '));
      let that = this;

      this.plannedTransitionFormService.savePlannedTransitionForm(data).then(response => {
        that.saved = true;
        console.log('Response:' + JSON.stringify(response, null, '  '));
        that.closePopup();
      }).catch(reason => {
        console.log('PlannedTransitionForm error: ' + reason);
        that.saved = false;
      });
    }
  }

  getLength(controlName: string) {
    try {
      let value = this.myForm.controls[controlName].value;
      return value ? value.length : 0;
    } catch (e) {
      return 'Bad controlName: ' + controlName;
    }
  }

  controlError(controlName: string): boolean {
    try {
      let control = this.myForm.controls[controlName];
      let errorText: string = null;
      if ((control.touched || this.submitted) && control.errors) {
        if (control.errors.required) {
          errorText = this.customValidation.A1;
        } else if (control.errors.specialCharacterValidator) {
          errorText = this.customValidation.A2;
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

  closePopup() {
    this.intakeOutcomeService.setDialogResult('refIntakePlanTransRvw', this.saved);
    this.dialogRef.close();
  }
}
