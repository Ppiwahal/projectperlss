import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdjudicationDetailsComponent } from './adjudication-details.component';


const routes: Routes = [
  {
    path: '',
    component: AdjudicationDetailsComponent,
    children: [
      {path: '', pathMatch: 'full', redirectTo: 'inbox'},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdjudicationDetailsRoutingModule { }
