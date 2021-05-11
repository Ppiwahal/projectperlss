import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaeMedPrognosis } from '../../_shared/model/PaeMedPrognosis';
import { PaeService } from '../../core/services/pae/pae.service';
import { PaeCommonService } from './../../core/services/pae/pae-common/pae-common.service';
import * as customValidation from '../../_shared/constants/validation.constants';
import { CustomvalidationService } from '../../_shared/utility/customvalidation.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { LeavePagePopupComponent } from 'src/app/leave-page-popup/leave-page-popup.component';
import { PaeFlowSeq } from 'src/app/_shared/utility/PaeFlowSeq';
import { SavePopupComponent } from 'src/app/savePopup/savePopup.component';
import { ComponentCanDeactivate } from 'src/app/core/helpers/pending-change.guard';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-pae-medical-prognosis',
  templateUrl: './pae-medical-prognosis.component.html',
  styleUrls: ['./pae-medical-prognosis.component.scss']
})
export class PaeMedicalPrognosisComponent implements OnInit, ComponentCanDeactivate {
  myForm: FormGroup;
  event: string;
  reqPageId: string;
  paeId: string = "PAE1000017";
  customValidation = customValidation;
  submitted = false;
  decHealthSelected =  false;
  decHealthNoneSelected = false;
  decHealthCheckboxSelectedCount = 0;
  pageId: string;
  isSamePageNavigation: boolean;
  applicantName: any;

  constructor(private fb: FormBuilder,
              private customValidator: CustomvalidationService,
              private paeService: PaeService,
              private paeCommonService: PaeCommonService,
              private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.pageId='PPPMP';
    this.paeId =this.paeCommonService.paeId;
    this.myForm = this.fb.group({
      aplcntEnrolHospicareSw: ['', [Validators.required]],
      rapidProgsiveDecSw: [''],
      slowProgsiveDecSw: [''],
      notApplicableSw: [''],
    });
    if (this.paeCommonService.getApplicantName() === null || this.paeCommonService.getApplicantName() === '' || this.paeCommonService.getApplicantName() === undefined) {
      this.getApplicantName();
    } else {
      this.applicantName = this.paeCommonService.getApplicantName();
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
    return this.myForm.controls;
  }

  onDeclineHealth(event) {
    if (event.checked) {
      this.decHealthCheckboxSelectedCount =
        this.decHealthCheckboxSelectedCount + 1;
    } else if (!event.checked) {
      this.decHealthCheckboxSelectedCount =
        this.decHealthCheckboxSelectedCount - 1;
    }
    if (this.decHealthCheckboxSelectedCount > 0) {
      this.decHealthSelected = true;
    } else {
      this.decHealthSelected = false;
    }
  }

  onNoneSelected(event) {
    if (event.checked) {
      this.decHealthNoneSelected = true;
    } else if (!event.checked) {
      this.decHealthNoneSelected = false;
    }
  }

  saveMedicalPrognosis(showPopUp?:boolean) {
    this.reqPageId = 'PPAEPA';
    if(this.myForm.valid){
    const paePriorMedicalPrognsisVO  = new PaeMedPrognosis(
      this.getFormData().aplcntEnrolHospicareSw.value,
      0,
      this.getFormData().notApplicableSw.value,
      this.paeId,
      this.getFormData().rapidProgsiveDecSw.value,
      this.reqPageId,
      this.getFormData().slowProgsiveDecSw.value
    );
    const response = this.paeService.savePaeMedicalPrognosis(paePriorMedicalPrognsisVO);
    response.then(result => {
      if(showPopUp){
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = { route: 'ltss/pae' };
       // dialogConfig.data = { route: 'ltss/pae' , nextRoute: '/ltss/pae/paeStart/' + this.nextPath };
        dialogConfig.panelClass = 'exp_popup';
        dialogConfig.width = '648px';
        dialogConfig.height = '360px';  
        this.dialog.open(SavePopupComponent, dialogConfig );
      }
    })
  }
    console.log(this.paeId);
  }

  goBack() {
    this.isSamePageNavigation =  true;
    this.paeService.getChidPageNavigation(this.paeId, this.pageId).subscribe(response => {
      const backPath = PaeFlowSeq[response.prevPageId];
      const path =  '/ltss/pae/paeStart/' + backPath;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = { route: path };
    dialogConfig.panelClass = 'exp_popup';
    dialogConfig.width = '648px';
    dialogConfig.height = '360px';
    this.dialog.open(LeavePagePopupComponent, dialogConfig);
   })
  }

  next(){
    this.isSamePageNavigation =  true;
    this.event = 'Next';
    this.submitted = true;    
    if (this.myForm.valid) {
      this.saveMedicalPrognosis();
    }
    console.log(this.myForm);
  }

  saveAndExit(){ 
      this.saveMedicalPrognosis(true); 
  }
  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    console.log(this.myForm) 
   return this.isSamePageNavigation ? true : !this.myForm.dirty;
  }

  resetForm(){
    this.myForm.reset();
  }
  
}
