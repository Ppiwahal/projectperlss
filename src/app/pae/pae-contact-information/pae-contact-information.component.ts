import { Component, OnInit, Output, EventEmitter, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatRadioChange, MatRadioButton } from '@angular/material/radio';
import { SavePopupComponent } from 'src/app/savePopup/savePopup.component';
import { CustomvalidationService } from 'src/app/_shared/utility/customvalidation.service';
import * as customValidation from '../../_shared/constants/validation.constants';
import { PaeContactInformation } from '../../_shared/model/PaeContactInformation';
import { PaeContactInfoAddress } from '../../_shared/model/PaeContactInfoAddress';
import { MatSelectChange } from '@angular/material/select';
import { PaeService } from '../../core/services/pae/pae.service';
import { PaeFlowSeq } from '../../_shared/utility/PaeFlowSeq';
import { HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { PaeContactInformationDetails } from 'src/app/_shared/model/PaeContactInformationDetails';
import { PaeCommonService } from './../../core/services/pae/pae-common/pae-common.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ReferralService } from '../../core/services/referral/referral.service';
import { AddressValidationComponent } from '../../_shared/components/address-validation/address-validation.component';
// import { SaveWarningPopupComponent } from 'src/app/save-warning-popup/save-warning-popup.component';
import { ComponentCanDeactivate } from 'src/app/core/helpers/pending-change.guard';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-pae-contact-information',
  templateUrl: './pae-contact-information.component.html',
  styleUrls: ['./pae-contact-information.component.scss']
})

export class PaeContactInformationComponent implements OnInit, ComponentCanDeactivate {
  languageList = [
    {code: 'EN', value:'English',activateSW:'Y'},
    {code: 'ES', value:'Spanish',activateSW:'Y'},
    {code: 'RU', value:'Russian',activateSW:'Y'},
    {code: 'OT', value:'Other',activateSW:'Y'},
    {code: 'FR', value:'French',activateSW:'Y'},
    {code: 'GM', value:'German',activateSW:'Y'},
    {code: 'VT', value:'Vietnamese',activateSW:'Y'},
    {code: 'LO', value:'Laotian',activateSW:'Y'},
    {code: 'AR', value:'Arabic',activateSW:'Y'},
    {code: 'KU', value:'Kurdish',activateSW:'Y'},
    {code: 'CH', value:'Chinese',activateSW:'Y'},
    {code: 'KO', value:'Korean',activateSW:'Y'},
    {code: 'AM', value:'Amharic',activateSW:'Y'},
    {code: 'GU', value:'Gujarati',activateSW:'Y'},
    {code: 'TG', value:'Tagalog',activateSW:'Y'},
    {code: 'HI', value:'Hindi',activateSW:'Y'},
    {code: 'SC', value:'Serbo-Croatian',activateSW:'Y'},
    {code: 'PE', value:'Persian',activateSW:'Y'},
    {code: 'NP', value:'Nepali',activateSW:'Y'}
  ];

  relationList = [
    { code: 'PG', value: 'Parent or Guardian', activateSW: 'Y' },
    { code: 'CV', value: 'Conservator', activateSW: 'Y' },
    { code: 'CW', value: 'Case Worker', activateSW: 'Y' },
    { code: 'FA', value: 'Other Family/Friend', activateSW: 'Y' },
    { code: 'SP', value: 'Spouse/Significant Other', activateSW: 'Y' },
    { code: 'AT', value: 'Attorney', activateSW: 'Y' }
  ];

  langList = [
    { code: 'EN', value: 'English', activateSW: 'Y' },
    { code: 'ES', value: 'Spanish', activateSW: 'Y' },
    { code: 'RU', value: 'Russian', activateSW: 'Y' },
    { code: 'OT', value: 'Other', activateSW: 'Y' },
    { code: 'FR', value: 'French', activateSW: 'Y' },
    { code: 'GM', value: 'German', activateSW: 'Y' },
    { code: 'VT', value: 'Vietnamese', activateSW: 'Y' },
    { code: 'LO', value: 'Laotian', activateSW: 'Y' },
    { code: 'AR', value: 'Arabic', activateSW: 'Y' },
    { code: 'KU', value: 'Kurdish', activateSW: 'Y' },
    { code: 'CH', value: 'Chinese', activateSW: 'Y' },
    { code: 'KO', value: 'Korean', activateSW: 'Y' },
    { code: 'AM', value: 'Amharic', activateSW: 'Y' },
    { code: 'GU', value: 'Gujarati', activateSW: 'Y' },
    { code: 'TG', value: 'Tagalog', activateSW: 'Y' },
    { code: 'HI', value: 'Hindi', activateSW: 'Y' },
    { code: 'SC', value: 'Serbo-Croatian', activateSW: 'Y' },
    { code: 'PE', value: 'Persian', activateSW: 'Y' },
    { code: 'NP', value: 'Nepali', activateSW: 'Y' }
  ];
  Miltary_statusRt = [{"code": "AA", "value":"AA - Armed Forces America ","activateSW":"Y"},
  {"code": "AE", "value":"AE - Armed Forces Africa, Canada, Europe, Middle East","activateSW":"Y"},
  {"code": "AP", "value":"AP - Armed Forces Pacific","activateSW":"Y"}];

