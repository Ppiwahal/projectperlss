import { MultipleComplexFormService } from '../../../../core/services/referral/referral-intake/multiple-complex-form.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as customValidation from '../../../../_shared/constants/validation.constants';
import { CustomvalidationService } from '../../../../_shared/utility/customvalidation.service';
import { MatDialogRef} from '@angular/material/dialog';
import { IntakeOutcomeService } from '../../../../core/services/referral/intake-outcome/intake-outcome.service';

@Component({
  selector: 'app-multiple-complex-form',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './multiple-complex-form.component.html',
  styleUrls: ['./multiple-complex-form.component.scss']
})
export class MultipleComplexFormComponent implements OnInit {

  myForm: FormGroup;
  submitted = false;
  otherClicked = false;
  customValidation = customValidation;
  reqPageId: string;
  saved = false;
  errorText: any = {};
  checkboxControls: Array<string> = ['complxChrHlthCndtnSw', 'condExpctdContSw','hlthSignifiBarEmpSw','urgntNeedOfSupSw',
  'legalDocsSw','mediDocumentationSw','adaptBehLsaResSw','phyclClinicalNoteSw','verifTrgtPopulatinSw','othrSw'];
  intakeOutcomeId: string;

  constructor(
    private fb: FormBuilder,
    private customValidator: CustomvalidationService,
    private multipleComplexFormService: MultipleComplexFormService,
    public dialogRef: MatDialogRef<MultipleComplexFormComponent>,
    private intakeOutcomeService: IntakeOutcomeService
  ) { }

  ngOnInit(): void {
    this.myForm = this.fb.group({

      antiChngsExpTimeTxt: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9\' \-]+$')]],
      cmpxHlthCondDiagTxt: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9\' \-]+$')]],
      hlthCndBarEmpTxt: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9\' \-]+$')]],
      hlthCndDlyLifeTxt: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9\' \-]+$')]],
      intakeAssesObsrvTxt: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9\' \-]+$')]],
      othrSupResTxt: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9\' \-]+$')]],
      prsnNeedAddSupTxt: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9\' \-]+$')]],
      prsnSupTxt: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9\' \-]+$')]],
      optDidNotWorkTxt: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9\' \-]+$')]],
      qualifiedEnrolPriCatTxt: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9\' \-]+$')]],
      treatRcvdHlthCndTxt: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9\' \-]+$')]],

      complxChrHlthCndtnSw: ['', [Validators.required]],
      condExpctdContSw: ['', [Validators.required]],
      hlthSignifiBarEmpSw: ['', [Validators.required]],
      urgntNeedOfSupSw: ['', [Validators.required]],
      legalDocsSw: [null],
      mediDocumentationSw: [null],
      adaptBehLsaResSw: [null],
      phyclClinicalNoteSw: [null],
      verifTrgtPopulatinSw: [null],
      othrSw: [''],
      othrDesc: [''],
      electronicSignature: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9\' \-]+$')]]
    });
    
    this.intakeOutcomeId = this.intakeOutcomeService.getIntakeOutcomeId();
    let that = this;
    this.multipleComplexFormService.getMultipleComplexForm(this.intakeOutcomeId).then(response => {
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
      console.log('loadMultipleComplexFormError error: ' + reason);
      that.saved = false;
    });
  }

  get f() {
    return this.myForm.controls;
  };

  closePopup() {
    this.intakeOutcomeService.setDialogResult('refIntakeComplxCondRvw', this.saved);
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
      data.reqPageId = 'RIOPTR';
      this.checkboxControls.forEach(key => {
        data[key] = data[key] ? 'T' : 'F';
      });

      data.intakeOutcomeId = this.intakeOutcomeService.getIntakeOutcomeId();
      
      this.multipleComplexFormService.saveMultipleComplexForm(data).then(response => {
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
