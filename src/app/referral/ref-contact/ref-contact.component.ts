import { RefLivingArrangement } from '../../_shared/model/RefLivingArrangement';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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
import { RefContactAddress } from 'src/app/_shared/model/RefContactAddress';
import { ToastrService } from 'ngx-toastr';
import { MatSelectChange } from '@angular/material/select';
import { AddressValidationComponent } from 'src/app/_shared/components/address-validation/address-validation.component';

@Component({
  selector: 'app-ref-contact',
  templateUrl: './ref-contact.component.html',
  styleUrls: ['./ref-contact.component.scss'],
})
export class RefContactComponent implements OnInit {
  @Output() completedContact: EventEmitter<any> = new EventEmitter<any>();
  pageId: string = 'PERCI';
  lvngSelfSw = false;
  lvngFamilySw = false;
  lvngElseSw = false;
  customValidation = customValidation;
  showPreferredPhoneType: boolean;
  refContactForm: FormGroup;
  isDesignee = false;
  personId: string;
  interpreterSW = false;
  designeeMailSW = false;
  ageSW = false;
  showNote = false;
  addrFormatSW = false;
  othLivingArrange = false;
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
  longTermFacility = false;
  isOwnHome = false;
  toastrBack = false;
  isTN = false;
  toastRef: any;
  enableNext = true;
  showSpinner = false;
  isSamePageNavigation: boolean;
  prefferedPhoneArray = [];
  currentLiving = [
    {code: 'LTC', value:'Long-term care facility — e.g., nursing home, ICF', activateSW:'Y'},
    {code: 'HJC', value:'Harold Jordan Center', activateSW:'Y'},
    {code: 'MEN', value:'Mental health residence---behavioral health group home', activateSW:'Y'},
    {code: 'HOM', value:'Family member’s home/own home', activateSW:'Y'},
    {code: 'NON', value:'Living with non-relative e.g. apartment or house with friend or roommate(s)', activateSW:'Y'},
    {code: 'JAL', value:'Jail', activateSW:'Y'},
    {code: 'FOS', value:'Foster Home', activateSW:'Y'},
    {code: 'MED', value:'Medical Hospital', activateSW:'Y'},
    {code: 'SHL', value:'Homeless/Shelter ', activateSW:'Y'},
    {code: 'HLS', value:'Psychiatric hospital or unit', activateSW:'Y'},
    {code: 'RMH', value:'Regional Mental Health Institute', activateSW:'Y'},
    {code: 'RTC', value:'Residential Treatment Center for youth', activateSW:'Y'},
    {code: 'SCH', value:'Specialized school — e.g., school for deaf, blind', activateSW:'Y'},
    {code: 'OTH', value:'Other', activateSW:'Y'}
  ];

  facilityOptions = [
    {code: 'MUR', value:'Mur-Ci Homes, Inc.',activateSW:'Y'},
    {code: 'OGA', value:'Orange Grove Center 3400 Chandler Avenue',activateSW:'Y'},
    {code: 'OGB', value:'Orange Grove Center 3406 Chandler Avenue',activateSW:'Y'},
    {code: 'BRA', value:'Bradley/Cleveland Services, Inc., Site A between 183 and 217,  Kile Lake Road, SE',activateSW:'Y'},
    {code: 'BRB', value:'Bradley/Cleveland Services, Inc., Site B between 183 and 217,  Kile Lake Road, SE',activateSW:'Y'},
    {code: 'TFA', value:'Tennessee Family Solutions, Inc. 722-724 Stone Trace Drive',activateSW:'Y'},
    {code: 'TFB', value:'Tennessee Family Solutions, Inc. 1502-1504 Rochester Drive',activateSW:'Y'},
    {code: 'TFC', value:'Tennessee Family Solutions, Inc. 1727-1729 Thomas Court',activateSW:'Y'},
    {code: 'TFD', value:'Tennessee Family Solutions, Inc. 1432-1434 Rochester Drive',activateSW:'Y'},
    {code: 'COA', value:'Comcare, Inc.',activateSW:'Y'},
    {code: 'COB', value:'Comcare, Inc. ',activateSW:'Y'},
    {code: 'COC', value:'Comcare, Inc. ',activateSW:'Y'},
    {code: 'MDC', value:'Michael Dunn Center ',activateSW:'Y'},
    {code: 'SCT', value:'Sunrise Community of Tennessee ',activateSW:'Y'},
    {code: 'OAG', value:'Open Arms Care Corporation dba Greeneville #1 Chuckey Pike ',activateSW:'Y'},
    {code: 'OAH', value:'Open Arms Care Corporation dba Hamilton County #2 Gamble Road - Southwest',activateSW:'Y'},
    {code: 'OAC', value:'Open Arms Care Corporation dba Greeneville #3 East Church Street - East ',activateSW:'Y'},
    {code: 'OAS', value:'Open Arms Care Corporation dba Hamilton County #1 Gamble Road - Southeast',activateSW:'Y'},
    {code: 'OAW', value:'Open Arms Care Corporation dba Greeneville #2 East Church Street - West ',activateSW:'Y'},
    {code: 'SCO', value:'Sunrise Community of Tennessee',activateSW:'Y'},
    {code: 'DSA', value:'D & S Residential Services, LP ',activateSW:'Y'},
    {code: 'DSB', value:'D & S Residential Services, LP ',activateSW:'Y'},
    {code: 'DSC', value:'D & S Residential Services, LP ',activateSW:'Y'},
    {code: 'OAK', value:'Open Arms Care Corporation dba Knox County #1 Bishops Bridge Northeast',activateSW:'Y'},
    {code: 'OAB', value:'Open Arms Care Corporation dba Knox County #2 Bishops Bridge Northwest ',activateSW:'Y'},
    {code: 'OAX', value:'Open Arms Care Corporation dba Knox County #4 South Northshore Drive Northwest ',activateSW:'Y'},
    {code: 'OAY', value:'Open Arms Care Corporation dba Knox County #3 South Northshore Drive Southeast ',activateSW:'Y'},
    {code: 'MDU', value:'Michael Dunn Center ',activateSW:'Y'},
    {code: 'OTR', value:'Other',activateSW:'Y'}
  ]

