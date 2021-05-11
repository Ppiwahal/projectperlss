import { Component, HostListener, OnInit, ViewEncapsulation, ɵComponentDef } from '@angular/core';
import * as customValidation from '../../_shared/constants/validation.constants';
import { CustomvalidationService } from '../../_shared/utility/customvalidation.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { PaeService } from '../../core/services/pae/pae.service';
import { SavePopupComponent } from 'src/app/savePopup/savePopup.component';
import { ComponentCanDeactivate } from 'src/app/core/helpers/pending-change.guard';
import { Observable } from 'rxjs';
import { PaeCommonService } from 'src/app/core/services/pae/pae-common/pae-common.service';

@Component({
  selector: 'app-pae-service-systems',
  templateUrl: './pae-service-systems.component.html',
  styleUrls: ['./pae-service-systems.component.scss']
})
export class PaeServiceSystemsComponent implements OnInit, ComponentCanDeactivate {
  paeServiceSystemsFormGroup: FormGroup;
  customValidation = customValidation;
  submitted = false; 
  pageId: string;
  // dataSource : any;
  isSamePageNavigation: boolean;
  applicantName: any;

  constructor(private fb: FormBuilder,
              private customValidator: CustomvalidationService,
              private dialog:MatDialog,
              private paeService: PaeService,
              // private committeeReviewFormService: committeeReviewFormService,
              public dialogRef: MatDialog,
              public paeCommonService:PaeCommonService) { }

  ngOnInit(): void {
     // this.getpaeSexuallyAggressiveBehavior();
    this.pageId='PPBSS';
    this.paeServiceSystemsFormGroup = this.fb.group({
      reqPageId: ['PPBPA'],
      id: [124],
      paeId: ["PAE1000017"],
      childProtectiveSrvcSw: ['', [Validators.required]],
      criminalJusticeSysSw: ['', [Validators.required]],
      crisisMenHlthSrvcSw: ['', [Validators.required]]
    });

    if (this.paeCommonService.getApplicantName() === null || this.paeCommonService.getApplicantName() === ''
    || this.paeCommonService.getApplicantName() === undefined){
      this.getApplicantName();
    } else {
      this.applicantName =  this.paeCommonService.getApplicantName();
    }
  }

  getApplicantName(){
    this.paeService.getPaeApplicantInformation(this.paeCommonService.getPaeId(), this.pageId).then((response) => {
      console.log('reponseforName' + JSON.stringify(response.body.firstName));
      this.applicantName =  response.body.firstName + ' ' + response.body.lastName;
      this.paeCommonService.setApplicantName(this.applicantName);
    });
  }

  getFormData() {
    return this.paeServiceSystemsFormGroup.controls;
  }

  closePopup() {
    // this.dialogRef.close();
  }
  back(){
    this.isSamePageNavigation =  true;
    this.paeService.navigateToChildPreviousPage(this.pageId);
  }
  saveAndExit(){
    this.save(true)
  }
  save(showPopup?:boolean) {
    this.isSamePageNavigation =  true;
    this.markFormGroupTouched(this.paeServiceSystemsFormGroup);
    if(!this.paeServiceSystemsFormGroup.valid){
      return;
    }
    try{
this.paeService.saveServiceSystems(this.paeServiceSystemsFormGroup.value).then(response=> {
        console.log("saveSelfInjuriousBehavior response : "+ JSON.stringify(response));
        if(showPopup){
          const dialogConfig = new MatDialogConfig();
        dialogConfig.data = { route: 'ltss/pae' };
       // dialogConfig.data = { route: 'ltss/pae' , nextRoute: '/ltss/pae/paeStart/' + this.nextPath };
        dialogConfig.panelClass = 'exp_popup';
        dialogConfig.width = '648px';
        dialogConfig.height = '360px';  
        this.dialog.open(SavePopupComponent, dialogConfig );
        }
      });  
    }catch{

    }
    
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
    console.log(this.paeServiceSystemsFormGroup) 
   return this.isSamePageNavigation ? true : !this.paeServiceSystemsFormGroup.dirty;
  }

  resetForm(){
    this.paeServiceSystemsFormGroup.reset();
  }
}
