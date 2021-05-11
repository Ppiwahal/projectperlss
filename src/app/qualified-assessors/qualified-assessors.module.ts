import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchAssessorComponent } from './search-assessor/search-assessor.component';
import { SearchAssessorResultComponent } from './search-assessor-result/search-assessor-result.component';
import { QualifiedAssessorsComponent } from './qualified-assessors.component';
import { AppMaterialModule } from '../_shared/app-material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { EditAssessorPopupComponent } from './edit-assessor-popup/edit-assessor-popup.component';
import { EditAssessorComponent } from './edit-assessor-popup/edit-assessor/edit-assessor.component';
import { AssessorHistoryComponent } from './edit-assessor-popup/assessor-history/assessor-history.component';
import { AddAssessorPopupComponent } from './add-assessor-popup/add-assessor-popup.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';



@NgModule({
  declarations: [
    SearchAssessorComponent, 
    SearchAssessorResultComponent, 
    QualifiedAssessorsComponent, 
    EditAssessorPopupComponent, 
    EditAssessorComponent, 
    AssessorHistoryComponent, AddAssessorPopupComponent],
  imports: [
    CommonModule,
    AppMaterialModule,
    ReactiveFormsModule,
    MatAutocompleteModule
  ]
})

export class QualifiedAssessorsModule { }

