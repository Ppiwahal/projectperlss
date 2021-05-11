import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ReferralService } from '../../../../core/services/referral/referral.service';
import { IntakeActionsService } from '../../../../core/services/referral/intake-actions/intake-actions.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CustomvalidationService } from '../../../../_shared/utility/customvalidation.service';
import * as customValidation from '../../../../_shared/constants/validation.constants';
import { MatSelectChange } from '@angular/material/select';
import { MatRadioChange } from '@angular/material/radio';

@Component({
    selector: 'app-referral-schedule-intake-visit',
    templateUrl: './referral-schedule-intake-visit.component.html',
    styleUrls: ['./referral-schedule-intake-visit.component.scss']
})
export class ReferralScheduleIntakeVisitComponent implements OnInit, OnDestroy {

    // Data
    APPOINTMENT_STATUS = [
        {
            code: 'SC',
            value: 'Scheduled',
            activateSW: 'Y'
        },
        {
            code: 'CA',
            value: 'Cancelled',
            activateSW: 'Y'
        },
        {
            code: 'CM',
            value: 'Completed',
            activateSW: 'Y'
        },
        {
            code: 'UC',
            value: 'Unable to contact',
            activateSW: 'Y'
        },
        {
            code: 'RE',
            value: 'Rescheduled',
            activateSW: 'Y'
        }
    ];

    APPOINTMENT_CANCEL_REASON = [
        {
            code: 'UN',
            value: 'Unable to Contact',
            activateSW: 'Y'
        },
        {
            code: 'RW',
            value: 'Referral Withdrawn',
            activateSW: 'Y'
        },
        {
            code: 'AC',
            value: 'Applicant Cancelled',
            activateSW: 'Y'
        }
    ];

    CONTACT_METHOD = [
        {
            code: 'IP',
            value: 'In-person',
            activateSW: 'Y'
        },
        {
            code: 'TE',
            value: 'Telephone',
            activateSW: 'Y'
        },
        {
            code: 'VT',
            value: 'Virtual',
            activateSW: 'Y'
        }
    ];

