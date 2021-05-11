import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppealService } from '../services/appeal.service';
import * as customValidation from '../../_shared/constants/validation.constants';
import { AppealStepper } from '../../_shared/utility/AppealFlowSeq';
import { CustomvalidationService } from '../../_shared/utility/customvalidation.service';
import { OnDestroy } from '@angular/core';
import { RightnavToggleService } from 'src/app/_shared/services/rightnav-toggle.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-appellant-details',
  templateUrl: './appellant-details.component.html',
  styleUrls: ['./appellant-details.component.scss']
})
export class AppellantDetailsComponent implements OnInit, OnDestroy, OnChanges {

  @Input() appealIdSelectAction: any;
  @Input() appellantInfoStatus: any;
  @Output() appealCreatedData: EventEmitter<any> = new EventEmitter<any>();

  yesOrNo = [{ code: 'Y', value: 'Yes' }, { code: 'N', value: 'No' }];
  gender: any[] = [];
  nameSuffix: any[] = [];
  phoneType: any[] = [];
  language: any[] = [];
  personDetailsForm: FormGroup;
  doesUserHaveAlias: boolean;
  isNextEnabled = false;
  showPersonTable = false;
  showAppealRepresentative = false;
  showAppealType = false;
  appealType: any;
  formData: any;
  minDate: Date;
  maxDate: Date;
  age: number;
  customValidation = customValidation;
  showMailingAddress: boolean;
  mailingAddressForm: FormGroup;
  physicalAddress: any;
  mailingAddress: any;
  physicalAddressName = 'Physical Address';
  mailingAddressName = 'Mailing Address';
  @Output() completedApplication: EventEmitter<any> = new EventEmitter<any>();
  submitted = false;
  @Input() dataFromAppealStart: any;
  appellantInfo: any;
  appealTypeData: any;
  relationshipToAppellant: any;
  verificationSource: any = [];
  pasrrReason: any;
  payorSource: any;
  pasrrAdded: any;
  searchPersonTableData: any;
  personSearchBtnName = 'SEARCH FOR THE PERSON';
  pasrrAdverseReason: any;
  aplRepresentativeReqVO: any[] = [];
  searchPersonPayLoad: any;
  subscriptions$ = [];
  @Output() completedAppellantDetails: EventEmitter<any> = new EventEmitter<any>();
  selectedAppealType = '';
  selectedPasrrData: any;
  linkedAppealData: any;
  isPassrFormValid: boolean;
  togglePhyCounty: boolean;
  toggleMailCounty: boolean;
  checkAddressFormValidation: boolean;
  passrPayLoad: any;
  appealTypeCd: any;
  modifiedAppealTypeData: { code: string; value: string; activateSW: string; }[];
  addIndividualSelected: boolean;
  referralId = '';
  paeId = '';
  selectedMdnPerson: any;
  appealStartData: any;
  personId: any;
  appealId: any;
  isHelpDeskUser: boolean;
  localStorageLocal: any;

  constructor(private formBuilder: FormBuilder,
              private appealService: AppealService,
              private customValidator: CustomvalidationService,
              private rightnavToggleService: RightnavToggleService,
              private router: Router) { }

  ngOnInit() {

    this.localStorageLocal = localStorage.getItem('APP_STORAGE_TOKEN');

    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 119, 0, 1);
    this.maxDate = new Date();

    const genderSubscription$ = this.appealService.getAppealDropdowns('GENDER').subscribe(res => {
      this.gender = res;
    });
    this.subscriptions$.push(genderSubscription$);

    const phoneTypeSubscription$ = this.appealService.getAppealDropdowns('PHONE_TYPE').subscribe(res => {
      this.phoneType = res;
    });
    this.subscriptions$.push(phoneTypeSubscription$);

    const languageSubscription$ = this.appealService.getAppealDropdowns('LANGUAGE').subscribe(res => {
      this.language = res;
    });
    this.subscriptions$.push(languageSubscription$);

    const appealTypeSubscription$ = this.appealService.getAppealDropdowns('APPEAL_TYPE').subscribe(res => {
      this.appealType = res;
    });
    this.subscriptions$.push(appealTypeSubscription$);

    const suffixSubscription$ = this.appealService.getAppealDropdowns('NAME_SUFFIX').subscribe(res => {
      this.nameSuffix = res;
    });
    this.subscriptions$.push(suffixSubscription$);

    const relationshipSubscription$ = this.appealService.getAppealDropdowns('RELATIONSHIP_APPELANT').subscribe(res => {
      this.relationshipToAppellant = res;
    });
    this.subscriptions$.push(relationshipSubscription$);

    const pasrrReasonSub$ = this.appealService.getAppealDropdowns('PASRR_REASON').subscribe(res => {
      this.pasrrReason = res;
    });
    this.subscriptions$.push(pasrrReasonSub$);

    const payorSourceSub$ = this.appealService.getAppealDropdowns('PAYOR_SOURCE').subscribe(res => {
      this.payorSource = res;
    });
    this.subscriptions$.push(payorSourceSub$);

    const pasrrAdverReasonSub$ = this.appealService.getAppealDropdowns('PASRR_ADVERSEREASON').subscribe(res => {
      this.pasrrAdverseReason = res;
    });
    this.subscriptions$.push(pasrrAdverReasonSub$);

    const verificationSourceSub$ = this.appealService.getAppealDropdowns('REP_VERIFICATIONSOURCE').subscribe(res => {
      this.verificationSource = res;
    });
    this.subscriptions$.push(verificationSourceSub$);

    this.initializeForm();
    this.personDetailsForm.valueChanges.subscribe(value => {
      console.log('name has changed:', value);
    });
  }

  ngOnChanges() {
    if (this.appealIdSelectAction) {
      this.selectActionFlow();
    } else {
      if (this.dataFromAppealStart !== undefined && this.dataFromAppealStart.appellantDetails !== undefined) {
        this.personSearchBtnName = 'VERIFY THE PERSON';
        this.appealStartData = this.dataFromAppealStart.appealStartFormData;
        this.appellantInfo = this.dataFromAppealStart.appellantDetails;
        if (this.dataFromAppealStart.appellantDetails.isHelpDeskUser === 'Y') {
          this.isHelpDeskUser = true;
        } else {
          this.isHelpDeskUser = false;
        }
        this.personDetailsForm.reset();
        this.age = null;
        this.isPassrFormValid = false;
        this.isNextEnabled = false;
        this.showPersonTable = false;
        this.showAppealRepresentative = false;
        this.showAppealType = false;
        this.togglePhyCounty = false;
        this.toggleMailCounty = false;
        this.setAppellantForm(this.appellantInfo);
      } else {
        this.appellantInfo = undefined;
        this.personSearchBtnName = 'SEARCH FOR THE PERSON';
        if (this.personDetailsForm !== undefined) {
          this.personDetailsForm.reset();
          this.age = null;
          this.isPassrFormValid = false;
          this.isNextEnabled = false;
          this.showPersonTable = false;
          this.showAppealRepresentative = false;
          this.showAppealType = false;
          this.togglePhyCounty = false;
          this.toggleMailCounty = false;
          this.personDetailsForm.controls['physicalAddress']['controls']['addressFormat'].setValue('US');
        }
      }
    }
  }

  selectActionFlow() {
    const AppealDetailsSubscriptions$ = this.appealService.getAppealDetails(this.appealIdSelectAction).subscribe(response => {
      this.appellantInfo = response;
      if (response && response.prsnId) {
        this.getFormDetails(response.prsnId);
      }
    });
    this.subscriptions$.push(AppealDetailsSubscriptions$);
  }

  getFormDetails(personId) {
    const userId = JSON.parse(this.localStorageLocal).userName;
    const appellantDetails$ = this.appealService.getAppeallantDetails(personId, userId).subscribe(response => {
      this.setAppellantForm(response);
    });
    this.subscriptions$.push(appellantDetails$);
  }

  initializeForm() {
    this.personDetailsForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.maxLength(45), this.customValidator.nameValidator()]],
      mi: ['', [Validators.maxLength(1), Validators.pattern('^[a-zA-Z]*$')]],
      lastName: ['', [Validators.required, Validators.maxLength(45), this.customValidator.nameValidator()]],
      suffix: [''],
      dobDt: ['', Validators.required],
      gender: [''],
      ssn: ['', [Validators.required]],
      ssnAvailableSw: [false],
      haveOtherName: ['', Validators.required],
      aliasFirstName: [{ disabled: true, value: '' }, Validators.required],
      aliasLastName: [{ disabled: true, value: '' }, Validators.required],
      aliasMi: [''],
      aliasSuffix: [''],
      cellPhone: ['', [Validators.maxLength(10), this.customValidator.phonenumberValidator()]],
      homePhone: ['', [Validators.maxLength(10), this.customValidator.phonenumberValidator()]],
      workPhone: ['', [Validators.maxLength(10), this.customValidator.phonenumberValidator()]],
      phoneType: [''],
      emailAddress: ['', this.customValidator.emailValidator()],
      language: ['', Validators.required],
      isMailingAddressSame: ['', Validators.required],
      physicalAddress: this.formBuilder.group({
        addressFormat: [{ disabled: true, value: '' }, Validators.required],
        addrLine1: ['', [Validators.required, Validators.maxLength(100), this.customValidator.addressAndCityValidator()]],
        addrLine2: ['', [Validators.maxLength(50), this.customValidator.addressAndCityValidator()]],
        city: [{ disabled: false, value: '' },
        [Validators.required, Validators.maxLength(25), this.customValidator.addressAndCityValidator()]],
        state: [{ disabled: false, value: '' }, Validators.required],
        zipCode: ['', [Validators.required, Validators.pattern('[0-9]{5}')]],
        ext: ['', Validators.pattern('[0-9]{4}')],
        county: [''],
        apoFpo: [{ disabled: true, value: '' }, Validators.required],
        aaAeAp: [{ disabled: true, value: '' }, Validators.required]
      }),
      mailingAddress: this.formBuilder.group({
        addressFormat: [''],
        addrLine1: [''],
        addrLine2: [''],
        city: [''],
        state: [''],
        zipCode: [''],
        ext: [''],
        county: [''],
        apoFpo: [''],
        aaAeAp: ['']
      })
    });
    this.physicalAddress = this.personDetailsForm.controls['physicalAddress'];
    this.mailingAddress = this.personDetailsForm.controls['mailingAddress'];
  }

  setAppellantForm(data) {
    this.personDetailsForm.controls['firstName'].setValue(data.firstName);
    this.personDetailsForm.controls['lastName'].setValue(data.lastName);
    this.personDetailsForm.controls['mi'].setValue(data.midInitial);
    this.personDetailsForm.controls['suffix'].setValue(data.suffix);
    this.personDetailsForm.controls['dobDt'].setValue(data.dobDt);
    this.personDetailsForm.controls['gender'].setValue(data.genderCd);
    this.personDetailsForm.controls['ssn'].setValue(data.ssn);
    this.personDetailsForm.controls['ssnAvailableSw'].setValue(data.ssnAvalSw);
    this.personDetailsForm.controls['haveOtherName'].setValue(data.aliasNameSw);
    this.personDetailsForm.controls['aliasFirstName'].setValue(data.aliasFirstName);
    this.personDetailsForm.controls['aliasLastName'].setValue(data.aliasLastName);
    this.personDetailsForm.controls['aliasMi'].setValue(data.aliasMidInitial);
    this.personDetailsForm.controls['aliasSuffix'].setValue(data.aliasSuffix);
    this.personDetailsForm.controls['homePhone'].setValue(data.homePhNum);
    this.personDetailsForm.controls['cellPhone'].setValue(data.cellPhNum);
    this.personDetailsForm.controls['workPhone'].setValue(data.workPhNum);
    this.personDetailsForm.controls['phoneType'].setValue(data.prefPhTypeCd);
    this.personDetailsForm.controls['emailAddress'].setValue(data.emailAddr);
    this.personDetailsForm.controls['language'].setValue(data.prefLangLettersCd);
    if (data.addrReqPhysical !== null) {
      this.personDetailsForm.controls['isMailingAddressSame'].setValue(data.addrReqPhysical.mailAddrSw);
      this.personDetailsForm.controls['physicalAddress']['controls']['addressFormat'].setValue(data.addrReqPhysical.addrFormatCd);
      this.personDetailsForm.controls['physicalAddress']['controls']['addrLine1'].setValue(data.addrReqPhysical.addrLine1);
      this.personDetailsForm.controls['physicalAddress']['controls']['addrLine2'].setValue(data.addrReqPhysical.addrLine2);
      this.personDetailsForm.controls['physicalAddress']['controls']['city'].setValue(data.addrReqPhysical.city);
      this.personDetailsForm.controls['physicalAddress']['controls']['state'].setValue(data.addrReqPhysical.stateCd);
      this.personDetailsForm.controls['physicalAddress']['controls']['zipCode'].setValue(data.addrReqPhysical.zip);
      this.personDetailsForm.controls['physicalAddress']['controls']['ext'].setValue(data.addrReqPhysical.zipExtn);
      this.personDetailsForm.controls['physicalAddress']['controls']['county'].setValue(data.addrReqPhysical.cntyCd);
      this.personDetailsForm.controls['physicalAddress']['controls']['apoFpo'].setValue(data.addrReqPhysical.militaryPoCd);
      this.personDetailsForm.controls['physicalAddress']['controls']['aaAeAp'].setValue(data.addrReqPhysical.militaryStateCd);
      this.addressTypeChanged(data.addrReqPhysical.mailAddrSw);
      if (data.addrReqPhysical.stateCd === 'TN') {
        this.togglePhyCounty = true;
      } else {
        this.togglePhyCounty = false;
      }
    }
    if (data.addrReqMailing !== null) {
      this.personDetailsForm.controls['mailingAddress']['controls']['addressFormat'].setValue(data.addrReqMailing.addrFormatCd);
      this.personDetailsForm.controls['mailingAddress']['controls']['addrLine1'].setValue(data.addrReqMailing.addrLine1);
      this.personDetailsForm.controls['mailingAddress']['controls']['addrLine2'].setValue(data.addrReqMailing.addrLine2);
      this.personDetailsForm.controls['mailingAddress']['controls']['city'].setValue(data.addrReqMailing.city);
      this.personDetailsForm.controls['mailingAddress']['controls']['state'].setValue(data.addrReqMailing.stateCd);
      this.personDetailsForm.controls['mailingAddress']['controls']['zipCode'].setValue(data.addrReqMailing.zip);
      this.personDetailsForm.controls['mailingAddress']['controls']['ext'].setValue(data.addrReqMailing.zipExtn);
      this.personDetailsForm.controls['mailingAddress']['controls']['county'].setValue(data.addrReqMailing.cntyCd);
      this.personDetailsForm.controls['mailingAddress']['controls']['apoFpo'].setValue(data.addrReqMailing.militaryPoCd);
      this.personDetailsForm.controls['mailingAddress']['controls']['aaAeAp'].setValue(data.addrReqMailing.militaryStateCd);
      if (data.addrReqMailing.stateCd === 'TN') {
        this.toggleMailCounty = true;
      } else {
        this.toggleMailCounty = false;
      }
    }
    this.onSsnAvailableChange(data.ssnAvalSw);
    this.calculateAge(data.dobDt);
    this.aliasAwitchSelected(data.aliasNameSw);

  }

  getFormData() {
    return this.personDetailsForm.controls;
    // this.getFormData().addressFormatCd.value,
  }

  calculateAge(event) {
    const birthDate: any = new Date(event);
    const ageDifMs = Date.now() - birthDate;
    const ageDate = new Date(ageDifMs);
    this.age = Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  onSsnAvailableChange(event) {
    if (event || event === 'Y') {
      this.getFormData().ssn.disable();
      // this.toastr.warning(this.customValidation.C3, '', {
      //   timeOut: 4000,
      //   positionClass: 'toast-top-full-width' });
    } else {
      this.getFormData().ssn.enable();
    }
  }

  ssnChange(event) {
    if (this.getFormData().ssn.value) {
      this.getFormData().ssnAvailableSw.disable();
    } else {
      this.getFormData().ssnAvailableSw.enable();
    }
  }

  aliasAwitchSelected(value) {
    if (value === 'Y') {
      this.doesUserHaveAlias = true;
      this.personDetailsForm.controls['aliasFirstName'].enable();
      this.personDetailsForm.controls['aliasLastName'].enable();
    } else {
      this.doesUserHaveAlias = false;
      this.personDetailsForm.controls['aliasFirstName'].disable();
      this.personDetailsForm.controls['aliasLastName'].disable();
    }
  }

  addressTypeChanged(value) {
    if (value === 'N') {
      this.showMailingAddress = true;
      this.mailingAddress.controls['addressFormat'].setValidators(Validators.required);
      this.mailingAddress.controls['addrLine1'].setValidators(Validators.required);
      this.mailingAddress.controls['city'].setValidators(Validators.required);
      this.mailingAddress.controls['state'].setValidators(Validators.required);
      this.mailingAddress.controls['zipCode'].setValidators(Validators.required);
      this.mailingAddress.controls['addressFormat'].updateValueAndValidity();
      this.mailingAddress.controls['addrLine1'].updateValueAndValidity();
      this.mailingAddress.controls['city'].updateValueAndValidity();
      this.mailingAddress.controls['state'].updateValueAndValidity();
      this.mailingAddress.controls['zipCode'].updateValueAndValidity();
    } else {
      this.showMailingAddress = false;
      this.mailingAddress.controls['addressFormat'].clearValidators();
      this.mailingAddress.controls['addrLine1'].clearValidators();
      this.mailingAddress.controls['city'].clearValidators();
      this.mailingAddress.controls['state'].clearValidators();
      this.mailingAddress.controls['zipCode'].clearValidators();
      this.mailingAddress.controls['addressFormat'].updateValueAndValidity();
      this.mailingAddress.controls['addrLine1'].updateValueAndValidity();
      this.mailingAddress.controls['city'].updateValueAndValidity();
      this.mailingAddress.controls['state'].updateValueAndValidity();
      this.mailingAddress.controls['zipCode'].updateValueAndValidity();
    }
  }

  getPersonDetails(value) {
    this.submitted = true;
    this.findInvalidControls();
    this.checkAddressFormValidation = !this.checkAddressFormValidation;
    if (this.personDetailsForm.valid) {
      this.searchPersonPayLoad = {};
      const dob = new Date(this.getFormData().dobDt.value);
      this.searchPersonPayLoad = {
        addrReqMailing: {
          addrFormatCd: this.mailingAddress.controls.addressFormat.value,
          addrLine1: this.mailingAddress.controls.addrLine1.value,
          addrLine2: this.mailingAddress.controls.addrLine2.value,
          city: this.mailingAddress.controls.city.value,
          cntyCd: this.mailingAddress.controls.county.value,
          militaryPoCd: this.mailingAddress.controls.apoFpo.value,
          militaryStateCd: this.mailingAddress.controls.aaAeAp.value,
          stateCd: this.mailingAddress.controls.state.value,
          validatedAddressCd: '',
          zip: this.mailingAddress.controls.zipCode.value,
          zipExtn: this.mailingAddress.controls.ext.value
        },
        addrReqPhysical: {
          mailAddrSw: this.getFormData().isMailingAddressSame.value,
          addrFormatCd: this.physicalAddress.controls.addressFormat.value,
          addrLine1: this.physicalAddress.controls.addrLine1.value,
          addrLine2: this.physicalAddress.controls.addrLine2.value,
          city: this.physicalAddress.controls.city.value,
          cntyCd: this.physicalAddress.controls.county.value,
          militaryPoCd: this.physicalAddress.controls.apoFpo.value,
          militaryStateCd: this.physicalAddress.controls.aaAeAp.value,
          stateCd: this.physicalAddress.controls.state.value,
          validatedAddressCd: '',
          zip: this.physicalAddress.controls.zipCode.value,
          zipExtn: this.physicalAddress.controls.ext.value
        },
        aliasFirstName: this.getFormData().aliasFirstName.value,
        aliasLastName: this.getFormData().aliasLastName.value,
        aliasMidInitial: this.getFormData().aliasMi.value,
        dobDt: dob.toISOString(),
        firstName: this.getFormData().firstName.value,
        genderCd: this.getFormData().gender.value,
        lastName: this.getFormData().lastName.value,
        midInitial: this.getFormData().mi.value,
        ssn: this.getFormData().ssn.value
      };

      const appellantSearchSubscription$ = this.appealService.searchApplicantMdn(this.searchPersonPayLoad).subscribe(res => {
        this.searchPersonTableData = [];
        if (res.results !== undefined && res.results.recipients.length > 0) {
          res.results.recipients.forEach((data, i) => {
            data.isSelected = false;
            data.index = i;
          });
          this.searchPersonTableData = res.results.recipients;

        }
        this.showPersonTable = true;
      });
      this.subscriptions$.push(appellantSearchSubscription$);

    }
  }

  findInvalidControls() {
    const invalid = [];
    const controls = this.personDetailsForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }

  searchForThePerson() {
    this.showPersonTable = true;
  }

  emitAddIndividual(value) {
    this.selectedMdnPerson = {};
    if (value.isSelected) {
      if (!this.isHelpDeskUser) {
        this.showAppealRepresentative = true;
        this.showAppealType = true;
      }
      if (value.data === undefined) {
        this.addIndividualSelected = true;
        this.modifiedAppealTypeData = [{ code: 'PR', value: 'PASRR', activateSW: 'Y' },
        { code: 'PA', value: 'PAE', activateSW: 'Y' }];
        this.personId = '';
        this.createAppealId(this.personId);
      } else {
        this.addIndividualSelected = false;
        this.modifiedAppealTypeData = this.appealType;
        this.selectedMdnPerson = value.data;
        this.personId = value.data.sourceRecipientId;
        this.createAppealId(this.personId);
      }
    } else {
      this.showAppealRepresentative = false;
      this.showAppealType = false;
      this.isNextEnabled = value.isSelected;
    }
  }

  createAppealId(personId) {
    let payLoad: any;
    const appelantInfo = this.dataFromAppealStart.appealStartFormData;
    if (appelantInfo.recByOtherDep === undefined) {
      appelantInfo.recByOtherDep = 'N';
    }
    const appealStartDetails = {
      aplExpectOutcome: appelantInfo.aplExpectOutcome,
      aplFilMthdCd: appelantInfo.filingMethod,
      aplMistake: appelantInfo.aplMistake,
      aplRcvdDt: this.convertDate(appelantInfo.appealRecievedDate),
      aplRcvdOthrDeptSw: appelantInfo.recByOtherDep,
      ltssRcvdAplDt: this.convertDate(appelantInfo.ltssRecievedDate),
      othrDeptNameCd: appelantInfo.otherDepartmentNameDetails,
      whoFilingAplCd: appelantInfo.filingAppeal
    };
    if (personId === '') {
      payLoad = {
        appealDetailsVO: appealStartDetails,
        personDetailsReqVO: {
          addrReqPhysical: {
            addrFormatCd: this.physicalAddress.controls.addressFormat.value,
            addrLine1: this.physicalAddress.controls.addrLine1.value,
            addrLine2: this.physicalAddress.controls.addrLine2.value,
            city: this.physicalAddress.controls.city.value,
            cntyCd: this.physicalAddress.controls.county.value == null ? '' : this.physicalAddress.controls.county.value,
            militaryPoCd: this.physicalAddress.controls.apoFpo.value,
            militaryStateCd: this.physicalAddress.controls.aaAeAp.value,
            stateCd: this.physicalAddress.controls.state.value,
            validatedAddressCd: '',
            zip: this.physicalAddress.controls.zipCode.value,
            zipExtn: this.physicalAddress.controls.ext.value,
            mailAddrSw: this.getFormData().isMailingAddressSame.value
          },
          addrReqMailing: {
            addrFormatCd: this.mailingAddress.controls.addressFormat.value,
            addrLine1: this.mailingAddress.controls.addrLine1.value,
            addrLine2: this.mailingAddress.controls.addrLine2.value,
            city: this.mailingAddress.controls.city.value,
            cntyCd: this.mailingAddress.controls.county.value == null ? '' : this.mailingAddress.controls.county.value,
            militaryPoCd: this.mailingAddress.controls.apoFpo.value,
            militaryStateCd: this.mailingAddress.controls.aaAeAp.value,
            stateCd: this.mailingAddress.controls.state.value,
            validatedAddressCd: '',
            zip: this.mailingAddress.controls.zipCode.value,
            zipExtn: this.mailingAddress.controls.ext.value
          },
          aliasFirstName: this.getFormData().aliasLastName.value,
          aliasLastName: this.getFormData().aliasLastName.value,
          aliasMidInitial: this.getFormData().aliasMi.value,
          dobDt: this.convertDate(this.getFormData().dobDt.value),
          firstName: this.getFormData().firstName.value,
          genderCd: this.getFormData().gender.value,
          lastName: this.getFormData().lastName.value,
          midInitial: this.getFormData().mi.value,
          ssn: this.getFormData().ssn.value,
          aliasNameSw: this.getFormData().haveOtherName.value,
          aliasSuffix: this.getFormData().aliasSuffix.value,
          cellPhNum: this.getFormData().cellPhone.value,
          emailAddr: this.getFormData().emailAddress.value,
          homePhNum: this.getFormData().homePhone.value,
          interprtLang: '',
          prefLangLettersCd: this.getFormData().language.value,
          prefPhTypeCd: this.getFormData().phoneType.value,
          ssnAvalSw: this.getFormData().ssnAvailableSw.value,
          suffix: this.getFormData().suffix.value,
          workPhNum: this.getFormData().workPhone.value
        },
        prsnId: personId,
      };
    } else {
      payLoad = {
        appealDetailsVO: appealStartDetails,
        personDetailsReqVO: {},
        prsnId: personId,
      };
    }
    this.appealService.createAppeal(payLoad).subscribe(res => {
      this.appealId = res.aplId;
      this.getAppellantDetails(res.aplId);
      if (this.isHelpDeskUser) {
        this.isNextEnabled = true;
      } else {
        this.isNextEnabled = false;
      }
    });
  }

  getAppellantDetails(aplId) {
    const GetAppealDetailsSubscriptions = this.appealService.getAppealDetails(aplId).subscribe(res => {
      if (res) {
        this.appellantInfo = res;
        const tempObj = {
          aplId: res.aplId ? res.aplId : null,
          paeId: res.paeId ? res.paeId : null,
          applicantName: res.firstName + ' ' + res.lastName,
          prsnId: this.personId ? this.personId : null,
          refId: res.refId ? res.refId : null
        };
        this.rightnavToggleService.setRightnavFlag(true);
        this.rightnavToggleService.setRightNavCategoryCode('APL');
        this.rightnavToggleService.setRightNavProgramCode('APL');
        this.rightnavToggleService.setRightnavData(tempObj);
        this.appealCreatedData.emit(res);
      }
    }, error => {
      const tempObj = {
        aplId: this.appealId ? this.appealId : null,
        paeId: null,
        applicantName: this.getFormData().firstName.value + ' ' + this.getFormData().lastName.value,
        prsnId: this.personId,
        refId: null
      };
      this.rightnavToggleService.setRightnavFlag(true);
      this.rightnavToggleService.setRightnavData(tempObj);
    });
    this.subscriptions$.push(GetAppealDetailsSubscriptions);
  }

  getAppealType(value) {
    this.appealTypeCd = value;
    let input = '';
    this.selectedAppealType = value;
    if (value === 'PA' || value === 'DE' || value === 'EN') {
      input = 'PA&prsnId=' + this.personId;
    } else if (value === 'RF') {
      input = 'RF&prsnId=' + this.personId;
    } else if (value === 'PR') {
      return;
    }
    if (!this.addIndividualSelected) {
      const appealTypeSubscription$ = this.appealService.getAppealType(input).subscribe(res => {
        this.appealTypeData = res;
        this.subscriptions$.push(appealTypeSubscription$);
      });
    } else {
      this.isNextEnabled = true;
    }
  }

  dataToLinkAppealType(data) {
    if (data) {
      this.referralId = data.data.refId;
      this.paeId = data.data.paeId;
    }
    this.linkedAppealData = data;
    this.isNextEnabled = data.isSelected;
  }

  nextClicked() {
    console.log('NEXT CLICKED');
  }

  addedRepresentativeList(data) {
    this.aplRepresentativeReqVO = [];
    data.forEach(representative => {
      const obj = {
        addrTypeCd: '',
        authRepSw: representative.authoriedRepresentative,
        cellPhNum: representative.cellPhone,
        email: representative.emailAddress,
        firstName: representative.firstName,
        homePhNum: representative.homePhone,
        lastName: representative.lastName,
        midInitial: representative.mi,
        organizationName: representative.organizationName,
        othrVerfctnSrcDtls: representative.otherVerificationDetails,
        phiPermissionSw: representative.healthPermission,
        prefPhTypeCd: representative.phoneType,
        reltshpCd: representative.appellantRelationship,
        suffix: representative.suffix,
        validatedAddrCd: '',
        verfctnEndDt: this.convertDate(representative.verificationEndDate),
        verfctnSourceCd: representative.verificationSource,
        verifiedDt: this.convertDate(representative.dateVerified),
        workPhNum: representative.workPhone,
        sameMailAddrSw: representative.isMailingAddressSame,
        addressRequestVO: {
          aaAeApCd: representative.mailingAddress.aaAeAp,
          addrFormatCd: representative.mailingAddress.addressFormat,
          addrLine1: representative.mailingAddress.addrLine1,
          addrLine2: representative.mailingAddress.addrLine2,
          city: representative.mailingAddress.city,
          cntyCd: representative.mailingAddress.county,
          apoFpoCd: representative.mailingAddress.apoFpo,
          stateCd: representative.mailingAddress.state,
          zip: representative.mailingAddress.zipCode,
          zipExtn: representative.mailingAddress.ext
        }
      };
      this.aplRepresentativeReqVO.push(obj);
    });
  }

  convertDate(input) {
    if (input !== undefined) {
      const date = new Date(input).toISOString();
      return date;
    } else {
      return '';
    }

  }

  addPasrrData(data) {
    this.selectedPasrrData = data.data;
    this.passrPayLoad = {};
    this.passrPayLoad = {
      clientId: data.data.clientId,
      episodeId: data.data.episodeId,
      pasrrAdverseActionCd: data.data.pasrrActionReason,
      pasrrAdverseActionDate: this.convertDate(data.data.pasrrActionDate),
      pasrrRsnCd: data.data.pasrrReason,
      payorSourceCd: data.data.payorSource
    };
    if (data.form.valid) {
      this.isPassrFormValid = true;
      this.isNextEnabled = true;
    } else {
      this.isPassrFormValid = false;
      this.isNextEnabled = false;
    }
  }


  saveNext() {
    let passrData: any;
    if (this.appealTypeCd === 'PR') {
      passrData = this.passrPayLoad;
    } else {
      passrData = null;
    }
    const payLoad = {
      aplRepresentativeReqVOList: this.aplRepresentativeReqVO,
      aplTypCd: this.appealTypeCd,
      pasrrReqVO: passrData,
      prsnId: this.personId,
      refId: this.referralId,
      paeId: this.paeId,
      aplId: this.appealId
    };
    const saveAppellantDetailsSub$ = this.appealService.saveAppellantDetails(payLoad).subscribe(res => {
      this.gotoNextStepper(this.appealId);
    });
    this.subscriptions$.push(saveAppellantDetailsSub$);
  }

  gotoNextStepper(appealId) {
    let nextForm = '';
    let isLinear: boolean;
    if (this.addIndividualSelected && this.appealTypeCd === 'PA') {
      nextForm = 'APPEAL_RESOLUTION';
      isLinear = false;
    } else {
      nextForm = 'APPEAL_REVIEW';
      isLinear = false;
    }
    const nextStepperData = {
      nextStepper: AppealStepper[nextForm],
      dataFromAppealDetails: {
        aplId: appealId
      },
      passrRefrenceTableCodes: {
        pasrrReason: this.pasrrReason,
        payorSource: this.payorSource,
        pasrrAdverseReason: this.pasrrAdverseReason
      },
      isLinear
    };
    this.completedAppellantDetails.emit(nextStepperData);
  }


  back() {
    const previousForm = 'START';
    const nextStepperData = { nextStepper: AppealStepper[previousForm] };
    this.completedAppellantDetails.emit(nextStepperData);
  }

  submit() {
    this.router.navigate(['/ltss/appeals/appealsDashboard'], { state: { isHelpDeskUser: this.isHelpDeskUser } });
  }


  ngOnDestroy() {
    if (this.subscriptions$ && this.subscriptions$.length > 0) {
      this.subscriptions$.forEach(subscription$ => subscription$.unsubscribe());
    }
  }

}
