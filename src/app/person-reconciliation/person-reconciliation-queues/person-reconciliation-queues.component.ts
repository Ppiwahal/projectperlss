import { Component, OnDestroy, OnInit } from '@angular/core';
import { PersonReconciliationService } from '../services/person-reconciliation.service';
import { MatTableDataSource } from '@angular/material/table';
import { Router} from '@angular/router';
import * as CryptoJS from 'crypto-js';
import * as Constants from '../../_shared/constants/application.constants';

@Component({
  selector: 'app-person-reconciliation-queues',
  templateUrl: './person-reconciliation-queues.component.html',
  styleUrls: ['./person-reconciliation-queues.component.scss']
})
export class PersonReconciliationQueuesComponent implements OnInit, OnDestroy {

  subscriptions$ = [];
  tableData = [];
  isShowQueueTable = false;
  displayedColumns: string[] = ['queueName', 'taskCount'];
  dataSource: MatTableDataSource<any>;
  isShowRecords = false;
  taskNameRecords = '';
  queueResponseRecords: any;
  tableRecords = [];
  taskQueues: any;
  userId;
  entityId;

  constructor(private personReconciliationService: PersonReconciliationService, 
              private router: Router) { }

  ngOnInit() {
    this.getTaskQueues();
  }

  getTaskQueues() {
    const TaskQueuesSubscription = this.personReconciliationService.getAppealDropdowns('TASK_QUEUE').subscribe(response => {
      this.taskQueues = response;
      this.personReconciliation();
    });
    this.subscriptions$.push(TaskQueuesSubscription);
  }

  personReconciliation() {
    const localStorageforLocal = localStorage.getItem('APP_STORAGE_TOKEN');
    this.userId= JSON.parse(localStorageforLocal).userName;
    this.entityId = JSON.parse(localStorageforLocal).entityId;
    const PersonReconciliationSubscription = this.personReconciliationService.personReconsiliation(this.userId, this.entityId)
      .subscribe(response => {
        this.queueResponseRecords = response;
        if (this.taskQueues.length > 0) {
          if (response && response['135']) {
            const tempObj = {
              taskCount: response['135'].taskCount,
              taskName: '',
              task: '135'
            };
            this.tableData.push(tempObj);
          }
          if (response && response['139']) {
            const tempObj = {
              taskCount: response['139'].taskCount,
              taskName: '',
              task: '139'
            };
            this.tableData.push(tempObj);
          }
          if (response && response['138']) {
            const tempObj = {
              taskCount: response['138'].taskCount,
              taskName: '',
              task: '138'
            };
            this.tableData.push(tempObj);
          }
          if (response && response['133']) {
            const tempObj = {
              taskCount: response['133'].taskCount,
              taskName: '',
              task: '133'
            };
            this.tableData.push(tempObj);
          }
          if (response && response['134']) {
            const tempObj = {
              taskCount: response['134'].taskCount,
              taskName: '',
              task: '134'
            };
            this.tableData.push(tempObj);
          }
          if (response && response['124']) {
            const tempObj = {
              taskCount: response['124'].taskCount,
              taskName: '',
              task: '124'
            };
            this.tableData.push(tempObj);
          }
          this.tableData.forEach(element => {
            this.taskQueues.forEach(ele => {
              if (ele.code === element.task) {
                element.taskName = ele.value;
              }
            });
          });
          if (this.tableData.length > 0) {
            this.isShowQueueTable = true;
            this.dataSource = new MatTableDataSource(this.tableData);
          }
        }
      });
    this.subscriptions$.push(PersonReconciliationSubscription);
  }

  showRecords(element) {
    this.taskNameRecords = element.taskName;
    this.tableRecords = this.queueResponseRecords[element.task].adminPrsnReconList;
    this.isShowRecords = true;
  }

  submitLinkRequest() {
    console.log('This is a link request');
    const  requestParams = {requestType: 'Link'};
    sessionStorage.setItem('ACTIVE_SESSION_DATA', CryptoJS.AES.encrypt(JSON.stringify(requestParams), Constants.APP_ENC_DECRYPT_KEY).toString());
    this.router.navigate(['/ltss/personReconciliation/linkUnlinkRequest']);
  }

  submitUnLinkRequest() {
    console.log('This is a unlink request');
    const  requestParams = {requestType: 'Unlink'};
    sessionStorage.setItem('ACTIVE_SESSION_DATA', CryptoJS.AES.encrypt(JSON.stringify(requestParams), Constants.APP_ENC_DECRYPT_KEY).toString());
    this.router.navigate(['/ltss/personReconciliation/linkUnlinkRequest']);
  }

  ngOnDestroy() {
    if (this.subscriptions$ && this.subscriptions$.length > 0) {
      this.subscriptions$.forEach(subscription$ => subscription$.unsubscribe());
    }
  }

}
