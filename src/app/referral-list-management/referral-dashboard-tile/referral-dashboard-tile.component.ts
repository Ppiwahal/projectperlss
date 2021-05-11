import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-referral-dashboard-tile',
  templateUrl: './referral-dashboard-tile.component.html',
  styleUrls: ['./referral-dashboard-tile.component.scss']
})
export class ReferralDashboardTileComponent implements OnInit {

  @Input() intakeOutComeData: any[];
  @Input() agedCareGiverData: any[];
  @Input() ecfReferralCountData: any;
  ecfData: any;
  @Output() emitReferralTile: EventEmitter<any> = new EventEmitter<any>();
 
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  dataSource1: MatTableDataSource<any> = new MatTableDataSource();
 
   displayedColumns: string[] = ['intakeOutcome'];
 
   displayedColumns1: string[] = ['agedCareGivers'];

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(){
    if(this.intakeOutComeData.length >0 && this.agedCareGiverData.length>0){
      this.dataSource = new MatTableDataSource(this.intakeOutComeData);
      this.dataSource1 = new MatTableDataSource(this.agedCareGiverData);
    }
    if(this.ecfReferralCountData !== undefined){
      this.ecfData = this.ecfReferralCountData;
    } 
  }

  emitDataToRefferalResult(element){
    this.emitReferralTile.emit(element);
  }

}
