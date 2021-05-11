import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import * as customValidation from '../../../../_shared/constants/validation.constants';
import { CustomvalidationService } from '../../../../_shared/utility/customvalidation.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { CommitteeReviewGroup7FormService } from './../../../../core/services/referral/referral-intake/committee-review-group7-form.service';
import { IntakeOutcomeService } from '../../../../core/services/referral/intake-outcome/intake-outcome.service';

@Component({
  selector: 'app-committee-review-group7-form',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './committee-review-group7-form.component.html',
  styleUrls: ['./committee-review-group7-form.component.scss']
})

export class CommitteeReviewGroup7FormComponent implements OnInit {
  myForm: FormGroup;
  customValidation = customValidation;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private customValidator: CustomvalidationService,
    private CommitteeReviewGroup7FormService: CommitteeReviewGroup7FormService,
    public dialogRef: MatDialogRef<CommitteeReviewGroup7FormComponent>,
    private intakeOutcomeService: IntakeOutcomeService
  ) { }

  ngOnInit(): void {
    this.myForm = this.fb.group({

      // credentialsCd: ['', [Validators.required]],
      // ecfQualAssessorCode: ['', [Validators.required, this.customValidator.specialCharacterValidator()]],
      electronicSignature: ['', [Validators.required, this.customValidator.specialCharacterValidator()]],
      famEngSupSw: ['', [Validators.required]],
      indvBehRiskHomeSw: ['', [Validators.required]],
      indvBehRiskHomeTxt: [''],
      indvCurrBehSupSw: ['', [Validators.required]],
      indvDvlpmntlIntlDisSw: ['', [Validators.required]],
      indvFamHigLvlSw:  ['', [Validators.required]],
      indvFamHigLvlTxt: [''],
      indvHmInadSupSw:  ['', [Validators.required]],
      indvHmInadSupTxt: [''],
      indvPsyclgclBehSympSw:  ['', [Validators.required]],
      indvPsyclgclBehSympTxt: [''],
      mcoRcmdGrp7Sw: ['', [Validators.required]],
    });

    this.intakeOutcomeId = this.intakeOutcomeService.getIntakeOutcomeId();
    let that = this;
    this.CommitteeReviewGroup7FormService.getcommitteeReviewForm(this.intakeOutcomeId).then(response => {
      let data = response.body;
      if (data.intakeOutcomeId != null) {
        Object.keys(this.myForm.controls).forEach(controlName => {
          let value = data[controlName];
          that.myForm.controls[controlName].setValue(value);
        });
        that.saved = true;
      }
    }).catch(reason => {
      console.log('loadCommitteeReviewForm error: ' + reason);
      that.saved = false;
    });

  }

  errorText: any = {
    credentialsCd: null, 
    ecfQualAssessorCode: null, 
    electronicSignature: null, 
    famEngSupSw:  null, 
    indvBehRiskHomeSw:  null, 
    indvBehRiskHomeTxt: null, 
    indvCurrBehSupSw: null, 
    indvDvlpmntlIntlDisSw:  null, 
    indvFamHigLvlSw:  null, 
    indvFamHigLvlTxt: null, 
    indvHmInadSupSw: null, 
    indvHmInadSupTxt: null, 
    indvPsyclgclBehSympSw: null, 
    indvPsyclgclBehSympTxt: null, 
    mcoRcmdGrp7Sw: null
  };

  intakeOutcomeId = null;
  saved = false;

  controlError(controlName: string) : boolean {
    try {
      let control = this.myForm.controls[controlName];
      let errorText: string = null;
      if ((control.touched || this.submitted ) && control.errors) {
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

  getFormData() {
    return this.myForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    let that = this;
    if (this.myForm.valid) {
      let data = this.myForm.value;
      data.intakeOutcomeId = this.intakeOutcomeService.getIntakeOutcomeId();
      data.reqPageId = 'REFRAL';
      this.CommitteeReviewGroup7FormService.savecommitteeReviewForm(data).then(response => {
        that.saved = true;
        console.log('Response:' + JSON.stringify(response, null, '  '));
        that.closePopup();
      }).catch(reason => {
        console.log('savecommitteeReviewForm error: ' + reason);
        that.saved = false;
      });
    }
  }

  credentialTable: Array<any> = [
    {code: "PH", text: "Physician"},
    {code: "NP", text: "Nurse Practitioner / Advanced Nurse Practitioner"},
    {code: "PA", text: "Physician Assistant"},
    {code: "RN", text: "Registered or Licensed Nurse"},
    {code: "LS", text: "Licensed Social Worker"},
    {code: "PS", text: "Licensed Clinical Psychologist"}
  ];
   
  closePopup() {
    this.intakeOutcomeService.setDialogResult('refIntakeReviewGrp7', this.saved);
    this.dialogRef.close();
  }
}
