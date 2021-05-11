import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AppMaterialModule} from '../_shared/app-material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { DocumentsRoutingModule } from './documents-routing.module';
import { DocumentsDashboardComponent } from './documents-dashboard/documents-dashboard.component';
import { DocumentsHistoryComponent } from './documents-history/documents-history.component';
import { ReassignDocumentComponent } from './reassign-document/reassign-document.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { UploadDocumentCardComponent } from './documents-history/upload-document-card/upload-document-card.component';

@NgModule({
  declarations: [ DocumentsDashboardComponent, DocumentsHistoryComponent, ReassignDocumentComponent, UploadDocumentCardComponent ],
  imports: [
    NgMultiSelectDropDownModule.forRoot(),
    CommonModule,
    DocumentsRoutingModule,
    AppMaterialModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    FormsModule,
    ReactiveFormsModule
  ],
  schemas:[NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
})

export class DocumentsModule { }
