import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { AppealService } from '../../services/appeal.service';

@Component({
  selector: 'app-onsite-assessment-table',
  templateUrl: './onsite-assessment-table.component.html',
  styleUrls: ['./onsite-assessment-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class OnsiteAssessmentTableComponent implements OnInit {

  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  columnsToDisplay: string[] = ['OnsiteReferralDate','OnsiteDueDate','OnsiteStatus', 'UpdateDate', 'UserActions'];
  expandedElement: any | null;
  reasonOnhold: any;
  approveOnHold: any[] = [{"code": "Y", "value":"Yes","activateSW":"Y"},
                          {"code": "N", "value":"No","activateSW":"Y"}];
  onsiteStatus: any[] = []
  onsiteAssessmentTable: any[] = [];
  onsiteAssessmentTableForm: FormGroup;
  buttonClicked: any;
  isLtssUser: boolean;
  @Input() appealReviewAplId: any;
  @Input() ltssAppealUser: any;
  @Input() onsiteReqId: any;
  

  constructor(private appealService: AppealService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    const reasonOnHold$ = this.appealService.getAppealDropdowns('REASON_ONHOLD').subscribe(res => {
      this.reasonOnhold = res;
    });

    this.appealService.getAppealDropdowns('ONSITE_STATUS').subscribe(res => {
      this.onsiteStatus = res;
    });

  }
  ngOnChanges(){
   if(this.appealReviewAplId){
      this.loadHistoryTableData();
   }
  }

  loadHistoryTableData(){
    this.appealService.getOnsiteAssessmentHistory(this.appealReviewAplId).subscribe(res => {
      res[0].displayButton = true;
      this.onsiteStatus.forEach( data => {
        res.forEach(element => {
          if(data.code === element.onsiteStatusCd){
            element.onsiteStatus = data.value;
          }
        })
      })
      
      this.dataSource = new MatTableDataSource(res);
    });
  }

  onReaFrHoldChanged(event, element){
    element.onholdRsnCd =  event.value;
  }

  additionalNotesChange(event, element){
    element.onholdConctrNotes =  event.target.value;
  }

  onAprHoldChanged(event, element){
    element.onholdApproveSw =  event.value;
    if(event.value === 'N'){

    }
  }

  reasonFrDenial(event, element){
    element.onholdDeniedComments =  event.target.value;
  }

  requestHold(element){
    if(element.onholdRsnCd !== ''){
      let payLoad = {
        "onholdRsnCd": element.onholdRsnCd,
        "conctrOnholdNotes":element.onholdConctrNotes,
        "aplOnsiteAssmntReqId":this.onsiteReqId
      }
         this.appealService.onsiteAssessmentRequestHold(this.appealReviewAplId, payLoad).subscribe(res => {
          this.loadHistoryTableData();
        });
    }
    
  }

  cancel(element){
    let payLoad ={}
    this.appealService.onsiteAssessmentCancelHold(this.appealReviewAplId, payLoad, this.onsiteReqId).subscribe(res => {
      this.loadHistoryTableData();
    });
  }

  submit(element){
    if(element.onholdApproveSw !== ''){
      let payLoad = {
        "approveOnholdSw": element.onholdApproveSw,
        "onholdDeniedComments":element.onholdApproveSw === 'Y' ? '' : element.onholdDeniedComments,
        "aplOnsiteAssmntReqId":this.onsiteReqId
      }
      
      this.appealService.onsiteAssessmentSubmitHold(this.appealReviewAplId, payLoad).subscribe(res => {
        this.loadHistoryTableData();
      });
    }
  }

}
