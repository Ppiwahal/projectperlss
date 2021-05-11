import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { ReferralDashboardService } from 'src/app/core/services/referral/referral-dashboard/referral-dashboard.service';
import { ReferralService } from 'src/app/core/services/referral/referral.service';
import { ReferralFlowSeq } from '../../_shared/utility/ReferralFlowSeq';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { ComponentCanDeactivate } from 'src/app/core/helpers/pending-change.guard';
import { Observable } from 'rxjs';
import { ReferralStartComponent } from '../referral-start/referral-start.component';
import { RefApplicantComponent } from '../ref-applicant/ref-applicant.component';
import { RefContactComponent } from '../ref-contact/ref-contact.component';
import { ReferralSchoolWorkComponent } from '../referral-school-work/referral-school-work.component';
import { RefCareAndSupportComponent } from '../ref-care-and-support/ref-care-and-support.component';
import { ReferralSubmitComponent } from '../referral-submit/referral-submit.component';


@Component({
 selector: 'app-new-referral',
  templateUrl: './referral-stepper.component.html',
  styleUrls: ['./referral-stepper.component.scss']
})
export class ReferralStepperComponent implements OnInit, ComponentCanDeactivate{
  @ViewChild('stepper') stepper: MatStepper;

  @ViewChild(ReferralStartComponent) refStartComponent : ReferralStartComponent;
  @ViewChild(RefApplicantComponent) refApplicantComponent : RefApplicantComponent;
  @ViewChild(RefContactComponent) refContactComponent : RefContactComponent;
  @ViewChild(ReferralSchoolWorkComponent) refSchWorkComponent : ReferralSchoolWorkComponent;
  @ViewChild(RefCareAndSupportComponent) refCareSupportComponent : RefCareAndSupportComponent;
  @ViewChild(ReferralSubmitComponent) refSubmitComponent : ReferralSubmitComponent;

  isLinear = true;
  currentForm: any;
  initializedStepper = false;
  refId: string;
  referralPage: any;
  nextPage: any;


  constructor(
    private refDashboardService: ReferralDashboardService,
    private refService: ReferralService
  ) { }

  ngOnInit() {
    this.referralRedirect();
    const element = document.getElementById('pM');
    if (element !== null) {
        element.scrollIntoView(true);
      }
  }


  selectedIndex(currentStepperForm) {
    console.log("selectdndex", currentStepperForm)
    this.currentForm = currentStepperForm;
    this.stepper.selected.completed = true;

    this.stepper.linear = false;
    this.stepper.selectedIndex = this.currentForm;
    setTimeout(() => {
      this.stepper.linear = true;
    });
  }

  referralRedirect() {
    let that = this;
    this.refId = this.refService.getRefId();
    if (this.refId !== null && this.refId !== undefined) {
      this.refDashboardService.getReferralPage(this.refId).then((response) => {
        const nextPage = response.body['nextPage'];
        this.currentForm = ReferralFlowSeq[nextPage];
        this.initializedStepper = true;
      });
    }

    else {
      this.currentForm = 0
      this.initializedStepper = true;
      this.selectedIndex(this.currentForm);
    }
    
  }
  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    // return true;
    if(this.stepper.selectedIndex === 0){
      return this.refStartComponent.isSamePageNavigation ? true : !this.refStartComponent.referralForm.dirty;
    }
    else if(this.stepper.selectedIndex === 1){
      return this.refApplicantComponent.isSamePageNavigation ? true : !this.refApplicantComponent.refApplicantForm.dirty;
    }
    else if(this.stepper.selectedIndex === 2){
      return this.refContactComponent.isSamePageNavigation ? true : !this.refContactComponent.refContactForm.dirty;
    }
    else if(this.stepper.selectedIndex === 3){
      return this.refSchWorkComponent.isSamePageNavigation ? true : !this.refSchWorkComponent.schAndWorkForm.dirty;
    }
    else if(this.stepper.selectedIndex === 4){
      return this.refCareSupportComponent.isSamePageNavigation ? true : !this.refCareSupportComponent.refCareAndSuppportForm.dirty;
    }
    else if(this.stepper.selectedIndex === 5){
      return this.refSubmitComponent.isSamePageNavigation ? true : !this.refSubmitComponent.refSubmissionForm.dirty;
    }
  //   if (!this.isKbProgram) {
  //     return this.otherComponent.isSamePageNavigation ? true : !this.otherComponent.isFormDirty();
  //   } else {
  //     return this.kbComponent.isSamePageNavigation ? true : !this.kbComponent.sectionType.dirty;
  //   }
  }
  resetForm() {
    if(this.stepper.selectedIndex === 0){
      this.refStartComponent.referralForm.reset();
    }
    else if(this.stepper.selectedIndex === 1){
      this.refApplicantComponent.refApplicantForm.reset();
    }
    else if(this.stepper.selectedIndex === 2){
      this.refContactComponent.refContactForm.reset();
    }
    else if(this.stepper.selectedIndex === 3){
      this.refSchWorkComponent.schAndWorkForm.reset();
    }
    else if(this.stepper.selectedIndex === 4){
      this.refCareSupportComponent.refCareAndSuppportForm.reset();
    }
    else if(this.stepper.selectedIndex === 5){
      this.refSubmitComponent.refSubmissionForm.reset();
    }
    // if (!this.isKbProgram) {
    //   this.otherComponent.resetForms();
    // } else {
    //   this.kbComponent.sectionType.reset();
    // }
  }

}
