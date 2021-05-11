import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppMaterialModule } from '../_shared/app-material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { WaitingListManagementComponent } from './waiting-list-management.component';
import { WaitingListManagementRoutingModule } from './waiting-list-management-routing.module';
import { WaitingListDetailsComponent } from './waiting-list-details/waiting-list-details.component';
import { WaitingListDashboardComponent } from './waiting-list-dashboard/waiting-list-dashboard.component';
import { WaitingListQueuesComponent } from './waiting-list-queues/waiting-list-queues.component';
import { WaitingListSearchTableComponent } from './waiting-list-search-table/waiting-list-search-table.component';
import { WaitingListFilterComponent } from './waiting-list-filter/waiting-list-filter.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';



@NgModule({
  declarations: [
    WaitingListManagementComponent,
    WaitingListDetailsComponent,
    WaitingListDashboardComponent,
    WaitingListQueuesComponent,
    WaitingListSearchTableComponent,
    WaitingListFilterComponent
],
  imports: [
    CommonModule,
    AppMaterialModule,
    ReactiveFormsModule,
    WaitingListManagementRoutingModule,
    MatAutocompleteModule
  ]
})
export class WaitingListManagementModule { }
