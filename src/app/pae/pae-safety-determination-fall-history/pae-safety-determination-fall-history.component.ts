import { Component, ViewEncapsulation, OnInit, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomvalidationService } from '../../_shared/utility/customvalidation.service';
import * as customValidation from '../../_shared/constants/validation.constants';
import { PaeService } from 'src/app/core/services/pae/pae.service';
import { PaeFallHistoryVOList } from '../../_shared/model/PaeFallHistoryVOList';
import { PaeFallHistory } from '../../_shared/model/PaeFallHistory';
import { HttpResponse } from '@angular/common/http';
import { PaeFlowSeq } from '../../_shared/utility/PaeFlowSeq';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SavePopupComponent } from 'src/app/savePopup/savePopup.component';
import { PaeCommonService } from './../../core/services/pae/pae-common/pae-common.service';
import { Observable } from 'rxjs';
import { ComponentCanDeactivate } from 'src/app/core/helpers/pending-change.guard';

@Component({
  selector: 'app-pae-safety-determination-fall-history',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './pae-safety-determination-fall-history.component.html',
  styleUrls: ['./pae-safety-determination-fall-history.component.scss']
})
export class PaeSafetyDeterminationFallHistoryComponent implements OnInit, ComponentCanDeactivate {
  paeFallHistoryForm: FormGroup;
  panelOpenState = false;
  customValidation = customValidation;
  minDate: Date;
  maxDate: Date;
  isShown: Boolean;
  showPlus: Boolean;
  dataSource: any;
  fillThisArray: any = [];
  nextPath: string;
  applicantName: any;
  submitted = false;
  pageId: string = 'PPSFH';
  timeOptions = [
    { code: 'D', value: 'Daytime', activateSW: 'Y' },
    { code: 'E', value: 'Evening', activateSW: 'Y' },
    { code: 'N', value: 'Nighttime', activateSW: 'Y' }
  ];

  isSamePageNavigation: boolean;

  constructor(private fb: FormBuilder,
    private paeService: PaeService,
    private router: Router,
    private dialog: MatDialog,
    private paeCommonService: PaeCommonService,
    private customValidator: CustomvalidationService) { }

  ngOnInit(): void {
    this.pageId = 'PPSFH';
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 119, 0, 1);
    this.maxDate = new Date();
    this.isShown = false;
    this.paeFallHistoryForm = this.fb.group({
      visCap: [''],
      fallHistoryCount: [''],
      locationOfFall: [''],
      fallDt: [''],
      fallTimeCd: [''],
      fallFactorEnvSw: [''],
      fallFactorLowBldSw: [''],
      fallFactorMedSw: [''],
      fallFactorImpVisSw: [''],
      fallAdditionalFactor: [''],
      injurySustainSw: [''],
      injuriesDesc: [''],
      preventMchnsmDesc: [''],
      preventMchnsmUnsucsflDesc: ['']
    });

    if (this.paeService.getPaeId() !== null && this.paeService.getPaeId() !== undefined) {
      this.getFallHistory();
    }

    if (this.paeCommonService.getApplicantName() === null || this.paeCommonService.getApplicantName() === '' || this.paeCommonService.getApplicantName() === undefined){
		this.getApplicantName();
	} else {
		this.applicantName =  this.paeCommonService.getApplicantName();
	}
  }

  getFormData() {
    return this.paeFallHistoryForm.controls;
  }

  getApplicantName(){
    this.paeService.getPaeApplicantInformation(this.paeCommonService.getPaeId(),this.pageId).then((response)=> {
      console.log("reponseforName"+JSON.stringify(response.body.firstName));
      this.applicantName =  response.body.firstName+" "+response.body.lastName;
	  this.paeCommonService.setApplicantName(this.applicantName);
    });
  }

  toggleShow() {
    this.isShown = !this.isShown;
    this.showPlus = !this.showPlus;
  }

  cancelForm() {
    this.isShown = false;
  }

  sendingYorN(input: boolean) {
    if (input === true) {
      return 'Y';
    } else if (input === false) {
      return 'N';
    }
  }

  saveNewRecord() {
    const paeFallHistoryVO = new PaeFallHistoryVOList(
      this.getFormData().fallAdditionalFactor.value,
      this.getFormData().fallDt.value,
      this.sendingYorN(this.getFormData().fallFactorEnvSw.value),
      this.sendingYorN(this.getFormData().fallFactorImpVisSw.value),
      this.sendingYorN(this.getFormData().fallFactorLowBldSw.value),
      this.sendingYorN(this.getFormData().fallFactorMedSw.value),
      this.getFormData().fallTimeCd.value,
      this.getFormData().injuriesDesc.value,
      this.getFormData().injurySustainSw.value,
      this.getFormData().locationOfFall.value,
      this.paeService.getPaeId(),
      this.getFormData().preventMchnsmDesc.value,
      this.getFormData().preventMchnsmUnsucsflDesc.value,
    );

    this.fillThisArray.push(paeFallHistoryVO);

    const paeFallHistory = new PaeFallHistory(
      this.getFormData().fallHistoryCount.value,
      this.paeService.getPaeId(),
      this.fillThisArray,
      this.pageId
    );

    const response = this.paeService.setFallHist(paeFallHistory);
    let nextPage = '';
    const that = this;
    response.then(function (response: HttpResponse<any>) {
      nextPage = response.headers.get('next');
      console.log(nextPage);
      response = response.body;
      that.nextPath = PaeFlowSeq[nextPage];
      console.log(that.nextPath);
      // that.router.navigate(['/ltss/pae/paeStart/' + that.nextPath]);
      that.getFallHistory();
    });
    this.toggleShow();
  }

  getFallHistory() {
    const resp = this.paeService.getFallHist(this.paeService.getPaeId());
    const that = this;
    resp.then(function (resp: HttpResponse<any>) {
      console.log("response===>" + JSON.stringify(resp));
      that.paeFallHistoryForm.patchValue(resp.body);
      that.dataSource = resp.body.paeSafetyDeterFallHistDetailsVOList;
      console.log(that.dataSource);
    });
  }

  clearForm() {
    this.paeFallHistoryForm.reset();
    this.ngOnInit();
  }
  back() {
    this.isSamePageNavigation =  true;
    this.paeService.navigateToChildPreviousPage(this.pageId);

  }
  next(showPopup?: boolean) {
    this.isSamePageNavigation =  true;
    this.submitted = true;

    if (this.paeFallHistoryForm.valid) {
      if (showPopup) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = { route: 'ltss/pae' };
        // dialogConfig.data = { route: 'ltss/pae' , nextRoute: '/ltss/pae/paeStart/' + this.nextPath };
        dialogConfig.panelClass = 'exp_popup';
        dialogConfig.width = '648px';
        dialogConfig.height = '360px';
        this.dialog.open(SavePopupComponent, dialogConfig);
      } else {
        this.router.navigate(['/ltss/pae/paeStart/safetyAssessmentSummary']);
      }
    }
  }
  saveAndExit() {
    this.next(true)
  }
  
  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    console.log(this.paeFallHistoryForm) 
   return this.isSamePageNavigation ? true : !this.paeFallHistoryForm.dirty;
  }

  resetForm(){
    this.paeFallHistoryForm.reset();
  }
}
