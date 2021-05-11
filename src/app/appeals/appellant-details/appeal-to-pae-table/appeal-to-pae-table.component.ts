import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChange } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-appeal-to-pae-table',
  templateUrl: './appeal-to-pae-table.component.html',
  styleUrls: ['./appeal-to-pae-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class AppealToPaeTableComponent implements OnInit {

  expandedElement: any | null;
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  columnsToDisplay = ['paeId', 'paeSubmissionDate', 'elementGroup', 'paeStatus','enrollmentStatus'];
  @Input() appealTypeData: any;
  @Output() emitLinkAppealReferral: EventEmitter<any> = new EventEmitter<{isSelected:boolean, data:any}>();
  isPersonSelected: boolean = false;
  @Input() enrollGroupData: any;
  @Input() paeStatusData: any;
  @Input() enrollStatusData:any;
  @Input() slotStatusData:any;
  @Input() yes_no:any;
  @Input() enrolDenialReasData: any;

  constructor() { }

  ngOnInit(): void {
   
  }

  ngOnChanges(changes: SimpleChange){
    if(this.appealTypeData !== undefined && this.enrollGroupData && this.paeStatusData && this.enrollStatusData
       && this.slotStatusData && this.enrolDenialReasData){
      if(this.appealTypeData.paeLinkRespVOs !== null){
        this.appealTypeData.paeLinkRespVOs.forEach((data, i) => {
          data.index = i;
          data.isSelected = false;
          this.enrollGroupData.forEach( ele => {
            if(data.enrollmentGrp === ele.code){
              data.enrollmentGrp = ele.value;
            }
          });
          this.paeStatusData.forEach( ele => {
            if(data.paeStatus === ele.code){
              data.paeStatus = ele.value;
            }
          });
          this.enrollStatusData.forEach( ele => {
            if(data.enrollmentStat === ele.code){
              data.enrollmentStat = ele.value;
            }
          });
          this.slotStatusData.forEach( ele => {
            if(data.slotStatus === ele.code){
              data.slotStatus = ele.value;
            }
          });
          this.enrolDenialReasData.forEach( ele => {
            if(data.denialreason === ele.code){
              data.denialreason = ele.value;
            }
          });
        });
      }
      this.dataSource = new MatTableDataSource(this.appealTypeData.paeLinkRespVOs);
    }
  }

  selectedRow(element){
    element.isSelected = !element.isSelected
    this.isPersonSelected = !this.isPersonSelected;
    this.emitLinkAppealReferral.emit({isSelected:this.isPersonSelected, data:element});
  }



}
