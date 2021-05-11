import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import * as customValidation from '../../../_shared/constants/validation.constants';
import { CustomvalidationService } from '../../../_shared/utility/customvalidation.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SavePopupComponent } from '../../../../app/savePopup/savePopup.component';
import { PaeEnhancedRespiratoryService } from '../../../core/services/pae/pae-skilled-services/pae-enhanced-respiratory/paeEnhancedRespiratory.service';
import { PaeCommonService } from 'src/app/core/services/pae/pae-common/pae-common.service';
import { PaeSkilledServicesDetailsService } from 'src/app/core/services/pae/pae-skilled-services/pae-skilled-services-details.service';
import { PaeFlowSeq } from 'src/app/_shared/utility/PaeFlowSeq';
import { Router } from '@angular/router';
import { PaeService } from 'src/app/core/services/pae/pae.service';
import { Observable, Subscription } from 'rxjs';
import { ComponentCanDeactivate } from 'src/app/core/helpers/pending-change.guard';
import * as Constants from '../../../_shared/constants/application.constants';
import * as CryptoJS from 'crypto-js';


@Component({
  selector: 'app-pae-enhanced-respiratory-care',
  templateUrl: './pae-enhanced-respiratory-care.component.html',
  styleUrls: ['./pae-enhanced-respiratory-care.component.scss']
})
export class PaeEnhancedRespiratoryCareComponent implements OnInit, OnDestroy, ComponentCanDeactivate {

  isChronicVentilator = false;
  isSecretionManagement = false;
  paeId: any;
  submitted = false;
  reqPageId: any;
  customValidation = customValidation;
  enhancedRespiratoryCareForm: FormGroup;
  minDate: Date;
  maxDate: Date;
  pageId: string;
  applicantName: any;
  subscription1$: Subscription;
  subscription2$: Subscription;
  subscriptions: Subscription[] = [];
  isSamePageNavigation: boolean;
  startDate = new Date();

  constructor(private fb: FormBuilder,
    private dialog: MatDialog,
    private router: Router,
    private paeService: PaeService,
    private paeEnhancedRespiratoryService: PaeEnhancedRespiratoryService,
    private paeCommonService: PaeCommonService,
    private PaeSkilledDetailsService: PaeSkilledServicesDetailsService) { }

