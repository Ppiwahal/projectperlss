import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { AppealService } from '../services/appeal.service';
import { AppealStepper } from '../../_shared/utility/AppealFlowSeq';

@Component({
  selector: 'app-appeal-review',
  templateUrl: './appeal-review.component.html',
  styleUrls: ['./appeal-review.component.scss']
})
export class AppealReviewComponent implements OnInit, OnChanges {

  @Input() appellantInfoStatus: any;

  subscriptions$ = [];
  appealDecisionDetail = [];
  showDisenrollOrEnroll: boolean;
  dataToAppealDecision: any;
  showPaeReviews: any;
  appealTypeCd: string;
  showAppealClosure: boolean;
  toEnableAccordion: any;
  appealTimely: boolean;
  onsiteAssesReq: boolean;
  showOnlyAppealDecision: boolean;
  payor_source: any[] = [{ code: 'HS', value: 'Hospice', activateSW: 'Y' },
  { code: 'MD', value: 'Medicaid', activateSW: 'Y' },
  { code: 'ME', value: 'Medicare', activateSW: 'Y' },
  { code: 'AP', value: 'Medicaid Pending', activateSW: 'Y' },
  { code: 'SP', value: 'Self-pay/ Private', activateSW: 'Y' }];

  PASRR_REASON: any[] = [{ name: 'HE', value: 'Level I Positive', activateSW: 'Y' },
  { name: 'LC', value: 'Level II- LOC', activateSW: 'Y' },
  { name: 'NC', value: 'Level II- Non LOC', activateSW: 'Y' }];
  @Output() completedAppealReview: EventEmitter<any> = new EventEmitter<any>();
  isNextEnabled = true;
  @Input() appealId: any;
  appealReviewOnLoad: any;
  appellantInfo: any;
  @Input() passrRefrenceTableData: any;
  programTypeCd: any;
  appealDecisionForm: any;
  onsiteAssessmentReqSubmitted: boolean;
  submittedForOnSiteAssessment: any;
  enableOnsiteAssessment: boolean;
  onsiteAssessmentReqResponse: any;

  constructor(private appealService: AppealService) { }

  ngOnInit(): void {

  }

  ngOnChanges() {
    if (this.appealId) {
      this.appealService.getAppealReviewOnLoad(this.appealId).subscribe(res => {
        this.appealReviewOnLoad = res;
        this.getAppellantDetails(this.appealId);
        this.appealTypeCd = res.appealReviewInfoResponseVo.aplTypCd;
        this.programTypeCd = res.enrollmentGroupCd;
        if(res.appealReviewOverviewResponseVO){
          this.setAppealOverViewOnLoad(res);
        }
      });
    }
  }

  getAppellantDetails(aplId) {
    this.appealService.getAppealDetails(aplId).subscribe(res => {
      this.appellantInfo = res;
    });
  }

  appealTimelyDecision(value) {
    if (!value.isAppealTimely) {
      this.showAppealClosure = true;
      this.showDisenrollOrEnroll = false;
      this.appealTimely = false;
    } else {
      this.showAppealClosure = false;
      this.appealTimely = true;
    }
  }

  emitOnsiteAssessmentRequest(value) {
    this.submittedForOnSiteAssessment = value;
    if ((this.appealTypeCd == 'PR' || this.appealTypeCd == 'PA') && value) {
      this.onsiteAssesReq = true;
    } else {
      this.onsiteAssesReq = false;
    }
  }



  appealOverviewRadio(event) {
    if (this.appealTypeCd === 'DE' || this.appealTypeCd === 'EN') {
      this.showDisenrollOrEnroll = true;
    } else {
      this.showDisenrollOrEnroll = false;
    }

    if (this.appealTypeCd === 'PA' || this.appealTypeCd === 'RF') {
      this.toEnableAccordion = event.value;
    }

  }

