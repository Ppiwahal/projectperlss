import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { CustomvalidationService } from './../../_shared/utility/customvalidation.service';
import { PaeSisInformantService } from './../../core/services/pae/pae-sis-informant/pae-sis-informant.service';
import { PaeCommonService } from './../../core/services/pae/pae-common/pae-common.service';
import { PaeService } from './../../core/services/pae/pae.service';
import * as customValidation from '../../_shared/constants/validation.constants';
import { ReferralService } from 'src/app/core/services/referral/referral.service';
@Component({
  selector: 'app-pae-sis-informant',
  templateUrl: './pae-sis-informant.component.html',
  styleUrls: ['./pae-sis-informant.component.scss']
})
export class PaeSisInformantComponent implements OnInit {

  relationShipCdList = [
    {code: 'AUN', description: 'Aunt', activateSW:'Y'},
    {code: 'BRO', description: 'Brother', activateSW:'Y'},
    {code: 'DAU', description: 'Daughter', activateSW:'Y'},
    {code: 'FAO', description: 'Father', activateSW:'Y'},
    {code: 'FCO', description: 'First cousin', activateSW:'Y'},
    {code: 'GDO', description: 'Granddaughter', activateSW:'Y'},
    {code: 'GFO', description: 'Grandfather', activateSW:'Y'},
    {code: 'GMO', description: 'Grandmother', activateSW:'Y'},
    {code: 'MOO', description: 'Mother', activateSW:'Y'},
    {code: 'NEP', description: 'Nephew', activateSW:'Y'},
    {code: 'NIE', description: 'Niece', activateSW:'Y'},
    {code: 'NRT', description: 'Not related', activateSW:'Y'},
    {code: 'SON', description: 'Son', activateSW:'Y'},
    {code: 'SBR', description: 'Stepbrother', activateSW:'Y'},
    {code: 'SDA', description: 'Stepdaughter', activateSW:'Y'},
    {code: 'SFA', description: 'Stepfather', activateSW:'Y'},
    {code: 'SPO', description: 'Spouse', activateSW:'Y'},
    {code: 'SMO', description: 'Stepmother', activateSW:'Y'},
    {code: 'SSI', description: 'Stepsister', activateSW:'Y'},
    {code: 'SSO', description: 'Stepson', activateSW:'Y'},
    {code: 'UNC', description: 'Uncle', activateSW:'Y'},
    {code: 'RIO', description: 'Relted in another way', activateSW:'Y'},
    {code: 'SIS', description: 'Sister', activateSW:'Y'},
    {code: 'GSO', description: 'Grandson', activateSW:'Y'},
    {code: 'HOS', description: 'Holding out spouse', activateSW:'Y'},
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

  safetyAttestations = [
    { selected: false, text: 'I do NOT believe this individual can be safely served in the community in CHOICES Group 5.', name: 'donotBelieveSw' },
    { selected: false, text: 'I believe this individual CAN be safely served in the community in CHOICES Group 5.', name: 'doBelieveSw' },
    { selected: false, text: 'This safety determination form was completed at the request of the applicant / representative.', name: 'reqApplcntSw' },
  ];

  dataSource: any = [];
  filteredData: any = [];
  uniqueCredentialsArray: any = [];
  subscriptions: Subscription[] = [];
  subscription1$: Subscription;
  subscription2$: Subscription;
  sisInformantData: any;
  paeId: any;
  sisInformantForm : FormGroup;
  paeSisInformantFormVO: FormArray;
  isNoInformant = true;
  qualifiedAssessorNameMap = new Map();
  customValidation = customValidation;
  refId: string;
  reqPageId = 'PAESP';

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<PaeSisInformantComponent>,
    private fb: FormBuilder,
    private paeService: PaeService,
    private paeCommonService: PaeCommonService,
    private paeSisInformantService : PaeSisInformantService,
    private customValidator: CustomvalidationService,
    private referralService: ReferralService
  ) { }

  ngOnInit(): void {
    this.paeId = this.paeCommonService.getPaeId();
    this.reqPageId = this.paeSisInformantService.getRequestpageId();
    // this.refId = this.referralService.getRefId();
    this.sisInformantForm = this.fb.group({
     paeId: this.paeId,
    // refId: this.refId,
    addInfoDesc: '',
    // credentialsCd: '',
    // qualifiedAssessorId: '',
    // qualifiedAssessorName: '',
    paeSisInformantFormVO: this.fb.array ([]),
    reqPageId: this.reqPageId

    });

    this.addInformantIndex();
    this.getSisInformantRequestData();

  }

