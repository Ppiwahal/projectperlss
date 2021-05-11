import { Component, OnInit, OnDestroy} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as customValidation from '../../_shared/constants/validation.constants';
import { CustomvalidationService } from '../../_shared/utility/customvalidation.service';
import { AppointmentsService } from '../services/appointments.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {ToastrService} from 'ngx-toastr';
import * as moment from 'moment';
import * as Constants from '../../_shared/constants/application.constants';
import * as CryptoJS from 'crypto-js';


interface AppointmentDetail {
  dobDt :string;
  intakeDueDt :string;
  paeId :string;
  personId :string;
  prsnId: string;
  refId :string;
  refReceivedDt :string;
  ssn :string;
  personName : string;
  appointmentStatusCd: string;
  programCd?: string;
  interviewerName?: string;
}

@Component({
  selector: 'app-appointments-details',
  templateUrl: './appointments-details.component.html',
  styleUrls: ['./appointments-details.component.scss']
})
export class AppointmentsDetailsComponent implements OnInit, OnDestroy {

  myForm: FormGroup;
  searchForm: FormGroup;
  range: FormGroup;
  dataSource: MatTableDataSource<any>;
  customValidation = customValidation;
  minDate: Date;
  maxDate: Date;
  id: string;
  details: AppointmentDetail;
  displayAddressForm: boolean;
  today = new Date();
  showAddressSection = false;
  subscriptions$:any[] = [];
  appointmentTypes: any[];
  contactMethodDetails: any[];
  stateCodeDetails: any[];
  countyCodeDetails: any[];
  cancelReasons: any[];
  statusReasonCodes: any[];
  appointmentForGroupOptions: any[];
  userId: any;
  startDate = new Date();


  toDateTimeLocal(date: Date) {
    const checkDate = (i) => {
      return (i < 10 ? '0' : '') + i;
    };
    return date.getFullYear() + '-' + checkDate(date.getMonth() + 1) + '-' + checkDate(date.getDate()) + 'T' + checkDate(date.getHours()) + ':' + checkDate(date.getMinutes());
  }


  constructor(private fb: FormBuilder,
    private customValidator: CustomvalidationService,
    private appointmentService: AppointmentsService,
    private activatedRoute: ActivatedRoute,
              private customValidationService: CustomvalidationService,
    private toastr: ToastrService) {
  }

  addresses = [];

  ngOnInit() {
    const timeTravelData = localStorage.getItem('TIME_TRAVEL_DATA');
    if(timeTravelData) {
      const timeTravelDataJson = JSON.parse(CryptoJS.AES.decrypt(timeTravelData, Constants.APP_ENC_DECRYPT_KEY).toString(CryptoJS.enc.Utf8));
      console.log("timeTravelDataJson ", timeTravelDataJson);
      if(timeTravelDataJson.timeTravelFlag && timeTravelDataJson.currentDate) {
        this.startDate = new Date(timeTravelDataJson.currentDate);
      }
    }
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 119, 0, 1);
    this.maxDate = new Date();
    this.myForm = this.fb.group({
    appointmentDate:  ['', [Validators.required,  this.customValidationService.datePriorToInitialDate(), this.customValidationService.dateInPast()]],
    appointmentStartTime: ['',[Validators.required]],
    appointmentTypeCd:  ['', [Validators.required]],
    contactMethodCd:  ['', [Validators.required]],
    appointmentForGroup:  ['',[Validators.required]],
    appointmentId: null,
    paeId: null,
    personId: null,
    refId: null,
    reqPageId:'string',
  });

