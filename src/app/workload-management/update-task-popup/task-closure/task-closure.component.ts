import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { WorkloadManagementService } from '../../services/workload-management.service';
import * as customValidation from '../../../_shared/constants/validation.constants';

@Component({
  selector: 'app-task-closure',
  templateUrl: './task-closure.component.html',
  styleUrls: ['./task-closure.component.scss']
})
export class TaskClosureComponent implements OnInit,OnDestroy {
  taskDesc;
  @Input() taskDetails: any;
  subscriptions$: any[] = [];
  closureTaskDetails: FormGroup;
  customValidation = customValidation;

  constructor(private workLoadService:WorkloadManagementService,
              private toastr: ToastrService,
              private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.closureTaskDetails = this.formBuilder.group({
      closureDetails: ['', Validators.required]
    })
  }

 f() {
  return this.closureTaskDetails.controls;
}

  onCloseTask() {
    if(this.closureTaskDetails.valid) {
    this.taskDesc = this.f().closureDetails.value;
    const getTaskDetails$ = this.workLoadService.closeTask(this.taskDetails.taskId,this.taskDesc).subscribe(res => {
        if (res.errorCode) {
          this.toastr.warning(res.errorCode[0].description);
        } else {
          this.toastr.success(res.successMsgDescription);
          this.workLoadService.refreshWorkloadComponent$$.next(true);
        }
      });
      this.subscriptions$.push(getTaskDetails$);
    }
  }

  ngOnDestroy() {
    if (this.subscriptions$ && this.subscriptions$.length > 0) {
      this.subscriptions$.forEach(subscription$ => subscription$.unsubscribe());
    }
  }
}