    STATE = [
        {
            code: 'TN',
            value: 'Tennessee',
            activateSW: 'Y'
        },
        {
            code: 'AL',
            value: 'Alabama',
            activateSW: 'Y'
        },
        {
            code: 'AK',
            value: 'Alaska',
            activateSW: 'Y'
        },
        {
            code: 'AZ',
            value: 'Arizona',
            activateSW: 'Y'
        },
        {
            code: 'AR',
            value: 'Arkansas',
            activateSW: 'Y'
        },
        {
            code: 'CA',
            value: 'California',
            activateSW: 'Y'
        },
        {
            code: 'CO',
            value: 'Colorado',
            activateSW: 'Y'
        },
        {
            code: 'CT',
            value: 'Connecticut',
            activateSW: 'Y'
        },
        {
            code: 'DE',
            value: 'Delaware',
            activateSW: 'Y'
        },
        {
            code: 'DC',
            value: 'District of Columbia',
            activateSW: 'Y'
        },
        {
            code: 'FL',
            value: 'Florida',
            activateSW: 'Y'
        },
        {
            code: 'GA',
            value: 'Georgia',
            activateSW: 'Y'
        },
        {
            code: 'HI',
            value: 'Hawaii',
            activateSW: 'Y'
        },
        {
            code: 'ID',
            value: 'Idaho',
            activateSW: 'Y'
        },
        {
            code: 'IL',
            value: 'Illinois',
            activateSW: 'Y'
        },
        {
            code: 'IN',
            value: 'Indiana',
            activateSW: 'Y'
        },
        {
            code: 'IA',
            value: 'Iowa',
            activateSW: 'Y'
        },
        {
            code: 'KS',
            value: 'Kansas',
            activateSW: 'Y'
        },
        {
            code: 'KY',
            value: 'Kentucky',
            activateSW: 'Y'
        },
        {
            code: 'LA',
            value: 'Louisiana',
            activateSW: 'Y'
        },
        {
            code: 'ME',
            value: 'Maine',
            activateSW: 'Y'
        },
        {
            code: 'MD',
            value: 'Maryland',
            activateSW: 'Y'
        },
        {
            code: 'MA',
            value: 'Massachusetts',
            activateSW: 'Y'
        },
        {
            code: 'MI',
            value: 'Michigan',
            activateSW: 'Y'
        },
        {
            code: 'MN',
            value: 'Minnesota',
            activateSW: 'Y'
        },
        {
            code: 'MS',
            value: 'Mississippi',
            activateSW: 'Y'
        },
        {
            code: 'MO',
            value: 'Missouri',
            activateSW: 'Y'
        },
        {
            code: 'MT',
            value: 'Montana',
            activateSW: 'Y'
        },
        {
            code: 'NE',
            value: 'Nebraska',
            activateSW: 'Y'
        },
        {
            code: 'NV',
            value: 'Nevada',
            activateSW: 'Y'
        },
        {
            code: 'NH',
            value: 'New Hampshire',
            activateSW: 'Y'
        },
        {
            code: 'NJ',
            value: 'New Jersey',
            activateSW: 'Y'
        },
        {
            code: 'NM',
            value: 'New Mexico',
            activateSW: 'Y'
        },
        {
            code: 'NY',
            value: 'New York',
            activateSW: 'Y'
        },
        {
            code: 'NC',
            value: 'North Carolina',
            activateSW: 'Y'
        },
        {
            code: 'ND',
            value: 'North Dakota',
            activateSW: 'Y'
        },
        {
            code: 'OH',
            value: 'Ohio',
            activateSW: 'Y'
        },
        {
            code: 'OK',
            value: 'Oklahoma',
            activateSW: 'Y'
        },
        {
            code: 'OR',
            value: 'Oregon',
            activateSW: 'Y'
        },
        {
            code: 'PA',
            value: 'Pennsylvania',
            activateSW: 'Y'
        },
        {
            code: 'RI',
            value: 'Rhode Island',
            activateSW: 'Y'
        },
        {
            code: 'SC',
            value: 'South Carolina',
            activateSW: 'Y'
        },
        {
            code: 'SD',
            value: 'South Dakota',
            activateSW: 'Y'
        },
        {
            code: 'TX',
            value: 'Texas',
            activateSW: 'Y'
        },
        {
            code: 'UT',
            value: 'Utah',
            activateSW: 'Y'
        },
        {
            code: 'VT',
            value: 'Vermont',
            activateSW: 'Y'
        },
        {
            code: 'VA',
            value: 'Virginia',
            activateSW: 'Y'
        },
        {
            code: 'WA',
            value: 'Washington',
            activateSW: 'Y'
        },
        {
            code: 'WV',
            value: 'West Virginia',
            activateSW: 'Y'
        },
        {
            code: 'WI',
            value: 'Wisconsin',
            activateSW: 'Y'
        },
        {
            code: 'WY',
            value: 'Wyoming',
            activateSW: 'Y'
        },
        {
            code: 'AS',
            value: 'American Samoa',
            activateSW: 'Y'
        },
        {
            code: 'FM',
            value: 'Federated States Of Micronesia',
            activateSW: 'Y'
        },
        {
            code: 'GU',
            value: 'Guam',
            activateSW: 'Y'
        },
        {
            code: 'MH',
            value: 'Marshall Islands',
            activateSW: 'Y'
        },
        {
            code: 'NI',
            value: 'North Mariana Islands',
            activateSW: 'Y'
        },
        {
            code: 'PR',
            value: 'Puerto Rico',
            activateSW: 'Y'
        },
        {
            code: 'PW',
            value: 'Palau',
            activateSW: 'Y'
        },
        {
            code: 'VI',
            value: 'Virgin Islands',
            activateSW: 'Y'
        }
    ];

