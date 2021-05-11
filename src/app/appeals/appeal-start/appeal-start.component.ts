import { Component, ElementRef, OnInit, ViewChild, EventEmitter, Output, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppealStepper } from '../../_shared/utility/AppealFlowSeq';
import * as customValidation from '../../_shared/constants/validation.constants';
import { debounceTime, map, distinctUntilChanged, filter } from 'rxjs/operators';
import { fromEvent } from 'rxjs';
import { AppealService } from '../services/appeal.service';
import * as Constants from '../../_shared/constants/application.constants';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-appeal-start',
  templateUrl: './appeal-start.component.html',
  styleUrls: ['./appeal-start.component.scss']
})
export class AppealStartComponent implements OnInit, OnDestroy {

  @Output() completedStart: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('applicantNameInput', { static: true }) applicantNameInput: ElementRef;

  appealStartForm: FormGroup;
  filingAppealMethodData = [];
  filingAppealData = [];
  otherDepartmentNameDetails = [];
  personOptions = [];
  isNotFoundSelected = false;
  isAppellantReceivedByOthDep = [{ code: 'Y', value: 'Yes' }, { code: 'N', value: 'No' }];
  noUserFound = false;
  showAppealRequest: boolean;
  showDateDepartment: boolean;
  isReceivedByOtherDep: boolean;
  appellantDetails: any;
  commentsRequired: boolean;
  maxDate: Date;
  localStorageLocal: string;
  isShowDemographic = false;
  customValidation = customValidation;
  subscriptions$ = [];
  startDate = new Date();

  constructor(private formBuilder: FormBuilder, private appealService: AppealService) { }

  ngOnInit() {
    const timeTravelData = localStorage.getItem('TIME_TRAVEL_DATA');
    if(timeTravelData) {
      const timeTravelDataJson = JSON.parse(CryptoJS.AES.decrypt(timeTravelData, Constants.APP_ENC_DECRYPT_KEY).toString(CryptoJS.enc.Utf8));
      console.log("timeTravelDataJson ", timeTravelDataJson);
      if(timeTravelDataJson.timeTravelFlag && timeTravelDataJson.currentDate) {
        this.startDate = new Date(timeTravelDataJson.currentDate);
      }
    }

    this.localStorageLocal = localStorage.getItem('APP_STORAGE_TOKEN');
    this.getOtherDepartment();
    this.getPersonFilingApl();
    this.getApFilingMethod();
    this.getAllPersonDetails();
    this.appealStartForm = this.formBuilder.group({
      personSearch: [''],
      filingAppeal: ['', Validators.required],
      filingMethod: ['', Validators.required],
      appealRecievedDate: [{ disabled: true, value: '' }, Validators.required],
      recByOtherDep: [{ disabled: true, value: '' }, Validators.required],
      otherDepartmentNameDetails: [{ disabled: true, value: '' }, Validators.required],
      ltssRecievedDate: [{ disabled: true, value: '' }, Validators.required],
      aplMistake: ['', Validators.maxLength(2000)],
      aplExpectOutcome: ['', Validators.maxLength(2000)]
    });
  }

  getApFilingMethod() {
    const FilingMethod$ = this.appealService.getAppealDropdowns('APFILING_METHOD').subscribe(response => {
      this.filingAppealMethodData = response;
    });
    this.subscriptions$.push(FilingMethod$);
  }

  getPersonFilingApl() {
    const PersonFilingAppeal$ = this.appealService.getAppealDropdowns('PERSON_FILINGAPL').subscribe(response => {
      this.filingAppealData = response;
    });
    this.subscriptions$.push(PersonFilingAppeal$);
  }

  getOtherDepartment() {
    const OtherDetaprment$ = this.appealService.getAppealDropdowns('OTHER_DEPARTMENT').subscribe(response => {
      this.otherDepartmentNameDetails = response;
    });
    this.subscriptions$.push(OtherDetaprment$);
  }

  getFormData() {
    return this.appealStartForm.controls;
  }

  getAllPersonDetails() {
    const entityId = JSON.parse(this.localStorageLocal).entityId;
    fromEvent(this.applicantNameInput.nativeElement, 'keyup').pipe(
      map((event: any) => {
        if (event.target.value === '') {
          this.showAppealRequest = false;
        }
        return event.target.value;
      })
      , filter(res => res.length >= 1)
      , debounceTime(500)
      , distinctUntilChanged()
    ).subscribe((text: string) => {
      const personDetailsSubscription$ = this.appealService.getPersonDetails(text, entityId).subscribe((res) => {
        this.personOptions = [];
        if (res && res.length > 0) {
          this.noUserFound = false;
          res.forEach(data => {
            const dob = data.dobDt.substring(0, 10);
            this.personOptions.push({
              personId: data.prsnId,
              prsnDetail: data,
              prsnDetailTxt: 'Name: ' + data.firstName + ' ' + data.lastName + ', DOB: ' +
                dob + ', SSN: ' + data.ssn + ', Person ID: ' + data.prsnId + ', County: ' + data.cntyCd
            });
          });
        } else {
          this.noUserFound = true;
        }
      });
      this.subscriptions$.push(personDetailsSubscription$);
    });
  }

