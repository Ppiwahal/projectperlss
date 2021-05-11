import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InboxRoutingModule } from './inbox-routing.module';
import { RouterModule } from '@angular/router';
import { InboxComponent} from './inbox.component';
import { AppMaterialModule} from '../_shared/app-material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MytasksComponent } from './mytasks/mytasks.component';
import { CreateManualTaskComponent } from './create-manual-task/create-manual-task.component';
import { MyAlertsNotificationsComponent } from './my-alerts-notifications/my-alerts-notifications.component';
import { TaskDetailsComponent } from './task-details/task-details.component';
import { UpdateTaskComponent } from './update-task/update-task.component';
import { AssignUserComponent } from './assign-user/assign-user.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@NgModule({
  declarations: [
    InboxComponent,
    AssignUserComponent,
    MytasksComponent,
    CreateManualTaskComponent,
    MyAlertsNotificationsComponent,
    TaskDetailsComponent,
    UpdateTaskComponent],
  imports: [
    CommonModule,
    RouterModule,
    AppMaterialModule,
    ReactiveFormsModule,
    MatAutocompleteModule
  ]
})
export class InboxModule { }
