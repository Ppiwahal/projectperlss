
import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as customValidation from '../../_shared/constants/validation.constants';
import { CustomvalidationService } from '../../_shared/utility/customvalidation.service';
import { ChangeManagementService } from '../../core/services/change-management/change-management.service';
import { Subscription } from 'rxjs';
import { PaeCommonService } from 'src/app/core/services/pae/pae-common/pae-common.service';
import { DisEnrollment } from 'src/app/_shared/model/change-management/disEnrollment';

@Component({
  selector: 'cm-disenrollment',
  templateUrl: './cm-disenrollment.component.html',
  styleUrls: ['./cm-disenrollment.component.scss']
})

export class CmDisenrollmentComponent implements OnInit {

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
  error: string = null;
  disEnrollmentReasonCd = [{code: 'MDE', value:'Member Deceased', activateSW:'Y'},
{code: 'HOS', value:'Election of Hospice Services in a NF', activateSW:'Y'},
{code: 'NFD', value:'NF discharge (Group 1 only)', activateSW:'Y'},
{code: 'DEN', value:'Denied PAE and no longer meets LOC (NF LOC or At Risk)', activateSW:'Y'},
{code: 'COS', value:'Cannot safetly meet needs within Cost Neutrality/Expenditure Cap, refusal of alternative services, including NF or ICF/IID as applicable', activateSW:'Y'},
{code: 'SAF', value:'Cannot safely meet needs (HCBS only)', activateSW:'Y'},
{code: 'NTC', value:'Member is not receiving TennCare reimbursed Long Term Services and Supports', activateSW:'Y'},
{code: 'NON', value:'Non-payment of patient liability and member cannot transfer to another MCO', activateSW:'Y'},
{code: 'STA', value:'Moved out of State', activateSW:'Y'},
{code: 'DCS', value:'DCS Custody', activateSW:'Y'},
{code: 'COT', value:'Cost exceeds Institution', activateSW:'Y'},
{code: 'LNK', value:'Link', activateSW:'Y'},
{code: 'INE', value:'Ineligible for medicaid', activateSW:'Y'},
{code: 'SNS', value:'Services not needed', activateSW:'Y'},
{code: 'SRM', value:'Safety risk med/behavior', activateSW:'Y'},
{code: 'SRA', value:'Safety risk at home', activateSW:'Y'},
{code: 'NFI', value:'Not following ISP', activateSW:'Y'},
{code: 'NSA', value:'No safety approval', activateSW:'Y'},
{code: 'TEN', value:'Transfer exceed 90', activateSW:'Y'},
{code: 'CEW', value:'Cost exceeding waiver limit', activateSW:'Y'},
{code: 'NOS', value:'I don’t want/ need long-term care anymore.', activateSW:'Y'},
{code: 'PAY', value:'I don’t want to pay part of the cost of my long- term care (called patient liability)', activateSW:'Y'},
{code: 'HOM', value:'I don’t want my home or things I own (my estate) to be used to pay TennCare back for my long-term care after my death. Services I may have to pay back include nursing home care and home care (or HCBS). It’s called “estate recovery,” and it’s part of federal law.', activateSW:'Y'},
{code: 'HNF', value:'I don’t want home and community-based (HCB)  services. I want care in a NF or ICF/ IID.', activateSW:'Y'},
{code: 'MED', value:'[insert child’s name] doesn’t want/ need Medicaid, including Katie Beckett Part A services.', activateSW:'Y'},
{code: 'PRE', value:'I don’t want to pay premiums for [insert child’s name] to be in Katie Beckett Part A.', activateSW:'Y'},
{code: 'OTH', value:'Other', activateSW:'Y'},
{code: 'DRT', value:'Disenrolled due to transition', activateSW:'Y'}];



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
        avgCostOfCareAmt: [''],
        comments: ['', [Validators.required]],
        disenrRsnCd: ['', [Validators.required]],
        disenrTypeCd: ['', [Validators.required]],
        enrEndDt: ['', [Validators.required]],
        hospiceEffDt: ['', [Validators.required]],
        paeId: [''],
        prsnId: ['']

      });
    this.subscribed.push(
      this.changeManagementService.personData$.subscribe(personData => {
        this.personData = personData;
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
  getData() {
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
    const request = JSON.parse(JSON.stringify(this.myForm.value));
    console.log(this.getFormData());
    if (this.myForm.valid) {
      const disEnrollment = new DisEnrollment(
        this.getFormData().avgCostOfCareAmt.value,
        this.chmTypeCd = 'DSER',
        this.getFormData().comments.value,
        this.getFormData().disenrRsnCd.value,
        this.getFormData().disenrTypeCd.value,

        this.getFormData().enrEndDt.value,
        this.getFormData().hospiceEffDt.value,
        this.personData.paeId,
        this.personData.prsnId,
      );
      this.changeManagementService.saveDisenrollment(disEnrollment).then((response) => {
        console.log('res', response);
        this.router.navigate(['/ltss/changeManagement/dashboard']);
      }).catch(function (reason) {
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
    };

  }
}
