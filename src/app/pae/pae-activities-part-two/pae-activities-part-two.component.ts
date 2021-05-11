import { Component, HostListener, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, Form, AbstractControl } from '@angular/forms';
import { CustomvalidationService } from 'src/app/_shared/utility/customvalidation.service';
import * as customValidation from '../../_shared/constants/validation.constants';
import { HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { PaeService } from '../../core/services/pae/pae.service';
import { PaeFlowSeq } from 'src/app/_shared/utility/PaeFlowSeq';
import { PaeCommonService } from './../../core/services/pae/pae-common/pae-common.service';
import { Observable, Subscription } from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { LeavePagePopupComponent } from 'src/app/leave-page-popup/leave-page-popup.component';
import { SavePopupComponent } from 'src/app/savePopup/savePopup.component';
import { ComponentCanDeactivate } from 'src/app/core/helpers/pending-change.guard';
import { ActivityDailyPartTwo } from 'src/app/_shared/model/ActivityDailyLivingPart-2';


@Component({
  selector: 'app-pae-activities-part-two',
  templateUrl: './pae-activities-part-two.component.html',
  styleUrls: ['./pae-activities-part-two.component.scss']
})

export class PaeActivitiesPartTwoComponent implements OnInit, ComponentCanDeactivate {
  id: any;
  data: any;
  medicationTypeCd: any;
  selfAdmDesc: any;
  selfAdmSw: any;
  showDeleteButton = false;
  makeReadOnly = false;
  showEditButton = false;
  showSaveButton = true;
  showSaveButtonPT = true;
  showDeleteButtonPT: boolean = false;
  showEditButtonPT: boolean = false;
  makeReadOnlyPT:boolean = false;
  showDeleteButtonED: boolean = false;
  showEditButtonED: boolean = false;
  makeReadOnlyED:boolean = false;
  showSaveButtonED = true;
  showDeleteButtonIN: boolean = false;
  showEditButtonIN: boolean = false;
  makeReadOnlyIN: boolean = false;
  showSaveButtonIN = true;
  showDeleteButtonTP: boolean = false ;
  showEditButtonTP: boolean = false;
  makeReadOnlyTP: boolean = false;
  showSaveButtonTP  = true;
  showDeleteButtonINJ: boolean = false;
  showEditButtonINJ: boolean = false;
  makeReadOnlyINJ: boolean = false;
  showSaveButtonINJ = true;
  showDeleteButtonMVT: boolean = false;
  showEditButtonMVT: boolean = false;
  makeReadOnlyMVT: boolean = false;
  showSaveButtonMVT = true;
  subscriptions: Subscription[] = [];
  isDeletedSw: any;

  constructor(
    private fb: FormBuilder,
    private customValidator: CustomvalidationService,
    private router: Router,
	   private paeCommonService: PaeCommonService,
    private paeService: PaeService,
    private dialog: MatDialog
  ) { }

  get f() {
    return this.myForm.controls;

  }

  applicantName: any;
  myForm: FormGroup;
  customValidation = customValidation;
  submitted = false;
  error: string = null;
  exLengths: any = {};
  showRemove = false;
  paeId: string;
  backSubscription$: Subscription;
  subscriptions$: any;
  subscription2$: Subscription;
  pageId: any;
  indexedControlErrors = Array<any>();
  indexedControlTouched = Array<any>();
  behaviorState = Array<any>();
  medState: any = {};
  xpandStatus = false;
  xpandStatus1 = false;
  xpandStatus2 = false;
  xpandStatus3 = false;
  xpandStatus4 = false;
  xpandStatus5 = false;
  part1Fields = ['trnsfrWithoutHelpCd', 'walkWithoutHelpCd', 'eatWithoutHelpCd',
    'wheelChairCapableCd', 'toiletWithoutHelpCd', 'applcntIncontSw',
    'incontWithoutHelpCd', 'catheterOstomySw', 'cathOstWhithoutHelpCd', 'incontTypeCd'];
  part1Data: any = {};

  errorText: any = {};
  topControls = ['orientationPrsnPlaceCd', 'communicateWantsCd', 'behProblemCd', 'followInstructionsCd', 'selfAdmMedicationCd'];

  dependentControls: any = {
    PT_adminSw: [{
      values: ['N'],
      controls: [{
        name: 'PT_adminDesc',
        validators: [Validators.required]
      }]
    }],
    ED_adminSw: [{
      values: ['N'],
      controls: [{
        name: 'ED_adminDesc',
        validators: [Validators.required]
      }]
    }],
    IN_adminSw: [{
      values: ['N'],
      controls: [{
        name: 'IN_adminDesc',
        validators: [Validators.required]
      }]
    }],
    TP_adminSw: [{
      values: ['N'],
      controls: [{
        name: 'TP_adminDesc',
        validators: [Validators.required]
      }]
    }],
    INJ_adminSw: [{
      values: ['N'],
      controls: [{
        name: 'INJ_adminDesc',
        validators: [Validators.required]
      }]
    }],
    MVT_adminSw: [{
      values: ['N'],
      controls: [{
        name: 'MVT_adminDesc',
        validators: [Validators.required]
      }]
    }],
    behProblemCd: [{
      values: ['AL', 'US', 'UN'],
      controls: []
    }],

    selfAdmMedicationCd: [{
      values: ['US', 'UN', 'NE'],
      controls: []
    }],
  };
  showDependent: any = {};

  expandoFields: Array<string> = ['PT', 'ED', 'IN', 'TP', 'INJ', 'MVT'];
  nextPath: any;
  noAccordionData = false;
  isSamePageNavigation: boolean;
  ActivityDailyForm: FormGroup;
  reqPageId: string;
  saveResponse: any;
  ngOnInit(): void {
    this.pageId = 'PPFAO';

    if (this.paeCommonService.getApplicantName() === null || this.paeCommonService.getApplicantName() === '' || this.paeCommonService.getApplicantName() === undefined){
		this.getApplicantName();
	} else {
		this.applicantName =  this.paeCommonService.getApplicantName();
	}

    //this.saveAllAccordians();
    // this.deleteAccordion(type);

    this.ActivityDailyForm = this.fb.group({
      medicationTypeCd: [''],
      paeId: [''],
      selfAdmDesc: [''],
      selfAdmSw: [''],

  });

    this.myForm = this.fb.group({
      orientationPrsnPlaceCd: [{ value: '', disabled: true }, [Validators.required]],
      communicateWantsCd: [{ value: '', disabled: true }, [Validators.required]],
      behProblemCd: [{ value: '', disabled: true }, [Validators.required]],
      followInstructionsCd: [{ value: '', disabled: true }, [Validators.required]],
      selfAdmMedicationCd: [{ value: '', disabled: true }, [Validators.required]],
      PT_adminSw: [{ value: '', disabled: true }],
      PT_adminDesc: [{ value: '', disabled: true }],
      ED_adminSw: [{ value: '', disabled: true }],
      ED_adminDesc: [{ value: '', disabled: true }],
      IN_adminSw: [{ value: '', disabled: true }],
      IN_adminDesc: [{ value: '', disabled: true }],
      TP_adminSw: [{ value: '', disabled: true }],
      TP_adminDesc: [{ value: '', disabled: true }],
      INJ_adminSw: [{ value: '', disabled: true }],
      INJ_adminDesc: [{ value: '', disabled: true }],
      MVT_adminSw: [{ value: '', disabled: true }],
      MVT_adminDesc: [{ value: '', disabled: true }],
      behaviors: this.fb.array([])
    });

    const that = this;

    Object.keys(this.myForm.controls).forEach(cn => {
      that.errorText[cn] == '';
    });

    this.paeId = this.paeCommonService.getPaeId() || 'PAE1000040';
    this.getPaeActivities();
    }

  getApplicantName(){
    this.paeService.getPaeApplicantInformation(this.paeCommonService.getPaeId(), this.pageId).then((response) => {
      console.log('reponseforName' + JSON.stringify(response.body.firstName));
      this.applicantName =  response.body.firstName + ' ' + response.body.lastName;
	     this.paeCommonService.setApplicantName(this.applicantName);
    });
  }

  getPaeActivities() {
    const that = this;
    this.paeService.getPaeActivities(this.paeId).then(response => {

        if (response.body && !response.body.errorCode) {
          const data = response.body;
          this.saveResponse = response.body.paeActivitiesMedicationDtlVO;
          console.log('part2:' + JSON.stringify(data, null, ' '));

          that.part1Fields.forEach(x => { that.part1Data[x] = data[x]; });

          that.topControls.forEach(controlName => {
            const value = data[controlName];
            console.log('setValue:' + value + ' for ' + controlName);
            that.f[controlName].setValue(value);
          });

          const behaveData = data.paeActivitiesBehavrlDtlVO;
          const behaviors = that.getBehaviors();
          let count = 0;
          for (let i = 0; i < behaveData.length; i++) {
            const item = behaveData[i];

            this.behaviorState.push({
              id: item.id,
              deleteSw: item.deleteSw
            });

            if (!item.deleteSw) {
              count++;
            }

            const behavior = this.fb.group({
              behType: [item.behType, [Validators.required]],
              behIntrvntn: [item.behIntrvntn, [Validators.required]],
            });
            behaviors.push(behavior);
            that.indexedControlErrors.push({});
            that.indexedControlTouched.push({});
          }
          that.showRemove = count > 1;

          const medData = data.paeActivitiesMedicationDtlVO;
          for (let i = 0; i < medData.length; i++) {
            const thisMed = medData[i];
            const type = thisMed.medicationTypeCd;
            const control1 = that.myForm.controls[type + '_adminSw'];
            if (control1) {
              control1.setValue(thisMed.selfAdmSw);
              const control2 = that.myForm.controls[type + '_adminDesc'];
              control2.setValue(thisMed.selfAdmDesc);
              that.medState[thisMed] = { id: thisMed.id  };
            }
          }

          Object.keys(that.dependentControls).forEach(controlName => {
            that.parentClick(controlName);
          });
        }
      }).catch(reason => {
        console.log('Error in getPaeActivities');
      }).finally(function() {
        Object.keys(that.myForm.controls).forEach(controlName => {
          if (controlName != 'behaviors') {
            that.f[controlName].enable();
          }
        });
      });
  }

  save(showPopup: boolean = false) {

    this.submitted = true;
    const that = this;
    if (this.myForm.valid) {

      const formData = this.myForm.value;
      console.log(formData);
      const request: any = {};
      that.topControls.forEach(controlName => {
        request[controlName] = formData[controlName];
      });

      const thisBehaviors = Array<any>();
      const behaviorValues = formData.behaviors;

      that.part1Fields.forEach(x => { request[x] = that.part1Data[x]; });

      for (let i = 0; i < that.behaviorState.length; i++) {
        const behavior = that.behaviorState[i];

        const deleteSw = behavior.deleteSw;
        const intervention = deleteSw ? null : behaviorValues[i].behIntrvntn;
        const type = deleteSw ? null :behaviorValues[i].behType;

        thisBehaviors.push({
          id: behavior.id,
          behIntrvntn: intervention,
          behType: type,
          deleteSw,
          paeId: that.paeId
        });
      }
      request.paeActivitiesBehavrlDtlVO = thisBehaviors;

      const thisMeds = [];
      for (let i = 0; i < that.expandoFields.length; i++) {
        const type = that.expandoFields[i];
        thisMeds.push({
          id: (that.medState[type] ? that.medState[type].id : null),
          medicationTypeCd: type,
          paeId: that.paeId,
          selfAdmDesc: that.myForm.controls[type + '_adminDesc'].value,
          selfAdmSw:  that.myForm.controls[type + '_adminSw'].value
        });
      }

      request.paeActivitiesMedicationDtlVO = thisMeds;

      request.paeId = this.paeId;
      request.reqPageId = 'PPFAO';
      console.log(JSON.stringify(request, null, '  '));

      this.paeService.savePaeActivities(request).then(
        function(response: HttpResponse<any>) {
          const x = response;
          const nextPage = response.headers.get('next');
          console.log(nextPage);
          that.nextPath = PaeFlowSeq[nextPage];
          console.log(that.nextPath);
          if (showPopup){
            const dialogConfig = new MatDialogConfig();
            dialogConfig.data = { route: 'ltss/pae' };
           // dialogConfig.data = { route: 'ltss/pae' , nextRoute: '/ltss/pae/paeStart/' + this.nextPath };
            dialogConfig.panelClass = 'exp_popup';
            dialogConfig.width = '648px';
            dialogConfig.height = '360px';
            that.dialog.open(SavePopupComponent, dialogConfig );
          }else {
            that.router.navigate(['/ltss/pae/paeStart/' + that.nextPath]);
          }
        }
      ).catch(function(reason) {
        console.log('error: ' + reason);
      });
    }
  }

  parentClick(parentControl: string) {
    const config = this.dependentControls[parentControl];
    const value = this.f[parentControl].value;
    console.log('parentClick .. ' + parentControl + ':' + value);
    let controlName = '';
    try {
      const that = this;
      config.forEach(obj => {
        let match = false;
        obj.values.forEach(val => {
          match = match || (val == value);
        });


        obj.controls.forEach(obj => {
          controlName = obj.name;
          const control = that.getControl(controlName);
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
        if (parentControl === 'selfAdmMedicationCd' && value === 'AL')
        {
           this.myForm.get('PT_adminDesc').clearValidators();
           this.myForm.get('ED_adminDesc').clearValidators();
           this.myForm.get('IN_adminDesc').clearValidators();
           this.myForm.get('TP_adminDesc').clearValidators();
           this.myForm.get('INJ_adminDesc').clearValidators();
           this.myForm.get('MVT_adminDesc').clearValidators();
           this.myForm.get('PT_adminSw').clearValidators();
           this.myForm.get('ED_adminSw').clearValidators();
           this.myForm.get('IN_adminSw').clearValidators();
           this.myForm.get('TP_adminSw').clearValidators();
           this.myForm.get('INJ_adminSw').clearValidators();
           this.myForm.get('MVT_adminSw').clearValidators();
           this.myForm.get('PT_adminSw').updateValueAndValidity();
           this.myForm.get('ED_adminSw').updateValueAndValidity();
           this.myForm.get('IN_adminSw').updateValueAndValidity();
           this.myForm.get('TP_adminSw').updateValueAndValidity();
           this.myForm.get('INJ_adminSw').updateValueAndValidity();
           this.myForm.get('MVT_adminSw').updateValueAndValidity();
        }
        else if (parentControl === 'selfAdmMedicationCd' && value !== 'AL')
        {
          this.myForm.get('PT_adminSw').setValidators(Validators.required);
          this.myForm.get('ED_adminSw').setValidators(Validators.required);
          this.myForm.get('IN_adminSw').setValidators(Validators.required);
          this.myForm.get('TP_adminSw').setValidators(Validators.required);
          this.myForm.get('INJ_adminSw').setValidators(Validators.required);
          this.myForm.get('MVT_adminSw').setValidators(Validators.required);
          this.myForm.get('PT_adminSw').updateValueAndValidity();
          this.myForm.get('ED_adminSw').updateValueAndValidity();
          this.myForm.get('IN_adminSw').updateValueAndValidity();
          this.myForm.get('TP_adminSw').updateValueAndValidity();
          this.myForm.get('INJ_adminSw').updateValueAndValidity();
          this.myForm.get('MVT_adminSw').updateValueAndValidity();
        }
      });
    } catch (e) {
      console.log('Parent Click error handling control: ' + controlName);
    }
  }

  getLength(controlName) {
    const control = this.f[controlName];
    if (control.value) {
      return control.value.length;
    }
    return 0;
  }

  getControl(name: string) {
    return this.f[name];
  }

  showChild(name: string) {
    const control = this.myForm.controls[name];
    const isSelected = control.value == 'N';
    return isSelected;
  }



  getBehaviors(): FormArray {
    return this.myForm.controls.behaviors as FormArray;
  }

  removeBehavior(index) {
    const behaviors = this.getBehaviors();
    if (this.behaviorState[index].id) {
      this.behaviorState[index].deleteSw = true;
    } else {
      behaviors.removeAt(index);
      this.behaviorState.splice(index, 1);
      this.indexedControlErrors.splice(index, 1);
      this.indexedControlTouched.splice(index, 1);
    }
    let count = 0;
    for (let i = 0; i < this.behaviorState.length; i++) {
      if (!this.behaviorState[i].deleteSw.value) {
        count++;
      }
    }
    this.showRemove = count > 1;
  }

  addBehavior() {
    const behaviors = this.getBehaviors();
    const behavior = this.fb.group({
      behType: ['', [Validators.required]],
      behIntrvntn: ['', [Validators.required]],
    });
    behaviors.push(behavior);
    this.behaviorState.push({
      id: null,
      paeId: this.paeId,
      deleteSw: false
    });
    this.showRemove = behaviors.length > 1;
    this.indexedControlErrors.push({});
    this.indexedControlTouched.push({});
  }

  // parentClickfor(parentControl: string)
  // {
  //   let value = this.f[parentControl].value;
  //   if(value !== 'AL')
  //   {
  //     this.noAccordionData = true;
  //   }
  //   else{
  //     this.noAccordionData = false;
  //   }
  // }

  next() {
    this.isSamePageNavigation =  true;
    this.save();
  }

  back(){
    this.isSamePageNavigation =  true;
    this.paeService.navigateToChildPreviousPage(this.pageId);
  }

  saveAndExit() {
    this.save(true);
  }

  updateIndexed(event: Event) {
    this.handleIndexed(event, false);
  }

  validateIndexed(event: Event) {
    this.handleIndexed(event, true);
  }

  handleIndexed(event: Event, touched: boolean) {

    const control = event.target as HTMLInputElement;
    const index = control.getAttribute('index');
    const name = control.getAttribute('formControlName');

    if (touched) {
      this.indexedControlTouched[index][name] = true;
    }

    this.indexedControlErrors[index][name] = control.value == '' ? customValidation.A1 : null;

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

  showIndexedError(name, index) {
    if (typeof this.indexedControlErrors[name] == 'undefined') { return false; }
    return this.indexedControlErrors[name][index] && (!this.indexedControlTouched[name] || !this.submitted);
  }

  indexedControlError(name: string, index: string) {
    const nameErrors = this.indexedControlErrors[name] || false;
    let result = false;
    if (nameErrors) {
      result = nameErrors[index] || false;
    }
    return result;
  }

  getFormData() {
    return this.ActivityDailyForm.controls;
  }
  @HostListener('window:beforeunload')
   canDeactivate(): Observable<boolean> | boolean {
     console.log(this.myForm);
     return this.isSamePageNavigation ? true : !this.myForm.dirty;
   }

   resetForm(){
     this.myForm.reset();
   }


   edit(selectedAccordinName){
     const that = this;
     if (selectedAccordinName === 'PT'){
      that.myForm.controls.PT_adminDesc.enable();
      that.myForm.controls.PT_adminSw.enable();
       this.showSaveButtonPT = true;
       this.showEditButtonPT = false;

     }
     if (selectedAccordinName === 'ED') {
      that.myForm.controls.ED_adminDesc.enable();
      that.myForm.controls.ED_adminSw.enable();
      that.showEditButtonED = false;
      this.showSaveButtonED = true;
    }
     if (selectedAccordinName === 'IN') {
      that.myForm.controls.IN_adminDesc.enable();
      that.myForm.controls.IN_adminSw.enable();
      that.showEditButtonIN = false;
      this.showSaveButtonIN = true;
    }
     if (selectedAccordinName === 'TP') {
      that.myForm.controls.TP_adminDesc.enable();
      that.myForm.controls.TP_adminSw.enable();
      that.showEditButtonTP = false;
      this.showSaveButtonTP = true;
    }
     if (selectedAccordinName === 'INJ') {
      that.myForm.controls.INJ_adminDesc.enable();
      that.myForm.controls.INJ_adminSw.enable();
      that.showEditButtonINJ = false;
      this.showSaveButtonINJ = true;
    }
     if (selectedAccordinName === 'MVT') {
      that.myForm.controls.MVT_adminDesc.enable();
      that.myForm.controls.MVT_adminSw.enable();
      that.showEditButtonMVT = false;
      this.showSaveButtonMVT = true;
    }
   }

  async submit(selectedAccordinName) {
    const that = this;
    const paeActivitiesMedicationDtlVO = [];
    switch(selectedAccordinName) {
      case 'PT':
        for (let i = 0; i < that.expandoFields.length; i++) {
          const type = that.expandoFields[i];
          if (that.expandoFields[i] === 'PT'){
            paeActivitiesMedicationDtlVO.push({
              id: (that.medState[type] ? that.medState[type].id : null),
              medicationTypeCd: type,
              paeId: that.paeId,
              selfAdmDesc: that.myForm.controls.PT_adminDesc.value,
              selfAdmSw:  that.myForm.controls.PT_adminSw.value
            });
          }
        }
        break;
      case 'ED':
        for (let i = 0; i < that.expandoFields.length; i++) {
          const type = that.expandoFields[i];
          if (that.expandoFields[i] === 'ED'){
            paeActivitiesMedicationDtlVO.push({
              id: (that.medState[type] ? that.medState[type].id : null),
              medicationTypeCd: type,
              paeId: that.paeId,
              selfAdmDesc: that.myForm.controls.ED_adminDesc.value,
              selfAdmSw:  that.myForm.controls.ED_adminSw.value
            });
          }
        }
        break;
        case 'IN':
          for (let i = 0; i < that.expandoFields.length; i++) {
            const type = that.expandoFields[i];
            if (that.expandoFields[i] === 'IN'){
              paeActivitiesMedicationDtlVO.push({
                id: (that.medState[type] ? that.medState[type].id : null),
                medicationTypeCd: type,
                paeId: that.paeId,
                selfAdmDesc: that.myForm.controls.IN_adminDesc.value,
                selfAdmSw:  that.myForm.controls.IN_adminSw.value
              });
            }
          }
          break;
          case 'TP':
            for (let i = 0; i < that.expandoFields.length; i++) {
              const type = that.expandoFields[i];
              if (that.expandoFields[i] === 'TP'){
                paeActivitiesMedicationDtlVO.push({
                  id: (that.medState[type] ? that.medState[type].id : null),
                  medicationTypeCd: type,
                  paeId: that.paeId,
                  selfAdmDesc: that.myForm.controls.TP_adminDesc.value,
                  selfAdmSw:  that.myForm.controls.TP_adminSw.value
                });
              }
            }
            break;
            case 'INJ':
              for (let i = 0; i < that.expandoFields.length; i++) {
                const type = that.expandoFields[i];
                if (that.expandoFields[i] === 'INJ'){
                  paeActivitiesMedicationDtlVO.push({
                    id: (that.medState[type] ? that.medState[type].id : null),
                    medicationTypeCd: type,
                    paeId: that.paeId,
                    selfAdmDesc: that.myForm.controls.INJ_adminDesc.value,
                    selfAdmSw:  that.myForm.controls.INJ_adminSw.value
                  });
                }
              }
              break;
              case 'MVT':
                for (let i = 0; i < that.expandoFields.length; i++) {
                  const type = that.expandoFields[i];
                  if (that.expandoFields[i] === 'MVT'){
                    paeActivitiesMedicationDtlVO.push({
                      id: (that.medState[type] ? that.medState[type].id : null),
                      medicationTypeCd: type,
                      paeId: that.paeId,
                      selfAdmDesc: that.myForm.controls.MVT_adminDesc.value,
                      selfAdmSw:  that.myForm.controls.MVT_adminSw.value
                    });
                  }
                }
                break;
    }

    const activityDailyPartTwo = new ActivityDailyPartTwo(
        '',
        '',
        '',
       '',
       '',
        '',
        '',
        '',
        '',
       '',
       [],
        paeActivitiesMedicationDtlVO,
        this.paeId,
        this.reqPageId = 'PPFAO',
        '',
       '',
        '',
        '',
        ''
      );
    that.paeService.savePaeActivitiesPart2(activityDailyPartTwo).then((res) => {
        console.log('res', res);

        if (selectedAccordinName === 'PT') {
          that.showDeleteButtonPT = true;
          that.myForm.controls.PT_adminSw.disable();
          that.myForm.controls.PT_adminDesc.disable();
          that.showEditButtonPT = true;
          this.showSaveButtonPT = false;
        }
        if (selectedAccordinName === 'ED') {
          that.myForm.controls.ED_adminSw.disable();
          that.myForm.controls.ED_adminDesc.disable();
          that.showDeleteButtonED = true;
          that.showEditButtonED = true;
          this.showSaveButtonED = false;
        }
        if (selectedAccordinName === 'IN') {
          that.myForm.controls.IN_adminSw.disable();
          that.myForm.controls.IN_adminDesc.disable();
          that.showDeleteButtonIN = true;
          that.showEditButtonIN = true;
          this.showSaveButtonIN = false;
        }
        if (selectedAccordinName === 'TP') {
          that.myForm.controls.TP_adminSw.disable();
          that.myForm.controls.TP_adminDesc.disable();
          that.showDeleteButtonTP = true;
          that.showEditButtonTP = true;
          this.showSaveButtonTP = false;
        }
        if (selectedAccordinName === 'INJ') {
          that.myForm.controls.INJ_adminSw.disable();
          that.myForm.controls.INJ_adminDesc.disable();
          that.showDeleteButtonINJ = true;
          that.showEditButtonINJ = true;
          this.showSaveButtonINJ = false;
        }
        if (selectedAccordinName === 'MVT') {
          that.myForm.controls.MVT_adminSw.disable();
          that.myForm.controls.MVT_adminDesc.disable();
          that.showDeleteButtonMVT = true;
          that.showEditButtonMVT = true;
          this.showSaveButtonMVT = false;
        }
        that.paeService.getPaeActivities(that.paeId).then(response => {
            if (response.body && !response.body.errorCode) {
              const data = response.body;
              that.saveResponse = response.body.paeActivitiesMedicationDtlVO;
            }
          });
      });
  }

   deleteAccordion(selectedAccordinName){
     const that = this;
     for (let i = 0 ; i < this.saveResponse.length; i++) {
       if (this.saveResponse[i].medicationTypeCd === selectedAccordinName) {
         this.id = this.saveResponse[i].id;
         this.isDeletedSw = this.saveResponse[i].isDeletedSw;
         this.medicationTypeCd = this.saveResponse[i].medicationTypeCd;
         this.paeId = this.saveResponse[i].paeId;
         this.selfAdmDesc = this.saveResponse[i].selfAdmDesc;
         this.selfAdmSw = this.saveResponse[i].selfAdmSw;
       }
     }
     console.log('selectedRecordPaedId', selectedAccordinName);
     this.subscription2$ = this.paeService
       .deletePaeActivityDailyPartTwo(this.id, this.isDeletedSw, this.medicationTypeCd, this.paeId, this.selfAdmDesc, this.selfAdmSw)
       .subscribe((response) => {
         console.log("response===", response);
         console.log('this.medicationTypeCd beofre ', this.medicationTypeCd);
         if (selectedAccordinName === 'PT') {
           that.myForm.controls.PT_adminDesc.setValue(null);
           that.myForm.controls.PT_adminSw.setValue(null);
         }
         if (selectedAccordinName === 'ED') {
           that.myForm.controls.ED_adminDesc.setValue(null);
           that.myForm.controls.ED_adminSw.setValue(null);
         }
         if (selectedAccordinName === 'IN') {
           that.myForm.controls.IN_adminDesc.setValue(null);
           that.myForm.controls.IN_adminSw.setValue(null);
         }
         if (selectedAccordinName === 'TP') {
           that.myForm.controls.TP_adminDesc.setValue(null);
           that.myForm.controls.TP_adminSw.setValue(null);
         }
         if (selectedAccordinName === 'INJ') {
           that.myForm.controls.INJ_adminDesc.setValue(null);
           that.myForm.controls.INJ_adminSw.setValue(null);
         }
         if (selectedAccordinName === 'MVT') {
           that.myForm.controls.MVT_adminDesc.setValue(null);
           that.myForm.controls.MVT_adminSw.setValue(null);
         }
         console.log('Response', response);
       });
     this.subscriptions.push(this.subscription2$);
}

}