  ngOnInit() {
    const timeTravelData = localStorage.getItem('TIME_TRAVEL_DATA');
    if(timeTravelData) {
      const timeTravelDataJson = JSON.parse(CryptoJS.AES.decrypt(timeTravelData, Constants.APP_ENC_DECRYPT_KEY).toString(CryptoJS.enc.Utf8));
      console.log("timeTravelDataJson ", timeTravelDataJson);
      if(timeTravelDataJson.timeTravelFlag && timeTravelDataJson.currentDate) {
        this.startDate = new Date(timeTravelDataJson.currentDate);
      }
    }
    this.reqPageId = 'PPSSE';
    this.pageId = 'PPSSE';
    if (this.paeCommonService.getApplicantName() === null || this.paeCommonService.getApplicantName() === '' || this.paeCommonService.getApplicantName() === undefined){
		this.getApplicantName();
	} else {
		this.applicantName =  this.paeCommonService.getApplicantName();
	}
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 119, 0, 1);
    this.maxDate = new Date();
    this.enhancedRespiratoryCareForm = this.fb.group({
      chrncReqEndDt: new FormControl({ value: null, disabled: true }, Validators.required),
      chrncReqStartDt: new FormControl({ value: null, disabled: true }, Validators.required),
      chrncVentilatorSw: [null],
      paeId: [null],
      reqPageId: [null],
      trachealReqEndDt: new FormControl({ value: null, disabled: true }, Validators.required),
      trachealReqStartDt: new FormControl({ value: null, disabled: true }, Validators.required),
      trachealSuctionSw: [null]
    });
    this.getERCData();
    this.paeId = this.paeCommonService.getPaeId();
  }

  getFormData() {
    return this.enhancedRespiratoryCareForm.controls;
  }

  getApplicantName(){
    this.paeService.getPaeApplicantInformation(this.paeCommonService.getPaeId(),this.pageId).then((response)=> {
      console.log("reponseforName"+JSON.stringify(response.body.firstName));
      this.applicantName =  response.body.firstName+" "+response.body.lastName;
	  this.paeCommonService.setApplicantName(this.applicantName);
    });
  }

  chronicVentilatorServices() {
    this.isChronicVentilator = !this.isChronicVentilator;
    if (this.isChronicVentilator) {
      this.getFormData().chrncReqStartDt.enable();
      this.getFormData().chrncReqEndDt.enable();
      this.getFormData().chrncVentilatorSw.setValue('Y');
    }
    else {
      this.getFormData().chrncReqStartDt.disable();
      this.getFormData().chrncReqEndDt.disable();
      this.getFormData().chrncVentilatorSw.setValue('N');
      this.getFormData().chrncReqStartDt.setValue(null);
      this.getFormData().chrncReqEndDt.setValue(null);
    }
  }

  secretionManagement() {
    this.isSecretionManagement = !this.isSecretionManagement;
    if (this.isSecretionManagement) {
      this.getFormData().trachealReqStartDt.enable();
      this.getFormData().trachealReqEndDt.enable();
      this.getFormData().trachealSuctionSw.setValue('Y');
    }
    else {
      this.getFormData().trachealReqStartDt.disable();
      this.getFormData().trachealReqEndDt.disable();
      this.getFormData().trachealSuctionSw.setValue('N');
      this.getFormData().trachealReqStartDt.setValue(null);
      this.getFormData().trachealReqEndDt.setValue(null);
    }
  }

  back() {
    this.isSamePageNavigation =  true;
    this.paeService.navigateToChildPreviousPage(this.reqPageId);
  }

  saveAndExit() {
    this.nextClicked(true);
    // if (this.submitted) {
    // console.log(this.enhancedRespiratoryCareForm);
    // if (!this.isSecretionManagement) {
    //   this.getFormData().trachealReqStartDt.clearValidators();
    //   this.getFormData().trachealReqEndDt.clearValidators();
    //   this.getFormData().trachealSuctionSw.setValue('N');
    //   this.getFormData().trachealReqStartDt.updateValueAndValidity();
    //   this.getFormData().trachealReqEndDt.updateValueAndValidity();
    // }
    // if (!this.isChronicVentilator) {
    //   this.getFormData().chrncReqStartDt.clearValidators();
    //   this.getFormData().chrncReqEndDt.clearValidators();
    //   this.getFormData().chrncVentilatorSw.setValue('N');
    //   this.getFormData().chrncReqStartDt.updateValueAndValidity();
    //   this.getFormData().chrncReqEndDt.updateValueAndValidity();
    // }

    // if (this.enhancedRespiratoryCareForm.valid) {
    //   this.paeId = this.paeCommonService.getPaeId();
    //   this.reqPageId = 'PPSSE';
    //   this.paeEnhancedRespiratoryService
    //   .saveEnhancedRespiratoryForm({...this.enhancedRespiratoryCareForm.value, paeId: this.paeId, reqPageId:this.reqPageId}).then(data => {
    //       console.log(data);
    //     });
    // }
    //   const dialogConfig = new MatDialogConfig();
    //   dialogConfig.data = { route: 'ltss/pae' };
    //   dialogConfig.panelClass = 'exp_popup';
    //   dialogConfig.width = '36vw';
    // dialogConfig.height = '20vw';

    //   this.dialog.open(SavePopupComponent, dialogConfig );
    // }
  }

  getERCData() {
    this.subscription1$ = this.paeEnhancedRespiratoryService
      .getEnhancedRespiratoryDetails(this.paeCommonService.getPaeId())
      .subscribe((Response) => {
        if (Response.chrncVentilatorSw === 'Y') {
          this.isChronicVentilator = true;
          this.enhancedRespiratoryCareForm.enable();

        }
        if (Response.trachealSuctionSw === 'Y') {
          this.isSecretionManagement = true;
        }
        this.enhancedRespiratoryCareForm.patchValue(Response);
      });

    this.subscriptions.push(this.subscription1$);
  }

  nextClicked(showPopup?: boolean) {
    this.isSamePageNavigation =  true;
    this.submitted = true;
    console.log(this.enhancedRespiratoryCareForm);
    if(this.enhancedRespiratoryCareForm.valid){
    if (!this.isSecretionManagement) {
      this.getFormData().trachealReqStartDt.clearValidators();
      this.getFormData().trachealReqEndDt.clearValidators();
      this.getFormData().trachealSuctionSw.setValue('N');
      this.getFormData().trachealReqStartDt.updateValueAndValidity();
      this.getFormData().trachealReqEndDt.updateValueAndValidity();
    }
    if (!this.isChronicVentilator) {
      this.getFormData().chrncReqStartDt.clearValidators();
      this.getFormData().chrncReqEndDt.clearValidators();
      this.getFormData().chrncVentilatorSw.setValue('N');
      this.getFormData().chrncReqStartDt.updateValueAndValidity();
      this.getFormData().chrncReqEndDt.updateValueAndValidity();
    }

    if (this.enhancedRespiratoryCareForm.valid) {
      this.paeId = this.paeCommonService.getPaeId();
      this.reqPageId = 'PPSSE';
      this.paeEnhancedRespiratoryService
        .saveEnhancedRespiratoryForm({ ...this.enhancedRespiratoryCareForm.value, paeId: this.paeId, reqPageId: this.reqPageId }).then(data => {
          console.log(data);
          if (showPopup) {
            const dialogConfig = new MatDialogConfig();
            dialogConfig.data = { route: 'ltss/pae' };
            // dialogConfig.data = { route: 'ltss/pae' , nextRoute: '/ltss/pae/paeStart/' + this.nextPath };
            dialogConfig.panelClass = 'exp_popup';
            dialogConfig.width = '36vw';
            dialogConfig.height = '20vw';
            this.dialog.open(SavePopupComponent, dialogConfig);
          } else {
            this.subscription2$ = this.PaeSkilledDetailsService.getNextpageDetails(this.paeId, 'PPSSE')
              .subscribe((response) => {
                const nextPath = PaeFlowSeq[response.nextPageId];
                this.pageNavigate(nextPath);
              }, err => {
                console.log(err);
              });
            this.subscriptions.push(this.subscription2$);
          }
        });
    }
  }
    // this.subscriptions.push(this.subscription2$);
  }

  pageNavigate(nextPath) {
    this.router.navigate(['/ltss/pae/paeStart/' + nextPath]);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    console.log('ERC Unsubscribed');
  }
  @HostListener('window:beforeunload')
   canDeactivate(): Observable<boolean> | boolean {
     console.log(this.enhancedRespiratoryCareForm) 
    return this.isSamePageNavigation ? true :  !this.enhancedRespiratoryCareForm.dirty;
   }

   resetForm(){
     this.enhancedRespiratoryCareForm.reset();
   }
}
