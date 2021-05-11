import { Component, Input, OnInit, EventEmitter, Output, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import * as customValidation from '../../../_shared/constants/validation.constants';
import { EditAssessorPopupComponent } from '../edit-assessor-popup.component';

@Component({
  selector: 'app-edit-assessor',
  templateUrl: './edit-assessor.component.html',
  styleUrls: ['./edit-assessor.component.scss']
})
export class EditAssessorComponent implements OnInit, OnChanges {

  @Input() statusDropDownValues: any;
  @Input() editAssessorData: any;
  @Input() credentialOptions: any;
  @Input() entityData: any;
  @Output() updateAssessorDataCallback: EventEmitter<any> = new EventEmitter<any>();
  editAssessorForm: FormGroup;
  showPlus = true;
  customValidation = customValidation;
  selected: any;
 maxDate: Date;
  constructor(private formBuilder: FormBuilder, public dialogRef: MatDialogRef<EditAssessorPopupComponent>) { }

  ngOnInit(): void {
    this.editAssessorForm = this.formBuilder.group({
      assessorCode: [{value: '', disabled: true}],
      entity: [{value: '', disabled: true}],
      firstName: ['',  Validators.required],
      lastName: ['',  Validators.required],
      credentials:['',  Validators.required],
      program: [{value: '', disabled: true}],
      startDate:[{value: '', disabled: true}],
      endDate:[{value: '', disabled: true}],
      status:['',  Validators.required],
      recertificationDate:['']
    });
    this.setFormValues();
   this.maxDate = new Date();
  }

  getFormData() {
    return this.editAssessorForm.controls;
  }

  ngOnChanges() {
    this.setFormValues();
  }

  setFormValues() {
    if (this.editAssessorData !== undefined && this.editAssessorForm) {
      // this.selected = this.entityData.entityId;
      // this.entityData.forEach(element => {
      //   if (element.entityName === this.editAssessorData.entityId.toString()) {
      //     this.selected = element.entityId;
      //     console.log(element);
      //   }
      // });
      let startDate  = new Date(this.editAssessorData.startDt);
      startDate =  new Date(startDate.setMinutes( startDate.getMinutes() + startDate.getTimezoneOffset()));
      let endDate  = new Date(this.editAssessorData.endDt);
      endDate = new Date(endDate.setMinutes( endDate.getMinutes() + endDate.getTimezoneOffset()));

      this.credentialOptions.forEach(ele => {
        if (this.editAssessorData.credentialsCd === ele.value) {
          this.editAssessorData.credentialsCd = ele.code;
        }
      });

      this.statusDropDownValues.forEach(ele => {
        if (this.editAssessorData.statusCd === ele.value) {
          this.editAssessorData.statusCd = ele.code;
        }
      });
      
      this.editAssessorForm.patchValue({
        assessorCode: this.editAssessorData.assessorId,
        entity:this.editAssessorData.entityId.toString(),
        firstName:this.editAssessorData.firstName,
        lastName:this.editAssessorData.lastName,
        credentials:this.editAssessorData.credentialsCd,
        program:this.editAssessorData.programCd,
        startDate,
        endDate,
        status:this.editAssessorData.statusCd,
        recertificationDate: this.editAssessorData.recertificationDate
      });
      if (this.editAssessorData.programCd === 'HCBS'){
        const filteredCredential = this.credentialOptions.filter( item => item.code !== 'EQ');
        this.credentialOptions = filteredCredential;
      }
    }
  }

  addRecertification(){
    this.showPlus = !this.showPlus;
  }

  disableWeekendsFilter = (d: Date): boolean => {
    if (d) {
      const day = d.getDay();
      return day !== 0 && day !== 6;
    }
  }



  onRecertificationDateChanged(): void {
    const recertificationDate = this.editAssessorForm.value.recertificationDate;
    if (new Date(recertificationDate.getFullYear() + 1, recertificationDate.getMonth() + 1, 0).getDay() === 0){
      const modifiedSundayDate = new Date(recertificationDate.getFullYear() + 1, recertificationDate.getMonth() + 1, 1);
      this.editAssessorForm.patchValue({
          endDate:modifiedSundayDate
        });
    } else if (new Date(recertificationDate.getFullYear() + 1, recertificationDate.getMonth() + 1, 0).getDay() === 6) {
      const modifiedSaturdayDate = new Date(recertificationDate.getFullYear() + 1, recertificationDate.getMonth() + 1, 1).setDate(2);
      this.editAssessorForm.patchValue({
        endDate:new Date(modifiedSaturdayDate)
      });
    } else {
      this.editAssessorForm.patchValue({
        endDate:new Date(recertificationDate.getFullYear() + 1, recertificationDate.getMonth() + 1, 0),
      });
    }
    this.editAssessorForm.patchValue({
      recertificationDate: this.editAssessorForm.value.recertificationDate
    });
  }

  saveAccessorData() {
    this.updateAssessorDataCallback.emit(this.editAssessorForm.getRawValue());
  }

}
