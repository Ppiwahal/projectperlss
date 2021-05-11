import { Component, EventEmitter, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { PaeService } from '../../core/services/pae/pae.service';
import { CustomvalidationService } from '../../_shared/utility/customvalidation.service';
import * as customValidation from '../../_shared/constants/validation.constants';
import { PaeCertData } from 'src/app/_shared/model/PaeCertData';
import { HttpResponse } from '@angular/common/http';
import { PaeCommonService } from 'src/app/core/services/pae/pae-common/pae-common.service';

@Component({
  selector: 'app-pae-certification-of-assessment',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './pae-certification-of-assessment.component.html',
  styleUrls: ['./pae-certification-of-assessment.component.scss']
})
export class PaeCertificationOfAssessmentComponent implements OnInit {
  minDate: Date;
  maxDate: Date;
  dataSource : any;
  submitted = false;
  customValidation = customValidation;
  certOfAssessmentForm: FormGroup;
  paeId: any;
  paeCert: PaeCertData;
  certifierOfAccuracy: string;
  credentialsCd: string;
  id: number;
  reqPageId: string;
  uniqueQualifiedArray: any;
  qualifiedAssessorNameMap = new Map();
  uniqueCredentialsArray: unknown[];
  filteredData: any[];
  safetyAttestations: any;
  incorrectCode = false;
  iscertUploaded : boolean;
  credCd: any;
  qualifiedAssessorCd: any;
  qualifiedAssessor: any;
  certiDate: any;
  isAssessment: boolean;
  isecfProgram = false;
  isECFcredentials = false;
  isHCBScredentials = false;
  isPACECredentials = false;
  CredentialsArray: any = [];
  //@Output() popupSubmit = new EventEmitter;

  constructor(private fb: FormBuilder,
              private paeService: PaeService,
              private customValidator: CustomvalidationService,
              public dialogRef: MatDialogRef<PaeCertificationOfAssessmentComponent>,
              private paeCommonService: PaeCommonService) { }

  ngOnInit(): void {
    
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 119, 0, 1);
    this.maxDate = new Date();
    this.certOfAssessmentForm = this.fb.group({
      qualifiedAssessorName: ['', [Validators.required]],
         paeCrtfctnDt: ['', [Validators.required]],
          credentialsCd: ['', [Validators.required]],
          qualifiedAssessorDtl: ['', [Validators.required]],
        });
        this.getAccessorData();
        this.getCertOfAssessment(); 
        console.log(this.paeCommonService.getProgramName());

       if(this.paeCommonService.getProgramName() === 'EC4' || this.paeCommonService.getProgramName() === 'EC5' 
       || this.paeCommonService.getProgramName() === 'EC6' || this.paeCommonService.getProgramName() === 'EC7' || 
       this.paeCommonService.getProgramName() === 'EC8')
       {
         this.isECFcredentials = true;
       } else if (this.paeCommonService.getProgramName() === 'CG2')
       {
         this.isHCBScredentials = true;
       } else if (this.paeCommonService.getProgramName() === 'PACE')
       {
         this.isPACECredentials = true;
       }
        
  }

  getCertOfAssessment() {
    this.paeService.getCertificationOfAssessment(this.paeCommonService.getPaeId()).then((response)=> {
      console.log('getCertificationOfAssessment : ' + JSON.stringify(response));
      //this.dataSource = response;
      this.certiDate = response.paeCrtfctnDt;
      this.qualifiedAssessor = response.qualifiedAssessorId;
      this.qualifiedAssessorCd = response.qualifiedAssessorDtl;
      this.credCd = response.credentialsCd;
      console.log('Assessment Data:===>', this.certiDate, this.qualifiedAssessor,  this.qualifiedAssessorCd,  this.credCd);
      // this.certOfAssessmentForm.patchValue(this.certiDate, this.qualifiedAssessor);
      // this.certOfAssessmentForm.patchValue(this.credCd, this.qualifiedAssessorCd );
      if(response){
      this.certOfAssessmentForm.controls.qualifiedAssessorDtl.patchValue(this.qualifiedAssessorCd);
      //this.certOfAssessmentForm.controls.qualifiedAssessorName.patchValue(this.qualifiedAssessor);
      this.certOfAssessmentForm.controls.paeCrtfctnDt.patchValue(this.certiDate);
      this.certOfAssessmentForm.controls.credentialsCd.patchValue(this.credCd);
      }
      //this.certOfAssessmentForm.patchValue(response);
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
      for (let index = 0; index <  that.dataSource.length; index++) { 
        if(that.dataSource[index].statusCd === 'A' && that.dataSource[index].programCd === 'HCBS' || 
        that.dataSource[index].statusCd === 'A' && that.dataSource[index].programCd === 'PACE'){
         that.CredentialsArray.push(that.dataSource[index]);
         console.log(that.CredentialsArray);
         that.uniqueCredentialsArray = [...new Map(that.CredentialsArray.map(item =>
          [item[key], item])).values()];
        console.log(that.uniqueCredentialsArray);
        
        }
      }

      // that.uniqueCredentialsArray = [...new Map(getQualifier.body.map(item =>
      //   [item[key], item])).values()];
      // console.log(that.uniqueCredentialsArray);

      
     
	  
	  that.qualifiedAssessorNameMap.clear();
		for(const data of that.dataSource){
			that.qualifiedAssessorNameMap.set(data.assessorId, data.firstName + " " + data.lastName);
		}
		
    if(that.dataSource.programCd === 'EC4' || that.dataSource.programCd === 'EC5' || that.dataSource.programCd === 'EC6' || that.dataSource.programCd ==='EC7' || that.dataSource.programCd ==='EC8' || that.dataSource.programCd ==='ECF')
    {
      this.isecfProgram = true;
    }
    else if (that.dataSource.programCd === 'HCBS')
    {
      this.isecfProgram = false;
      this.isHCBScredentials = true;

    } else if (that.dataSource.programCd ==='PACE')
    {
      this.isPACECredentials = true;
      this.isecfProgram = false;
      this.isHCBScredentials = false;
    }
    
	  
	  const resp = that.paeService.getSafetyDeterminationForm(that.paeCommonService.getPaeId());    
	  resp.then(function(resp: HttpResponse<any>) {
      console.log("response===>" + JSON.stringify(resp));
      that.certOfAssessmentForm.patchValue(resp);
	  
		
		that.credChanged(that.getFormData().credentialsCd.value);
		that.getFormData().qualifiedAssessorName.patchValue(that.getFormData().qualifiedAssessorDtl.value);
		
    }); 
    }); 
    }
    

    credChanged(value) {
      this.filteredData = [];
      for (let index = 0; index <  this.dataSource.length; index++) { 
        if(this.dataSource[index].statusCd === 'A' && this.dataSource[index].programCd === 'HCBS' || 
        this.dataSource[index].statusCd === 'A' && this.dataSource[index].programCd === 'PACE'){
      this.filteredData = this.CredentialsArray.filter(item => item.credentialsCd === value);
    console.log(this.filteredData);
    }
  }
  }

  getFormData() {
    return this.certOfAssessmentForm.controls;
  }

  closePopup(){
    this.dialogRef.close({isUploaded: false});
  }

  submit() {
    this.submitted = true;
    this.reqPageId = "PPSCE"
    if(this.getFormData().qualifiedAssessorDtl.value === this.getFormData().qualifiedAssessorName.value){ 
    const name = this.qualifiedAssessorNameMap.get(this.getFormData().qualifiedAssessorName.value);
	  this.incorrectCode = false;
    this.paeId = this.paeService.getPaeId()
    this.paeCert = new PaeCertData(
      this.certifierOfAccuracy,
      this.getFormData().credentialsCd.value,
      this.id,
      this.getFormData().paeCrtfctnDt.value,
      this.paeId = this.paeCommonService.getPaeId(),
      this.getFormData().qualifiedAssessorDtl.value,
      name,
      this.reqPageId
    );
    this.paeService.addCertificationData(this.paeCert).subscribe((response)=>{
      console.log(response);
    });
    //this.popupSubmit.emit(this.submitted);
    this.dialogRef.close({isUploaded: true});
  }   

else
{
  this.incorrectCode = true;

}
  }

}
