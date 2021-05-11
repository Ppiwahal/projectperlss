import { Component, HostListener, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {Form, FormBuilder, FormControl, FormGroup,Validators,FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import * as customValidation from '../../_shared/constants/validation.constants';
import { MatRadioChange, MatRadioButton  } from '@angular/material/radio';
import { CustomvalidationService } from '../../_shared/utility/customvalidation.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { PaeAppointment } from '../../_shared/model/PaeAppointment'
import { PaeAppointmentSearch } from '../../_shared/model/PaeAppointmentSearch'
import { PaeService } from '../../core/services/pae/pae.service'
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SavePopupComponent } from 'src/app/savePopup/savePopup.component';
import { PaeCommonService } from './../../core/services/pae/pae-common/pae-common.service';
import { Observable } from 'rxjs';
import { ComponentCanDeactivate } from 'src/app/core/helpers/pending-change.guard';
import { MatSelectChange } from '@angular/material/select';
import * as Constants from '../../_shared/constants/application.constants';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-pae-appointment',
  templateUrl: './pae-appointment.component.html',
  styleUrls: ['./pae-appointment.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class PaeAppointmentComponent implements OnInit, ComponentCanDeactivate {
  pageId: string = 'PPPAD';
  startDate = new Date();
  paeFormGroup: FormGroup;
  customValidation = customValidation;
  expandedElement: PaeAppointmentSearch | null;
  paeAppointmentSearchRes: string[] = ['appointmentDt', 'typeOfContact', 'contactMethodCd', 'appoinementStatus',
  'contactUser'];
  columnHeaderName: {[key: string]: string} = {};
  dataSource: PaeAppointmentSearch[] = []
  contactWithPersons: string[] = ['Yes', 'No'];
  contactMethodOptions : any;
  appointmentForGroupOptions : any;
  applicantName: any;
  isSamePageNavigation: boolean;
  stateList = 
  [{ code: 'TN', value: 'Tennessee', activateSW: 'Y' },
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
  { code: 'VI', value: 'Virgin Islands', activateSW: 'Y' }
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
  isTN = false;
  personId;
  paeId;

  constructor(
    fb: FormBuilder, 
    private dialog:MatDialog,
    private customValidationService: CustomvalidationService,
    private paeCommonService: PaeCommonService,
    private router:Router,
      private paeService: PaeService
      ) {
    this.paeFormGroup = fb.group({
      hadContactWithPerson: [null,[Validators.required]],
      appointmentDate: [''],
      appointmentStartTime: ['',[Validators.required]],
      contactMethod: ['',[Validators.required]],
      applicantCellPhNum: [''],
      appointmentForGroup:  ['test'],
      addressAvailable: ['',[Validators.required]],
      addressLineOne: ['',[Validators.required, this.customValidationService.specialCharacterValidator(), Validators.maxLength(100)]],
      addressLineTwo: ['', [Validators.required, this.customValidationService.specialCharacterValidator(), Validators.maxLength(100)]],
      ext: ['', [this.customValidationService.specialCharacterValidator(), Validators.max(9999)]],
      cityName: ['',[Validators.required, Validators.pattern('^[a-zA-Z \-\']+'), this.customValidationService.specialCharacterValidator()]],
      stateName: ['TN',[Validators.required]],
      countryName: ['',[Validators.required]],
      zipCode: ['',[Validators.required, this.customValidationService.postalCodeValidator()]]
    });
  }
ngOnInit() {
  const timeTravelData = localStorage.getItem('TIME_TRAVEL_DATA');
  if(timeTravelData) {
    const timeTravelDataJson = JSON.parse(CryptoJS.AES.decrypt(timeTravelData, Constants.APP_ENC_DECRYPT_KEY).toString(CryptoJS.enc.Utf8));
    console.log("timeTravelDataJson ", timeTravelDataJson);
    if(timeTravelDataJson.timeTravelFlag && timeTravelDataJson.currentDate) {
      this.startDate = new Date(timeTravelDataJson.currentDate);
    }
  }
  this.paeId = this.paeCommonService.getPaeId();
  this.personId = this.paeCommonService.getPersonId();
  if (this.paeCommonService.getApplicantName() === null || this.paeCommonService.getApplicantName() === '' || this.paeCommonService.getApplicantName() === undefined){
		this.getApplicantName();
	} else {
		this.applicantName =  this.paeCommonService.getApplicantName();
	}
  // this.getPaeAppoinement(); 
  // this.getApplicantAddress();
  this.getContactMethod();
  this.getAppointmentForGroupMethod();
  this.columnHeaderName = {appointmentDt: 'Appointment Date', typeOfContact: 'Type Of Contact', contactMethodCd: 'Contact Method', appoinementStatus: 'Appointment Status', contactUser: 'Contact User'};
}
setTelephoneValidater(val) {
  if(val === "TE"){
    this.paeFormGroup.get('applicantCellPhNum').setValidators(Validators.required);
  }
  else {
    this.paeFormGroup.get('applicantCellPhNum').clearValidators();
  }
}
trackState(msChange: MatSelectChange) {
  if (msChange.value === 'TN') {
    this.isTN = true;
    this.getFormData.cntyCd.setValidators([Validators.required]);
  }
  else {
    this.isTN = false;
    this.getFormData.cntyCd.clearValidators();
    this.getFormData.cntyCd.patchValue('NA');
  }
  this.getFormData.cntyCd.updateValueAndValidity();
}

get getFormData() {
  return this.paeFormGroup.controls;
}
getApplicantName(){
  this.paeService.getPaeApplicantInformation(this.paeCommonService.getPaeId(),this.pageId).then((response)=> {
    console.log("reponseforName"+JSON.stringify(response.body.firstName));
    this.applicantName =  response.body.firstName+" "+response.body.lastName;
	this.paeCommonService.setApplicantName(this.applicantName);
  });
}

clearAddress(){
  this.paeFormGroup.get('addressLineOne').patchValue('');
}

savePae(showPopup?:boolean){
  this.isSamePageNavigation =  true;
  this.markFormGroupTouched(this.paeFormGroup);
  if(this.paeFormGroup.valid) {
      const formValue = this.paeFormGroup.value;
      const paeAppointmentValue: PaeAppointment = {
        addrLine1: formValue.addressLineOne,
        addrLine2: formValue.addressLineTwo,
        city: formValue.cityName,
        countyCd: formValue.countryName,
        extsn: formValue.ext,
        stateCd: formValue.stateName,
        zip: formValue.zipCode,
        appDt: formValue.appointmentDate,
        cntctMethodCd: formValue.contactMethod,
        paeId: this.paeId,
        prsnId: this.personId,
        reqPageId: this.pageId,
        telephoneNum: formValue.applicantCellPhNum,
        appGroupCd: formValue.appointmentForGroup,
        id: 0,
        appTypeCd: "",
        appStatusCd: "",
        auditDt: "",
        cancelRsnCd: "",
        cntctPrsnSw: "",
        contactUser: "",
        locOrNumber: "",
        updateUserId : ""
      }
      console.log("test", paeAppointmentValue)
      this.paeService.savePae(paeAppointmentValue).then(response=> {
      console.log(response);
      if(showPopup){
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = { route: 'ltss/pae' };
       // dialogConfig.data = { route: 'ltss/pae' , nextRoute: '/ltss/pae/paeStart/' + this.nextPath };
        dialogConfig.panelClass = 'exp_popup';
        dialogConfig.width = '648px';
        dialogConfig.height = '360px';  
        this.dialog.open(SavePopupComponent, dialogConfig );
      }
      ///
      })
  }
} 

saveAndExit(){
    this.savePae(true) 
}
// getApplicantAddress() {
//   this.paeService.getApplicantAddress(this.personId).then((response)=> {
//     console.log('address',response)
//     //TODO: Logic to set applicant address
//   })
// } 

getPaeAppoinement() { 
  this.paeService.getPaeAppoinement(this.paeId).then((response)=> {
    this.dataSource = response.body;
    console.log('getPaeAppoinement : ' + JSON.stringify(this.dataSource));
  })
} 

getContactMethod() {
    this.paeService.getFieldsByTableName('CONTACT_METHOD').subscribe(response=> {
      this.contactMethodOptions = response;
      // console.log('contactMethod response : ' + JSON.stringify(this.contactMethodOptions))
    })
}

getAppointmentForGroupMethod() {
    this.paeService.getFieldsByTableName('APPOINTMENT_GROUP').subscribe(response=> {
      this.appointmentForGroupOptions = response;
      console.log('appointmentForGroupOptions response : ' + JSON.stringify(this.appointmentForGroupOptions))
    })
}

goNext() {
  this.markFormGroupTouched(this.paeFormGroup);
}
back(){
  //this.markFormGroupTouched(this.paeFormGroup);
  this.isSamePageNavigation =  true;
  this.router.navigate(['/ltss/pae/paeStart/livingArrangement']);
}


get hadContactWithPerson() {
  return this.paeFormGroup.get('hadContactWithPerson');
}



markFormGroupTouched = (formGroup) => {
  (<any>Object).values(formGroup.controls).forEach(control => {
    control.markAsTouched();

    if (control.controls) {
      this.markFormGroupTouched(control);
    }
  });
};

Change(event: MatRadioChange){

  if(event.value == true){
    this.getFormData.appointmentDate.setValidators([Validators.required, this.customValidationService.datePriorToInitialDate(), this.customValidationService.dateInFuture()])
  }else if(event.value == false){
    this.getFormData.appointmentDate.setValidators([Validators.required, this.customValidationService.datePriorToInitialDate(), this.customValidationService.dateInPastExcludingToday()])
  }
  this.getFormData.appointmentDate.updateValueAndValidity();
}
@HostListener('window:beforeunload')
   canDeactivate(): Observable<boolean> | boolean {
    return  this.isSamePageNavigation ? true : !this.paeFormGroup.dirty;
   }

   resetForm(){
    this.paeFormGroup.reset();
  }
 
}