  stateList = [
    { code: 'TN', value: 'Tennessee', activateSW: 'Y' },
    { code: 'AL', value: 'Alabama', activateSW: 'Y' },
    { code: 'AK', value: 'Alaska', activateSW: 'Y' },
    { code: 'AZ', value: 'Arizona', activateSW: 'Y' },
    { code: 'AR', value: 'Arkansas', activateSW: 'Y' },
    { code: 'CA', value: 'California', activateSW: 'Y' },
    { code: 'CO', value: 'Colorado', activateSW: 'Y' },
    { code: 'CT', value: 'Connecticut', activateSW: 'Y' },
    { code: 'DE', value: 'Delaware', activateSW: 'Y' },
    { code: 'DC', value: 'District of Columbia', activateSW: 'Y' },
    { code: 'FL', value: 'Florida', activateSW: 'Y' },
    { code: 'GA', value: 'Georgia', activateSW: 'Y' },
    { code: 'HI', value: 'Hawaii', activateSW: 'Y' },
    { code: 'ID', value: 'Idaho', activateSW: 'Y' },
    { code: 'IL', value: 'Illinois', activateSW: 'Y' },
    { code: 'IN', value: 'Indiana', activateSW: 'Y' },
    { code: 'IA', value: 'Iowa', activateSW: 'Y' },
    { code: 'KS', value: 'Kansas', activateSW: 'Y' },
    { code: 'KY', value: 'Kentucky', activateSW: 'Y' },
    { code: 'LA', value: 'Louisiana', activateSW: 'Y' },
    { code: 'ME', value: 'Maine', activateSW: 'Y' },
    { code: 'MD', value: 'Maryland', activateSW: 'Y' },
    { code: 'MA', value: 'Massachusetts', activateSW: 'Y' },
    { code: 'MI', value: 'Michigan', activateSW: 'Y' },
    { code: 'MN', value: 'Minnesota', activateSW: 'Y' },
    { code: 'MS', value: 'Mississippi', activateSW: 'Y' },
    { code: 'MO', value: 'Missouri', activateSW: 'Y' },
    { code: 'MT', value: 'Montana', activateSW: 'Y' },
    { code: 'NE', value: 'Nebraska', activateSW: 'Y' },
    { code: 'NV', value: 'Nevada', activateSW: 'Y' },
    { code: 'NH', value: 'New Hampshire', activateSW: 'Y' },
    { code: 'NJ', value: 'New Jersey', activateSW: 'Y' },
    { code: 'NM', value: 'New Mexico', activateSW: 'Y' },
    { code: 'NY', value: 'New York', activateSW: 'Y' },
    { code: 'NC', value: 'North Carolina', activateSW: 'Y' },
    { code: 'ND', value: 'North Dakota', activateSW: 'Y' },
    { code: 'OH', value: 'Ohio', activateSW: 'Y' },
    { code: 'OK', value: 'Oklahoma', activateSW: 'Y' },
    { code: 'OR', value: 'Oregon', activateSW: 'Y' },
    { code: 'PA', value: 'Pennsylvania', activateSW: 'Y' },
    { code: 'RI', value: 'Rhode Island', activateSW: 'Y' },
    { code: 'SC', value: 'South Carolina', activateSW: 'Y' },
    { code: 'SD', value: 'South Dakota', activateSW: 'Y' },
    { code: 'TX', value: 'Texas', activateSW: 'Y' },
    { code: 'UT', value: 'Utah', activateSW: 'Y' },
    { code: 'VT', value: 'Vermont', activateSW: 'Y' },
    { code: 'VA', value: 'Virginia', activateSW: 'Y' },
    { code: 'WA', value: 'Washington', activateSW: 'Y' },
    { code: 'WV', value: 'West Virginia', activateSW: 'Y' },
    { code: 'WI', value: 'Wisconsin', activateSW: 'Y' },
    { code: 'WY', value: 'Wyoming', activateSW: 'Y' },
    { code: 'AS', value: 'American Samoa', activateSW: 'Y' },
    { code: 'FM', value: 'Federated States Of Micronesia', activateSW: 'Y' },
    { code: 'GU', value: 'Guam', activateSW: 'Y' },
    { code: 'MH', value: 'Marshall Islands', activateSW: 'Y' },
    { code: 'NI', value: 'North Mariana Islands', activateSW: 'Y' },
    { code: 'PR', value: 'Puerto Rico', activateSW: 'Y' },
    { code: 'PW', value: 'Palau', activateSW: 'Y' },
    { code: 'VI', value: 'Virgin Islands', activateSW: 'Y' },
  ];