  handleSelection(option) {
    this.noUserFound = false;
    this.isNotFoundSelected = false;
    this.appealStartForm.reset();
    this.showAppealRequest = true;
    this.appealStartForm.controls['personSearch'].setValue(option.prsnDetailTxt);
    this.getAppellantDetails(option);
  }

  getAppellantDetails(personInfo) {
    const personId = personInfo.personId;
    const userId = JSON.parse(this.localStorageLocal).userName;
    const appellantDetails$ = this.appealService.getAppeallantDetails(personId, userId).subscribe(response => {
      this.appellantDetails = response;
      this.isShowDemographic = true;
    });
    this.subscriptions$.push(appellantDetails$);
  }

  isPersonNotFoundSelected() {
    this.isShowDemographic = false;
    this.isNotFoundSelected = !this.isNotFoundSelected;
    if (this.isNotFoundSelected) {
      this.showAppealRequest = true;
    } else {
      this.showAppealRequest = false;
      this.appealStartForm.get('aplMistake').setValidators(null);
      this.appealStartForm.get('aplExpectOutcome').setValidators(null);
      this.commentsRequired = false;
      this.appealStartForm.reset();
    }
    this.appealStartForm.get('aplExpectOutcome').updateValueAndValidity();
    this.appealStartForm.get('aplMistake').updateValueAndValidity();
  }

  get f() {
    return this.appealStartForm.controls;
  }

  clearPersonSearch(event) {
    event.preventDefault();
    this.isShowDemographic = false;
    this.f.personSearch.setValue('');
    this.isNotFoundSelected = false;
    this.showAppealRequest = false;
    this.noUserFound = false;
    this.appealStartForm.reset();
  }

  personInputChanged() {
    if (this.appealStartForm.value.personSearch.length === 0) {
      this.showAppealRequest = false;
      this.isShowDemographic = false;
      this.noUserFound = false;
    }
  }

  onDropdownValueChanged(value) {
    if (value === 'FX' || value === 'ML') {
      this.showDateDepartment = true;
      this.appealStartForm.controls['appealRecievedDate'].enable();
      this.appealStartForm.controls['recByOtherDep'].enable();
    } else {
      this.showDateDepartment = false;
      this.isReceivedByOtherDep = false;
      this.appealStartForm.controls['appealRecievedDate'].disable();
      this.appealStartForm.controls['recByOtherDep'].disable();
      this.appealStartForm.controls['otherDepartmentNameDetails'].disable();
      this.appealStartForm.controls['ltssRecievedDate'].disable();
    }
    if (value === 'PH') {
      this.appealStartForm.get('aplMistake').setValidators([Validators.required]);
      this.appealStartForm.get('aplExpectOutcome').setValidators([Validators.required]);
      this.commentsRequired = true;
    } else {
      this.appealStartForm.get('aplMistake').setValidators(null);
      this.appealStartForm.get('aplExpectOutcome').setValidators(null);
      this.commentsRequired = false;
    }
    this.appealStartForm.get('aplExpectOutcome').updateValueAndValidity();
    this.appealStartForm.get('aplMistake').updateValueAndValidity();
  }

  onRadioSelected(value) {
    if (value === 'Y') {
      this.isReceivedByOtherDep = true;
      this.appealStartForm.controls['otherDepartmentNameDetails'].enable();
      this.appealStartForm.controls['ltssRecievedDate'].enable();
    } else {
      this.isReceivedByOtherDep = false;
      this.appealStartForm.controls['otherDepartmentNameDetails'].disable();
      this.appealStartForm.controls['ltssRecievedDate'].disable();
    }
  }

  gotoNextStepper(value) {
    if (this.noUserFound && this.isNotFoundSelected === true) {
      this.appellantDetails = undefined;
    }
    const nextForm = 'APPEAL_DETAIL';
    const nextStepperData = {
      nextStepper: AppealStepper[nextForm],
      dataFromAppealStart: { appealStartFormData: value, appellantDetails: this.appellantDetails }, isLinear: true
    };
    this.completedStart.emit(nextStepperData);
  }

  ngOnDestroy() {
    if (this.subscriptions$ && this.subscriptions$.length > 0) {
      this.subscriptions$.forEach(subscription$ => subscription$.unsubscribe());
    }
  }

}
