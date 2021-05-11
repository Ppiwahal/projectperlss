import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import * as customValidation from '../../../../_shared/constants/validation.constants';
import { CustomvalidationService } from '../../../../_shared/utility/customvalidation.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { RecommendationForm } from './../../../../_shared/model/Forms/RecommendationForm';
import { RefIntakeOutComes } from './../../../../_shared/model/Forms/RefIntakeOutComes';
import { RrefRequest } from './../../../../_shared/model/Forms/RrefRequest';
import { RecommendationFormService } from './../../../../core/services/referral/referral-intake/recommendation-form.service';
import { IntakeOutcomeService } from 'src/app/core/services/referral/intake-outcome/intake-outcome.service';
import { MatCheckbox } from '@angular/material/checkbox';


@Component({
  selector: 'app-recomemendation-form',
  templateUrl: './recommendation-form.component.html',
  styleUrls: ['./recommendation-form.component.scss']
})
export class RecommendationFormComponent implements OnInit {
  recommendationFormGroup: FormGroup;
  customValidation = customValidation;
  dateOfBirth = '05/04/2010';
  submitted = false;
  public callPut : boolean = false;
   currentAge: any;
   refId:any;
   recommendationDetailsData:any;
   intakeOutcomeId: any;
   falseValue: any = 'N'
   trueValue: any = 'Y';
   saved = false;
   public vm = {intensiveCheckboxModel2 : false, intensiveCheckboxModel3 : false}

   public cm = {comprehensiveCheckboxModel2 : false, comprehensiveCheckboxModel3 : false}

  constructor(private fb: FormBuilder,
              private customValidator: CustomvalidationService,
              private recommendationFormService: RecommendationFormService,
              public dialogRef: MatDialogRef<RecommendationFormComponent>,
              private intakeOutcomeService: IntakeOutcomeService)
  {

 this.recommendationFormGroup = fb.group({​​​​​​​

       intensiveCheckboxGroup: new FormGroup({
      intensiveCheckbox1: new FormControl(''),
      intensiveCheckbox2: new FormControl(''),
      intensiveCheckbox3: new FormControl(''),
    }, this.customValidator.requireCheckboxesToBeCheckedValidator()),

    comprehensiveCheckboxGroup: new FormGroup({
       comprehensiveCheckbox1: new FormControl(''),
       comprehensiveCheckbox2: new FormControl(''),
       comprehensiveCheckbox3: new FormControl(''),
    }, this.customValidator.requireCheckboxesToBeCheckedValidator()),
    electronicSignature: ['', [Validators.required, this.customValidator.specialCharacterValidator()]],
    credentials: ['', [Validators.required]],
    recommendationDate: ['', [Validators.required,this.customValidator.dateInFuture(), this.customValidator.datePriorToInitialDate()]],
    intakeOutcomeId: this.intakeOutcomeService.getIntakeOutcomeId(),
  })

 this.currentAge = this.ageFromDateOfBirthday(this.dateOfBirth);
 console.log(' this.currentAge : ' +  this.currentAge);
}

  getIntensiveForm() {
    return this.recommendationFormGroup.controls.intensiveCheckboxGroup;
  }

  getComprehensiveForm() {
    return this.recommendationFormGroup.controls.comprehensiveCheckboxGroup;
  }
  async onSubmit() {
      this.submitted = true;
    try {
      if(this.recommendationFormGroup.errors == null && this.submitted) {

      const formValue = this.recommendationFormGroup.value;
      const group7FormValue = this.recommendationFormGroup.controls.intensiveCheckboxGroup.value;
      const group8FormValue = this.recommendationFormGroup.controls.comprehensiveCheckboxGroup.value;
      const RecommendationFormsValue = new RecommendationForm(
        "",
        formValue.credentials,
        formValue.electronicSignature,
        group7FormValue.intensiveCheckbox3,
        group8FormValue.comprehensiveCheckbox3,
        formValue.recommendationDate,
        group7FormValue.intensiveCheckbox2,
        group8FormValue.comprehensiveCheckbox2,
        group7FormValue.intensiveCheckbox1,
        group8FormValue.comprehensiveCheckbox1,
        formValue.intakeOutcomeId
      );
      console.log("Recommendation form", RecommendationFormsValue);

        if(this.callPut){
        const response = await this.recommendationFormService.updateRecommendationForm({
          ...RecommendationFormsValue,
        });
        this.saved=true;
        this.closePopup();
        console.log(response);
        }else {
        const response = await this.recommendationFormService.saveRecommendationForm({
          ...RecommendationFormsValue,
        });
        this.saved=true;
        this.closePopup();
        console.log(response);
        }
    }

    } catch (e) {
      console.log(e);
    }
  }

  checkboxChange(checkbox: MatCheckbox, checked: boolean) {
    checkbox.value = checked ? this.trueValue : this.falseValue;
  }

public intensiveCheckboxMethod2(intensiveCheckbox2){
  this.vm.intensiveCheckboxModel2 = true;
  this.vm.intensiveCheckboxModel3 = false;
  this.getIntensiveForm().get('intensiveCheckbox2').setValue('Y');
}

public intensiveCheckboxMethod3(intensiveCheckbox3){
     this.vm.intensiveCheckboxModel2 = false;
     this.vm.intensiveCheckboxModel3 = true;
     this.getIntensiveForm().get('intensiveCheckbox3').setValue('Y');
 }

 public comprehensiveCheckboxMethod2(comprehensiveCheckbox2){
  this.cm.comprehensiveCheckboxModel2 = true;
  this.cm.comprehensiveCheckboxModel3 = false;
  this.getComprehensiveForm().get('comprehensiveCheckbox2').setValue('Y');
}

public comprehensiveCheckboxMethod3(comprehensiveCheckbox3){
     this.cm.comprehensiveCheckboxModel2 = false;
     this.cm.comprehensiveCheckboxModel3 = true;
     this.getComprehensiveForm().get('comprehensiveCheckbox3').setValue('Y');
 }


  ngOnInit(): void {
    this.refId = "RECOMMENDATION_FORM_7";
    this.intakeOutcomeId = this.intakeOutcomeService.getIntakeOutcomeId();
    // this.searchAuditDetailParentId = this.auditDetailsService.getAuditSearchParentId();
    // if (this.searchAuditDetailParentId != null) {
      // console.log(this.searchAuditDetailParentId);
      this.recommendationFormService.getRecommendationDetails(this.refId).subscribe(
        data => {
          console.log('HTTP response RECOMMENDATION_FORM_7 : ' + JSON.stringify(data));
          this.recommendationDetailsData = data;
          this.callPut = false;
        },
        err =>{
          this.callPut = true;
         console.log('HTTP Error', err)
      },
        () => console.log('HTTP request completed.'));
    // } else {
    //   this.router.navigate(['/ltss/auditHistory']);
    // }
  }


  closePopup() {
    this.intakeOutcomeService.setDialogResult('refIntakeRecommendationForm', this.saved);
    this.dialogRef.close();
  }
  public ageFromDateOfBirthday(dateOfBirth: any): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  }
}