  countyList = [
    { code: '001', value: 'Anderson', activateSW: 'Y' },
    { code: '002', value: 'Bedford', activateSW: 'Y' },
    { code: '003', value: 'Benton', activateSW: 'Y' },
    { code: '004', value: 'Bledsoe', activateSW: 'Y' },
    { code: '005', value: 'Blount', activateSW: 'Y' },
    { code: '006', value: 'Bradley', activateSW: 'Y' },
    { code: '007', value: 'Campbell', activateSW: 'Y' },
    { code: '008', value: 'Cannon', activateSW: 'Y' },
    { code: '009', value: 'Carroll', activateSW: 'Y' },
    { code: '010', value: 'Carter', activateSW: 'Y' },
    { code: '011', value: 'Cheatham', activateSW: 'Y' },
    { code: '012', value: 'Chester', activateSW: 'Y' },
    { code: '013', value: 'Claiborne', activateSW: 'Y' },
    { code: '014', value: 'Clay', activateSW: 'Y' },
    { code: '015', value: 'Cocke', activateSW: 'Y' },
    { code: '016', value: 'Coffee', activateSW: 'Y' },
    { code: '017', value: 'Crockett', activateSW: 'Y' },
    { code: '018', value: 'Cumberland', activateSW: 'Y' },
    { code: '019', value: 'Davidson', activateSW: 'Y' },
    { code: '020', value: 'Decatur', activateSW: 'Y' },
    { code: '021', value: 'DeKalb', activateSW: 'Y' },
    { code: '022', value: 'Dickson', activateSW: 'Y' },
    { code: '023', value: 'Dyer', activateSW: 'Y' },
    { code: '024', value: 'Fayette', activateSW: 'Y' },
    { code: '025', value: 'Fentress', activateSW: 'Y' },
    { code: '026', value: 'Franklin', activateSW: 'Y' },
    { code: '027', value: 'Gibson', activateSW: 'Y' },
    { code: '028', value: 'Giles', activateSW: 'Y' },
    { code: '029', value: 'Grainger', activateSW: 'Y' },
    { code: '030', value: 'Greene', activateSW: 'Y' },
    { code: '031', value: 'Grundy', activateSW: 'Y' },
    { code: '032', value: 'Hamblen', activateSW: 'Y' },
    { code: '033', value: 'Hamilton', activateSW: 'Y' },
    { code: '034', value: 'Hancock', activateSW: 'Y' },
    { code: '035', value: 'Hardeman', activateSW: 'Y' },
    { code: '036', value: 'Hardin', activateSW: 'Y' },
    { code: '037', value: 'Hawkins', activateSW: 'Y' },
    { code: '038', value: 'Haywood', activateSW: 'Y' },
    { code: '039', value: 'Henderson', activateSW: 'Y' },
    { code: '040', value: 'Henry', activateSW: 'Y' },
    { code: '041', value: 'Hickman', activateSW: 'Y' },
    { code: '042', value: 'Houston', activateSW: 'Y' },
    { code: '043', value: 'Humphreys', activateSW: 'Y' },
    { code: '044', value: 'Jackson', activateSW: 'Y' },
    { code: '045', value: 'Jefferson', activateSW: 'Y' },
    { code: '046', value: 'Johnson', activateSW: 'Y' },
    { code: '047', value: 'Knox', activateSW: 'Y' },
    { code: '048', value: 'Lake', activateSW: 'Y' },
    { code: '049', value: 'Lauderdale', activateSW: 'Y' },
    { code: '050', value: 'Lawrence', activateSW: 'Y' },
    { code: '051', value: 'Lewis', activateSW: 'Y' },
    { code: '052', value: 'Lincoln', activateSW: 'Y' },
    { code: '053', value: 'Loudon', activateSW: 'Y' },
    { code: '054', value: 'Macon', activateSW: 'Y' },
    { code: '055', value: 'Madison', activateSW: 'Y' },
    { code: '056', value: 'Marion', activateSW: 'Y' },
    { code: '057', value: 'Marshall', activateSW: 'Y' },
    { code: '058', value: 'Maury', activateSW: 'Y' },
    { code: '059', value: 'Meigs', activateSW: 'Y' },
    { code: '060', value: 'Monroe', activateSW: 'Y' },
    { code: '061', value: 'Montgomery', activateSW: 'Y' },
    { code: '062', value: 'Moore', activateSW: 'Y' },
    { code: '063', value: 'Morgan', activateSW: 'Y' },
    { code: '064', value: 'McMinn', activateSW: 'Y' },
    { code: '065', value: 'McNairy', activateSW: 'Y' },
    { code: '066', value: 'Obion', activateSW: 'Y' },
    { code: '067', value: 'Overton', activateSW: 'Y' },
    { code: '068', value: 'Perry', activateSW: 'Y' },
    { code: '069', value: 'Pickett', activateSW: 'Y' },
    { code: '070', value: 'Polk', activateSW: 'Y' },
    { code: '071', value: 'Putnam', activateSW: 'Y' },
    { code: '072', value: 'Rhea', activateSW: 'Y' },
    { code: '073', value: 'Roane', activateSW: 'Y' },
    { code: '074', value: 'Robertson', activateSW: 'Y' },
    { code: '075', value: 'Rutherford', activateSW: 'Y' },
    { code: '076', value: 'Scott', activateSW: 'Y' },
    { code: '077', value: 'Sequatchie', activateSW: 'Y' },
    { code: '078', value: 'Sevier', activateSW: 'Y' },
    { code: '079', value: 'Shelby', activateSW: 'Y' },
    { code: '080', value: 'Smith', activateSW: 'Y' },
    { code: '081', value: 'Stewart', activateSW: 'Y' },
    { code: '082', value: 'Sullivan', activateSW: 'Y' },
    { code: '083', value: 'Sumner', activateSW: 'Y' },
    { code: '084', value: 'Tipton', activateSW: 'Y' },
    { code: '085', value: 'Trousdale', activateSW: 'Y' },
    { code: '086', value: 'Unicoi', activateSW: 'Y' },
    { code: '087', value: 'Union', activateSW: 'Y' },
    { code: '088', value: 'Van Buren', activateSW: 'Y' },
    { code: '089', value: 'Warren', activateSW: 'Y' },
    { code: '090', value: 'Washington', activateSW: 'Y' },
    { code: '091', value: 'Wayne', activateSW: 'Y' },
    { code: '092', value: 'Weakley', activateSW: 'Y' },
    { code: '093', value: 'White', activateSW: 'Y' },
    { code: '094', value: 'Williamson', activateSW: 'Y' },
    { code: '095', value: 'Wilson', activateSW: 'Y' },
    { code: '999', value: 'Out of State', activateSW: 'Y' },
  ];

