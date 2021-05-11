import { Component, HostListener, OnInit } from '@angular/core';
import * as customValidation from '../../../_shared/constants/validation.constants';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SavePopupComponent } from '../../../../app/savePopup/savePopup.component';
import { PaeMedicalRegimenService } from '../../../core/services/pae/pae-prioritization-details/pae-medical-regimen.service';
import { PaeService } from 'src/app/core/services/pae/pae.service';
import { PaeCommonService } from 'src/app/core/services/pae/pae-common/pae-common.service';
import { ComponentCanDeactivate } from 'src/app/core/helpers/pending-change.guard';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-pae-medical-regimen',
  templateUrl: './pae-medical-regimen.component.html',
  styleUrls: ['./pae-medical-regimen.component.scss'],
})
export class PaeMedicalRegimenComponent implements OnInit , ComponentCanDeactivate{
  medicalRegimenList = [
    {
      code: 'IV',
      value: 'IV or G-tube medications',
      activateSW: 'Y',
      formControlName: 'ivGtubeMedSw',
    },
    {
      code: 'IA',
      value: 'Insulin administration for Type 1 diabetes',
      activateSW: 'Y',
      formControlName: 'insuAdmType1DiabtSw',
    },
    {
      code: 'DI',
      value: 'Daily inhaler or nebulizer treatments',
      activateSW: 'Y',
      formControlName: 'dlyInhleNebulTreatSw',
    },
    {
      code: 'ME',
      value: 'Medications to be crushed before consumption',
      activateSW: 'Y',
      formControlName: 'medCrushConsumpSw',
    },
    {
      code: 'IM',
      value: 'Implanted medication device (baclofen pump, insulin pump, vagal nerve stimulator, etc.)',
      activateSW: 'Y',
      formControlName: 'implantMedDeviceSw',
    },
    {
      code: 'PRN',
      value: 'PRN med for behaviors admin at least 1x/week',
      activateSW: 'Y',
      formControlName: 'prnBehvAdmSw',
    },
    {
      code: 'RM',
      value: 'Rescue medication for seizures prescribed and administed within last 6 months (e.g. Diastat, midazolam)',
      activateSW: 'Y',
      formControlName: 'rescuMedSezureSw',
    },
    {
      code: 'RMR',
      value: 'Rescue medication for respiratory distress or increase in prescribed respiratory medications needed as directed by treating physician for flare ups and used at least twice in past 6 months',
      activateSW: 'Y',
      formControlName: 'rescuMedRespirDisSw',
    },
    {
      code: 'NO',
      value: 'None of the above',
      activateSW: 'Y',
      formControlName: 'noneAboveSw',
    },
  ];
  medicalRegimenMap1 = new Map();
  medicalRegimenMap2 = new Map();
  otherCheckboxSelected = false;
  noneCheckBoxSelected = false;
  submitted = false;
  customValidation = customValidation;
  otherCheckboxCounter = 0;
  medicalRegimenForm: FormGroup;
  paeId: string;
  reqPageId: string;
  pageId: string = 'PPPMR';
  applicantName: any;
  enhancedRespiratoryCareForm: any;
  isSamePageNavigation: boolean;
  constructor(private fb: FormBuilder,
              private dialog: MatDialog,
              private paeService:PaeService,
              private paeCommonService: PaeCommonService,
              public paeMedicalRegimenService: PaeMedicalRegimenService) {}

  ngOnInit(){
    this.reqPageId='PPPMR';
    this.medicalRegimenForm = this.fb.group({
      reqComplxMediOrallySw: [null, Validators.required],
      ivGtubeMedSw: [null],
      insuAdmType1DiabtSw: [null],
      dlyInhleNebulTreatSw: [null],
      medCrushConsumpSw: [null],
      implantMedDeviceSw: [null],
      prnBehvAdmSw: [null],
      rescuMedSezureSw: [null],
      rescuMedRespirDisSw: [null],
      noneAboveSw: [null]
    });
    if (this.paeCommonService.getApplicantName() === null || this.paeCommonService.getApplicantName() === '' || this.paeCommonService.getApplicantName() === undefined){
		this.getApplicantName();
	} else {
		this.applicantName =  this.paeCommonService.getApplicantName();
	}
    for (const i of this.medicalRegimenList){
      this.medicalRegimenMap1.set(
        i.code, i.value
      );
    }

    for (const i of this.medicalRegimenList){
      this.medicalRegimenMap2.set(
        i.code, i.formControlName
      );
    }


  }

