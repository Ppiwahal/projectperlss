import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaeService } from 'src/app/core/services/pae/pae.service';
import { HttpClient } from '@angular/common/http/';
import { EnvService } from 'src/app/_shared/utility/env.service';
import { Router } from '@angular/router';
import { PaeCommonService } from '../../../app/core/services/pae/pae-common/pae-common.service';
import { PaeSafetyDeterminationSummary } from '../../_shared/model/PaeSafetyDeterminationSummary';
import { PaeFlowSeq } from '../../_shared/utility/PaeFlowSeq';
import { HttpResponse } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { requiredFieldsNeedsToBeFilled } from 'src/app/_shared/constants/validation.constants';
import { SavePopupComponent } from 'src/app/savePopup/savePopup.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ComponentCanDeactivate } from 'src/app/core/helpers/pending-change.guard';

export interface SafetyDeterminationDetails {
  name: string;
  status: string;
  userActions: string;
  icon: string;
}

export interface SupportingDocsDetails {
  name: string;
  icon: string;
}

export interface AdditionalRequiredDocsDetails {
  name: string;
  icon: string;
}

@Component({
  selector: 'app-pae-safety-assessment-summary',
  templateUrl: './pae-safety-assessment-summary.component.html',
  styleUrls: ['./pae-safety-assessment-summary.component.scss']
})
export class PaeSafetyAssessmentSummaryComponent implements OnInit{
  pageId: string = 'PPSDS';
  yesOrNo: any[] = [{ code: 'Y', value: 'REQUEST SAFETY CONSIDERATION' }, { code: 'N', value: 'DOES NOT NEED SAFETY DETERMINATION' }];
  displayedColumns: string[] = ['name', 'status', 'userActions'];
  displayedColumnsSuppDocs: string[] = ['name', 'status'];
  displayedColumnsAddReqDocs: string[] = ['name', 'status'];
  showHide: boolean;
  showHide2: boolean;
  showHide3: any;
  clickedDetails: any;
  fileErrors: any;
  validationMessage = '';
  progressValue: any;
  files = [];
  showFiles = false;
  summaryRecords: any;
  serverApiUrl: any;
  nextPath: string;
  paeSafetyAssessmentSummaryForm: FormGroup;
  prioritizationSummaryData: any;
  nextPage: any;
  paeId: any;
  applicantName: any;
  backSubscription$: Subscription;
  nextPagesubscription$: Subscription;
  subscription1$: Subscription;
  subscriptions$: Subscription[] = [];
  isSamePageNavigation: boolean;

  constructor(private fb: FormBuilder,
    private paeService: PaeService,
    private envService: EnvService,
    private paeCommonService: PaeCommonService,
    private router: Router,
    private dialog: MatDialog,
    private http: HttpClient) {
    this.serverApiUrl = this.envService.apiUrl()
  }

  ngOnInit(): void {
    this.paeId = this.paeCommonService.getPaeId();
    this.pageId = 'PPSDS';
    if (this.paeCommonService.getApplicantName() === null || this.paeCommonService.getApplicantName() === '' || this.paeCommonService.getApplicantName() === undefined){
		this.getApplicantName();
	} else {
		this.applicantName =  this.paeCommonService.getApplicantName();
	}
    this.clickedDetails = this.paeCommonService.getGoToDetails();
    this.paeSafetyAssessmentSummaryForm = this.fb.group({
      reqSafetyConSw: [''],
      nfSrvcSw: [''],
      hcbsSrvcSw: [''],
      tenncareQualifiedAssesrSw: ['']
    });
    this.getSummaryData();
    if (this.paeId !== null && this.paeId !== undefined) {
      this.dataPatchup();
    }
  }

  getFormData() {
    return this.paeSafetyAssessmentSummaryForm.controls;
  }

  getApplicantName(){
    this.paeService.getPaeApplicantInformation(this.paeCommonService.getPaeId(),this.pageId).then((response)=> {
      console.log("reponseforName"+JSON.stringify(response.body.firstName));
      this.applicantName =  response.body.firstName+" "+response.body.lastName;
	  this.paeCommonService.setApplicantName(this.applicantName);
    });
  }

  dataPatchup() {
    const loadData = this.paeService.findPaeSafetySummary(this.paeId)
      .then(response => {
        let receivedData = response;
        console.log("receivedData" + JSON.stringify(receivedData));
        this.paeSafetyAssessmentSummaryForm.patchValue(receivedData.body);
        if (receivedData.body.reqSafetyConSw === 'Y') {
          this.showHide = true;
        }
        else if (receivedData.body.reqSafetyConSw === 'N') {
          this.showHide2 = true;
        }
        if (receivedData.body.nfSrvcSw === 'N') {
          this.paeSafetyAssessmentSummaryForm.patchValue({
            nfSrvcSw: false
          });
        }
        else if (receivedData.body.nfSrvcSw === 'Y') {
          this.paeSafetyAssessmentSummaryForm.patchValue({
            nfSrvcSw: true
          });
        }
        if (receivedData.body.hcbsSrvcSw === 'N') {
          this.paeSafetyAssessmentSummaryForm.patchValue({
            hcbsSrvcSw: false
          });
        }
        else if (receivedData.body.hcbsSrvcSw === 'Y') {
          this.paeSafetyAssessmentSummaryForm.patchValue({
            hcbsSrvcSw: true
          });
        }
        if (receivedData.body.tenncareQualifiedAssesrSw === 'N') {
          this.paeSafetyAssessmentSummaryForm.patchValue({
            tenncareQualifiedAssesrSw: false
          });
        }
        else if (receivedData.body.tenncareQualifiedAssesrSw === 'Y') {
          this.paeSafetyAssessmentSummaryForm.patchValue({
            tenncareQualifiedAssesrSw: true
          });
        }
      });
  }

