import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as customValidation from '../../_shared/constants/validation.constants';
import { CustomvalidationService } from '../../_shared/utility/customvalidation.service';
import { ChangeManagementService } from '../../core/services/change-management/change-management.service';
import { Subscription } from 'rxjs';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { UploadDocumentsPopupComponent } from '../../rightnav/upload-documents-popup/upload-documents-popup.component';
import { RightnavToggleService } from 'src/app/_shared/services/rightnav-toggle.service';
import { LevelOfNeeds } from 'src/app/_shared/model/change-management/levelOfNeeds';
import { PaeCommonService } from 'src/app/core/services/pae/pae-common/pae-common.service';
@Component({
  selector: 'app-cm-level-of-need',
  templateUrl: './cm-level-of-need.component.html',
  styleUrls: ['./cm-level-of-need.component.scss']
})
export class CmLevelOfNeedComponent implements OnInit {

  customValidation = customValidation;
  errorText: any = {};
  personData: any;
  submitted = false;
  myForm: FormGroup;
  disenrollmentReasons: Array<any>;
  disenrollmentType: Array<any>;
  subscribed: Array<Subscription> = [];
  prsnId: any;
  personId: string;
  ismedUploaded = false;
  paeId: any;
  selectedMenu: any;
  chmTypeCd: string;
  levelOfNeeds = [{code: 'LOW', value:'Low', activateSW:'Y'},
  {code: 'LTM', value:'Low to Moderate', activateSW:'Y'},
  {code: 'MOD', value:'Moderate', activateSW:'Y'},
  {code: 'HIG', value:'High', activateSW:'Y'}];

  constructor(
    private customValidator: CustomvalidationService,
    private changeManagementService: ChangeManagementService,
    private fb: FormBuilder,
    private router: Router,
    private paeCommonService: PaeCommonService,
  ) {
    this.disenrollmentType = this.changeManagementService.data.disenrollmentType;
  }


  ngOnInit(): void {
    this.selectedMenu = this.paeCommonService.getProgramName();
    this.paeId = this.paeCommonService.getPaeId(),
      this.myForm = this.fb.group({
        chmTypeCd: [''],
        commentTxt: [''],
        lvlOfNeedCd: [''],
        paeId: [''],
        personId: [''],

      });
    this.subscribed.push(
      this.changeManagementService.personData$.subscribe(personData => {
        this.personData = personData;
        this.fixControls();
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

  disenrollmentTypeChange() {
    const value = this.myForm.controls.disenrollmentType.value;
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
    console.log("this.personData.paeId,", this.personData)
    if (this.myForm.valid) {
      const levelOfNeeds = new LevelOfNeeds(
        this.chmTypeCd = 'LVON',
        this.getFormData().commentTxt.value,
        this.getFormData().lvlOfNeedCd.value,
        this.personData.paeId,
        this.personData.personId
        );

      this.changeManagementService.SaveLevelofneed(levelOfNeeds).then((response) => {
          console.log('res', response);
          this.router.navigate(['/ltss/changeManagement/dashboard']);
        });

    }
  }
  uploadDocument(){

  }
}
