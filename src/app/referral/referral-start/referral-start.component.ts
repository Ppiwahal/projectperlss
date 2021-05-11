import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ReferralService } from '../../core/services/referral/referral.service';
import { RefApplicantDetail } from '../../_shared/model/RefApplicantDetail';
import { ReferralFlowSeq } from '../../_shared/utility/ReferralFlowSeq';
import * as customValidation from '../../_shared/constants/validation.constants';
import { ContactComponent } from '../../core/widgets/contact/contact.component';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-referral-start',
  templateUrl: './referral-start.component.html',
  styleUrls: ['./referral-start.component.scss']
})
export class ReferralStartComponent implements OnInit {
  subscriptions$ = [];
  pageId: string = 'PERSR';

  referralForm: FormGroup;
  toastRef: any;
  isDevlopmentDisability = false;
  @Output() completedStart: EventEmitter<any> = new EventEmitter<any>();
  noneDisableSw: string = null;
  customValidation = customValidation;
  submitted = false;
  toastrNext = false;
  intDisableSw: any;
  dDisableSw: any;
  toastrDone = false;
  errorText = [];
  isSamePageNavigation: boolean;

  constructor(
    private fb: FormBuilder,
    private refService: ReferralService,
    private router: Router,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.referralForm = this.fb.group({
      intelDisableSw: [''] ,
      devDisableSw: [''],
      diagnosisTxt: ['', [Validators.required, Validators.maxLength(2000), Validators.pattern('^[a-zA-Z0-9\' \-]+$')]],
    });
    if(this.refService.getRefId() !== null && this.refService.getRefId() !== undefined){
      const loadData = this.refService.getRefApplicantDetails(this.refService.getRefId(), this.pageId)
      .subscribe(response => {
        let receivedData = response;
        console.log("receivedData" + receivedData);
        this.referralForm.patchValue({
          diagnosisTxt: JSON.stringify(receivedData.diagnosisTxt)
        });
        if(receivedData.intelDisableSw === 'Y'){
          this.referralForm.patchValue({
            intelDisableSw: true
          });
        }
        if(receivedData.devDisableSw === 'Y'){
          this.referralForm.patchValue({
            devDisableSw: true
          });
        }

        this.subscriptions$.push(loadData);
      });
    }
  }

  controlError(controlName: string): boolean {
    let control = this.referralForm.controls[controlName];
    let errorText = '';
    if (control.errors && (this.submitted || control.touched )) {
      if (control.errors.required) {
        errorText = customValidation.A1;
      }
      if (control.errors.pattern) {
        errorText = customValidation.A2;
      }
    }  
    this.errorText[controlName] = errorText;
    return errorText != '';
  }

  getData() {
    return this.referralForm.controls;
  }

  openContact() {
    this.dialog.open(ContactComponent, {
      width: 'auto',
      height: 'auto'
    });
  }

  groupClick() {
    this.groupError();
  }

  groupError() {

    let name = 'checkboxes';
    let controlNames = ['intelDisableSw', 'devDisableSw'];

    let touched = false;
    let checked = false;
    controlNames.forEach(cn => {
      let control = this.referralForm.controls[cn];
      touched = touched || control.touched;
      checked = checked || control.value;
    })
    this.controlError[name] = (!checked && (touched || this.submitted)) ? customValidation.A1 : null;
    return this.controlError[name] != null;
  }

  next(){
    this.isSamePageNavigation =  true;
    this.submitted = true;
    console.log(this.getData().diagnosisTxt);
    this.intDisableSw = this.getData().intelDisableSw.value ? 'Y' : 'N';
    this.dDisableSw = this.getData().devDisableSw.value ? 'Y' : 'N';
    if ( this.intDisableSw === 'N' && this.dDisableSw === 'N' ) {
      this.noneDisableSw = 'Y';
     }
     else {
      this.noneDisableSw = 'N';
    }
    if (this.referralForm.valid) {
      if (this.noneDisableSw === 'Y'){
        if (!this.toastrDone || !this.toastrNext) {
          this.toastRef = this.toastr.warning(this.customValidation.C4, '', {
            tapToDismiss: true,
            disableTimeOut: true,
            positionClass: 'toast-top-full-width' });
        }
      }
      if (this.toastrNext) {
        this.saveAndEmitStartReferral();
        if (this.toastrDone) {
        this.toastr.clear(this.toastRef.ToastId);
        }
      }
      this.toastrNext = true;

      if (this.noneDisableSw === 'N'){
        this.saveAndEmitStartReferral();
        this.toastrNext = false;
      }
     }
  }

  saveAndEmitStartReferral() {
    this.isSamePageNavigation =  true;
    const nextForm = 'PERAI';
    const refApplicantDetail = new RefApplicantDetail(this.dDisableSw, this.getData().diagnosisTxt.value,
                                                      this.intDisableSw, this.noneDisableSw, null, '0', null, 'PERSR');
    this.refService.setRefApplicantDetail(refApplicantDetail);
    this.completedStart.emit(ReferralFlowSeq[nextForm]);
     if (this.toastrNext) {
       this.toastrNext = false;
       this.toastrDone = true;
     }
  }

  ngOnDestroy() {
    if (this.subscriptions$ && this.subscriptions$.length > 0) {
      this.subscriptions$.forEach(subscription$ => subscription$.unsubscribe());
    }
  }

}
