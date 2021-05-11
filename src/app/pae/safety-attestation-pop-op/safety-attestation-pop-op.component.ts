import { SafetyAttestationForm } from './../../_shared/model/SafetyAttestationForm';
import { Component, HostListener, OnInit } from '@angular/core';
import { Form, FormBuilder, FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import * as customValidation from '../../_shared/constants/validation.constants';
import { CustomvalidationService } from '../../_shared/utility/customvalidation.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { PaeService } from 'src/app/core/services/pae/pae.service';
import { HttpResponse } from '@angular/common/http';
import { PaeFlowSeq } from '../../_shared/utility/PaeFlowSeq';
import { PaeCommonService } from './../../core/services/pae/pae-common/pae-common.service';
import { SavePopupComponent } from 'src/app/savePopup/savePopup.component';
import { ComponentCanDeactivate } from 'src/app/core/helpers/pending-change.guard';
import { Observable } from 'rxjs';

import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogConfig
} from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-safety-attestation-pop-op',
  templateUrl: './safety-attestation-pop-op.component.html',
  styleUrls: ['./safety-attestation-pop-op.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class SafetyAttestationPopOpComponent implements OnInit ,ComponentCanDeactivate {
  nextPath: string;

  uniqueCredentialsArray: any = [];
  safetyAttestations = [
    { selected: false, text: 'I do NOT believe this individual can be safely served in the community in CHOICES Group 5.', name: 'donotBelieveSw' },
    { selected: false, text: 'I believe this individual CAN be safely served in the community in CHOICES Group 5.', name: 'doBelieveSw' },
    { selected: false, text: 'This safety determination form was completed at the request of the applicant / representative.', name: 'reqApplcntSw' },
  ];
  incorrectCode: boolean = false;
  customValidation = customValidation;
  safetyJustificationList = [];
  pageId: string = 'PPSDF';
  applicantName: any;
  qualifiedAssessorNameMap = new Map();
  isSamePageNavigation: boolean;
  dataSource: any = [];
  filteredData: any = [];
  router: any;
  isCloseByXIcon = false;
  selected:any=true;
  credCd: any;
  qualifiedAssessorCd: any;
  qualifiedAssessor: any;
  certiDate: any;
  isAssessment: boolean;
  safetyAttestationForm:FormGroup;


  constructor(
    private fb: FormBuilder,
    private paeService: PaeService,
    private paeCommonService: PaeCommonService,
    private customValidationService: CustomvalidationService,
    private matDialogRef: MatDialogRef<SafetyAttestationPopOpComponent>,
    private dialog: MatDialog,
    private commm:CommonModule
    )
    {}
  resetForm() {
    throw new Error('Method not implemented.');
  }


  ngOnInit(): void {
    this.safetyAttestationForm = this.fb.group({
      credentialsCd: ['',[Validators.required, this.customValidationService.specialCharacterValidator()]],
      qualifiedAssessorId: ['', [Validators.required, this.customValidationService.specialCharacterValidator()]],
      qualifiedAssessorName: ['',[Validators.required, this.customValidationService.specialCharacterValidator()]],
      archivedDt: [null],
      doBelieveSw: [''],
      donotBelieveSw: [''],
      reqApplcntSw: [''],
    });

    if (this.paeCommonService.getApplicantName() === null || this.paeCommonService.getApplicantName() === '' || this.paeCommonService.getApplicantName() === undefined){
      this.getApplicantName();
    } else {
      this.applicantName =  this.paeCommonService.getApplicantName();
    }

    if (this.paeCommonService.getPaeId() !== null && this.paeCommonService.getPaeId() !== undefined) {
      this.getSafetyAttestionPopUpForm();
    }
this.getAccessorData();
this.getSafetyAttestionPopUpForm();


  }
  getFormData() {
    return this.safetyAttestationForm.controls;
  }

  getApplicantName(){
    this.paeService.getPaeApplicantInformation(this.paeCommonService.getPaeId(),this.pageId).then((response)=> {
      console.log("reponseforName"+JSON.stringify(response.body.firstName));
      this.applicantName =  response.body.firstName+" "+response.body.lastName;
	  this.paeCommonService.setApplicantName(this.applicantName);
    });
  }

  getSafetyAttestionPopUpForm(){
    this.paeService.getSafetyAttestionPopUpForm(this.paeCommonService.getPaeId()).then((response)=> {
      console.log("reponseforName"+JSON.stringify(response.body.firstName));
      this.applicantName =  response.body.firstName+" "+response.body.lastName;
	  this.paeCommonService.setApplicantName(this.applicantName);
    this.certiDate = response.paeCrtfctnDt;
    this.qualifiedAssessor = response.qualifiedAssessorId;
    this.qualifiedAssessorCd = response.qualifiedAssessorDtl;
    this.credCd = response.credentialsCd;
    if(response){
      this.safetyAttestationForm.controls.qualifiedAssessorDtl.patchValue(this.qualifiedAssessorCd);
      this.safetyAttestationForm.controls.paeCrtfctnDt.patchValue(this.certiDate);
      this.safetyAttestationForm.controls.credentialsCd.patchValue(this.credCd);
      }
    });
  }

  getAccessorData() {
    const localStorageLocal = localStorage.getItem('APP_STORAGE_TOKEN');
    const entityId = JSON.parse(localStorageLocal).entityId;
    const that = this;
    const getQualifier = this.paeService.getQualifierInfo(entityId);
    getQualifier.then(function (getQualifier: HttpResponse<any>) {
      console.log("getQualifier Info===>" + JSON.stringify(getQualifier));
      that.dataSource = getQualifier.body;
      console.log(JSON.stringify(getQualifier.body));
      const key = 'credentialsCd';
      that.uniqueCredentialsArray = [...new Map(getQualifier.body.map(item =>
        [item[key], item])).values()];
      console.log(that.uniqueCredentialsArray);

	  that.qualifiedAssessorNameMap.clear();
		for(const data of that.dataSource){
			that.qualifiedAssessorNameMap.set(data.assessorId, data.firstName + " " + data.lastName);
		}


	  const resp = that.paeService.getSafetyAttestionPopUpForm(that.paeCommonService.getPaeId());
	  resp.then(function(resp: HttpResponse<any>) {
      console.log("response===>" + JSON.stringify(resp));
      that.safetyAttestationForm.patchValue(resp);
	  for(const items of that.safetyAttestations)
		{
			if(items.name==='doBelieveSw'){
				if(that.getFormData().doBelieveSw.value==='Y'){
					items.selected=true;
				}
			}
			if(items.name==='donotBelieveSw'){
				if(that.getFormData().donotBelieveSw.value==='Y'){
					items.selected=true;
				}
			}
			if(items.name==='reqApplcntSw'){
				if(that.getFormData().reqApplcntSw.value==='Y'){
					items.selected=true;
				}
			}
		}
		that.credChanged(that.getFormData().credentialsCd.value);
		that.getFormData().qualifiedAssessorName.patchValue(that.getFormData().qualifiedAssessorId.value);
    });
    });
  }
  saveSafetyAttestionPopUpForm(showPopup?: boolean) {
    this.isSamePageNavigation =  true;
    console.log(this.getFormData().qualifiedAssessorName.value);
    if(this.getFormData().qualifiedAssessorId.value === this.getFormData().qualifiedAssessorName.value){
		let doBelieveSw='N';
		let donotBelieveSw='N';
		let reqApplcntSw='N';
		for(const items of this.safetyAttestations)
		{
			if(items.selected===true){
				if(items.name==='doBelieveSw'){
					doBelieveSw='Y';
				}
				if(items.name==='donotBelieveSw'){
					donotBelieveSw='Y';
				}
				if(items.name==='reqApplcntSw'){
					reqApplcntSw='Y';
				}
			}
		}

      const name = this.qualifiedAssessorNameMap.get(this.getFormData().qualifiedAssessorName.value);
	  this.incorrectCode = false;
      console.log("yes");
      const safetyAttestationFormVO = new SafetyAttestationForm(
        this.getFormData().qualifiedAssessorId.value,
        name,
        this.getFormData().credentialsCd.value,
        doBelieveSw,
        donotBelieveSw,
        reqApplcntSw,
        this.paeCommonService.getPaeId(),
        'admin',
        '2021-01-05T00:00:00.000+00:00',
        this.pageId,
      );

      const response = this.paeService.saveSafetyAttestionPopUpForm(safetyAttestationFormVO);
      this.matDialogRef.close({isUploaded: true});
    }
    else{
      this.incorrectCode=true;
    }
  }


  credChanged(value) {
    this.filteredData = [];
    this.filteredData = this.dataSource.filter(item => item.credentialsCd === value);
	console.log(this.filteredData);
  }


  sendingYorN(input: boolean) {
    if (input === true) {
      return 'Y';
    } else if (input === false) {
      return 'N';
    }
  }

back(){
  this.matDialogRef.close();
}
isQualifiedAccessorNameCodeMatch(control: string) {
  //TODO: Logic to check code and name match
  this.safetyAttestationForm.controls[control].setErrors({ error: true })
  return true;
}
isAccessorCodeValid(control: string) {
  //TODO: Logic to check code and name match
  this.safetyAttestationForm.controls[control].setErrors({ error: true })
  return true;
}
isAccessorCodeExpired(control: string) {
  //TODO: Logic to check code and name match
  this.safetyAttestationForm.controls[control].setErrors({ error: true })
  return true;
}
markFormGroupTouched = (formGroup) => {
  (<any>Object).values(formGroup.controls).forEach(control => {
    control.markAsTouched();

    if (control.controls) {
      this.markFormGroupTouched(control);
    }
  });
};
callTestModal(){    //     width: '850px',
//     height: '500px'
//   };
if (this.safetyAttestationForm.valid) {
  this.saveSafetyAttestionPopUpForm(true)
  this.matDialogRef.close();
}
}


@HostListener('window:beforeunload')
canDeactivate(): Observable<boolean> | boolean {
  console.log(this.safetyAttestationForm)
 return this.isSamePageNavigation ? true : !this.safetyAttestationForm.dirty;
}

 closePopup() {
  this.matDialogRef.close({isUploaded:false});
}
}

