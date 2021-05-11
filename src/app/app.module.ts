import { InterceptorService } from './loader/interceptor.service';
import { NotificationDetailsComponent } from './core/widgets/notification/notification-details.component';
import { EnvService } from './_shared/utility/env.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { AppMaterialModule } from './_shared/app-material.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './core/header/header.component';
import { LoginComponent } from './login/login.component';
import { ErrorComponent } from './error/error.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { UserDetailsComponent } from './user-details/user-details.component';
import { AuditHistoryComponent } from './audit-history/audit-history.component';
import {MatBadgeModule} from '@angular/material/badge';
import { AuditDetailsComponent } from './audit-details/audit-details.component';
import { ErrorInterceptor } from './core/helpers/error.interceptor';
import { JwtInterceptor } from './core/helpers/jwt.interceptor';
import { TokenStorage } from './_shared/utility/TokenStorage';
import { DiagnosisSummaryComponent } from './diagnosis-summary/diagnosis-summary.component';
import { DocumentsComponent } from './documents/documents.component';
import { NoticesModule } from './notices/notices.module';
import { ChangeManagementDashboardComponent } from './change-management/dashboard/change-management-dashboard.component';
import { TransitionsComponent } from './transitions/transitions.component';
import { AdjudicationComponent } from './adjudication/adjudication.component';
import { EnrollmentDetailsComponent } from './enrollment/enrollment-details/enrollment-details.component';
import { EnrollmentSearchComponent } from './enrollment/enrollment-search/enrollment.search.component';
import { EnrollmentComponent } from './enrollment/enrollment.component';
import { ReportsComponent } from './reports/reports.component';
import { SlotDetailsComponent } from './slot-management/slot-details/slot-details.component';
import { ManageUserProfilesComponent } from './manage-user-profiles/manage-user-profiles.component';
import { MapTaskQueuesComponent } from './map-task-queues/map-task-queues.component';
import { AdjudicationSearchComponent } from './adjudication/adjudication-search/adjudication-search.component';
import { AdjudicationDetailsModule } from './adjudication/adjudication-details/index.module';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { BnNgIdleService } from 'bn-ng-idle';
import { FaqComponent } from './core/widgets/faq/faq.component';
import { SavePopupComponent } from './savePopup/savePopup.component';
import { SessionTimeoutPopupComponent } from './session-timeout-popup/session-timeout-popup.component';
import { DeleteRecordPopupComponent } from './_shared/modal/delete-record-popup/delete-record-popup.component';
import { WidgetsComponent } from './core/widgets/global-link-menu/widgets.component';
import {  NotificationComponent   } from './core/widgets/notification/notification.component';
import { ContactComponent } from './core/widgets/contact/contact.component';
import { FormComponent } from './core/widgets/form/form.component';
import { HcbsBenefitsComponent } from './core/widgets/hcbs-benefits/hcbs-benefits.component';
import { ManageUserRolesModule } from './manage-user-roles/manage-user-roles.module';
import { SharedModule } from './shared/shared.module';
import { InboxModule } from './inbox/inbox.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { EditUserProfileComponent } from './manage-user-profiles/edit-user-profile/edit-user-profile.component';
import { ViewUserProfileComponent } from './manage-user-profiles/view-user-profile/view-user-profile.component';
import { PaeDashboardComponent } from './pae/pae-dashboard/pae-dashboard.component';
import { UserStatusTileComponent } from './manage-user-profiles/user-status-tile/user-status-tile.component';
import { UserSearchComponent } from './manage-user-profiles/user-search/user-search.component';
import { UserEntityStatusTableComponent } from './manage-user-profiles/user-entity-status-table/user-entity-status-table.component';
import { LeftnavModule } from './leftnav/leftnav.module';
import { ReferralListManagementModule } from './referral-list-management/referral-list-management.module';
import { SlotManagementModule } from './slot-management/slot-management.module';
import { QualifiedAssessorsModule } from './qualified-assessors/qualified-assessors.module';
import { WaitingListManagementModule } from './waiting-list-management/waiting-list-management.module';
import { LiabilityPopupComponent } from './enrollment/liability-popup/liability-popup.component';
import { NgxMatDatetimePickerModule, NgxMatTimepickerModule, NgxMatNativeDateModule } from '@angular-material-components/datetime-picker';
import { WorkloadManagementModule } from './workload-management/workload-management.module';
import { NgxMatMomentModule } from '@angular-material-components/moment-adapter';
import { AppealsModule } from './appeals/appeals.module';
import { AddressValidationComponent } from './_shared/components/address-validation/address-validation.component';
import {ExtrefAddressValidationComponent} from './_shared/components/extref-address-validation/extref-address-validation.component';
import { AddressService } from './_shared/services/address.service';
import { AdjudicationDashboardComponent } from './adjudication/adjudication-dashboard/adjudication-dashboard.component';
import { EnrollmentDashboardComponent } from './enrollment/enrollment-dashboard/enrollment-dashboard.component';
import { RightnavToggleService } from './_shared/services/rightnav-toggle.service';
import { PersonReconciliationModule } from './person-reconciliation/person-reconciliation.module';
import { PaeCommonService } from './core/services/pae/pae-common/pae-common.service';
import { MapBusinessFunctionsModule } from './map-business-functions/map-business-functions.module';
import { CookieService } from 'ng2-cookies';
import { PendingChangesGuard } from './core/helpers/pending-change.guard';
import { NgxSpinnerModule } from 'ngx-spinner';
import { PersonSearchComponent } from './core/widgets/person-search/person-search.component';
import { SearchUserPopupComponent } from './search-user-popup/search-user-popup.component';
import { SaveWarningPopupComponent } from './save-warning-popup/save-warning-popup.component';
import { DatePipe } from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import { AdjudicationClarificationPopupComponent } from './adjudication/adjudication-clarification-popup/adjudication-clarification-popup.component';
import { MmisVerifyEligibilityLookupPopupComponent } from './mmis-verify-eligibility-lookup-popup/mmis-verify-eligibility-lookup-popup.component';
import { AdjudicationDenialPopupComponent } from './adjudication/adjudication-denial-popup/adjudication-denial-popup.component';
import { TransitionsDetailsComponent } from './transitions/transitions-details/transitions-details.component';
import { WorkflowAnalyticsPopupComponent } from './core/widgets/workflow-analytics-popup/workflow-analytics-popup.component';
import { UrlSerializer } from '@angular/router';
import { CustomUrlSerializer } from './custom-url-serializer';

