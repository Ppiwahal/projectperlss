import { Component, OnInit } from '@angular/core';
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
}

export interface SupportingDocsDetails {
  service: string;
  calcAnnualAmt: string;
}
export interface SupportingDocs {
  name: string;
  icon: string;
}

const ELEMENT_DATA: SafetyDeterminationDetails[] = [
  { name: 'Cost Neutrality Details ', status: '', userActions: 'GO TO DETAILS' },
  // { name: 'Plan of care ', status: '', userActions: 'GO TO DETAILS' }
];

const ELEMENT_DATA2: SupportingDocsDetails[] = [
  { service: 'Nurses', calcAnnualAmt: '$200.00' },
  { service: 'Inpatient Respites', calcAnnualAmt: '$1000.00' },
  { service: 'SD/Add`I Adult Day Care', calcAnnualAmt: '$500.00' }
];

const supportingDocuments: SupportingDocs[] = [
  { name: 'Cost Neutrality', icon: 'cloud_upload' },
  // { name: 'Plan of care', icon: 'cloud_upload' },
];

@Component({
  selector: 'app-pae-cost-neutrality',
  templateUrl: './pae-cost-neutrality.component.html',
  styleUrls: ['./pae-cost-neutrality.component.scss']
})
export class PaeCostNeutralityComponent implements OnInit {
  displayedColumns: string[] = ['name', 'status', 'userActions'];
  displayedColumnsSuppDocs: string[] = ['name', 'status'];
  dataSource = ELEMENT_DATA;
  dataSource1 = ELEMENT_DATA2;
  supportingDocument = supportingDocuments;
  nextPage: any;
  pageId: any;
  paeId: any;
  diagnosisSummary: any;
  subscription1$: Subscription;
  subscription2$: Subscription;
  subscriptions: Subscription[] = [];
  nextPagesubscription$: Subscription;
  backSubscription$: Subscription;
  summaryList: any = [];
  rowElement: any;
  applicantName: any;
  PaeId: string;
  constructor(private paeService: PaeService, private dialog: MatDialog, private router: Router, private paeCommonService: PaeCommonService
  ) {
  }
  ngOnInit(): void {
    // this.rowElement=this.paeCommonService.getRowElement();
    this.paeId = this.paeCommonService.getPaeId();
    this.pageId = 'PPCNC';
    this.getPaeDiagnosisSummaryData();
    this.PaeCostNeuCalcAnnualAmt();
    if (this.paeCommonService.getApplicantName() === null || this.paeCommonService.getApplicantName() === '' ||
      this.paeCommonService.getApplicantName() === undefined) {
      this.getApplicantName();
    } else {
      this.applicantName = this.paeCommonService.getApplicantName();
    }
  }

  getApplicantName() {
    this.paeService.getPaeApplicantInformation(this.paeCommonService.getPaeId(), this.pageId).then((response) => {
      console.log('reponseforName' + JSON.stringify(response.body.firstName));
      this.applicantName = response.body.firstName + ' ' + response.body.lastName;
      this.paeCommonService.setApplicantName(this.applicantName);
    });
  }
  getPaeDiagnosisSummaryData() {
    this.subscription1$ = this.paeService.getSummaryData(this.pageId, this.paeId).subscribe((response) => {
      this.dataSource = response;
    });
    this.subscriptions.push(this.subscription1$);
  }

  PaeCostNeuCalcAnnualAmt() {
    this.subscription2$ = this.paeService.getPaeCostNeuCalcAnnualAmt(
      this.paeId).subscribe((response) => {
        console.log(' PaeCostNeuCalcAnnualAmt response===', response);
        if (response) {
          this.summaryList = response.summaryList;
          this.summaryList[this.summaryList.length] = { service: 'Total Annual Cost', calcAnnualAmt: response.totalAnnualCost };
          this.dataSource1 = this.summaryList;
        }
        else {
          this.dataSource1 = [];
        }
      });
    this.subscriptions.push(this.subscription2$);
  }

  next(showPopup?: boolean) {
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
    this.subscriptions.push(this.nextPagesubscription$);
  }
  gotoback() {
    /* this.router.navigate(['/ltss/pae/paeStart/selectProgram']); */
    this.backSubscription$ = this.paeService.getSummaryNextPage(this.paeId, this.pageId).subscribe((response) => {
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
  gotoDetails(nextPageId) {
    console.log('nextPageId :: ' + nextPageId);
    const nextPath = PaeFlowSeq[nextPageId];
    this.router.navigate(['/ltss/pae/paeStart/' + nextPath]);
  }

}
