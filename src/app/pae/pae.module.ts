import { PaeCommonService } from 'src/app/core/services/pae/pae-common/pae-common.service';
import { PaeService } from 'src/app/core/services/pae/pae.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppMaterialModule } from './../_shared/app-material.module';
import { PaeComponent } from './pae.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaeRoutingModule } from './pae-routing.module';
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
import { SharedModule } from '../shared/shared.module';
import { PaeCapabilitiesPartOneComponent } from './pae-capabilities-part-one/pae-capabilities-part-one.component';
import { PaeCapabilitiesPartTwoComponent } from './pae-capabilities-part-two/pae-capabilities-part-two.component';
import { PaeActivitiesPartOneComponent } from './pae-activities-part-one/pae-activities-part-one.component';
import { PaeActivitiesPartTwoComponent } from './pae-activities-part-two/pae-activities-part-two.component';
import { PaeCapabilitiesKbPartOneComponent } from './pae-capabilities-kb-part-one/pae-capabilities-kb-part-one.component';
import { PaeCapabilitiesKbPartTwoComponent } from './pae-capabilities-kb-part-two/pae-capabilities-kb-part-two.component';
import { PaeSafetyAssessmentSummaryComponent } from './pae-safety-assessment-summary/pae-safety-assessment-summary.component';
import { PaeSafetyDeterminationComponent } from './pae-safety-determination/pae-safety-determination.component';
import { SafetyDeterminationAdmissionPopupComponent } from './../_shared/modal/safety-determination-admission-popup/safety-determination-admission-popup.component';
import { MedicalDiagnosisEcfApplicationComponent } from './pae-medical-diagnosis/medical-diagnosis-ecf-application/medical-diagnosis-ecf-application.component';
import { MedicalDiagnosisHcbsApplicationComponent } from './pae-medical-diagnosis/medical-diagnosis-hcbs-application/medical-diagnosis-hcbs-application.component';
import { MedicalDiagnosisKbApplicationComponent } from './pae-medical-diagnosis/medical-diagnosis-kb-application/medical-diagnosis-kb-application.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { MedicalDiagonsisComponent } from './pae-medical-diagnosis/medical-diagonsis/medical-diagonsis.component';
import { MedicalDiagnosisICFComponent } from './pae-medical-diagnosis/medical-diagnosis-icf-application/medical-diagnosis-icf-application.component';
import { MedicalDiagonsis } from './Diagnosisdata';
import { PaeRequestDatePopupComponent } from './pae-select-program/pae-request-date-popup/pae-request-date-popup.component';
import { PaeMedicalPrognosisComponent } from './pae-medical-prognosis/pae-medical-prognosis.component';
import { PaeSkilledServicesSummaryComponent } from './pae-skilled-services/pae-skilled-services-summary/pae-skilled-services-summary.component';
import { PaeSkilledServicesDetailsComponent } from './pae-skilled-services/pae-skilled-services-details/pae-skilled-services-details.component';
import { PaeEnhancedRespiratoryCareComponent } from './pae-skilled-services/pae-enhanced-respiratory-care/pae-enhanced-respiratory-care.component';
import { PaeMedicalRegimenComponent } from './pae-prioritization-details/pae-medical-regimen/pae-medical-regimen.component';
import { PaeTransportationSpecialtyCareComponent } from './pae-transportation-specialty-care/pae-transportation-specialty-care.component';
import { PaeSkilledServicesDetailsOtherComponent } from './pae-skilled-services/pae-skilled-services-details/pae-skilled-details-other/pae-skilled-services-details-other.component';
import { PaeSkilledServicesDetailsKbComponent } from './pae-skilled-services/pae-skilled-services-details/pae-skilled-details-kb/pae-skilled-services-details-kb.component';
import { PaeIddDeterminationSummaryComponent } from './pae-idd-determination-summary/pae-idd-determination-summary.component';
import { PaeIddDetailsComponent } from './pae-idd-details/pae-idd-details.component';
import { PaeAdditionalBehavioralQualifiersComponent } from './pae-additional-behavioral-qualifiers/pae-additional-behavioral-qualifiers.component';
import { PaeCostNeutralityDetailsComponent } from './pae-cost-neutrality-details/pae-cost-neutrality-details.component';
import { PaeCostNeutralityPlanOfCareComponent } from './pae-cost-neutrality-plan-of-care/pae-cost-neutrality-plan-of-care.component';
import { CommonSummaryComponent } from './common-summary/common-summary.component';
import { PaeCostNeutralityComponent } from './pae-cost-neutrality/pae-cost-neutrality.component';
import { PaePrioritizationSummaryComponent } from './pae-prioritization-details/pae-prioritization-summary/pae-prioritization-summary.component';
import { PaeSummaryComponent } from './pae-summary/pae-summary.component';
import { PaeNonFebrileSeizuresComponent } from './pae-non-febrile-seizures/pae-non-febrile-seizures.component';
import { PaeAggressiveBehaviorComponent } from './pae-aggressive-behavior/pae-aggressive-behavior.component';
import {PaeServiceSystemsComponent} from './pae-service-systems/pae-service-systems.component';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { PaeConfirmationComponent } from './pae-confirmation/pae-confirmation.component';
import { PaeBehavioralSupportSummaryComponent } from './pae-behavioral-support-summary/pae-behavioral-support-summary.component';
import { PaeLocDeterminationComponent } from './pae-loc-determination/pae-loc-determination.component';
import { PaeAdjudicationDenialDetailsComponent } from './pae-adjudication-denial-details/pae-adjudication-denial-details.component';
import { NgxMaskModule } from 'ngx-mask';
import { PaeSubmitComponent } from './pae-submit/pae-submit.component';
import { paeDocumentSummaryComponent  } from './pae-document-summary/pae-document-summary.component';
import { PaeCertificationOfAssessmentComponent } from './pae-certification-of-assessment/pae-certification-of-assessment.component';
import { RightnavModule } from '../rightnav/rightnav.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { PaeAcuteOrChronicConditionsComponent } from './pae-acute-or-chronic-conditions/pae-acute-or-chronic-conditions.component';
import { PaeCaregiverDetailsComponent } from './pae-caregiver-details/pae-caregiver-details.component';
import { PaeSisInformantComponent } from './pae-sis-informant/pae-sis-informant.component';
import { MatDialogRef } from '@angular/material/dialog';
import { PaeSkilledServicesAcknowledgementPopupComponent } from './pae-skilled-services/pae-skilled-services-acknowledgement-popup/pae-skilled-services-acknowledgement-popup.component';
import { SafetyAttestationPopOpComponent } from './safety-attestation-pop-op/safety-attestation-pop-op.component';

