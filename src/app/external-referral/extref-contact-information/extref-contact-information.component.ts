//import { Component, OnInit } from '@angular/core';
import { RefLivingArrangement } from '../../_shared/model/RefLivingArrangement';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatRadioChange } from '@angular/material/radio';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReferralService } from '../../core/services/referral/referral.service';
import { RefAppContact } from '../../_shared/model/RefAppContact';
import { Router } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { ReferralFlowSeq } from '../../_shared/utility/ReferralFlowSeq';
import * as customValidation from '../../_shared/constants/validation.constants';
import { CustomvalidationService } from '../../_shared/utility/customvalidation.service';
import { SavePopupComponent } from '../../savePopup/savePopup.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ExternalreferralService } from '../services/externalreferral.service';
import { RefContactAddress } from 'src/app/_shared/model/RefContactAddress';
import { MatHorizontalStepper } from '@angular/material/stepper';
import { ToastrService } from 'ngx-toastr';
import { MatSelectChange } from '@angular/material/select';
import { ExtrefAddressValidationComponent } from 'src/app/_shared/components/extref-address-validation/extref-address-validation.component';


@Component({
  selector: 'app-extref-contact-information',
  templateUrl: './extref-contact-information.component.html',
  styleUrls: ['./extref-contact-information.component.scss']
})
export class ExtrefContactInformationComponent implements OnInit {
  @Input() stepper: MatHorizontalStepper;
  @Output() completedContact: EventEmitter<any> = new EventEmitter<any>();
  customValidation = customValidation;

  refContactForm: FormGroup;
  isDesignee = false;
  personId: string;
  age: number;
  interpreterSW = false;
  designeeMailSW = false;
  ageSW = false;
  addrFormatSW = false;
  othLivingArrange = false;
  livingSelfSw = false;
  livingFamilySw = false;
  livingElseSw = false;
  moveOutSoonSw = false;
  helpRightAwaySw = false;
  lostPlaceSw = false;
  anotherPlaceSw = false;
  nursingHomeSW = false;
  otherfacilityCD = false;
  nextPath: string;
  nextForm: string;
  event: string;
  submitted = false;
  isPhoneUpdated = false;
  iscellphoneUpdated = false;
  isworkphoneUpdated = false;
  ishomephoneUpdated = false;
  showlivingCd = false;
  prefferedPhoneArray = [];
  showPreferredPhoneType: boolean;
  data: any;
  longTermFacility = false;
  livingArrangement: any;
  facilityOptions: any;
  subscriptions$ = [];
  phoneTypeDropdowns= [];
  addressDropdowns = [];
  stateDropdowns =[];
  countyDropdowns =[];
  miltaryStateDropdowns =[];
  language: any;
  isValidated: boolean = false;
  isTN = false;
  miltaryPoDropdowns =[];
  relationshipList = [];
  constructor(
    private fb: FormBuilder,
    private refService: ReferralService,
    private router: Router,
    private customValidator: CustomvalidationService,
    private dialog: MatDialog,
    private extRefService: ExternalreferralService,
    private toastr: ToastrService,
    private matDialog: MatDialog,
  ) { }

  getFormData() {
    return this.refContactForm.controls;
  }

