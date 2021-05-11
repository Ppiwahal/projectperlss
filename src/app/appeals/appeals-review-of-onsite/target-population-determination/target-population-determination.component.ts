import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-target-population-determination',
  templateUrl: './target-population-determination.component.html',
  styleUrls: ['./target-population-determination.component.scss']
})
export class TargetPopulationDeterminationComponent implements OnInit {

  yesOrNo: any[] = [{code:'Y', value:'Yes'}, {code:'N', value:'No'}]
  applntMeetTargPopu: boolean;
  targetPopulationDeter: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.targetPopulationDeter = this.formBuilder.group({
      orTrgtPopltnHrngAddrSw:[''],
      orApplntMeetTrgtPopltnSw: [''],
      orAddInfoRcvdSw: [''],
      orAddInfoApprovedTrgtPopltnSw:[''],
      orTrgtPopltnDenialIddSw:[''],
      orTrgtPopltnDenialLsaSw:[''],
      orTrgtPopltnDenialNodefSw:[''],
      orTrgtPopltnDenialNoChrncPhyclDisblySw:['']
    });
  }

  onAppellantTargPopChanged(value){
   if(value === 'N'){
      this.applntMeetTargPopu = true;
   } else {
     this.applntMeetTargPopu = false;
   }
  }

}
