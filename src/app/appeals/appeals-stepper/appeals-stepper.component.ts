import { Component, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { AppealService } from '../services/appeal.service';

@Component({
  selector: 'app-appeals-stepper',
  templateUrl: './appeals-stepper.component.html',
  styleUrls: ['./appeals-stepper.component.scss']
})
export class AppealsStepperComponent implements OnInit, OnChanges, OnDestroy {

  isLinear = true;
  currentForm = 0;
  @ViewChild('stepper') stepper: MatStepper;
  showAppellantAction = false;
  showAppealSelectAction = true;
  dataFromAppealStart: any;
  appealId: any;
  passrRefrenceTableData: any;
  searchElement: any;
  appealReviewAplId: any;
  dataFromReview: any;
  onsiteAplId: any;
  appealStatus: any;
  programType: any;
  cobStatus: any;
  appealType: any;
  onsiteAssessmentStatus: any;
  appealHearingStatus: any;
  isShowReconsiderations = false;
  appellantInfoStatus = {};
  subscriptions$ = [];

  constructor(private appealService: AppealService) { }

  ngOnInit() {
    this.getAppealHearingStatus();
    this.getAppealStatus();
    this.getAppealType();
    this.getCobStatus();
    this.getOnsiteAssessmentStatus();
    this.getProgramType();
    if (window.history.state && window.history.state.quickActionData) {
      this.searchElement = window.history.state.quickActionData;
      this.appealId = this.searchElement.aplId;
      this.showAppealSelectAction = false;
    }
    if (window.history.state && window.history.state.continueData) {
      this.searchElement = window.history.state.continueData;
      this.appealId = this.searchElement.aplId;
      this.pageTitleNavigation(this.searchElement);
    }
    if (window.history.state && window.history.state.continueHearingSummaryData) {
      this.searchElement = window.history.state.continueHearingSummaryData;
      this.appealId = this.searchElement.aplId;
      this.showAppealSelectAction = false;
    }
  }

  getProgramType() {
    const EnrollmentGroupSubscriptions$ = this.appealService.getAppealDropdowns('ENROLLMENT_GROUP').subscribe(response => {
      this.programType = response;
      this.checkValues();
    });
    this.subscriptions$.push(EnrollmentGroupSubscriptions$);
  }

  getCobStatus() {
    const CobStatusSubscriptions$ = this.appealService.getAppealDropdowns('COB_STATUS').subscribe(response => {
      this.cobStatus = response;
      this.checkValues();
    });
    this.subscriptions$.push(CobStatusSubscriptions$);
  }

  getAppealType() {
    const AppealTypeSubscriptions$ = this.appealService.getAppealDropdowns('APPEAL_TYPE').subscribe(response => {
      this.appealType = response;
      this.checkValues();
    });
    this.subscriptions$.push(AppealTypeSubscriptions$);
  }

  getOnsiteAssessmentStatus() {
    const OnsiteAssessmentSubscriptions$ = this.appealService.getAppealDropdowns('ONSITEASSESSMENT_STATUS').subscribe(response => {
      this.onsiteAssessmentStatus = response;
      this.checkValues();
    });
    this.subscriptions$.push(OnsiteAssessmentSubscriptions$);
  }

  getAppealHearingStatus() {
    const AppealHearingStatusSubscriptions$ = this.appealService.getAppealDropdowns('APPEALHEARING_STATUS').subscribe(response => {
      this.appealHearingStatus = response;
      this.checkValues();
    });
    this.subscriptions$.push(AppealHearingStatusSubscriptions$);
  }

  getAppealStatus() {
    const AppealStatusSubscriptions$ = this.appealService.getAppealDropdowns('APPEAL_STATUS').subscribe(response => {
      this.appealStatus = response;
      this.checkValues();
    });
    this.subscriptions$.push(AppealStatusSubscriptions$);
  }

  pageTitleNavigation(element) {
    if (element.pageId === 'PSBAS') {
      this.showAppealSelectAction = false;
    } else if (element.pageId === 'PAARE') {
      this.isLinear = false;
      this.showAppealSelectAction = false;
      this.currentForm = 6;
    } else if (element.pageId === 'PAAHE') {
      this.isLinear = false;
      this.showAppealSelectAction = false;
      this.currentForm = 5;
    } else if (element.pageId === 'PSBRO') {
      this.isLinear = false;
      this.showAppealSelectAction = false;
      this.currentForm = 4;
    } else if (element.pageId === 'PSBOA') {
      this.isLinear = false;
      this.showAppealSelectAction = false;
      this.currentForm = 3;
    } else if (element.pageId === 'PSBAR') {
      this.isLinear = false;
      this.showAppealSelectAction = false;
      this.currentForm = 2;
    } else if (element.pageId === 'TNPOA') {
      this.isLinear = false;
      this.showAppealSelectAction = false;
      this.currentForm = 3;
    }
  }

  ngOnChanges() {
    this.stepper.selected.completed = false;
  }

  checkValues() {
    if (this.programType && this.cobStatus && this.appealType &&
      this.onsiteAssessmentStatus && this.appealHearingStatus && this.appealStatus) {
      Object.assign(this.appellantInfoStatus, { programType: this.programType });
      Object.assign(this.appellantInfoStatus, { cobStatus: this.cobStatus });
      Object.assign(this.appellantInfoStatus, { appealType: this.appealType });
      Object.assign(this.appellantInfoStatus, { onsiteAssessmentStatus: this.onsiteAssessmentStatus });
      Object.assign(this.appellantInfoStatus, { appealHearingStatus: this.appealHearingStatus });
      Object.assign(this.appellantInfoStatus, { appealStatus: this.appealStatus });
    }
  }

  appealCreated(event) {
    this.showAppealSelectAction = false;
    this.searchElement = event;
    this.appealId = event.aplId;
  }

  showReconsiderations(event) {
    this.isShowReconsiderations = true;
  }

  navigateToStepper(event) {
    if (event === 'Onsite Assessment') {
      this.isLinear = false;
      this.showAppealSelectAction = false;
      this.currentForm = 3;
    } else if (event === 'Appealant Details') {
      this.isLinear = false;
      this.showAppealSelectAction = false;
      this.currentForm = 1;
    }
  }

  selectedIndex(currentStepperData) {
    this.stepper.selected.completed = true;
    if (currentStepperData.dataFromAppealStart !== undefined) {
      this.dataFromAppealStart = currentStepperData.dataFromAppealStart;
    }
    if (currentStepperData.dataFromAppealDetails && !currentStepperData.isLinear) {
      this.appealId = currentStepperData.dataFromAppealDetails.aplId;
      this.passrRefrenceTableData = currentStepperData.passrRefrenceTableCodes;
    }
    if (currentStepperData.appealReviewAplId) {
      this.appealReviewAplId = currentStepperData.appealReviewAplId;
    }
    if (currentStepperData.reviewData) {
      this.dataFromReview = currentStepperData.reviewData;
    }
    if (currentStepperData.reviewData) {
      this.dataFromReview = currentStepperData.reviewData;
    }
    if (currentStepperData.onsiteAssessmentAplId) {
      this.onsiteAplId = currentStepperData.onsiteAssessmentAplId;
    }
    this.isLinear = currentStepperData.isLinear;
    this.currentForm = currentStepperData.nextStepper;
  }

  ngOnDestroy() {
    if (this.subscriptions$ && this.subscriptions$.length > 0) {
      this.subscriptions$.forEach(subscription$ => subscription$.unsubscribe());
    }
  }

}