  ngOnInit(): void {
    const phoneTypeDropdownsSubscriptions = this.extRefService.getSearchDropdowns('PHONE_TYPE').subscribe(response => {
      this.phoneTypeDropdowns = response.sort((a, b) => (a.value > b.value) ? 1 : -1);
    });
    this.subscriptions$.push(phoneTypeDropdownsSubscriptions);

    const addressDropdownSubscriptions = this.extRefService.getSearchDropdowns('ADDRESS_FORMAT').subscribe(response => {
      this.addressDropdowns = response.sort((a, b) => (a.value > b.value) ? 1 : -1);
    });
    this.subscriptions$.push(addressDropdownSubscriptions);
    const stateDropdownSubscriptions = this.extRefService.getSearchDropdowns('STATE').subscribe(response => {
      this.stateDropdowns = response;
    });
    this.subscriptions$.push(stateDropdownSubscriptions);

    const countyDropdownSubscriptions = this.extRefService.getSearchDropdowns('COUNTY').subscribe(response => {
      this.countyDropdowns = response.sort((a, b) => (a.value > b.value) ? 1 : -1);
    });
    this.subscriptions$.push(countyDropdownSubscriptions);

    const miltaryPoDropdownSubscriptions = this.extRefService.getSearchDropdowns('MILITARY_PO').subscribe(response => {
      this.miltaryPoDropdowns = response.sort((a, b) => (a.value > b.value) ? 1 : -1);
    });
    this.subscriptions$.push(miltaryPoDropdownSubscriptions);
    const miltaryStateDropdownSubscriptions = this.extRefService.getSearchDropdowns('MILITARY_STATE').subscribe(response => {
      this.miltaryStateDropdowns = response.sort((a, b) => (a.value > b.value) ? 1 : -1);
    });
    this.subscriptions$.push(miltaryStateDropdownSubscriptions);

    this.subscriptions$.push(miltaryPoDropdownSubscriptions);
    const DesigneeRelationShipDropdownSubscriptions = this.extRefService.getSearchDropdowns('DESIGNEE_RELATIONSHIP').subscribe(response => {
      this.relationshipList = response.sort((a, b) => (a.value > b.value) ? 1 : -1);
    });
    this.subscriptions$.push(DesigneeRelationShipDropdownSubscriptions);

    
    
    this.refContactForm = this.fb.group({
      anotherPlaceSw: [''],
      applicantCellPhNum: ['', [Validators.maxLength(10), this.customValidator.phonenumberValidator()]],
      applicantWorkPhNum: ['', [Validators.maxLength(10), this.customValidator.phonenumberValidator()]],
      applicantHomePhNum: ['', [Validators.maxLength(10), this.customValidator.phonenumberValidator()]],
      prefPhoneTypCd: ['', Validators.required],
      currentLivingCd: ['', [Validators.required]],
      appDsgnSw: [''],
      dsgnAaAeApCd: [''],
      dsgnAddrL2Dsgn: ['', [Validators.maxLength(50), this.customValidator.addressAndCityValidator()]],
      dsgnAddrLine1: ['', [Validators.maxLength(100), this.customValidator.addressAndCityValidator()]],
      dsgnAddressFormatCd: ['US'],
      dsgnApoFpoCd: [''],
      dsgnCity: ['', [Validators.maxLength(25), this.customValidator.addressAndCityValidator()]],
      dsgnCntyCd: ['', [Validators.maxLength(25), this.customValidator.addressAndCityValidator()]],
      firstName: [''],
      dsgnLastName: [''],
      mailSw: [''],
      dsgnMidInitial: [''],
      dsgnStateCd: [''], 
      dsgnZipExtn: ['', Validators.pattern('[0-9]')],
      dsgnZipcode: [''],
      emailAddr: ['', [this.customValidator.emailValidator()]],
      facilityCd: [''],
      facilityOther: [''],
      helpRightAwaySw: ['', Validators.required],
      interprtSw: ['',Validators.required],
      appPrefLangCd: [''],
      livingElseSw: [''],
      livingFamilySw: [''],
      livingSelfSw: [''],
      lostPlaceSw: ['', Validators.required],
      moveOutSoonSw: ['', Validators.required],
      needServicesSw: [''],
      othLivingArrange: [''],
      relationshipCd: [''],
      dsgnPhNum: ['', [Validators.maxLength(10), this.customValidator.phonenumberValidator()]],
      livingCd: [''],
      prefLangLettersCd: ['', Validators.required],
    });

    this.extRefService.stepReady(this.refContactForm, "three");
    this.extRefService.sharedParam.subscribe(param => {
      this.age = param;
      if (this.age >= 18) {
        this.ageSW = true;
        this.getFormData().appDsgnSw.setValidators(Validators.required);
        this.getFormData().appDsgnSw.updateValueAndValidity();
        this.refContactForm.get('firstName').clearValidators();
        this.refContactForm.get('firstName').updateValueAndValidity();
        this.refContactForm.get('dsgnLastName').clearValidators();
        this.refContactForm.get('dsgnLastName').updateValueAndValidity();
        this.refContactForm.get('relationshipCd').clearValidators();
        this.refContactForm.get('relationshipCd').updateValueAndValidity();
        this.refContactForm.get('dsgnPhNum').clearValidators();
        this.refContactForm.get('dsgnPhNum').updateValueAndValidity();
        this.refContactForm.get('interprtSw').clearValidators();
        this.refContactForm.get('interprtSw').updateValueAndValidity();
        this.refContactForm.get('appPrefLangCd').clearValidators();
        this.refContactForm.get('appPrefLangCd').updateValueAndValidity();
        // this.refContactForm.get('dsgnAddressFormatCd').clearValidators();
        // this.refContactForm.get('dsgnAddressFormatCd').updateValueAndValidity();
        this.refContactForm.get('dsgnAddrLine1').clearValidators();
        this.refContactForm.get('dsgnAddrLine1').updateValueAndValidity();
        this.refContactForm.get('dsgnCity').clearValidators();
        this.refContactForm.get('dsgnCity').updateValueAndValidity();
        this.refContactForm.get('dsgnStateCd').clearValidators();
        this.refContactForm.get('dsgnStateCd').updateValueAndValidity();
        this.refContactForm.get('dsgnZipcode').clearValidators();
        this.refContactForm.get('dsgnZipcode').updateValueAndValidity();
        this.refContactForm.get('dsgnCntyCd').clearValidators();
        this.refContactForm.get('dsgnCntyCd').updateValueAndValidity();
        console.log("test-1")
        this.isDesignee = false;
      } else {
        this.ageSW = false;
        this.getFormData().appDsgnSw.clearValidators();
        this.getFormData().appDsgnSw.updateValueAndValidity();

        this.refContactForm.get('firstName').setValidators([Validators.required, Validators.maxLength(45), this.customValidator.nameValidator()]);
        this.refContactForm.get('firstName').updateValueAndValidity();
        this.refContactForm.get('dsgnLastName').setValidators([Validators.required, Validators.maxLength(45), this.customValidator.nameValidator()]);
        this.refContactForm.get('dsgnLastName').updateValueAndValidity();
        this.refContactForm.get('relationshipCd').setValidators(Validators.required);
        this.refContactForm.get('relationshipCd').updateValueAndValidity();
        this.refContactForm.get('dsgnPhNum').setValidators([Validators.required, Validators.maxLength(10), this.customValidator.phonenumberValidator(),]);
        this.refContactForm.get('dsgnPhNum').updateValueAndValidity();
        this.refContactForm.get('interprtSw').setValidators(Validators.required);
        this.refContactForm.get('interprtSw').updateValueAndValidity();
        this.refContactForm.get('appPrefLangCd').setValidators(Validators.required);
        this.refContactForm.get('appPrefLangCd').updateValueAndValidity();
        // this.refContactForm.get('dsgnAddressFormatCd').setValidators(Validators.required);
        // this.refContactForm.get('dsgnAddressFormatCd').updateValueAndValidity();
        this.refContactForm.get('dsgnAddrLine1').setValidators(Validators.required);
        this.refContactForm.get('dsgnAddrLine1').updateValueAndValidity();
        this.refContactForm.get('dsgnCity').setValidators(Validators.required);
        this.refContactForm.get('dsgnCity').updateValueAndValidity();
        this.refContactForm.get('dsgnStateCd').setValidators(Validators.required);
        this.refContactForm.get('dsgnStateCd').updateValueAndValidity();
        this.refContactForm.get('dsgnZipcode').setValidators(Validators.required);
        this.refContactForm.get('dsgnZipcode').updateValueAndValidity();
        this.isDesignee = true;
      }
    });
    this.getLivingArrangement();
    this.getFacilityName();
    this.getLanguage()
  }