export const EnvServiceFactory = (envService: EnvService) => {
  return () => {
    return envService.loadConstants();
  };
};

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    ErrorComponent,
    UserDetailsComponent,
    AuditHistoryComponent,
    AuditDetailsComponent,
    DiagnosisSummaryComponent,
    DocumentsComponent,
    ChangeManagementDashboardComponent,
    TransitionsComponent,
    AdjudicationComponent,
    EnrollmentComponent,
    EnrollmentSearchComponent,
    EnrollmentDetailsComponent,
    ReportsComponent,
    SlotDetailsComponent,
    ManageUserProfilesComponent,
    MapTaskQueuesComponent,
    AdjudicationSearchComponent,
    FaqComponent,
    SavePopupComponent,
    SessionTimeoutPopupComponent,
    DeleteRecordPopupComponent,
    WidgetsComponent,
    ContactComponent,
    FormComponent,
    HcbsBenefitsComponent,
    ViewUserProfileComponent,
    EditUserProfileComponent,
    PaeDashboardComponent,
    UserStatusTileComponent,
    UserSearchComponent,
    UserEntityStatusTableComponent,
    LiabilityPopupComponent,
    AddressValidationComponent,
    ExtrefAddressValidationComponent,
    AdjudicationDashboardComponent,
    EnrollmentDashboardComponent,
    SaveWarningPopupComponent,
    PersonSearchComponent,
    SearchUserPopupComponent,
    NotificationComponent,
    NotificationDetailsComponent,
    MmisVerifyEligibilityLookupPopupComponent,
    AdjudicationClarificationPopupComponent,
    AdjudicationDenialPopupComponent,
    TransitionsDetailsComponent,
    WorkflowAnalyticsPopupComponent
  ],
  exports: [],
  imports: [
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    AppMaterialModule,
    HttpClientModule,
    NgSelectModule,
    InboxModule,
    AdjudicationDetailsModule,
    ManageUserRolesModule,
    LeftnavModule,
    NgIdleKeepaliveModule.forRoot(),
    SharedModule,
    ToastrModule.forRoot(),
    ReferralListManagementModule,
    SlotManagementModule,
    QualifiedAssessorsModule,
    WaitingListManagementModule,
    WorkloadManagementModule,
    PersonReconciliationModule,
    MapBusinessFunctionsModule,
    NgxMatTimepickerModule,
    NgxMatDatetimePickerModule,
    MatIconModule,
    NgxMatMomentModule,
    MatMenuModule,
    NoticesModule,
    AppealsModule,
    NgxSpinnerModule,
    MatBadgeModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true },
    TokenStorage, BnNgIdleService, PendingChangesGuard, AddressService, RightnavToggleService, PaeCommonService, CookieService,DatePipe,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: UrlSerializer, useClass: CustomUrlSerializer },
    {
      provide: APP_INITIALIZER,
      useFactory: EnvServiceFactory,
      deps: [EnvService],
      multi: true
    }],
  entryComponents: [SessionTimeoutPopupComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
