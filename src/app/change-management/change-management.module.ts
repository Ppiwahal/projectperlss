import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChangeManagementRoutingModule } from './change-management-routing.module';
import { ChangeManagementCommonComponent } from './../change-management/common/change-management-common.component';

import { CmCostCapExceptionComponent } from './../change-management/cm-cost-cap-exception/cm-cost-cap-exception.component';
import { CmDisenrollmentComponent } from './../change-management/cm-disenrollment/cm-disenrollment.component';
import { CmEntityAssociationComponent } from './../change-management/cm-entity-association/cm-entity-association.component';
import { CmHospiceDateComponent } from './../change-management/cm-hospice-date/cm-hospice-date.component';
import { CmAddServiceDatesComponent } from './../change-management/cm-add-service-dates/cm-add-service-dates.component';
import { CmAddUpdateErcComponent } from './../change-management/cm-add-update-erc/cm-add-update-erc.component';
import { CmAddUpdateMopdComponent } from './../change-management/cm-add-update-mopd/cm-add-update-mopd.component';
import { CmAdjudicationComponent } from './../change-management/cm-adjudication/cm-adjudication.component';
import { CmChangeDdIdComponent } from './../change-management/cm-change-dd-id/cm-change-dd-id.component';
import { CmCompleteReferralComponent } from './../change-management/cm-complete-referral/cm-complete-referral.component';
import { CmFacilityTransferComponent } from './../change-management/cm-facility-transfer/cm-facility-transfer.component';
import { CmLevelOfNeedComponent } from './../change-management/cm-level-of-need/cm-level-of-need.component';
import { CmLocReassignmentComponent } from './../change-management/cm-loc-reassignment/cm-loc-reassignment.component';
import { CmEnrollmentOverrideComponent } from './../change-management/cm-enrollment-override/cm-enrollment-override.component';
import { CmRecertificationComponent } from './../change-management/cm-recertification/cm-recertification.component';
import { CmReinstateMemberComponent } from './../change-management/cm-reinstate-member/cm-reinstate-member.component';
import { CmRevisePaeComponent } from './../change-management/cm-revise-pae/cm-revise-pae.component';
import { CmSisAssessmentComponent } from './../change-management/cm-sis-assessment/cm-sis-assessment.component';
import { CmUpdateAddressOnFileComponent } from './../change-management/cm-update-address-on-file/cm-update-address-on-file.component';
import { CmUpdateDemoInfoComponent } from './../change-management/cm-update-demo-info/cm-update-demo-info.component';
import { CmWithdrawEnrollmentComponent } from './../change-management/cm-withdraw-enrollment/cm-withdraw-enrollment.component';
import { ChangeManagementComponent } from './change-management.component';
import { AppMaterialModule } from '../_shared/app-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    CmCostCapExceptionComponent,
    CmDisenrollmentComponent,
    CmEntityAssociationComponent,
    CmHospiceDateComponent,
    CmAddServiceDatesComponent,
    CmAddUpdateErcComponent,
    CmAddUpdateMopdComponent,
    CmAdjudicationComponent,
    CmChangeDdIdComponent,
    CmCompleteReferralComponent,
    CmFacilityTransferComponent,
    CmLevelOfNeedComponent,
    CmLocReassignmentComponent,
    CmEnrollmentOverrideComponent,
    CmRecertificationComponent,
    CmReinstateMemberComponent,
    CmRevisePaeComponent,
    CmSisAssessmentComponent,
    CmUpdateAddressOnFileComponent,
    CmUpdateDemoInfoComponent,
    CmWithdrawEnrollmentComponent,
    ChangeManagementComponent,
    ChangeManagementCommonComponent
    
  ],
  imports: [
    CommonModule,
    ChangeManagementRoutingModule,
    AppMaterialModule,
    ReactiveFormsModule,
    FormsModule
  ]

})
export class ChangeManagementModule { }