  get f() {
    return this.refContactForm.controls;
  }

  showSaveAndExitPopup() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = { route: 'ltss/referral' };
    dialogConfig.panelClass = "exp_popup";
    dialogConfig.width = "500px";
    this.dialog.open(SavePopupComponent, dialogConfig);
  }

  next() {
    this.event = 'Next';
    this.submitted = true;
    let nextForm = 'PRSAWK';
    this.completedContact.emit(ReferralFlowSeq[nextForm]);
  }

  sendingYorN(input: boolean) {
    if (input === true) {
      return 'Y';
    } else if (input === false) {
      return 'N';
    }
  }



  onDesigneeChange(event) {
    if (event.value === 'Y') {
      this.isDesignee = true;
      this.refContactForm.get('mailSw').setValidators(Validators.required);
      this.getFormData().firstName.setValue(null);
      this.getFormData().dsgnMidInitial.setValue(null);
      this.getFormData().dsgnLastName.setValue(null);
      this.getFormData().relationshipCd.setValue(null);
      this.getFormData().dsgnPhNum.setValue(null);
      this.getFormData().firstName.markAsUntouched();
      this.getFormData().dsgnLastName.markAsUntouched();
      this.getFormData().relationshipCd.markAsUntouched();
      this.getFormData().dsgnPhNum.markAsUntouched();
      this.getFormData().firstName.setValidators([Validators.required, Validators.maxLength(45), this.customValidator.nameValidator()]);
      this.getFormData().dsgnLastName.setValidators([Validators.required, Validators.maxLength(45), this.customValidator.nameValidator()]);
      this.getFormData().relationshipCd.setValidators([Validators.required]);
      this.getFormData().dsgnPhNum.setValidators([Validators.required, Validators.maxLength(10), this.customValidator.phonenumberValidator()]);
    } else if (event.value === 'N') {
      this.isDesignee = false;
      this.refContactForm.get('mailSw').clearValidators();
      this.getFormData().firstName.clearValidators();
      this.getFormData().firstName.setValue(null);
      this.getFormData().dsgnMidInitial.clearValidators();
      this.getFormData().dsgnMidInitial.setValue(null);
      this.getFormData().dsgnLastName.clearValidators();
      this.getFormData().dsgnLastName.setValue(null);
      this.getFormData().relationshipCd.clearValidators();
      this.getFormData().relationshipCd.setValue(null);
      this.getFormData().dsgnPhNum.clearValidators();
      this.getFormData().dsgnPhNum.setValue(null);
    }
    this.refContactForm.get('mailSw').updateValueAndValidity();
    this.getFormData().firstName.updateValueAndValidity();
    this.getFormData().dsgnMidInitial.updateValueAndValidity();
    this.getFormData().dsgnLastName.updateValueAndValidity();
    this.getFormData().relationshipCd.updateValueAndValidity();
    this.getFormData().dsgnPhNum.updateValueAndValidity();
  }

  onInterpreterChange(mrChange: MatRadioChange) {
    if (mrChange.value === 'Y') {
      this.interpreterSW = true;
      this.refContactForm.controls.appPrefLangCd.setValidators([Validators.required]);
      this.refContactForm.controls.appPrefLangCd.updateValueAndValidity();

    } else if (mrChange.value === 'N') {
      this.interpreterSW = false;
      this.refContactForm.controls.appPrefLangCd.clearValidators();
      this.refContactForm.controls.appPrefLangCd.updateValueAndValidity();
    }
  }
  trackState(msChange: MatSelectChange) {
    if (msChange.value === 'TN') {
      this.isTN = true;
      this.getFormData().dsgnCntyCd.setValidators([Validators.required]);
    } else {
      this.isTN = false;
      this.getFormData().dsgnCntyCd.clearValidators();
      this.getFormData().dsgnCntyCd.patchValue('NA');
    }
    this.getFormData().dsgnCntyCd.updateValueAndValidity();
  }

  

  validateAddress(){
    if (
      this.getFormData().dsgnAddrLine1.status !== 'INVALID' &&
      this.getFormData().dsgnAddrL2Dsgn.status !== 'INVALID' &&
      this.getFormData().dsgnCity.status !== 'INVALID' &&
      this.getFormData().dsgnStateCd.status !== 'INVALID' &&
      this.getFormData().dsgnZipExtn.status !== 'INVALID' &&
      this.getFormData().dsgnZipcode.status !== 'INVALID' &&
      this.getFormData().dsgnCntyCd.status !== 'INVALID'
    ) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.width = '720px';
      dialogConfig.height = '522px';
      dialogConfig.data = {
        addrLine1: this.getFormData().dsgnAddrLine1.value,
        addrLine2: this.getFormData().dsgnAddrL2Dsgn.value,
        city: this.getFormData().dsgnCity.value,
        state: this.getFormData().dsgnStateCd.value,
        zipCode: this.getFormData().dsgnZipcode.value,
        ext: this.getFormData().dsgnZipExtn.value,
        county: this.getFormData().dsgnCntyCd.value,
      };
      const dialogRef = this.matDialog.open(
        ExtrefAddressValidationComponent,
        dialogConfig
      );
      dialogRef.afterClosed().subscribe((address) => {
       this.isValidated = true;
        if (address) {
          this.getFormData().dsgnAddrLine1.setValue(address.addrLine1);
          this.getFormData().dsgnAddrL2Dsgn.setValue(address.addrLine2);
          this.getFormData().dsgnCity.setValue(address.city);
          this.getFormData().dsgnStateCd.setValue(address.state);
          this.getFormData().dsgnZipcode.setValue(address.zipCode);
          this.getFormData().dsgnZipExtn.setValue(address.ext);
          console.log(address);
        }
      });
    }
  }

  onDesigneeMailChange(mrChange: MatRadioChange) {
    if (mrChange.value === 'N') {
      this.designeeMailSW = false;
      //this.refContactForm.get('dsgnAddressFormatCd').clearValidators();
      this.refContactForm.get('dsgnAddrLine1').clearValidators();
      this.refContactForm.get('dsgnAddrL2Dsgn').clearValidators();
      this.refContactForm.get('dsgnCity').clearValidators();
      this.refContactForm.get('dsgnZipcode').clearValidators();
      this.refContactForm.get('dsgnStateCd').clearValidators();
      //this.refContactForm.get('dsgnAddressFormatCd').setValue();
      this.refContactForm.get('dsgnAddrLine1').setValue(null);
      this.refContactForm.get('dsgnAddrL2Dsgn').setValue(null);
      this.refContactForm.get('dsgnCity').setValue(null);
      this.refContactForm.get('dsgnZipcode').setValue(null);
      this.refContactForm.get('dsgnStateCd').setValue(null);
      this.refContactForm.get('dsgnCntyCd').setValue(null);
      this.refContactForm.get('dsgnApoFpoCd').setValue(null);
      this.refContactForm.get('dsgnAaAeApCd').setValue(null);
     
    } else if (mrChange.value === 'Y') {
      this.designeeMailSW = true;
      //this.refContactForm.get('dsgnAddressFormatCd').markAsUntouched();
      this.refContactForm.get('dsgnAddrLine1').markAsUntouched();
      this.refContactForm.get('dsgnAddrL2Dsgn').markAsUntouched();
      this.refContactForm.get('dsgnCity').markAsUntouched();
      this.refContactForm.get('dsgnZipcode').markAsUntouched();
      this.refContactForm.get('dsgnStateCd').markAsUntouched();
      this.refContactForm.get('dsgnCntyCd').markAsUntouched();
      this.refContactForm.get('dsgnApoFpoCd').markAsUntouched();
      this.refContactForm.get('dsgnAaAeApCd').markAsUntouched();
     // this.refContactForm.get('dsgnAddressFormatCd').setValue(null);
      this.refContactForm.get('dsgnAddrLine1').setValue(null);
      this.refContactForm.get('dsgnAddrL2Dsgn').setValue(null);
      this.refContactForm.get('dsgnCity').setValue(null);
      this.refContactForm.get('dsgnZipcode').setValue(null);
      this.refContactForm.get('dsgnStateCd').setValue(null);
      this.refContactForm.get('dsgnCntyCd').setValue(null);
      this.refContactForm.get('dsgnApoFpoCd').setValue(null);
      this.refContactForm.get('dsgnAaAeApCd').setValue(null);
      //this.refContactForm.get('dsgnAddressFormatCd').setValidators(Validators.required);
      this.refContactForm.get('dsgnAddrLine1').setValidators([Validators.required, Validators.maxLength(100), Validators.pattern('^[A-Za-z0-9 ]+$')]);
      this.refContactForm.get('dsgnAddrL2Dsgn').setValidators([Validators.maxLength(50), Validators.maxLength(100), Validators.pattern('^[A-Za-z0-9 ]+$')]);
      this.refContactForm.get('dsgnCity').setValidators([Validators.required, Validators.maxLength(25), this.customValidator.addressAndCityValidator()]);
      this.refContactForm.get('dsgnZipcode').setValidators([Validators.required, Validators.pattern('[0-9]{5}'), this.customValidator.specialCharacterValidator()]);
      this.refContactForm.get('dsgnStateCd').setValidators(Validators.required);
    }
    //this.refContactForm.get('dsgnAddressFormatCd').updateValueAndValidity();
    this.refContactForm.get('dsgnAddrLine1').updateValueAndValidity();
    this.refContactForm.get('dsgnAddrL2Dsgn').updateValueAndValidity();
    this.refContactForm.get('dsgnCity').updateValueAndValidity();
    this.refContactForm.get('dsgnZipcode').updateValueAndValidity();
    this.refContactForm.get('dsgnStateCd').updateValueAndValidity();
  }
  onMoveOutSoon(mrChange: MatRadioChange) {
    if (mrChange.value === 'N') {
      this.moveOutSoonSw = false;
    } else if (mrChange.value === 'Y') {
      this.moveOutSoonSw = true;
    }
  }

  onlostPlaceChange(mrChange: MatRadioChange) {
    if (mrChange.value === 'N') {
      this.lostPlaceSw = false;
    } else if (mrChange.value === 'Y') {
      this.refContactForm
        .get('anotherPlaceSw')
        .setValidators(Validators.required);
      this.lostPlaceSw = true;
    }
  }

  onhelpRightAwayChange(mrChange: MatRadioChange) {
    if (mrChange.value === 'N') {
      this.helpRightAwaySw = false;
    } else if (mrChange.value === 'Y') {
      this.helpRightAwaySw = true;
    }
  }

  onAnotherPlaceChange(mrChange: MatRadioChange) {
    if (mrChange.value === 'N') {
      this.anotherPlaceSw = false;
    } else if (mrChange.value === 'Y') {
      this.anotherPlaceSw = true;
    }
  }

  onPhoneType(event) {
    this.refContactForm.get('applicantCellPhNum');
   this.refContactForm.get('applicantWorkPhNum');
   this.refContactForm.get('applicantHomePhNum');
    if (event.value === 'CL') {
      this.refContactForm.get('applicantCellPhNum').setValidators([Validators.required]);
     
      this.refContactForm.get('applicantWorkPhNum').clearValidators();
      this.refContactForm.get('applicantHomePhNum').clearValidators();
    } else if (event.value === 'HM') {
      this.refContactForm.get('applicantHomePhNum').setValidators(Validators.required);
      this.refContactForm.get('applicantWorkPhNum').clearValidators();
      this.refContactForm.get('applicantCellPhNum').clearValidators();
    
    } else if (event.value === 'WK') {
     
      this.refContactForm.get('applicantWorkPhNum').setValidators(Validators.required);
      this.refContactForm.get('applicantHomePhNum').clearValidators();
      this.refContactForm.get('applicantCellPhNum').clearValidators();
    }
    this.refContactForm.get('applicantCellPhNum').updateValueAndValidity();
    this.refContactForm.get('applicantWorkPhNum').updateValueAndValidity();
    this.refContactForm.get('applicantHomePhNum').updateValueAndValidity();

  }
  onAddressFormat(event) {
    if (event.value === 'MA') {
      this.addrFormatSW = true;
    } else {
      this.addrFormatSW = false;
    }
  }

  onCurrentLivingArrangement(event) {
    if (event.value === 'OTH') {
      this.longTermFacility = false;
      this.refContactForm.get('othLivingArrange').setValidators([Validators.required,Validators.maxLength(100),this.customValidator.nameValidator()]);
      this.othLivingArrange = true;
      this.nursingHomeSW = false;
      this.showlivingCd = false;
      this.refContactForm.get('needServicesSw').clearValidators();
      this.refContactForm.get('facilityCd').clearValidators();
      this.refContactForm.get('facilityOther').clearValidators();
      this.refContactForm.get('othLivingArrange').updateValueAndValidity();
      this.refContactForm.get('needServicesSw').updateValueAndValidity();
      this.refContactForm.get('facilityCd').updateValueAndValidity();
      this.refContactForm.get('facilityOther').updateValueAndValidity();
    } else if (event.value === 'LTC') {
      this.longTermFacility = true;
      this.refContactForm.get('needServicesSw').setValidators(Validators.required);
      this.refContactForm.get('facilityCd').setValidators(Validators.required);
      this.refContactForm.get('othLivingArrange').clearValidators();
      // this.refContactForm.get('facilityOther').setValidators(Validators.required);
      this.nursingHomeSW = true;
      this.othLivingArrange = false;
      this.showlivingCd = false;
     
     
    }
    else if (event.value === 'HOM') {
      this.showlivingCd = true;
      this.nursingHomeSW = false;
      this.othLivingArrange = false;
      this.longTermFacility = false;
      this.refContactForm.get('othLivingArrange').clearValidators();
      this.refContactForm.get('needServicesSw').clearValidators();
      this.refContactForm.get('facilityCd').clearValidators();
      this.refContactForm.get('facilityOther').clearValidators();
      this.refContactForm.get('othLivingArrange').updateValueAndValidity();
      this.refContactForm.get('needServicesSw').updateValueAndValidity();
      this.refContactForm.get('facilityCd').updateValueAndValidity();
      this.refContactForm.get('facilityOther').updateValueAndValidity();
    }
    else {
      this.showlivingCd = false;
      this.nursingHomeSW = false;
      this.othLivingArrange = false;
      this.longTermFacility = false;
      this.refContactForm.get('othLivingArrange').clearValidators();
      this.refContactForm.get('needServicesSw').clearValidators();
      this.refContactForm.get('facilityCd').clearValidators();
      this.refContactForm.get('facilityOther').clearValidators();
      this.refContactForm.get('othLivingArrange').updateValueAndValidity();
      this.refContactForm.get('needServicesSw').updateValueAndValidity();
      this.refContactForm.get('facilityCd').updateValueAndValidity();
      this.refContactForm.get('facilityOther').updateValueAndValidity();
    }
    this.extRefService.livingArrangementType$$.next(event.value);
  }

  onFacilityCd(event) {
    if (event.value === 'OTR') {
      this.otherfacilityCD = true;
      this.refContactForm.get('facilityOther').setValidators([Validators.required,Validators.maxLength(100),this.customValidator.nameValidator()]);

    } else {
      this.otherfacilityCD = false;
      this.refContactForm.get('facilityOther').clearValidators();

    }
    this.refContactForm.get('facilityOther').updateValueAndValidity();

  }

  onLivingChange(mrChange: MatRadioChange) {
    console.log(mrChange.value);
    if (mrChange.value === 'livingByMySelf') {
      this.livingSelfSw = true;
    } else if (mrChange.value === 'livingFamily') {
      this.livingFamilySw = false;
    } else if (mrChange.value === 'livingelse') {
      this.livingElseSw = false;
    }
  }
  

  saveRefandContact() {
    if(this.designeeMailSW && !this.isValidated){
      this.toastr.error("Please Validate the Address!")
      return;
    }
    if (this.refContactForm.valid) {
      const refId = '';
      this.personId = '';
      console.log(this.getFormData().currentLivingCd.value);
      const refLivingArrangementVO = new RefLivingArrangement(
        this.getFormData().anotherPlaceSw.value,
        this.getFormData().currentLivingCd.value,

        null,
        null,
        this.sendingYorN(this.helpRightAwaySw),
        '0',
        this.sendingYorN(this.livingElseSw),
        this.sendingYorN(this.livingFamilySw),
        this.sendingYorN(this.livingSelfSw),
        this.sendingYorN(this.lostPlaceSw),
        this.sendingYorN(this.moveOutSoonSw),
        this.getFormData().needServicesSw.value,
        this.getFormData().othLivingArrange.value,
        this.personId,
        refId,
        'PERCI'
      );

      const refContactVO = new RefContactAddress(
        this.getFormData().dsgnAddressFormatCd.value,
        this.getFormData().dsgnAddrLine1.value,
        this.getFormData().dsgnAddrL2Dsgn.value,
        refId,
        this.getFormData().dsgnCity.value,
        this.getFormData().dsgnCntyCd.value,
        this.getFormData().dsgnApoFpoCd.value,
        this.getFormData().dsgnAaAeApCd.value,
        this.personId,

        'PERCI',
        this.getFormData().dsgnStateCd.value,
        'true',
        this.getFormData().dsgnZipExtn.value,
        this.getFormData().dsgnZipcode.value,
      );

      const refAppContact = new RefAppContact(
        this.getFormData().applicantCellPhNum.value,
        this.getFormData().emailAddr.value,
        this.getFormData().applicantHomePhNum.value,
        this.getFormData().appDsgnSw.value,
		    this.getFormData().interprtSw.value,
        this.getFormData().applicantWorkPhNum.value,
        this.getFormData().prefPhoneTypCd.value,
        this.getFormData().appPrefLangCd.value,
        this.getFormData().applicantCellPhNum.value,
        this.getFormData().firstName.value,
        this.getFormData().mailSw.value,
        this.getFormData().dsgnLastName.value,
        this.getFormData().dsgnMidInitial.value,
        this.getFormData().prefLangLettersCd.value,
        refId,
        this.getFormData().relationshipCd.value,
        '',
        'DSGN',
        '0',
        'PERCI',
        refLivingArrangementVO,
        refContactVO
      );
      this.extRefService.contactInfoData$$.next(refAppContact);
      this.completedContact.emit(ReferralFlowSeq['PERSW']);
      this.stepper.next();
    }
    // else {
    //   this.toastr.error("Please fill in the required values!")
    // }
  }

  getLivingArrangement(): any {
    this.extRefService.getSearchDropdowns('LIVING_ARRANGEMENT').subscribe(res => {
      this.livingArrangement = res;
    });
  }

  getFacilityName(): any {
    this.extRefService.getSearchDropdowns('FACILITY_NAME').subscribe(res => {
      this.facilityOptions = res;
    });
  }

  getLanguage(): any {
    this.extRefService.getSearchDropdowns('NOTICE_LANGUAGE').subscribe(res => {
      this.language = res;
    });
  }

  back() {
    const previousForm = 'PRAPIF';
    this.completedContact.emit(ReferralFlowSeq[previousForm]);
  }
  
  setPrefferedPhoneType(value) {
    this.prefferedPhoneArray.push(value);
    if (this.prefferedPhoneArray.length > 1) {
      console.log('inside inner if', value);
      this.showPreferredPhoneType = true;
    }
    if (this.showPreferredPhoneType === true) {
        this.refContactForm.get('prefPhoneTypCd').setValidators(Validators.required);
      }
      else if (this.showPreferredPhoneType === false) {
        this.refContactForm.get('prefPhoneTypCd').clearValidators();
      }
    }

}
