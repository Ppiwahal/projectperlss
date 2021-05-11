import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppMaterialModule} from '../../_shared/app-material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FunctionalAssessmentComponent } from './functional-assessment/functional-assessment.component';
import { PasrrOutcomeComponent } from './pasrr-outcome/pasrr-outcome.component';
import { SupportingDocumentsComponent } from './supporting-documents/supporting-documents.component';
import { AdjudicationDetailsComponent } from './adjudication-details.component';
import {AdjudicationDetailsRoutingModule} from './adjudication-routing.module';
import { SkilledServiceComponent } from './skilled-service/skilled-service.component';
import { FunctionalAssessmentCapabilitiesComponent } from './functional-assessment-capabilities/functional-assessment-capabilities.component';
import { SafetyDeterminationComponent } from './safety-determination/safety-determination.component';
import { AdjudicationDeterminationComponent } from './adjudication-determination/adjudication-determination.component';

@NgModule({
  declarations: [
    FunctionalAssessmentComponent,
    PasrrOutcomeComponent,
    SupportingDocumentsComponent,
    AdjudicationDetailsComponent,
    SkilledServiceComponent,
    FunctionalAssessmentCapabilitiesComponent,
    SafetyDeterminationComponent,
    AdjudicationDeterminationComponent
    ],
  imports: [
    CommonModule,
    RouterModule,
    AppMaterialModule,
    ReactiveFormsModule
  ]
})
export class AdjudicationDetailsModule { }
