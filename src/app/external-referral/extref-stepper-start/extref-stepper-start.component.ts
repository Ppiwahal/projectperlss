import { Component, OnInit } from '@angular/core';
// import { ExternalreferralService } from '../services/externalreferral.service';
// import {FormGroup, FormBuilder} from '@angular/forms';

@Component({
  selector: 'app-extref-stepper-start',
  templateUrl: './extref-stepper-start.component.html',
  styleUrls: ['./extref-stepper-start.component.scss'],
  //providers: [ ExternalreferralService ]
})
export class ExtrefStepperStartComponent implements OnInit {
  isLinear = false;
  currentForm = 0;
  myForm: Array<string>
  constructor(
    //public formService: ExternalreferralService,
    //private fb: FormBuilder
    ) { 
      //this.myForm = this.formService.mainForm.value
    }

  ngOnInit(): void {
  }

  // selectedIndex(currentStepperForm){
  //   this.currentForm = currentStepperForm;
  // }

}
