import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { WorkloadManagementService } from '../services/workload-management.service';
import { MatTableDataSource } from '@angular/material/table';
import { StaticDataMapService } from '../../core/helpers/static.data.map.service';


@Component({
  selector: 'app-update-task-popup',
  templateUrl: './update-task-popup.component.html',
  styleUrls: ['./update-task-popup.component.scss']
})
export class UpdateTaskPopupComponent implements OnInit, OnDestroy {
taskDetails;
  entityName;
subscriptions$: any[] = [];

  constructor(public dialogRef: MatDialogRef<UpdateTaskPopupComponent>,
    private workLoadService: WorkloadManagementService,
    private staticDataService: StaticDataMapService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.workLoadService.refreshWorkloadComponent$$.subscribe(res => {
      if(res) {
        this.ngOnInit();
      }
    });
  }

  displayedColumns: string[] = ['taskQueue', 'taskPriority', 'taskStatus', 'updateDate','updateUser', 'assignedUser'];
  dataSource: MatTableDataSource<any>;


  ngOnInit(): void {
    console.log(this.data);
    const appStorageToken = localStorage.getItem('APP_STORAGE_TOKEN');
    this.entityName = appStorageToken ? JSON.parse(appStorageToken).entityName : null;
    const getTaskDetails$ = this.workLoadService.getTaskDetail(this.data.data.taskId).subscribe(res => {
      this.taskDetails = res;
      this.taskDetails['refId'] = res.referalId || res.appealId || res.paeId;

    });
    this.subscriptions$.push(getTaskDetails$);
    const searchResults$ = this.taskHistory();

  }
  private taskHistory() {
    const taskList$ = this.workLoadService.taskHistory(this.data.data.taskId).subscribe(res => {
      if (res) {
        this.dataSource = new MatTableDataSource(res);
      }
    });
    this.subscriptions$.push(taskList$);

  }

  closeDialog() {
    this.dialogRef.close();
    this.workLoadService.reloadWorkfloadComponent$$.next(true);
  }
  getNameByCode(code: string, entity: string) {
    if (entity === 'TS' && code) {
      const result = this.workLoadService.taskStatus.filter(item => item.code === code);
      return result.length > 0 ? result[0].value : code;
    }
    if (entity === 'TP' && code) {
      const result = this.workLoadService.priority.filter(item => item.code === code);
      return result.length > 0 ? result[0].value : code;
    }
    if (entity === 'GR' && code) {
      const result = this.workLoadService.grandRegion.filter(item => item.code === code);
      return result.length > 0 ? result[0].value : code;
    }
  }

  getQueueNameByCode(queueCode) {
    queueCode = queueCode ? queueCode.toString() : queueCode;
    const taskNameQueues = this.staticDataService.getStaticDataKeyValue('TASK_QUEUE');
    const filteredTaskQueue = taskNameQueues.find(item => item.code === queueCode);
    const value =  filteredTaskQueue ? filteredTaskQueue.value : ' ';
    return value;
  }

  ngOnDestroy() {
    if (this.subscriptions$ && this.subscriptions$.length > 0) {
      this.subscriptions$.forEach(subscription$ => subscription$.unsubscribe());
    }
  }

}
