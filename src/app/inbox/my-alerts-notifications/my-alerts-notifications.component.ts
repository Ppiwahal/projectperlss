import { Component, OnInit, EventEmitter, Output, ViewChild,Inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { InboxService } from '../services/inbox.service';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
 import { MatDialog } from '@angular/material/dialog';
 import { NotificationDetailsComponent } from '../../core/widgets/notification/notification-details.component';

export interface Notification {
  notificationName: string;
  recordId: string;
  receivedTimestamp: string;
  status : string;
  notificationId: number
}

@Component({
  selector: 'app-my-alerts-notifications',
  templateUrl: './my-alerts-notifications.component.html',
  styleUrls: ['./my-alerts-notifications.component.scss']
})
export class MyAlertsNotificationsComponent implements OnInit {
  displayedColumns: string[] = ['notificationName','recordId', 'receivedTimestamp','status','viewAction'];
  dataSource: MatTableDataSource<any>;
  @Output() emitNotificationCount = new EventEmitter();
  notificationData:any[] = [];
  subscriptions$:any[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  selectedPageSize: any;
  pageOptions:any[] = [];
  userId;
  entityId;
  constructor(private inboxService: InboxService,
               private dialog: MatDialog,
              private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getNotificationTasks();
  }

  getNotificationTasks(){
    const localStorageforLocal = localStorage.getItem('APP_STORAGE_TOKEN');
    this.userId= JSON.parse(localStorageforLocal).userName;
    this.entityId = JSON.parse(localStorageforLocal).entityId;
    let observables = [];
    observables.push(this.inboxService.getNotificationTask(this.userId,this.entityId));
    observables.push(this.inboxService.getReadUnreadCodes());
    observables.push(this.inboxService.getPagingOptions());

    const NotificationTasksSubscriptions$ = forkJoin(observables).subscribe((res: any) => {
      let tableRecords = [];
      if(res[0] && res[0].length > 0) {
        res[0].forEach(row => {
          if (row.userIdResponseVO) {
            let recordIds = [];
            if (row.userIdResponseVO.paeId) recordIds.push(row.userIdResponseVO.paeId);
            if (row.userIdResponseVO.referralId) recordIds.push(row.userIdResponseVO.referralId);
            if (row.userIdResponseVO.appealId) recordIds.push(row.userIdResponseVO.appealId);
            if (row.userIdResponseVO.transitionId) recordIds.push(row.userIdResponseVO.transitionId);
            if (row.userIdResponseVO.enrollmentId) recordIds.push(row.userIdResponseVO.enrollmentId);
            row['recordId'] = recordIds.join();
            row['rowDetail'] = row.userIdResponseVO;
          }

          if(res[1] && res[1].length > 0) {
            let statusObj =  res[1].filter(rec => rec.code ===  row['statusCd']);
            if(statusObj && statusObj.length > 0) {
              row['statusCd'] =  statusObj[0].value;
            }
          }

          if(res[2] && res[2].length > 0) {
            this.pageOptions = res[2].map(pageOption => pageOption.value);
            this.selectedPageSize = 10;
          }

          tableRecords.push(row);
        })
      }
      tableRecords.sort(
          function(a, b) {
             if (a.statusCd === b.statusCd) {
               return Number(new Date(b.recievedTimeStamp)) - Number(new Date(a.recievedTimeStamp));
             }
             return b.statusCd > a.statusCd ? 1 : -1;
         });
 
      this.notificationData = tableRecords;
      this.dataSource = new MatTableDataSource(tableRecords);
      this.dataSource.paginator = this.paginator;
      setTimeout (() => {
        this.emitNotificationCount.emit(this.dataSource.data.length);
      });
    })
    this.subscriptions$.push(NotificationTasksSubscriptions$);
  }


  viewNotification(notificationDetail) {
    this.notificationData = this.notificationData.map(data => {
      if(data.notificationId === notificationDetail.notificationId && data.statusCd === 'Unread') {
        data.statusCd = 'Read';
      }
      return data;
    });
    const notification = {id: notificationDetail.notificationId, paeId:notificationDetail.rowDetail.paeId,
      aplId: notificationDetail.rowDetail.appealId, enrId:  notificationDetail.rowDetail.enrollmentId,
      mergedPrsnId: null, refId: notificationDetail.rowDetail.referralId,
      trnstnId:notificationDetail.rowDetail.transitionId, notificationName: notificationDetail.notificationName };
      this.dialog.open(
        NotificationDetailsComponent,
        {
          width: '700px',
          height: '600px',
          panelClass: 'notification-details-container',
          data: { notification }
        }
      );
      this.inboxService.updateNotificationStatus(notificationDetail.notificationId).subscribe( res => {
      this.dataSource = new MatTableDataSource(this.notificationData);
      this.toastr.success(res.successMsgDescription);
    }, err => {
      this.toastr.error('Service Error');
    });
  }

  ngAfterViewInit() {

  }

  ngOnDestroy() {
    if(this.subscriptions$ && this.subscriptions$.length > 0) {
      this.subscriptions$.forEach(subscription$ => subscription$.unsubscribe());
    }
  }

}
