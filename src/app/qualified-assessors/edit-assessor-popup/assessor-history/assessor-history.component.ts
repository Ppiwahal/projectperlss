import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-assessor-history',
  templateUrl: './assessor-history.component.html',
  styleUrls: ['./assessor-history.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class AssessorHistoryComponent implements OnInit, OnChanges {

  @Input() assessorHistoryData = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input() statusOptions: any;
  @Input() credentialOptions: any;

  columnsToDisplay: string[] = ['credentialsCd', 'firstName', 'lastName', 'recertificationDate', 'endDt', 'statusCd'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource(this.assessorHistoryData);
  expandedElement: any | null;

  constructor() { }


  ngOnInit(): void {
    console.log(this.assessorHistoryData);
  }

  ngOnChanges() {
    if (this.assessorHistoryData !== undefined) {
      this.assessorHistoryData.forEach( data => {
        this.statusOptions.forEach( status => {
          if ( status.code === data.statusCd){
            data.statusCd = status.value;
          }
        });
        this.credentialOptions.forEach( cp => {
          if (cp.code === data.credentialsCd){
            data.credentialsCd = cp.value;
          }
        });
      });
      console.log(this.assessorHistoryData);
      this.dataSource = new MatTableDataSource(this.assessorHistoryData);
      this.dataSource.paginator = this.paginator;
    }
  }

}