    COUNTY = [
        {
            code: '001',
            value: 'Anderson',
            activateSW: 'Y'
        },
        {
            code: '002',
            value: 'Bedford',
            activateSW: 'Y'
        },
        {
            code: '003',
            value: 'Benton',
            activateSW: 'Y'
        },
        {
            code: '004',
            value: 'Bledsoe',
            activateSW: 'Y'
        },
        {
            code: '005',
            value: 'Blount',
            activateSW: 'Y'
        },
        {
            code: '006',
            value: 'Bradley',
            activateSW: 'Y'
        },
        {
            code: '007',
            value: 'Campbell',
            activateSW: 'Y'
        },
        {
            code: '008',
            value: 'Cannon',
            activateSW: 'Y'
        },
        {
            code: '009',
            value: 'Carroll',
            activateSW: 'Y'
        },
        {
            code: '010',
            value: 'Carter',
            activateSW: 'Y'
        },
        {
            code: '011',
            value: 'Cheatham',
            activateSW: 'Y'
        },
        {
            code: '012',
            value: 'Chester',
            activateSW: 'Y'
        },
        {
            code: '013',
            value: 'Claiborne',
            activateSW: 'Y'
        },
        {
            code: '014',
            value: 'Clay',
            activateSW: 'Y'
        },
        {
            code: '015',
            value: 'Cocke',
            activateSW: 'Y'
        },
        {
            code: '016',
            value: 'Coffee',
            activateSW: 'Y'
        },
        {
            code: '017',
            value: 'Crockett',
            activateSW: 'Y'
        },
        {
            code: '018',
            value: 'Cumberland',
            activateSW: 'Y'
        },
        {
            code: '019',
            value: 'Davidson',
            activateSW: 'Y'
        },
        {
            code: '020',
            value: 'Decatur',
            activateSW: 'Y'
        },
        {
            code: '021',
            value: 'DeKalb',
            activateSW: 'Y'
        },
        {
            code: '022',
            value: 'Dickson',
            activateSW: 'Y'
        },
        {
            code: '023',
            value: 'Dyer',
            activateSW: 'Y'
        },
        {
            code: '024',
            value: 'Fayette',
            activateSW: 'Y'
        },
        {
            code: '025',
            value: 'Fentress',
            activateSW: 'Y'
        },
        {
            code: '026',
            value: 'Franklin',
            activateSW: 'Y'
        },
        {
            code: '027',
            value: 'Gibson',
            activateSW: 'Y'
        },
        {
            code: '028',
            value: 'Giles',
            activateSW: 'Y'
        },
        {
            code: '029',
            value: 'Grainger',
            activateSW: 'Y'
        },
        {
            code: '030',
            value: 'Greene',
            activateSW: 'Y'
        },
        {
            code: '031',
            value: 'Grundy',
            activateSW: 'Y'
        },
        {
            code: '032',
            value: 'Hamblen',
            activateSW: 'Y'
        },
        {
            code: '033',
            value: 'Hamilton',
            activateSW: 'Y'
        },
        {
            code: '034',
            value: 'Hancock',
            activateSW: 'Y'
        },
        {
            code: '035',
            value: 'Hardeman',
            activateSW: 'Y'
        },
        {
            code: '036',
            value: 'Hardin',
            activateSW: 'Y'
        },
        {
            code: '037',
            value: 'Hawkins',
            activateSW: 'Y'
        },
        {
            code: '038',
            value: 'Haywood',
            activateSW: 'Y'
        },
        {
            code: '039',
            value: 'Henderson',
            activateSW: 'Y'
        },
        {
            code: '040',
            value: 'Henry',
            activateSW: 'Y'
        },
        {
            code: '041',
            value: 'Hickman',
            activateSW: 'Y'
        },
        {
            code: '042',
            value: 'Houston',
            activateSW: 'Y'
        },
        {
            code: '043',
            value: 'Humphreys',
            activateSW: 'Y'
        },
        {
            code: '044',
            value: 'Jackson',
            activateSW: 'Y'
        },
        {
            code: '045',
            value: 'Jefferson',
            activateSW: 'Y'
        },
        {
            code: '046',
            value: 'Johnson',
            activateSW: 'Y'
        },
        {
            code: '047',
            value: 'Knox',
            activateSW: 'Y'
        },
        {
            code: '048',
            value: 'Lake',
            activateSW: 'Y'
        },
        {
            code: '049',
            value: 'Lauderdale',
            activateSW: 'Y'
        },
        {
            code: '050',
            value: 'Lawrence',
            activateSW: 'Y'
        },
        {
            code: '051',
            value: 'Lewis',
            activateSW: 'Y'
        },
        {
            code: '052',
            value: 'Lincoln',
            activateSW: 'Y'
        },
        {
            code: '053',
            value: 'Loudon',
            activateSW: 'Y'
        },
        {
            code: '054',
            value: 'Macon',
            activateSW: 'Y'
        },
        {
            code: '055',
            value: 'Madison',
            activateSW: 'Y'
        },
        {
            code: '056',
            value: 'Marion',
            activateSW: 'Y'
        },
        {
            code: '057',
            value: 'Marshall',
            activateSW: 'Y'
        },
        {
            code: '058',
            value: 'Maury',
            activateSW: 'Y'
        },
        {
            code: '059',
            value: 'Meigs',
            activateSW: 'Y'
        },
        {
            code: '060',
            value: 'Monroe',
            activateSW: 'Y'
        },
        {
            code: '061',
            value: 'Montgomery',
            activateSW: 'Y'
        },
        {
            code: '062',
            value: 'Moore',
            activateSW: 'Y'
        },
        {
            code: '063',
            value: 'Morgan',
            activateSW: 'Y'
        },
        {
            code: '064',
            value: 'McMinn',
            activateSW: 'Y'
        },
        {
            code: '065',
            value: 'McNairy',
            activateSW: 'Y'
        },
        {
            code: '066',
            value: 'Obion',
            activateSW: 'Y'
        },
        {
            code: '067',
            value: 'Overton',
            activateSW: 'Y'
        },
        {
            code: '068',
            value: 'Perry',
            activateSW: 'Y'
        },
        {
            code: '069',
            value: 'Pickett',
            activateSW: 'Y'
        },
        {
            code: '070',
            value: 'Polk',
            activateSW: 'Y'
        },
        {
            code: '071',
            value: 'Putnam',
            activateSW: 'Y'
        },
        {
            code: '072',
            value: 'Rhea',
            activateSW: 'Y'
        },
        {
            code: '073',
            value: 'Roane',
            activateSW: 'Y'
        },
        {
            code: '074',
            value: 'Robertson',
            activateSW: 'Y'
        },
        {
            code: '075',
            value: 'Rutherford',
            activateSW: 'Y'
        },
        {
            code: '076',
            value: 'Scott',
            activateSW: 'Y'
        },
        {
            code: '077',
            value: 'Sequatchie',
            activateSW: 'Y'
        },
        {
            code: '078',
            value: 'Sevier',
            activateSW: 'Y'
        },
        {
            code: '079',
            value: 'Shelby',
            activateSW: 'Y'
        },
        {
            code: '080',
            value: 'Smith',
            activateSW: 'Y'
        },
        {
            code: '081',
            value: 'Stewart',
            activateSW: 'Y'
        },
        {
            code: '082',
            value: 'Sullivan',
            activateSW: 'Y'
        },
        {
            code: '083',
            value: 'Sumner',
            activateSW: 'Y'
        },
        {
            code: '084',
            value: 'Tipton',
            activateSW: 'Y'
        },
        {
            code: '085',
            value: 'Trousdale',
            activateSW: 'Y'
        },
        {
            code: '086',
            value: 'Unicoi',
            activateSW: 'Y'
        },
        {
            code: '087',
            value: 'Union',
            activateSW: 'Y'
        },
        {
            code: '088',
            value: 'Van Buren',
            activateSW: 'Y'
        },
        {
            code: '089',
            value: 'Warren',
            activateSW: 'Y'
        },
        {
            code: '090',
            value: 'Washington',
            activateSW: 'Y'
        },
        {
            code: '091',
            value: 'Wayne',
            activateSW: 'Y'
        },
        {
            code: '092',
            value: 'Weakley',
            activateSW: 'Y'
        },
        {
            code: '093',
            value: 'White',
            activateSW: 'Y'
        },
        {
            code: '094',
            value: 'Williamson',
            activateSW: 'Y'
        },
        {
            code: '095',
            value: 'Wilson',
            activateSW: 'Y'
        },
        {
            code: '999',
            value: 'Out of State',
            activateSW: 'Y'
        }
    ];

