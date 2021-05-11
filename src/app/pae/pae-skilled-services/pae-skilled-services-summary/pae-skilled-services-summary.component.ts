import { PaeCommonService } from './../../../core/services/pae/pae-common/pae-common.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatRadioChange } from '@angular/material/radio';
import { Subscription } from 'rxjs';
import { SavePopupComponent } from 'src/app/savePopup/savePopup.component';
import { PaeSkilledServicesSummaryService } from '../../../core/services/pae/pae-skilled-services/pae-skilled-services-summary/pae-skilled-services-summary.service';
import { PaeService } from 'src/app/core/services/pae/pae.service';
import { PaeFlowSeq } from 'src/app/_shared/utility/PaeFlowSeq';
import { Router } from '@angular/router';
import { PaeSkilledServicesDetailsService } from 'src/app/core/services/pae/pae-skilled-services/pae-skilled-services-details.service';
import { SkilledServiceUpdatePage } from 'src/app/_shared/model/SkilledServiceUpdatePage';
import { skilledSumSw } from 'src/app/_shared/model/skilledSumSw'
import { UploadDocumentsPopupComponent } from 'src/app/rightnav/upload-documents-popup/upload-documents-popup.component';
import { RightnavToggleService } from 'src/app/_shared/services/rightnav-toggle.service';
import * as customValidation from '../../../_shared/constants/validation.constants';
import { CustomvalidationService } from '../../../_shared/utility/customvalidation.service';
import { PaeSkilledServicesAcknowledgementPopupComponent } from '../pae-skilled-services-acknowledgement-popup/pae-skilled-services-acknowledgement-popup.component';

@Component({
  selector: 'app-pae-skilled-services-summary',
  templateUrl: './pae-skilled-services-summary.component.html',
  styleUrls: ['./pae-skilled-services-summary.component.scss']
})
export class PaeSkilledServicesSummaryComponent implements OnInit, OnDestroy {

  reqPageId = 'PSSSSS';
  paeId = this.paeCommonService.getPaeId();
  isSkilledServices = false;
  isneedRespiratoryCareSwnotrequired = false;
  skilledServicesSummaryData: any;
  rightnavData: any;
  isSkilledServicesNotRequired = false;
  pagesNotRequired = [];
  pagesRequired = [];
  applicantName: any;
  customValidation = customValidation;
  skilledServicesSummaryScoreData = {
    reqPageId: 'PSSSSS',
    paeId: '',
    dsntNeedSrvcsSw: '',
    needRespiratoryCareSw: '',
    needSkilledSrvcsSw: '',
    
    };
  submitted = false;
  skilledServiceSummaryForm: FormGroup;
  nextPage: any;
  pageId: any;
  isEnhancedRespiratory = false;
  nextPagesubscription$: Subscription;
  subscription1$: Subscription;
  subscription2$: Subscription;
  subscriptions: Subscription[] = [];
  isserviceScoreNeeded = false;
  isfileUploaded = false;
  tableRowends : number;
  value2:string;
  isnonKB = false;
  skilledServicesSummarydata: [];
  needRespiratoryCareSw: any;
  isneedRespiratoryCareSw = false;
  dsntNeedSrvcsSw: string;
  needSkilledSrvcsSw: string;
  subscription3$: Subscription;
  needRespiratoryCareSwnotrequired = true;
  needRespiratoryCareSws = false;
  constructor(private fb: FormBuilder,
              private dialog: MatDialog,
              private router:Router,
              private paeService: PaeService,
              private customValidator: CustomvalidationService,
              private paeSkilledServicesSummaryService: PaeSkilledServicesSummaryService,
              private paeCommonService: PaeCommonService,
              private rightnavToggleService: RightnavToggleService,
              private paeSkilledServiceDetails: PaeSkilledServicesDetailsService,
              private PaeSkilledServicesAcknowledgementPopupComponent: PaeSkilledServicesAcknowledgementPopupComponent) { }

