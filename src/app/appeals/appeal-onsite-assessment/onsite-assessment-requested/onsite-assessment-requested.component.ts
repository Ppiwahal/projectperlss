import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-onsite-assessment-requested',
  templateUrl: './onsite-assessment-requested.component.html',
  styleUrls: ['./onsite-assessment-requested.component.scss']
})
export class OnsiteAssessmentRequestedComponent implements OnInit {

  @Input() onsiteAssessmentOnLoad: any;

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(){
    if(this.onsiteAssessmentOnLoad){
      console.log(this.onsiteAssessmentOnLoad);
    }
  }

}
