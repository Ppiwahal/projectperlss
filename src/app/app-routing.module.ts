import { QualifiedAssessorsComponent } from './qualified-assessors/qualified-assessors.component';
import { PersonReconciliationComponent } from './person-reconciliation/person-reconciliation.component';
import { WorkloadManagementComponent } from './workload-management/workload-management.component';
import { MapTaskQueuesComponent } from './map-task-queues/map-task-queues.component';
import { MapBusinessFunctionsComponent } from './map-business-functions/map-business-functions.component';
import { ManageUserRolesComponent } from './manage-user-roles/manage-user-roles.component';
import { ManageUserProfilesComponent } from './manage-user-profiles/manage-user-profiles.component';
import { SlotManagementComponent } from './slot-management/slot-management.component';
import { SlotDetailsComponent } from './slot-management/slot-details/slot-details.component';
import { ReportsComponent } from './reports/reports.component';
import { AppealsComponent } from './appeals/appeals.component';
import { WaitingListManagementComponent } from './waiting-list-management/waiting-list-management.component';
import { ReferralListManagementComponent } from './referral-list-management/referral-list-management.component';
import { TransitionsComponent } from './transitions/transitions.component';
import { NoticesComponent } from './notices/notices.component';
import { DocumentsComponent } from './documents/documents.component';
import { InboxComponent } from './inbox/inbox.component';
import { LeftnavComponent } from './leftnav/leftnav.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ErrorComponent } from './error/error.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { AuditHistoryComponent } from './audit-history/audit-history.component';
import { AuditDetailsComponent } from './audit-details/audit-details.component';
import { AuthGuard } from './core/helpers/auth.guard';
import { AdjudicationSearchComponent } from './adjudication/adjudication-search/adjudication-search.component';
import { AdjudicationDetailsComponent } from './adjudication/adjudication-details/adjudication-details.component';
import { EnrollmentSearchComponent } from './enrollment/enrollment-search/enrollment.search.component';
import { EnrollmentDetailsComponent } from './enrollment/enrollment-details/enrollment-details.component';
import { MaintenanceScreenComponent } from './maintenance-screen/maintenance-screen.component';
import { PaeDashboardComponent } from './pae/pae-dashboard/pae-dashboard.component';
import { SlotManageEnrollmentTargetsComponent } from './slot-management/slot-manage-enrollment-targets/slot-manage-enrollment-targets.component';
import { AdjudicationDashboardComponent } from './adjudication/adjudication-dashboard/adjudication-dashboard.component'
import { EnrollmentDashboardComponent } from './enrollment/enrollment-dashboard/enrollment-dashboard.component'
import { paeDocumentSummaryComponent } from './pae/pae-document-summary/pae-document-summary.component';
import { ExtrefConfirmationComponent } from './external-referral/extref-confirmation/extref-confirmation.component';
import { TransitionsDetailsComponent } from './transitions/transitions-details/transitions-details.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'error', component: ErrorComponent },
  { path: 'maintanence', component: MaintenanceScreenComponent },
  {
    path: 'externalreferral',
    children:[
      { path: '',loadChildren: () => import('./external-referral/external-referral.module').then(m => m.ExternalReferralModule)
    },
      { path: 'extreferralConfirmation', component: ExtrefConfirmationComponent },
    ],
  },
  {
    path: 'ltss', component: LeftnavComponent, canActivate: [AuthGuard], children: [
      { path: 'home', component: UserDetailsComponent, canActivate: [AuthGuard] },
      { path: 'inbox', component: InboxComponent, canActivate: [AuthGuard] },
      {
        path: 'referral',
        loadChildren: () => import('./referral/referral.module').then(m => m.ReferralModule), canActivate: [AuthGuard]
      },
      {
        path: 'changeManagement',
        loadChildren: () => import('./change-management/change-management.module').then(m => m.ChangeManagementModule), canActivate: [AuthGuard]
      },
      {
        path: 'appointments',
        loadChildren: () => import('./appointments/appointments.module').then(m => m.AppointmentsModule), canActivate: [AuthGuard]
      },
      {
        path: 'documents',
        loadChildren: () => import('./documents/documents.module').then(m => m.DocumentsModule), canActivate: [AuthGuard]
      },
      { path: 'documents', component: DocumentsComponent, canActivate: [AuthGuard] },
      {
        path: 'notices',
        loadChildren: () => import('./notices/notices.module').then(m => m.NoticesModule), canActivate: [AuthGuard]
      },
      { path: 'transitions', component: TransitionsComponent, canActivate: [AuthGuard] },
      { path: 'transitionsDetails', component: TransitionsDetailsComponent, canActivate: [AuthGuard]},
      {
        path: 'referralListManagement',
        loadChildren: () => import('./referral-list-management/referral-list-management.module')
          .then(m => m.ReferralListManagementModule), canActivate: [AuthGuard]
      },
      {
        path: 'waitingListManagement',
        loadChildren: () => import('./waiting-list-management/waiting-list-management.module')
          .then(m => m.WaitingListManagementModule), canActivate: [AuthGuard]
      },
      { path: 'auditHistory', component: AuditHistoryComponent, canActivate: [AuthGuard] },
      { path: 'auditDetails', component: AuditDetailsComponent, canActivate: [AuthGuard] },
      { path: 'adjudicationSearch', component: AdjudicationSearchComponent, canActivate: [AuthGuard] },
      { path: 'adjudicationDetail', component: AdjudicationDetailsComponent, canActivate: [AuthGuard] },
      { path: 'adjudicationDashboard', component: AdjudicationDashboardComponent, canActivate: [AuthGuard] },
      { path: 'enrollmentDashboard', component: EnrollmentDashboardComponent, canActivate: [AuthGuard] },
      { path: 'enrollmentSearch', component: EnrollmentSearchComponent, canActivate: [AuthGuard] },
      { path: 'enrollmentDetail', component: EnrollmentDetailsComponent, canActivate: [AuthGuard] },
      { path: 'appeals', loadChildren: () => import('./appeals/appeals.module').then(m => m.AppealsModule), canActivate: [AuthGuard] },
      { path: 'reports', component: ReportsComponent, canActivate: [AuthGuard] },
      { path: 'slotManagement', component: SlotManagementComponent, canActivate: [AuthGuard] },
      { path: 'slotDetail', component: SlotDetailsComponent, canActivate: [AuthGuard] },
      { path: 'slotDetail/:refId/:prsnId/:sltDetailsId/:taskId', component: SlotDetailsComponent, canActivate: [AuthGuard] },
      { path: 'slotDetail/:refId/:prsnId/:sltDetailsId', component: SlotDetailsComponent, canActivate: [AuthGuard] },
      { path: 'slotDetail/:refId', component: SlotDetailsComponent, canActivate: [AuthGuard] },
      { path: 'slotEnrollmentTargets/:id', component: SlotManageEnrollmentTargetsComponent },
      { path: 'manageUserProfiles', component: ManageUserProfilesComponent, canActivate: [AuthGuard] },
      { path: 'manageUserRoles', component: ManageUserRolesComponent, canActivate: [AuthGuard] },
      { path: 'mapBusinessFunctions', component: MapBusinessFunctionsComponent, canActivate: [AuthGuard] },
      { path: 'mapTaskQueues', component: MapTaskQueuesComponent, canActivate: [AuthGuard] },
      { path: 'workLoadManagement', component: WorkloadManagementComponent, canActivate: [AuthGuard] },
      { path: 'qualifiedAssessors', component: QualifiedAssessorsComponent, canActivate: [AuthGuard] },
      {
        path: 'personReconciliation',
        loadChildren: () => import('./person-reconciliation/person-reconciliation.module').then(m => m.PersonReconciliationModule), canActivate: [AuthGuard]
      },
      { path: 'pae', component: PaeDashboardComponent, canActivate: [AuthGuard] },
    ]
  },
  {
    path: 'ltss/pae/paeStart',
    loadChildren: () => import('./pae/pae.module').then(m => m.PaeModule), canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { anchorScrolling: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
