import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { QualifiedAssessorService } from '../service/qualified-assessor.service';
import * as customValidation from '../../_shared/constants/validation.constants';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-assessor-popup',
  templateUrl: './add-assessor-popup.component.html',
  styleUrls: ['./add-assessor-popup.component.scss']
})
export class AddAssessorPopupComponent implements OnInit, OnDestroy {

  addAssessorForm: FormGroup;
  entityData: any[] = [];
  programData: any[] = [];
  credentialData: any[] = [];
  customValidation = customValidation;
  minDate: Date;
  subscriptions$: any[] = [];

  constructor(private formBuilder: FormBuilder, public dialogRef: MatDialogRef<AddAssessorPopupComponent>,
              private qualifiedAssessorService: QualifiedAssessorService,
              private toastr: ToastrService,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.addAssessorForm = this.formBuilder.group({
      entity: ['',  Validators.required],
      program: ['',  Validators.required],
      firstName: ['',  Validators.required],
      lastName: ['',  Validators.required],
      startDate:['',  Validators.required],
      endDate:[{value: '', disabled: true}, Validators.required],
      credentials:['',  Validators.required],
    });
    this.entityData = this.data.entityData;
    this.programData = this.data.programData;
    this.credentialData = this.data.credentialData;
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 120, 0, 1);

  }

  programChanged(event){
    if (event.value === 'HCBS'){
      const filteredCredential = this.credentialData.filter( item => item.code !== 'EQ');
      this.credentialData = filteredCredential;
    } else {
      this.credentialData = this.data.credentialData;
    }
  }

  disableWeekendsFilter = (d: Date): boolean => {
    if (d !== null){
      const day = d.getDay();
      return day !== 0 && day !== 6;
    }
  }

  onStartDateChanged(): void {
    const startDate = this.addAssessorForm.value.startDate;
    if (new Date(startDate.getFullYear() + 1, startDate.getMonth() + 1, 0).getDay() === 0){
      const modifiedSundayEndDate = new Date(startDate.getFullYear() + 1, startDate.getMonth() + 1, 1);
      this.addAssessorForm.patchValue({
        endDate:modifiedSundayEndDate
        });
    } else if (new Date(startDate.getFullYear() + 1, startDate.getMonth() + 1, 0).getDay() === 6) {
      const modifiedSaturdayEndDate = new Date(startDate.getFullYear() + 1, startDate.getMonth() + 1, 1).setDate(2);
      this.addAssessorForm.patchValue({
        endDate:new Date(modifiedSaturdayEndDate)
      });
    } else {
      this.addAssessorForm.patchValue({
        endDate:new Date(startDate.getFullYear() + 1, startDate.getMonth() + 1, 0),
      });
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  getFormattedDate(date) {
    const year = date.getFullYear();
    let month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;
    let day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    return month + '/' + day + '/' + year;
  }

  addAssessorData(){
    let entityCd = '';
    const formData = this.addAssessorForm.getRawValue();
    this.entityData.forEach( data => {
      if (formData.entity === data.entityId){
        entityCd = data.entityType;
      }
    });
    const endDt = this.getFormattedDate(formData.endDate);
    const startDt = this.getFormattedDate(formData.startDate);
    const payLoad = {
      credentialsCd: formData.credentials,
      endDt,
      startDt,
      createdBy: 'TEST',
      entityId: parseInt(formData.entity),
      firstName: formData.firstName,
      lastName: formData.lastName,
      programCd: formData.program,
      entityCd
    };
    if (this.addAssessorForm.valid){
      const addAssessor$ = this.qualifiedAssessorService.addAssessor(payLoad).subscribe(res => {
        if (res && !res.errorCode) {
          this.toastr.success(res.successMsgDescription);
          this.dialogRef.close(res);
        } else {
          this.toastr.error('Error Ading Assessor Data');
        }
      }, error => {
        this.toastr.error('Error Adding Assessor Data');
      });
      this.subscriptions$.push(addAssessor$);
    }
  }

  ngOnDestroy() {
    if (this.subscriptions$ && this.subscriptions$.length > 0) {
      this.subscriptions$.forEach(subscription$ => subscription$.unsubscribe());
    }
  }


}
