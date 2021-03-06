import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as customValidation from '../../_shared/constants/validation.constants';
import { CustomvalidationService } from '../../_shared/utility/customvalidation.service';
import { ChangeManagementService } from '../../core/services/change-management/change-management.service';
import { Subscription } from 'rxjs';
import { AddServiceDischargeTransition } from 'src/app/_shared/model/change-management/addServiceDischargeTransition';

@Component({
  selector: 'app-cm-add-service-dates',
  templateUrl: './cm-add-service-dates.component.html',
  styleUrls: ['./cm-add-service-dates.component.scss']
})
export class CmAddServiceDatesComponent implements OnInit {
  chmTypeCode: string;
  chmTypeCd: string;

  constructor(
    private customValidator: CustomvalidationService,
    private changeManagementService: ChangeManagementService,
    private fb: FormBuilder,
    private router: Router
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
    this.myForm = this.fb.group({
       actualDt:  [''],
       adminTaskResponse:  [''],
       chmId:  [''],
       chmTypeCd:  [''],
       paeId:  [''],
       refId:  ['']

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
      // this.changeManagementService.savePaeDisenrollment(this.paeId, "yadda");
      const addServiceDischargeTransition = new AddServiceDischargeTransition(
        this.getFormData().actualDt.value,
        this.getFormData().adminTaskResponse.value,
        this.getFormData().chmId.value,
        this.chmTypeCd = 'ASDT',
        this.personData.paeId,
        this.getFormData().refId.value
      );

      this.changeManagementService.saveaddServiceDischargeTransition(addServiceDischargeTransition).then((response) => {
        console.log('res', response);
        this.router.navigate(['/ltss/changeManagement/dashboard']);
      });

    }
  }

}
