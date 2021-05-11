import { CustomvalidationService } from '../../_shared/utility/customvalidation.service';
import { MatTableDataSource } from '@angular/material/table';
import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { RefApplicantDetail } from '../../_shared/model/RefApplicantDetail';
import { RefCoreDtl } from '../../_shared/model/RefCoreDtl';
import { Applicant } from '../../_shared/model/Applicant';
import { ApplicantAddress } from '../../_shared/model/ApplicantAddress';
import { ReferralFlowSeq } from '../../_shared/utility/ReferralFlowSeq';
import { SearchPerson } from '../../_shared/model/SearchPerson';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ReferralService } from '../../core/services/referral/referral.service';
import { MatRadioChange } from '@angular/material/radio';
import { MatSelectChange } from '@angular/material/select';
import { HttpResponse } from '@angular/common/http';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import * as customValidation from '../../_shared/constants/validation.constants';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AddressValidationComponent } from 'src/app/_shared/components/address-validation/address-validation.component';
import { ViewportScroller } from '@angular/common';
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
  selector: 'app-ref-applicant',
  templateUrl: './ref-applicant.component.html',
  styleUrls: ['./ref-applicant.component.scss'],
  // providers: [ReferralService]
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class RefApplicantComponent implements OnInit {
  @Output() completedApplicant: EventEmitter<any> = new EventEmitter<any>();
  pageId: string = 'PERAI';
  applicantComponentComplete = false;
  applicantComponentStep = false;
  isSearchPerson = false;
  submitted = false;
  isTN = false;
  isTN2 = false;
  countyMap = new Map();
  birthdayDateString: string;
  myForm: FormGroup;
  customValidation = customValidation;
  minDate: Date;
  maxDate: Date;
  isSamePageNavigation: boolean;
  refSearchPerson: string[] = [
    'personName',
    'ssn',
    'birthDate',
    'personID',
    'county'
  ];
  dataSource: MatTableDataSource<any>;

  expandedElement: ReferralSearchElements | null;
  submissionDate: string;

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

  genderCode = [
    { code: 'M', value: 'Male', activateSW: 'Y' },
    { code: 'F', value: 'Female', activateSW: 'Y' },
    { code: 'U', value: 'Unknown', activateSW: 'Y' },
  ];

  Miltary_statusRt = [{"code": "AA", "value":"AA - Armed Forces America ","activateSW":"Y"},
  {"code": "AE", "value":"AE - Armed Forces Africa, Canada, Europe, Middle East","activateSW":"Y"},
  {"code": "AP", "value":"AP - Armed Forces Pacific","activateSW":"Y"}];
  startDate = new Date();

  constructor(
    private fb: FormBuilder,
    private refService: ReferralService,
    private customValidator: CustomvalidationService,
    private toastr: ToastrService,
    private matDialog: MatDialog
  ) {}
  refApplicantForm: FormGroup;
  age: number;
  month: number;
  refApplicantDetail: RefApplicantDetail;
  searchPerson: SearchPerson;
  alternateNameSW = false;
  mailAddrSW = true;
  addrFormatSW = false;
  mailAddrFormatSW = false;
  today: Date;
  fileClearanceSw: any;
  newPersonSw: any;
  alreadyEnrolled: any;
  alreadyEnrolledSw = false;
  exactMatchSwitch = false;
  prsonId: any;
  toastrBack = false;
  toastRef: any;
  enableNext = false;
  showSpinner = false;
  selected = 'US Address';

  ngOnInit(): void {

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
    this.isTN = true;
    this.isTN2 = true;
    for ( const row of this.countyList){
      this.countyMap.set(row.code, row.value);
    }

    this.refApplicantForm = this.fb.group({
      firstName: [
        '',
        [
          Validators.required,
          Validators.maxLength(45),
          this.customValidator.nameValidator(),
        ],
      ],
      lastName: [
        '',
        [
          Validators.required,
          Validators.maxLength(45),
          this.customValidator.nameValidator(),
        ],
      ],
      midInitial: [''],
      dobDt: ['', [Validators.required]],
      suffix: [''],
      genderCode: [''],
      ssn: ['', [Validators.required, this.customValidator.ssnValidator()]],
      aliasFirstName: [''],
      aliasLastName: [''],
      aliasMidInitial: [
        '',
        [Validators.maxLength(1), Validators.pattern('^[a-zA-Z]*$')],
      ],
      ssnAvalSw: [false],
      aliasNameSw: ['', [Validators.required]],
      mailAddrSw: ['', [Validators.required]],
      addrFormatCd: ['USAD'],
      aliasSuffix: [''],
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
      city: ['', [Validators.required, Validators.maxLength(25), this.customValidator.addressAndCityValidator()]],
      zip: ['', [Validators.required, Validators.pattern('[0-9]{5}')]],
      zipExtn: [''],
      cntyCd: ['', [Validators.required]],
      militaryPoCd: [''],
      militaryStateCd: [''],
      mailAddressFormatCd: ['USAD'],
      mailAddrLine1: ['', [Validators.required, Validators.maxLength(100), Validators.pattern('^[A-Za-z0-9 ]+$')]],
      mailAddrLine2: ['', [Validators.maxLength(50), Validators.pattern('^[A-Za-z0-9 ]+$')]],
      mailCity: [''],
      mailState: ['TN'],
      mailZip: ['', [Validators.required, Validators.pattern('[0-9]{5}')]],
      mailZipExtn: [''],
      mailCounty: [''],
      mailMilitaryPoCd: [''],
      mailMilitaryStateCd: [''],
    });
    console.log(this.refApplicantForm);
    if(this.refService.getRefId() !== null && this.refService.getRefId() !== undefined){
      this.dataPatchup();
    }
  }

  dataPatchup(){
    const loadData = this.refService.getApplicantDetails(this.refService.getRefId(), this.pageId)
    .then(response => {
      let receivedData = response;
      console.log("receivedData" + JSON.stringify(receivedData));

      this.refApplicantForm.patchValue(receivedData.body);
      this.refApplicantForm.patchValue(receivedData.body.addressVO);

      if(receivedData.body.ssnAvalSw === 'N'){
        this.refApplicantForm.patchValue({
          ssnAvalSw: false
        });
      }
      else if(receivedData.body.ssnAvalSw === 'Y'){
        this.refApplicantForm.patchValue({
          ssnAvalSw: true
        });
      }
    });
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

  calculateAge(event) {
    if(this.getFormData().dobDt.valid){
      this.today = new Date();
      console.log(JSON.stringify(this.today.toJSON()));
      const birthDate = new Date(event.value);
      this.birthdayDateString = birthDate.toJSON();
      let age = this.today.getFullYear() - birthDate.getFullYear();
      const m = this.today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && this.today.getDate() < birthDate.getDate())) {
        age--;
      }
      this.age = age;
      this.month = (12 - Math.abs(m));
      if (this.month === 12) {
        this.month = 0;
      }
      this.refService.setAge(age);
    }
    // this.today = new Date();
    // console.log(JSON.stringify(this.today.toJSON()));
    // const birthDate = new Date(event.value);
    // this.birthdayDateString = birthDate.toJSON();
    // let age = this.today.getFullYear() - birthDate.getFullYear();
    // const m = this.today.getMonth() - birthDate.getMonth();
    // if (m < 0 || (m === 0 && this.today.getDate() < birthDate.getDate())) {
    //   age--;
    // }
    // this.age = age;
    // this.month = (12 - Math.abs(m));
    // if (this.month === 12) {
    //   this.month = 0;
    // }
    // this.refService.setAge(age);
  }

  getFormData() {
    return this.refApplicantForm.controls;
  }

  saveRefandApplicant() {
    this.isSamePageNavigation =  true;
    this.submitted = true;
    this.enableNext = false;
    this.showSpinner = true;
    console.log(this.submitted);

	const localStorageLocal = localStorage.getItem('APP_STORAGE_TOKEN');
    const userId = JSON.parse(localStorageLocal).userName;
    const entityId = JSON.parse(localStorageLocal).entityId;
	const entityTypeCd = JSON.parse(localStorageLocal).entityTypeCd;


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
      this.getFormData().aliasNameSw.value,
      this.birthdayDateString,
      this.getFormData().firstName.value,
      this.getFormData().genderCode.value,
      this.getFormData().lastName.value,
      this.getFormData().midInitial.value,
      this.getFormData().ssn.value,
      this.sendingYorN(this.getFormData().ssnAvalSw.value),
      this.getFormData().suffix.value,
      true,
      'PERAI',
      this.fileClearanceSw,
      this.newPersonSw,
	  entityId,
	  entityTypeCd,
      addressVO
    );

    if (this.today) {
      this.submissionDate = this.today.toJSON();
    }

    this.refApplicantDetail = this.refService.getRefApplicantDetail();

	const refCoreDtl = new RefCoreDtl(
      'PERAI',
      '0',
      null,
      null,
      entityId,
      entityTypeCd,
      'N',
      'N',
      '0',
      'ECF',
      'OTHR',
      'PER',
      this.submissionDate,
      this.submissionDate,
      'PS',
      this.refApplicantDetail,
      applicant
    );
    console.log(refCoreDtl);
    const response = this.refService.saveReferral(refCoreDtl);
    let nextForm = 'PRCIF';
    let nextPath = '';
    const that = this;
    response.then(function (response: HttpResponse<any>) {
      that.removeListener();
      that.showSpinner = false;
      that.enableNext = true;
      nextForm = response.headers.get('next');
      response = response.body;
      nextPath = ReferralFlowSeq[nextForm];
      that.completedApplicant.emit(ReferralFlowSeq[nextForm]);
      const element = document.getElementById('pM');
      if (element !== null) {
          element.scrollIntoView(true);
        }
    });
  }

  searchForPerson() {
    console.log(this.refApplicantForm);
    this.submitted = true;
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

    const searchApplicant = new Applicant(
      null,
      null,
      this.getFormData().aliasFirstName.value,
      this.getFormData().aliasLastName.value,
      this.getFormData().aliasMidInitial.value,
      this.getFormData().aliasSuffix.value,
      this.getFormData().aliasNameSw.value,
      this.birthdayDateString,
      this.getFormData().firstName.value,
      this.getFormData().genderCode.value,
      this.getFormData().lastName.value,
      this.getFormData().midInitial.value,
      this.getFormData().ssn.value,
      this.sendingYorN(this.getFormData().ssnAvalSw.value),
      this.getFormData().suffix.value,
      true,
      'PERAI',
      null,
      null,
	  null,
	  null,
      addressVO
    );
    console.log(searchApplicant);
    this.refService.postSearchPerson(searchApplicant).subscribe((res) => {
      console.log(res);
      this.fileClearanceSw = res[0].fileClearanceSw;
      this.newPersonSw = res[0].newPersonSw;
      this.alreadyEnrolled = res[0].alreadyEnrolled;
      this.prsonId = res[0].prsnId;
      if (this.fileClearanceSw === 'Y' && this.newPersonSw === 'N') {
        this.isSearchPerson = true;
      } else {
		  this.isSearchPerson = false;
	  }
      this.exactMatchSwitch = true;
      if (this.alreadyEnrolled === 'true') {
        this.alreadyEnrolledSw = true;
      } else {
		  this.alreadyEnrolledSw = false;
	  }
      this.dataSource = new MatTableDataSource(res);
    });
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
        AddressValidationComponent,
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
        AddressValidationComponent,
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
  sendingYorN(ssnAvailableCheck) {
    if (ssnAvailableCheck) {
      return 'Y';
    } else {
      return 'N';
    }
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
    } else if (mrChange.value === 'Y') {
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
    } 
    else if (mrChange.value === 'Y') {
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
    if (event.source.value === 'MLTY') {
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
    this.getFormData().mailCity.updateValueAndValidity();
    this.getFormData().mailState.updateValueAndValidity();
    this.getFormData().mailCounty.updateValueAndValidity();
    this.getFormData().mailMilitaryPoCd.updateValueAndValidity();
    this.getFormData().mailMilitaryStateCd.updateValueAndValidity();
    console.log(this.mailAddrFormatSW);
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
    if (event.source.value === 'MLTY') {
      this.addrFormatSW = true;
      this.getFormData().city.clearValidators();
      this.getFormData().stateCd.clearValidators();
      this.getFormData().cntyCd.clearValidators();
      this.getFormData().militaryPoCd.setValidators([Validators.required]);
      this.getFormData().militaryStateCd.setValidators([Validators.required]);
    } else {
      console.log("inside else");
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
  ssnChange(event) {
    if (this.getFormData().ssn.value) {
      this.getFormData().ssnAvalSw.disable();
    } else {
      this.getFormData().ssnAvalSw.enable();
    }
  }
  onSsnAvailableChange(event) {
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

  letsEnableNext(){
    this.enableNext = true;
  }

  addListener(){
    document.getElementById("pM").addEventListener("click", this.setFocusToSelection);
  }

  setFocusToSelection(){
    if(document.getElementById("addIndiv")){
        document.getElementById("addIndiv").focus();
    }
    else if(document.getElementById("selectPersn")){
      document.getElementById("selectPersn").focus();
    }
  }

  chkForValue(e){
    if(this.getFormData().aliasFirstName.valid){
      this.getFormData().aliasLastName.clearValidators();
      this.getFormData().aliasLastName.clearAsyncValidators();
    }
    else if(this.getFormData().aliasLastName.valid){
      this.getFormData().aliasFirstName.clearValidators();
      this.getFormData().aliasFirstName.clearAsyncValidators();
    }
    this.getFormData().aliasLastName.updateValueAndValidity();
    this.getFormData().aliasFirstName.updateValueAndValidity();
  }

  removeListener(){
    console.log("inside removeListener");
    document.getElementById("pM").removeEventListener("click", this.setFocusToSelection);
  }

  back() {
    console.log(this.refApplicantForm);
    const previousForm = 'PERSR';
    if (this.refApplicantForm.touched) {
      this.toastRef = this.toastr.warning(this.customValidation.C1, '', {
        tapToDismiss: true,
        disableTimeOut: true,
        positionClass: 'toast-top-full-width',
      });
      if (this.toastrBack) {
        this.toastr.clear(this.toastRef.ToastId);
        this.completedApplicant.emit(ReferralFlowSeq[previousForm]);
        this.refApplicantForm.reset();
        this.toastrBack = false;
      }
      this.toastrBack = true;
    }
    if (!this.refApplicantForm.touched) {
      this.completedApplicant.emit(ReferralFlowSeq[previousForm]);
      this.toastrBack = false;
    }
  }
}