  ngOnInit() {
    this.paeId = this.paeCommonService.getPaeId();
    if (this.paeCommonService.getApplicantName() === null || this.paeCommonService.getApplicantName() === '' || this.paeCommonService.getApplicantName() === undefined){
		this.getApplicantName();
	} else {
		this.applicantName =  this.paeCommonService.getApplicantName();
	}
    // this.paeId = 'PAE100000073';    
    this.pageId = 'PPSSS';
    this.skilledServiceSummaryForm = this.fb.group({
      dsntNeedSrvcsSw: null,
      needRespiratoryCareSw: ['', Validators.required],
      needSkilledSrvcsSw: null,
      paeSkilledSummaryScoreVOs: [null]
    });
    this.rightnavData = this.rightnavToggleService.getRightnavData();
    this.getSkilledServicesScore();
    this.getSkilledSummaryData();

  }

  getApplicantName(){
    this.paeService.getPaeApplicantInformation(this.paeCommonService.getPaeId(),this.pageId).then((response)=> {
      console.log("reponseforName"+JSON.stringify(response.body.firstName));
      this.applicantName =  response.body.firstName+" "+response.body.lastName;
	  this.paeCommonService.setApplicantName(this.applicantName);
    });
  }

  isSkilledServicesNeeded(){
    this.isSkilledServices = !this.isSkilledServices;
    const dialogConfig = new MatDialogConfig();
      dialogConfig.data = { route: 'ltss/pae' };
      dialogConfig.panelClass = 'exp_popup';
      dialogConfig.width = '60vw';
      dialogConfig.height = '40vw';

      this.dialog.open(PaeSkilledServicesAcknowledgementPopupComponent, dialogConfig);
    this.getSkilledSummaryData();
    if (this.isSkilledServices) {
      this.isSkilledServicesNotRequired = false;
      this.skilledServiceSummaryForm.controls.needSkilledSrvcsSw.patchValue('Y');
      this.skilledServiceSummaryForm.controls.dsntNeedSrvcsSw.patchValue('N');
    }
  }
  isSkilledServicesNotNeeded(){
    this.isSkilledServicesNotRequired = !this.isSkilledServicesNotRequired;
    if (this.isSkilledServicesNotRequired) {
      this.isEnhancedRespiratory = false;
      this.isSkilledServices = false;
      this.isserviceScoreNeeded = false;
      this.skilledServiceSummaryForm.controls.needSkilledSrvcsSw.patchValue('N');
      this.skilledServiceSummaryForm.controls.dsntNeedSrvcsSw.patchValue('Y');
      this.skilledServiceSummaryForm.controls.needRespiratoryCareSw.patchValue('N');
    }
  }

  saveAndExit() {
    this.nextClicked(true);
    // if (this.submitted) {
    //   const dialogConfig = new MatDialogConfig();
    //   dialogConfig.data = { route: 'ltss/pae' };
    //   dialogConfig.panelClass = 'exp_popup';
    //   dialogConfig.width = '36vw';
    // dialogConfig.height = '20vw';

    //   this.dialog.open(SavePopupComponent, dialogConfig );
    // }
  }

  back()
  {
    this.paeService.getSummaryNextPage(this.paeId, this.pageId).subscribe((response) => {
        const backPath = PaeFlowSeq[response.prevSummaryPage];
        this.router.navigate(['/ltss/pae/paeStart/' + backPath]);
      }, err => {
        console.log(err);
      });
    
  }

  enhanceRespiratoryNeeded(mrChange: MatRadioChange) {
    this.tableRowends = mrChange.value === 'Y' ? 2 : 1;
    
    if (mrChange.value === 'Y') {
      //this.isneedRespiratoryCareSw = true;
      this.needRespiratoryCareSws = true;
      this.needRespiratoryCareSwnotrequired = false;
      this.isEnhancedRespiratory = true;
      
    }
    else if (mrChange.value === 'N')
    {
      this.needRespiratoryCareSws = false;
      this.needRespiratoryCareSwnotrequired = true;
      this.isSkilledServices = true;
      this.isEnhancedRespiratory = true;
      
    }
    
  }

