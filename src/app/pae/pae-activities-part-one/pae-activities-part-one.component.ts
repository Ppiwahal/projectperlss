import { Component, HostListener, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatRadioChange, MatRadioButton } from '@angular/material/radio';
import { CustomvalidationService } from '../../_shared/utility/customvalidation.service';
import * as customValidation from '../../_shared/constants/validation.constants';
import { HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { PaeService } from '../../core/services/pae/pae.service';
import { Pae } from '../../_shared/model/Pae';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Subscription } from 'rxjs/internal/Subscription';
import { LeavePagePopupComponent } from '../../leave-page-popup/leave-page-popup.component';
import { SavePopupComponent } from '../../../app/savePopup/savePopup.component';
import { PaeFlowSeq } from 'src/app/_shared/utility/PaeFlowSeq';
import { PaeCommonService } from './../../core/services/pae/pae-common/pae-common.service';
import { ComponentCanDeactivate } from 'src/app/core/helpers/pending-change.guard';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-pae-activities-part-one',
  templateUrl: './pae-activities-part-one.component.html',
  styleUrls: ['pae-activities-part-one.component.scss']
})
export class PaeActivitiesPartOneComponent implements OnInit, ComponentCanDeactivate {
  applicantName: any;
  myForm: FormGroup;
  customValidation = customValidation;
  submitted = false;
  error: string = null;
  paeId: string;
  subscribed: Array<Subscription> = [];
  showDependent: any = {};
  errorText: any = {};
  incontTypeError = false;
  nextPath: any;

  dependentControls: any = {
    walkWithoutHelpCd: [{
      values: ['UN', 'NE'],
      controls: [{
        name: 'wheelChairCapableCd',
        validators: [Validators.required]
      }]
    }],
    applcntIncontSw: [{
      values: ['Y'],
      controls: [{
        name: 'incontWithoutHelpCd',
        validators: [Validators.required]
      }]
    }],
    catheterOstomySw: [{
      values: ['Y'],
      controls: [{
        name: 'cathOstWhithoutHelpCd',
        validators: [Validators.required]
      }]
    }]
  };
  pageId: string;
  isSamePageNavigation: boolean;

  constructor(
    private fb: FormBuilder,
    private customValidator: CustomvalidationService,
    private router:Router,
    private paeCommonService: PaeCommonService,
    private paeService: PaeService,
    private dialog: MatDialog,
  ) { }

  get f() {
    return this.myForm.controls;
  }

  ngOnInit(): void {
    this.pageId = 'PPFAD';
    if (this.paeCommonService.getApplicantName() === null || this.paeCommonService.getApplicantName() === '' || this.paeCommonService.getApplicantName() === undefined){
		this.getApplicantName();
	} else {
		this.applicantName =  this.paeCommonService.getApplicantName();
	}
    this.myForm = this.fb.group({
      trnsfrWithoutHelpCd: [{ value: '', disabled: true }, [Validators.required]],
      walkWithoutHelpCd: [{ value: '', disabled: true }, [Validators.required]],
      eatWithoutHelpCd: [{ value: '', disabled: true }, [Validators.required]],
      wheelChairCapableCd: [{ value: '', disabled: true }],
      toiletWithoutHelpCd: [{ value: '', disabled: true }, [Validators.required]],
      applcntIncontSw: [{ value: '', disabled: true }, [Validators.required]],
      incontWithoutHelpCd: [{ value: '', disabled: true }],
      catheterOstomySw: [{ value: '', disabled: true }, [Validators.required]],
      cathOstWhithoutHelpCd: [{ value: '', disabled: true }],
      bowl: [{ value: '', disabled: true }],
      blad: [{ value: '', disabled: true }]
    });

    let that = this;

    Object.keys(this.myForm.controls).forEach(cn => {
      that.errorText[cn] == '';
    });

    this.paeId = this.paeCommonService.getPaeId() || 'PAE1000040';

    let currentKey: string;
    let currentControl;

    this.paeService.getPaeActivities(this.paeId).then(response => {
      if (response.body && !response.body.errorCode) {
        let data = response.body;
        data.bowl = data.incontTypeCd == 'BO' || data.incontTypeCd == 'BT';
        data.blad = data.incontTypeCd == 'BL' || data.incontTypeCd == 'BT';

        Object.keys(that.myForm.controls).forEach(controlName => {
          if (data.hasOwnProperty(controlName)) {
            let value = data[controlName];
            that.f[controlName].setValue(value);
          } else {
            console.log('bad controlName: ' + controlName);
          }
        });

        Object.keys(this.dependentControls).forEach(controlName => {
          that.parentClick(controlName);
        });

        that.checkIncontype();
      }
    }).catch(reason => {
      console.log('Error in getPaeActivities');
    }).finally(function () {
      Object.keys(that.myForm.controls).forEach(controlName => {
        that.f[controlName].enable();
      })
    });
  }

  getApplicantName(){
    this.paeService.getPaeApplicantInformation(this.paeCommonService.getPaeId(),this.pageId).then((response)=> {
      console.log("reponseforName"+JSON.stringify(response.body.firstName));
      this.applicantName =  response.body.firstName+" "+response.body.lastName;
	  this.paeCommonService.setApplicantName(this.applicantName);
    });
  }
  