  isSamePageNavigation: boolean;
  refId: any;
  constructor(
    private fb: FormBuilder,
    private customValidator: CustomvalidationService,
    private paeService: PaeService,
    private refService: ReferralService,
    private dialog: MatDialog,
    private router: Router,
    private paeCommonService: PaeCommonService
  ) { }

  get f() {
    return this.myForm.controls;
  }
  pageId: string = 'PPPCI';
  customValidation = customValidation;
  myForm: FormGroup;
  isDesignee = false;
  event: string;
  submitted: boolean;
  nextPath: string;
  refContactForm: any;
  showHideLang = false;
  showHideMailAddr = false;
  mailAddrFormatSW = false;
  isTN2 = false;
  showHideContactDetails = false;
  addrFormatSW = false;
  addrFormatSW2 = false;
  isTN = false;
  mailAddrSW = false;
  mailAddrFormatSW2 = false;
  isTN3 = false;
  isKB = false;
  showSpinner = false;
  enableNext = true;
  fillThisArray = [];
  arrayForAddress = [];
  showPreferredPhoneType: boolean;
  prefferedPhoneArray = [];
  applicantAge: number;
  showQuestion: boolean = false;
  applicantLess18: boolean = false;
  applicantName: any;
  getFormData() {
    return this.myForm.controls;
  }
  saveRefandContact() {
    throw new Error('Method not implemented.');
  }

  ngOnInit() {
    console.log(this.paeCommonService.getPaeId());
    this.myForm = this.fb.group({
      applicantEmailAddr: ['', [this.customValidator.emailValidator()]],
      emailAddress2: [''],
      emailAddress3: ['', [this.customValidator.emailValidator()]],
      applicantCellPhNum: ['', [Validators.maxLength(10), this.customValidator.phonenumberValidator()]],
      cellPhone2: ['', [Validators.maxLength(10), this.customValidator.phonenumberValidator()]],
      cellPhone3: ['', [Validators.maxLength(10), this.customValidator.phonenumberValidator()]],
      applicantHomePhNum: ['', [Validators.maxLength(10), this.customValidator.phonenumberValidator()]],
      homePhone2: ['', [Validators.maxLength(10), this.customValidator.phonenumberValidator()]],
      homePhone3: ['', [Validators.maxLength(10), this.customValidator.phonenumberValidator()]],
      applicantWorkPhNum: ['', [Validators.maxLength(10), this.customValidator.phonenumberValidator()]],
      workPhone2: ['', [Validators.maxLength(10), this.customValidator.phonenumberValidator()]],
      workPhone3: ['', [Validators.maxLength(10), this.customValidator.phonenumberValidator()]],
      hasLegalRightsSw: [''],
      prefPhTypeCd: [''],
      firstName: [''],
      midInitial: [''],
      lastName: [''],
      reltshpCd: [''],
      cellPhNum: [''],
      appDsgnSw: [''],
      childRecordRights: [''],
      language: [''],
      interprtLang: [''],
      prefLangLettersCd: ['', Validators.required],
      preflangCd2: [''],
      appInterSw: [''],
      mailAddressFormatCd: ['USAD'],
      mailAddrLine1: [''],
      mailAddrLine2: [''],
      mailCity: [''],
      mailState: ['TN'],
      mailZip: [''],
      mailZipExtn: [''],
      mailCounty: [''],
      apoFpoCd2: [''],
      aaAeApCd2: [''],
      suffix: [''],
      addressFormatCd: ['USAD'],
      addressFormatCd2: ['USAD'],
      addressLine1: ['', [Validators.maxLength(100), Validators.pattern('^[A-Za-z0-9 ]+$')]],
      addressLine2: ['', [Validators.maxLength(50), Validators.pattern('^[A-Za-z0-9 ]+$')]],
      stateCd: ['TN'],
      city: ['', [Validators.maxLength(25), this.customValidator.addressAndCityValidator()]],
      zipcode: ['', [Validators.pattern('[0-9]{5}')]],
      zipExt: ['', Validators.pattern('[0-9]')],
      countyCd: ['NA'],
      apoFpoCd: [''],
      aaAeApCd: [''],
      mailAddressFormatCd2: ['USAD'],
      mailAddrLine1ex: ['', [Validators.maxLength(100), Validators.pattern('^[A-Za-z0-9 ]+$')]],
      mailAddrLine2ex: ['', [Validators.maxLength(50), Validators.pattern('^[A-Za-z0-9 ]+$')]],
      mailCity2: ['', [Validators.maxLength(25), this.customValidator.addressAndCityValidator()]],
      mailState2: ['TN'],
      mailZip2: ['', [Validators.pattern('[0-9]{5}')]],
      mailZipExtn2: ['', Validators.pattern('[0-9]')],
      mailCounty2: [''],
      apoFpoCd3: [''],
      aaAeApCd3: [''],
      addressLine1ex: [''],
      addressLine2ex: [''],
      city2: [''],
      stateCd2: ['TN'],
      zipcode2: [''],
      zipExt2: [''],
      countyCd2: [''],
      apoFpoCd4: [''],
      aaAeApCd4: [''],
      mailSw: [''],
      mailSwHoh: ['']
    });
    this.getApplicantName();
    this.ageRelatedActivity();
	
	if ((this.paeCommonService.getRowElement()).refId !== null && (this.paeCommonService.getRowElement()).refId !== undefined){
	   this.refId=(this.paeCommonService.getRowElement()).refId;
	   this.getRefContactInfo();
   } else if (this.paeCommonService.getPaeId() !== null && this.paeCommonService.getPaeId() !== undefined){
	   this.getPaeContactInfoDetails();
   }
  }

