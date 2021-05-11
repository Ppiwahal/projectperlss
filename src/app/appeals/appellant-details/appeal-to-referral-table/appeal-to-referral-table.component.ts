import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-appeal-to-referral-table',
  templateUrl: './appeal-to-referral-table.component.html',
  styleUrls: ['./appeal-to-referral-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class AppealToReferralTableComponent implements OnInit {

  expandedElement: any | null;
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  columnsToDisplay = ['refId', 'referralType', 'referralRecDt','refStatus', 'slotStatus'];
  @Input() appealTypeData: any;
  @Output() emitLinkAppealReferral: EventEmitter<any> = new EventEmitter<{isSelected:boolean, data:any}>();
  isPersonSelected: boolean = false;
  @Input() referralStatusData: any;
  @Input() intakeOutcomeData: any;
  @Input() slotStatusData:any;
  @Input() tpDiagnosisData: any;
  

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(){
    if(this.appealTypeData !== undefined && this.referralStatusData && this.intakeOutcomeData){
      if(this.appealTypeData.refLinkRespVOs !== null){
        this.appealTypeData.refLinkRespVOs.forEach((data, i) => {
          data.index = i;
          data.isSelected = false;
          this.referralStatusData.forEach( refStat => {
            if(data.refStatus === refStat.code){
              data.refStatus = refStat.value;
            }
          });
          this.intakeOutcomeData.forEach( inTakeOutCm => {
            if(data.intakeOutcome === inTakeOutCm.code){
              data.intakeOutcome = inTakeOutCm.value;
            }
          });
          this.slotStatusData.forEach( ele => {
            if(data.slotStatus === ele.code){
              data.slotStatus = ele.value;
            }
          });
          this.tpDiagnosisData.forEach( ele => {
            if(data.linkToReferral === ele.code){
              data.linkToReferral = ele.value;
            }
          });
          
        });
      }
      this.dataSource = new MatTableDataSource(this.appealTypeData.refLinkRespVOs);
    }
  }

  selectedRow(element){
    element.isSelected = !element.isSelected
    this.isPersonSelected = !this.isPersonSelected;
    this.emitLinkAppealReferral.emit({isSelected:this.isPersonSelected, data:element});
  }
 
}
