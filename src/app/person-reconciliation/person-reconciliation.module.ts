import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppMaterialModule } from '../_shared/app-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PersonReconciliationDashboardComponent } from './person-reconciliation-dashboard/person-reconciliation-dashboard.component';
import { MDMLookupPopupComponent } from './mdm-lookup-popup/mdm-lookup-popup.component';
import { PersonReconciliationComponent } from './person-reconciliation.component';
import { SelectIndividualsComponent } from './select-individuals/select-individuals.component';
import { ConformLinkComponent } from './conform-link/conform-link.component';
import {LinkUnlinkComponent} from './link-unlink/link-unlink.component';
import {PersonReconciliationMainComponent} from './person-reconciliation-main/person-reconciliation.component';
import { PersonReconciliationQueuesComponent } from './person-reconciliation-queues/person-reconciliation-queues.component';
import { QueueSearchResultsComponent } from './person-reconciliation-queues/queue-search-results/queue-search-results.component';
import { PersonDetailsComponent } from './person-details/person-details.component';
import { NgxMaskModule } from 'ngx-mask';
import { PhysicalAddressModule } from '../_shared/components/physical-address/physical-address.module';
import { SearchResultsComponent } from './person-details/search-results/search-results.component';
import {PersonReconciliationRoutingModule} from './person-reconciliation-routing.module';

@NgModule({
  declarations: [
    PersonReconciliationComponent,
    PersonReconciliationDashboardComponent,
    MDMLookupPopupComponent,
    SelectIndividualsComponent,
    ConformLinkComponent,
    LinkUnlinkComponent,
    PersonReconciliationQueuesComponent,
    PersonReconciliationMainComponent,
    QueueSearchResultsComponent,
    PersonDetailsComponent,
    SearchResultsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AppMaterialModule,
    ReactiveFormsModule,
    RouterModule,
    NgxMaskModule.forRoot(),
    PhysicalAddressModule,
    PersonReconciliationRoutingModule
  ],
  schemas:[NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
})
export class PersonReconciliationModule { }
