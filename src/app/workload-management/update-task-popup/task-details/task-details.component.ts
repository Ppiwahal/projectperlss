import {Input, OnChanges, OnDestroy, SimpleChanges} from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { WorkloadManagementService } from '../../services/workload-management.service';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.scss']
})
export class TaskDetailsComponent implements OnInit, OnChanges, OnDestroy {
  subscriptions$: any[] = [];
  @Input() taskDetails: any;


  priorityData: any[] =[];
  GrandRegionData: any[] = [];
  expediteReferralData: any = [];
  taskUpdate: FormGroup;
  constructor(private workLoadService:WorkloadManagementService,
              private formBuilder: FormBuilder,
              private toastr: ToastrService) { }

  ngOnInit(): void {
    this.taskUpdate = this.formBuilder.group({
      taskPriority: [''],
      grandRegion: [''],
      expediete: [''],
    });
    this.priorityData=this.workLoadService.priority;
    this.GrandRegionData=this.workLoadService.grandRegion;
    this.expediteReferralData=this.workLoadService.yesNo;
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes['taskDetails'] && (changes['taskDetails'].currentValue !== changes['taskDetails'].previousValue)) {
      if(this.taskUpdate) {
        this.taskUpdate.patchValue({taskPriority: this.taskDetails.prioritySw});
        this.taskUpdate.patchValue({grandRegion: this.taskDetails.grandRegionCd});
      }

    }
  }

  onUpdate() {
      let payload =
      {
        "taskId": this.taskDetails.taskId,
        "priority": this.taskUpdate.controls.taskPriority.value ? this.taskUpdate.controls.taskPriority.value : null,
        "grandRegion": this.taskUpdate.controls.grandRegion.value ? this.taskUpdate.controls.grandRegion.value : null,
        "expediteReferral": this.taskUpdate.controls.expediete.value ? this.taskUpdate.controls.expediete.value : null,
      }
      const getTaskDetails$ = this.workLoadService.updateAdminTask(payload).subscribe(res => {
        if(res && res.errorCode){
          this.toastr.error( res.errorCode[0].description);
        } else {
          this.toastr.success(res.successMsgDescription);
          this.workLoadService.refreshWorkloadComponent$$.next(true);
        }
      }, (error) => {
        this.toastr.error("Internal Server Error");
      });
      this.subscriptions$.push(getTaskDetails$);
  }

  ngOnDestroy() {
    if (this.subscriptions$ && this.subscriptions$.length > 0) {
      this.subscriptions$.forEach(subscription$ => subscription$.unsubscribe());
    }
  }

}