    const appointment$ = this.activatedRoute.params.subscribe((params) => {
      if(params && params['id']) {
        console.log(params);
        this.id = params['id'];
        this.myForm.controls.appointmentId.setValue(Number(this.id));
        this.getAppointment();
      } else {
      this.details = window.history.state.appointmentSummary;
      this.details['contactMethodCd'] = this.details['cntctMethodCd'];
      this.getPersonAddress();
      this.updateForm();
      }
      //this.subscriptions$.push(appointment$);
    });
    this.getAppointmentTypeDetails();
    this.getContactMethodDetails();
    this.getStatusReasonCodes();
    this.getAppointmentCancelReasons();
    this.getAppointmentForGroupOptions();
    this.getStatesDetails();
    this.getCountyDetails();
}
  statusChange(value: string) {
    if(value && value == 'CA') {
      this.myForm.addControl('cancelReasonCd',this.fb.control(null, [Validators.required]));
    }else {
      this.myForm.contains('cancelReasonCd') ? this.myForm.removeControl('cancelReasonCd') : null;
    }
  }

  reasonChange(value: string) {
    if(value && value == 'Others') {
      this.myForm.addControl('notes',this.fb.control(null, [Validators.required]));
    }else {
      this.myForm.contains('notes') ? this.myForm.removeControl('notes') : null;
    }
  }

  getAppointmentTypeDetails(){
    const appointmentTypeDetails$ = this.appointmentService.getAppointmentType().subscribe(res => {
      this.appointmentTypes = res;
    });
    this.subscriptions$.push(appointmentTypeDetails$);
  }

  getStatusReasonCodes(){
    const StatusReasonCode$ = this.appointmentService.getCancellationReasonCodes().subscribe(res => {
      this.statusReasonCodes = res;
    });
    this.subscriptions$.push(StatusReasonCode$);
  }

  getStatusVal(statusCd) {
    if(statusCd && this.statusReasonCodes && this.statusReasonCodes.length > 0) {
      const matchedStatusCd = this.statusReasonCodes.filter(statusCode => statusCode.code === statusCd);
      if(matchedStatusCd && matchedStatusCd.length > 0) {
       return matchedStatusCd[0].value;
      } else {
        return '';
      }
    }
    return '';
  }

  getContactMethodDetails(){
    const contactTypeMethod$ = this.appointmentService.getContactMethod().subscribe(res => {
      this.contactMethodDetails = res;
    });
    this.subscriptions$.push(contactTypeMethod$);
  }

  getStatesDetails(){
    const stateCodes$ = this.appointmentService.getStateForAddress().subscribe(res => {
      this.stateCodeDetails = res;
    });
    this.subscriptions$.push(stateCodes$);
  }

  getCountyDetails(){
    const countyCodes$ = this.appointmentService.getCounties().subscribe(res => {
      this.countyCodeDetails = res;
    });
    this.subscriptions$.push(countyCodes$);
  }

  getAppointmentForGroupOptions() {
    this.appointmentForGroupOptions = [ {code: "PA", value: "Part A", activateSW: "Y"},
      {code: "PB", value: "Part B", activateSW: "Y"}];
  }

  getAppointmentCancelReasons(){
    const cancelReasons$ = this.appointmentService.getAppointmentCancelReason().subscribe(res => {
      this.cancelReasons = res;
    });
    this.subscriptions$.push(cancelReasons$);
  }

  contactChange(value: string) {
    if(value && value == 'IP') {
      this.showAddressSection = true;
      this.myForm.contains('telephoneNumber') ? this.myForm.removeControl('telephoneNumber') : null;
      const addrType = this.details['appointmentAddressVO'] ? 'others' : '';
      this.showAddressForm(addrType);
    }else if(value && value == 'TE') {
      this.myForm.addControl('telephoneNumber',this.fb.control(null, [Validators.required, Validators.maxLength(10), this.customValidator.phonenumberValidator()]));
      this.myForm.contains('appointmentAddressVO') ? this.myForm.removeControl('appointmentAddressVO') : null;
      this.showAddressSection = false;
    }else {
      this.myForm.contains('telephoneNumber') ? this.myForm.removeControl('telephoneNumber') : null;
      this.myForm.contains('appointmentAddressVO') ? this.myForm.removeControl('appointmentAddressVO') : null;
      this.showAddressSection = false;
    }
  }

  setAddressValidators() {
    this.myForm.addControl('appointmentAddressVO', this.fb.group({
      addrLine1: ['', [Validators.required, Validators.maxLength(100), this.customValidator.addressAndCityValidator()]],
      addrLine2: ['', [Validators.maxLength(50), this.customValidator.addressAndCityValidator()]],
      city: ['', [Validators.required, Validators.maxLength(25), this.customValidator.addressAndCityValidator()]],
      stateCd: ['', [Validators.required]],
      zip: ['', [Validators.required, Validators.pattern('[0-9]{5}')]],
      ext: ['', Validators.pattern('[0-9]{4}')],
      countyCd: ['', [Validators.required]]
    }));
  }

