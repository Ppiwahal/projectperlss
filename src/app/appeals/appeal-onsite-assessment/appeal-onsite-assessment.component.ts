import { Component, EventEmitter, OnInit, Output, Input, OnChanges } from '@angular/core';
import { AppealStepper } from '../../_shared/utility/AppealFlowSeq';
import { AppealService } from '../services/appeal.service';

@Component({
  selector: 'app-appeal-onsite-assessment',
  templateUrl: './appeal-onsite-assessment.component.html',
  styleUrls: ['./appeal-onsite-assessment.component.scss']
})
export class AppealOnsiteAssessmentComponent implements OnInit, OnChanges {

  @Input() appellantInfoStatus: any;
  @Output() completedAppealOnsiteAssessment: EventEmitter<any> = new EventEmitter<any>();
  onsiteAssessmentOnLoad: any;
  @Input() appealReviewAplId: string;
  appellantInfo: any;
  appealOnsiteEvaluationVO: any;
  safetyJustiPayLoad: any;
  @Input() dataFromReview: any;
  showDocUpload: boolean;
  aplRqstDocObtainSw: any;
  localStorageLocal: string;
  isSubmitEnabled: boolean;
  ltssAppealUser: any;
  onsiteReqId: any;

  constructor(private appealService: AppealService) { }

  ngOnInit() { }

  ngOnChanges() {
    if (this.appealReviewAplId) {
      this.localStorageLocal = localStorage.getItem('APP_STORAGE_TOKEN');
      const userId = JSON.parse(this.localStorageLocal).userName;
      this.appealService.getOnsiteAssessmentOnLoad(this.appealReviewAplId, userId).subscribe(res => {
        this.onsiteAssessmentOnLoad = res;
        this.ltssAppealUser = res.ltssAppealUser;
        this.onsiteReqId = res.aplOnsiteAssesmntReqId
      });
      this.appealService.getAppealDetails(this.appealReviewAplId).subscribe(res => {
        this.appellantInfo = res;
      });
    }
  }

  saveOnsiteEvaluation(payLoad) {
    this.appealOnsiteEvaluationVO = payLoad;
    payLoad.aplOnsiteAssesmntReqId = this.onsiteAssessmentOnLoad.aplOnsiteAssesmntReqId;
    this.appealService.saveOnSiteAssessmentEvaluation(this.appealReviewAplId, payLoad).subscribe(res => {
      console.log(res);
    });
  }

  emitSafetyJustification(event) {
    this.safetyJustiPayLoad = event;
    console.log(event);
  }

  emitOnsiteAssessmentResults(event) {
    this.localStorageLocal = localStorage.getItem('APP_STORAGE_TOKEN');
    const userId = JSON.parse(this.localStorageLocal).userName;
    if (event.value.atRiskLocNotMetSw) {
      event.value.atRiskLocNotMetSw = 'Y';
    } else {
      event.value.atRiskLocNotMetSw = 'N';
    }

    if (event.value.reviewedForSafetySw) {
      event.value.reviewedForSafetySw = 'Y';
    } else {
      event.value.reviewedForSafetySw = 'N';
    }
    const payLoad = {
      appealOnsiteAssesmentResultsVO: event.value,
      appealOnsiteEvaluationVO: this.appealOnsiteEvaluationVO.appealOnsiteEvaluationVO,
      appealOnsiteSafetyJustificationVOs: this.onsiteAssessmentOnLoad.appealOnsiteSafetyJustificationVOs,
      aplOnsiteAssesmntReqId :this.onsiteAssessmentOnLoad.aplOnsiteAssesmntReqId
    };
    this.appealService.saveOnsiteAssessment(this.appealReviewAplId, payLoad, userId).subscribe(res => {
      this.aplRqstDocObtainSw = event.value.aplRqstDocObtainSw
      this.showDocUpload = true;
      this.downloadPdf();
    });
  }


  downloadPdf() {
    this.appealService.downloadOnsiteAssessmentPdf(this.appealReviewAplId).subscribe(res => {
      if (res && res.document) {
        this.convertBase64toPdf(res.document)
      } 
    });
  }

  convertBase64toPdf(base64) {
    const linkSource = 'data:application/pdf;base64,' + base64;
    const downloadLink = document.createElement("a");
    const fileName = "Onsite Assessment";
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
}

  emitUploadDocStatus(event){
    if(event){
        this.isSubmitEnabled = true
    } else {
      this.isSubmitEnabled = false
    }
  }

  back() {
    const previousForm = 'APPEAL_REVIEW';
    const nextStepperData = { nextStepper: AppealStepper[previousForm] };
    this.completedAppealOnsiteAssessment.emit(nextStepperData);
  }


  next() {
    // const nextForm = 'APPEAL_REVIEW_ONSITE';
    // const nextStepperData = { nextStepper: AppealStepper[nextForm], onsiteAssessmentAplId: this.appealReviewAplId };
    // this.completedAppealOnsiteAssessment.emit(nextStepperData);
  }

}
