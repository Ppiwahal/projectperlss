import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DocumentsDashboardComponent } from './documents-dashboard/documents-dashboard.component';
import { DocumentsHistoryComponent } from './documents-history/documents-history.component';
import { DocumentsComponent } from './documents.component';
import { ReassignDocumentComponent } from './reassign-document/reassign-document.component';


const routes: Routes = [  {
  path: '',
  component: DocumentsComponent,
  children: [
    {path: '', pathMatch: 'full', redirectTo: 'documentsDashboard'},
    {path: 'documentsDashboard', component: DocumentsDashboardComponent},
    {path: 'history', component: DocumentsHistoryComponent},
    {path: 'reassign-document', component: ReassignDocumentComponent}
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocumentsRoutingModule { }
