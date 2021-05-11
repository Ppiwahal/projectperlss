
import { Component, OnInit } from '@angular/core';
import { MatRadioChange } from '@angular/material/radio';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReferralService } from '../../core/services/referral/referral.service';
import { Router } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import * as customValidation from '../../_shared/constants/validation.constants';
import { CustomvalidationService } from '../../_shared/utility/customvalidation.service';
import { PaeService } from '../../core/services/pae/pae.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { LeavePagePopupComponent } from '../../leave-page-popup/leave-page-popup.component';
import { SavePopupComponent } from '../../../app/savePopup/savePopup.component';

@Component({
  selector: 'app-pae-capabilites-kb-part-two',
  templateUrl: './pae-capabilities-kb-part-two.component.html'
})

export class PaeCapabilitiesKbPartTwoComponent implements OnInit {

  customValidation = customValidation;
  event: string;
  myForm: FormGroup;
  groomingNoneValid: boolean = true;
  dressingNoneValid: boolean = true;
  nextClicked: boolean;
  submitted: boolean = false;
  subscribed: Array<Subscription> = [];
  groupError = {};
  groupControlsTouched = {};
  groupNoneTouched = {};
  groupedControls = {
    dressingNone: ["dressingRC", "dressingRR"],
    groomingNone: ['combativeCR', 'combativeRR', 'washingRR', 'washingRC', 'cueingRR', 'cueingRC', 'groomingRC', 'groomingRR']
  };
 
  constructor(
    private fb: FormBuilder,
    private refService: ReferralService,
    private router: Router,
    private customValidator: CustomvalidationService,
    private dialog: MatDialog,
    private paeService: PaeService
  ) { }

  ngOnInit(): void {
    this.myForm = this.fb.group({

      combativeRR: [''],
      combativeCR: [''],
      washingRR: [''],
      washingRC: [''],
      groomingRR: [''],
      groomingRC: [''],
      groomingNone: [''],
      dressingRR: [''],
      dressingRC: [''],
      cueingRR: [''],
      cueingRC: [''],
      dressingNone: [''],
      learning: ['', [Validators.required]],
      expressiveCommunication: ['', [Validators.required]],
      receptiveCommunication: ['', [Validators.required]]
    });


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
  getFormData() {
    return this.myForm.controls;
  }

  public onNextClick(): void {
    this.nextClicked = true;
  }

  public onSaveAndExitClick(): void {
    this.nextClicked = false;
  }

  controlError(controlName: string) : Boolean {
    let control = this.getControl(controlName);
    let value = control.value;
    return (!value && (this.submitted || control.touched));
  }

  onSubmit(): void {
    let isValid = true;
    this.submitted = true;
    for (const key in this.groupedControls) {
      this.groupClick(key, null, null);
      isValid = isValid && (this.groupError[key] == null);
    }
    if (isValid && this.myForm.valid) {
      if (this.nextClicked) {
        this.save(this.showPopup)
      }
      else {
        this.leavePageRoute = '/ltss/pae/paeStart/functionalAssessment'
        this.save(this.leavePagePopup);
      }
    }
  }

  leavePageRoute: string;

  showPopup() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = { route: this.nextClicked ? '/ltss/pae' : '/ltss/pae/paeStart/functionalAssessment' };
    dialogConfig.panelClass = 'exp_popup';
    dialogConfig.width = '648px';
    dialogConfig.height = '360px';
    this.dialog.open(SavePopupComponent, dialogConfig);
  }

  leavePagePopup() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = { route: this.leavePageRoute };
    dialogConfig.panelClass = 'exp_popup';
    dialogConfig.width = '648px';
    dialogConfig.height = '360px';
    this.dialog.open(LeavePagePopupComponent, dialogConfig);
  }

  save(onExit: Function = null) {
    // const request = this.myForm.value;
    // for (const key in request) {
    //   if (key.slice(-2) == "Sw" && request[key] == null) {
    //     request[key] = "N";
    //   }
    // }
    // let that = this;
    // this.paeService.savePaeActivities(request).then(
    //   function (response: HttpResponse<any>) {
    //     let x = response;
        if (onExit) {
          onExit();
        }
    //   }
    // ).catch(function (reason) {
    //   console.log("Error:\n" + typeof reason == "string" ? reason : JSON.stringify(reason, null, "  "));
    // });
  }
  
  getControl(name: string): AbstractControl {
    return this.myForm.get(name);
  }

  back() {
    const previousForm = 'PRAPIF';
    this.leavePageRoute =  '/ltss/pae/paeStart/capabilitiesKbPartOne';
    if (this.myForm.dirty) {
      
      this.leavePagePopup();
    }
    else this.router.navigate([this.leavePageRoute]);
  }

}