  getSkilledSummaryData()
  {
    
    this.subscription1$ = this.paeService
      .getSummaryData(this.pageId,this.paeId)
              .subscribe((skilledServicesSummaryData) => {
        this.skilledServicesSummarydata = skilledServicesSummaryData;

        if(this.isSkilledServices === true)
        {
          this.isEnhancedRespiratory = true;
        } 
    
      });

      
    console.log(this.skilledServicesSummaryData);
    this.subscriptions.push(this.subscription1$);
  }

  getSkilledServicesScore()
  {
    // this.isserviceScoreNeeded = true;
    this.subscription2$ = this.paeSkilledServicesSummaryService
      .getSkilledServicesSummaryScore(this.paeId)
      .subscribe((skilledServicesSummaryScoreData) => {
        this.skilledServicesSummaryScoreData = skilledServicesSummaryScoreData.paeSkilledSummaryScoreVOs;
        if(skilledServicesSummaryScoreData.needSkilledSrvcsSw === null 
          || skilledServicesSummaryScoreData.needSkilledSrvcsSw === 'N' || 
          skilledServicesSummaryScoreData.needSkilledSrvcsSw === undefined)
          {
          this.isserviceScoreNeeded = false;
        }
        else
        {
        this.isserviceScoreNeeded = true;
      }
      if(skilledServicesSummaryScoreData.needSkilledSrvcsSw === 'Y'
       && skilledServicesSummaryScoreData.needRespiratoryCareSw === 'N')
      {
      this.isSkilledServices = true;
      this.isEnhancedRespiratory = true;
      } else if(skilledServicesSummaryScoreData.needSkilledSrvcsSw === 'Y' && 
      skilledServicesSummaryScoreData.needRespiratoryCareSw === 'Y')
      {
      this.isSkilledServices = true;
      this.isEnhancedRespiratory = true;
      } else if(skilledServicesSummaryScoreData.dsntNeedSrvcsSw === 'Y')
      { 
        this.isSkilledServicesNotRequired = true;
      }

      this.skilledServiceSummaryForm.patchValue(skilledServicesSummaryScoreData);
      
      });

      this.subscriptions.push(this.subscription2$);
  
}
  postUpdatedPage(PageId){
    this.submitted = true;
    if (this.skilledServiceSummaryForm.valid){
     
    if(PageId === 'PPSSD'){
      
    if(this.needRespiratoryCareSws === true && this.needRespiratoryCareSwnotrequired === false){
      const SkilledServiceUPdatePage  = new SkilledServiceUpdatePage(
      this.reqPageId = '',
      this.paeId,
      this.pagesNotRequired = [],
      this.pagesRequired = ['PPSSD', 'PPSSE'] 
      );
      const that = this;
      this.paeSkilledServiceDetails.postPageUpdate(SkilledServiceUPdatePage).then((res) => {
      console.log('res', res);
     
      this.router.navigate(['/ltss/pae/paeStart/skilledServicesDetails']);
      });
      }
    }
      if(PageId === 'PPSSD') 
      {
       
        if(this.needRespiratoryCareSwnotrequired === true && this.needRespiratoryCareSws === false){
      const SkilledServiceUPdatePage  = new SkilledServiceUpdatePage(
        this.reqPageId = '',
        this.paeId,
        this.pagesNotRequired = ['PPSSE'],
        this.pagesRequired = ['PPSSD'] 
      );
      const that = this;
      this.paeSkilledServiceDetails.postPageUpdate(SkilledServiceUPdatePage).then((res) => {
      console.log('res', res);
      this.router.navigate(['/ltss/pae/paeStart/skilledServicesDetails']);
      });
      } 
    }

      if(PageId === 'PPSSE')
      {
        this.router.navigate(['/ltss/pae/paeStart/enhancedRespiratoryCare']);
      }

      this.switchDetails();
    }
  }

