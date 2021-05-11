import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { CustomvalidationService } from '../../utility/customvalidation.service';
import * as customValidation from '../../constants/validation.constants';

@Component({
  selector: 'app-safety-determination-admission-popup',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './safety-determination-admission-popup.component.html',
  styleUrls: ['./safety-determination-admission-popup.component.scss']
})
export class SafetyDeterminationAdmissionPopupComponent implements OnInit {
  customValidation = customValidation;
  admissionInfoForm: FormGroup;
  admissionTypes = [{
    code: 1,
    text: 'Hospital Admission'
  },{
    code: 2,
    text: 'ER Visit'
  },{
    code: 3,
    text: 'NF Admission'
  }];
  constructor(public dialogRef: MatDialogRef<SafetyDeterminationAdmissionPopupComponent>, 
  private fb: FormBuilder, private customValidationService: CustomvalidationService) {
    this.admissionInfoForm = this.fb.group({
      admissions: this.fb.array([]),
      reason: ['']
    });
  }
  get getAdmissionInfoForm() {
    return this.admissionInfoForm.controls;
  }
  ngOnInit(): void {
    this.addNewAdmission();
  }
  addNewAdmission() {
(this.getAdmissionInfoForm.admissions as FormArray).push(this.fb.group({
    type: [null, []], admitDate: [null, [this.customValidationService.dateInFuture(), this.customValidationService.datePriorToInitialDate()]], dischargeDate: [null, [this.customValidationService.dateInFuture(), this.customValidationService.datePriorToInitialDate()]]
    }))
  }
  checkIfDateSelectedTypeEmpty(rowGroup) {
  if((rowGroup.controls.admitDate.value || rowGroup.controls.dischargeDate.value) && !rowGroup.controls.type.value) {
    rowGroup.controls.type.setErrors({typeRequiredWhenDateSet: true})
  }
    
  }
  deleteAdmission(index: number) {
    (this.getAdmissionInfoForm.admissions as FormArray).removeAt(index);
  }
  closePopup() {
    this.dialogRef.close();
  }
  testFun(vvv){
  console.log();
  }
}