  getControl(name: string) {
    return this.f[name];
  }

  parentClick(parentControl: string) {
    let config = this.dependentControls[parentControl];
    let controlName = '';
    let value = '';
    try {
      value = this.f[parentControl].value;
      console.log('parentClick .. ' + parentControl + ':' + value);
      let that = this;
      config.forEach(obj => {

        let match = false;
        obj.values.forEach(val => {
          match = match || (val == value);
        });
        obj.controls.forEach(obj => {
          controlName = obj.name;
          let control = that.getControl(controlName);
          if (match) {
            control.setValidators(obj.validators);
            control.markAsPristine();
            control.markAsUntouched();
          } else {
            control.clearValidators();
            control.setValue(null);
          }
        });
        that.showDependent[parentControl] = match;
      })
    } catch (e) {
      console.log('Parent Click error handling control: ' + controlName);
    }
  }

  next() {
    this.isSamePageNavigation =  true;
    this.save();
  }

  saveAndExit() {
    // if(this.myForm.valid){
      this.save(true);
    // }
  }

  controlError(controlName: string): boolean {

    let error = null;
    try {
      const control = this.myForm.controls[controlName];
      if ((this.submitted || control.touched) && control.errors) {
        if (control.errors.required) {
          error = customValidation.A1;
        }
      }
    } catch (e) {
      console.log('bad control name: ' + controlName);
    }

    this.errorText[controlName] = error;
    return error != null;

  }

  save(showPopup: boolean = false) {
    this.submitted = true;

    if (this.myForm.valid && !this.incontTypeError) {

      const request = JSON.parse(JSON.stringify(this.myForm.value));
      let map = { TT: 'BT', TF: 'BL', FT: 'BO', FF: null };
      request.incontTypeCd = map[(request.blad ? 'T' : 'F') + (request.bowl ? 'T' : 'F')];
      delete request.bowl;
      delete request.blad;

      request.paeId = this.paeId;
      request.reqPageId = 'PPFAD'
      console.log(JSON.stringify(request, null, ''));

      const that = this;
      this.paeService.savePaeActivities(request).then(
        (response: HttpResponse<any>) => {
          const nextPage = response.headers.get('next');
          console.log(nextPage);
          that.nextPath = PaeFlowSeq[nextPage];
          console.log(that.nextPath);
          if(showPopup){
            const dialogConfig = new MatDialogConfig();
            dialogConfig.data = { route: 'ltss/pae' };
           // dialogConfig.data = { route: 'ltss/pae' , nextRoute: '/ltss/pae/paeStart/' + this.nextPath };
            dialogConfig.panelClass = 'exp_popup';
            dialogConfig.width = '648px';
            dialogConfig.height = '360px';  
            this.dialog.open(SavePopupComponent, dialogConfig );
          }else {
          that.router.navigate(['/ltss/pae/paeStart/' + that.nextPath]);
          }
        }
      ).catch(function (reason) {
        console.log('savePaeActivitiesError: ' + JSON.stringify(request, null, ''));
      });
    }
    else {
      const invalid = [];
      const controls = this.myForm.controls;
      for (const name in controls) {
        if (controls[name].invalid) {
          invalid.push(name + ': invalid');
        }
      }
      this.error = invalid.join(' ,');
      console.log(JSON.stringify(this.error, null, '    '));
    }
  }


  checkIncontype() {
    let touched = this.f.blad.touched || this.f.bowl.touched;
    let atLeastOneClicked = this.f.blad.value || this.f.bowl.value;
    let error = '';
    if (this.showDependent['applcntIncontSw'] &&
      (this.submitted || touched) && !atLeastOneClicked) {
      error = customValidation.A1;
    }
    this.errorText['incontTypeCd'] = error;
    this.incontTypeError = error !== '';
  }

  getFormData() {
    return this.myForm.controls;
  }


  openLeavePagePopup() {
    this.isSamePageNavigation =  true;
    this.paeService.getChidPageNavigation(this.paeId, this.pageId).subscribe(response => {
      const backPath = PaeFlowSeq[response.prevPageId];
      const path = '/ltss/pae/paeStart/' + backPath;
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = { route: path };
      dialogConfig.panelClass = 'exp_popup';
      dialogConfig.width = '648px';
      dialogConfig.height = '360px';
      this.dialog.open(LeavePagePopupComponent, dialogConfig);
    }, err => {
      console.log(err);
    });
  }

  // openSavedPopup() {
  //   const dialogConfig = new MatDialogConfig();
  //   dialogConfig.data = { route: '/ltss/pae/paeStart/activitiesPartTwo' };
  //   dialogConfig.panelClass = 'exp_popup';
  //   dialogConfig.width = '648px';
  //   dialogConfig.height = '360px';
  //   this.dialog.open(SavePopupComponent, dialogConfig);
  // }

  ngOnDestroy() {
    this.subscribed.forEach(subscription => { subscription.unsubscribe(); });
  }
  @HostListener('window:beforeunload')
   canDeactivate(): Observable<boolean> | boolean {
     console.log(this.myForm) 
    return this.isSamePageNavigation ? true : !this.myForm.dirty;
   }

   resetForm(){
     this.myForm.reset();
   }
}
