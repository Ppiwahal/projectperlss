import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CmCostCapExceptionComponent } from './../change-management/cm-cost-cap-exception/cm-cost-cap-exception.component';
import { CmDisenrollmentComponent } from './../change-management/cm-disenrollment/cm-disenrollment.component';
import { CmEntityAssociationComponent } from './../change-management/cm-entity-association/cm-entity-association.component';
import { CmHospiceDateComponent } from './../change-management/cm-hospice-date/cm-hospice-date.component';
import { ChangeManagementComponent } from './../change-management/change-management.component';
import { ChangeManagementDashboardComponent } from './../change-management/dashboard/change-management-dashboard.component';
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
import { AuthGuard } from '../core/helpers/auth.guard';


const routes: Routes = [

  { path: '', component: ChangeManagementComponent, children: [
    {​​path: '', pathMatch: 'full', redirectTo: 'dashboard'}​​,
    { path: 'dashboard', component: ChangeManagementDashboardComponent, canActivate: [AuthGuard] },
    { path: 'costCapException', component: CmCostCapExceptionComponent, canActivate: [AuthGuard] },
    { path: 'disenrollment', component: CmDisenrollmentComponent, canActivate: [AuthGuard] },
    { path: 'entityAssociation', component: CmEntityAssociationComponent, canActivate: [AuthGuard] },
    { path: 'hospiceDate', component: CmHospiceDateComponent, canActivate: [AuthGuard] },
    { path: 'addServiceDates', component: CmAddServiceDatesComponent , canActivate: [AuthGuard] },
    { path: 'addUpdateMopd', component: CmAddUpdateMopdComponent , canActivate: [AuthGuard] },
    { path: 'adjudication', component: CmAdjudicationComponent , canActivate: [AuthGuard] },
    { path: 'changeDdId', component: CmChangeDdIdComponent , canActivate: [AuthGuard] },
    { path: 'completeReferral', component: CmCompleteReferralComponent , canActivate: [AuthGuard] },
    { path: 'facilityTransfer', component: CmFacilityTransferComponent, canActivate: [AuthGuard] },
    { path: 'levelOfNeed', component: CmLevelOfNeedComponent, canActivate: [AuthGuard] },
    { path: 'locReassignment', component: CmLocReassignmentComponent, canActivate: [AuthGuard] },
    { path: 'enrollmentOverride', component: CmEnrollmentOverrideComponent, canActivate: [AuthGuard] },
    { path: 'recertification', component: CmRecertificationComponent , canActivate: [AuthGuard] },
    { path: 'reinstateMember', component: CmReinstateMemberComponent, canActivate: [AuthGuard] },
    { path: 'revisePae', component: CmRevisePaeComponent , canActivate: [AuthGuard] },
    { path: 'sisAssessment', component: CmSisAssessmentComponent , canActivate: [AuthGuard] },
    { path: 'updateAddressOnFile', component: CmUpdateAddressOnFileComponent , canActivate: [AuthGuard] },
    { path: 'updateDemoInfo', component: CmUpdateDemoInfoComponent , canActivate: [AuthGuard] },
    { path: 'updateErc', component: CmAddUpdateErcComponent , canActivate: [AuthGuard] },
    { path: 'withdrawEnrollment', component: CmWithdrawEnrollmentComponent , canActivate: [AuthGuard] }
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChangeManagementRoutingModule { }
