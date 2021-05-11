import { PaeComponent } from './pae.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
//import { PendingChangesGuard } from '../core/helpers/pending-change.guard';
import { AuthGuard } from '../core/helpers/auth.guard';
import { PaeApplicantInformationComponent } from './pae-applicant-information/pae-applicant-information.component';
import { PaeAppointmentComponent } from './pae-appointment/pae-appointment.component';
import { PaeContactInformationComponent } from './pae-contact-information/pae-contact-information.component';
import { PaeDiagnosisSummaryComponent } from './pae-diagnosis-summary/pae-diagnosis-summary.component';
import { PaeFunctionalAssessmentSummaryComponent } from './pae-functional-assessment-summary/pae-functional-assessment-summary.component';
import { PaeIntensiveInterventionsComponent } from './pae-intensive-interventions/pae-intensive-interventions.component';
import { PaeLivingArrangementComponent } from './pae-living-arrangement/pae-living-arrangement.component';
import { PaeNutritionFeedingComponent } from './pae-nutrition-feeding/pae-nutrition-feeding.component';
import { PaeSafetyDeterminationFallHistoryComponent } from './pae-safety-determination-fall-history/pae-safety-determination-fall-history.component';
import { PaeSelectProgramComponent } from './pae-select-program/pae-select-program.component';
import { PaeWelcomeComponent } from './pae-welcome/pae-welcome.component';
import { PaeCapabilitiesPartOneComponent } from './pae-capabilities-part-one/pae-capabilities-part-one.component';
import { PaeCapabilitiesPartTwoComponent } from './pae-capabilities-part-two/pae-capabilities-part-two.component';
import { PaeActivitiesPartOneComponent } from './pae-activities-part-one/pae-activities-part-one.component';
import { PaeActivitiesPartTwoComponent } from './pae-activities-part-two/pae-activities-part-two.component';
import { PaeCapabilitiesKbPartOneComponent } from './pae-capabilities-kb-part-one/pae-capabilities-kb-part-one.component';
import { PaeCapabilitiesKbPartTwoComponent } from './pae-capabilities-kb-part-two/pae-capabilities-kb-part-two.component';
import { PaeSafetyAssessmentSummaryComponent } from './pae-safety-assessment-summary/pae-safety-assessment-summary.component';
import { PaeSafetyDeterminationComponent } from './pae-safety-determination/pae-safety-determination.component';
import { MedicalDiagonsisComponent } from './pae-medical-diagnosis/medical-diagonsis/medical-diagonsis.component';
import { PaeTransportationSpecialtyCareComponent } from './pae-transportation-specialty-care/pae-transportation-specialty-care.component';
import { PaeMedicalPrognosisComponent } from './pae-medical-prognosis/pae-medical-prognosis.component';
import { PaeMedicalRegimenComponent } from './pae-prioritization-details/pae-medical-regimen/pae-medical-regimen.component';
import { PaeSkilledServicesSummaryComponent } from './pae-skilled-services/pae-skilled-services-summary/pae-skilled-services-summary.component';
import { PaeSkilledServicesDetailsComponent } from './pae-skilled-services/pae-skilled-services-details/pae-skilled-services-details.component';
import { PaeEnhancedRespiratoryCareComponent } from './pae-skilled-services/pae-enhanced-respiratory-care/pae-enhanced-respiratory-care.component';
import { PaeIddDeterminationSummaryComponent } from './pae-idd-determination-summary/pae-idd-determination-summary.component';
import { PaeIddDetailsComponent } from './pae-idd-details/pae-idd-details.component';
import { PaeCostNeutralityDetailsComponent } from './pae-cost-neutrality-details/pae-cost-neutrality-details.component';
import { PaeCostNeutralityPlanOfCareComponent } from './pae-cost-neutrality-plan-of-care/pae-cost-neutrality-plan-of-care.component';
import { PaeCostNeutralityComponent } from './pae-cost-neutrality/pae-cost-neutrality.component';
import { PaeAdditionalBehavioralQualifiersComponent } from './pae-additional-behavioral-qualifiers/pae-additional-behavioral-qualifiers.component';
import { PaePrioritizationSummaryComponent } from './pae-prioritization-details/pae-prioritization-summary/pae-prioritization-summary.component';
import { PaeSummaryComponent } from './pae-summary/pae-summary.component';
import { PaeNonFebrileSeizuresComponent } from './pae-non-febrile-seizures/pae-non-febrile-seizures.component';
import { PaeAggressiveBehaviorComponent } from './pae-aggressive-behavior/pae-aggressive-behavior.component';
import { PaeServiceSystemsComponent } from './pae-service-systems/pae-service-systems.component';
import { PaeConfirmationComponent } from './pae-confirmation/pae-confirmation.component';
import { PaeBehavioralSupportSummaryComponent } from './pae-behavioral-support-summary/pae-behavioral-support-summary.component';
import { PaeSubmitComponent } from './pae-submit/pae-submit.component';
import { PaeLocDeterminationComponent } from './pae-loc-determination/pae-loc-determination.component';

import { paeDocumentSummaryComponent } from './pae-document-summary/pae-document-summary.component';
import { PaeCaregiverDetailsComponent } from './pae-caregiver-details/pae-caregiver-details.component';

