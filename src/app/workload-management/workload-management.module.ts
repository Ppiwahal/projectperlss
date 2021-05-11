import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { WorkloadManagementComponent } from './workload-management.component';
import { AssignPopupComponent } from './assign-popup/assign-popup.component';
import { OverallTaskPerformanceComponent } from './overall-task-performance/overall-task-performance.component';
import { PendingTaskComponent } from './pending-task/pending-task.component';
import { TaskResultTableComponent } from './task-result-table/task-result-table.component';
import { TaskSearchComponent } from './task-search/task-search.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AppMaterialModule } from '../_shared/app-material.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormsModule } from '@angular/forms';
import { UpdateTaskPopupComponent } from './update-task-popup/update-task-popup.component';
import { ViewTaskPopupComponent } from './view-task-popup/view-task-popup.component';
import { AssignUserComponent } from './assign-user/assign-user.component';
import { AssignTaskComponent } from './update-task-popup/assign-task/assign-task.component';
import { TaskClosureComponent } from './update-task-popup/task-closure/task-closure.component';
import { TaskDetailsComponent } from './update-task-popup/task-details/task-details.component';



@NgModule({
  declarations: [
    WorkloadManagementComponent,
    AssignPopupComponent,
    AssignUserComponent,
    OverallTaskPerformanceComponent,
    PendingTaskComponent,
    TaskResultTableComponent,
    TaskSearchComponent,
    UpdateTaskPopupComponent,
    ViewTaskPopupComponent,
    AssignTaskComponent,
    TaskClosureComponent,
    TaskDetailsComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppMaterialModule,
    ReactiveFormsModule,
    FormsModule,
    MatAutocompleteModule
  ]
})
export class WorkloadManagementModule { }
