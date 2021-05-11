import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppMaterialModule } from '../_shared/app-material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { RightnavComponent } from './rightnav.component';
import { TasksComponent } from './tasks/tasks.component';
import { AddNotesPopupComponent } from './add-notes-popup/add-notes-popup.component';
import { UploadDocumentsPopupComponent } from './upload-documents-popup/upload-documents-popup.component';
import { ViewDocumentsPopupComponent } from './view-documents-popup/view-documents-popup.component';
import { ReassignDocumentPopupComponent } from './view-documents-popup/reassign-document-popup/reassign-document-popup.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ViewNoticesComponent } from './view-notices/view-notices.component';
// import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  declarations: [
    RightnavComponent,
    TasksComponent,
    AddNotesPopupComponent,
    UploadDocumentsPopupComponent,
    ViewDocumentsPopupComponent,
    ReassignDocumentPopupComponent,
    ViewNoticesComponent
  ],
  exports: [
    RightnavComponent
  ],
  imports: [
    NgMultiSelectDropDownModule.forRoot(),
    CommonModule,
    // BrowserModule,
    AppMaterialModule,
    ReactiveFormsModule,
    FormsModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class RightnavModule { }
