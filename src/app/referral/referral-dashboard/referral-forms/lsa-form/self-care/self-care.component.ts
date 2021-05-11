import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IntakeOutcomeService } from 'src/app/core/services/referral/intake-outcome/intake-outcome.service';
import { LsaFormService } from 'src/app/core/services/referral/lsa-form/lsa-form.service';
import { ReferralService } from 'src/app/core/services/referral/referral.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-self-care',
  templateUrl: './self-care.component.html',
  styleUrls: ['./self-care.component.scss']
})
export class SelfCareComponent implements OnInit {

  refId: string;
  subscription1$: Subscription;
  subscriptions: Subscription[] = [];
  subscription2$: Subscription;
  selfCareData: any;

  answerCd = [
    {code: 'Y', description: 'Yes', activateSW:'Y'},
    {code: 'N', description: 'No', activateSW:'Y'},
    {code: 'NC', description: 'No Conclusion', activateSW:'Y'},
  ];

  lsaFormQuestionList = [
    {
      code: '8387',
      value: 'SLCR',
      options: [
        {name: "Observation", value: null},
        {name: "Applicant", value: null}],
      description:'Applicant bathes or showers independently including transfer to tub or shower, turning on and adjusting water scrubbing, washing hair, transfer from tub or shower and drying, without using assistive devices.'},
    {code: '8388', value: 'SLCR',  options: [{name: "Observation", value: null}, {name: "Applicant", value: null}], description:'Applicant completes grooming independently, including brushing/combing hair, brushing teeth, shaving, and cleaning and trimming nails, without using assistive devices.'},
    {code: '8389', value: 'SLCR',  options: [{name: "Observation", value: null}, {name: "Applicant", value: null}], description:'Applicant independently selects attire appropriate to season and activity and independently dresses and undresses self, including underclothes, outer clothes, socks and shoes, without using adapted clothes or assistive devices.'},
    {code: '8390', value: 'SLCR',  options: [{name: "Observation", value: null}, {name: "Applicant", value: null}], description:'Applicant is continent of bowel and bladder, and independently toilets self, including transferring to toilet, wiping self and transferring from toilet, without using assistive devices. If alternative methods of urinary voiding or fecal evacuation are applicable, applicant independently completes entire routine.'},
  ];


  constructor(
    private referralService: ReferralService,
    private intakeOutcomeService: IntakeOutcomeService,
    private lsaformService: LsaFormService
  ) { }

  ngOnInit(): void {
    this.refId = this.referralService.getRefId();
    this.saveSelfCareResponse();
  }

  saveSelfCareResponse() {
    this.subscription1$ = this.lsaformService
    .informantQuestionsResponse(this.selfCareRequest)
    .subscribe((informantStatus) => {
      this.selfCareData = informantStatus;
      console.log("Informant Success Response", this.selfCareData);
    });
  this.subscriptions.push(this.subscription1$);
  }

  selfCareRequest(){

  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    console.log('referral-Lsa form pop up Unsubscribed');
  }
}