    ADDRESS_DATA = [
        {
            id: 2,
            addrLine1: '1012 Washington Avenue',
            addrLine2: 'Apt 102',
            city: 'Mounth Juliot',
            stateCd: 'TN',
            zip: '37203',
            zipExtsnsn: '1234',
            cnty: 'Davidson',
            refId: 'RF1000136'
        },
        {
            id: 1,
            addrLine1: '333 Commerce Street',
            addrLine2: 'Floor 15th',
            city: 'Nashville',
            stateCd: 'TN',
            zip: '37201',
            zipExtsnsn: '1234',
            cnty: 'Davidson',
            refId: 'RF1000136'
        },
        {
            id: 3,
            addrLine1: '334 Commerce Street',
            addrLine2: 'Floor 15th',
            city: 'Nashville',
            stateCd: 'TN',
            zip: '37201',
            zipExtsnsn: '1234',
            cnty: 'Davidson',
            refId: 'RF1000136'
        },
        {
            id: 4,
            addrLine1: '335 Commerce Street',
            addrLine2: 'Floor 15th',
            city: 'Nashville',
            stateCd: 'TN',
            zip: '37201',
            zipExtsnsn: '1234',
            cnty: 'Davidson',
            refId: 'RF1000136'
        }
    ];


    scheduleVisit: any;
    refId: any;
    personId: any;
    todaysDate: Date;
    customValidation = customValidation;
    addresses: any = [];
    addressOutput: any;
    showSeconds = false;