showAddressForm(value: string) {
  this.setAddressValidators();
    if(value === 'others') {
      if(this.myForm.controls.appointmentAddressVO && this.details['appointmentAddressVO']) {
        this.myForm.controls.appointmentAddressVO.patchValue(this.details['appointmentAddressVO']);
      }
      this.displayAddressForm = true;
    }else {
      this.addresses = this.addresses.map(a => ({...a, isActive: (() => {
        return JSON.stringify(a) == JSON.stringify(value);
        })()}));
      console.log("value ",value);
      this.myForm.controls.appointmentAddressVO.patchValue(value);
      this.displayAddressForm = false;
    }
}

validateAddress() {
   return  this.addresses.some(({ addrLine1,addrLine2,city,stateCd,zip,ext,countyCd}) => {
      let add = {
        addrLine1,
        addrLine2,
        city,
        stateCd,
        zip,
        ext,
        countyCd

    };
      return JSON.stringify(add) == JSON.stringify(this.myForm.value['appointmentAddressVO']);
    })
}

get f() { return this.myForm.controls; }

get childFormGroup() { return (<FormGroup>(this.myForm.controls.appointmentAddressVO)).controls }

 addValidator(key) {
  return (<FormGroup>(this.myForm.controls.appointmentAddressVO)).get(key);
}

getFormData() {
  return this.myForm.controls;
}

transformPayload(payload) {
  const date = new Date(payload.appointmentDate).toISOString().substring(0,10);
   const appointmentDate = new Date(date + ' '+ payload.appointmentStartTime+" UTC");
    return {
      "appDt":  appointmentDate,
      "appGroupCd": payload.appointmentForGroup,
      "appStatusCd": payload.appointmentStatusCd ? payload.appointmentStatusCd: 'SC',
      "appTypeCd": payload.appointmentTypeCd,
      "appointmentAddressVO": {
        "addrLine1": payload.appointmentAddressVO ? payload.appointmentAddressVO.addrLine1 : " ",
        "addrLine2": payload.appointmentAddressVO ?  payload.appointmentAddressVO.addrLine2 : " ",
        "city": payload.appointmentAddressVO ?  payload.appointmentAddressVO.city : " ",
        "stateCd":  payload.appointmentAddressVO ? payload.appointmentAddressVO.stateCd : " ",
        "zip": payload.appointmentAddressVO ?  payload.appointmentAddressVO.zip : " ",
        "extsn": payload.appointmentAddressVO ?  payload.appointmentAddressVO.ext : " ",
        "countyCd": "TN",
        "id": payload.appointmentId
        },
      "cancelRsnCd": payload.cancelReasonCd,
      "cntctMethodCd":payload.contactMethodCd,
      "cntctPrsnSw": "N",
      "id": payload.appointmentId,
      "prefPhTypeCd": "N",
      "telephoneNum": payload.telephoneNumber,
      "prsnId": this.details.personId || this.details.prsnId,
      "refId": payload.refId
    }
  }

  transformPayloadForSchedule(payload) {
    const localStorageforLocal = localStorage.getItem('APP_STORAGE_TOKEN');
    this.userId= JSON.parse(localStorageforLocal).userName;
    const date = new Date(payload.appointmentDate).toISOString().substring(0,10);
    const appointmentDate = new Date(date + ' '+ payload.appointmentStartTime+" UTC");
    return {
      "appointmentAddressVO": {
        "addrLine1":  payload.appointmentAddressVO ? payload.appointmentAddressVO.addrLine1 : "",
        "addrLine2": payload.appointmentAddressVO ?  payload.appointmentAddressVO.addrLine2 : "",
        "city": payload.appointmentAddressVO ?  payload.appointmentAddressVO.city : "",
        "stateCd":  payload.appointmentAddressVO ? payload.appointmentAddressVO.stateCd : "",
        "zip": payload.appointmentAddressVO ?  payload.appointmentAddressVO.zip : "",
        "extsn": payload.appointmentAddressVO ?  payload.appointmentAddressVO.ext : "",
        "countyCd": payload.appointmentAddressVO ?  payload.appointmentAddressVO.countyCd : "",
        "id": 0
      },
      "appDt":  appointmentDate,
      "appGroupCd": payload.appointmentForGroup ? payload.appointmentForGroup : " ",
      "id": 0,
      "appStatusCd": payload.appointmentStatusCd ? payload.appointmentStatusCd: 'SC',
      "appTypeCd": payload.appointmentTypeCd,
      "cancelRsnCd": payload.cancelReasonCd,
      "cntctMethodCd":payload.contactMethodCd,
      "cntctPrsnSw": "N",
      "prefPhTypeCd": "N",
      "telephoneNum": payload.telephoneNumber,
      "paeId":this.details.paeId ? this.details.paeId : null,
      "refId": this.details.refId ? this.details.refId : null,
      "prsnId":  this.details.personId || this.details.prsnId,
      "cntctUser": this.userId
    }
  }