  getApplicantName(){
    this.paeService.getPaeApplicantInformation(this.paeCommonService.getPaeId(),this.pageId).then((response)=> {
      console.log("reponseforName"+JSON.stringify(response.body.firstName));
      this.applicantName =  response.body.firstName+" "+response.body.lastName;
	  this.paeCommonService.setApplicantName(this.applicantName);
    });
  }

  getPaeContactInfoDetails(){
    this.paeService.getPaeApplicantContactInfo(this.paeCommonService.getPaeId()).then((res)=> {
      console.log("response===>" + JSON.stringify(res));
      this.myForm.patchValue(res.body.response[0]);
      if(res.body.response[0].appDsgnSw === 'Y')
      {
        this.isDesignee = true;
      }else if(res.body.response[0].appDsgnSw === 'N')
      {
        this.isDesignee = false;
      }
    });
  }

  getRefContactInfo(){
    const loadData = this.refService.getRefContactDetails(this.paeCommonService.getRowElement().refId, this.pageId)
    .then(response => {
      let receivedData = response;
      if(receivedData.body.appDsgnSw === 'Y'){
        this.isDesignee = true;
      } else if(receivedData.body.appDsgnSw === 'N')
      {
        this.isDesignee = false;
      }

      if(response.body.appInterSw === 'Y')
      {
        this.showHideLang = true;
      } else if(response.body.appInterSw === 'N')
      {
        this.showHideLang = false;
      }
      console.log("receivedData" + JSON.stringify(receivedData));
        this.myForm.patchValue(receivedData.body);
        this.myForm.patchValue(receivedData.body.refLivingArrangementVO);
      });

  }

  ageRelatedActivity() {
    this.applicantAge = this.paeCommonService.getAge();
    if(this.applicantAge>=18){
      this.showQuestion = true;
    }
    else if (this.applicantAge < 18) {
      this.applicantLess18 = true;
      this.getFormData().firstName.setValidators([Validators.required, Validators.maxLength(45), this.customValidator.nameValidator()]);
      this.getFormData().midInitial.setValidators([Validators.maxLength(1), Validators.pattern('^[a-zA-Z]*$')]);
      this.getFormData().lastName.setValidators([Validators.required, Validators.maxLength(45), this.customValidator.nameValidator()]);
      this.getFormData().reltshpCd.setValidators([Validators.required]);
      this.getFormData().cellPhNum.setValidators([Validators.required, Validators.maxLength(10), this.customValidator.phonenumberValidator()]);
    }
    this.getFormData().firstName.updateValueAndValidity();
    this.getFormData().midInitial.updateValueAndValidity();
    this.getFormData().lastName.updateValueAndValidity();
    this.getFormData().reltshpCd.updateValueAndValidity();
    this.getFormData().cellPhNum.updateValueAndValidity();
  }