    // booleans
    formInitialized = false;
    submitted = false;
    isTN = false;
    appointmentScheduled = false;
    updateAppointment = false;
    disableScheduleVisitButton = false;
    disableScheduleVisitDiv = false;
    otherAddressSelectedSw = false;
    contactMethodOptionValue = false;
    appointmentStatusCancel= false;
    showTelNumber = false;
    comingFromUpdate = false;

    // formGroup
    scheduleIntakeForm: FormGroup;

    // Subscription
    subscriptions: Subscription[] = [];
    subscription1$: Subscription;
    subscription2$: Subscription;
    subscription3$: Subscription;

     //maps
     appointmentStatusMap = new Map();
     appointmentCancelReasonMap = new Map();
     contactMethodMap = new Map();
     countyMap = new Map();
     stateMap = new Map();

    constructor(private referralService: ReferralService,
        private intakeActionsService: IntakeActionsService,
        private fb: FormBuilder,
        private toastr: ToastrService,
        private customValidationService: CustomvalidationService) { }

    ngOnInit() {
        // const currentYear = new Date().getFullYear();
        this.todaysDate = new Date();
        this.refId = this.referralService.getRefId();
        this.personId = this.referralService.getPersonId();
        this.prepareAllMaps();
        this.scheduleIntakeData();
        this.getUniqueAddressess();
    }

    prepareAllMaps(){
        for ( const row of this.APPOINTMENT_STATUS){
            this.appointmentStatusMap.set(row.code, row.value);
        }
        for ( const row of this.APPOINTMENT_CANCEL_REASON){
            this.appointmentCancelReasonMap.set(row.code, row.value);
        }
        for ( const row of this.CONTACT_METHOD){
            this.contactMethodMap.set(row.code, row.value);
        }
        for ( const row of this.COUNTY){
            this.countyMap.set(row.code, row.value);
        }
        for ( const row of this.STATE){
            this.stateMap.set(row.code, row.value);
        }
    }

    initializeForm() {
        this.scheduleIntakeForm = this.fb.group({
            appDt: ['', [Validators.required]],
            cntctMethodCd: ['', [Validators.required]],
            telephoneNum: [''],
            appStatusCd: [''],
            cancelRsnCd: [''],
            addrLine1: [''],
            addrLine2: [''],
            stateCd: [''],
            city: [''],
            zip: [''],
            zipExtsn: [''],
            cnty: ['NA'],
        });
        this.formInitialized = true;
        this.updateFormData();
    }
    getFormData() {
        return this.scheduleIntakeForm.controls;
    }

    getConvertedTimeZone(str){
        if (str) {
            const formstring = str + " "+ "CST";
            return formstring;
          }
    }

    updateAppointmentFunction() {
        this.updateAppointment = true;
        this.getFormData().appStatusCd.setValidators([Validators.required]);
        this.getFormData().appStatusCd.updateValueAndValidity();
        console.log(this.getFormData());
        this.comingFromUpdate = true;
        this.scheduleAppointment();
    }
    updateAppointmentNavigate() {
        this.updateAppointment = true;
        console.log(this.getFormData());
        this.onContactMethodChange(this.scheduleIntakeForm.controls.cntctMethodCd.value || '');
        if(this.getFormData().appStatusCd.value !== 'CA'){
            this.appointmentStatusCancel = false;
        }
        this.scheduleIntakeForm.patchValue(this.scheduleVisit);
        
    }
    cancelAppointmentFunction() {
        this.updateAppointment = true;
        this.getFormData().appStatusCd.patchValue('CA');
        this.getFormData().cancelRsnCd.patchValue(null);
        this.appointmentStatusCancel = true;
    }

