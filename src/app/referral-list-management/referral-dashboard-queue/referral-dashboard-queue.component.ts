import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-referral-dashboard-queue',
  templateUrl: './referral-dashboard-queue.component.html',
  styleUrls: ['./referral-dashboard-queue.component.scss']
})
export class ReferralDashboardQueueComponent implements OnInit {

  @Input() taskQueueData: any[];
  @Input() taskTableShowResult: boolean = false;
  @Output() emitReferralQueue: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumns: string[] = ['queueName', 'count'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  constructor() { }
  ngOnInit(): void {
  }
  ngOnChanges(){
    if(this.taskQueueData.length > 0){
      this.taskTableShowResult = true;
      this.dataSource = new MatTableDataSource(this.taskQueueData);
      setTimeout(() => this.dataSource.paginator = this.paginator);
    }
  }

  emitDataToSearchResult(row){
    this.emitReferralQueue.emit(row);
  }

}