  saveContactInformation(showPopup?: boolean) {
    this.isSamePageNavigation =  true;
    this.submitted = true;
    console.log(this.myForm);
    const applicantAddress = new PaeContactInfoAddress(
      0,
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      ''
    );

    this.arrayForAddress.push(applicantAddress);

    const paeApplicantContactDetailsVOList1 = new PaeContactInformationDetails(
      this.arrayForAddress,
      this.getFormData().applicantCellPhNum.value,
      '',
      this.getFormData().appDsgnSw.value,
      this.getFormData().applicantEmailAddr.value,
      this.getFormData().firstName.value,
      this.getFormData().appDsgnSw.value,
      this.getFormData().hasLegalRightsSw.value,
      this.getFormData().applicantHomePhNum.value,
      '',
      this.paeCommonService.getPaeId(),
      this.getFormData().appInterSw.value,
      this.getFormData().interprtLang.value,
      this.getFormData().lastName.value,
      this.getFormData().emailAddress2.value,
      this.getFormData().cellPhNum.value,
      this.getFormData().homePhone2.value,
      this.getFormData().workPhone2.value,
      this.getFormData().mailSw.value,
      this.getFormData().midInitial.value,
      this.getFormData().prefLangLettersCd.value,
      this.getFormData().prefPhTypeCd.value,
      this.paeService.getPersonId(),
      this.getFormData().reltshpCd.value,
      null,
      'DSGN',
      this.getFormData().applicantWorkPhNum.value
    );

    // Applicable for HOH
    // const paeApplicantContactDetailsVOList2 = new PaeContactInformationDetails(
    //   applicantAddress,
    //   null,
    //   null,
    //   null,
    //   null,
    //   this.getFormData().firstName.value,
    //   this.getFormData().getLettersSw.value,
    //   this.getFormData().hasLegalRightsSw.value,
    //   null,
    //   '',
    //   this.paeService.getPaeId(),
    //   null,
    //   null,
    //   this.getFormData().lastName.value,
    //   this.getFormData().emailAddress3.value,
    //   this.getFormData().cellPhone3.value,
    //   this.getFormData().homePhone3.value,
    //   this.getFormData().workPhone3.value,
    //   this.getFormData().mailSwHoh.value,
    //   this.getFormData().midInitial.value,
    //   this.getFormData().preflangCd2.value,
    //   null,
    //   this.paeService.getPersonId(),
    //   null,
    //   this.getFormData().suffix.value,
    //   'HOH',
    //   null
    // );

    this.fillThisArray.push(paeApplicantContactDetailsVOList1);

    const finalPayload = new PaeContactInformation(
      'PPPCI',
      this.paeCommonService.getPaeId(),
      this.fillThisArray
    );

    if (this.myForm.valid) {
      this.enableNext = false;
      this.showSpinner = true;
      const response = this.paeService.saveContactInformation(finalPayload);
      let nextPage = '';
      const that = this;
      response.then(function(response: HttpResponse<any>) {
        that.enableNext = true;
        that.showSpinner = false;
        that.arrayForAddress = [];
        that.fillThisArray = [];
        nextPage = response.headers.get('next');
        console.log(nextPage);
        response = response.body;
        that.nextPath = PaeFlowSeq[nextPage];
        if (showPopup) {
          const dialogConfig = new MatDialogConfig();
          dialogConfig.data = { route: 'ltss/pae' };
          // dialogConfig.data = { route: 'ltss/pae' , nextRoute: '/ltss/pae/paeStart/' + this.nextPath };
          dialogConfig.panelClass = 'exp_popup';
          dialogConfig.width = '648px';
          dialogConfig.height = '360px';
          that.dialog.open(SavePopupComponent, dialogConfig);
        } else {
          that.router.navigate(['/ltss/pae/paeStart/' + that.nextPath]);
        }
      });
    }
  }


  onAddressFormat(event) {
    if (event.source.value === 'MLTY') {
      this.addrFormatSW = true;
      this.f.aaAeApCd.setValidators([Validators.required]);
      this.f.apoFpoCd.setValidators([Validators.required]);
    } else {
      this.addrFormatSW = false;
      this.f.aaAeApCd.clearValidators();
      this.f.apoFpoCd.setValidators([Validators.required]);
    }
    this.f.aaAeApCd.updateValueAndValidity();
    this.f.apoFpoCd.updateValueAndValidity();
  }

  onAddressFormat2(event) {
    if (event.source.value === 'MLTY') {
      this.addrFormatSW2 = true;
    } else {
      this.addrFormatSW2 = false;
    }
  }

  onMailAddrChange2(mrChange: MatRadioChange) {
    if (mrChange.value === 'N') {
      this.mailAddrSW = true;
    }
    else if (mrChange.value === 'Y') {
      this.mailAddrSW = false;
    }
  }

  onContactInfoChange(mrChange: MatRadioChange) {
    if (mrChange.value === 'N') {
      this.showHideContactDetails = false;
      this.f.emailAddress2.clearValidators();
    }
    else if (mrChange.value === 'Y') {
      this.showHideContactDetails = true;
      this.f.emailAddress2.setValidators([this.customValidator.emailValidator()]);
    }
    this.f.emailAddress2.updateValueAndValidity();
  }