const routes: Routes = [{
  path: '', component: PaeComponent, children: [
    { path: '', pathMatch: 'full', redirectTo: 'applicantInformation' },
    { path: 'applicantInformation', component: PaeApplicantInformationComponent, canActivate: [AuthGuard]},
    { path: 'contactInformation', component: PaeContactInformationComponent, canActivate: [AuthGuard]},
    { path: 'livingArrangement', component: PaeLivingArrangementComponent, canActivate: [AuthGuard]},
    { path: 'selectProgram', component: PaeSelectProgramComponent, canActivate: [AuthGuard]  },
    { path: 'appointment', component: PaeAppointmentComponent, canActivate: [AuthGuard]},
    { path: 'diagnosisSummary', component: PaeDiagnosisSummaryComponent, canActivate: [AuthGuard] },
    { path: 'safetydetermination', component: PaeSafetyDeterminationComponent, canActivate: [AuthGuard]},
    { path: 'welcome', component: PaeWelcomeComponent, canActivate: [AuthGuard] },
    { path: 'functionalAssessment', component: PaeFunctionalAssessmentSummaryComponent, canActivate: [AuthGuard] },
    { path: 'fallHistory', component: PaeSafetyDeterminationFallHistoryComponent, canActivate: [AuthGuard]},
    { path: 'nutritionFeeding', component: PaeNutritionFeedingComponent, canActivate: [AuthGuard]},
    { path: 'capabilitiesPartOne', component: PaeCapabilitiesPartOneComponent, canActivate: [AuthGuard] },
    { path: 'capabilitiesPartTwo', component: PaeCapabilitiesPartTwoComponent, canActivate: [AuthGuard] },
    { path: 'activitiesPartOne', component: PaeActivitiesPartOneComponent, canActivate: [AuthGuard]},
    { path: 'nonFebrileSeizures', component: PaeNonFebrileSeizuresComponent, canActivate: [AuthGuard]},
    { path: 'paeSummary', component: PaeSummaryComponent, canActivate: [AuthGuard]},
    { path: 'activitiesPartTwo', component: PaeActivitiesPartTwoComponent, canActivate: [AuthGuard]},
    { path: 'capabilitiesKbPartOne', component: PaeCapabilitiesKbPartOneComponent, canActivate: [AuthGuard] },
    { path: 'capabilitiesKbPartTwo', component: PaeCapabilitiesKbPartTwoComponent, canActivate: [AuthGuard] },
    { path: 'intensiveInterventions', component: PaeIntensiveInterventionsComponent, canActivate: [AuthGuard]},
    { path: 'safetyAssessmentSummary', component: PaeSafetyAssessmentSummaryComponent, canActivate: [AuthGuard]},
    { path: 'medicalDiagnosis', component: MedicalDiagonsisComponent, canActivate: [AuthGuard]},
    {path: 'ServiceSystemsComponent', component: PaeServiceSystemsComponent, canActivate: [AuthGuard]},
    { path: 'medicalPrognosis', component: PaeMedicalPrognosisComponent, canActivate: [AuthGuard]},
    { path: 'aggressiveBehavior', component: PaeAggressiveBehaviorComponent, canActivate: [AuthGuard]},
    { path: 'medicalRegimen', component: PaeMedicalRegimenComponent, canActivate: [AuthGuard]},
    { path: 'skilledServicesSummary', component: PaeSkilledServicesSummaryComponent, canActivate: [AuthGuard] },
    { path: 'skilledServicesDetails', component: PaeSkilledServicesDetailsComponent, canActivate: [AuthGuard]},
    { path: 'enhancedRespiratoryCare', component: PaeEnhancedRespiratoryCareComponent, canActivate: [AuthGuard]},
    { path: 'IddDeterminationSummary', component: PaeIddDeterminationSummaryComponent, canActivate: [AuthGuard] },
    { path: 'IddDetails', component: PaeIddDetailsComponent, canActivate: [AuthGuard]},
    { path: 'costNeutralityDetails', component: PaeCostNeutralityDetailsComponent, canActivate: [AuthGuard]},
    { path: 'costNeutralityPlanOfCare', component: PaeCostNeutralityPlanOfCareComponent, canActivate: [AuthGuard]},
    { path: 'costNeutralitySummary', component: PaeCostNeutralityComponent, canActivate: [AuthGuard] },
    { path: 'AdditionalBehavioralQualifiers', component: PaeAdditionalBehavioralQualifiersComponent, canActivate: [AuthGuard]},
    { path: 'transportationSpecialityCare', component: PaeTransportationSpecialtyCareComponent, canActivate: [AuthGuard]},
    { path: 'prioritizationSummary', component: PaePrioritizationSummaryComponent, canActivate: [AuthGuard] },
    { path: 'confirmation', component: PaeConfirmationComponent, canActivate: [AuthGuard] },
    { path: 'behavioralSummary', component: PaeBehavioralSupportSummaryComponent, canActivate: [AuthGuard] },
    { path: 'LOCDetermination', component: PaeLocDeterminationComponent, canActivate: [AuthGuard] },
    { path: 'paeReviewSubmit', component:PaeSubmitComponent, canActivate:[AuthGuard]},
    {path: 'documentSummary', component:paeDocumentSummaryComponent, canActivate:[AuthGuard]},
    {path: 'PaeCaregiverDetails', component:PaeCaregiverDetailsComponent, canActivate:[AuthGuard]}
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaeRoutingModule { }
