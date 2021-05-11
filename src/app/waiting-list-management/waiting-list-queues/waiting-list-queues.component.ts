import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {WaitingListService} from "../services/waiting-list.service";
import {forkJoin} from "rxjs";

@Component({
  selector: 'app-waiting-list-queues',
  templateUrl: './waiting-list-queues.component.html',
  styleUrls: ['./waiting-list-queues.component.scss']
})
export class WaitingListQueuesComponent implements OnInit {

  displayedColumns: string[] = ['queueName', 'count'];
  dataSource = [] ;
  waitingListAllData = [];
  subscriptions$: any[] = [];
  roleName =  'authorized user';
  partACount;
  partBCount;
  partAData;
  partBData;
  isAuthorizedUser = (this.roleName === 'authorized user') ? true : false;
  @Output() emitSearchRequest = new EventEmitter();

  constructor(private waitingListService: WaitingListService) { }

  ngOnInit(): void {
    this.getWaitingQueues();
    this.getPartAWaitingList();
    if(this.isAuthorizedUser) {
      this.getPartBWaitingList();
    }
  }

  getPartAWaitingList() {
    const partAWaitingList$ = this.waitingListService.getPartAWaitingList().subscribe((res:any) => {
     this.partACount =  res.kbPartTotal
      this.partAData = res.kbPartSearchResults;
    });
    this.subscriptions$.push(partAWaitingList$);
  }

  getPartBWaitingList() {
    const partBWaitingList$= this.waitingListService.getPartBWaitingList().subscribe((res:any) => {
      this.partBCount =  res.kbPartTotal
      this.partBData = res.kbPartSearchResults;
    });
    this.subscriptions$.push(partBWaitingList$);
  }


  getWaitingQueues() {
    //Test
    const localStorageLocal = localStorage.getItem('APP_STORAGE_TOKEN');
    const userId = JSON.parse(localStorageLocal).userName; //'dcu7356';
    const entityId = JSON.parse(localStorageLocal).entityId;//'1001';
    //
    this.dataSource = [];
    let observables = [];
    observables.push(this.waitingListService.getWaitingListQueues(userId,entityId));
    observables.push(this.waitingListService.getTaskQueues());
    const aitingQueues$ = forkJoin(observables).subscribe((res: any)=> {
      const keys = Object.keys(res[0]);
      keys.forEach( (key) => {
        let row = {};
        const queueInfo = res[1].filter(taskQueue => (taskQueue.code === key));
        row["listDetails"] = res[0][key].waitingListQueue ;
        if(queueInfo && queueInfo.length > 0) {
          row["queueName"] = queueInfo[0].value;
        }
        row["count"] = res[0][key].taskCount;
        console.log("row ", row);
        this.dataSource = [...this.dataSource,...[row]];
        this.waitingListAllData = [...this.waitingListAllData, ...res[0][key].waitingListQueue];
      });
      console.log("dataSource ", this.dataSource);
    })
    this.subscriptions$.push(aitingQueues$)
  }

  displaySearchResults(data) {
      this.emitSearchRequest.emit(data);
  }

  passTheSalt() {
    alert("KATIE BECKETT PART B WAITING LIST");
  }
}
