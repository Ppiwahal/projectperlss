import { Component,  Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { StaticDataMapService } from '../../core/helpers/static.data.map.service';

@Component({
  selector: 'app-overall-task-performance',
  templateUrl: './overall-task-performance.component.html',
  styleUrls: ['./overall-task-performance.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class OverallTaskPerformanceComponent implements OnInit {

  columnsToDisplay: string[] = ['name', 'count'];
  performanceOverview: any[] = [{name: "Total Open Tasks"},{name:"Total Past Due Tasks"},{name:"% of Past Dues"},{name:"% of Timely Closed Tasks"}]
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  expandedElement: any | null;
  @Input() overAllTaskData;
  @Input() taskPerformanceDetails;

  constructor(private staticDataService: StaticDataMapService) { }

  ngOnInit(): void {
  }

  ngOnChanges(){
    if(this.taskPerformanceDetails){
      this.performanceOverview[0].count = this.taskPerformanceDetails.openTaskCount;
      this.performanceOverview[1].count = this.taskPerformanceDetails.pastDueCount;
      this.performanceOverview[1].expanded = this.overAllTaskData;
      this.performanceOverview[2].count = this.taskPerformanceDetails.percentageOfPastDues+"%";
      this.performanceOverview[3].count = this.taskPerformanceDetails.percentageoftimelyClosed+"%";
      this.dataSource = new MatTableDataSource(this.performanceOverview);
    }
  }

  expandRow(element){
    if(element.expanded !== undefined){
      this.expandedElement = this.expandedElement === element ? null : element
    }
  }

  getDashboardNameByCode(queueCode) {
    queueCode = queueCode ? queueCode.toString() : queueCode;
    const taskNameQueues = this.staticDataService.getStaticDataKeyValue('DASHBOARD');
    const filteredTaskQueue = taskNameQueues.find(item => item.code === queueCode);
    const value =  filteredTaskQueue ? filteredTaskQueue.value : ' ';
    return value;
  }


}
