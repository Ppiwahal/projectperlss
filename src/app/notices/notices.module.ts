import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppMaterialModule } from '../_shared/app-material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NoticesRoutingModule } from './notices-routing.module';
import { NoticesComponent } from './notices.component';
import { NoticesListDashboardComponent } from './notices-list-dashboard/notices-list-dashboard.component';
import { NoticesDashboardComponent } from './notices-dashboard/notices-dashboard.component';
import { NoticesDetailsDashboardComponent } from './notices-details-dashboard/notices-details-dashboard.component';
import { NoticesSearchTableComponent } from './notices-search-table/notices-search-table.component';
import { NoticesCorrectionDetailsComponent } from './notices-correction-details/notices-correction-details.component';
import { NoticesUpdateStatusComponent } from './notices-update-status/notices-update-status.component';
import { CreateManualNoticeComponent } from './create-manual-notice/create-manual-notice.component';
import { ManualNoticesSelectRecordComponent } from './manual-notices-select-record/manual-notices-select-record.component';
import { NoticeFreeTextComponent } from './notice-free-text/notice-free-text.component';
import { NoticeUploadPdfComponent } from './notice-upload-pdf/notice-upload-pdf.component';
import { NoticesAddrecipientDetailsComponent } from './notices-addrecipient-details/notices-addrecipient-details.component';
import { FormsModule} from '@angular/forms';
import { NoticesReturnMailComponent } from './notices-return-mail/notices-return-mail.component';
import { AddReturnMailComponent } from './add-return-mail/add-return-mail.component';


@NgModule({
  declarations: [
    NoticesComponent,
    NoticesListDashboardComponent,
    NoticesDashboardComponent,
    NoticesDetailsDashboardComponent,
    NoticesSearchTableComponent,
    NoticesCorrectionDetailsComponent,
    NoticesUpdateStatusComponent,
    CreateManualNoticeComponent,
    ManualNoticesSelectRecordComponent,
    NoticeFreeTextComponent,
    NoticeUploadPdfComponent,
    NoticesAddrecipientDetailsComponent,
    NoticesReturnMailComponent,
    AddReturnMailComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AppMaterialModule,
    ReactiveFormsModule,
    NoticesRoutingModule
  ]
})
export class NoticesModule { }
