import { Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import * as Constants from '../../../_shared/constants/application.constants';


const TASK_NAMES = ["LINK TWO INDIVIDUALS","UNLINK TWO INDIVIDUALS", "TEDS LINK ACKNOWLEDGMENT"];

@Component({
  selector: 'app-queue-search-results',
  templateUrl: './queue-search-results.component.html',
  styleUrls: ['./queue-search-results.component.scss']
})
export class QueueSearchResultsComponent implements OnInit {

  @Input() tableRecords: any;
  @Input() taskNameRecords: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumns: string[] = ['personId1', 'personName1', 'personId2', 'personName2', 'requestDate', 'userAction'];
  dataSource: MatTableDataSource<any>;

  constructor(private router: Router) { }

  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.tableRecords);
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes['tableRecords'] && (changes['tableRecords'].currentValue !== changes['tableRecords'].previousValue)) {
      this.dataSource = new MatTableDataSource(changes['tableRecords'].currentValue);
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
      });

    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  handleContinueClick(row) {
    if(TASK_NAMES.indexOf(this.taskNameRecords.toUpperCase()) > -1) {
      const META_DATA = { taskId: row.taskId, personId: row.personId1, personId2: row.personId2, showConfirmLink: true, requestType: ''  };
      if(this.taskNameRecords.toLowerCase().indexOf('unlink') > -1) {
        META_DATA.requestType = 'Unlink';
      } else if (this.taskNameRecords.toLowerCase().indexOf('link') > -1) {
        META_DATA.requestType = 'Link';
      }
      sessionStorage.setItem('ACTIVE_SESSION_DATA', CryptoJS.AES.encrypt(JSON.stringify(META_DATA), Constants.APP_ENC_DECRYPT_KEY).toString());
      this.router.navigate(['/ltss/personReconciliation/linkUnlinkRequest']);
    } else {
      const isPersonMatch = this.taskNameRecords.toUpperCase() === 'PERSON MATCH';
      const META_DATA = { taskId: row.taskId, personId1: row.personId1, personId2: row.personId2, taskMasterId: row.taskMasterId, paeId: row.paeId, refId: row.refId,  isPersonMatch};
      sessionStorage.setItem('ACTIVE_SESSION_DATA', CryptoJS.AES.encrypt(JSON.stringify(META_DATA), Constants.APP_ENC_DECRYPT_KEY).toString());
      this.router.navigate(['/ltss/personReconciliation/prsnDetails']);
    }
  }
}
