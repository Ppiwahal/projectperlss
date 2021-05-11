import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../core/helpers/auth.guard';
import { AppealsComponent } from './appeals.component';
import { AppealsDashboardComponent } from './appeals-dashboard/appeals-dashboard.component';
import { AppealsStepperComponent } from './appeals-stepper/appeals-stepper.component'

const routes: Routes = [
    { path: '', component: AppealsComponent, 
    children: [
    {path: '', pathMatch: 'full', redirectTo: 'appealsDashboard'},
    {path: 'appealsStepper', component: AppealsStepperComponent},
    {path: 'appealsDashboard', component: AppealsDashboardComponent}
  ]}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppealsRoutingModule { }