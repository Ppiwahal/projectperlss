import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PaeService } from 'src/app/core/services/pae/pae.service';
import { PaeCommonService } from 'src/app/core/services/pae/pae-common/pae-common.service';
import { Subscription } from 'rxjs';
import { PaeFlowSeq } from 'src/app/_shared/utility/PaeFlowSeq';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SavePopupComponent } from 'src/app/savePopup/savePopup.component';
export interface SafetyDeterminationDetails {
  name: string;
  status: string;
  userActions: string;
}

export interface SupportingDocsDetails {
  name: string;
  icon: string;
}

const ELEMENT_DATA: SafetyDeterminationDetails[] = [
  { name: '', status: '', userActions: 'GO TO DETAILS' },
];

const supportingDocuments: SupportingDocsDetails[] = [
  { name: 'Medical Diagnosis', icon: 'cloud_upload' },
];

@Component({
  selector: 'app-pae-diagnosis-summary',
  templateUrl: './pae-diagnosis-summary.component.html',
  styleUrls: ['./pae-diagnosis-summary.component.scss']
})
export class PaeDiagnosisSummaryComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['name', 'status', 'userActions'];
  dataSource = ELEMENT_DATA;
  supportingDocument = supportingDocuments;
  showDocumentationSection: boolean;
  showUploadBtn: boolean;
  ImageBaseData: string | ArrayBuffer = null;
  showTick: boolean;
  diagnosisSummary: any;
  nextPage: any;
  pageId: any;
  paeId: any;
  subscription1$: Subscription;
  subscriptions: Subscription[] = [];
  subscription2$: Subscription;
  backSubscription$: Subscription;
  applicantName: any;

  constructor(private paeService: PaeService, private dialog:MatDialog, private router: Router, private paeCommonService: PaeCommonService
  ) {
  }

  ngOnInit(): void {
    this.pageId = 'PPDDS'; 
    this.paeId = this.paeCommonService.getPaeId();
    this.getPaeDiagnosisSummaryData();
    if (this.paeCommonService.getApplicantName() === null || this.paeCommonService.getApplicantName() === '' || this.paeCommonService.getApplicantName() === undefined){
		this.getApplicantName();
	} else {
		this.applicantName =  this.paeCommonService.getApplicantName();
	}
  }

  getApplicantName(){
    this.paeService.getPaeApplicantInformation(this.paeCommonService.getPaeId(),this.pageId).then((response)=> {
      console.log("reponseforName"+JSON.stringify(response.body.firstName));
      this.applicantName =  response.body.firstName+" "+response.body.lastName;
	  this.paeCommonService.setApplicantName(this.applicantName);
    });
  }
  
  gotoDetails() {
    this.router.navigate(['/ltss/pae/paeStart/medicalDiagnosis']);
  }

  getPaeDiagnosisSummaryData() {
    this.subscription1$ = this.paeService.getSummaryData(this.pageId, this.paeId).subscribe((response) => {
		this.diagnosisSummary = response;
		this.dataSource = this.diagnosisSummary;
    });
    this.subscriptions.push(this.subscription1$);
  }
  next(showPopup?:boolean) {
    this.subscription2$ = this.paeService.getSummaryNextPage(this.paeId, this.pageId).subscribe((response) =>
    {
      console.log(response);
      const nextPath = PaeFlowSeq[response.nextSummaryPage];
      if(showPopup){
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = { route: 'ltss/pae' };
        dialogConfig.panelClass = 'exp_popup';
        dialogConfig.width = '648px';
        dialogConfig.height = '360px';  
        this.dialog.open(SavePopupComponent, dialogConfig );
      } else {
        this.router.navigate(['/ltss/pae/paeStart/' + nextPath]);
      }
    }, err => {
      console.log(err);
    });
    this.subscriptions.push(this.subscription2$);
  }
  gotoback() {
     this.router.navigate(['/ltss/pae/paeStart/selectProgram']);
  //   this.backSubscription$ = this.paeService.getSummaryNextPage(this.paeId, this.pageId).subscribe((response) =>
  // {
  //   const backPath = PaeFlowSeq[response.prevSummaryPage];
  //   this.router.navigate(['/ltss/pae/paeStart/' + backPath]);
  // }, err => {
  //   console.log(err);
  // });
  // this.subscriptions.push(this.backSubscription$);
  }
  saveAndExit() {
   this.next(true)
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    console.log('pae-select-Program Unsubscribed');
  }
}
