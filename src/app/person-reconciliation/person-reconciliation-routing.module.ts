import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PersonReconciliationComponent} from './person-reconciliation.component';
import {LinkUnlinkComponent} from './link-unlink/link-unlink.component';
import {PersonDetailsComponent} from './person-details/person-details.component';
import {PersonReconciliationMainComponent} from './person-reconciliation-main/person-reconciliation.component';


const routes: Routes = [
  {
    path: '',
    component: PersonReconciliationComponent,
    children: [
      {path: '', pathMatch: 'full', redirectTo: 'reconciliationDashboard'},
      {path: 'reconciliationDashboard', component: PersonReconciliationMainComponent },
      {path: 'linkUnlinkRequest', component: LinkUnlinkComponent },
      {path: 'prsnDetails', component: PersonDetailsComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PersonReconciliationRoutingModule{ }