  saveAppealOverview(overViewForm) {
    const payLoad = {
      aplReviewOverviewCobVO: {
        cobDisenrSw: overViewForm.value.disenrollFrnEnrPrg,
        cobProgramCd: overViewForm.value.progReqFrCob,
        cobStartDt: overViewForm.value.cobStartDate,
        rsnCobCretn: overViewForm.value.cobCreationReason
      },
      aplReviewOverviewVO: {
        aplTimelyCd: overViewForm.value.appealTimelyDetail,
        excpRsnCd: overViewForm.value.exceptionReasons,
        issueCobSw: overViewForm.value.issueCOB == null ? 'N' : overViewForm.value.issueCOB,
        submitAnrSw: overViewForm.value.radioButtonSelected
      }
    };
    this.appealService.saveAppealOverView(this.appealId, payLoad).subscribe(res => {
      this.showOnlyAppealDecision = false;
      if (overViewForm.value.appealTimelyDetail === 'N') {
        this.showAppealClosure = true;
        this.showDisenrollOrEnroll = false;
      } else {
        this.showAppealClosure = false;
        if (this.appealTypeCd === 'DE' || this.appealTypeCd === 'EN') {
          this.showDisenrollOrEnroll = true;
        } else if (this.appealTypeCd === 'PA' || this.appealTypeCd === 'RF') {
          this.toEnableAccordion = overViewForm.value.radioButtonSelected;
          if (this.appealTypeCd === 'RF' && overViewForm.value.radioButtonSelected === 'N') {
            this.showOnlyAppealDecision = true;
          }
        } else if (this.appealTypeCd === 'PR') {
          if (this.appealReviewOnLoad.linkedRecordPasVO.pasrrRsnCd === 'LC' &&
            (this.appealReviewOnLoad.linkedRecordPasVO.payorSourceCd === 'MD' || this.appealReviewOnLoad.linkedRecordPasVO.payorSourceCd === 'AP')) {
            if (overViewForm.value.radioButtonSelected === 'Y') {
              this.toEnableAccordion = overViewForm.value.radioButtonSelected;
            } else {
              this.enableOnsiteAssessment = true;
            }
          } else if (this.appealReviewOnLoad.linkedRecordPasVO.pasrrRsnCd === 'NC') {
            if (overViewForm.value.radioButtonSelected === 'Y') {
              this.toEnableAccordion = overViewForm.value.radioButtonSelected;
            } else {
              this.enableOnsiteAssessment = true;
            }
          } else {
            if (overViewForm.value.radioButtonSelected === 'Y') {
              this.toEnableAccordion = overViewForm.value.radioButtonSelected;
            } else {
              this.showOnlyAppealDecision = true;
            }
          }
        }
      }
    });

  }

  setAppealOverViewOnLoad(res){
    this.showOnlyAppealDecision = false;
    if (res.appealReviewOverviewResponseVO.aplReviewOverviewVO.aplTimelyCd === 'N') {
      this.showAppealClosure = true;
      this.showDisenrollOrEnroll = false;
    } else {
      this.showAppealClosure = false;
      if (this.appealTypeCd === 'DE' || this.appealTypeCd === 'EN') {
        this.showDisenrollOrEnroll = true;
      } else if (this.appealTypeCd === 'PA' || this.appealTypeCd === 'RF') {
        this.toEnableAccordion = res.appealReviewOverviewResponseVO.aplReviewOverviewVO.submitAnrSw;
        if (this.appealTypeCd === 'RF' && res.appealReviewOverviewResponseVO.aplReviewOverviewVO.submitAnrSw === 'N') {
          this.showOnlyAppealDecision = true;
        }
      } else if (this.appealTypeCd === 'PR') {
        if (this.appealReviewOnLoad.linkedRecordPasVO.pasrrRsnCd === 'LC' &&
          (this.appealReviewOnLoad.linkedRecordPasVO.payorSourceCd === 'MD' || this.appealReviewOnLoad.linkedRecordPasVO.payorSourceCd === 'AP')) {
          if (res.appealReviewOverviewResponseVO.aplReviewOverviewVO.submitAnrSw === 'Y') {
            this.toEnableAccordion = res.appealReviewOverviewResponseVO.aplReviewOverviewVO.submitAnrSw;
          } else {
            this.enableOnsiteAssessment = true;
          }
        } else if (this.appealReviewOnLoad.linkedRecordPasVO.pasrrRsnCd === 'NC') {
          if (res.appealReviewOverviewResponseVO.aplReviewOverviewVO.submitAnrSw === 'Y') {
            this.toEnableAccordion = res.appealReviewOverviewResponseVO.aplReviewOverviewVO.submitAnrSw;
          } else {
            this.enableOnsiteAssessment = true;
          }
        } else {
          if (res.appealReviewOverviewResponseVO.aplReviewOverviewVO.submitAnrSw === 'Y') {
            this.toEnableAccordion = res.appealReviewOverviewResponseVO.aplReviewOverviewVO.submitAnrSw;
          } else {
            this.showOnlyAppealDecision = true;
          }
        }
      }
    }
  }