    updateFormData() {
        if (this.scheduleVisit && this.scheduleVisit.hasOwnProperty && !this.scheduleVisit.hasOwnProperty('errorCode')) {
            if (this.scheduleVisit !== undefined) {
                this.scheduleIntakeForm.patchValue(this.scheduleVisit);
            }
        }
    }

    trackState(msChange: MatSelectChange) {
        if (msChange.value === 'TN') {
            this.isTN = true;
            this.getFormData().cnty.setValidators([Validators.required]);
        }
        else {
            this.isTN = false;
            this.getFormData().cnty.clearValidators();
            this.getFormData().cnty.patchValue('NA');
            
        }
        this.getFormData().cnty.updateValueAndValidity();
    }

    scheduleAppointment() {
        console.log(this.scheduleIntakeForm.controls);
        this.submitted = true;
        if (this.scheduleIntakeForm.valid) {
            if(!this.comingFromUpdate){
                this.getFormData().appStatusCd.setValue('SC');
            }            

            this.subscription2$ = this.intakeActionsService
                .postScheduleAppointment({
                    ...this.scheduleIntakeForm.value,
                    refId: this.refId,
                    prsnId: this.personId,
                   
                })
                .subscribe((postScheduleAppointmentResponse) => {
                    console.log('success');
                    this.scheduleVisit = postScheduleAppointmentResponse;
                    this.appointmentScheduled = true;
                    this.updateAppointment = false;
                }, err => {
                    console.log('error');
                });
            this.subscriptions.push(this.subscription2$);
        }

    }

    cancelUpdateAppointment() {
        this.updateAppointment = false;
        this.scheduleIntakeForm.patchValue(this.scheduleVisit);
    }

    onAddressOptionChange(value: string) {

        if (value && value === 'OTH') {
            this.otherAddressSelectedSw = true;
            this.getFormData().addrLine1.setValidators([Validators.required, Validators.maxLength(100), Validators.pattern('^[A-Za-z0-9 ]+$')]);
            this.getFormData().addrLine2.setValidators([Validators.maxLength(50), Validators.pattern('^[A-Za-z0-9 ]+$')]);
            this.getFormData().city.setValidators([Validators.required, Validators.maxLength(25), Validators.pattern('^[A-Za-z0-9 ]+$')]);
            this.getFormData().stateCd.setValidators([Validators.required]);
            this.getFormData().zip.setValidators([Validators.required, Validators.pattern('[0-9]{5}')]);
            this.getFormData().zipExtsn.setValidators([Validators.pattern('[0-9]')]);
        } else {
            this.getFormData().addrLine1.clearValidators();
            this.getFormData().addrLine2.clearValidators();
            this.getFormData().city.clearValidators();
            this.getFormData().stateCd.clearValidators();
            this.getFormData().zip.clearValidators();
            this.getFormData().zipExtsn.clearValidators();

            this.otherAddressSelectedSw = false;
            this.addresses = this.addresses.map(a => ({
                ...a, isActive: (() => {
                    return JSON.stringify(a);
                })()
            }));
            console.log("value ", this.addressOutput);
            console.log("Address [] = " + this.addresses[0]);
            if (this.addresses[0]) {
                let that = this;

                console.log("Address line 1 : " + that.getFormData().addrLine1);
                that.getFormData().addrLine1.setValue(this.addresses[0].addrLine1 || "");
                that.getFormData().addrLine2.setValue(this.addresses[0].addrLine2 || "");
                that.getFormData().city.setValue(this.addresses[0].city || "");
                that.getFormData().stateCd.setValue(this.addresses[0].stateCd || "");
                that.getFormData().zip.setValue(this.addresses[0].zip || "");
                that.getFormData().zipExtsn.setValue(this.addresses[0].extsn || "");
                that.getFormData().cnty.setValue(this.addresses[0].county || "");

                console.log("Address line 1 : " + that.getFormData().addrLine1);

                // that.getFormData().addrLine1.clearValidators();
                // that.getFormData().addrLine2.clearValidators();
                // that.getFormData().city.clearValidators();
                // that.getFormData().stateCd.clearValidators();
                // that.getFormData().zip.clearValidators();
                // that.getFormData().zipExtsn.clearValidators();
                // that.getFormData().cnty.clearValidators();

                // that.getFormData().addrLine1.updateValueAndValidity();
                // that.getFormData().addrLine2.updateValueAndValidity();
                // that.getFormData().city.updateValueAndValidity();
                // that.getFormData().stateCd.updateValueAndValidity();
                // that.getFormData().zip.updateValueAndValidity();
                // that.getFormData().zipExtsn.updateValueAndValidity();
                // that.getFormData().cnty.updateValueAndValidity();

                //this.scheduleIntakeForm.setValidators;
            }

        }

        this.getFormData().addrLine1.updateValueAndValidity();
        this.getFormData().addrLine2.updateValueAndValidity();
        this.getFormData().city.updateValueAndValidity();
        this.getFormData().stateCd.updateValueAndValidity();
        this.getFormData().zip.updateValueAndValidity();
        this.getFormData().zipExtsn.updateValueAndValidity();
        this.getFormData().cnty.updateValueAndValidity();
    }

