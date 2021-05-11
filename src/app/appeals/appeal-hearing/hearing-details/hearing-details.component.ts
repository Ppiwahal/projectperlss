import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { CustomvalidationService } from 'src/app/_shared/utility/customvalidation.service';
import { AppealService } from '../../services/appeal.service';
import * as customValidation from '../../../_shared/constants/validation.constants';
import { ToastrService } from 'ngx-toastr';
import * as Constants from '../../../_shared/constants/application.constants';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-hearing-details',
  templateUrl: './hearing-details.component.html',
  styleUrls: ['./hearing-details.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})

export class HearingDetailsComponent implements OnInit {

  @Input() appellantInfo: any;
  @Input() appealId: any;
  @Output() nohPastDueDate = new EventEmitter();
  @Output() enableSave = new EventEmitter();
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  dataSource2: MatTableDataSource<any> = new MatTableDataSource();

  yesOrNo = [{ code: 'Y', value: 'Yes' }, { code: 'N', value: 'No' }];
  displayedColumns = ['hearingPersonnel', 'personnelName', 'userActions'];
  displayedColumns2 = ['hearingDate', 'hearingTime', 'hearingStatus', 'lastModifiedDate', 'lastModifiedBy'];
  safetyJustificationInfoData = [];
  showTable: boolean;
  hearingType: any;
  docketType: any;
  hearingPersonnel: any;
  addressForm: FormGroup;
  showOpposingCounsel: boolean;
  expandedElement: any | null;
  showHearngScheduleSummary: boolean;
  hearingDetailsForm: FormGroup;
  hearingPersonnelForm: FormGroup;
  opposingCounsilForm: FormGroup;
  todayDate: any;
  isShowFirstTwoDates = false;
  isShowLastTwoDates = false;
  caseReferralDueDate: any;
  nohDueDate: any;
  initialOrderDueDate: any;
  dueDate: any;
  hearingStatus: any;
  isShowErrors = false;
  customValidation = customValidation;
  subscriptions$ = [];
  startDate = new Date();

  constructor(private formBuilder: FormBuilder,
              private appealService: AppealService,
              private toastrService: ToastrService,
              private customValidator: CustomvalidationService) { }

  ngOnInit() {
    const timeTravelData = localStorage.getItem('TIME_TRAVEL_DATA');
    if(timeTravelData) {
      const timeTravelDataJson = JSON.parse(CryptoJS.AES.decrypt(timeTravelData, Constants.APP_ENC_DECRYPT_KEY).toString(CryptoJS.enc.Utf8));
      console.log("timeTravelDataJson ", timeTravelDataJson);
      if(timeTravelDataJson.timeTravelFlag && timeTravelDataJson.currentDate) {
        this.startDate = new Date(timeTravelDataJson.currentDate);
      }
    }
    this.todayDate = new Date();
    this.getHearingType();
    this.getDocketType();
    this.getHearingStatus();
    this.getHearingPersonnel();
    this.addressForm = this.formBuilder.group({
      addressFormat: [{ disabled: true, value: '' }, Validators.required],
      addrLine1: ['', [Validators.required, Validators.maxLength(100), this.customValidator.addressAndCityValidator()]],
      addrLine2: ['', [Validators.maxLength(50), this.customValidator.addressAndCityValidator()]],
      city: [{ disabled: false, value: '' },
      [Validators.required, Validators.maxLength(25), this.customValidator.addressAndCityValidator()]],
      state: [{ disabled: false, value: '' }, Validators.required],
      zipCode: ['', Validators.required],
      ext: ['', Validators.pattern('[0-9]{4}')],
      county: [''],
      apoFpo: [{ disabled: true, value: '' }, Validators.required],
      aaAeAp: [{ disabled: true, value: '' }, Validators.required]
    });
    this.hearingDetailsForm = this.formBuilder.group({
      hearingDate: ['', Validators.required],
      hearingTime: ['', Validators.required],
      hearingType: [''],
      docketNumber: ['', Validators.required],
      includesDetails: [''],
      docketType: ['']
    });
    this.opposingCounsilForm = this.formBuilder.group({
      hearingPersonnel: ['', Validators.required],
      personnelName: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern(new RegExp('[0-9]'))]],
      fax: ['', [Validators.required, Validators.pattern(new RegExp('[0-9]'))]],
      emailAddress: ['']
    });
    this.hearingPersonnelForm = this.formBuilder.group({
      hearingPersonnelArray: this.formBuilder.array([])
    });
    if (this.appellantInfo.aplRcvdDt) {
      const aplReceivedDate = new Date(this.appellantInfo.aplRcvdDt);
      const due = moment(aplReceivedDate, 'DD/MM/YYYY');
      const initialOrderDue = moment(aplReceivedDate, 'DD/MM/YYYY');
      this.dueDate = due.add(90, 'days').format('MM/DD/YYYY');
      this.initialOrderDueDate = initialOrderDue.add(75, 'days').format('MM/DD/YYYY');
      this.isShowLastTwoDates = true;
    }
    this.getHearingDetails();
  }

  get hearingPersonnelArray() {
    return this.hearingPersonnelForm.get('hearingPersonnelArray') as FormArray;
  }

  getHearingType() {
    const HearingTypeSubscription$ = this.appealService.getAppealDropdowns('HEARING_TYPE').subscribe(response => {
      this.hearingType = response;
    });
    this.subscriptions$.push(HearingTypeSubscription$);
  }

  getHearingStatus() {
    const HearingStatusSubscription$ = this.appealService.getAppealDropdowns('APPEALHEARING_STATUS').subscribe(response => {
      this.hearingStatus = response;
    });
    this.subscriptions$.push(HearingStatusSubscription$);
  }

  getDocketType() {
    const DocketTypeSubscription$ = this.appealService.getAppealDropdowns('DOCKET_TYPE').subscribe(response => {
      this.docketType = response;
    });
    this.subscriptions$.push(DocketTypeSubscription$);
  }

  getHearingPersonnel() {
    const hearingPersonnelSubscription$ = this.appealService.getAppealDropdowns('HEARING_PERSONNEL').subscribe(response => {
      this.hearingPersonnel = response;
    });
    this.subscriptions$.push(hearingPersonnelSubscription$);
  }

  getHearingDetails() {
    const HearingDetailsSubscriptions$ = this.appealService.getHearingDetails(this.appealId).subscribe(response => {
      if (response && response.docketNum) {
        this.hearingDetailsForm.get('docketNumber').setValue(response.docketNum);
      }
    });
    this.subscriptions$.push(HearingDetailsSubscriptions$);
  }

  setAddress(event) {
    console.log(event);
  }

  onPhoneNumber() {
    const phone = this.opposingCounsilForm.value.phoneNumber.replaceAll('-', '');
    if (phone.length > 6) {
      const phone1 = phone.substring(0, 3);
      const phone2 = phone.substring(3, 6);
      const phone3 = phone.substring(6, phone.length);
      this.opposingCounsilForm.get('phoneNumber').setValue(phone1 + '-' + phone2 + '-' + phone3);
    }
  }

  onFax() {
    const fax = this.opposingCounsilForm.value.fax.replaceAll('-', '');
    console.log(fax);
    if (fax.length > 6) {
      const fax1 = fax.substring(0, 3);
      const fax2 = fax.substring(3, 6);
      const fax3 = fax.substring(6, fax.length);
      this.opposingCounsilForm.get('fax').setValue(fax1 + '-' + fax2 + '-' + fax3);
    }
    console.log(this.opposingCounsilForm.value.fax);
  }

  dateChange() {
    const dates = new Date(this.hearingDetailsForm.value.hearingDate);
    const caseReferral = moment(dates, 'DD/MM/YYYY');
    const nohDue = moment(dates, 'DD/MM/YYYY');
    this.caseReferralDueDate = caseReferral.subtract(35, 'days').format('MM/DD/YYYY');
    this.nohDueDate = nohDue.subtract(20, 'days').format('MM/DD/YYYY');
    if (this.nohDueDate) {
      this.nohPastDueDate.emit(this.nohDueDate);
    }
    this.isShowFirstTwoDates = true;
  }

  onAddHearingPersonnel() {
    this.showTable = true;
    this.safetyJustificationInfoData.push({ constant: 'x' });
    this.safetyJustificationInfoData.forEach((data, i) => {
      data.index = i;
    });
    this.hearingPersonnelArray.push(this.formBuilder.group({
      hearingPersonnel: [''],
      personnelName: ['']
    }));
    this.dataSource = new MatTableDataSource(this.safetyJustificationInfoData);
  }

  edit(element) {
    console.log(element);
  }

  delete(element, index) {
    this.hearingPersonnelArray.removeAt(index);
    const newArray = [];
    this.safetyJustificationInfoData.forEach(data => {
      if (element.index !== data.index) {
        newArray.push(data);
      }
    });
    this.safetyJustificationInfoData = newArray;
    this.dataSource = new MatTableDataSource(this.safetyJustificationInfoData);
    if (this.safetyJustificationInfoData.length === 0) {
      this.showTable = false;
    }
  }

  hearingPersonalChanged(event, index) {
    if (event === 'OC') {
      this.hearingPersonnelArray.removeAt(index);
      this.safetyJustificationInfoData.splice(index, 1);
      this.dataSource = new MatTableDataSource(this.safetyJustificationInfoData);
      this.showOpposingCounsel = true;
    } else {
      let flag = false;
      this.hearingPersonnelArray.value.forEach(element => {
        if (element.hearingPersonnel === 'OC') {
          flag = true;
        }
      });
      this.showOpposingCounsel = flag;
    }
  }

  formatDate(date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }
    return [year, month, day].join('-');
  }

  cancel() {
    this.showOpposingCounsel = false;
    this.showTable = false;
  }

  save() {
    if (this.hearingDetailsForm.invalid) {
      this.isShowErrors = true;
      Object.keys(this.hearingDetailsForm.controls).forEach(field => {
        const control = this.hearingDetailsForm.get(field);
        control.markAsTouched({ onlySelf: true });
      });
      return;
    }
    this.isShowErrors = false;
    let hearingDate;
    if (this.hearingDetailsForm.value.hearingDate !== '' && this.hearingDetailsForm.value.hearingTime) {
      const date = new Date(this.hearingDetailsForm.value.hearingDate).toISOString().substring(0, 10);
      hearingDate = new Date(date + ' ' + this.hearingDetailsForm.value.hearingTime + ' UTC');
    }
    const aplHearingPersonnelArray = [];
    if (this.hearingPersonnelForm && this.hearingPersonnelForm.value && this.hearingPersonnelForm.value.hearingPersonnelArray
      && this.hearingPersonnelForm.value.hearingPersonnelArray.length > 0) {
      this.hearingPersonnelForm.value.hearingPersonnelArray.forEach(element => {
        const tempObj = {
          addrLine1: null,
          addrLine2: null,
          city: null,
          cntyCd: null,
          email: null,
          faxNum: null,
          hrngPrsnlCd: element.hearingPersonnel,
          hrngPrsnlName: element.personnelName,
          phNum: null,
          stateCd: null,
          zip: null,
          zipExtn: null
        };
        aplHearingPersonnelArray.push(tempObj);
      });
    }
    if (this.opposingCounsilForm.valid && this.addressForm.valid) {
      const tempObj = {
        addrLine1: this.addressForm.value.addrLine1,
        addrLine2: this.addressForm.value.addrLine2,
        city: this.addressForm.value.city,
        cntyCd: this.addressForm.value.county,
        email: this.opposingCounsilForm.value.emailAddress,
        faxNum: this.opposingCounsilForm.value.fax.replaceAll('-', ''),
        hrngPrsnlCd: this.opposingCounsilForm.value.hearingPersonnel,
        hrngPrsnlName: this.opposingCounsilForm.value.personnelName,
        phNum: this.opposingCounsilForm.value.phoneNumber.replaceAll('-', ''),
        stateCd: this.addressForm.value.state,
        zip: this.addressForm.value.zipCode,
        zipExtn: this.addressForm.value.ext
      };
      aplHearingPersonnelArray.push(tempObj);
    } else {
      this.isShowErrors = true;
      Object.keys(this.opposingCounsilForm.controls).forEach(field => {
        const control = this.opposingCounsilForm.get(field);
        control.markAsTouched({ onlySelf: true });
      });
    }
    const hearingRequest = {
      aplHearingPrsnlVOs: aplHearingPersonnelArray,
      aplId: this.appealId,
      docketNum: this.hearingDetailsForm.value.docketNumber !== '' ? this.hearingDetailsForm.value.docketNumber : null,
      docketTypeCd: this.hearingDetailsForm.value.docketType !== '' ? this.hearingDetailsForm.value.docketType : null,
      docketWrkbkSw: this.hearingDetailsForm.value.includesDetails !== '' ? this.hearingDetailsForm.value.includesDetails : null,
      hrngDtTms: hearingDate,
      hrngStatusCd: null,
      hrngTypeCd: this.hearingDetailsForm.value.hearingType !== '' ? this.hearingDetailsForm.value.hearingType : null
    };
    this.appealService.hearingDetails(hearingRequest).subscribe(response => {
      this.toastrService.success(customValidation.B7);
      this.enableSave.emit(true);
      if (response && response.aplHrngDtlsId) {
        this.schedulesummary(this.appealId);
      }
    });
  }

  schedulesummary(aplId) {
    const ScheduleSummarySubscriptions$ = this.appealService.schedulesummary(aplId).subscribe(response => {
      if (response && response.length > 0) {
        response.forEach(ele => {
          if (ele.hrngStatusCd) {
            this.hearingStatus.forEach(element => {
              if (ele.hrngStatusCd === element.code) {
                ele.hearingStatus = element.value;
              }
            });
          }
          if (ele.hrngDtTms) {
            const date = new Date(ele.hrngDtTms);
            let minutes = '';
            if (date.getMinutes().toString().length === 1) {
              minutes = '0' + date.getMinutes().toString();
            } else {
              minutes = date.getMinutes().toString();
            }
            const hearingTime = date.getHours() + ':' + minutes;
            ele.hearingTime = hearingTime;
          }
        });
        this.showHearngScheduleSummary = true;
        this.dataSource2 = new MatTableDataSource(response);
      }
    });
    this.subscriptions$.push(ScheduleSummarySubscriptions$);
  }

}
