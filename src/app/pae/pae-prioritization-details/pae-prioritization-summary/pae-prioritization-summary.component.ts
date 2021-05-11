import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PaeCommonService } from 'src/app/core/services/pae/pae-common/pae-common.service';
import { PaeService } from 'src/app/core/services/pae/pae.service';
import { SavePopupComponent } from 'src/app/savePopup/savePopup.component';
import { PaeFlowSeq } from 'src/app/_shared/utility/PaeFlowSeq';
import { PaePrioritizationSummaryService } from '../../../core/services/pae/pae-prioritization-details/pae-prioritization-summary/pae-prioritization-summary.service';
export interface SafetyDeterminationDetails {
  name: string;
  status: string;
  userActions: string;
}

const ELEMENT_DATA: SafetyDeterminationDetails[] = [
  { name: 'Medical Prognosis', status: '', userActions: 'GO TO DETAILS' },
  { name: 'Intensive Interventions', status: '', userActions: 'GO TO DETAILS' },
  { name: 'Transportation and Specialty Care Needs', status: '', userActions: 'GO TO DETAILS' },
  { name: 'Non-Febrile Seizures', status: '', userActions: 'GO TO DETAILS' },
  { name: 'Nutrition / Feeding', status: '', userActions: 'GO TO DETAILS' },
  { name: 'Medication Regimen', status: '', userActions: 'GO TO DETAILS' },
  { name: 'Caregiver Details', status: '', userActions: 'GO TO DETAILS' }
];
@Component({
  selector: 'app-pae-prioritization-summary',
  templateUrl: './pae-prioritization-summary.component.html',
  styleUrls: ['./pae-prioritization-summary.component.scss']
})
export class PaePrioritizationSummaryComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['name', 'status', 'userActions'];
  dataSource = ELEMENT_DATA;
  prioritizationSummaryData: any;
  nextPage: any;
  pageId: any;
  paeId: any;
  nextPagesubscription$: Subscription;
  subscription1$: Subscription;
  subscriptions: Subscription[] = [];
  backSubscription$: Subscription;
  submitted = false;
  applicantName: any;

  constructor(private dialog: MatDialog,
              private paePrioritizationSummaryService: PaePrioritizationSummaryService,
              private router: Router, private paeService: PaeService, private paeCommonService: PaeCommonService) { }

  ngOnInit() {
     this.paeId = this.paeCommonService.getPaeId();
     this.pageId = 'PPPPS';
     this.getPrioritizationSummaryData();
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

  getPrioritizationSummaryData(){
    this.subscription1$ = this.paePrioritizationSummaryService
      .getPrioritizationSummary()
      .subscribe((prioritizationSummaryData) => {
        this.prioritizationSummaryData = prioritizationSummaryData;
      });
    this.subscriptions.push(this.subscription1$);
    console.log(this.prioritizationSummaryData);
  }

  nextClicked(showPopup?: boolean){
    this.nextPagesubscription$ = this.paeService.getSummaryNextPage(this.paeId, this.pageId).subscribe((response) =>
    {
      this.submitted = true;
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
      this.router.navigate(['/ltss/pae/paeStart/' + nextPath]); }
    }, err => {
      console.log(err);
    });
    this.subscriptions.push(this.nextPagesubscription$);
  }

  back(){
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
   this.nextClicked(true);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    console.log('Unsubscribed');
  }

  gotoDetails(pageData) {
    if (pageData === 'Medical Prognosis') {
      this.router.navigate(['/ltss/pae/paeStart/medicalPrognosis']);
    } else if (pageData === 'Intensive Interventions') {
      this.router.navigate(['/ltss/pae/paeStart/intensiveInterventions']);
    }
    else if (pageData === 'Transportation and Specialty Care Needs') {
      this.router.navigate(['/ltss/pae/paeStart/transportationSpecialityCare']);
    }
    else if (pageData === 'Non-Febrile Seizures') {
      this.router.navigate(['/ltss/pae/paeStart/nonFebrileSeizures']);
    }
    else if (pageData === 'Nutrition / Feeding') {
      this.router.navigate(['/ltss/pae/paeStart/nutritionFeeding']);
    }
    else if (pageData === 'Medication Regimen') {
      this.router.navigate(['/ltss/pae/paeStart/medicalRegimen']);
    }
    else if (pageData === 'Caregiver Details') {
      this.router.navigate(['/ltss/pae/paeStart/PaeCaregiverDetails']);
    }


  }

}