  appealsNurseReviewSaved(event) {
    if(event){
      if (this.appealTypeCd === 'PR') {
        if (this.appealReviewOnLoad.linkedRecordPasVO.pasrrRsnCd === 'HE') {
          this.showOnlyAppealDecision = true;
        } else if (this.appealReviewOnLoad.linkedRecordPasVO.pasrrRsnCd === 'LC'
          && (this.appealReviewOnLoad.linkedRecordPasVO.payorSourceCd === 'MD' || this.appealReviewOnLoad.linkedRecordPasVO.payorSourceCd === 'AP')) {
          this.enableOnsiteAssessment = true;
        }
      }
    }
  }

  targetPopulationSaved(payLoad) {
    this.appealService.saveTargetPopulation(this.appealId, payLoad).subscribe(res => {
      if ((this.appealTypeCd === 'PR' && this.appealReviewOnLoad.linkedRecordPasVO.pasrrRsnCd === 'LC' &&
        (this.appealReviewOnLoad.linkedRecordPasVO.payorSourceCd === 'MD' ||
          this.appealReviewOnLoad.linkedRecordPasVO.payorSourceCd === 'AP')) ||
        this.appealTypeCd === 'PA') {
        this.enableOnsiteAssessment = true;
      } else {
        this.onsiteAssesReq = true;
      }
    });
  }

  saveDisenrollment(event) {
    if(event){
      this.showOnlyAppealDecision = true;
    }
  }

  emitAppealDecision(form) {
    this.appealDecisionForm = form;
    if (form.value.appealDecision !== '') {
      if (form.value.appealDecision === 'HO') {
        if (form.value.appealDenialReason !== '') {
          this.isNextEnabled = false;
        } else {
          this.isNextEnabled = true;
        }
      } else {
        this.isNextEnabled = false;
      }
    } else {
      this.isNextEnabled = true;
    }
  }

  emitOnSubmitOnAssessmentRequest(event) {
    if (event.value) {
      this.isNextEnabled = false;
      this.onsiteAssessmentReqSubmitted = true;
      this.onsiteAssessmentReqResponse = event.res;
    } else {
      this.onsiteAssessmentReqSubmitted = false;
    }
  }

  next() {
    if (this.onsiteAssessmentReqSubmitted && !this.submittedForOnSiteAssessment) {
      const nextForm = 'APPEAL_ONSITE_ASSESSMENT';
      const nextStepperData = { nextStepper: AppealStepper[nextForm], isLinear: true, appealReviewAplId: this.appealId, reviewData: this.onsiteAssessmentReqResponse };
      this.completedAppealReview.emit(nextStepperData);
    } else {
      const payLoad = {
        appealDecisionCd: this.appealDecisionForm.value.appealDecision,
        denialRsnCode: this.appealDecisionForm.value.appealDenialReason
      };
      this.appealService.saveAppealDecision(this.appealId, payLoad).subscribe(res => {
        let nextForm = '';
        let isLinear: boolean;
        if (this.appealDecisionForm.value.appealDecision === 'HO') {
          nextForm = 'APPEAL_HEARING';
          isLinear = false;
        } else {
          nextForm = 'APPEAL_RESOLUTION';
          isLinear = false;
        }
        const nextStepperData = { nextStepper: AppealStepper[nextForm], isLinear };
        this.completedAppealReview.emit(nextStepperData);
      });
    }
  }

  back() {
    const previousForm = 'APPEAL_DETAIL';
    const nextStepperData = { nextStepper: AppealStepper[previousForm], isLinear: true };
    this.completedAppealReview.emit(nextStepperData);
  }


}