    onContactMethodChange(value: string) {
        if (value && value === 'IP') {
            this.contactMethodOptionValue = true;
        } else {
            this.contactMethodOptionValue = false;
        }
        if (value && value === 'TE') {
            this.showTelNumber = true;
            this.getFormData().telephoneNum.setValidators([Validators.required]);
        } else {
            this.showTelNumber = false;
            this.getFormData().telephoneNum.clearValidators();
        }
        this.getFormData().telephoneNum.updateValueAndValidity();
    }

    onAppointmentStatusChange(value){
        if (value && value === 'CA') {
            this.appointmentStatusCancel = true;
            this.getFormData().cancelRsnCd.setValidators([Validators.required]);
            this.getFormData().cancelRsnCd.updateValueAndValidity();
        } else {
            this.appointmentStatusCancel = false;

            this.getFormData().cancelRsnCd.clearValidators();
            this.getFormData().cancelRsnCd.updateValueAndValidity();
        }
    }
    scheduleIntakeData() {
        this.subscription1$ = this.intakeActionsService
            .getIntakeActionsScheduleVisit(this.refId)
            .subscribe((scheduleVisitResponse) => {
                if (scheduleVisitResponse !== null) {
                    if (scheduleVisitResponse !== undefined) {
                        this.scheduleVisit = scheduleVisitResponse;
                        console.log(this.scheduleVisit);
                        if (!scheduleVisitResponse.hasOwnProperty('errorCode')) {
                            if (scheduleVisitResponse.flag && scheduleVisitResponse.flag === 'Y') {
                                this.appointmentScheduled = true;
                                this.updateAppointment = false;
                                this.initializeForm();
                                //this.disableScheduleVisitButton = true;
                            } else {
                                this.appointmentScheduled = false;
                                this.updateAppointment = false;
                                this.initializeForm();
                            }

                            if (this.referralService.getUserTypeCd()
                                && (this.referralService.getUserTypeCd() === 'NRS'
                                    || this.referralService.getUserTypeCd() === 'IRC')) {
                                this.disableScheduleVisitDiv = true;
                            }
                        }
                    }
                    // call address service here and set address needed.
                }
                if (scheduleVisitResponse === null) {
                    this.initializeForm();
                }

            }, err => {
                this.appointmentScheduled = false;
                this.updateAppointment = false;
                this.initializeForm();
            });
        this.subscriptions.push(this.subscription1$);
    }

    getUniqueAddressess() {
        this.initializeForm();
        this.refId = this.referralService.getRefId();
        this.personId = this.referralService.getPersonId() || this.referralService.getRowElement().personId;


        this.subscription3$ = this.intakeActionsService
            .getUniqueAddressList(this.refId, this.personId)
            .subscribe((uniqueAddressResponse) => {
                if (uniqueAddressResponse) {
                    this.addresses = uniqueAddressResponse;
                    console.log("Address Service Returned : " + this.addresses);

                    if (!uniqueAddressResponse.hasOwnProperty('errorCode')) {
                        console.log("Address Service Returned : " + this.addresses);
                    }
                }
            }, err => {
                console.log("Error in Address Service Returned : ");
            });
        this.subscriptions.push(this.subscription3$);
    }

    ngOnDestroy() {
        this.subscriptions.forEach((subscription) => subscription.unsubscribe());
        console.log('Unsubscribed');
    }
}
