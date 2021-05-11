import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import * as customValidation from '../../_shared/constants/validation.constants';
import { ReferralListManagementService } from '../services/referral-list-management.service';

@Component({
  selector: 'app-referral-dashboard-table',
  templateUrl: './referral-dashboard-table.component.html',
  styleUrls: ['./referral-dashboard-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ReferralDashboardTableComponent implements OnInit {

  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  columnsToDisplay = ['personName', 'ssn', 'age', 'referralId','intakeOutcome', 'annualOutreachDueDate'];
  expandedElement: any | null;
  @Input() searchResultData:any[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  customValidation = customValidation;
  @Input() showNoRecordsFound: boolean;
  showTable:boolean = false;

  constructor(private referralListManagementService: ReferralListManagementService) { }

  ngOnInit(): void {
  }

  ngOnChanges(){
    if(this.searchResultData.length >0){
      this.showTable = true;
      this.dataSource = new MatTableDataSource(this.searchResultData);
      setTimeout(() => this.dataSource.paginator = this.paginator);
      this.showNoRecordsFound = false
    } else {
      this.showTable = false;
    }
  }
  getNameByCode(code: string, entity: string) {
    if (entity === 'IOC' && code) {
      const result = this.referralListManagementService.intakeOutcomeCodes.filter(item => item.code === code);
      return result.length > 0 ? result[0].value : code;
    }
    if (entity === 'RLS' && code) {
      const result = this.referralListManagementService.referralListCodes.filter(item => item.code === code);
      return result.length > 0 ? result[0].value : code;
    }
    if (entity === 'TS' && code) {
      const result = this.referralListManagementService.taskStatusCodes.filter(item => item.code === code);
      return result.length > 0 ? result[0].value : code;
    }
    if (entity === 'TQ' && code) {
      const result = this.referralListManagementService.taskQueueCodes.filter(item => item.code === code);
      return result.length > 0 ? result[0].value : code;
    }
  }


  
}
