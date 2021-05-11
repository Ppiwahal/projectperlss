import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReferralService } from '../../core/services/referral/referral.service';
import { MatRadioChange } from '@angular/material/radio';
import { RefCareAndSupport } from '../../_shared/model/RefCareAndSupport';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SavePopupComponent } from '../../savePopup/savePopup.component';
import { HttpResponse } from '@angular/common/http';
import { ReferralFlowSeq } from '../../_shared/utility/ReferralFlowSeq';
import * as customValidation from '../../_shared/constants/validation.constants';
import { CustomvalidationService } from '../../_shared/utility/customvalidation.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-ref-care-and-support',
  templateUrl: './ref-care-and-support.component.html',
  styleUrls: ['./ref-care-and-support.component.scss'],
})
export class RefCareAndSupportComponent implements OnInit {
  @Output() completedCareAndSupport: EventEmitter<any> = new EventEmitter<any>();
  pageId: string = 'PERCS';
  customValidation = customValidation;
  submitted = false;
  refCareAndSuppportForm: FormGroup;
  primaryCareGiverSW = false;
  age: number;
  notPrimaryCareGiverSW = false;
  abuseNeglectedSW = false;
  physicalHurtSW = false;
  nextPath: string;
  event: string;
  minDate: Date;
  maxDate: Date;
  month: number;
  birthdayString: string = null;
  onPrimaryCareGiverNone = false;
  primaryCheckboxSelectedCount = 0;
  needHelpCheckboxSelectedCount = 0;
  behaviourChangeCheckboxSelectedCount = 0;
  behaviourChangeSelected = false;
  primaryCareGiverDescriptionSelected = false;
  needHelpSelected = false;
  needHelpNoneSelected = false;
  behaviourChangeNone = false;
  enableNext = true;
  showSpinner = false;
  isSamePageNavigation: boolean;
  toastrBack = false;
  toastRef: any;
  constructor(
    private fb: FormBuilder,
    private refService: ReferralService,
    private dialog: MatDialog,
    private customValidator: CustomvalidationService,
    private toastr: ToastrService
  ) {}
  getFormData() {
    return this.refCareAndSuppportForm.controls;
  }

