import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppMaterialModule } from '../_shared/app-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SlotDashboardEcfChoicesComponent } from './slot-dashboard-ecf-choices/slot-dashboard-ecf-choices.component';
import { SlotDashboardKatieBeckettComponent } from './slot-dashboard-katie-beckett/slot-dashboard-katie-beckett.component';
import { SlotDashboardQueuesComponent } from './slot-dashboard-queues/slot-dashboard-queues.component';
import { SlotDashboardReferralWaitingListComponent } from './slot-dashboard-referral-waiting-list/slot-dashboard-referral-waiting-list.component';
import { SlotDashboardSearchComponent } from './slot-dashboard-search/slot-dashboard-search.component';
import { SlotDashboardSummaryComponent } from './slot-dashboard-summary/slot-dashboard-summary.component';
import { SlotManagementComponent } from './slot-management.component';
import { SlotManageEnrollmentTargetsComponent } from './slot-manage-enrollment-targets/slot-manage-enrollment-targets.component';
import { SlotMgmtEnrollmentTargetsConfirmPopupComponent } from './slot-mgmt-enrollment-targets-confirm-popup/slot-mgmt-enrollment-targets-confirm-popup.component'
import { RouterModule } from '@angular/router';
import { EcfChoicesReferralListPopupComponent } from './ecf-choices-referral-list-popup/ecf-choices-referral-list-popup.component'
import { SlotUpdatePopupComponent } from './slot-update-popup/slot-update-popup.component'
import { KatieBeckettPartAPopupComponent } from './katie-beckett-part-a-popup/katie-beckett-part-a-popup.component'
import { KatieBeckettPartBPopupComponent } from './katie-beckett-part-b-popup/katie-beckett-part-b-popup.component'
// import { BrowserModule } from '@angular/platform-browser';
import { Choices2PopupComponent } from './choices2-popup/choices2-popup.component'
@NgModule({
  declarations: [
    SlotDashboardEcfChoicesComponent,
    SlotDashboardKatieBeckettComponent,
    SlotDashboardQueuesComponent,
    SlotDashboardReferralWaitingListComponent,
    SlotDashboardSearchComponent,
    SlotDashboardSummaryComponent,
    SlotManagementComponent,
    SlotManageEnrollmentTargetsComponent,
    SlotMgmtEnrollmentTargetsConfirmPopupComponent,
    EcfChoicesReferralListPopupComponent,
    SlotUpdatePopupComponent,
    KatieBeckettPartAPopupComponent,
    KatieBeckettPartBPopupComponent,
    Choices2PopupComponent

  ],
  imports: [
    CommonModule,
    // BrowserModule,
    AppMaterialModule,
    ReactiveFormsModule,
    RouterModule,
    FormsModule
  ]
})
export class SlotManagementModule { }
