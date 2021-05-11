import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ExternalReferralComponent} from './external-referral.component';


const routes: Routes = [
  {
    path: '', component: ExternalReferralComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExternalReferralRoutingModule { }
