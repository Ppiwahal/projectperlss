import { PaeCommonService } from './../../core/services/pae/pae-common/pae-common.service';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CustomvalidationService } from '../../_shared/utility/customvalidation.service';
import { SavePopupComponent } from '../../savePopup/savePopup.component';
import * as customValidation from '../../_shared/constants/validation.constants';
import { MatSelectChange } from '@angular/material/select';
import { MatRadioChange } from '@angular/material/radio';
import { PaeLivingArrangement } from '../../_shared/model/PaeLivingArrangement';
import { PaeService } from '../../core/services/pae/pae.service';
import { PaeFlowSeq } from '../../_shared/utility/PaeFlowSeq';
import { HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ReferralService } from '../../core/services/referral/referral.service';
import { Observable } from 'rxjs';
import { ComponentCanDeactivate } from 'src/app/core/helpers/pending-change.guard';
import * as Constants from '../../_shared/constants/application.constants';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-pae-living-arrangement',
  templateUrl: './pae-living-arrangement.component.html',
  styleUrls: ['./pae-living-arrangement.component.scss']
})
export class PaeLivingArrangementComponent implements OnInit, ComponentCanDeactivate {
  pageId: string = 'PPPLA';
  livingArrangementForm: FormGroup;
  livingArrangementList = [
    {
      code: 'LTC',
      value: 'Long-term care facility — e.g., nursing home, ICF',
      activateSW: 'Y'
    },
    {
      code: 'HJC',
      value: 'Harold Jordan Center',
      activateSW: 'Y'
    },
    {
      code: 'MEN',
      value: 'Mental health residence---behavioral health group home',
      activateSW: 'Y'
    },
    {
      code: 'HOM',
      value: 'Family member’s home/own home',
      activateSW: 'Y'
    },
    {
      code: 'NON',
      value: 'Living with non-relative e.g. apartment or house with friend or roommate(s)',
      activateSW: 'Y'
    },
    {
      code: 'JAL',
      value: 'Jail',
      activateSW: 'Y'
    },
    {
      code: 'FOS',
      value: 'Foster Home',
      activateSW: 'Y'
    },
    {
      code: 'MED',
      value: 'Medical Hospital',
      activateSW: 'Y'
    },
    {
      code: 'SHL',
      value: 'Homeless/Shelter ',
      activateSW: 'Y'
    },
    {
      code: 'HLS',
      value: 'Psychiatric hospital or unit',
      activateSW: 'Y'
    },
    {
      code: 'RMH',
      value: 'Regional Mental Health Institute',
      activateSW: 'Y'
    },
    {
      code: 'RTC',
      value: 'Residential Treatment Center for youth',
      activateSW: 'Y'
    },
    {
      code: 'SCH',
      value: 'Specialized school — e.g., school for deaf, blind',
      activateSW: 'Y'
    },
    {
      code: 'OTH',
      value: 'Other',
      activateSW: 'Y'
    }
  ];

  kblivingArrangementList = [
    {
      code: 'LT',
      value: 'Long-term care facility — e.g., nursing home ',
      activateSW: 'Y'
    },
    {
      code: 'ME',
      value: 'Mental health residence — e.g., psychiatric group home',
      activateSW: 'Y'
    },
    {
      code: 'PS',
      value: 'Psychiatric hospital or unit',
      activateSW: 'Y'
    },
    {
      code: 'IN',
      value: 'Group home for children / youths with intellectual disability',
      activateSW: 'Y'
    },
    {
      code: 'PH',
      value: 'Group home for children / youth with physical disability',
      activateSW: 'Y'
    },
    {
      code: 'SC',
      value: 'Specialized school — e.g., school for deaf, blind',
      activateSW: 'Y'
    },
    {
      code: 'HO',
      value: 'Home',
      activateSW: 'Y'
    },
    {
      code: 'OT',
      value: 'Other',
      activateSW: 'Y'
    }
  ];
  facilityNameList = [
    {
      code: 'MUR',
      value: 'Mur-Ci Homes, Inc.',
      activateSW: 'Y'
    },
    {
      code: 'OGA',
      value: 'Orange Grove Center 3400 Chandler Avenue',
      activateSW: 'Y'
    },
    {
      code: 'OGB',
      value: 'Orange Grove Center 3406 Chandler Avenue',
      activateSW: 'Y'
    },
    {
      code: 'BRA',
      value: 'Bradley/Cleveland Services, Inc., Site A between 183 and 217,  Kile Lake Road, SE',
      activateSW: 'Y'
    },
    {
      code: 'BRB',
      value: 'Bradley/Cleveland Services, Inc., Site B between 183 and 217,  Kile Lake Road, SE',
      activateSW: 'Y'
    },
    {
      code: 'TFA',
      value: 'Tennessee Family Solutions, Inc. 722-724 Stone Trace Drive',
      activateSW: 'Y'
    },
    {
      code: 'TFB',
      value: 'Tennessee Family Solutions, Inc. 1502-1504 Rochester Drive',
      activateSW: 'Y'
    },
    {
      code: 'TFC',
      value: 'Tennessee Family Solutions, Inc. 1727-1729 Thomas Court',
      activateSW: 'Y'
    },
    {
      code: 'TFD',
      value: 'Tennessee Family Solutions, Inc. 1432-1434 Rochester Drive',
      activateSW: 'Y'
    },
    {
      code: 'COA',
      value: 'Comcare, Inc.',
      activateSW: 'Y'
    },
    {
      code: 'COB',
      value: 'Comcare, Inc. ',
      activateSW: 'Y'
    },
    {
      code: 'COC',
      value: 'Comcare, Inc. ',
      activateSW: 'Y'
    },
    {
      code: 'MDC',
      value: 'Michael Dunn Center ',
      activateSW: 'Y'
    },
    {
      code: 'SCT',
      value: 'Sunrise Community of Tennessee ',
      activateSW: 'Y'
    },
    {
      code: 'OAG',
      value: 'Open Arms Care Corporation dba Greeneville #1 Chuckey Pike ',
      activateSW: 'Y'
    },
    {
      code: 'OAH',
      value: 'Open Arms Care Corporation dba Hamilton County #2 Gamble Road - Southwest',
      activateSW: 'Y'
    },
    {
      code: 'OAC',
      value: 'Open Arms Care Corporation dba Greeneville #3 East Church Street - East ',
      activateSW: 'Y'
    },
    {
      code: 'OAS',
      value: 'Open Arms Care Corporation dba Hamilton County #1 Gamble Road - Southeast',
      activateSW: 'Y'
    },
    {
      code: 'OAW',
      value: 'Open Arms Care Corporation dba Greeneville #2 East Church Street - West ',
      activateSW: 'Y'
    },
    {
      code: 'SCO',
      value: 'Sunrise Community of Tennessee',
      activateSW: 'Y'
    },
    {
      code: 'DSA',
      value: 'D & S Residential Services, LP ',
      activateSW: 'Y'
    },
    {
      code: 'DSB',
      value: 'D & S Residential Services, LP ',
      activateSW: 'Y'
    },
    {
      code: 'DSC',
      value: 'D & S Residential Services, LP ',
      activateSW: 'Y'
    },
    {
      code: 'OAK',
      value: 'Open Arms Care Corporation dba Knox County #1 Bishops Bridge Northeast',
      activateSW: 'Y'
    },
    {
      code: 'OAB',
      value: 'Open Arms Care Corporation dba Knox County #2 Bishops Bridge Northwest ',
      activateSW: 'Y'
    },
    {
      code: 'OAX',
      value: 'Open Arms Care Corporation dba Knox County #4 South Northshore Drive Northwest ',
      activateSW: 'Y'
    },
    {
      code: 'OAY',
      value: 'Open Arms Care Corporation dba Knox County #3 South Northshore Drive Southeast ',
      activateSW: 'Y'
    },
    {
      code: 'MDU',
      value: 'Michael Dunn Center ',
      activateSW: 'Y'
    },
    {
      code: 'OTH',
      value: 'Other',
      activateSW: 'Y'
    }
  ];
  kbPastLivingList = [{ code: 'LT', value: 'Long-term Care Facility', activateSW: 'Y' },
  { code: 'PH', value: 'Psychiatric Hospital or Unit', activateSW: 'Y' },
  { code: 'MH', value: 'Mental Health Residence', activateSW: 'Y' },
  { code: 'SS', value: 'Specialized School', activateSW: 'Y' },
  { code: 'GID', value: 'Group Home for Children/Youths with Intellectual Disability', activateSW: 'Y' },
  { code: 'GPD', value: 'Group Home for Children/Youths with Physical Disability', activateSW: 'Y' },
  { code: 'NO', value: 'None of the Above', activateSW: 'Y' }];

  kbPastLivingCheckboxFormMap =
    [{ code: 'LT', formControlName: 'longTermCareSw' },
    { code: 'PH', formControlName: 'phychiatricHospitalSw' },
    { code: 'MH', formControlName: 'mentalHlthSw' },
    { code: 'SS', formControlName: 'specialSchoolSw' },
    { code: 'GID', formControlName: 'intlctulDisableSw' },
    { code: 'GPD', formControlName: 'phyclDisableSw' },
    { code: 'NO', formControlName: 'noneSw' }];

  stateList = [
    { code: 'TN ', value: 'Tennessee', activateSW: 'Y' },
    { code: 'AL ', value: 'Alabama', activateSW: 'Y' },
    { code: 'AK ', value: 'Alaska', activateSW: 'Y' },
    { code: 'AZ ', value: 'Arizona', activateSW: 'Y' },
    { code: 'AR ', value: 'Arkansas', activateSW: 'Y' },
    { code: 'CA ', value: 'California', activateSW: 'Y' },
    { code: 'CO ', value: 'Colorado', activateSW: 'Y' },
    { code: 'CT ', value: 'Connecticut', activateSW: 'Y' },
    { code: 'DE ', value: 'Delaware', activateSW: 'Y' },
    { code: 'DC', value: 'District of Columbia', activateSW: 'Y' },
    { code: 'FL ', value: 'Florida', activateSW: 'Y' },
    { code: 'GA', value: 'Georgia', activateSW: 'Y' },
    { code: 'HI ', value: 'Hawaii', activateSW: 'Y' },
    { code: 'ID ', value: 'Idaho', activateSW: 'Y' },
    { code: 'IL ', value: 'Illinois', activateSW: 'Y' },
    { code: 'IN ', value: 'Indiana', activateSW: 'Y' },
    { code: 'IA ', value: 'Iowa', activateSW: 'Y' },
    { code: 'KS ', value: 'Kansas', activateSW: 'Y' },
    { code: 'KY ', value: 'Kentucky', activateSW: 'Y' },
    { code: 'LA ', value: 'Louisiana', activateSW: 'Y' },
    { code: 'ME ', value: 'Maine', activateSW: 'Y' },
    { code: 'MD ', value: 'Maryland', activateSW: 'Y' },
    { code: 'MA ', value: 'Massachusetts', activateSW: 'Y' },
    { code: 'MI ', value: 'Michigan', activateSW: 'Y' },
    { code: 'MN ', value: 'Minnesota', activateSW: 'Y' },
    { code: 'MS ', value: 'Mississippi', activateSW: 'Y' },
    { code: 'MO ', value: 'Missouri', activateSW: 'Y' },
    { code: 'MT ', value: 'Montana', activateSW: 'Y' },
    { code: 'NE ', value: 'Nebraska', activateSW: 'Y' },
    { code: 'NV ', value: 'Nevada', activateSW: 'Y' },
    { code: 'NH ', value: 'New Hampshire', activateSW: 'Y' },
    { code: 'NJ ', value: 'New Jersey', activateSW: 'Y' },
    { code: 'NM ', value: 'New Mexico', activateSW: 'Y' },
    { code: 'NY ', value: 'New York', activateSW: 'Y' },
    { code: 'NC ', value: 'North Carolina', activateSW: 'Y' },
    { code: 'ND ', value: 'North Dakota', activateSW: 'Y' },
    { code: 'OH ', value: 'Ohio', activateSW: 'Y' },
    { code: 'OK ', value: 'Oklahoma', activateSW: 'Y' },
    { code: 'OR ', value: 'Oregon', activateSW: 'Y' },
    { code: 'PA ', value: 'Pennsylvania', activateSW: 'Y' },
    { code: 'RI ', value: 'Rhode Island', activateSW: 'Y' },
    { code: 'SC ', value: 'South Carolina', activateSW: 'Y' },
    { code: 'SD ', value: 'South Dakota', activateSW: 'Y' },
    { code: 'TX ', value: 'Texas', activateSW: 'Y' },
    { code: 'UT ', value: 'Utah', activateSW: 'Y' },
    { code: 'VT ', value: 'Vermont', activateSW: 'Y' },
    { code: 'VA ', value: 'Virginia', activateSW: 'Y' },
    { code: 'WA ', value: 'Washington', activateSW: 'Y' },
    { code: 'WV ', value: 'West Virginia', activateSW: 'Y' },
    { code: 'WI ', value: 'Wisconsin', activateSW: 'Y' },
    { code: 'WY ', value: 'Wyoming', activateSW: 'Y' },
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

livingArrangementMap = new Map();
kblivingArrangementMap = new Map();
facilityNameMap = new Map();
kbPastLivingMap1 = new Map();
kbPastLivingMap2 = new Map();
isLongTermFacility = false;
programName: any;
paeId: any;
isKbProgram = false;
otherCheckboxCounter = 0;
noneCheckBoxSelected = false;
otherCheckboxSelected = false;
minDate: Date;
nextPath: string;
maxDate: Date;
customValidation = customValidation;
isJail = false;
submitted = false;
showLvngArngDesc = false;
isTN = true;
expectDischarge = false;
showSpinner = false;
enableNext = true;
applicantName: any;
isSamePageNavigation: boolean;
startDate = new Date();
isOthFacility: boolean = false;

constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private customValidator: CustomvalidationService,
    private paeCommonService: PaeCommonService,
    private paeService: PaeService,
    private refService: ReferralService,
    private router: Router
  ) { }

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
    this.paeId = this.paeCommonService.getPaeId();
    console.log(this.paeId);
    this.programName = this.paeCommonService.getProgramName();
    if (this.programName === 'KB') {
      this.isKbProgram = true;
    }
    this.initializeMapLists();
    this.livingArrangementForm = this.fb.group({
      currLvngArrngCd: [''],
      lvngArngDesc: new FormControl({ value: '', disabled: true }),
      facilityName: [''],
      othFacilityName: [''],
      addrLine1: new FormControl({ value: '', disabled: true }),
      addrLine2: new FormControl({ value: '', disabled: true }),
      city: new FormControl({ value: '', disabled: true }),
      stateCd: ['TN', [Validators.required]],
      zip: new FormControl({ value: '', disabled: true }),
      ext: new FormControl({ value: '', disabled: true }),
      cntyCd: new FormControl({ value: '', disabled: true }),
      phNumber: new FormControl({ value: '', disabled: true }),
      longTermCareSw: [null],
      phychiatricHospitalSw: [null],
      mentalHlthSw: [null],
      specialSchoolSw: [null],
      intlctulDisableSw: [null],
      phyclDisableSw: [null],
      noneSw: [null],
      admissionDt: [''],
      expctdDischargeCd: [''],
      anticipatedDischargeDt: [''],
      anticipatedReleaseDt: [''],
      incarcerationDt: ['']
    });
    if (this.paeCommonService.getApplicantName() === null || this.paeCommonService.getApplicantName() === '' || this.paeCommonService.getApplicantName() === undefined){
		this.getApplicantName();
	} else {
		this.applicantName =  this.paeCommonService.getApplicantName();
	}
	if ((this.paeCommonService.getRowElement()).refId !== null && (this.paeCommonService.getRowElement()).refId !== undefined){
	   this.getRefLivingArrangement();
   } else if (this.paeCommonService.getPaeId() !== null && this.paeCommonService.getPaeId() !== undefined){
	   this.getPaeLivingArrangement();
   }
  }

  getApplicantName(){
    this.paeService.getPaeApplicantInformation(this.paeCommonService.getPaeId(),this.pageId).then((response)=> {
      console.log("reponseforName"+JSON.stringify(response.body.firstName));
      this.applicantName =  response.body.firstName+" "+response.body.lastName;
	  this.paeCommonService.setApplicantName(this.applicantName);
    });
  }

  getPaeLivingArrangement() {
    this.paeService.getPaeLivArrngmnt(this.paeCommonService.getPaeId()).then((response) => {
      console.log("response===>" + JSON.stringify(response));
      this.livingArrangementForm.patchValue(response.body);
      this.paeCommonService.setLivingArrangement(response.body.currLvngArrngCd);
    });
  }

  getRefLivingArrangement(){
    const loadData = this.refService.getRefContactDetails(this.paeCommonService.getRowElement().refId, this.pageId)
    .then(response => {
      let receivedData = response;
      console.log("receivedData" + JSON.stringify(receivedData));
      this.livingArrangementForm.patchValue(receivedData.body.refLivingArrangementVO);
      this.paeCommonService.setLivingArrangement(response.body.refLivingArrangementVO.currLvngArrngCd);
    });
  }



  trackState(msChange: MatSelectChange) {
    if (msChange.value === 'TN ') {
      this.isTN = true;
      this.getFormData().cntyCd.setValidators([Validators.required]);
    }
    else {
      this.isTN = false;
      this.getFormData().cntyCd.clearValidators();
      this.getFormData().cntyCd.patchValue('NA');
    }
    this.getFormData().cntyCd.updateValueAndValidity();
  }

  onExpctDischrgChange(mrChange: MatRadioChange) {
    if (mrChange.value === 'Y') {
      this.expectDischarge = true;
      this.getFormData().anticipatedDischargeDt.setValidators([Validators.required]);
    }
    else if (mrChange.value === 'N') {
      this.expectDischarge = false;
      this.getFormData().anticipatedDischargeDt.clearValidators();
      this.getFormData().anticipatedDischargeDt.patchValue(null);
    }
    this.getFormData().anticipatedDischargeDt.updateValueAndValidity();
  }

  initializeMapLists() {
    for (const livingArrangement of this.livingArrangementList) {
      this.livingArrangementMap.set(livingArrangement.code, livingArrangement.value);
    }
    for (const kblivingArrangement of this.kblivingArrangementList) {
      this.kblivingArrangementMap.set(kblivingArrangement.code, kblivingArrangement.value);
    }
    for (const facilityName of this.facilityNameList) {
      this.facilityNameMap.set(facilityName.code, facilityName.value);
    }
    for (const kbPastLiving of this.kbPastLivingList) {
      this.kbPastLivingMap1.set(kbPastLiving.code, kbPastLiving.value);
    }
    for (const kbPastLivingCheckbox of this.kbPastLivingCheckboxFormMap) {
      this.kbPastLivingMap2.set(kbPastLivingCheckbox.code, kbPastLivingCheckbox.formControlName);
    }
  }

  onfacilityNameSelect(value) {
    if (value === 'OTH') {
      this.addressSetValidations();
      this.isOthFacility = true;
      this.getFormData().othFacilityName.setValidators([Validators.required, Validators.maxLength(100), this.customValidator.addressAndCityValidator()]);
    }
    else {
      this.addressClearValidations();
      this.isOthFacility = false;
      this.getFormData().othFacilityName.clearValidators();
    }
    this.getFormData().othFacilityName.updateValueAndValidity();
  }

  oncurrLvngArrngCdSelect(value) {
    if (value === 'OT' || value === 'OTH' || value === '') {
      this.showLvngArngDesc = true;
      this.getFormData().lvngArngDesc.enable();
      this.getFormData().lvngArngDesc
        .setValidators([Validators.required, Validators.maxLength(50), this.customValidator.addressAndCityValidator()]);
    }
    else if (value === 'LT' || value === 'LTC' || value === 'JAL') {
      this.showLvngArngDesc = false;
      this.isLongTermFacility = true;
      this.getFormData().facilityName.patchValue(null);
      if (value === 'JAL') {
        this.isJail = true;
        this.isLongTermFacility = false;
      }
      else {
        this.isJail = false;
        this.getFormData().incarcerationDt.patchValue(null);
        this.getFormData().anticipatedReleaseDt.patchValue(null);
      }
    }
    else {
      this.isJail = false;
      this.getFormData().incarcerationDt.patchValue(null);
      this.getFormData().anticipatedReleaseDt.patchValue(null);
      this.showLvngArngDesc = false;
      this.isLongTermFacility = false;
      this.getFormData().lvngArngDesc.disable();
      this.getFormData().lvngArngDesc.clearValidators();
      this.getFormData().lvngArngDesc.updateValueAndValidity();
    }
  }

  addressSetValidations() {

    this.getFormData().addrLine1.enable();
    this.getFormData().addrLine2.enable();
    this.getFormData().city.enable();
    this.getFormData().stateCd.enable();
    this.getFormData().zip.enable();
    this.getFormData().ext.enable();
    this.getFormData().cntyCd.enable();
    this.getFormData().phNumber.enable();
    this.getFormData().addrLine1
      .setValidators([Validators.required, Validators.maxLength(100), this.customValidator.addressAndCityValidator()]);
    this.getFormData().addrLine2
      .setValidators([Validators.maxLength(50), this.customValidator.addressAndCityValidator()]);
    this.getFormData().city
      .setValidators([Validators.required, Validators.maxLength(25), this.customValidator.addressAndCityValidator()]);
    this.getFormData().stateCd
      .setValidators([Validators.required]);
    this.getFormData().zip
      .setValidators([Validators.required, Validators.pattern('[0-9]{5}')]);
    this.getFormData().ext
      .setValidators(Validators.pattern('[0-9]'));
    this.getFormData().cntyCd
      .setValidators([Validators.required]);
    this.getFormData().phNumber
      .setValidators([Validators.maxLength(10), this.customValidator.phonenumberValidator()]);
    this.getFormData().addrLine1.updateValueAndValidity();
    this.getFormData().addrLine2.updateValueAndValidity();
    this.getFormData().city.updateValueAndValidity();
    this.getFormData().stateCd.updateValueAndValidity();
    this.getFormData().zip.updateValueAndValidity();
    this.getFormData().ext.updateValueAndValidity();
    this.getFormData().cntyCd.updateValueAndValidity();
    this.getFormData().phNumber.updateValueAndValidity();
  }
  addressClearValidations() {
    this.getFormData().addrLine1.clearValidators();
    this.getFormData().addrLine2.clearValidators();
    this.getFormData().city.clearValidators();
    this.getFormData().stateCd.clearValidators();
    this.getFormData().zip.clearValidators();
    this.getFormData().ext.clearValidators();
    this.getFormData().cntyCd.clearValidators();
    this.getFormData().phNumber.clearValidators();
    this.getFormData().addrLine1.disable();
    this.getFormData().addrLine2.disable();
    this.getFormData().city.disable();
    this.getFormData().stateCd.disable();
    this.getFormData().zip.disable();
    this.getFormData().ext.disable();
    this.getFormData().cntyCd.disable();
    this.getFormData().phNumber.disable();
    this.getFormData().addrLine1.updateValueAndValidity();
    this.getFormData().addrLine2.updateValueAndValidity();
    this.getFormData().city.updateValueAndValidity();
    this.getFormData().stateCd.updateValueAndValidity();
    this.getFormData().zip.updateValueAndValidity();
    this.getFormData().ext.updateValueAndValidity();
    this.getFormData().cntyCd.updateValueAndValidity();
    this.getFormData().phNumber.updateValueAndValidity();
  }
  getFormData() {
    return this.livingArrangementForm.controls;
  }

  checkboxSelected(event) {
    if (event.checked === true && event.source.value !== 'NO') {
      const formControlNameForCheckBox = this.kbPastLivingMap2.get(event.source.value);
      this.getFormData()[formControlNameForCheckBox].patchValue('Y');
      this.otherCheckboxCounter = this.otherCheckboxCounter + 1;
    }
    else if (event.checked === false && event.source.value !== 'NO') {
      const formControlNameForCheckBox = this.kbPastLivingMap2.get(event.source.value);
      this.getFormData()[formControlNameForCheckBox].patchValue('N');
      this.otherCheckboxCounter = this.otherCheckboxCounter - 1;
    }
    else if (event.checked === true && event.source.value === 'NO') {
      this.getFormData().noneSw.patchValue('Y');
      this.noneCheckBoxSelected = true;
    }
    else if (event.checked === false && event.source.value === 'NO') {
      this.getFormData().noneSw.patchValue('N');
      this.noneCheckBoxSelected = false;
    }

    if (this.otherCheckboxCounter > 0) {
      this.otherCheckboxSelected = true;
    }
    else if (this.otherCheckboxCounter === 0) {
      this.otherCheckboxSelected = false;
    }
  }

  saveLivingArrangement(showPopup?: boolean) {
    this.isSamePageNavigation =  true;
    this.submitted = true;
    console.log(this.livingArrangementForm);
    if (this.livingArrangementForm.valid) {
      this.enableNext = false;
      this.showSpinner = true;
      const paeLivingArrangementVO = new PaeLivingArrangement(
        this.getFormData().addrLine1.value,
        this.getFormData().addrLine2.value,
        this.getFormData().admissionDt.value,
        this.getFormData().anticipatedDischargeDt.value,
        this.getFormData().anticipatedReleaseDt.value,
        this.getFormData().city.value,
        this.getFormData().cntyCd.value,
        this.getFormData().currLvngArrngCd.value,
        this.getFormData().expctdDischargeCd.value,
        this.getFormData().ext.value,
        this.getFormData().incarcerationDt.value,
        this.getFormData().intlctulDisableSw.value,
        this.getFormData().longTermCareSw.value,
        this.getFormData().lvngArngDesc.value,
        this.getFormData().mentalHlthSw.value,
        this.getFormData().noneSw.value,
        this.getFormData().facilityName.value,
        this.paeId,
        this.getFormData().phNumber.value,
        this.getFormData().phychiatricHospitalSw.value,
        this.getFormData().phyclDisableSw.value,
        'PPPLA',
        null,
        this.getFormData().specialSchoolSw.value,
        this.getFormData().stateCd.value,
        this.getFormData().zip.value
      );
      this.paeCommonService.setLivingArrangement(this.getFormData().currLvngArrngCd.value);
      const response = this.paeService.saveLivingArrangement(paeLivingArrangementVO);
      let nextPage = '';
      const that = this;
      response.then(function (response: HttpResponse<any>) {
        that.enableNext = true;
        that.showSpinner = false;
        nextPage = response.headers.get('next');
        console.log(nextPage);
        response = response.body;
        that.nextPath = PaeFlowSeq[nextPage];
        console.log(that.nextPath);
        if (showPopup) {
          const dialogConfig = new MatDialogConfig();
          dialogConfig.data = { route: 'ltss/pae' };
          // dialogConfig.data = { route: 'ltss/pae' , nextRoute: '/ltss/pae/paeStart/' + this.nextPath };
          dialogConfig.panelClass = 'exp_popup';
          dialogConfig.width = '648px';
          dialogConfig.height = '360px';
          that.dialog.open(SavePopupComponent, dialogConfig);
        } else {
          that.paeCommonService.setProgramSelectChild([nextPage]);
          that.router.navigate(['/ltss/pae/paeStart/' + that.nextPath]);
        }
      });
    }
  }

  saveAndExit() {
    this.saveLivingArrangement(true);
  }
  back() {
    this.isSamePageNavigation =  true;
    this.router.navigate(['/ltss/pae/paeStart/contactInformation']);
  }
  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
   return this.isSamePageNavigation ? true : !this.livingArrangementForm.dirty;
  }

  resetForm(){
   this.livingArrangementForm.reset();
 }
}
