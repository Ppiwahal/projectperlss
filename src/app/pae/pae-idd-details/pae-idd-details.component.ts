import { Component, HostListener, OnInit, ViewEncapsulation } from '@angular/core';
import * as customValidation from '../../_shared/constants/validation.constants';
import { CustomvalidationService } from '../../_shared/utility/customvalidation.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';


import { PaeIntelDisabilityDetailsForm } from '../../_shared/model/PaeIntelDisabilityDetailsForm'

import { PaeService } from '../../core/services/pae/pae.service';
import { SavePopupComponent } from 'src/app/savePopup/savePopup.component';
import { ComponentCanDeactivate } from 'src/app/core/helpers/pending-change.guard';
import { Observable } from 'rxjs';
import { PaeCommonService } from 'src/app/core/services/pae/pae-common/pae-common.service';

@Component({
  selector: 'app-pae-idd-details',
  templateUrl: './pae-idd-details.component.html',
  styleUrls: ['./pae-idd-details.component.scss']
})
export class PaeIddDetailsComponent implements OnInit, ComponentCanDeactivate {
  paeIddDetailsFormGroup: FormGroup;
  customValidation = customValidation;
  submitted = false;
  dataSource: any;
  pageId: string;
  public iQScore: any;
  public iDDType: any;
  public dailyAssistance: any;
  isSamePageNavigation: boolean;
  isfullScale = false;
  isintellectual = false;
  isAssistance = false;
  applicantName: any;



  constructor(private fb: FormBuilder,
    private dialog: MatDialog,
    private customValidator: CustomvalidationService,
    private paeService: PaeService,
    private paeCommonService: PaeCommonService,
    // private committeeReviewFormService: committeeReviewFormService,
    public dialogRef: MatDialog) {

    this.paeService.getFieldsByTableName('IQSCORE').subscribe(response => {
      this.iQScore = response;
    })

    this.paeService.getFieldsByTableName('IDD_TYPE').subscribe(response => {
      this.iDDType = response;
    })

    this.paeService.getFieldsByTableName('DAILYASSISTANCE').subscribe(response => {
      this.dailyAssistance = response;
    })
  }

  ngOnInit(): void {
    this.pageId = 'PPIDI';
    this.getPaeIntelDisabilityDetailsInfoCall();
    this.paeIddDetailsFormGroup = this.fb.group({
      reqPageId: [1],
      id: [6253],
      paeId: [1],
      assistRequiredCd: ['', [Validators.required]],
      assistRequiredSw: ['', [Validators.required]],
      autismDiagnsSw: ['', [Validators.required]],
      commDisorderSw: ['', [Validators.required]],
      cooccurrHthBehSuppSw: ['', [Validators.required]],
      indvDeterDisabilitySw: ['', [Validators.required]],
      intDevDisabilityCd: ['', [Validators.required]],
      intDiminFuncCapSw: ['', [Validators.required]],
      iqScoreCd: ['', [Validators.required]],
      iqTest12MntsSw: ['', [Validators.required]]
    })

    if (this.paeCommonService.getApplicantName() === null || this.paeCommonService.getApplicantName() === '' || this.paeCommonService.getApplicantName() === undefined){
      this.getApplicantName();
    } else {
      this.applicantName =  this.paeCommonService.getApplicantName();
    }

  }
  back() {
    this.isSamePageNavigation =  true;
    this.paeService.navigateToChildPreviousPage(this.pageId);

  }

  getFormData() {
    return this.paeIddDetailsFormGroup.controls;
  }

  getApplicantName(){
    this.paeService.getPaeApplicantInformation(this.paeCommonService.getPaeId(),this.pageId).then((response)=> {
      console.log("reponseforName"+JSON.stringify(response.body.firstName));
      this.applicantName =  response.body.firstName+" "+response.body.lastName;
    this.paeCommonService.setApplicantName(this.applicantName);
    });
  }

  closePopup() {
    // this.dialogRef.close();
  }
  saveAndExit() {
      this.saveIddDetailsInfo(true) 
  }

  considerationYorN(value)
  {
    if(value==='Y'){
      this.isfullScale = true;
    }
    else if(value==='N')
    {
      this.isfullScale = false;
    }
  }

  intellectualYorN(value)
  {
    if(value==='Y'){
      this.isintellectual = true;
    }
    else if(value==='N')
    {
      this.isintellectual = false;
    }
  }

