import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-request-summary',
  templateUrl: './request-summary.component.html',
  styleUrls: ['./request-summary.component.scss']
})
export class RequestSummaryComponent implements OnInit {

  @Input() requestSummary: any;
  @Input() appealFilingMethod: any;
  @Input() otherDepartmentNameDetails: any;
  @Input() whoIsFilingAppeal: any;

  constructor() { }

  ngOnInit(): void {
   
  }

  ngOnChanges(){
    if(undefined !== this.requestSummary && this.appealFilingMethod && this.otherDepartmentNameDetails && this.whoIsFilingAppeal){
      this.whoIsFilingAppeal.forEach( data =>{
        if(this.requestSummary.whoFilingAplCd === data.code){
          this.requestSummary.whoFilingAplCd = data.value;
        }
      });
      this.otherDepartmentNameDetails.forEach( data =>{
        if(this.requestSummary.othrDeptNameCd === data.code){
          this.requestSummary.othrDeptNameCd = data.value;
        }
      });
      this.appealFilingMethod.forEach( data =>{
        if(this.requestSummary.aplFilMthdCd === data.code){
          this.requestSummary.aplFilMthdCd = data.value;
        }
      });
    }
  }


  


}