  stateList = [
    { code: 'TN', value: 'Tennessee', activateSW: 'Y' },
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

  relationshipList = [
    { code: 'PG',  value: "Parent or Guardian", activateSW: 'Y'},
    { code: 'CV',  value: "Conservator", activateSW : 'Y'},
    { code: 'CW',  value: "Case Worker", activateSW: 'Y'},
    { code: 'FA',  value: "Other Family/Friend", activateSW: 'Y'},
    { code: 'SP',  value: "Spouse/Significant Other", activateSW: 'Y'},
    { code: 'AT',  value: "Attorney", activateSW: 'Y'}
  ];

  Miltary_statusRt = [{"code": "AA", "value":"AA - Armed Forces America ","activateSW":"Y"},
  {"code": "AE", "value":"AE - Armed Forces Africa, Canada, Europe, Middle East","activateSW":"Y"},
  {"code": "AP", "value":"AP - Armed Forces Pacific","activateSW":"Y"}];

  optionsAvlbl = [
    { code: 'MYS', value: 'Living by myself', activateSW: 'Y'},
    { code: 'FAM', value: 'Living with natural or adopted family', activateSW: 'Y'},
    { code: 'SME', value: 'Living with someone else', activateSW: 'Y'}
  ];

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


  phoneTypeList = [
    {code: 'HM', value:'Home',activateSW:'Y'},
    {code: 'WK', value:'Work',activateSW:'Y'},
    {code: 'CL', value:'Cell',activateSW:'Y'}
  ];

  constructor(
    private fb: FormBuilder,
    private refService: ReferralService,
    private router: Router,
    private customValidator: CustomvalidationService,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) { }

  getFormData() {
    return this.refContactForm.controls;
  }

  ngOnInit() {
    this.refContactForm = this.fb.group({
      anotherPlaceSw: [''],
      applicantCellPhNum: ['', [Validators.maxLength(10), this.customValidator.phonenumberValidator()]],
      applicantWorkPhNum: ['', [Validators.maxLength(10), this.customValidator.phonenumberValidator()]],
      applicantHomePhNum: ['', [Validators.maxLength(10), this.customValidator.phonenumberValidator()]],
      appPrefPhoneTypCd: [''],
      currLvngArrngCd: ['', [Validators.required]],
      appDsgnSw: [''],
      dsgnAaAeApCd: [''],
      dsgnAddrL2Dsgn: [''],
      dsgnAddrLine1: [''],
      dsgnAddressFormatCd: [''],
      dsgnApoFpoCd: [''],
      dsgnCity: [''],
      dsgnCntyCd: [''],
      firstName: [''],
      lastName: [''],
      mailSw: [''],
      midInitial: [''],
      dsgnStateCd: [''],
      dsgnZipExtn: [''],
      dsgnZipcode: [''],
      applicantEmailAddr: ['', [this.customValidator.emailValidator()]],
      facilityCd: [''],
      facilityOthrTxt: [''],
      helpRightAwaySw: ['', Validators.required],
      appInterSw: ['', Validators.required],
      prefLangLettersCd: [''],
      lvngElseSw: [''],
      lvngFamilySw: [''],
      lostPlaceSw: ['', Validators.required],
      moveOutSoonSw: ['', Validators.required],
      needSrvcsSw: [''],
      othLivingArrange: [''],
      reltshpCd: [''],
      cellPhNum: ['', [Validators.maxLength(10), this.customValidator.phonenumberValidator()]],
      appPrefLangCd: ['']
    });

    this.ageRelatedActivity();

    if(this.refService.getRefId() !== null && this.refService.getRefId() !== undefined){
      this.dataPatchup();
    }
  }

  dataPatchup(){
    const loadData = this.refService.getRefContactDetails(this.refService.getRefId(), this.pageId)
    .then(response => {
      let receivedData = response;
      console.log("receivedData" + JSON.stringify(receivedData));

      this.refContactForm.patchValue(receivedData.body);
      this.refContactForm.patchValue(receivedData.body.refLivingArrangementVO);
    });
  }

  validateAddress() {
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
      const dialogRef = this.dialog.open(
        AddressValidationComponent,
        dialogConfig
      );
      dialogRef.afterClosed().subscribe((address) => {
        if (address) {
          this.getFormData().dsgnAddrLine1.setValue(address.dsgnAddrLine1);
          this.getFormData().dsgnAddrL2Dsgn.setValue(address.dsgnAddrL2Dsgn);
          this.getFormData().dsgnCity.setValue(address.dsgnCity);
          this.getFormData().dsgnStateCd.setValue(address.dsgnStateCd);
          this.getFormData().dsgnZipcode.setValue(address.dsgnZipcode);
          this.getFormData().dsgnZipExtn.setValue(address.dsgnZipExtn);
          console.log(address);
        }
      });
  }

  ageRelatedActivity(){
    const age = this.refService.getAge();
    console.log("ageInsideContact====>"+age);
    if(age >= 18) {
      this.ageSW = true;
      this.getFormData().appDsgnSw.setValidators(Validators.required);
      this.getFormData().firstName.clearValidators();
      this.getFormData().lastName.clearValidators();
      this.getFormData().reltshpCd.clearValidators();
      this.getFormData().cellPhNum.clearValidators();

    }
    else if(age<18) {
      this.showNote = true;
      this.getFormData().appDsgnSw.clearValidators();
      this.getFormData().firstName.setValidators([Validators.required, Validators.maxLength(45), this.customValidator.nameValidator()]);
      this.getFormData().lastName.setValidators([Validators.required, Validators.maxLength(45), this.customValidator.nameValidator()]);
      this.getFormData().reltshpCd.setValidators([Validators.required]);
      this.getFormData().cellPhNum.setValidators([Validators.required, Validators.maxLength(10), this.customValidator.phonenumberValidator()]);

    }
    this.getFormData().appDsgnSw.updateValueAndValidity();
    this.getFormData().firstName.updateValueAndValidity();
    this.getFormData().midInitial.updateValueAndValidity();
    this.getFormData().lastName.updateValueAndValidity();
    this.getFormData().reltshpCd.updateValueAndValidity();
    this.getFormData().cellPhNum.updateValueAndValidity();
  }

  get f() {
    return this.refContactForm.controls;
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

  saveAndExit() {
    this.event = 'SaveAndExit';
    this.saveRefandContact(true);
  }
  showSaveAndExitPopup() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = { route: 'ltss/referral' };
    dialogConfig.panelClass = 'exp_popup';
    dialogConfig.width = '648px';
    dialogConfig.height = '360px';

    this.dialog.open(SavePopupComponent, dialogConfig);
  }

  next() {
    this.isSamePageNavigation =  true;
    this.event = 'Next';
    this.submitted = true;
    console.log(this.getFormData());
    if (this.refContactForm.valid) {
      this.enableNext = false;
      this.showSpinner = true;
      this.saveRefandContact();
    }
  }
  saveRefandContact(showPopup?: boolean) {
    this.isSamePageNavigation =  true;
    const refId = this.refService.getRefId();
    console.log("heres the refID !!!" + refId);
    this.personId = this.refService.getPersonId();
    console.log(this.getFormData().currLvngArrngCd.value);
    const refLivingArrangementVO = new RefLivingArrangement(
      this.getFormData().anotherPlaceSw.value,
      this.getFormData().currLvngArrngCd.value,
      this.getFormData().facilityCd.value,
      this.getFormData().facilityOthrTxt.value,
      this.sendingYorN(this.helpRightAwaySw),
      '0',
      this.sendingYorN(this.lvngElseSw),
      this.sendingYorN(this.lvngFamilySw),
      this.sendingYorN(this.lvngSelfSw),
      this.sendingYorN(this.lostPlaceSw),
      this.sendingYorN(this.moveOutSoonSw),
      this.getFormData().needSrvcsSw.value,
      this.getFormData().othLivingArrange.value,
      this.personId,
      this.refService.getRefId(),
      'PERCI'
    );

    const refContactAddressVO = new RefContactAddress(
      this.getFormData().dsgnAddressFormatCd.value,
      this.getFormData().dsgnAddrLine1.value,
      this.getFormData().dsgnAddrL2Dsgn.value,
      this.refService.getRefId(),
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
      this.getFormData().applicantEmailAddr.value,
      this.getFormData().applicantHomePhNum.value,
      this.getFormData().appDsgnSw.value,
	  this.getFormData().appInterSw.value,
      this.getFormData().applicantWorkPhNum.value,
      this.getFormData().appPrefPhoneTypCd.value,
      this.getFormData().appPrefLangCd.value,
      this.getFormData().cellPhNum.value,
      this.getFormData().firstName.value,
      this.getFormData().mailSw.value,
      this.getFormData().lastName.value,
      this.getFormData().midInitial.value,
      this.getFormData().prefLangLettersCd.value,
      this.refService.getRefId(),
      this.getFormData().reltshpCd.value,
      '',
      'DSGN',
      '0',
      this.pageId,
      refLivingArrangementVO,
      refContactAddressVO
    );

    const response = this.refService.saveRefContact(refAppContact);
    this.nextForm = 'PERSW';
    const that = this;
    response.then(function(response: HttpResponse<any>){
      that.showSpinner = false;
      that.enableNext = true;
      if (showPopup) {
        that.showSaveAndExitPopup();
      } else {
        that.nextForm = response.headers.get('next');
        response = response.body;
        that.nextPath = ReferralFlowSeq[that.nextForm];
        if (that.event === 'Next') {
          that.completedContact.emit(ReferralFlowSeq[that.nextForm]);
        }
        const element = document.getElementById('pM');
        if (element !== null) {
            element.scrollIntoView(true);
          }
      }
    });
  }

  sendingYorN(input: boolean) {
    if (input === true) {
      return 'Y';
    } else if (input === false) {
      return 'N';
    }
  }

  onDesigneeChange(mrChange: MatRadioChange) {
    if (mrChange.value === 'Y') {
      this.isDesignee = true;
      this.refContactForm.get('mailSw').setValidators(Validators.required);
      this.getFormData().firstName.setValue(null);
      this.getFormData().midInitial.setValue(null);
      this.getFormData().lastName.setValue(null);
      this.getFormData().reltshpCd.setValue(null);
      this.getFormData().cellPhNum.setValue(null);
      this.getFormData().firstName.markAsUntouched();
      this.getFormData().lastName.markAsUntouched();
      this.getFormData().reltshpCd.markAsUntouched();
      this.getFormData().cellPhNum.markAsUntouched();
      this.getFormData().firstName.setValidators([Validators.required, Validators.maxLength(45), this.customValidator.nameValidator()]);
      this.getFormData().lastName.setValidators([Validators.required, Validators.maxLength(45), this.customValidator.nameValidator()]);
      this.getFormData().reltshpCd.setValidators([Validators.required]);
      this.getFormData().cellPhNum.setValidators([Validators.required, Validators.maxLength(10), this.customValidator.phonenumberValidator()]);

    } else if (mrChange.value === 'N') {
      this.isDesignee = false;
      this.refContactForm.get('mailSw').clearValidators();
      this.getFormData().firstName.clearValidators();
      this.getFormData().firstName.setValue(null);
      this.getFormData().midInitial.clearValidators();
      this.getFormData().midInitial.setValue(null);
      this.getFormData().lastName.clearValidators();
      this.getFormData().lastName.setValue(null);
      this.getFormData().reltshpCd.clearValidators();
      this.getFormData().reltshpCd.setValue(null);
      this.getFormData().cellPhNum.clearValidators();
      this.getFormData().cellPhNum.setValue(null);
    }
    this.refContactForm.get('mailSw').updateValueAndValidity();
    this.getFormData().firstName.updateValueAndValidity();
      this.getFormData().midInitial.updateValueAndValidity();
      this.getFormData().lastName.updateValueAndValidity();
      this.getFormData().reltshpCd.updateValueAndValidity();
      this.getFormData().cellPhNum.updateValueAndValidity();
  }

  onInterpreterChange(mrChange: MatRadioChange) {
    if (mrChange.value === 'Y') {
      this.interpreterSW = true;
      this.refContactForm.get('appPrefLangCd').setValidators(Validators.required);
      this.refContactForm.get('appPrefLangCd').markAsUntouched();
      this.refContactForm.get('appPrefLangCd').setValue(null);
    } else if (mrChange.value === 'N') {
      this.interpreterSW = false;
      this.refContactForm.get('appPrefLangCd').clearValidators();
      this.refContactForm.get('appPrefLangCd').setValue(null);
    }
    this.refContactForm.get('appPrefLangCd').updateValueAndValidity();
  }

  onDesigneeMailChange(mrChange: MatRadioChange) {
    if (mrChange.value === 'N') {
      this.designeeMailSW = false;
      this.refContactForm.get('dsgnAddressFormatCd').clearValidators();
      this.refContactForm.get('dsgnAddrLine1').clearValidators();
      this.refContactForm.get('dsgnAddrL2Dsgn').clearValidators();
      this.refContactForm.get('dsgnCity').clearValidators();
      this.refContactForm.get('dsgnZipcode').clearValidators();
      this.refContactForm.get('dsgnStateCd').clearValidators();
      this.refContactForm.get('dsgnAddressFormatCd').setValue(null);
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
      this.refContactForm.get('dsgnAddressFormatCd').markAsUntouched();
      this.refContactForm.get('dsgnAddrLine1').markAsUntouched();
      this.refContactForm.get('dsgnAddrL2Dsgn').markAsUntouched();
      this.refContactForm.get('dsgnCity').markAsUntouched();
      this.refContactForm.get('dsgnZipcode').markAsUntouched();
      this.refContactForm.get('dsgnStateCd').markAsUntouched();
      this.refContactForm.get('dsgnCntyCd').markAsUntouched();
      this.refContactForm.get('dsgnApoFpoCd').markAsUntouched();
      this.refContactForm.get('dsgnAaAeApCd').markAsUntouched();
      this.refContactForm.get('dsgnAddressFormatCd').setValue(null);
      this.refContactForm.get('dsgnAddrLine1').setValue(null);
      this.refContactForm.get('dsgnAddrL2Dsgn').setValue(null);
      this.refContactForm.get('dsgnCity').setValue(null);
      this.refContactForm.get('dsgnZipcode').setValue(null);
      this.refContactForm.get('dsgnStateCd').setValue(null);
      this.refContactForm.get('dsgnCntyCd').setValue(null);
      this.refContactForm.get('dsgnApoFpoCd').setValue(null);
      this.refContactForm.get('dsgnAaAeApCd').setValue(null);
      this.refContactForm.get('dsgnAddressFormatCd').setValidators(Validators.required);
      this.refContactForm.get('dsgnAddrLine1').setValidators([Validators.required, Validators.maxLength(100), Validators.pattern('^[A-Za-z0-9 ]+$')]);
      this.refContactForm.get('dsgnAddrL2Dsgn').setValidators([Validators.maxLength(50), Validators.maxLength(100), Validators.pattern('^[A-Za-z0-9 ]+$')]);
      this.refContactForm.get('dsgnCity').setValidators([Validators.required, Validators.maxLength(25), this.customValidator.addressAndCityValidator()]);
      this.refContactForm.get('dsgnZipcode').setValidators([Validators.required, Validators.pattern('[0-9]{5}'), this.customValidator.specialCharacterValidator()]);
      this.refContactForm.get('dsgnStateCd').setValidators(Validators.required);
    }
    this.refContactForm.get('dsgnAddressFormatCd').updateValueAndValidity();
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
      this.refContactForm.get('anotherPlaceSw').clearValidators();
    } else if (mrChange.value === 'Y') {
      this.lostPlaceSw = true;
      this.refContactForm.get('anotherPlaceSw').setValidators(Validators.required);
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

  onPhoneType(msChange: MatSelectChange) {
    const applicantCellPhNum = this.refContactForm.get('applicantCellPhNum');
    const applicantWorkPhNum = this.refContactForm.get('applicantWorkPhNum');
    const applicantHomePhNum = this.refContactForm.get('applicantHomePhNum');
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
  onAddressFormat(event) {
    if (event.source.value === 'MLTY') {
      this.addrFormatSW = true;
    } else {
      this.addrFormatSW = false;
    }
  }

  onCurrentLivingArrangement(event) {
    if (event.source.value === 'OTH') {
      this.longTermFacility = false;
      this.refContactForm.get('othLivingArrange').setValidators(Validators.required);
      this.refContactForm.get('needSrvcsSw').clearValidators();
      this.refContactForm.get('facilityCd').clearValidators();
      this.othLivingArrange = true;
      this.nursingHomeSW = false;
      this.isOwnHome = false;
    } else if (event.source.value === 'LTC') {
      this.longTermFacility = true;
      this.refContactForm.get('needSrvcsSw').setValidators(Validators.required);
      this.refContactForm.get('facilityCd').setValidators(Validators.required);
      this.refContactForm.get('othLivingArrange').clearValidators();
      this.nursingHomeSW = true;
      this.othLivingArrange = false;
      this.isOwnHome = false;
    }
    else if (
      event.source.value === 'HOM'
    ) {
      this.refContactForm.get('needSrvcsSw').clearValidators();
      this.refContactForm.get('facilityCd').clearValidators();
      this.refContactForm.get('othLivingArrange').clearValidators();
      this.longTermFacility = false;
      this.isOwnHome = true;
      this.othLivingArrange = false;
      this.nursingHomeSW = false;
    }
    else {
      this.refContactForm.get('needSrvcsSw').clearValidators();
      this.refContactForm.get('facilityCd').clearValidators();
      this.refContactForm.get('othLivingArrange').clearValidators();
      this.longTermFacility = false;
      this.othLivingArrange = false;
    }
    this.refContactForm.get('needSrvcsSw').updateValueAndValidity();
    this.refContactForm.get('facilityCd').updateValueAndValidity();
    this.refContactForm.get('othLivingArrange').updateValueAndValidity();
        this.refService.setCurrentLivingArrangementCd(event.source.value);
  }

  onFacilityCd(event) {
    if (event.source.value === 'OTR') {
      this.otherfacilityCD = true;
      this.refContactForm.get('facilityOthrTxt').setValidators(Validators.required);
    }
    else {
      this.otherfacilityCD = false;
      this.refContactForm.get('facilityOthrTxt').clearValidators();
    }
    this.refContactForm.get('facilityOthrTxt').updateValueAndValidity();
  }

  onLivingChange(value) {
    console.log(value);
    if (value === 'MYS') {
      this.lvngSelfSw = true;
    } else if (value === 'FAM') {
      this.lvngFamilySw = true;
    } else if (value === 'SME') {
      this.lvngElseSw = true;
    }
  }

  back() {
    console.log(this.refContactForm);
    const previousForm = 'PERAI';
    if (this.refContactForm.touched){
      this.toastRef = this.toastr.warning(this.customValidation.C1, '', {
        tapToDismiss: true,
        disableTimeOut: true,
        positionClass: 'toast-top-full-width' });
      if (this.toastrBack){
        this.toastr.clear(this.toastRef.ToastId);
        this.completedContact.emit(ReferralFlowSeq[previousForm]);
        this.refContactForm.reset();
        this.toastrBack = false;
      }
      this.toastrBack = true;
    }
    if (!this.refContactForm.touched) {
      this.completedContact.emit(ReferralFlowSeq[previousForm]);
      this.toastrBack = false;
    }
  }

  setPrefferedPhoneType(value) {
    this.prefferedPhoneArray.push(value);
    if (this.prefferedPhoneArray.length > 1) {
      console.log('inside inner if', value);
      this.showPreferredPhoneType = true;
    }
    if (this.showPreferredPhoneType === true) {
        this.refContactForm.get('appPrefPhoneTypCd').setValidators(Validators.required);
      }
      else if (this.showPreferredPhoneType === false) {
        this.refContactForm.get('appPrefPhoneTypCd').clearValidators();
      }
    }
  }