  ngOnInit(): void {
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 119, 0, 1);
    this.maxDate = new Date();
    this.refCareAndSuppportForm = this.fb.group({
      abuseNeglectedSw: ['', [Validators.required]],
      adltProtectSrvcSw: [''],
      anotherCareGiverSw: ['', [Validators.required]],
      anotherPlaceSw: [''],
      age: [''],
      behNoneSw: [null],
      behSrvcsSw: [''],
      cargvrBirthDt: [''],
      cargvrDiedSw: [''],
      cargvrName: [''],
      cargvrReltshpCd: [''],
      childProtectSrvcSw: [''],
      cleaningDressSw: [''],
      criminalJusticeSw: [''],
      eatingSw: [''],
      goodDcsnSafeSw: [''],
      knowFamilySw: [''],
      medicinesSw: [''],
      mentalHlthCrisisSw: [''],
      noneOfAboveSw: [''],
      prsnHelpNoneSw: [''],
      phyclHurtBehSw: ['', [Validators.required]],
      primaryCargvrSw: ['', [Validators.required]],
      cargvrDisableSw: [''],
      cargvrPoorHlthSw: [''],
      psychiatricHospitalSw: [''],
      residentialTrtmntSw: [''],
      tellingOthrsSw: [''],
      transferBedChairSw: [''],
      understandInstructionSw: [''],
      walkWheelchairSw: [''],
      toiletingSw: [''],
    });
    if(this.refService.getRefId() !== null && this.refService.getRefId() !== undefined){
      this.dataPatchup();
    }
  }

  dataPatchup(){
    const loadData = this.refService.getRefCareSuprtDetails(this.refService.getRefId(), this.pageId)
    .then(response => {
      let receivedData = response;
      console.log("receivedData" + JSON.stringify(receivedData));

      this.refCareAndSuppportForm.patchValue(receivedData.body);
    });
  }

  saveRefarralCareAndSupport(showPopup?: boolean) {
    this.isSamePageNavigation =  true;
    const refId = this.refService.getRefId();
    const personId = this.refService.getPersonId();
    const refCareAndSupport = new RefCareAndSupport(
      this.getFormData().abuseNeglectedSw.value,
      this.sendingYorN(this.getFormData().adltProtectSrvcSw.value),
      this.getFormData().anotherCareGiverSw.value,
      this.getFormData().anotherPlaceSw.value,
      this.age,
      this.sendingYorN(this.getFormData().behNoneSw.value),
      this.sendingYorN(this.getFormData().behSrvcsSw.value),
      this.birthdayString,
      this.getFormData().cargvrDiedSw.value,
      this.getFormData().cargvrName.value,
      this.getFormData().cargvrReltshpCd.value,
      this.sendingYorN(this.getFormData().childProtectSrvcSw.value),
      this.sendingYorN(this.getFormData().cleaningDressSw.value),
      null,
      this.sendingYorN(this.getFormData().criminalJusticeSw.value),
      this.sendingYorN(this.getFormData().eatingSw.value),
      this.sendingYorN(this.getFormData().goodDcsnSafeSw.value),
      this.sendingYorN(this.getFormData().knowFamilySw.value),
      this.sendingYorN(this.getFormData().medicinesSw.value),
      this.sendingYorN(this.getFormData().mentalHlthCrisisSw.value),
      this.sendingYorN(this.getFormData().noneOfAboveSw.value),
      this.sendingYorN(this.getFormData().prsnHelpNoneSw.value),
      this.getFormData().phyclHurtBehSw.value,
      this.getFormData().primaryCargvrSw.value,
      this.sendingYorN(this.getFormData().cargvrDisableSw.value),
      this.sendingYorN(this.getFormData().cargvrPoorHlthSw.value),
      this.sendingYorN(this.getFormData().psychiatricHospitalSw.value),
      this.sendingYorN(this.getFormData().residentialTrtmntSw.value),
      this.sendingYorN(this.getFormData().tellingOthrsSw.value),
      personId,
      this.sendingYorN(this.getFormData().transferBedChairSw.value),
      this.sendingYorN(this.getFormData().understandInstructionSw.value),
      this.sendingYorN(this.getFormData().walkWheelchairSw.value),
      'PERCS',
      refId
    );

    const response = this.refService.saveRefCareAndSupport(refCareAndSupport);
    let nextForm = 'PERSU';
    const that = this;
    response.then(function(response: HttpResponse<any>) {
		that.enableNext = true;
		that.showSpinner = false;
      if (showPopup) {
        that.showPopup();
      } else {
        nextForm = response.headers.get('next');
        response = response.body;
        that.nextPath = ReferralFlowSeq[nextForm];
        if (that.event === 'Next') {
          that.completedCareAndSupport.emit(ReferralFlowSeq[nextForm]);
        }
        const element = document.getElementById('pM');
        if (element !== null) {
            element.scrollIntoView(true);
          }
      }
    });
  }

  saveAndExit() {
    this.event = 'SaveAndExit';
    this.submitted = true;
    this.saveRefarralCareAndSupport(true);
  }

  showPopup() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = { route: 'ltss/referral' };
    dialogConfig.panelClass = 'exp_popup';
    dialogConfig.width = '600px';
    this.dialog.open(SavePopupComponent, dialogConfig);
  }

  next() {
    this.isSamePageNavigation =  true;
    this.event = 'Next';
    this.submitted = true;
    if (this.refCareAndSuppportForm.valid) {
      this.enableNext = false;
      this.showSpinner = true;
      this.saveRefarralCareAndSupport();
    }
  }

  back() {

    console.log(this.refCareAndSuppportForm);
    const previousForm = 'PERSW';
    if (this.refCareAndSuppportForm.touched) {
      this.toastRef = this.toastr.warning(this.customValidation.C1, '', {
        tapToDismiss: true,
        disableTimeOut: true,
        positionClass: 'toast-top-full-width',
      });
      if (this.toastrBack) {
        this.toastr.clear(this.toastRef.ToastId);

        this.completedCareAndSupport.emit(ReferralFlowSeq[previousForm]);
        this.refCareAndSuppportForm.reset();
        this.toastrBack = false;
      }
      this.toastrBack = true;
    }
    if (!this.refCareAndSuppportForm.touched) {
      this.completedCareAndSupport.emit(ReferralFlowSeq[previousForm]);
      this.toastrBack = false;
    }
  }

  sendingYorN(input: boolean) {
    if (input === true) {
      return 'Y';
    } else if (input === false) {
      return 'N';
    }
  }

  calculateAge(event) {
    if(this.getFormData().cargvrBirthDt.valid){
      const today = new Date();
      const birthDate = new Date(event.value);
      this.birthdayString = birthDate.toJSON();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      this.age = age;
      this.month = (12 - Math.abs(m));
      if (this.month === 12) {
        this.month = 0;
      }
    }
  }

  onPrimaryCareGiverChange(mrChange: MatRadioChange) {
    if (mrChange.value === 'Y') {
      this.primaryCareGiverSW = true;
      this.notPrimaryCareGiverSW = false;
      this.setValidationsCareGiver();
      this.removeValidationsCareGiverDied();
      this.getFormData()
    } else if (mrChange.value === 'N') {
      this.notPrimaryCareGiverSW = true;
      this.primaryCareGiverSW = false;
      this.removeValidationsCareGiver();
      this.setValidationsCareGiverDied();
      this.age = null;
    }
  }

  onAbuseNeglectedChange(mrChange: MatRadioChange) {
    if (mrChange.value === 'Y') {
      this.abuseNeglectedSW = true;
      this.getFormData().anotherPlaceSw.setValidators([Validators.required]);
      this.getFormData().anotherPlaceSw.updateValueAndValidity();
    } else if (mrChange.value === 'N') {
      this.abuseNeglectedSW = false;
      this.getFormData().anotherPlaceSw.setValue(null);
      this.getFormData().anotherPlaceSw.markAsUntouched();
      this.getFormData().anotherPlaceSw.clearValidators();
      this.getFormData().anotherPlaceSw.updateValueAndValidity();
    }
  }

  onPhysicalHurtBehaviourChange(mrChange: MatRadioChange) {
    if (mrChange.value === 'Y') {
      this.physicalHurtSW = true;
      this.getFormData().behSrvcsSw.setValidators([Validators.required]);
      this.getFormData().behSrvcsSw.updateValueAndValidity();
    } else if (mrChange.value === 'N') {
      this.physicalHurtSW = false;
      this.getFormData().behSrvcsSw.setValue(null);
      this.getFormData().behSrvcsSw.clearValidators();
      this.getFormData().behSrvcsSw.markAsUntouched();
      this.getFormData().behSrvcsSw.updateValueAndValidity();
      this.getFormData().mentalHlthCrisisSw.setValue(false);
      this.getFormData().criminalJusticeSw.setValue(false);
      this.getFormData().childProtectSrvcSw.setValue(false);
      this.getFormData().adltProtectSrvcSw.setValue(false);
      this.getFormData().psychiatricHospitalSw.setValue(false);
      this.getFormData().residentialTrtmntSw.setValue(false);
      this.getFormData().behNoneSw.setValue(false);
    }
  }

  setValidationsCareGiver() {
    this.getFormData().cargvrName.setValidators([
      Validators.required,
      Validators.maxLength(100),
      this.customValidator.nameValidator(),
    ]);
    this.getFormData().cargvrBirthDt.setValidators([Validators.required]);
    this.getFormData().cargvrReltshpCd.setValidators([Validators.required]);
    this.getFormData().cargvrName.updateValueAndValidity();
    this.getFormData().cargvrBirthDt.updateValueAndValidity();
    this.getFormData().cargvrReltshpCd.updateValueAndValidity();
  }

  removeValidationsCareGiver() {
    this.getFormData().cargvrName.setValue(null);
    this.getFormData().cargvrBirthDt.setValue(null);
    this.getFormData().cargvrReltshpCd.setValue(null);
    this.getFormData().cargvrName.markAsUntouched();
    this.getFormData().cargvrBirthDt.markAsUntouched();
    this.getFormData().cargvrReltshpCd.markAsUntouched();

    this.getFormData().cargvrName.clearValidators();
    this.getFormData().cargvrBirthDt.clearValidators();
    this.getFormData().cargvrReltshpCd.clearValidators();
    this.getFormData().cargvrName.updateValueAndValidity();
    this.getFormData().cargvrBirthDt.updateValueAndValidity();
    this.getFormData().cargvrReltshpCd.updateValueAndValidity();
  }

  setValidationsCareGiverDied() {
    this.getFormData().cargvrDiedSw.setValidators([Validators.required]);
    this.getFormData().cargvrDiedSw.updateValueAndValidity();
    this.getFormData().cargvrPoorHlthSw.setValue(null);
    this.getFormData().cargvrPoorHlthSw.markAsUntouched();
    this.getFormData().cargvrPoorHlthSw.updateValueAndValidity();
    this.getFormData().cargvrDisableSw.setValue(null);
    this.getFormData().cargvrDisableSw.markAsUntouched();
    this.getFormData().cargvrDisableSw.updateValueAndValidity();
    this.getFormData().noneOfAboveSw.setValue(null);
    this.getFormData().noneOfAboveSw.markAsUntouched();
    this.getFormData().noneOfAboveSw.updateValueAndValidity();
  }

  removeValidationsCareGiverDied() {
    this.getFormData().cargvrDiedSw.setValue(null);
    this.getFormData().cargvrDiedSw.markAsUntouched();
    this.getFormData().cargvrDiedSw.clearValidators();
    this.getFormData().cargvrDiedSw.updateValueAndValidity();
  }

  onPrimaryCareGiverDescription(event) {
    if (event.checked) {
      this.primaryCheckboxSelectedCount = this.primaryCheckboxSelectedCount + 1;
    } else if (!event.checked) {
      this.primaryCheckboxSelectedCount = this.primaryCheckboxSelectedCount - 1;
    }
    if (this.primaryCheckboxSelectedCount > 0) {
      this.primaryCareGiverDescriptionSelected = true;
    } else {
      this.primaryCareGiverDescriptionSelected = false;
    }
  }

  onNeedHelp(event) {
    if (event.checked) {
      this.needHelpCheckboxSelectedCount =
        this.needHelpCheckboxSelectedCount + 1;
    } else if (!event.checked) {
      this.needHelpCheckboxSelectedCount =
        this.needHelpCheckboxSelectedCount - 1;
    }
    if (this.needHelpCheckboxSelectedCount > 0) {
      this.needHelpSelected = true;
    } else {
      this.needHelpSelected = false;
    }
  }

  onBehaviourChange(event) {
    if (event.checked) {
      this.behaviourChangeCheckboxSelectedCount =
        this.behaviourChangeCheckboxSelectedCount + 1;
    } else if (!event.checked) {
      this.behaviourChangeCheckboxSelectedCount =
        this.behaviourChangeCheckboxSelectedCount - 1;
    }
    if (this.behaviourChangeCheckboxSelectedCount > 0) {
      this.behaviourChangeSelected = true;
    } else {
      this.behaviourChangeSelected = false;
    }
  }
  onBehaviourChangeNone(event) {
    if (event.checked) {
      this.behaviourChangeNone = true;
    } else if (!event.checked) {
      this.behaviourChangeNone = false;
    }
  }

  onNeedHelpNoneSelected(event) {
    if (event.checked) {
      this.needHelpNoneSelected = true;
    } else if (!event.checked) {
      this.needHelpNoneSelected = false;
    }
  }

  onPrimaryCareGiverNoneDescription(event) {
    if (event.checked) {
      this.onPrimaryCareGiverNone = true;
    } else {
      this.onPrimaryCareGiverNone = false;
    }
  }
}