  onMailAddrChange(mrChange: MatRadioChange) {
    if (mrChange.value === 'N') {
      this.showHideMailAddr = false;
      this.f.mailAddrLine1.clearValidators();
      this.f.mailAddrLine2.clearValidators();
      this.f.mailCity.clearValidators();
      this.f.mailState.clearValidators();
      this.f.mailZip.clearValidators();
      this.f.mailZipExtn.clearValidators();
      this.f.mailCounty.clearValidators();
      this.f.apoFpoCd2.clearValidators();
      this.f.aaAeApCd2.clearValidators();

    }
    else if (mrChange.value === 'Y') {
      this.showHideMailAddr = true;
      this.f.mailAddrLine1.setValidators([Validators.required, Validators.maxLength(100), Validators.pattern('^[A-Za-z0-9 ]+$')]);
      this.f.mailAddrLine2.setValidators([Validators.maxLength(50), Validators.pattern('^[A-Za-z0-9 ]+$')]);
      this.f.mailCity.setValidators([Validators.required, Validators.maxLength(25), this.customValidator.addressAndCityValidator()]);
      this.f.mailState.setValidators([Validators.required]);
      this.f.mailZip.setValidators([Validators.required, Validators.pattern('[0-9]{5}')]);
      this.f.mailZipExtn.setValidators([Validators.pattern('[0-9]')]);
      this.f.mailCounty.setValidators([Validators.required]);
      this.f.apoFpoCd2.setValidators([Validators.required]);
      this.f.aaAeApCd2.setValidators([Validators.required]);
    }
    this.f.mailAddrLine1.updateValueAndValidity();
    this.f.mailAddrLine2.updateValueAndValidity();
    this.f.mailCity.updateValueAndValidity();
    this.f.mailState.updateValueAndValidity();
    this.f.mailZip.updateValueAndValidity();
    this.f.mailZipExtn.updateValueAndValidity();
    this.f.mailCounty.updateValueAndValidity();
    this.f.apoFpoCd2.updateValueAndValidity();
    this.f.aaAeApCd2.updateValueAndValidity();
  }

  onMailAddressFormat(event) {
    if (event.source.value === 'MLTY') {
      this.mailAddrFormatSW = true;
    } else {
      this.mailAddrFormatSW = false;
    }
  }

  onMailAddressFormat2(event) {
    if (event.source.value === 'MLTY') {
      this.mailAddrFormatSW2 = true;
      this.f.aaAeApCd3.setValidators([Validators.required]);
      this.f.apoFpoCd3.setValidators([Validators.required]);
    } else {
      this.mailAddrFormatSW2 = false;
      this.f.aaAeApCd3.setValidators([Validators.required]);
      this.f.apoFpoCd3.setValidators([Validators.required]);
    }
    this.f.aaAeApCd3.updateValueAndValidity();
    this.f.apoFpoCd3.setValidators([Validators.required]);
  }

  trackState(msChange: MatSelectChange) {
    if (msChange.value === 'TN') {
      this.isTN = true;
      this.getFormData().countyCd.setValidators([Validators.required]);
    }
    else {
      this.isTN = false;
      this.getFormData().countyCd.clearValidators();
      this.getFormData().countyCd.patchValue('NA');
    }
    this.getFormData().countyCd.updateValueAndValidity();
  }

  trackStateAlt(msChange: MatSelectChange) {
    if (msChange.value === 'TN') {
      this.isTN2 = true;
      this.f.mailCounty.setValidators([Validators.required]);
    } else {
      this.isTN2 = false;
      this.f.mailCounty.clearValidators();
    }
    this.f.mailCounty.updateValueAndValidity();
  }

  trackStateAlt2(msChange: MatSelectChange) {
    if (msChange.value === 'TN') {
      this.isTN3 = true;
      this.f.mailCounty2.setValidators([Validators.required]);
    } else {
      this.isTN3 = false;
      this.f.mailCounty2.clearValidators();
    }
    this.f.mailCounty2.updateValueAndValidity();
  }

  next() {
    this.event = 'Next';
    this.submitted = true;
    if (this.myForm.valid) {
      this.saveContactInformation();
      alert('submitted paecontact form');
    }
  }

  back() {
    this.isSamePageNavigation =  true;
    this.router.navigate(['/ltss/pae/paeStart/applicantInformation']);
  }

  saveAndExit() {
    this.saveContactInformation(true);
  }

  onNeedInterpreterChange(mrChange: MatRadioChange) {
    if (mrChange.value === 'N') {
      this.showHideLang = false;
      this.f.interprtLang.clearValidators();
    } else if (mrChange.value === 'Y') {
      this.showHideLang = true;
      this.f.interprtLang.setValidators([Validators.required]);
    }
    console.log(this.showHideLang);
    this.f.interprtLang.updateValueAndValidity();
  }

  
 onPhoneTypeChange(msChange: MatSelectChange) {
  const applicantCellPhNum = this.myForm.get('applicantCellPhNum');
  const applicantWorkPhNum = this.myForm.get('applicantWorkPhNum');
  const applicantHomePhNum = this.myForm.get('applicantHomePhNum');
  if (msChange.value === 'CL') {
   applicantCellPhNum.setValidators([
       Validators.required,
       Validators.maxLength(10),
       this.customValidator.phonenumberValidator(),
     ]);
   applicantHomePhNum.clearValidators();
   applicantWorkPhNum.clearValidators();
   } else if (msChange.value === 'HM') {
     applicantCellPhNum.clearValidators();
     applicantWorkPhNum.clearValidators();
     applicantHomePhNum.setValidators([
       Validators.required,
       Validators.maxLength(10),
       this.customValidator.phonenumberValidator(),
     ]);
   } else if (msChange.value === 'WK') {
     applicantCellPhNum.clearValidators();
     applicantHomePhNum.clearValidators();
     applicantWorkPhNum.setValidators([
       Validators.required,
       Validators.maxLength(10),
       this.customValidator.phonenumberValidator(),
     ]);
   }
  applicantCellPhNum.updateValueAndValidity();
  applicantWorkPhNum.updateValueAndValidity();
  applicantHomePhNum.updateValueAndValidity();
 }

