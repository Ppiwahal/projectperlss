import { SelfCareComponent } from './referral-dashboard/referral-forms/lsa-form/self-care/self-care.component';
import { RefConfirmationComponent } from './ref-confirmation/ref-confirmation.component';
import { ReferralSubmitComponent } from './referral-submit/referral-submit.component';
import { RefCareAndSupportComponent } from './ref-care-and-support/ref-care-and-support.component';
import { ReferralSchoolWorkComponent } from './referral-school-work/referral-school-work.component';
import { ReferralStartComponent } from './referral-start/referral-start.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReferralRoutingModule } from './referral-routing.module';
import { ReferralComponent } from './referral.component';
import { ReferralStepperComponent } from './referral-stepper-start/referral-stepper.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppMaterialModule } from '../_shared/app-material.module';
import { RefApplicantComponent } from './ref-applicant/ref-applicant.component';
import { RefContactComponent } from './ref-contact/ref-contact.component';
import { RecommendationFormComponent } from './referral-dashboard/referral-forms/recommendation-form/recommendation-form.component';
import { ReferralDashboardComponent } from './referral-dashboard/referral-dashboard.component';
import { CommitteeReviewGroup8FormComponent } from './referral-dashboard/referral-forms/committee-review-group8-form/committee-review-group8-form.component';
import { CommitteeReviewGroup7FormComponent } from './referral-dashboard/referral-forms/committee-review-group7-form/committee-review-group7-form.component';
import { EmergentCircumstancesReviewFormComponent } from './referral-dashboard/referral-forms/emergent-circumstances-review-form/emergent-circumstances-review-form.component';
import { LsaFormComponent } from './referral-dashboard/referral-forms/lsa-form/lsa-form.component';
import { MultipleComplexFormComponent } from './referral-dashboard/referral-forms/multiple-complex-form/multiple-complex-form.component';
import { PlannedTransitionPopupComponent } from './referral-dashboard/referral-forms/planned-transition-popup/planned-transition-popup.component';
import { SustainCurrentFamilyLivArrangementsFormComponent } from './referral-dashboard/referral-forms/sustain-current-family-liv-arrangements-form/sustain-current-family-liv-arrangements-form.component';
import { ReferralIntakeActionsComponent } from './referral-dashboard/referral-intake-actions/referral-intake-actions.component';
import { ReferralIntakeOutcomeComponent } from './referral-dashboard/referral-intake-outcome/referral-intake-outcome.component';
import { NgxMaskModule } from 'ngx-mask';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxMatDatetimePickerModule, NgxMatTimepickerModule, NgxMatNativeDateModule } from '@angular-material-components/datetime-picker';
import { NgxMatMomentModule } from '@angular-material-components/moment-adapter';
import { ReferralScheduleIntakeVisitComponent } from './referral-dashboard/referral-intake-actions/referral-schedule-intake-visit/referral-schedule-intake-visit.component';
import { ReferralEnterIntakeOutcomeComponent } from './referral-dashboard/referral-intake-actions/referral-enter-intake-outcome/referral-enter-intake-outcome.component';


@NgModule({
  declarations: [ReferralComponent,
    ReferralStepperComponent,
    ReferralStartComponent,
    RefApplicantComponent,
    RefContactComponent,
    ReferralSchoolWorkComponent,
    RefCareAndSupportComponent,
    ReferralSubmitComponent,
    RefConfirmationComponent,
    PlannedTransitionPopupComponent,
    RecommendationFormComponent,
    ReferralDashboardComponent,
    ReferralIntakeActionsComponent,
    ReferralIntakeOutcomeComponent,
    MultipleComplexFormComponent,
    EmergentCircumstancesReviewFormComponent,
    CommitteeReviewGroup8FormComponent,
    CommitteeReviewGroup7FormComponent,
    SustainCurrentFamilyLivArrangementsFormComponent,
    LsaFormComponent,
    SelfCareComponent,
    ReferralScheduleIntakeVisitComponent,
    ReferralEnterIntakeOutcomeComponent,

  ],
  imports: [
    NgSelectModule,
    CommonModule,
    ReferralRoutingModule,
    AppMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMatTimepickerModule,
    NgxMatDatetimePickerModule,
    NgxMatMomentModule,
    NgxMaskModule.forRoot()
  ]
})
export class ReferralModule { }
