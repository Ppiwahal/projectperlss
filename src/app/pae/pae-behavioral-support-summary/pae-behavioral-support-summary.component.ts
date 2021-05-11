import { Component, OnDestroy, OnInit } from '@angular/core';
import { PaeService } from 'src/app/core/services/pae/pae.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PaeFlowSeq } from 'src/app/_shared/utility/PaeFlowSeq';
import { PaeCommonService } from 'src/app/core/services/pae/pae-common/pae-common.service';
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
  { name: 'Self-Injurious Behaviors', status: '', userActions: 'GO TO DETAILS' },
  { name: 'Physically Aggressive Behaviors', status: '', userActions: 'GO TO DETAILS' },
  { name: 'Service Systems', status: '', userActions: 'GO TO DETAILS' },
  { name: 'Additional Behavioral Qualifiers', status: '', userActions: 'GO TO DETAILS' }
];

const supportingDocuments: SupportingDocsDetails[] = [
  { name: 'High-Risk Behaviors', icon: 'cloud_upload' },
  { name: 'Lack of Behavioral Control', icon: 'cloud_upload' },
  { name: 'Aggressive and Offensive Behavior', icon: 'cloud_upload' },
  { name: 'Child Protective Services', icon: 'cloud_upload' },
  { name: 'Criminal Justice System', icon: 'cloud_upload' },
  { name: 'Crisis Mental Health Services', icon: 'cloud_upload' },
  { name: 'Criminal Justice System', icon: 'cloud_upload' },
];

@Component({
  selector: 'app-pae-behavioral-support-summary',
  templateUrl: './pae-behavioral-support-summary.component.html',
  styleUrls: ['./pae-behavioral-support-summary.component.scss']
})
export class PaeBehavioralSupportSummaryComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['name', 'status', 'userActions'];
  dataSource = ELEMENT_DATA;
  supportingDocument = supportingDocuments;
  personId: any;
  showTick: boolean;
  fileName: string;
  diagnosisSummary: any;
  applicantName: any;
  showSupportingDocument = false;

  nextPage: any;
  pageId: any;
  paeId: any;
  nextPagesubscription$: Subscription;
  subscriptions: Subscription[] = [];
  backSubscription$: Subscription;
  constructor(private paeService: PaeService,
    private dialog: MatDialog, private router: Router, private paeCommonService: PaeCommonService
  ) {
  }

  ngOnInit(): void {
    this.paeId = this.paeCommonService.getPaeId();
    this.pageId = 'PPBBS';
    this.getPaeDiagnosisSummaryData();
    if (this.paeCommonService.getApplicantName() === null || this.paeCommonService.getApplicantName() === '' || this.paeCommonService.getApplicantName() === undefined) {
      this.getApplicantName();
    } else {
      this.applicantName = this.paeCommonService.getApplicantName();
    }
    if(this.dataSource && this.dataSource.length){
      this.showSupportingDocument = this.dataSource.filter(res => res.status === "Complete").length === this.dataSource.length;
    }
  }

  getApplicantName() {
    this.paeService.getPaeApplicantInformation(this.paeId, this.pageId).then((response) => {
      this.applicantName = response.body.firstName + " " + response.body.lastName;
      this.paeCommonService.setApplicantName(this.applicantName);
    });
  }

  getPaeDiagnosisSummaryData() {
    //const paeId = this.paeService.getPaeId();
    // const pageId = 'PPBBS';
    // const paeId = 'PAE1000040';
    this.paeService.getSummaryData(this.pageId, this.paeId).subscribe((response) => {
      console.log('response===', response);
      if (response.status === 200) {

        this.diagnosisSummary = response.body;
      }
    });
  }

  gotoDetails(pageData) {
    if (pageData === 'Additional Behavioral Qualifiers') {
      this.router.navigate(['/ltss/pae/paeStart/AdditionalBehavioralQualifiers']);
    } else if (pageData === 'Physically Aggressive Behaviors') {
      this.router.navigate(['/ltss/pae/paeStart/aggressiveBehavior']);
    } else if (pageData === 'Service Systems') {
      this.router.navigate(['/ltss/pae/paeStart/ServiceSystemsComponent']);
    } else if (pageData === 'Self-Injurious Behaviors') {
      this.router.navigate(['/ltss/pae/paeStart/aggressiveBehavior']); //need to update the path
    }

  }
  next(showPopUp?: boolean) {   
      this.nextPagesubscription$ = this.paeService.getSummaryNextPage(this.paeId, this.pageId).subscribe((response) => {
        const nextPath = PaeFlowSeq[response.nextSummaryPage];
        if (showPopUp) {
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
      this.subscriptions.push(this.nextPagesubscription$);    
  }
  gotoback() {
    // this.router.navigate(['/ltss/pae/paeStart/IddDeterminationSummary']);
    this.backSubscription$ = this.paeService.getSummaryNextPage(this.paeId, this.pageId).subscribe((response) => {
      const backPath = PaeFlowSeq[response.prevSummaryPage];
      this.router.navigate(['/ltss/pae/paeStart/' + backPath]);
    }, err => {
      console.log(err);
    });
    this.subscriptions.push(this.backSubscription$);
  }
  saveAndExit() {
    this.next(true)
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

}
