import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../core/helpers/auth.guard';
import { RefConfirmationComponent } from './ref-confirmation/ref-confirmation.component';
import { ReferralDashboardComponent } from './referral-dashboard/referral-dashboard.component';
import { ReferralIntakeActionsComponent } from './referral-dashboard/referral-intake-actions/referral-intake-actions.component';
import { ReferralIntakeOutcomeComponent } from './referral-dashboard/referral-intake-outcome/referral-intake-outcome.component';
import { ReferralComponent } from './referral.component';
import { ReferralStepperComponent } from './referral-stepper-start/referral-stepper.component';
import { PendingChangesGuard } from '../core/helpers/pending-change.guard';

const routes: Routes = [{ path: '', component: ReferralComponent, children: [
  {path: '', pathMatch: 'full', redirectTo: 'referralDashboard'},
  {path: 'startReferral', component: ReferralStepperComponent, canActivate: [AuthGuard], canDeactivate : [PendingChangesGuard]},
  {path: 'referralDashboard', component: ReferralDashboardComponent, canActivate: [AuthGuard]},
  {path: 'referralIntakeActions', component: ReferralIntakeActionsComponent, canActivate: [AuthGuard]},
  {path: 'referralIntakeOutcome', component: ReferralIntakeOutcomeComponent, canActivate: [AuthGuard]},
  {path:'referralConfirmation', component:RefConfirmationComponent, canActivate:[AuthGuard]},
]}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReferralRoutingModule { }
