import { CustomvalidationService } from '../../_shared/utility/customvalidation.service';
import { MatTableDataSource } from '@angular/material/table';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { RefApplicantDetail } from '../../_shared/model/RefApplicantDetail';
import { RefCoreDtl } from '../../_shared/model/RefCoreDtl';
import { Applicant } from '../../_shared/model/Applicant';
import { ApplicantAddress } from '../../_shared/model/ApplicantAddress';
import { ReferralFlowSeq } from '../../_shared/utility/ReferralFlowSeq';
import { SearchPerson } from '../../_shared/model/SearchPerson';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';
import { animate, state, style, transition, trigger } from '@angular/animations';
import * as customValidation from '../../_shared/constants/validation.constants';
import { ExternalreferralService } from '../services/externalreferral.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ExtrefPersonMatchComponent } from '../extref-person-match/extref-person-match.component';
import { MatHorizontalStepper } from '@angular/material/stepper';
import { ToastrService } from 'ngx-toastr';
import { MatSelectChange } from '@angular/material/select';
import { ExtrefAddressValidationComponent } from 'src/app/_shared/components/extref-address-validation/extref-address-validation.component';
import * as Constants from '../../_shared/constants/application.constants';
import * as CryptoJS from 'crypto-js';
export interface ReferralSearchElements {
  id: number;
  firstName: string;
  aliasName: string;
  ssn: string;
  paeId: string;
  personID: string;
  physicalAddress: string;
  mailingAddress: string;
  county: string;
  birthDate: any;
  personId: number;
  receivedInQueue: any;
  paeSubmissionDate: any;
  taskStatus: string;
  queueName: string;
  assignedUser: string;

}

@Component({
  selector: 'app-extref-applicant-information',
  templateUrl: './extref-applicant-information.component.html',
  styleUrls: ['./extref-applicant-information.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ExtrefApplicantInformationComponent implements OnInit {
  // @Output() completedStart: EventEmitter<any> = new EventEmitter<any>();
  @Input() stepper: MatHorizontalStepper;
  refApplicantForm: FormGroup;
  @Output() completedApplicant: EventEmitter<any> = new EventEmitter<any>();
  applicantComponentComplete = false;
  applicantComponentStep = false;
  isSearchPerson = false;
  birthdayDateString: string;
  myForm: FormGroup;
  customValidation = customValidation;
  minDate: Date;
  maxDate: Date;
  refSearchPerson: string[] = ['personName', 'ssn', 'birthDate', 'personID',
    'county'];
  dataSource: MatTableDataSource<any>;
  expandedElement: ReferralSearchElements | null;
  submissionDate: string;
  physicalAddress: any;
  mailingAddress: any;
  enableNext = true;
  fileClearanceSw: any;
  newPersonSw: any;
  entityId: any;
  entityType = "";
  alreadyEnrolled: any;
  exactMatchSwitch = false;
  isTN = false;
  isTN2 = false;
  prsonId: any;
  alreadyEnrolledSw: boolean;
  genderList: any[];
  genders: any[];
  showSpinner = false;
  startDate = new Date();
  constructor(
    private fb: FormBuilder,
    private customValidator: CustomvalidationService,
    private extRefService: ExternalreferralService,
    private matDialog: MatDialog,
    private toastr: ToastrService) { }

  age: number;
  refApplicantDetail: RefApplicantDetail;
  searchPerson: SearchPerson;
  alternateNameSW = false;
  mailAddrSW = true;
  addrFormatSW = false;
  mailAddrFormatSW = false;
  today: Date;
  submitted = false;
  isAddressValidated = false;
  isMailingAddressValidated = false;
  suffixDropdowns = [];
  subscriptions$ = [];
  genderDropdowns = [];
  addressDropdowns = [];
  stateDropdowns = [];
  countyDropdowns = [];
  miltaryPoDropdowns = [];
  miltaryStateDropdowns = [];
  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.minHeight = '350px';
    dialogConfig.minWidth = '650px';
    this.matDialog.open(ExtrefPersonMatchComponent, dialogConfig);
  }
  ngOnInit(): void {
    const timeTravelData = localStorage.getItem('TIME_TRAVEL_DATA');
    if(timeTravelData) {
      const timeTravelDataJson = JSON.parse(CryptoJS.AES.decrypt(timeTravelData, Constants.APP_ENC_DECRYPT_KEY).toString(CryptoJS.enc.Utf8));
      console.log("timeTravelDataJson ", timeTravelDataJson);
      if(timeTravelDataJson.timeTravelFlag && timeTravelDataJson.currentDate) {
        this.startDate = new Date(timeTravelDataJson.currentDate);
      }
    }
    const SuffixDropdownSubscriptions = this.extRefService.getSearchDropdowns('NAME_SUFFIX').subscribe(response => {
      this.suffixDropdowns = response;
    });
    this.subscriptions$.push(SuffixDropdownSubscriptions);
    const genderDropdownSubscriptions = this.extRefService.getSearchDropdowns('GENDER').subscribe(response => {
      this.genderDropdowns = response.sort((a, b) => (a.value > b.value) ? 1 : -1);
    });
    this.subscriptions$.push(genderDropdownSubscriptions);
    const addressDropdownSubscriptions = this.extRefService.getSearchDropdowns('ADDRESS_FORMAT').subscribe(response => {
      this.addressDropdowns = response.sort((a, b) => (a.value > b.value) ? 1 : -1);
    });
    this.subscriptions$.push(addressDropdownSubscriptions);
    this.subscriptions$.push(genderDropdownSubscriptions);
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


    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 119, 0, 1);
    this.maxDate = new Date();
    this.isTN = true;
    this.isTN2 = true;
    this.refApplicantForm = this.fb.group({
      firstName: ['', [Validators.required, this.customValidator.nameValidator()]],
      lastName: ['', [Validators.required, this.customValidator.nameValidator()]],
      midInitial: [''],
      dobDt: ['', [Validators.required]],
      suffix: [''],
      genderCd: [''],
      ssn: ['', [Validators.required]],
      aliasFirstName: [''],
      aliasLastName: [''],
      aliasMidInitial: ['', [Validators.maxLength(1), Validators.pattern('^[a-zA-Z]*$')]],
      ssnAvailableSw: [false],
      altNameSw: ['', [Validators.required]],
      aliasSuffix: [''],
      mailAddrSw: ['',[Validators.required]],
      addrFormatCd: ['US'],
      addrLine1: [
        '',
        [
          Validators.required,
          Validators.maxLength(100),
          Validators.pattern('^[A-Za-z0-9 ]+$'),
        ],
      ],
      addrLine2: [
        '',
        [Validators.maxLength(50), Validators.pattern('^[A-Za-z0-9 ]+$')],
      ],
      stateCd: ['TN', [Validators.required]],
      city: [
        '',
        [
          Validators.required,
          Validators.maxLength(25),
          this.customValidator.addressAndCityValidator(),
        ],
      ],
      zip: ['', [Validators.required, Validators.pattern('[0-9]{5}')]],
      zipExtn: [''],
      cntyCd: ['',[Validators.required]],
      militaryPoCd: [''],
      militaryStateCd: [''],
      mailAddressFormatCd: ['US'],
      mailAddrLine1: [
        '',
        [
          Validators.required,
          Validators.maxLength(100),
          Validators.pattern('^[A-Za-z0-9 ]+$'),
        ],
      ],
      mailAddrLine2: [
        '',
        [Validators.maxLength(50), Validators.pattern('^[A-Za-z0-9 ]+$')],
      ],
      mailCity: [
        ''],
      mailState: ['TN'],
      mailZip: ['', [Validators.required, Validators.pattern('[0-9]{5}')]],
      mailZipExtn: [''],
      mailCounty: [''],
      mailMilitaryPoCd: [''],
      mailMilitaryStateCd: [''],
    });
    this.extRefService.stepReady(this.refApplicantForm, "two");

  }

  calculateAge(event) {
    this.today = new Date();
    const birthDate = new Date(event.value);
    this.birthdayDateString = birthDate.toJSON();
    let age = this.today.getFullYear() - birthDate.getFullYear();
    const m = this.today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && this.today.getDate() < birthDate.getDate())) {
      age--;
    }
    this.age = age;
    this.extRefService.changeParam(age);

  }
  getFormData() {
    return this.refApplicantForm.controls;
  }



  sendingYorN(ssnAvailableCheck) {
    if (ssnAvailableCheck) {
      return 'Y';
    } else {
      return 'N';
    }
  }
  

  saveRefandApplicant(): any {
    this.submitted = true;
    this.enableNext = false;
    this.showSpinner = true;
    
    const addressVO = new ApplicantAddress(
      this.getFormData().addrFormatCd.value,
      this.getFormData().addrLine1.value,
      this.getFormData().addrLine2.value,
      this.getFormData().city.value,
      this.getFormData().cntyCd.value,
      this.getFormData().mailAddrLine1.value,
      this.getFormData().mailAddrLine2.value,
      this.getFormData().mailAddressFormatCd.value,
      this.getFormData().mailAddrSw.value,
      this.getFormData().mailCity.value,
      this.getFormData().mailCounty.value,
      this.getFormData().mailState.value,
      null,
      this.getFormData().mailZip.value,
      this.getFormData().mailZipExtn.value,
      this.getFormData().militaryStateCd.value,
      this.getFormData().militaryPoCd.value,
      null,
      'PERAI',
      this.getFormData().stateCd.value,
      null,
      this.getFormData().zipExtn.value,
      this.getFormData().zip.value
    );
    const applicant = new Applicant(
      null,
      this.prsonId,
      this.getFormData().aliasFirstName.value,
      this.getFormData().aliasLastName.value,
      this.getFormData().aliasMidInitial.value,
      this.getFormData().aliasSuffix.value,
      this.getFormData().altNameSw.value,
      this.birthdayDateString,
      this.getFormData().firstName.value,
      this.getFormData().genderCd.value,
      this.getFormData().lastName.value,
      this.getFormData().midInitial.value,
      this.getFormData().ssn.value,
      this.sendingYorN(this.getFormData().ssnAvailableSw.value),
      this.getFormData().suffix.value,
      true,
      'PERAI',
      this.fileClearanceSw,
      this.newPersonSw,
      this.entityId,
      this.entityType,
      addressVO
    );

    if (this.today) {
      this.submissionDate = this.today.toJSON();
    }

    this.refApplicantDetail = this.extRefService.startInfoData$$.value;

    const refCoreDtl = new RefCoreDtl(
      'PERAI',
      '0',
      null,
      null,
      null,
      'Test',
      'N',
      'N',
      '0',
      'ECF',
      'OTHR',
      'EXT',
      this.submissionDate,
      this.submissionDate,
      'PS',
      this.refApplicantDetail,
      applicant
    );
    return refCoreDtl;
  }

  validateAndCallNxtBtnClick(): void {
    this.submitted = true;
    if (this.refApplicantForm.valid) {
      this.showSpinner = true;
      this.enableNext = false;
      this.onNextBtnClick();
    }else{
      this.toastr.error("Please fill in the required value")
      this.showSpinner = false;
      this.enableNext = true;
    }

   
    
  }
        
  onNextBtnClick(): void {
    if (this.refApplicantForm.valid) {
      this.showSpinner = true;
      this.enableNext = false;
    }
    const addressVO = new ApplicantAddress(
      this.getFormData().addrFormatCd.value,
      this.getFormData().addrLine1.value,
      this.getFormData().addrLine2.value,
      this.getFormData().city.value,
      this.getFormData().cntyCd.value,
      this.getFormData().mailAddressFormatCd.value,
      this.getFormData().mailAddrLine1.value,
      this.getFormData().mailAddrLine2.value,
      this.getFormData().mailAddressFormatCd.value,
      this.getFormData().mailAddrSw.value,
      this.getFormData().mailCity.value,
      this.getFormData().mailCounty.value,
      this.getFormData().mailState.value,
      this.getFormData().mailZipExtn.value,
      this.getFormData().mailZip.value,
      this.getFormData().militaryStateCd.value,
      this.getFormData().militaryPoCd.value,
      null,
      'PERAI',
      this.getFormData().stateCd.value,
      null,
      this.getFormData().zipExtn.value,
      this.getFormData().zip.value
    );

    const searchApplicant = new Applicant(
      null,
      null,
      this.getFormData().aliasFirstName.value,
      this.getFormData().aliasLastName.value,
      this.getFormData().aliasMidInitial.value,
      this.getFormData().aliasSuffix.value,
      this.getFormData().altNameSw.value,
      this.birthdayDateString,
      this.getFormData().firstName.value,
      this.getFormData().genderCd.value,
      this.getFormData().lastName.value,
      this.getFormData().midInitial.value,
      this.getFormData().ssn.value.replaceAll('-', ''),
      this.sendingYorN(this.getFormData().ssnAvailableSw.value),
      this.getFormData().suffix.value,
      true,
      'PERAI',
      null,
      null,
      null,
      null,
      addressVO
    );

    this.extRefService.postSearchPerson(searchApplicant).subscribe((res) => {
      this.fileClearanceSw = res[0].fileClearanceSw;
      this.newPersonSw = res[0].newPersonSw;
      this.alreadyEnrolled = res[0].alreadyEnrolled;
      this.prsonId = res[0].prsnId;
      if (this.fileClearanceSw === 'Y' && this.newPersonSw === 'N') {
        this.isSearchPerson = true;
      }else {
        this.isSearchPerson = false;
      }
      this.exactMatchSwitch = true;
      if (this.alreadyEnrolled === 'true' || (this.fileClearanceSw === 'Y' && this.newPersonSw === 'N')) {
        this.openDialog();
        this.alreadyEnrolledSw = true;
      } else {
        const applicantInfoData = this.saveRefandApplicant();
        this.extRefService.applicantInfoData$$.next(applicantInfoData);
        this.completedApplicant.emit(ReferralFlowSeq['PERCI']);

        this.stepper.next();
      }
    });
  }


  onSsnOptionChange(event) {
    if (event.checked) {
      this.getFormData().ssn.disable();
      this.toastr.warning(this.customValidation.C3, '', {
        timeOut: 4000,
        positionClass: 'toast-top-full-width',
      });
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

  validateAddress() {
    if (
      this.getFormData().addrLine1.status !== 'INVALID' &&
      this.getFormData().addrLine2.status !== 'INVALID' &&
      this.getFormData().city.status !== 'INVALID' &&
      this.getFormData().stateCd.status !== 'INVALID' &&
      this.getFormData().zipExtn.status !== 'INVALID' &&
      this.getFormData().zip.status !== 'INVALID' &&
      this.getFormData().cntyCd.status !== 'INVALID'
    ) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.width = '720px';
      dialogConfig.height = '522px';
      dialogConfig.data = {
        addrLine1: this.getFormData().addrLine1.value,
        addrLine2: this.getFormData().addrLine2.value,
        city: this.getFormData().city.value,
        state: this.getFormData().stateCd.value,
        zipCode: this.getFormData().zip.value,
        ext: this.getFormData().zipExtn.value,
        county: this.getFormData().cntyCd.value,
      };
      const dialogRef = this.matDialog.open(
        ExtrefAddressValidationComponent,
        dialogConfig
      );
      dialogRef.afterClosed().subscribe((address) => {
        if (address) {
          this.getFormData().addrLine1.setValue(address.addrLine1);
          this.getFormData().addrLine2.setValue(address.addrLine2);
          this.getFormData().city.setValue(address.city);
          this.getFormData().stateCd.setValue(address.state);
          this.getFormData().zip.setValue(address.zipCode);
          this.getFormData().zipExtn.setValue(address.ext);
          console.log(address);
        }
      });
    }
  }

  trackState(msChange: MatSelectChange) {
    if (msChange.value === 'TN') {
      this.isTN = true;
      this.getFormData().cntyCd.setValidators([Validators.required]);
    } else {
      this.isTN = false;
      this.getFormData().cntyCd.clearValidators();
      this.getFormData().cntyCd.patchValue('NA');
    }
    this.getFormData().cntyCd.updateValueAndValidity();
  }

  trackStateAlt(msChange: MatSelectChange) {
    if (msChange.value === 'TN') {
      this.isTN2 = true;
      this.getFormData().mailCounty.setValidators([Validators.required]);
    } else {
      this.isTN2 = false;
      this.getFormData().mailCounty.clearValidators();
    }
    this.getFormData().mailCounty.updateValueAndValidity();
  }

  onAlternateNameChange(mrChange: MatRadioChange) {
    if (mrChange.value === 'N') {
      this.alternateNameSW = false;
      this.getFormData().aliasFirstName.setValue(null);
      this.getFormData().aliasMidInitial.setValue(null);
      this.getFormData().aliasLastName.setValue(null);
      this.getFormData().aliasFirstName.markAsUntouched();
      this.getFormData().aliasMidInitial.markAsUntouched();
      this.getFormData().aliasLastName.markAsUntouched();
      this.getFormData().aliasFirstName.clearValidators();
      this.getFormData().aliasMidInitial.clearValidators();
      this.getFormData().aliasLastName.clearValidators();
     
    }
    else if (mrChange.value === 'Y') {
      this.alternateNameSW = true;
      this.getFormData().aliasFirstName.setValidators([
        Validators.required,
        Validators.maxLength(45),
        this.customValidator.nameValidator(),
      ]);
      this.getFormData().aliasMidInitial.setValidators([
        Validators.maxLength(1),
        Validators.pattern('^[a-zA-Z]*$'),
      ]);
      this.getFormData().aliasLastName.setValidators([
        Validators.required,
        Validators.maxLength(45),
        this.customValidator.nameValidator(),
      ]);
    }
    this.getFormData().aliasFirstName.updateValueAndValidity();
    this.getFormData().aliasMidInitial.updateValueAndValidity();
    this.getFormData().aliasLastName.updateValueAndValidity();
  }



  onMailAddrChange(mrChange: MatRadioChange) {
    if (mrChange.value === 'N') {
      this.mailAddrSW = false;
      this.getFormData().mailAddrLine1.setValidators([Validators.required, Validators.maxLength(100), Validators.pattern('^[A-Za-z0-9 ]+$')]);
      this.getFormData().mailAddrLine2.setValidators([Validators.maxLength(50), Validators.pattern('^[A-Za-z0-9 ]+$')]);
      this.getFormData().mailZip.setValidators([Validators.required, Validators.pattern('[0-9]{5}')]);   
    } else if (mrChange.value === 'Y') {
      this.getFormData().mailAddrLine1.clearValidators();
      this.getFormData().mailAddrLine2.clearValidators();
      this.getFormData().mailZip.clearValidators();
      this.getFormData().mailAddrLine1.setValue(null);
      this.getFormData().mailAddrLine2.setValue(null);
      this.getFormData().mailCity.setValue(null);
      this.getFormData().mailCounty.setValue(null);
      this.getFormData().mailState.setValue(null);
      this.getFormData().mailZip.setValue(null);
      this.getFormData().mailZipExtn.setValue(null);
      this.getFormData().mailCounty.setValue(null);
      this.getFormData().mailMilitaryPoCd.setValue(null);
      this.getFormData().mailMilitaryStateCd.setValue(null);
      this.getFormData().mailAddrLine1.markAsUntouched();
      this.getFormData().mailAddrLine2.markAsUntouched();
      this.getFormData().mailCity.markAsUntouched();
      this.getFormData().mailState.markAsUntouched();
      this.getFormData().mailZipExtn.markAsUntouched();
      this.getFormData().mailZip.markAsUntouched();
      this.getFormData().mailCounty.markAsUntouched();
      this.getFormData().mailMilitaryPoCd.markAsUntouched();
      this.getFormData().mailMilitaryStateCd.markAsUntouched();
     
      this.mailAddrSW = true;
    }
    this.getFormData().mailAddrLine1.updateValueAndValidity();
    this.getFormData().mailAddrLine2.updateValueAndValidity();
    this.getFormData().mailCity.updateValueAndValidity();
    this.getFormData().mailState.updateValueAndValidity();
    this.getFormData().mailZipExtn.updateValueAndValidity();
    this.getFormData().mailZip.updateValueAndValidity();
    this.getFormData().mailCounty.updateValueAndValidity();
    this.getFormData().mailMilitaryPoCd.updateValueAndValidity();
    this.getFormData().mailMilitaryStateCd.updateValueAndValidity();
  }



  validateMailAddress() {
    if (
      this.getFormData().mailAddrLine1.status !== 'INVALID' &&
      this.getFormData().mailAddrLine2.status !== 'INVALID' &&
      this.getFormData().mailCity.status !== 'INVALID' &&
      this.getFormData().mailState.status !== 'INVALID' &&
      this.getFormData().mailZipExtn.status !== 'INVALID' &&
      this.getFormData().mailZip.status !== 'INVALID' &&
      this.getFormData().mailCounty.status !== 'INVALID'
    ) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.width = '720px';
      dialogConfig.height = '522px';
      dialogConfig.data = {
        addrLine1: this.getFormData().mailAddrLine1.value,
        addrLine2: this.getFormData().mailAddrLine2.value,
        city: this.getFormData().mailCity.value,
        state: this.getFormData().mailState.value,
        zipCode: this.getFormData().mailZip.value,
        ext: this.getFormData().mailZipExtn.value,
        cntyCd: this.getFormData().mailCounty.value,
      };
      const dialogRef = this.matDialog.open(
        ExtrefAddressValidationComponent,
        dialogConfig
      );
      dialogRef.afterClosed().subscribe((address) => {
        if (address) {
          this.getFormData().mailAddrLine1.setValue(address.addrLine1);
          this.getFormData().mailAddrLine2.setValue(address.addrLine2);
          this.getFormData().mailCity.setValue(address.city);
          this.getFormData().mailState.setValue(address.state);
          this.getFormData().mailZip.setValue(address.zipCode);
          this.getFormData().mailZipExtn.setValue(address.ext);
          console.log(address);
        }
      });
    }
  }
  onMailAddressFormat(event) {
    this.getFormData().mailAddrLine1.setValue(null);
    this.getFormData().mailAddrLine2.setValue(null);
    this.getFormData().mailCity.setValue(null);
    this.getFormData().mailCounty.setValue(null);
    this.getFormData().mailState.setValue(null);
    this.getFormData().mailZip.setValue(null);
    this.getFormData().mailZipExtn.setValue(null);
    this.getFormData().mailCounty.setValue(null);
    this.getFormData().mailMilitaryPoCd.setValue(null);
    this.getFormData().mailMilitaryStateCd.setValue(null);
    this.getFormData().mailAddrLine1.markAsUntouched();
    this.getFormData().mailAddrLine2.markAsUntouched();
    this.getFormData().mailCity.markAsUntouched();
    this.getFormData().mailState.markAsUntouched();
    this.getFormData().mailZipExtn.markAsUntouched();
    this.getFormData().mailZip.markAsUntouched();
    this.getFormData().mailCounty.markAsUntouched();
    this.getFormData().mailMilitaryPoCd.markAsUntouched();
    this.getFormData().mailMilitaryStateCd.markAsUntouched();
    this.getFormData().mailAddrLine1.updateValueAndValidity();
    this.getFormData().mailAddrLine2.updateValueAndValidity();
    this.getFormData().mailCity.updateValueAndValidity();
    this.getFormData().mailState.updateValueAndValidity();
    this.getFormData().mailZipExtn.updateValueAndValidity();
    this.getFormData().mailZip.updateValueAndValidity();
    this.getFormData().mailCounty.updateValueAndValidity();
    this.getFormData().mailMilitaryPoCd.updateValueAndValidity();
    this.getFormData().mailMilitaryStateCd.updateValueAndValidity();
    if (event.source.value === 'MA') {
      this.mailAddrFormatSW = true;
      this.getFormData().mailMilitaryPoCd.setValidators([Validators.required]);
      this.getFormData().mailMilitaryStateCd.setValidators([Validators.required]);
      this.getFormData().mailCity.clearValidators();
      this.getFormData().mailState.clearValidators();
      this.getFormData().mailCounty.clearValidators();
    } else {
      this.mailAddrFormatSW = false;
      this.getFormData().mailCity.setValidators([Validators.required, Validators.maxLength(25), this.customValidator.addressAndCityValidator()]);
      this.getFormData().mailState.setValidators([Validators.required]);
      this.getFormData().mailMilitaryPoCd.clearValidators();
      this.getFormData().mailMilitaryStateCd.clearValidators();
    }
    console.log(this.mailAddrFormatSW);
    this.getFormData().mailCity.updateValueAndValidity();
    this.getFormData().mailState.updateValueAndValidity();
    this.getFormData().mailCounty.updateValueAndValidity();
    this.getFormData().mailMilitaryPoCd.updateValueAndValidity();
    this.getFormData().mailMilitaryStateCd.updateValueAndValidity();
  }
  onAddressFormat(event) {
    this.getFormData().addrLine1.setValue(null);
    this.getFormData().addrLine2.setValue(null);
    this.getFormData().city.setValue(null);
    this.getFormData().stateCd.setValue(null);
    this.getFormData().zipExtn.setValue(null);
    this.getFormData().zip.setValue(null);
    this.getFormData().cntyCd.setValue(null);
    this.getFormData().addrLine1.markAsUntouched();
    this.getFormData().addrLine2.markAsUntouched();
    this.getFormData().city.markAsUntouched();
    this.getFormData().stateCd.markAsUntouched();
    this.getFormData().zipExtn.markAsUntouched();
    this.getFormData().zip.markAsUntouched();
    this.getFormData().cntyCd.markAsUntouched();
    this.getFormData().addrLine1.updateValueAndValidity();
    this.getFormData().addrLine2.updateValueAndValidity();
    this.getFormData().city.updateValueAndValidity();
    this.getFormData().stateCd.updateValueAndValidity();
    this.getFormData().zipExtn.updateValueAndValidity();
    this.getFormData().zip.updateValueAndValidity();
    this.getFormData().cntyCd.updateValueAndValidity();
    if (event.source.value === 'MA') {
      this.addrFormatSW = true;
      this.getFormData().city.clearValidators();
      this.getFormData().stateCd.clearValidators();
      this.getFormData().cntyCd.clearValidators();
      this.getFormData().militaryPoCd.setValidators([Validators.required]);
      this.getFormData().militaryStateCd.setValidators([Validators.required]);
    } else {
      this.addrFormatSW = false;
      this.getFormData().city.setValidators([Validators.required, Validators.maxLength(25), this.customValidator.addressAndCityValidator()]);
      this.getFormData().stateCd.setValidators([Validators.required]);
      if(this.getFormData().stateCd.value === 'TN'){
        this.getFormData().cntyCd.setValidators([Validators.required]);
      }
      else if(this.getFormData().stateCd.value !== 'TN'){
        this.getFormData().cntyCd.clearValidators();
      }
      this.getFormData().militaryPoCd.clearValidators();
      this.getFormData().militaryStateCd.clearValidators();
    }
    this.getFormData().city.updateValueAndValidity();
    this.getFormData().stateCd.updateValueAndValidity();
    this.getFormData().cntyCd.updateValueAndValidity();
    this.getFormData().militaryPoCd.updateValueAndValidity();
    this.getFormData().militaryStateCd.updateValueAndValidity();
  }


  back() {
    const previousForm = 'PRSTRF';
    this.completedApplicant.emit(ReferralFlowSeq[previousForm]);
  }


}
