import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReferralListManagementComponent } from './referral-list-management.component';
import { ReferralDashboardTileComponent } from './referral-dashboard-tile/referral-dashboard-tile.component';
import { ReferralDashboardQueueComponent } from './referral-dashboard-queue/referral-dashboard-queue.component';
import { ReferralDashboardFilterComponent } from './referral-dashboard-filter/referral-dashboard-filter.component';
import { ReferralDashboardTableComponent } from './referral-dashboard-table/referral-dashboard-table.component';
import { ReferralDashboardComponent } from './referral-dashboard/referral-dashboard.component'
import { AppMaterialModule } from '../_shared/app-material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ReferralListDetailsComponent } from './referral-list-details/referral-list-details.component';
import { UpdateRefrralListComponent } from './update-refrral-list/update-refrral-list.component';
import { UpdateOutreachDetailsComponent } from './update-outreach-details/update-outreach-details.component';
import { ReferralListRoutingModule } from './referral-list-routing.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';




@NgModule({
  declarations: [
    ReferralListManagementComponent,
    ReferralDashboardTileComponent,
    ReferralDashboardQueueComponent,
    ReferralDashboardFilterComponent,
    ReferralDashboardTableComponent,
    ReferralListDetailsComponent,
    ReferralDashboardComponent,
    UpdateRefrralListComponent,
    UpdateOutreachDetailsComponent
],
  imports: [
    CommonModule,
    AppMaterialModule,
    ReactiveFormsModule,
    ReferralListRoutingModule,
    MatAutocompleteModule
  ]
})
export class ReferralListManagementModule { }
