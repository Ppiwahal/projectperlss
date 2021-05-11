import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as customValidation from '../../_shared/constants/validation.constants';
import { ToastrService } from 'ngx-toastr';
import { CustomvalidationService } from '../../_shared/utility/customvalidation.service';
import { PersonReconciliationService } from '../services/person-reconciliation.service';
import { forkJoin } from 'rxjs';
import * as Constants from '../../_shared/constants/application.constants';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-person-details',
  templateUrl: './person-details.component.html',
  styleUrls: ['./person-details.component.scss']
})
export class PersonDetailsComponent implements OnInit, OnDestroy {
  personDetailsForm: FormGroup;
  submitted = false;
  isSaveDisabled = true;
  displaySearchResults = false;
  nameSuffix: any[] = [];
  gender: any[] = [];
  subscriptions$:any[] = [];
  customValidation = customValidation;
  minDate: Date;
  maxDate: Date;
  age: number;
  physicalAddress: any;
  recordId: any;
  taskId: any;
  taskMasterId: any;
  paeId: any;
  refId: any;
  personId1: any;
  recordType: any;
  addressTypeCode: any;
  personMatchDetails: any;
  searchRecipientRecords:any;
  addrPhysicalAddressType:any;
  addrMailingAddressType:any;
  mainRecordType: any;
  mainRecordId: any;
  inboxRecordId: any;
  inboxPAETaskRecordId: any;
  inboxREFTaskRecordId: any;
  inboxPersonId: any;
  @ViewChild("physicalAddr") physicalAddr:any;

  constructor(private formBuilder: FormBuilder,
              private toastr: ToastrService,
              private customValidator: CustomvalidationService,
              private personReconciliationService: PersonReconciliationService) {
                const searchParamsBySession = sessionStorage.getItem('ACTIVE_SESSION_DATA');
                const deCryptedSearchParams = CryptoJS.AES.decrypt(searchParamsBySession, Constants.APP_ENC_DECRYPT_KEY).toString(CryptoJS.enc.Utf8);
                const searchParamJson = JSON.parse(deCryptedSearchParams);
                if (searchParamJson) {
                  this.taskId = searchParamJson.taskId;
                  this.personId1 = searchParamJson.personId1;
                  this.taskMasterId = searchParamJson.taskMasterId;
                  this.paeId = searchParamJson.paeId;
                  this.refId = searchParamJson.refId;
                  this.inboxPAETaskRecordId = searchParamJson?.userIdResponseVO?.paeId;
                  this.inboxREFTaskRecordId = searchParamJson?.userIdResponseVO?.referralId;
                  this.inboxPersonId = searchParamJson?.taskResponseVO?.personId;
                }
              }

  ngOnInit(): void {
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 119, 0, 1);
    this.maxDate = new Date();
    this.initializeForm();
    this.personDetailsForm.valueChanges.subscribe(() => {
      if(this.personDetailsForm.dirty) {
        this.isSaveDisabled = false;
      }
    });
    this.getpersonMatch();
  }

  initializeForm(){
    this.personDetailsForm = this.formBuilder.group({
      persionId:[{
        value: '',
        disabled: true
      }],
      recordId:[{
        value: '',
        disabled: true
      }],
      recordType:[{
        value: '',
        disabled: true
      }],
      firstName:['', [Validators.required, Validators.maxLength(45), this.customValidator.nameValidator()]],
      mi: ['', [Validators.maxLength(1), Validators.pattern('^[a-zA-Z]*$')]],
      lastName: ['', [Validators.required, Validators.maxLength(45), this.customValidator.nameValidator()]],
      suffix:[''],
      dobDt:['', Validators.required],
      gender:[''],
      ssn:['', [Validators.required]],
      ssnAvalSw: [false],
      physicalAddress:this.formBuilder.group({
        addressFormat: [{ disabled: true, value: '' },Validators.required],
        addressLine1: ['', [Validators.required, Validators.maxLength(100), this.customValidator.addressAndCityValidator()]],
        addressLine2: ['', [Validators.maxLength(50), this.customValidator.addressAndCityValidator()]],
        city:[{ disabled: false, value: '' },[Validators.required, Validators.maxLength(25), this.customValidator.addressAndCityValidator()]],
        state: [{ disabled: false, value: '' },Validators.required],
        zipCode: ['', [Validators.required, Validators.pattern('[0-9]{5}')]],
        ext: ['', Validators.pattern('[0-9]{4}')],
        county: [''],
        mailAddrSw: [''],
        addrFormatCd:[''],
        reqPageId:[''],
        apoFpo: [{ disabled: true, value: '' },Validators.required],
        aaAeAp: [{ disabled: true, value: '' },Validators.required]
      }),
    })
    this.physicalAddress = this.personDetailsForm.controls['physicalAddress']
  }

  getFormData() {
    return this.personDetailsForm.controls;
  }

  getAddressForm() {
    return this.physicalAddr.myForm.controls;
  }

  getPersonDetails(value){
  }

  getpersonMatch() {
    this.recordId = this.paeId ? this.paeId : this.refId;
    this.inboxRecordId = this.inboxPAETaskRecordId ? this.inboxPAETaskRecordId : this.inboxREFTaskRecordId;
    this.mainRecordId = this.recordId ? this.recordId : this.inboxRecordId;
    const mainPersonId = this.inboxPersonId ? this.inboxPersonId : this.personId1;
    this.mainRecordType = this.mainRecordId.charAt(0);
    if(this.mainRecordType  === 'P') {
      this.mainRecordType = 'PAE'
    } else {
      this.mainRecordType = 'REFERRAL'
    }
    this.personDetailsForm.controls['persionId'].setValue(mainPersonId);
    this.personDetailsForm.controls['recordId'].setValue(this.mainRecordId);
    this.personDetailsForm.controls['recordType'].setValue(this.mainRecordType); 
    const observables = [];
    observables.push( this.personReconciliationService.getPersonMatchDetails(mainPersonId, this.mainRecordId, this.mainRecordType));
    observables.push( this.personReconciliationService.getAppealDropdowns('NAME_SUFFIX'));
    observables.push( this.personReconciliationService.getAppealDropdowns('GENDER'));

    const TaskDetailsSubscriptions$ = forkJoin(observables).subscribe((res : any) => {
      if(res[0] && res[0].errorCode && res[0].errorCode.length > 0 && res[0].errorCode[0].description){
        this.toastr.error( res[0].errorCode[0].description);
      } else {
        this.nameSuffix = res[1];
        this.gender = res[2];
        if(res[1] && res[1].length > 0) {
          const nameSuffixObj =  res[1].filter(rec => rec.code ==  res[0]['suffix']);
          if(nameSuffixObj && nameSuffixObj.length > 0) {
            res[0]['suffix'] =  nameSuffixObj[0].code;
          } else {
            res[0]['suffix'] = '';
          }
        }
  
        if(res[2] && res[2].length > 0) {
          const genderObj =  res[2].filter(rec => rec.code ===  res[0]['genderCd']);
          if(genderObj && genderObj.length > 0) {
            res[0]['genderCd'] =  genderObj[0].code;
          } else {
            res[0]['genderCd'] = '';
          }
        }
  
        this.setPersonMatchDetails(res[0]);
      }
    }, err => {
      this.toastr.error("Internal Server Error!");
    });
  }

  onSsnAvailableChange(event){
    if (event || event == 'Y'){
      this.getFormData().ssn.disable();
      this.toastr.warning(this.customValidation.c11, '', {
        timeOut: 4000,
        positionClass: 'toast-top-full-width' });
    } else {
      this.getFormData().ssn.enable();
    }
  }

  ssnChange(event) {
    if(this.getFormData().ssn.value){
      this.getFormData().ssnAvailableSw.disable();
    }else{
      this.getFormData().ssnAvailableSw.enable();
    }
  }

  calculateAge(event) {
    let birthDate: any = new Date(event)
    let ageDifMs = Date.now() - birthDate;
    let ageDate = new Date(ageDifMs);
    this.age =  Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  ngOnDestroy(){
    if(this.subscriptions$ && this.subscriptions$.length > 0) {
      this.subscriptions$.forEach(subscription$ => subscription$.unsubscribe());
    }
    sessionStorage.removeItem('ACTIVE_SESSION_DATA');
   }

   setAddress(code) {
    this.addressTypeCode = code;
    if(code === 'MA') {
      this.personDetailsForm.controls['physicalAddress']['controls']['addressLine1'].setValue(this.personMatchDetails.mailingAddressVO.addrLine1);
      this.personDetailsForm.controls['physicalAddress']['controls']['addressLine2'].setValue(this.personMatchDetails.mailingAddressVO.addrLine2);
      this.personDetailsForm.controls['physicalAddress']['controls']['city'].setValue(this.personMatchDetails.mailingAddressVO.city);
      this.personDetailsForm.controls['physicalAddress']['controls']['state'].setValue(this.personMatchDetails.mailingAddressVO.stateCd);
      this.personDetailsForm.controls['physicalAddress']['controls']['zipCode'].setValue(this.personMatchDetails.mailingAddressVO.zip);
      this.personDetailsForm.controls['physicalAddress']['controls']['ext'].setValue(this.personMatchDetails.mailingAddressVO.zipExtn);
      this.personDetailsForm.controls['physicalAddress']['controls']['county'].setValue(this.personMatchDetails.mailingAddressVO.cntyCd);
      this.personDetailsForm.controls['physicalAddress']['controls']['mailAddrSw'].setValue(this.personMatchDetails.mailingAddressVO.mailAddrSw);
      this.personDetailsForm.controls['physicalAddress']['controls']['addrFormatCd'].setValue(this.personMatchDetails.mailingAddressVO.addrFormatCd);
      this.personDetailsForm.controls['physicalAddress']['controls']['reqPageId'].setValue(this.personMatchDetails.mailingAddressVO.reqPageId);
    }
    else {
      this.personDetailsForm.controls['physicalAddress']['controls']['addressLine1'].setValue(this.personMatchDetails.physicalAddressVO.addrLine1);
      this.personDetailsForm.controls['physicalAddress']['controls']['addressLine2'].setValue(this.personMatchDetails.physicalAddressVO.addrLine2);
      this.personDetailsForm.controls['physicalAddress']['controls']['city'].setValue(this.personMatchDetails.physicalAddressVO.city);
      this.personDetailsForm.controls['physicalAddress']['controls']['state'].setValue(this.personMatchDetails.physicalAddressVO.stateCd);
      this.personDetailsForm.controls['physicalAddress']['controls']['zipCode'].setValue(this.personMatchDetails.physicalAddressVO.zip);
      this.personDetailsForm.controls['physicalAddress']['controls']['ext'].setValue(this.personMatchDetails.physicalAddressVO.zipExtn);
      this.personDetailsForm.controls['physicalAddress']['controls']['county'].setValue(this.personMatchDetails.physicalAddressVO.cntyCd);
      this.personDetailsForm.controls['physicalAddress']['controls']['mailAddrSw'].setValue(this.personMatchDetails.physicalAddressVO.mailAddrSw);
      this.personDetailsForm.controls['physicalAddress']['controls']['addrFormatCd'].setValue(this.personMatchDetails.physicalAddressVO.addrFormatCd);
      this.personDetailsForm.controls['physicalAddress']['controls']['reqPageId'].setValue(this.personMatchDetails.physicalAddressVO.reqPageId);
    }

   }

   setPersonMatchDetails(data){
    this.personMatchDetails = data;
    const firstPersionId = this.personId1 ? this.personId1 : this.inboxPersonId;
    this.personDetailsForm.controls['persionId'].setValue(firstPersionId);
    this.personDetailsForm.controls['recordId'].setValue(this.mainRecordId);
    this.personDetailsForm.controls['recordType'].setValue(this.mainRecordType);
    this.personDetailsForm.controls['firstName'].setValue(data.firstName);
    this.personDetailsForm.controls['mi'].setValue(data.midInitial);
    this.personDetailsForm.controls['lastName'].setValue(data.lastName);
    this.personDetailsForm.controls['dobDt'].setValue(data.dobDt);
    this.personDetailsForm.controls['gender'].setValue(data.genderCd);
    this.personDetailsForm.controls['ssn'].setValue(data.ssn);
    this.personDetailsForm.controls['suffix'].setValue(data.suffix);
    this.setAddress('PA');
    this.calculateAge(data.dobDt);
   }

  savePersonDetails(){
    let payload = {
        "personId":this.getFormData().persionId.value,
        "recordId": this.getFormData().recordId.value,
        "recordType": this.getFormData().recordType.value,
        "firstName": this.getFormData().firstName.value,
        "midInitial": this.getFormData().mi.value,
        "lastName": this.getFormData().lastName.value,
        "suffix": this.getFormData().suffix.value,
        "dobDt": this.getFormData().dobDt.value,
        "genderCd": this.getFormData().gender.value,
        "ssn": this.getFormData().ssnAvalSw.value ? this.getFormData().ssn.value : null,
        "enrollmentGroup": null,
        "fileClearanceSw": null,
        "id": 0,
        "mailingAddressVO": {
          "addrFormatCd": this.getFormData().physicalAddress.value.addrFormatCd,
          "addrLine1": this.getFormData().physicalAddress.value.addressLine1,
          "addrLine2": this.getFormData().physicalAddress.value.addressLine2,
          "addrTypeCd": this.addressTypeCode,
          "city": this.getFormData().physicalAddress.value.city,
          "cntyCd":  this.getFormData().physicalAddress.value.county,
          "id": 0,
          "mailAddrLine1": null,
          "mailAddrLine2": null,
          "mailAddrSw": this.getFormData().physicalAddress.value.mailAddrSw,
          "mailAddressFormatCd": null,
          "mailCity": null,
          "mailCounty": null,
          "mailMilitaryPoCd": null,
          "mailMilitaryStateCd": null,
          "mailState": null,
          "mailValidatedAddressCd": null,
          "mailZip": null,
          "mailZipExtn": null,
          "militaryPoCd": null,
          "militaryStateCd": null,
          "prsnId": 0,
          "reqPageId": this.getFormData().physicalAddress.value.reqPageId ? this.getFormData().physicalAddress.value.reqPageId : ' ',
          "stateCd": this.getFormData().physicalAddress.value.state,
          "validatedAddressCd": null,
          "zip": this.getFormData().physicalAddress.value.zipCode,
          "zipExtn": this.getFormData().physicalAddress.value.ext
        },
        "physicalAddressVO": {
          "addrFormatCd": this.getFormData().physicalAddress.value.addrFormatCd,
          "addrLine1": this.getFormData().physicalAddress.value.addressLine1,
          "addrLine2": this.getFormData().physicalAddress.value.addressLine2,
          "addrTypeCd": this.addressTypeCode,
          "city": this.getFormData().physicalAddress.value.city,
          "cntyCd": this.getFormData().physicalAddress.value.county,
          "id": 0,
          "mailAddrLine1": null,
          "mailAddrLine2": null,
          "mailAddrSw": this.getFormData().physicalAddress.value.mailAddrSw,
          "mailAddressFormatCd": null,
          "mailCity": null,
          "mailCounty": null,
          "mailMilitaryPoCd": null,
          "mailMilitaryStateCd": null,
          "mailState": null,
          "mailValidatedAddressCd": null,
          "mailZip": null,
          "mailZipExtn": null,
          "militaryPoCd": null,
          "militaryStateCd": null,
          "prsnId": 0,
          "reqPageId": this.getFormData().physicalAddress.value.reqPageId ? this.getFormData().physicalAddress.value.reqPageId : ' ',
          "stateCd": this.getFormData().physicalAddress.value.state,
          "validatedAddressCd": null,
          "zip": this.getFormData().physicalAddress.value.zipCode,
          "zipExtn": this.getFormData().physicalAddress.value.ext
        }
      }
      console.log("payload ",payload)
      this.personReconciliationService.updatePersonMatch(payload).subscribe(res => {
        if(res && res.message) {
          this.toastr.error(res.message);
        } else {
          this.toastr.success(res.successMsgDescription);
          if(this.personMatchDetails.physicalAddressVO.addrFormatCd == 'USAD'){
            this.addrPhysicalAddressType = 'residential';
          } else if(this.personMatchDetails.mailingAddressVO.addrFormatCd == 'MA') {
            this.addrMailingAddressType = 'mailing'
          }
          let updatePayload = {
            "activeIndicator": null,
            "addresses": [
              {
                "addrType": this.addrPhysicalAddressType ? this.addrPhysicalAddressType : null,
                "city": this.personMatchDetails.physicalAddressVO.city ? this.personMatchDetails.physicalAddressVO.city : null,
                "countyCode": this.personMatchDetails.physicalAddressVO.cntyCd ? this.personMatchDetails.physicalAddressVO.cntyCd : null,
                "mailing": null,
                "state": this.personMatchDetails.physicalAddressVO.stateCd ? this.personMatchDetails.physicalAddressVO.stateCd : null,
                "street1": this.personMatchDetails.physicalAddressVO.addrLine1 ? this.personMatchDetails.physicalAddressVO.addrLine1 : null,
                "street2": this.personMatchDetails.physicalAddressVO.addrLine2 ? this.personMatchDetails.physicalAddressVO.addrLine2 : null,
                "street3": null,
                "street4": null,
                "zipCode": this.personMatchDetails.physicalAddressVO.zip ? this.personMatchDetails.physicalAddressVO.zip : null,
                "zipCodeExt": this.personMatchDetails.physicalAddressVO.zipExtn ? this.personMatchDetails.physicalAddressVO.zipExtn : null
              },
              {
                "addrType": this.addrMailingAddressType ? this.addrMailingAddressType : null,
                "city": this.personMatchDetails.mailingAddressVO.city ? this.personMatchDetails.mailingAddressVO.city : null,
                "countyCode": this.personMatchDetails.mailingAddressVO.cntyCd ? this.personMatchDetails.mailingAddressVO.cntyCd : null,
                "mailing": null,
                "state": this.personMatchDetails.mailingAddressVO.stateCd ? this.personMatchDetails.mailingAddressVO.stateCd : null,
                "street1": this.personMatchDetails.mailingAddressVO.addrLine1 ? this.personMatchDetails.mailingAddressVO.addrLine1 : null,
                "street2": this.personMatchDetails.mailingAddressVO.addrLine2 ? this.personMatchDetails.mailingAddressVO.addrLine2 : null,
                "street3": null,
                "street4": null,
                "zipCode": this.personMatchDetails.mailingAddressVO.zip ? this.personMatchDetails.mailingAddressVO.zip : null,
                "zipCodeExt": this.personMatchDetails.mailingAddressVO.zipExtn ? this.personMatchDetails.mailingAddressVO.zipExtn : null
              }
            ],
            "aliases": [
              {
                "aliasType": null,
                "name": {
                  "firstName": this.personMatchDetails.aliasFirstName,
                  "lastName": this.personMatchDetails.aliasLastName,
                  "middleInitial": this.personMatchDetails.aliasMidInitial,
                  "prefix": null,
                  "suffix": this.personMatchDetails.aliasSuffix
                }
              }
            ],
            "dateOfBirth": this.getFormData().dobDt.value,
            "dateOfDeath": null,
            "electronicAddresses": [
              {
                "eAddrType": null,
                "value": null
              }
            ],
            "enterpriseId": null,
            "evtinitiaror": null,
            "gender": this.getFormData().gender.value,
            "matchingSSN": null,
            "medicaidId": null,
            "messageHeader": {
              "dateTimestamp": "2002-05-30T09:00:00",
              "originatorId": "ws-teds",
              "refereapp-documents-historynceId": 123,
              "transactionDate": "2020-09-30T14:22:15.769Z",
              "transactionId": 1234
            },
            "name": {
              "firstName": null,
              "lastName": null,
              "middleInitial": null,
              "prefix": null,
              "suffix": null
            },
            "overrideFlag": "Y",
            "phones": [
              {
                "phoneExtension": null,
                "phoneNumber": null,
                "phoneType": null
              }
            ],
            "primaryLanguage": {
              "spoken": null,
              "written": null
            },
            "sourceRecipientId": this.getFormData().persionId.value,
            "ssn": this.getFormData().ssnAvalSw.value ? this.getFormData().ssn.value : null,
            "ssnVRF": null
          }
          this.personReconciliationService.updateRecipient(updatePayload).subscribe(res => {
            if(res && res.message) {
              this.toastr.error(res.message);
            } else {
              this.toastr.success(res.successMsgDescription);
            }
          })
        }
      }, err => {
        this.toastr.error('Service Error!');
      })
   }


  getSearchResults() {
    let payload = {
      "messageHeader": {
          "referenceId": "123",
          "originatorId": "345",
          "transactionId": "234",
          "dateTimestamp": "2002-05-30T09:00:00"
      },
      "sourceSystemId": "PERLSS",
      "ssn": this.getFormData().ssn.value,
      "name": {
          "lastName": this.getFormData().lastName.value,
          "firstName": this.getFormData().firstName.value
      },
      "dateOfBirth": this.getFormData().dobDt.value,
      "gender": this.getFormData().gender.value,
      "addresses": [
          {
              "addrType": "residential",
              "street1":  this.getFormData().physicalAddress.value.addressLine1,
              "city": this.getFormData().physicalAddress.value.city,
              "state": this.getFormData().physicalAddress.value.state,
              "zipCode": this.getFormData().physicalAddress.value.zipCode,
              "countyCode": this.getFormData().physicalAddress.value.county,
          }
      ],
      "memberSearch": "N",
      "maximumResultsSize": 99,
      "minimumMatchScore": 0
  }
    const observables = [];
    observables.push(this.personReconciliationService.getsearchRecipient(payload));
    observables.push(this.personReconciliationService.getMDMData());
    forkJoin(observables).subscribe((res: any) => {
      if(res[0] && res[0].results && res[0].results.recipients) {
        this.searchRecipientRecords = res[0].results.recipients;
        console.log("searchRecipientRecords ", this.searchRecipientRecords)
        console.log("res[1] ",res[1]);
        const matchedData = res[1].filter(mdmData => mdmData.code === "FULLMATCH");
        let fullMatchVal = 0;
        if(matchedData && matchedData.length > 0) {
          fullMatchVal = matchedData[0].value;
          this.searchRecipientRecords.forEach(recipient => {
            if(recipient["matchScore"] >= fullMatchVal) {
              recipient["matchCode"] = matchedData[0].code;
            } else {
              recipient["matchCode"] = "PARTIALMATCH";
            }

          });
        }

      }
    })
    this.displaySearchResults  = true;
  }

}
