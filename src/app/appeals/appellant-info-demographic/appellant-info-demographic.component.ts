import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-appellant-info-demographic',
  templateUrl: './appellant-info-demographic.component.html',
  styleUrls: ['./appellant-info-demographic.component.scss']
})
export class AppellantInfoDemographicComponent implements OnInit {

  @Input() appellantDemographic: any;
  ssn: any;

  constructor() { }

  ngOnInit() {
    if (this.appellantDemographic.ssn) {
      const ssn1 = this.appellantDemographic.ssn.substring(0, 3);
      const ssn2 = this.appellantDemographic.ssn.substring(3, 5);
      const ssn3 = this.appellantDemographic.ssn.substring(5, this.appellantDemographic.ssn.length);
      this.ssn = ssn1 + '-' + ssn2 + '-' + ssn3;
    }
  }

}
