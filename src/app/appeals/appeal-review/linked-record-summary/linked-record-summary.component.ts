import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-linked-record-summary',
  templateUrl: './linked-record-summary.component.html',
  styleUrls: ['./linked-record-summary.component.scss']
})
export class LinkedRecordSummaryComponent implements OnInit {
  
  @Input() linkedRecordSummary: any;
  linkedRef: any;
  linkedPae: any;
  linkedPassr: any;
  @Input() passrRefrenceTableData: any;
  pasrrReason: any;
  payorSource: any;
  passrAdverseReason: any;
  pasrr_reason: any = [{"name": "HE", "value":"Level I Positive","activateSW":"Y"},
  {"name": "LC", "value":"Level II- LOC","activateSW":"Y"},
  {"name": "NC", "value":"Level II- Non LOC","activateSW":"Y"}]
  payor_source: any = [{"code": "HS", "value":"Hospice","activateSW":"Y"},
  {"code": "MD", "value":"Medicaid","activateSW":"Y"},
  {"code": "ME", "value":"Medicare","activateSW":"Y"},
  {"code": "AP", "value":"Medicaid Pending","activateSW":"Y"},
  {"code": "SP", "value":"Self-pay/ Private","activateSW":"Y"}]
  passr_adverse_reason: any = [{"name": "HE", "value":"Medicaid/Medicaid pending -denied NF LOC and at risk LOC","activateSW":"Y"},
  {"name": "DC", "value":"Medicaid/Medicaid pending-denied NF LOC approved at risk LOC with-out end date","activateSW":"Y"},
  {"name": "RS", "value":"Medicaid/Medicaid pending-denied NF LOC approved at risk LOC with end date","activateSW":"Y"},
  {"name": "TL", "value":"Denied LOC (Non Medicaid or Non Medicaid Pending)","activateSW":"Y"},
  {"name": "SL", "value":"PASRR- Approved NF services with SS","activateSW":"Y"},
  {"name": "DE", "value":"PASRR- Approved NF services with NO SS","activateSW":"Y"},
  {"name": "LC", "value":"PASRR- Approved NF services with SS Short Term","activateSW":"Y"},
  {"name": "NC", "value":"PASRR- Approved NF services with NO SS Short Term","activateSW":"Y"},
  {"name": "HE", "value":"PASRR-Denied- Requires Inpatient Psychiatric Services","activateSW":"Y"},
  {"name": "DC", "value":"PASRR-Resident Review Approved Cont. Stay 30 month rule","activateSW":"Y"},
  {"name": "RS", "value":"Level I Positive- 30 Day Hosp Exemption","activateSW":"Y"},
  {"name": "TL", "value":"Level I Positive- 60 Day Convalescence","activateSW":"Y"},
  {"name": "SL", "value":"Level I Positive- Respite","activateSW":"Y"},
  {"name": "DE", "value":"Level I Positive- Terminal Illness","activateSW":"Y"},
  {"name": "SL", "value":"Level I Positive- Sever Illness","activateSW":"Y"},
  {"name": "DE", "value":"Level I Positive- Dementia Exempt","activateSW":"Y"},
  {"name": "OT", "value":"Other","activateSW":"Y"}]


  constructor() { }

  ngOnInit(): void {
    console.log(this.linkedRecordSummary);
  }

  ngOnChanges(){
    // if(this.linkedRecordSummary && this.passrRefrenceTableData){
    if(this.linkedRecordSummary){
      this.linkedRef = this.linkedRecordSummary.linkedRecordRefVO
      this.linkedPae = this.linkedRecordSummary.linkedRecordPaeVO
      this.linkedPassr = this.linkedRecordSummary.linkedRecordPasVO
      if(this.linkedPassr !== null){
        this.pasrr_reason.forEach( data =>{
              if(data.name == this.linkedPassr.pasrrRsnCd){
                  this.pasrrReason = data.value;
              }
          })

          this.payor_source.forEach( data =>{
              if(data.code == this.linkedPassr.payorSourceCd){
                  this.payorSource = data.value;
              }
          })

          this.passr_adverse_reason.forEach( data =>{
            if(data.name = this.linkedPassr.pasrrAdverseActionCd){
                this.passrAdverseReason = data.value;
            }
          })
      }
  }
}

}
