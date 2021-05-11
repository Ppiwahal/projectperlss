import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { SlotManagmentService } from '../services/slot-managment.service';
export interface QueueNameCount {
  queueName: string;
  count: number;
}


@Component({
  selector: 'app-slot-dashboard-queues',
  templateUrl: './slot-dashboard-queues.component.html',
  styleUrls: ['./slot-dashboard-queues.component.scss']
})
export class SlotDashboardQueuesComponent implements OnInit, OnDestroy {
  taskTableShowResult: boolean = false;
  displayedColumnsForQueueCountTble: string[] = ['queueName', 'count'];
  dataSource = [];
  subscriptions$: any[] = [];
  localStorageLocal = localStorage.getItem('APP_STORAGE_TOKEN');
  userId = JSON.parse(this.localStorageLocal).userName;
  entityId = JSON.parse(this.localStorageLocal).entityId;
  @Output() emitSearchRequest = new EventEmitter();
  constructor(private slotManagmentService: SlotManagmentService) { }

  ngOnInit(): void {
    this.getSlotQueues();
  }

  getSlotQueues() {
    this.taskTableShowResult = false;
    this.dataSource = [];
    const slotQueues$ = this.slotManagmentService.getslotQueueList(this.userId, this.entityId).subscribe(res => {
      this.taskTableShowResult = true;
      const keys = Object.keys(res[0]);
      keys.forEach((key) => {
        let row = {};
        const queueInfo = res[1].filter(slotQueue => (slotQueue.code === key));
        row["listDetails"] = res[0][key].adminPrsnReconList;
        if (queueInfo && queueInfo.length > 0) {
          row["queueName"] = queueInfo[0].value;
        }
        row["count"] = res[0][key].taskCount;
        this.dataSource = [...this.dataSource, ...[row]];
      });
      console.log("dataSource ", this.dataSource);
    });
    this.subscriptions$.push(slotQueues$);
  }
  displaySearchResults(data) {
    this.emitSearchRequest.emit(data);
  }
  ngOnDestroy() {
    if (this.subscriptions$ && this.subscriptions$.length > 0) {
      this.subscriptions$.forEach(subscription$ => subscription$.unsubscribe());
    }
  }
}

