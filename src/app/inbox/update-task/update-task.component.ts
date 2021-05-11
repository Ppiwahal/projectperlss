import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { InboxService } from '../services/inbox.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as customValidation from '../../_shared/constants/validation.constants';
import { forkJoin } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-update-task',
  templateUrl: './update-task.component.html',
  styleUrls: ['./update-task.component.scss']
})
export class UpdateTaskComponent implements OnInit,OnDestroy {
  customValidation = customValidation;
  taskDetails: any;
  closeTaskForm: FormGroup;
  subscriptions$: any[] = [];
  constructor(
    public dialogRef: MatDialogRef<UpdateTaskComponent>,
    private inboxService: InboxService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.closeTaskForm = this.fb.group({
      notes: ['']
    });
    this.loadTaskDetails();
  }

  loadTaskDetails() {
    let observables = [];
    observables.push(this.inboxService.getTaskDetail(this.data.taskId));
    observables.push(this.inboxService.getTaskPriorityCodes());
    observables.push(this.inboxService.getTaskQueues());
    observables.push(this.inboxService.getTaskStatusCodes());
    observables.push(this.inboxService.getGrandRegion());

    const getTaskDetailsSubscriptions$ = forkJoin(observables).subscribe((res: any) => {

      if (res[1] && res[1].length > 0) {
        let priorityObj = res[1].filter(rec => rec.code === res[0]['prioritySw']);
        if (priorityObj && priorityObj.length > 0) {
          res[0]['prioritySw'] = priorityObj[0].value;
        } else {
          res[0]['prioritySw'] = '';
        }
      }

      if (res[2] && res[2].length > 0) {
        let queueObj = res[2].filter(rec => rec.code === res[0]['queueCd']);
        if (queueObj && queueObj.length > 0) {
          res[0]['queueCd'] = queueObj[0].value;
        } else {
          res[0]['queueCd'] = '';
        }
      }

      if (res[3] && res[3].length > 0) {
        let taskStatusObj = res[3].filter(rec => rec.code === res[0]['taskStatusCd']);
        if (taskStatusObj && taskStatusObj.length > 0) {
          res[0]['taskStatusCd'] = taskStatusObj[0].value;
        } else {
          res[0]['taskStatusCd'] = '';
        }
      }

      if (res[4] && res[4].length > 0) {
        let grandRegionObj = res[4].filter(rec => rec.code === res[0]['grandRegionCd']);
        if (grandRegionObj && grandRegionObj.length > 0) {
          res[0]['grandRegionCd'] = grandRegionObj[0].value;
        } else {
          res[0]['grandRegionCd'] = '';
        }
      }

      res[0]['recordId'] = res[0]['paeId'] || res[0]['referalId'] || res[0]['appealId'];



      this.taskDetails = res[0];
    })

  }

  get f() { return this.closeTaskForm.controls; }

  closeTask() {
    this.addNotesValidation();
    if (this.closeTaskForm.invalid) {
      return;
    }
    const closeTaskSubscriptions$ = this.inboxService.updateTaskClosure(this.data.taskId, this.f.notes.value).subscribe(res => {
      this.toastr.success(res.successMsgDescription);
      this.inboxService.reloadInboxComponent$$.next();
      this.dialogRef.close();
    }, err => {
      this.toastr.error('Service Error!');
    });
    this.subscriptions$.push(closeTaskSubscriptions$);
    this.loadTaskDetails();
  }


  close() {
    this.dialogRef.close();
  }

  addNotesValidation(): void {
    this.closeTaskForm.get('notes').setValidators(Validators.required);
    this.closeTaskForm.get('notes').updateValueAndValidity();
  }

  ngOnDestroy() {
    if (this.subscriptions$ && this.subscriptions$.length > 0) {
      this.subscriptions$.forEach(subscription$ => subscription$.unsubscribe());
    }
  }


}
