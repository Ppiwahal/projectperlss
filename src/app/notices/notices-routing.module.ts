import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NoticesComponent } from './notices.component';
import { NoticesListDashboardComponent } from './notices-list-dashboard/notices-list-dashboard.component';
import { NoticesDetailsDashboardComponent } from './notices-details-dashboard/notices-details-dashboard.component';
import { CreateManualNoticeComponent } from './create-manual-notice/create-manual-notice.component';
import { NoticesReturnMailComponent } from './notices-return-mail/notices-return-mail.component'
import {AddReturnMailComponent} from './add-return-mail/add-return-mail.component'

const routes: Routes = [
  {
    path: '',
    component: NoticesComponent,
    children: [
      {path: '', pathMatch: 'full', redirectTo: 'noticesDashboard'},
      {path: 'noticesDashboard', component: NoticesListDashboardComponent },
      {path: 'details/:id', component: NoticesDetailsDashboardComponent },
      {path: 'createmanualnotice', component: CreateManualNoticeComponent },
      //{path: 'returnnoticemail', component: NoticesReturnMailComponent },
      {path: 'returnnoticemail', component: AddReturnMailComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NoticesRoutingModule { }
