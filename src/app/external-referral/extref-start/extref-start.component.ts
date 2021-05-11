import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RefApplicantDetail } from '../../_shared/model/RefApplicantDetail';
import { ReferralFlowSeq } from '../../_shared/utility/ReferralFlowSeq';
import * as customValidation from '../../_shared/constants/validation.constants';
import { ExternalreferralService } from '../services/externalreferral.service';
import { ToastrService } from 'ngx-toastr';
import { MatHorizontalStepper } from '@angular/material/stepper';
import { ContactComponent } from '../../core/widgets/contact/contact.component';
import { MatDialog } from '@angular/material/dialog';
import { ExtrefApplicantInformationComponent } from '../extref-applicant-information/extref-applicant-information.component';

@Component({
  selector: 'app-extref-start',
  templateUrl: './extref-start.component.html',
  styleUrls: ['./extref-start.component.scss']
})
export class ExtrefStartComponent implements OnInit {
  @Input() stepper: MatHorizontalStepper;
  referralForm: FormGroup;
  isDevlopmentDisability = false;
  @Output() completedStart: EventEmitter<any> = new EventEmitter<any>();
  noneDisableSw: string = null;
  submitted = false;
  customValidation = customValidation;
  isFormValid = false;
  //errorText = [];
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private extRefService: ExternalreferralService,
    private dialog: MatDialog,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.referralForm = this.fb.group({
      intelDisableSw: [''],
      devDisableSw: [''],
      diagnosisTxt: ['',Validators.required],
    });
    this.extRefService.stepReady(this.referralForm, "one");
  }

  getData() {
    return this.referralForm.controls;
  }
  next() {
  this.submitted = true;
    let intDisableSw = null;
    let dDisableSw = null;
    if (this.referralForm.valid) {
      intDisableSw = this.getData().intelDisableSw.value ? 'Y' : 'N';
      dDisableSw = this.getData().devDisableSw.value ? 'Y' : 'N';
      if (intDisableSw !== 'Y' && dDisableSw !== 'Y') {
        this.noneDisableSw = 'Y';
      }
      else {
        this.noneDisableSw = 'N';
      }
      if (this.noneDisableSw === 'Y' && this.isFormValid === false) {
        this.isFormValid = true;
        this.toastr.warning(this.customValidation.C4, '', {
          tapToDismiss: true,
          disableTimeOut: true,
          positionClass: 'toast-top-full-width'
        });
      } else {
 
        const refApplicantDetail = new RefApplicantDetail(dDisableSw, this.getData().diagnosisTxt.value,
        intDisableSw, this.noneDisableSw, null, '0', null, 'PERSR');
        this.extRefService.startInfoData$$.next(refApplicantDetail);
        this.completedStart.emit(ReferralFlowSeq['PERAI']);
        this.stepper.next();
      }

    } else {
      // this.toastr.error("List the diagnosis (If none, Please enter 'None')")
     }

  }
  openContact() {
    this.dialog.open(ContactComponent, {
      width: 'auto',
      height: 'auto'
    });
  }
 
  
 onDisablitySelect(_event) {
    if (this.getData().intelDisableSw.value || this.getData().devDisableSw.value) {
      this.isDevlopmentDisability = true;
      this.getData().diagnosisTxt.setValidators([Validators.required, Validators.maxLength(2000), Validators.pattern(/^[a-zA-Z0-9_ ]*$/)]);
      this.getData().diagnosisTxt.updateValueAndValidity();
    } else {
      this.isFormValid = false;
      this.isDevlopmentDisability = false;
      this.getData().diagnosisTxt.clearValidators();
      this.getData().diagnosisTxt.updateValueAndValidity();
    }
  }

}
