import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PaeCommonService } from 'src/app/core/services/pae/pae-common/pae-common.service';
import { PaeService } from 'src/app/core/services/pae/pae.service';
import { SavePopupComponent } from 'src/app/savePopup/savePopup.component';
import { PaeFlowSeq } from 'src/app/_shared/utility/PaeFlowSeq';
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

const ELEMENT_DATA: SafetyDeterminationDetails[] = [
  { name: 'I/DD Details', status: '', userActions: 'GO TO DETAILS', icon: 'close' },
];

const supportingDocuments: SupportingDocsDetails[] = [
  { name: 'Intellectual and/or Developmental Disability', icon: 'cloud_upload' },
];
@Component({
  selector: 'app-pae-idd-determination-summary',
  templateUrl: './pae-idd-determination-summary.component.html',
  styleUrls: ['./pae-idd-determination-summary.component.scss'],
})
export class PaeIddDeterminationSummaryComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['name', 'status', 'userActions'];
  dataSource = ELEMENT_DATA;
  supportingDocument = supportingDocuments;
  showDocumentationSection: boolean;
  showUploadBtn: boolean;
  ImageBaseData: string | ArrayBuffer = null;
  showTick: boolean;
  nextPage: any;
  pageId: any;
  paeId: any;
  subscription1$: Subscription;
  subscription2$: Subscription;
  nextPagesubscription$: Subscription;
  subscriptions: Subscription[] = [];
  backSubscription$: Subscription;
  applicantName: any;
  diagnosisSummary: any;

  constructor(private router: Router,
              private dialog: MatDialog ,
              private paeService: PaeService,
              private paeCommonService: PaeCommonService) { }

  ngOnInit(): void {
    this.paeId = this.paeCommonService.getPaeId();
    this.pageId = 'PPIIS';
    this.getPaeSummaryData();
    if (this.paeCommonService.getApplicantName() === null || this.paeCommonService.getApplicantName() === '' ||
     this.paeCommonService.getApplicantName() === undefined){
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

    getPaeSummaryData() {
      this.subscription1$ = this.paeService.getSummaryData(this.pageId, this.paeId).subscribe((response) => {
      this.diagnosisSummary = response;
      this.dataSource = this.diagnosisSummary;
      });
      this.subscriptions.push(this.subscription1$);
    }

  next(showPopup?: boolean) {
      this.nextPagesubscription$ = this.paeService.getSummaryNextPage(this.paeId, this.pageId).subscribe((response) => {
      const nextPath = PaeFlowSeq[response.nextSummaryPage];
      if (showPopup){
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = { route: 'ltss/pae' };
       // dialogConfig.data = { route: 'ltss/pae' , nextRoute: '/ltss/pae/paeStart/' + this.nextPath };
        dialogConfig.panelClass = 'exp_popup';
        dialogConfig.width = '648px';
        dialogConfig.height = '360px';
        this.dialog.open(SavePopupComponent, dialogConfig );
      }else {
      this.router.navigate(['/ltss/pae/paeStart/' + nextPath]);
      }
    }, err => {
      console.log(err);
    });
      this.subscriptions.push(this.nextPagesubscription$);
}
  gotoback() {
    this.backSubscription$ = this.paeService.getSummaryNextPage(this.paeId, this.pageId).subscribe((response) =>
    {
      const backPath = PaeFlowSeq[response.prevSummaryPage];
      this.router.navigate(['/ltss/pae/paeStart/' + backPath]);
    }, err => {
      console.log(err);
    });
    this.subscriptions.push(this.backSubscription$);
  }
  saveAndExit() {
    // this.router.navigate(['/ltss/pae']);
    this.next(true);
  }
  gotoDetails() {
    this.router.navigate(['/ltss/pae/paeStart/IddDetails']);
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}

