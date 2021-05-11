import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppMaterialModule } from '../_shared/app-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MapBusinessFunctionsComponent } from './map-business-functions.component';
import { MapBusinessFunctionsDashboardComponent } from './map-business-functions-dashboard/map-business-functions-dashboard.component';
import { MapBusinessFunctionsListComponent } from './map-business-functions-list/map-business-functions-list.component';

@NgModule({
  declarations: [
    MapBusinessFunctionsComponent,
    MapBusinessFunctionsDashboardComponent,
    MapBusinessFunctionsListComponent
  ],

  imports: [
    CommonModule,
    FormsModule,
    AppMaterialModule,
    ReactiveFormsModule,
    RouterModule,
  ]
})
export class MapBusinessFunctionsModule { }
