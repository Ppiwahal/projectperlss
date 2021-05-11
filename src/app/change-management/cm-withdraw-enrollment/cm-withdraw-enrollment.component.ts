import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as customValidation from '../../_shared/constants/validation.constants';
import { CustomvalidationService } from '../../_shared/utility/customvalidation.service';
import { ChangeManagementService } from '../../core/services/change-management/change-management.service';
import { Subscription } from 'rxjs';
import { PaeCommonService } from 'src/app/core/services/pae/pae-common/pae-common.service';
import { WithdrawEnrollment } from 'src/app/_shared/model/change-management/withdrawEnrollment';

@Component({
  selector: 'app-cm-withdraw-enrollment',
  templateUrl: './cm-withdraw-enrollment.component.html',
  styleUrls: ['./cm-withdraw-enrollment.component.scss']
})
export class CmWithdrawEnrollmentComponent implements OnInit {
  customValidation = customValidation;
  errorText: any = {};
  paeId: string;
  submitted = false;
  myForm: FormGroup;
  disenrollmentReasons: Array<any>;
  disenrollmentType: Array<any>;
  subscribed: Array<Subscription> = [];
  personData: any;
  selectedMenu: any;
  reqPageId: string;
  changMgntCode: any;
  chmTypeCd: string;

  constructor(
    private customValidator: CustomvalidationService,
    private changeManagementService: ChangeManagementService,
    private fb: FormBuilder, private router: Router,
    private paeCommonService: PaeCommonService,
  ) {


    this.disenrollmentType = this.changeManagementService.data.disenrollmentType;

  }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      chmTypeCd:[''],
      commentTxt: [''],
      reqPageId: [''],
      withdrawRsnCd: [''],
    });
    this.subscribed.push(
      this.changeManagementService.personData$.subscribe(personData => {
        this.personData = personData;
        this.selectedMenu = this.personData.enrollmentGroup;
        console.log('personData', personData, this.selectedMenu);
      })
    );


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

    const timeout = setTimeout(function() {
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

    this.errorText[controlName + 'Error'] = error;
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
      const withdrawEnrollment = new WithdrawEnrollment(
        this.chmTypeCd = 'WAER',
        this.getFormData().commentTxt.value,
        this.reqPageId = 'PCMWE',
        this.getFormData().withdrawRsnCd.value,
        );
      this.changeManagementService.saveWithdrawnEnrRqst(withdrawEnrollment).then((response) => {
        console.log('res', response, this.personData);
        this.router.navigate(['/ltss/changeManagement/dashboard']);
      });
    }
  }
}
