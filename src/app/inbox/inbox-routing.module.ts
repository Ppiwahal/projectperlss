import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InboxComponent } from './inbox.component';


const routes: Routes = [
  {
    path: '',
    component: InboxComponent,
    children: [
      {path: '', pathMatch: 'full', redirectTo: 'inbox'},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InboxRoutingModule { }