  newSisInformants(row): FormGroup {
    return this.fb.group ({
      informantLable: row.informantLable,
      reqPageId: 'PAESP',
      paeId: this.paeId,
      alternatePhNum: '',
      infrmntCntyCd: [
        '',
        [
          Validators.required,
        ],
      ],
      infrmtCntyCd: '',
      infrmtEmail: [
        '',
        [
          Validators.required,
          this.customValidator.emailValidator(),
        ],
      ],
      infrmtFullName: [
        '',
        [
          Validators.required,
          this.customValidator.nameValidator(),
        ],
      ],
      infrmtKnownDurationCd: [
        '',
        [
          Validators.required,
        ],
      ],
      prefPhNum: [
        '',
        [
          Validators.required,
          this.customValidator.phonenumberValidator(),
        ],
      ],
      relationToAplcntCd: [
        '',
        [
          Validators.required,
        ],
      ]
    })
  }

  addInformantIndex() {
    let informantName;
    for(let i=0; i<3; i++){
    if(i==0){
      informantName = "First Informant"
    }
    else if(i==1){
      informantName = "Second Informant"
    }
    else if(i==2){
      informantName = "Third Informant"
    }
    this.addInformants({
      informantLable: informantName,
      reqPageId: this.reqPageId,
      paeId: this.paeId,
      alternatePhNum: '',
      infrmntCntyCd: '',
      infrmtCntyCd: '',
      infrmtEmail: '',
      infrmtFullName: '',
      infrmtKnownDurationCd: '',
      prefPhNum: '',
      relationToAplcntCd: ''
    });
  }
  }

  //Add Informants
  addInformants(row) {
    const addNewSisInformant =  this.sisInformantForm.controls.paeSisInformantFormVO as FormArray
    addNewSisInformant.push(this.newSisInformants(row));
  }

  trackFn(index) {
    return index;
  }

  informantAvailable(){
    this.isNoInformant = false;
  }

  getFormData() {
    return this.sisInformantForm.controls;
  }

  getInformantFormData() {
    return this.sisInformantForm.controls.paeSisInformantFormVO['controls'];
  }
  // getSafetyDeterminationForm() {
  //   const localStorageLocal = localStorage.getItem('APP_STORAGE_TOKEN');
  //   const entityId = JSON.parse(localStorageLocal).entityId;
  //   const that = this;
  //   const getQualifier = this.paeService.getQualifierInfo(entityId);
  //   getQualifier.then(function (getQualifier: HttpResponse<any>) {
  //     console.log("getQualifier Info===>" + JSON.stringify(getQualifier));
  //     that.dataSource = getQualifier.body;
  //     console.log(JSON.stringify(getQualifier.body));
  //     const key = 'credentialsCd';
  //     that.uniqueCredentialsArray = [...new Map(getQualifier.body.map(item =>
  //       [item[key], item])).values()];
  //     console.log(that.uniqueCredentialsArray);

	//   that.qualifiedAssessorNameMap.clear();
	// 	for(const data of that.dataSource){
	// 		that.qualifiedAssessorNameMap.set(data.assessorId, data.firstName + " " + data.lastName);
	// 	}


	//   const resp = that.paeService.getSafetyDeterminationForm(that.paeCommonService.getPaeId());
	//   resp.then(function(resp: HttpResponse<any>) {
  //     console.log("response===>" + JSON.stringify(resp));
  //     that.sisInformantForm.patchValue(resp);

	//   for(const items of that.safetyAttestations)
	// 	{

	// 		if(items.name==='doBelieveSw'){
	// 			if(that.getFormData().doBelieveSw.value==='Y'){
	// 				items.selected=true;
	// 			}
	// 		}
	// 		if(items.name==='donotBelieveSw'){
	// 			if(that.getFormData().donotBelieveSw.value==='Y'){
	// 				items.selected=true;
	// 			}
	// 		}
	// 		if(items.name==='reqApplcntSw'){
	// 			if(that.getFormData().reqApplcntSw.value==='Y'){
	// 				items.selected=true;
	// 			}
	// 		}

	// 	}

	// 	that.credChanged(that.getFormData().credentialsCd.value);
	// 	that.getFormData().qualifiedAssessorName.patchValue(that.getFormData().qualifiedAssessorId.value);

  //   });
  //   });
  // }

  // credChanged(value) {
  //   this.filteredData = [];
  //   this.filteredData = this.dataSource.filter(item => item.credentialsCd === value);
	// console.log(this.filteredData);
  // }

  getSisInformantRequestData() {
    this.paeSisInformantService
    .getSisInformantRequest(this.paeId)
    .subscribe((getSisInformantData) => {
      this.sisInformantData = getSisInformantData;
      console.log("sis informant requesrt", this.sisInformantData);
      this.sisInformantForm.patchValue(this.sisInformantData);
    });

  }

  saveSisInformantRequest() {
    console.log("post request", this.sisInformantForm.value);
    this.paeSisInformantService
    .addSisInformantRequest(this.sisInformantForm.value)
    .subscribe((postSisInformantData) => {
      this.sisInformantData = postSisInformantData;
      this.dialogRef.close({isUploaded: true});
      console.log("sis informant requesrt", this.sisInformantData);
    })
  }

  close() {
    this.dialogRef.close({isUploaded: false});
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    console.log('sis Informant form pop up Unsubscribed');
  }

}