  getSummaryData() {
    const that = this;
    const loadSummaryData = this.paeService.getPaeSafetySummary(this.pageId, this.paeId);
    loadSummaryData.then(function (loadSummaryData: HttpResponse<any>) {
      that.summaryRecords = loadSummaryData.body;
      console.log(that.summaryRecords);
    });
  }

  considerationYorN(value) {
    this.validationMessage = '';
    this.paeSafetyAssessmentSummaryForm.patchValue({
      nfSrvcSw: false
    });
    this.paeSafetyAssessmentSummaryForm.patchValue({
      hcbsSrvcSw: false
    });
    this.paeSafetyAssessmentSummaryForm.patchValue({
      tenncareQualifiedAssesrSw: false
    })
    if (value == 'N') {
      this.showHide = false;
      this.showHide2 = true;
      this.showHide3 = false;
    }
    else if (value == 'Y') {
      this.showHide = true;
      this.showHide2 = false;
      this.showHide3 = true;
    }
  }

  fileBrowseHandler(files) {
    this.fileErrors = {};
    for (const file of files) {
      this.progressValue = file.progress;
      file.progress = 0;
      if (file.size >= 2 * 1024 * 1024) {
        this.fileErrors.maxSizeErr = true;
      } else if (file.name.length > 30) {
        this.fileErrors.fileNameErr = true;
      } else {
        this.files.push(file);
      }
    }
    this.showFiles = true;
  }

  gotoDetails(pageData) {
    this.isSamePageNavigation =  true;

    const paeSafetyAssessmentSummaryVO = new PaeSafetyDeterminationSummary(
      this.pageId,
      this.paeId,
      this.getFormData().reqSafetyConSw.value,
      'N',
      'N',
      'N'
    );
    let that = this;
    const response = this.paeService.saveSafetyDetermination(paeSafetyAssessmentSummaryVO);
    response.then((result) => {
      const nextPath = PaeFlowSeq[pageData];
      that.router.navigate(['/ltss/pae/paeStart/' + nextPath]);
      that.paeCommonService.setGoToDetails(true);
    });


  }

  sendingYorN(input: boolean) {
    if (input === true) {
      return 'Y';
    } else if (input === false) {
      return 'N';
    }
  }

  saveAndExit() {
    this.next(true)

  }

  saveSafetyAssessmentSummary() {
    this.isSamePageNavigation =  true;
    this.validationMessage = '';
    if (!this.paeSafetyAssessmentSummaryForm.controls.reqSafetyConSw.value) {
      this.next();
    } else if (this.paeSafetyAssessmentSummaryForm.controls.reqSafetyConSw.value
      && (
        !this.showHide2 || (this.getFormData().nfSrvcSw.value &&
          this.getFormData().hcbsSrvcSw.value &&
          this.getFormData().tenncareQualifiedAssesrSw.value))
    ) {
      console.log("inside else if");
      const paeSafetyAssessmentSummaryVO = new PaeSafetyDeterminationSummary(
        this.pageId,
        this.paeId,
        this.getFormData().reqSafetyConSw.value,
        this.sendingYorN(this.getFormData().nfSrvcSw.value),
        this.sendingYorN(this.getFormData().hcbsSrvcSw.value),
        this.sendingYorN(this.getFormData().tenncareQualifiedAssesrSw.value)
      );
      const response = this.paeService.saveSafetyDetermination(paeSafetyAssessmentSummaryVO);
      response.then((result) => {
        this.next();
      });
    }
    else {
      this.validationMessage = requiredFieldsNeedsToBeFilled;
    }
  }

  saveSafetyAssessmentSummaryFromDetails() {

    const paeSafetyAssessmentSummaryVO = new PaeSafetyDeterminationSummary(
      this.pageId,
      this.paeId,
      this.getFormData().reqSafetyConSw.value,
      'N',
      'N',
      'N'
    );
    const response = this.paeService.saveSafetyDetermination(paeSafetyAssessmentSummaryVO);
    response.then((result) => {
      this.next();
    });

  }

  next(showPopup?: boolean) {

    if (this.paeSafetyAssessmentSummaryForm.valid) {
      this.nextPagesubscription$ = this.paeService.getSummaryNextPage(this.paeId, this.pageId).subscribe((response) => {
        const nextPath = PaeFlowSeq[response.nextSummaryPage];
        if (showPopup) {
          const dialogConfig = new MatDialogConfig();
          dialogConfig.data = { route: 'ltss/pae' };
          // dialogConfig.data = { route: 'ltss/pae' , nextRoute: '/ltss/pae/paeStart/' + this.nextPath };
          dialogConfig.panelClass = 'exp_popup';
          dialogConfig.width = '648px';
          dialogConfig.height = '360px';
          this.dialog.open(SavePopupComponent, dialogConfig);
        } else {
          this.router.navigate(['/ltss/pae/paeStart/' + nextPath]);
        }
      }, err => {
        console.log(err);
      });
      this.subscriptions$.push(this.nextPagesubscription$);
    }
  }

  back() {
    this.isSamePageNavigation =  true;

    this.backSubscription$ = this.paeService.getSummaryNextPage(this.paeId, this.pageId).subscribe((response) => {
      const backPath = PaeFlowSeq[response.prevSummaryPage];
      this.router.navigate(['/ltss/pae/paeStart/' + backPath]);
    }, err => {
      console.log(err);
    });
    this.subscriptions$.push(this.backSubscription$);
  }

  ngOnDestroy() {
    if (this.subscriptions$ && this.subscriptions$.length > 0) {
      this.subscriptions$.forEach(subscription$ => subscription$.unsubscribe());
    }
  }
}