  assistanceReqYorN(value)
  {
    if(value==='Y'){
      this.isAssistance = true;
    }
    else if(value==='N')
    {
      this.isAssistance = false;
    }
  }

  saveIddDetailsInfo(showPopUp?: boolean) {
    this.isSamePageNavigation =  true;
    // this.markFormGroupTouched(this.paeFormGroup);
    this.submitted = true;
    try {
      if (this.paeIddDetailsFormGroup.valid && this.submitted) {

        const formValue = this.paeIddDetailsFormGroup.value;
        const PaeIntelDisabilityDetailsValue = new PaeIntelDisabilityDetailsForm(
          (formValue.reqPageId == null) ? "1" : formValue.reqPageId,
          formValue.id,
          formValue.paeId,
          formValue.assistRequiredCd,
          formValue.assistRequiredSw,
          formValue.autismDiagnsSw,
          formValue.commDisorderSw,
          formValue.cooccurrHthBehSuppSw,
          formValue.indvDeterDisabilitySw,
          formValue.intDevDisabilityCd,
          formValue.intDiminFuncCapSw,
          formValue.iqScoreCd,
          formValue.iqTest12MntsSw
        );

        this.paeService.saveIddDetails(PaeIntelDisabilityDetailsValue).then(response => {
          console.log("saveIddDetails response : " + JSON.stringify(response));
          if (showPopUp) {
            const dialogConfig = new MatDialogConfig();
            dialogConfig.data = { route: 'ltss/pae' };
            // dialogConfig.data = { route: 'ltss/pae' , nextRoute: '/ltss/pae/paeStart/' + this.nextPath };
            dialogConfig.panelClass = 'exp_popup';
            dialogConfig.width = '648px';
            dialogConfig.height = '360px';
            this.dialog.open(SavePopupComponent, dialogConfig);
          }
        })

      }

    } catch (e) {
      console.log("PaeNonFebrileSeizures Catch : ", e);
    }

  }



  getPaeIntelDisabilityDetailsInfoCall() {
    //TODO: Pass correct personid from UI

    this.paeService.getPaeIntelDisabilityDetailsInfo(1, 1).then((response) => {
      console.log('getPaeIntelDisabilityDetailsInfo : ' + JSON.stringify(response));
      this.dataSource = response;
      this.paeIddDetailsFormGroup.controls.reqPageId.setValue(this.dataSource.reqPageId);
      this.paeIddDetailsFormGroup.controls.id.setValue(this.dataSource.id);
      this.paeIddDetailsFormGroup.controls.paeId.setValue(this.dataSource.paeId);
      this.paeIddDetailsFormGroup.controls.assistRequiredCd.setValue(this.dataSource.assistRequiredCd);
      this.paeIddDetailsFormGroup.controls.assistRequiredSw.setValue(this.dataSource.assistRequiredSw);
      this.paeIddDetailsFormGroup.controls.autismDiagnsSw.setValue(this.dataSource.autismDiagnsSw);
      this.paeIddDetailsFormGroup.controls.commDisorderSw.setValue(this.dataSource.commDisorderSw);
      this.paeIddDetailsFormGroup.controls.cooccurrHthBehSuppSw.setValue(this.dataSource.cooccurrHthBehSuppSw);
      this.paeIddDetailsFormGroup.controls.indvDeterDisabilitySw.setValue(this.dataSource.indvDeterDisabilitySw);
      this.paeIddDetailsFormGroup.controls.intDevDisabilityCd.setValue(this.dataSource.intDevDisabilityCd);
      this.paeIddDetailsFormGroup.controls.intDiminFuncCapSw.setValue(this.dataSource.intDiminFuncCapSw);
      this.paeIddDetailsFormGroup.controls.iqScoreCd.setValue(this.dataSource.iqScoreCd);
      this.paeIddDetailsFormGroup.controls.iqTest12MntsSw.setValue(this.dataSource.iqTest12MntsSw);
    })
  }


  markFormGroupTouched = (formGroup) => {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  };
  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    console.log(this.paeIddDetailsFormGroup) 
   return this.isSamePageNavigation ? true : !this.paeIddDetailsFormGroup.dirty;
  }

  resetForm(){
    this.paeIddDetailsFormGroup.reset();
  }
}
