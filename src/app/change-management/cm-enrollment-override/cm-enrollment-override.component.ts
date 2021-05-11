import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as customValidation from '../../_shared/constants/validation.constants';
import { CustomvalidationService } from '../../_shared/utility/customvalidation.service';
import { ChangeManagementService } from '../../core/services/change-management/change-management.service';
import { Subscription } from 'rxjs';
import { OverrideEnrollment } from 'src/app/_shared/model/change-management/overrideEnrollment';
import { PaeCommonService } from 'src/app/core/services/pae/pae-common/pae-common.service';
@Component({
  selector: 'app-cm-enrollment-override',
  templateUrl: './cm-enrollment-override.component.html',
  styleUrls: ['./cm-enrollment-override.component.scss']
})
export class CmEnrollmentOverrideComponent implements OnInit {
  chmTypeCd: string;
  displayPae: any;

  constructor(
    private customValidator: CustomvalidationService,
    private changeManagementService: ChangeManagementService,
    private router: Router,
    private paeCommonService: PaeCommonService,
    private fb: FormBuilder,
  ) {
  }

  customValidation = customValidation;
  personData: any;
  myForm: FormGroup;
  submitted = false;
  errorText: Array<string> = [];
  commentsCheckedBefore = false;
  subscribed: Array<Subscription> = [];

  searchMatches: Array<any> = null;

  ngOnInit(): void {
    this.displayPae = this.changeManagementService.displayPae$$.value;
    this.myForm = this.fb.group({
      bnftPlanCd: [''],
      chmTypeCd: [''],
      commentTxt: [''],
      entityCd: [''],
      hospiceDt: [''],
      paeId: [''],
      prsnId: [''],
      triggerCd: [''],
      triggerSourceCd: [''],
      userId: ['']

    });
    this.subscribed.push(
      this.changeManagementService.personData$.subscribe(personData => {
        this.personData = personData;
        this.fixControls();
      })
    );
  }

  lookupField(fieldSetting: any, datarow: any): string {
    const value = datarow[fieldSetting.field];
    if (fieldSetting.lookup) {
      return this.changeManagementService.getLookupValue(fieldSetting.lookup, value);
    } else {
      return this.changeManagementService.addDashes(value);
    }
  }

  getFormData() {
    return this.myForm.controls;
  }
  getControl(controlName: string) {
    return this.myForm.controls[controlName];
  }

  get f() {
    return this.myForm.controls;
  }

  fixControls() {

    const that = this;

    const timeout = setTimeout(function () {
      Object.keys(that.myForm.controls).forEach(controlName => {
        if (controlName != 'search') {
          const control = that.myForm.controls[controlName];
          if (control.errors) {
            const errorKeys = Object.keys(control.errors);
            errorKeys.forEach(key => {
              delete control.errors[key];
            });
          }
          control.setErrors(null);
          control.markAsUntouched();
          that.errorText[controlName] = null;
        }
      });
      clearTimeout(timeout);
    }, 100);
  }
  controlError(controlName: string): boolean {

    let error = null;
    try {
      const control = this.myForm.controls[controlName];
      if ((this.submitted || control.touched) && control.errors) {
        if (controlName.slice(-4) == 'Date' && control.errors.matDatepickerParse?.text && control.status == 'INVALID') {
          error = customValidation.BD;
        } else if (control.errors.dateInFuture) {
          error = customValidation.A5;
        } else if (control.errors.dateInPast) {
          error = customValidation.A15;
        } else if (control.errors.required) {
          error = customValidation.A1;
        }
      }
    } catch (e) {
      console.log('bad control name: ' + controlName);
    }

    this.errorText[controlName] = error;
    return error != null;

  }

  dateFilter(event: KeyboardEvent) {
    const control = event.currentTarget as HTMLInputElement;
    const key = event.key;
    const allowed = '0123456789/';
    if (key && key.length == 1 && allowed.indexOf(key) < 0) {
      event.preventDefault();
    }
  }

  save() {

    this.submitted = true;
    console.log(this.getFormData());
    if (this.myForm.valid) {
      const overrideEnrollment = new OverrideEnrollment(
        this.getFormData().bnftPlanCd.value,
        this.chmTypeCd = 'ORER',
        this.getFormData().commentTxt.value,
        this.getFormData().entityCd.value,

        this.getFormData().hospiceDt.value,
        this.personData.paeId,
        this.personData.prsnId,
        this.getFormData().triggerCd.value,
        this.getFormData().triggerSourceCd.value,
        this.getFormData().userId.value,

      );

      this.changeManagementService.saveOverrideEnrollment(overrideEnrollment).then((response) => {
        console.log('res', response);
        this.paeCommonService.setPaeId(this.personData.paeId);
        this.paeCommonService.setProgramName(this.personData.enrollmentGroup);
        this.paeCommonService.setTaskId(null);
        this.paeCommonService.setTaskQueue(null);
        //this.paeCommonService.setProgramName(res[0].enrollmentGroup);
        this.router.navigate(['ltss/enrollmentDetail']);
      });

    }
  }

 
}