  getApplicantName(){
    this.paeService.getPaeApplicantInformation(this.paeCommonService.getPaeId(),this.pageId).then((response)=> {
      console.log("reponseforName"+JSON.stringify(response.body.firstName));
      this.applicantName =  response.body.firstName+" "+response.body.lastName;
	  this.paeCommonService.setApplicantName(this.applicantName);
    });
  }

  getFormData() {
    return this.medicalRegimenForm.controls;
  }

  checkboxSelected(event){
    if (event.checked === true && event.source.value !== 'NO') {
      const formControlNameForCheckBox = this.medicalRegimenMap2.get(event.source.value);
      this.getFormData()[formControlNameForCheckBox].patchValue('Y');
      this.otherCheckboxCounter = this.otherCheckboxCounter + 1;
    }
    else if (event.checked === false && event.source.value !== 'NO') {
      const formControlNameForCheckBox = this.medicalRegimenMap2.get(event.source.value);
      this.getFormData()[formControlNameForCheckBox].patchValue('N');
      this.otherCheckboxCounter = this.otherCheckboxCounter - 1;
    }
    else if (event.checked === true && event.source.value === 'NO') {
      this.getFormData().noneSw.patchValue('Y');
      this.noneCheckBoxSelected = true;
    }
    else if (event.checked === false && event.source.value === 'NO') {
      this.getFormData().noneSw.patchValue('N');
      this.noneCheckBoxSelected = false;
    }

    if (this.otherCheckboxCounter > 0) {
      this.otherCheckboxSelected = true;
    }
    else if (this.otherCheckboxCounter === 0){
      this.otherCheckboxSelected = false;
    }
  }

  saveAndExit() {
     this.saveMedicalRegimenForm (true) 
    // if (this.submitted) {
    //   const dialogConfig = new MatDialogConfig();
    //   dialogConfig.data = { route: 'ltss/pae' };
    //   dialogConfig.panelClass = 'exp_popup';
    //   dialogConfig.width = '648px';
    // dialogConfig.height = '360px';

    //   this.dialog.open(SavePopupComponent, dialogConfig );
    // }
  }
  back(){
    this.isSamePageNavigation =  true;
    this.paeService.navigateToChildPreviousPage(this.reqPageId);
  }
  saveMedicalRegimenForm(showPopUp?:boolean){
    this.submitted = true;
    if ((this.otherCheckboxSelected && this.noneCheckBoxSelected) || (!this.otherCheckboxSelected && !this.noneCheckBoxSelected)){
      this.medicalRegimenForm.setErrors({checkBoxError: true});
    }
    if (this.medicalRegimenForm.valid) {
      this.paeId = 'Test';
      this.reqPageId = 'Test';
      const response = this.paeMedicalRegimenService
      .saveMedicalRegimenForm({...this.medicalRegimenForm.value, paeId:this.paeId, reqPageId:this.reqPageId});
      response.then(data => {
          console.log(data);
          if(showPopUp){
            const dialogConfig = new MatDialogConfig();
            dialogConfig.data = { route: 'ltss/pae' };
           // dialogConfig.data = { route: 'ltss/pae' , nextRoute: '/ltss/pae/paeStart/' + this.nextPath };
            dialogConfig.panelClass = 'exp_popup';
            dialogConfig.width = '648px';
            dialogConfig.height = '360px';  
            this.dialog.open(SavePopupComponent, dialogConfig );
          } 
        });
    }
  }
  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    console.log(this.medicalRegimenForm) 
   return this.isSamePageNavigation ? true : !this.medicalRegimenForm.dirty;
  }

  resetForm(){
    this.medicalRegimenForm.reset();
  }
}