async addAppointment() {
      try {
        if(!this.myForm.valid) {
          return;
        }
        let response;
        if(this.details['appointmentStatusCd'] == 'SC' || this.details['appointmentStatusCd'] == 'RE') {
          const payload = this.transformPayload(this.myForm.value);
          response = await this.appointmentService.updateAppointment(payload);
        } else {
          const payload = this.transformPayloadForSchedule(this.myForm.value);
          response = await this.appointmentService.addAppointment(payload);
        }
        //this.openSnackBar(response['body']['successMsgDescription'], 'dialog-success');
        this.toastr.success(response['body']['successMsgDescription']);
        console.log(response);
      } catch (e) {
        this.toastr.error('Service Error!');
        //this.openSnackBar('Internal Server Error', 'dialog-error');
      }
}

updateForm() {

   if(this.details.programCd !== 'KB')  {
     this.myForm.removeControl('appointmentForGroup');
   }else{
    this.myForm.controls.appointmentForGroup.setValue(this.details['appointmentGroupCd']);
   }
  this.myForm.patchValue(this.details);
  if(this.myForm.value['contactMethodCd'] == 'IP') {
    this.contactChange(this.myForm.value['contactMethodCd']);
  }
  if(this.myForm.value['contactMethodCd'] == 'TE') {
    this.contactChange(this.myForm.value['contactMethodCd']);
    this.myForm.controls.telephoneNumber.setValue(this.details['telephoneNum']);
  }

  this.addresses = this.details['applicantAddressVO'];
  this.details['appointmentStatusCd'] == 'SC' || this.details['appointmentStatusCd'] == 'RE' || this.details['appointmentStatusCd'] == 'CA' ? this.myForm.addControl('appointmentStatusCd', this.fb.control(null, Validators.required)) : null;
  this.details['appointmentStatusCd'] == '' ? this.myForm.controls.appointmentTypeCd.setValue('IV') : null;
  this.details['appointmentStatusCd'] == 'SC' || this.details['appointmentStatusCd'] == 'RE' || this.details['appointmentStatusCd'] == 'CA' ? this.myForm.controls.appointmentDate.setValue(new Date(moment(this.details['appointmentDate'], 'MM/DD/YYYY hh:mm A').toDate())) : null;
  console.log("time ",new Date(this.details['appointmentDate']).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }))
  this.details['appointmentStatusCd'] == 'SC' || this.details['appointmentStatusCd'] == 'RE' || this.details['appointmentStatusCd'] == 'CA' ? this.myForm.controls.appointmentStartTime.setValue(new Date(moment(this.details['appointmentDate'], 'MM/DD/YYYY hh:mm A').toDate()).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })) : null;
  this.details['appointmentStatusCd'] == 'SC' || this.details['appointmentStatusCd'] == 'RE' || this.details['appointmentStatusCd'] == 'CA' ? this.myForm.controls.appointmentTypeCd.setValue(this.details['appointmentTypeCd']) : null;
  this.details['appointmentStatusCd'] == 'SC' || this.details['appointmentStatusCd'] == 'RE' || this.details['appointmentStatusCd'] == 'CA' ? this.myForm.controls.appointmentStatusCd.setValue(this.details['appointmentStatusCd']) : null;
}


  async getAppointment() {
    try {
      const response = await this.appointmentService.getAppointment(this.id);
      if (response['body']) {
        console.log(response['body']);
        this.details = response['body'];
        this.updateForm();
      }
    }
    catch(e)
      {
        console.log(e);
      }

  }

  async getPersonAddress() {
    try {
      const response = await this.appointmentService.getPersonAddress(this.details.personId);
      if (response['body']) {
        console.log(response['body']);
        this.addresses = response['body'];
      }
    }
    catch(e)
      {
        console.log(e);
      }

  }

  formatSSN(val) {
    if (val) {
      const formstring = 'XXX-XX-' + val.slice(5, val.length);
      return formstring;
    } else {
      return '--';
    }
  }


  ngOnDestroy() {
    if(this.subscriptions$ && this.subscriptions$.length > 0) {
      this.subscriptions$.forEach(subscription$ => subscription$.unsubscribe());
    }
  }

}
