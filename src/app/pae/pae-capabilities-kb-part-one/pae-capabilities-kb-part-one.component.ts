import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { HttpResponse } from '@angular/common/http';
import { Form, FormBuilder, FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as customValidation from '../../_shared/constants/validation.constants';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { CustomvalidationService } from '../../_shared/utility/customvalidation.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { PaeAppointment } from '../../_shared/model/PaeAppointment';
import { PaeAppointmentSearch } from '../../_shared/model/PaeAppointmentSearch';
import { PaeService } from '../../core/services/pae/pae.service';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-pae-capabilities-kb-part-one',
  templateUrl: './pae-capabilities-kb-part-one.component.html',
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class PaeCapabilitiesKbPartOneComponent implements OnInit {

  myForm: FormGroup;
  customValidation = customValidation;
  error: string;
  submitted: boolean = false;
  subscribed: Array<Subscription> = [];
  groupError = {};
  groupControlsTouched = {};
  groupNoneTouched = {};
  groupedControls = {
    transferNoneSw : ['needPhyRepResSw','neddPhyConResSw', 'mechLiftRepResSw', 'mechLiftConResSw'],
    mobilityNoneSw: ['sitPositionRepResSw','sitPositionConResSw','rollingRepResSw', 'rollingConResSw'],
    eatingNoneSw: ['needsFedRepResSw', 'needsFedConResSw','chokingRepResSw','chokingConResSw',
    'tubeFeedRepResSw','tubeFeedConResSw', 'needsWantsRepResSw','needsWantsConResSw'],
    toiletingNoneSw: ['incontDayRepResSw','incontDayConResSw','incontNightRepResSw',
    'incontNightConResSw','bowelBladdRepResSw','bowelBladdConResSw'],
    bathingNoneSw: ['combatBathRepResSw','combatBathConResSw','phyHelpBathRepResSw',
    'phyHelpBathConResSw','bathtubRepResSw','bathtubConResSw',
    'cueingRepResSw','cueingConResSw','riskSafetyRepResSw', 'riskSafetyConResSw']
  };


  constructor(
    fb: FormBuilder,
    private customValidationService: CustomvalidationService,
    private paeService: PaeService,
    private router: Router
  
  ) {
    this.myForm = fb.group(
      {
        bathingNoneSw: [null],
        bathtubConResSw: [null],
        bathtubRepResSw: [null],
        bowelBladdConResSw: [null],
        bowelBladdRepResSw: [null],
        chokingConResSw: [null],
        chokingRepResSw: [null],
        combatBathConResSw: [null],
        combatBathRepResSw: [null],
        combatGroomConResSw: [null],
        combatGroomRepResSw: [null],
        cueingConResSw: [null],
        cueingGroomConResSw: [null],
        cueingGroomRepResSw: [null],
        cueingRepResSw: [null],
        doesNotSupDreConResSw: [null],
        doesNotSupDreRepResSw: [null],
        dressingNoneSw: [null],
        eatingNoneSw: [null],
        exhNonCompBehConResSw: [null],
        exhNonCompBehRepResSw: [null],
        expressCommSw: [null],
        groomingNoneSw: [null],
        incontDayConResSw: [null],
        incontDayRepResSw: [null],
        incontNightConResSw: [null],
        incontNightRepResSw: [null],
        learningSw: [null],
        mechLiftConResSw: [null],
        mechLiftRepResSw: [null],
        mobilityNoneSw: [null],
        neddPhyConResSw: [null],
        needPhyRepResSw: [null],
        needsFedConResSw: [null],
        needsFedRepResSw: [null],
        needsWantsConResSw: [null],
        needsWantsRepResSw: [null],
        paeId: ["PAE1000008"],
        phyCharDiffConResSw: [null],
        phyCharDiffRepResSw: [null],
        phyHelpBathConResSw: [null],
        phyHelpBathRepResSw: [null],
        phyHelpClothConResSw: [null],
        phyHelpClothRepResSw: [null],
        phyHelpGroomConResSw: [null],
        phyHelpGroomRepResSw: [null],
        receptiveCommSw: [null],
        reqPageId: ["PAEIF"],
        riskSafetyConResSw: [null],
        riskSafetyRepResSw: [null],
        rollingConResSw: [null],
        rollingRepResSw: [null],
        sitPositionConResSw: [null],
        sitPositionRepResSw: [null],
        toiletingNoneSw: [null],
        transferNoneSw: [null],
        tubeFeedConResSw: [null],
        tubeFeedRepResSw: [null],
        unableToDressConResSw: [null],
        unableToDressRepResSw: [null],
        unableToPullOfConResSw: [null],
        unableToPullOfRepResSw: [null],
        washHandsConResSw: [null],
        washHandsRepResSw: [null]
      }
    )
  }
  ngOnInit() {
    
    let that = this;

    let currentKey = null;
    let currentItem = null;
    try {

      Object.keys(this.groupedControls).forEach(noneControlName => {

        currentKey = noneControlName;
        let checkControls = that.groupedControls[noneControlName];
        that.subscribed.push(that.myForm.controls[noneControlName].valueChanges.subscribe(val => {
          that.groupClick(noneControlName, null, val);
        }));

        checkControls.forEach(function (ctrlName) {
          currentItem = ctrlName;
          that.subscribed.push(that.myForm.controls[ctrlName].valueChanges.subscribe(val => {
            that.groupClick(noneControlName, ctrlName, val);
          }));
        });
      });
    } catch (e) {
      console.log("Init Error: currentKey = " + currentKey + "  currentItem = " + currentItem);
    }
  }

  ngOnDestroy() {
     this.subscribed.forEach(subscription => { subscription.unsubscribe(); });
   }

  groupClick(noneControlName: string, checkControlName: string, val: any) {

    try {

      let othersChecked = false;
      let noneControl = this.myForm.controls[noneControlName];
      let noneChecked = checkControlName == null ? val : !!noneControl.value;
      let othersTouched = this.groupControlsTouched[noneControlName] || false;

      this.groupedControls[noneControlName].forEach(ctrl => {
        let otherControl = this.myForm.controls[ctrl];
        othersChecked = othersChecked || (ctrl == checkControlName ? val : !!otherControl.value);
        othersTouched = !!otherControl.value || othersTouched;
      });

      let othersPreviouslyTouched = this.groupControlsTouched[noneControlName] || false;
      this.groupControlsTouched[noneControlName] = othersTouched;
      let groupNoneTouched= this.groupNoneTouched[noneControlName] || false;
      let error = null;
      console.log("NoneChecked:" + noneChecked + " othersChecked:" + othersChecked);
      if (noneChecked && othersChecked) {
        error = customValidation.A33;
      } else if (!noneChecked && !othersChecked && (!this.submitted || !othersPreviouslyTouched || !groupNoneTouched)) {
        error = customValidation.A1;
      }
      this.groupError[noneControlName] = error;

      if (noneChecked) {
        this.groupNoneTouched[noneControlName] = true;
      }

    } catch (e) {
      console.log("Error for: noneControlName: [" + noneControlName +
        "] checkControlName: [" + checkControlName + "] val: [" + val + "]");
    }
  }

  goNext() {
    this.markFormGroupTouched(this.myForm);
  }

  back() {
    this.markFormGroupTouched(this.myForm);
  }

  get getPaeActivitiesDailyLivingForm() {
    return this.myForm.controls;
  }

  savePaeActvitiesDailyLiving(navigate: boolean = false) {
    this.submitted = true;
    if (this.myForm.valid ) {
      // const request = this.myForm.value;
      // for (const key in request) {
      //   if (key.slice(-2) == "Sw" && request[key] == null) {
      //     request[key] = "N";
      //   }
      // }

      // let that = this;
      // this.paeService.saveStandardPaeActivitiesDailyLiving(request).then(
      //   function (response: HttpResponse<any>) {
      //     let x = response;
      //   }
      // ).catch(function (reason) {
      //   that.error = "Error:\n" + typeof reason == "string" ? reason : JSON.stringify(reason, null, "  ");
      // }).finally(function () {
        if (navigate) {
           this.router.navigate([this.paeService.getFunctionalAssessmentPath("partTwo")]);
        }
      // });
    }
  }

  save() {
    this.savePaeActvitiesDailyLiving();
  }

  next() {
    this.savePaeActvitiesDailyLiving(true);
  }

  markFormGroupTouched = (formGroup) => {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  };

}