  getFormData()
  {
    return this.skilledServiceSummaryForm.controls;
  }
    

    switchDetails()
    {
      
      if(this.isSkilledServices === true){
     
        if(this.needRespiratoryCareSws === true && this.needRespiratoryCareSwnotrequired === false){
        const skilledSumdetails  = new skilledSumSw(
          this.reqPageId = '',
          this.paeId,
          this.dsntNeedSrvcsSw = 'N',
          this.needRespiratoryCareSw = 'Y' ,
          this.needSkilledSrvcsSw = 'Y',
        );
        const that = this;
        this.paeSkilledServicesSummaryService
      .saveSkilledServicesSumForm(skilledSumdetails)
      .then(data => {
        console.log('res', data);
        
        });
      } 
    }

    if(this.isSkilledServices === true){
      
      if(this.needRespiratoryCareSwnotrequired === true && this.needRespiratoryCareSws === false){
        const skilledSumdetails  = new skilledSumSw(
          this.reqPageId = '',
          this.paeId,
          this.dsntNeedSrvcsSw = 'N',
          this.needRespiratoryCareSw = 'N' ,
          this.needSkilledSrvcsSw = 'Y',
        );
        const that = this;
        this.paeSkilledServicesSummaryService
      .saveSkilledServicesSumForm(skilledSumdetails)
      .then(data => {
        console.log('res', data);
        
        });
      } 
    }
    }

    openUploadDocument() {
      this.rightnavToggleService.emitToRightNavComp$.next('UPLOAD_DOC');
    }

  nextClicked(showPopUp?: boolean){

    if ((this.isSkilledServices || this.isSkilledServicesNotRequired) &&
    (this.skilledServiceSummaryForm.controls.needRespiratoryCareSw.value !== null)) {
        console.log(this.skilledServiceSummaryForm);

        if(this.isSkilledServicesNotRequired === true){
          const skilledSumdetails  = new skilledSumSw(
            this.reqPageId = '',
           this.paeId,
            this.dsntNeedSrvcsSw = 'Y',
            this.needRespiratoryCareSw = 'N' ,
            this.needSkilledSrvcsSw = 'N',
          );
          const that = this;
          this.paeSkilledServicesSummaryService
        .saveSkilledServicesSumForm(skilledSumdetails)
        .then(data => {
          console.log('res', data);
  
  });
}
    }
      this.paeService.getSummaryNextPage(this.paeId, this.pageId).subscribe((response) =>
          {
            const nextPath = PaeFlowSeq[response.nextSummaryPage];
            this.router.navigate(['/ltss/pae/paeStart/' + nextPath]);
          }, err => {
            console.log(err);
          });
          
}

  
        
    // if(this.isSkilledServicesNotRequired === true)
    // {
    // // const SkilledServiceUPdatePage  = new SkilledServiceUpdatePage(
    // //   this.reqPageId = '',
    // //  this.paeId,
    // //   this.pagesNotRequired = ['PPSSD','PPSSE'],
    // //   this.pagesRequired = [] 
    // // );
    // // const that = this;
    // // this.paeSkilledServiceDetails.postPageUpdate(SkilledServiceUPdatePage).then((res) => {
    // // console.log('res', res);
    // // this.router.navigate (['/ltss/pae/paeStart/IddDeterminationSummary']);
    // // });
  

    // } else

    // {
    //   const SkilledServiceUPdatePage  = new SkilledServiceUpdatePage(
    //   this.reqPageId = '',
    //   this.paeId,
    //   this.pagesNotRequired = [],
    //   this.pagesRequired = ['PPSSD', 'PPSSE'] 
    //   );
    //   const that = this;
    //   this.paeSkilledServiceDetails.postPageUpdate(SkilledServiceUPdatePage).then((res) => {
    //   console.log('res', res);
    //   this.router.navigate (['/ltss/pae/paeStart/skilledServicesDetails']);
    //   });
    // }
  

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    console.log('skilled-services Unsubscribed');
  }

}
