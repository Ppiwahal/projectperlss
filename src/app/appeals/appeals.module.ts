import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AppMaterialModule } from '../_shared/app-material.module';
import { AppealsComponent } from './appeals.component';
import { AppealsDashboardComponent } from './appeals-dashboard/appeals-dashboard.component';
import { AppealsStepperComponent } from './appeals-stepper/appeals-stepper.component';
import { AppealsRoutingModule } from './appeals-routing.module';
import { AppealStartComponent } from './appeal-start/appeal-start.component';
import { AppellantDetailsComponent } from './appellant-details/appellant-details.component';
import { AppealOnsiteAssessmentComponent } from './appeal-onsite-assessment/appeal-onsite-assessment.component';
import { AppealSelectActionComponent } from './appeal-select-action/appeal-select-action.component';
import { AppealDashboardOnsiteAssessmentComponent } from './appeal-dashboard-onsite-assessment/appeal-dashboard-onsite-assessment.component';
import { AppealHearingSummaryPopupComponent } from './appeal-hearing-summary-popup/appeal-hearing-summary-popup.component';
import { AppealDashboardHearingCalendarComponent } from './appeal-dashboard-hearing-calendar/appeal-dashboard-hearing-calendar.component';
import { RequestedDocumentsComponent } from './appeal-select-action/requested-documents/requested-documents.component';
import { SpecialServiceComponent } from './appeal-select-action/special-service/special-service.component';
import { PersonDetailsComponent } from './appellant-details/person-details/person-details.component';
import { PersonTableComponent } from './appellant-details/person-table/person-table.component';
import { AppealRepresentativeComponent } from './appellant-details/appeal-representative/appeal-representative.component';
import { AppealTypeComponent } from './appellant-details/appeal-type/appeal-type.component';
import { AppealToPaeTableComponent } from './appellant-details/appeal-to-pae-table/appeal-to-pae-table.component';
import { AppealToReferralTableComponent } from './appellant-details/appeal-to-referral-table/appeal-to-referral-table.component';
import { AppealTypePasrrComponent } from './appellant-details/appeal-type-pasrr/appeal-type-pasrr.component';
import { AppealRepresentativeAccordionComponent } from './appellant-details/appeal-representative-accordion/appeal-representative-accordion.component';
import { AppealRepresentativeDetailsComponent } from './appellant-details/appeal-representative-details/appeal-representative-details.component';
import { AppellantInfoComponent } from './appellant-info/appellant-info.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import { AppealReviewComponent } from './appeal-review/appeal-review.component';
import { LinkedRecordSummaryComponent } from './appeal-review/linked-record-summary/linked-record-summary.component';
import { AppealOverviewComponent } from './appeal-review/appeal-overview/appeal-overview.component';
import { DisenrollmentDetailsComponent } from './appeal-review/disenrollment-details/disenrollment-details.component';
FullCalendarModule.registerPlugins([dayGridPlugin]);
import {AppealDashboardDocketWorkbookComponent} from './appeal-dashboard-docket-workbook/appeal-dashboard-docket-workbook.component';
import { AppealDecisionComponent } from './appeal-review/appeal-decision/appeal-decision.component';
import { PhysicalAddressModule } from '../_shared/components/physical-address/physical-address.module';
import { AppealsNurseReviewComponent } from './appeal-review/appeals-nurse-review/appeals-nurse-review.component';
import { TargetPopulationReviewComponent } from './appeal-review/target-population-review/target-population-review.component';
import { OnsiteAssessmentRequestComponent } from './appeal-review/onsite-assessment-request/onsite-assessment-request.component';
import { NgxMaskModule } from 'ngx-mask';
import { OnsiteEvaluationComponent } from './appeal-onsite-assessment/onsite-evaluation/onsite-evaluation.component';
import { SafteyJustificationComponent } from './appeal-onsite-assessment/saftey-justification/saftey-justification.component';
import { OnsiteAssessmentResultsComponent } from './appeal-onsite-assessment/onsite-assessment-results/onsite-assessment-results.component';
import { OnsiteAssessmentTableComponent } from './appeal-onsite-assessment/onsite-assessment-table/onsite-assessment-table.component';
import { OnsiteAssessmentRequestedComponent } from './appeal-onsite-assessment/onsite-assessment-requested/onsite-assessment-requested.component';
import { OnsiteAssessmentUploaddocComponent } from './appeal-onsite-assessment/onsite-assessment-uploaddoc/onsite-assessment-uploaddoc.component';
import { DocumentsReceivedPostNOHComponent } from './appeal-onsite-assessment/documents-received-post-noh/documents-received-post-noh.component';
import { AppealsReviewOfOnsiteComponent } from './appeals-review-of-onsite/appeals-review-of-onsite.component';
import { OnsiteReviewTableComponent } from './appeals-review-of-onsite/onsite-review-table/onsite-review-table.component';
import { DocumentationRequiredComponent } from './appeals-review-of-onsite/documentation-required/documentation-required.component';
import { OnsiteAssessmentCorrectionComponent } from './appeals-review-of-onsite/onsite-assessment-correction/onsite-assessment-correction.component';
import { TargetPopulationDeterminationComponent } from './appeals-review-of-onsite/target-population-determination/target-population-determination.component';
import { OnsiteOutcomeComponent } from './appeals-review-of-onsite/onsite-outcome/onsite-outcome.component';
import { AppealHearingComponent } from './appeal-hearing/appeal-hearing.component';
import { HearingDetailsComponent } from './appeal-hearing/hearing-details/hearing-details.component';
import { CaseReferralPacketComponent } from './appeal-hearing/case-referral-packet/case-referral-packet.component';
import { InitialOrderComponent } from './appeal-hearing/initial-order/initial-order.component';
import { ReconsiderationsInitialOrderComponent } from './appeal-hearing/reconsiderations-initial-order/reconsiderations-initial-order.component';
import { HearingOrderDetailsComponent } from './appeal-hearing/hearing-order-details/hearing-order-details.component';
import { RequestSummaryComponent } from './appeal-select-action/request-summary/request-summary.component';
import { UpdateDocketComponent } from './appeal-select-action/update-docket/update-docket.component';
import { RescheduleHearingComponent } from './appeal-select-action/reschedule-hearing/reschedule-hearing.component';
import { UploadOrderComponent } from './appeal-select-action/upload-order/upload-order.component';
import { WithdrawAppealComponent } from './appeal-select-action/withdraw-appeal/withdraw-appeal.component';
import { PasrrCorrectionLetterComponent } from './appeal-select-action/pasrr-correction-letter/pasrr-correction-letter.component';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { AppealResolutionComponent } from './appeal-resolution/appeal-resolution.component';
import { AppealResolutionClosureComponent } from './appeal-resolution/appeal-resolution-closure/appeal-resolution-closure.component';
import { AppealResolutionApprovalComponent } from './appeal-resolution/appeal-resolution-approval/appeal-resolution-approval.component';
import { AppealResolutionHearingComponent } from './appeal-resolution/appeal-resolution-hearing/appeal-resolution-hearing.component';
import { HearingSummaryComponent } from './hearing-summary/hearing-summary.component';
import { AppellantInfoDemographicComponent } from './appellant-info-demographic/appellant-info-demographic.component';
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    AppealsComponent,
    HearingSummaryComponent,
    AppealsDashboardComponent,
    AppealsStepperComponent,
    AppealStartComponent,
    AppellantInfoDemographicComponent,
    AppellantDetailsComponent,
    AppealOnsiteAssessmentComponent,
    AppealSelectActionComponent,
    AppealDashboardOnsiteAssessmentComponent,
    AppealHearingSummaryPopupComponent,
    AppealDashboardHearingCalendarComponent,
    RequestedDocumentsComponent,
    SpecialServiceComponent,
    PersonDetailsComponent,
    PersonTableComponent,
    AppealRepresentativeComponent,
    AppealTypeComponent,
    AppealToPaeTableComponent,
    AppealToReferralTableComponent,
    AppealTypePasrrComponent,
    AppealRepresentativeAccordionComponent,
    AppealRepresentativeDetailsComponent,
    AppellantInfoComponent,
    AppealDashboardDocketWorkbookComponent,
    AppealReviewComponent,
    LinkedRecordSummaryComponent,
    AppealOverviewComponent,
    DisenrollmentDetailsComponent,
    AppealDecisionComponent,
    AppealsNurseReviewComponent,
    TargetPopulationReviewComponent,
    OnsiteAssessmentRequestComponent,
    OnsiteEvaluationComponent,
    SafteyJustificationComponent,
    OnsiteAssessmentResultsComponent,
    OnsiteAssessmentTableComponent,
    OnsiteAssessmentRequestedComponent,
    OnsiteAssessmentUploaddocComponent,
    DocumentsReceivedPostNOHComponent,
    AppealsReviewOfOnsiteComponent,
    OnsiteReviewTableComponent,
    DocumentationRequiredComponent,
    OnsiteAssessmentCorrectionComponent,
    TargetPopulationDeterminationComponent,
    OnsiteOutcomeComponent,
    AppealHearingComponent,
    HearingDetailsComponent,
    CaseReferralPacketComponent,
    InitialOrderComponent,
    ReconsiderationsInitialOrderComponent,
    HearingOrderDetailsComponent,
    RequestSummaryComponent,
    UpdateDocketComponent,
    RescheduleHearingComponent,
    UploadOrderComponent,
    WithdrawAppealComponent,
    PasrrCorrectionLetterComponent,
    AppealResolutionComponent,
    AppealResolutionClosureComponent,
    AppealResolutionApprovalComponent,
    AppealResolutionHearingComponent
  ],
  imports: [
    CommonModule,
    AppealsRoutingModule,
    ReactiveFormsModule,
    AppMaterialModule,
    FullCalendarModule,
    PhysicalAddressModule,
    NgxMaterialTimepickerModule,
    FormsModule,
    NgxMaskModule.forRoot()
  ]
})
export class AppealsModule { }