 onChange(mrChange: MatRadioChange) {
   if (mrChange.value === 'N') {
      this.isDesignee = false;
      this.getFormData().firstName.clearValidators();
      this.getFormData().midInitial.clearValidators();
      this.getFormData().lastName.clearValidators();
      this.getFormData().reltshpCd.clearValidators();
      this.getFormData().cellPhNum.clearValidators();
   }
   else if (mrChange.value === 'Y') {
     this.isDesignee = true;
     this.getFormData().firstName.setValidators([Validators.required, Validators.maxLength(45), this.customValidator.nameValidator()]);
     this.getFormData().midInitial.setValidators([Validators.maxLength(1), Validators.pattern('^[a-zA-Z]*$')]);
     this.getFormData().lastName.setValidators([Validators.required, Validators.maxLength(45), this.customValidator.nameValidator()]);
     this.getFormData().reltshpCd.setValidators([Validators.required]);
     this.getFormData().cellPhNum.setValidators([Validators.required, Validators.maxLength(10), this.customValidator.phonenumberValidator()]);
   }
      this.getFormData().firstName.updateValueAndValidity();
      this.getFormData().midInitial.updateValueAndValidity();
      this.getFormData().lastName.updateValueAndValidity();
      this.getFormData().reltshpCd.updateValueAndValidity();
      this.getFormData().cellPhNum.updateValueAndValidity();
 }  
 validateAddress(){
  if (this.getFormData().mailAddrLine1.status !== 'INVALID' &&
      this.getFormData().mailAddrLine2.status !== 'INVALID' &&
      this.getFormData().mailCity.status !== 'INVALID' &&
      this.getFormData().mailState.status !== 'INVALID' &&
      this.getFormData().mailZip.status !== 'INVALID' &&
      this.getFormData().mailZipExtn.status !== 'INVALID' &&
      this.getFormData().mailCounty.status !== 'INVALID'
      ){
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.width = '720px';
        dialogConfig.height = '522px';
        dialogConfig.data = {
            addressLine1: this.getFormData().mailAddrLine1.value,
            addressLine2: this.getFormData().mailAddrLine2.value,
            city: this.getFormData().mailCity.value,
            state: this.getFormData().mailState.value,
            zipCode: this.getFormData().mailZip.value,
            ext: this.getFormData().mailZipExtn.value,
            county: this.getFormData().mailCounty.value
        };
        const dialogRef = this.dialog.open(AddressValidationComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(address => {
          if (address) {
            this.getFormData().mailAddrLine1.setValue(address.addressLine1);
            this.getFormData().mailAddrLine2.setValue(address.addressLine2);
            this.getFormData().mailCity.setValue(address.city);
            this.getFormData().mailState.setValue(address.state);
            this.getFormData().mailZip.setValue(address.zipCode);
            this.getFormData().mailZipExtn.setValue(address.ext);
            console.log(address);
          }
        });
  }
}
 setPrefferedPhoneType(value) {
   this.prefferedPhoneArray.push(value);
   if (this.prefferedPhoneArray.length > 1) {
     console.log('inside inner if', value);
     this.showPreferredPhoneType = true;
   }
   if (this.showPreferredPhoneType === true) {
       this.myForm.get('prefPhTypeCd').setValidators(Validators.required);
     }
     else if (this.showPreferredPhoneType === false) {
       this.myForm.get('prefPhTypeCd').clearValidators();
     }
   }
   @HostListener('window:beforeunload')
   canDeactivate(): Observable<boolean> | boolean {
     console.log(this.myForm) 
    return this.isSamePageNavigation ? true : !this.myForm.dirty;
   }

   resetForm(){
     this.myForm.reset();
   }
  //  showWarning(){
  //   const dialogConfig = new MatDialogConfig();
  //   dialogConfig.data = { route: 'ltss/pae' };
  //   // dialogConfig.data = { route: 'ltss/pae' , nextRoute: '/ltss/pae/paeStart/' + this.nextPath };
  //   dialogConfig.panelClass = 'exp_popup';
  //   dialogConfig.width = '535px';
  //   dialogConfig.height = '360px';
  //   dialogConfig.autoFocus = false;
  //   this.dialog.open(SaveWarningPopupComponent, dialogConfig);
  //  }
}
