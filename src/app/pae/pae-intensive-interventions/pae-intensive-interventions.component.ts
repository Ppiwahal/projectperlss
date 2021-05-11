import { Component, HostListener, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { map } from 'rxjs/operators';
import * as InnterventionsData from './internsiveInterventionsData.json';
import * as customValidation from '../../_shared/constants/validation.constants';
import { CustomvalidationService } from '../../_shared/utility/customvalidation.service';
import { LeavePagePopupComponent } from 'src/app/leave-page-popup/leave-page-popup.component';
import { Router } from '@angular/router';
import { PaeService } from 'src/app/core/services/pae/pae.service';
import { PaeFlowSeq } from 'src/app/_shared/utility/PaeFlowSeq';
import { PaeCommonService } from 'src/app/core/services/pae/pae-common/pae-common.service';
import { SavePopupComponent } from 'src/app/savePopup/savePopup.component';
import { ComponentCanDeactivate } from 'src/app/core/helpers/pending-change.guard';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-pae-intensive-interventions',
  templateUrl: './pae-intensive-interventions.component.html',
  styleUrls: ['./pae-intensive-interventions.component.scss']
})
export class PaeIntensiveInterventionsComponent implements OnInit, ComponentCanDeactivate {
  customValidation = customValidation;
  paeIntensiveInterventionsForm: FormGroup;
  benefitsList: any;
  interventionsMap = new Map();
  interventionsMap2 = new Map();
  checkboxEvent: any;
  interventionsValue: any;
  event: string;
  interventionsCheckboxSelectedCount = 0;
  interventionsSelected = false;
  interventionsNoneSelected = false;
  submitted = false;
  pageId: string;
  paeId:string;
  isSamePageNavigation: boolean;
  applicantName: any;
  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private customValidator: CustomvalidationService,
    private paeService:PaeService,
    private paeCommonService:PaeCommonService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.pageId='PPPII';
    this.paeId = this.paeCommonService.paeId;
    this.benefitsList = InnterventionsData['default'];
    this.paeIntensiveInterventionsForm = this.fb.group({
      checkArray: this.fb.array([], [Validators.required])
    });

    for(const i of this.benefitsList){
      this.interventionsMap.set(
        i.name, i.value
      );
    }
    for(const j of this.benefitsList){
      this.interventionsMap2.set(
        j.name, j.formControlName 
      );
    }
    if (this.paeCommonService.getApplicantName() === null || this.paeCommonService.getApplicantName() === '' || this.paeCommonService.getApplicantName() === undefined) {
      this.getApplicantName();
    } else {
      this.applicantName = this.paeCommonService.getApplicantName();
    } 
  }

  getApplicantName() {
    this.paeService.getPaeApplicantInformation(this.paeId, this.pageId).then((response) => {
      this.applicantName = response.body.firstName + " " + response.body.lastName;
      this.paeCommonService.setApplicantName(this.applicantName);
    });
  }

  changeEvent(event, interventionsValue) {
    console.log(event, interventionsValue);
    console.log(this.interventionsMap2.get(interventionsValue));  
    
    this.checkboxEvent = event;
    this.interventionsValue = this.interventionsMap2.get(interventionsValue);

    const interventionsArray = <FormArray>this.paeIntensiveInterventionsForm.controls.checkArray;
 
    if(this.checkboxEvent.checked) {
      interventionsArray.push(new FormControl(this.interventionsValue));
    }
    else {
      // let index = interventionsArray.controls.findIndex(x => x.value == {id});
      // interventionsArray.removeAt(index);
    }
    console.log(interventionsArray.controls);
    if(this.interventionsValue != 'nonSW') {
      if (event.checked) {
        this.interventionsCheckboxSelectedCount =
          this.interventionsCheckboxSelectedCount + 1;
      } else if (!event.checked) {
        this.interventionsCheckboxSelectedCount =
          this.interventionsCheckboxSelectedCount - 1;
      }
      if (this.interventionsCheckboxSelectedCount > 0) {
        this.interventionsSelected = true; 
      } 
      else {
        this.interventionsSelected = false;
      }
    }
    else {
      this.interventionsNoneSelected = event.checked;
    }
  }

  saveIntensiveInterventions(): boolean {
    return true;
  }

  back() {
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

  saveAndExit() {
      this.next(true); 
  }
  next(showPopup?:boolean) {
    this.isSamePageNavigation =  true;
    this.event = 'Next';
    this.submitted = true;
    if (this.paeIntensiveInterventionsForm.valid) {
      if(showPopup){
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = { route: 'ltss/pae' };
       // dialogConfig.data = { route: 'ltss/pae' , nextRoute: '/ltss/pae/paeStart/' + this.nextPath };
        dialogConfig.panelClass = 'exp_popup';
        dialogConfig.width = '648px';
        dialogConfig.height = '360px';  
        this.dialog.open(SavePopupComponent, dialogConfig );
      }else {
      this.router.navigate(['/ltss/pae/paeStart/medicalRegimen']);
      }
    }
  }
  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    console.log(this.paeIntensiveInterventionsForm) 
   return this.isSamePageNavigation ? true : !this.paeIntensiveInterventionsForm.dirty;
  }

  resetForm(){
    this.paeIntensiveInterventionsForm.reset();
  }
}
