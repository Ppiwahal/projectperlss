
import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as customValidation from '../../_shared/constants/validation.constants';
import { PaeService } from '../../core/services/pae/pae.service';
import { CustomvalidationService } from '../../_shared/utility/customvalidation.service';
import { Subscription } from 'rxjs';
import { PaeFlowSeq } from '../../_shared/utility/PaeFlowSeq';
import { PaeCommonService } from '../../core/services/pae/pae-common/pae-common.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SavePopupComponent } from 'src/app/savePopup/savePopup.component';
import { RightnavToggleService } from 'src/app/_shared/services/rightnav-toggle.service';
import { UploadDocumentsPopupComponent } from 'src/app/rightnav/upload-documents-popup/upload-documents-popup.component';

@Component({
  selector: 'pae-functional-assessment-summary',
  templateUrl: './pae-functional-assessment-summary.component.html',
})

export class PaeFunctionalAssessmentSummaryComponent implements OnInit {
  customValidation = customValidation;
  event: string;
  submitted: boolean;
  nextPage: any;
  pageId: any;
  paeId: any;
  subscription1$: Subscription;
  subscriptions: Subscription[] = [];
  backSubscription$: Subscription;
  maxPossibleAcuScoreNum: number;
  applicantName: any;


  constructor(
    private router: Router,
    private dialog: MatDialog,
    private paeService: PaeService,
    private paeCommonService: PaeCommonService,
    private customValidator: CustomvalidationService,
    private rightnavToggleService: RightnavToggleService
  ) {  }

  acuityScoreTemplate: Array<any> = [
    { name: 'Transfer', value: 'transferMeasureNum' },
    { name: 'Mobility', value: 'mobilityMeasureNum' },
    { name: 'Mobility-Wheelchair', value: 'mobilityWheelchairMeasureNum' },
    { name: 'Eating', value: 'eatingMeasureNum' },
    { name: 'Toileting', value: 'toiletingMeasureNum' },
    { name: 'Toileting Incontinence', value: 'toiletingInconMeasureNum' },
    { name: 'Toileting - Catheter / Ostomy', value: 'toiletingCathOstMeasureNum' },
    { name: 'Orientation', value: 'orientationMeasureNum' },
    { name: 'Communication Expressive', value: 'communicationExpMeasureNum' },
    { name: 'Communication Receptive', value: 'communicationRecMeasureNum' },
    { name: 'Medication', value: 'medicationMeasureNum' },
    { name: 'Behavior', value: 'behaviorMeasureNum' },
  ];

  data: any = {
    functionalAssessmentSummary: [ ],
    acuityScore: [

    ],
    supportingDocumentation: [
      { name: 'Transfer Deficit', uploaded: false },
      { name: 'Mobility Deficit', uploaded: false }
    ]
  };

  routes = {
    PPFAD: 'activitiesPartOne',
    PPFAO: 'activitiesPartTwo',
    PPFAC: 'capabilitiesPartOne',
    PPFAA: 'capabilitiesPartTwo',
    PPFK1: 'capabilitiesKbPartOne',
    PPFK2: 'capabilitiesKbPartTwo'
  };

  showSupportingDocumentation = false;
  showAcuity = false;

  ngOnInit(): void {
    const that = this;
    this.pageId = 'PPFFA';
    if (this.paeCommonService.getApplicantName() === null || this.paeCommonService.getApplicantName() === '' || this.paeCommonService.getApplicantName() === undefined){
		this.getApplicantName();
	} else {
		this.applicantName =  this.paeCommonService.getApplicantName();
	}
    this.paeId = this.paeCommonService.getPaeId();

    this.paeService.getSummaryData(this.pageId, this.paeId).subscribe(response => {
      that.data.functionalAssessmentSummary = response;
    });

    this.paeService.findPaeFunctionalAssessmentAcuityScore(this.paeCommonService.getPaeId()).then(response => {
      const data = response.body;
      that.maxPossibleAcuScoreNum = data.maxPossibleAcuScoreNum;
      if (that.maxPossibleAcuScoreNum !== null && that.maxPossibleAcuScoreNum !== undefined)
      {
        this.showAcuity = true;
        this.showSupportingDocumentation = true;
      }
      const items = [];
      that.acuityScoreTemplate.forEach(el => {
        const value = data[el.value];
        if (value !== null){
        items.push({
          name: el.name,
          value: !value ? '0' : value
        });
      }
      });
      that.data.acuityScore = items;
    });

  }

 /*  getPaeDiagnosisSummaryData() {
    this.subscription1$ = this.paeService.getSummaryData(this.pageId, this.paeId).subscribe((response) => {
		this.diagnosisSummary = response;
		this.dataSource = this.diagnosisSummary;
    });
    this.subscriptions.push(this.subscription1$);
  } */

  getApplicantName(){
    this.paeService.getPaeApplicantInformation(this.paeCommonService.getPaeId(), this.pageId).then((response) => {
      console.log('reponseforName' + JSON.stringify(response.body.firstName));
      this.applicantName =  response.body.firstName + ' ' + response.body.lastName;
      this.paeCommonService.setApplicantName(this.applicantName);
    });
  }

  getRoute(pageId) {
    return '/ltss/pae/paeStart/' + this.routes[pageId];
  }

  saveAndExit() {
    this.event = 'SaveAndExit';
    this.next(true);
  }

  uploadDocument() {
    this.openUploadDocument();
    console.log('upload document');
  }

  openUploadDocument() {
    this.rightnavToggleService.emitToRightNavComp$.next('UPLOAD_DOC');
  }

  next(showPopup?: boolean) {
      this.event = 'Next';
      this.submitted = true;
      if (showPopup){
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = { route: 'ltss/pae' };
       // dialogConfig.data = { route: 'ltss/pae' , nextRoute: '/ltss/pae/paeStart/' + this.nextPath };
        dialogConfig.panelClass = 'exp_popup';
        dialogConfig.width = '648px';
        dialogConfig.height = '360px';
        this.dialog.open(SavePopupComponent, dialogConfig );
      }else {
      this.subscription1$ = this.paeService.getSummaryNextPage(this.paeId, this.pageId).subscribe((response) => {
        console.log(response);
        const nextPath = PaeFlowSeq[response.nextSummaryPage];
        this.router.navigate(['/ltss/pae/paeStart/' + nextPath]);
      }, err => {
        console.log(err);
      });
      this.subscriptions.push(this.subscription1$);
    }
  }

  saveActivitiesPartTwo() {
    this.next();
  }

  back() {
   // const previousForm = 'PRAPIF';
   this.backSubscription$ = this.paeService.getSummaryNextPage(this.paeId, this.pageId).subscribe((response) =>
   {
     const backPath = PaeFlowSeq[response.prevSummaryPage];
     this.router.navigate(['/ltss/pae/paeStart/' + backPath]);
   }, err => {
     console.log(err);
   });
   this.subscriptions.push(this.backSubscription$);
 }

  gotoDetails() {
    this.router.navigate([this.paeService.getFunctionalAssessmentPath('partOne')]);
  }
}
