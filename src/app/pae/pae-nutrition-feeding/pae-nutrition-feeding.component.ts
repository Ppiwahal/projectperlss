import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as customValidation from '../../_shared/constants/validation.constants';
import { CustomvalidationService } from '../../_shared/utility/customvalidation.service';
import { PaeNutritionFeeding } from '../../_shared/model/PaeNutritionFeeding';
import { PaeService } from '../../core/services/pae/pae.service';
import { MatRadioChange } from '@angular/material/radio';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { LeavePagePopupComponent } from 'src/app/leave-page-popup/leave-page-popup.component';
import { Router } from '@angular/router';
import { PaeFlowSeq } from 'src/app/_shared/utility/PaeFlowSeq';
import { PaeCommonService } from 'src/app/core/services/pae/pae-common/pae-common.service';
import { SavePopupComponent } from 'src/app/savePopup/savePopup.component';
import { ComponentCanDeactivate } from 'src/app/core/helpers/pending-change.guard';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-pae-nutrition-feeding',
  templateUrl: './pae-nutrition-feeding.component.html',
  styleUrls: ['./pae-nutrition-feeding.component.scss']
})
export class PaeNutritionFeedingComponent implements OnInit, ComponentCanDeactivate {
  isSamePageNavigation: boolean;
  constructor(private fb: FormBuilder,
              private paeService: PaeService,
              private paeCommonService:PaeCommonService,
              private dialog: MatDialog,
              private router: Router,
              private customValidator: CustomvalidationService) { }
  myForm: FormGroup;
  customValidation = customValidation;
  event: string;
  submitted= false;
  reqPageId: string;
  reqHandsOnFeedAssist = false;
  pageId: string;
  paeId: string;

  ngOnInit(): void {
    this.pageId='PPPNT';
    this.paeId = this.paeCommonService.paeId;
    this.myForm = this.fb.group({
      specialyPrescbdDietSw: ['', [Validators.required]],
      aplcntPraderWilliSw: ['', [Validators.required]],
      aplcntChokngAspiSw: ['', [Validators.required]],
      handsonFeedngAssisCd: ['', [Validators.required]],
      handsonFeedngDurCd: ['', [Validators.required]]
    });
  }

  getFormData() {
    return this.myForm.controls;
  }
  saveAndExit(){
    this.next(true)
  }
  saveNutritionFeeding(showPopUp?:boolean) {
    this.submitted = true;
    this.reqPageId = 'PPPNTF';
    const paePriorNutriFeedingVO  = new PaeNutritionFeeding(
      null,
      '1',
      this.reqPageId,
      this.getFormData().aplcntChokngAspiSw.value,
      this.getFormData().aplcntPraderWilliSw.value,
      this.getFormData().aplcntPraderWilliSw.value,
      this.getFormData().handsonFeedngAssisCd.value,
      this.getFormData().handsonFeedngDurCd.value,
      null,
      null,
      null,
      null,
    );
    console.log(this.myForm);
    const response = this.paeService.savePaeNutritionFeeding(paePriorNutriFeedingVO);
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

  onHandsOnFeedChange(mrChange: MatRadioChange) {
    if (mrChange.value === 'Y') {
      this.reqHandsOnFeedAssist = true;
      this.getFormData().handsonFeedngDurCd.setValidators([Validators.required]);
    }
    else {
      this.reqHandsOnFeedAssist = false;
      this.getFormData().handsonFeedngDurCd.clearValidators();
    } 
    this.getFormData().handsonFeedngDurCd.updateValueAndValidity();
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

  next(showPopup?:boolean){
    this.isSamePageNavigation =  true;
    this.event = 'Next';
    this.submitted = true;
    console.log(this.myForm);
    if (this.myForm.valid) {
        this.saveNutritionFeeding(showPopup);
      }
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