@NgModule({
  declarations: [PaeComponent,
    PaeApplicantInformationComponent,
    PaeContactInformationComponent,
    PaeLivingArrangementComponent,
    PaeSelectProgramComponent,
    PaeAppointmentComponent,
    PaeIntensiveInterventionsComponent,
    PaeWelcomeComponent,
    SafetyDeterminationAdmissionPopupComponent,
    PaeSafetyDeterminationComponent,
    PaeDiagnosisSummaryComponent,
    PaeCapabilitiesPartOneComponent,
    PaeCapabilitiesPartTwoComponent,
    PaeActivitiesPartOneComponent,
    PaeActivitiesPartTwoComponent,
    PaeNonFebrileSeizuresComponent,
    PaeSummaryComponent,
    PaeCapabilitiesKbPartOneComponent,
    PaeCapabilitiesKbPartTwoComponent,
    PaeFunctionalAssessmentSummaryComponent,
    PaeSafetyDeterminationFallHistoryComponent,
    PaeNutritionFeedingComponent,
    PaeSafetyAssessmentSummaryComponent,
    MedicalDiagnosisEcfApplicationComponent,
    MedicalDiagnosisHcbsApplicationComponent,
    MedicalDiagnosisKbApplicationComponent,
    MedicalDiagonsisComponent,
    MedicalDiagnosisICFComponent,
    PaeRequestDatePopupComponent,
    PaeAggressiveBehaviorComponent,
    PaeServiceSystemsComponent,
    PaeMedicalPrognosisComponent,
    PaeTransportationSpecialtyCareComponent,
    PaeSkilledServicesSummaryComponent,
    PaeSkilledServicesDetailsComponent,
    PaeEnhancedRespiratoryCareComponent,
    PaeMedicalRegimenComponent,
    PaeSkilledServicesDetailsOtherComponent,
    PaeSkilledServicesDetailsKbComponent,
    PaeIddDeterminationSummaryComponent,
    PaeIddDetailsComponent,
    PaeCostNeutralityDetailsComponent,
    PaeCostNeutralityPlanOfCareComponent,
    CommonSummaryComponent,
    PaeCostNeutralityComponent,
    PaeAdditionalBehavioralQualifiersComponent,
    PaePrioritizationSummaryComponent,
    PaeConfirmationComponent,
    PaeBehavioralSupportSummaryComponent,
    PaeLocDeterminationComponent,
    PaeAdjudicationDenialDetailsComponent,
    PaeSubmitComponent,
    paeDocumentSummaryComponent,
    PaeCertificationOfAssessmentComponent,
    PaeAcuteOrChronicConditionsComponent,
    PaeCaregiverDetailsComponent,
    PaeSisInformantComponent,
    PaeSkilledServicesAcknowledgementPopupComponent,
    SafetyAttestationPopOpComponent
  ],
  imports: [
    NgMultiSelectDropDownModule,
    NgSelectModule,
    CommonModule,
    PaeRoutingModule,
    AppMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    RightnavModule,
    SharedModule,
    NgxMaterialTimepickerModule,
    NgxMaskModule.forRoot()
  ],
  providers: [MedicalDiagonsis, PaeService, PaeCertificationOfAssessmentComponent, PaeSkilledServicesAcknowledgementPopupComponent,
    {
      provide: MatDialogRef,
      useValue: {}
    }]
 
})
export class PaeModule { }
