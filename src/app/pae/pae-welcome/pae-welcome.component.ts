import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder,  FormGroup, Validators } from '@angular/forms';
import { PaeService } from '../../core/services/pae/pae.service';
import { Router } from '@angular/router';
import {  HttpResponse } from '@angular/common/http/';
import * as customValidation from '../../_shared/constants/validation.constants';
import { CustomvalidationService } from '../../_shared/utility/customvalidation.service';
import { RightnavToggleService } from '../../_shared/services/rightnav-toggle.service';
import { PaeCommonService } from 'src/app/core/services/pae/pae-common/pae-common.service';
import { Subscription } from 'rxjs';
import { PaeFlowSeq } from '../../_shared/utility/PaeFlowSeq';
import { PaeAction } from 'src/app/_shared/model/PaeAction';

@Component({
  selector: 'app-pae-welcome',
  templateUrl: './pae-welcome.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./pae-welcome.component.scss'],
})
export class PaeWelcomeComponent implements OnInit {

  customValidation = customValidation;
  PaeWelcomeForm: FormGroup;
  nextClicked: boolean;
  statusAction: string = null;
  showWaiting = false;
  submitted = false;
  showResult = false;
  statusIsBlueCare = true;
  statusSsi: string;
  statusHasECFReferral = false;
  statusExtension: boolean;
  statusHasKBRef = false;
  closureComments = '';
  error: string;
  safetyEvaluationDueDate = '06/16/2012';
  f: any;
  applicantDataJson: string;
  enrolmntGrp: any;
  sltTypeCd: any;
  joinEnrGrpnSltType: any;
  displayedSlot: any;
  applicantData: Array<any>;
  mapForRefStatus = new Map();
  mapForRefSource = new Map();
  mapForSlotStatus = new Map();
  mapForSlotType = new Map();
  dataMap: any = {
    applicant: [
      ['APPLICANT NAME', 'applicantVO.firstName|lastName|midInitial'], ['PAE ID', 'paeVO.paeId'],
      ['PERSON ID', 'paeVO.prsnId'], ['PAST DUE DATE', 'paeVO.dueDt', 'date'],
      ['DATE OF BIRTH', 'applicantVO.dobDt', 'date'], ['PAE STATUS', 'paeVO.statusCd'],
      ['SSN', 'applicantVO.ssn'], ['REASSESSMENT DUE DATE', 'paeVO.reassessmentDueDt', 'date'],
      ['ASSIGNED ENTITY', 'paeVO.assignedEntity'], ['ASSIGNED USER', 'paeVO.assignedUserId']
    ],
    referralData: {
      base: [
        ['REFERRAL RECEIVED DATE', 'refReqVO.submissionDt', 'date'], ['REFERRAL ID', 'refReqVO.refId'],
        ['REFERRAL SOURCE', 'refReqVO.sourceCd'], ['REFERRAL STATUS', 'refReqVO.refStatus'],
      ],
      kbReferral: [
        ['PART B ASSESSMENT STATUS', ''], ['PART A ASSESSMENT STATUS', ''],
        ['PART B SLOT STATUS', ''], ['PART A SLOT STATUS', ''],
        ['PART B DATE HELD', ''], ['PART A DATE HELD', ''],
        ['PART B DATE FILLED', '', 'date'], ['PART A DATE FILLED', '', 'date']
      ],
      ecfReferral: [
        ['ECF SLOT TYPE', 'slotMaterVO.sltTypeCd'], ['DATE HELD', 'slotDetailsVO.sltHeldDate', 'date'],
        ['ECF SLOT STATUS', 'slotDetailsVO.sltStatusCd'], ['DATE FILLED', '', 'date']
      ]
    }
  };
  showSubmitButton = false;

  refStatusList = [
    {code: 'PS', value:'Pending Submission',activateSW:'Y'},
    {code: 'NW', value:'New',activateSW:'Y'},
    {code: 'IN', value:'Intake',activateSW:'Y'},
    {code: 'RR', value:'Request for Reassignment',activateSW:'Y'},
    {code: 'NR', value:'Nurse Review',activateSW:'Y'},
    {code: 'IA', value:'IARC Review',activateSW:'Y'},
    {code: 'IR', value:'Information Requested',activateSW:'Y'},
    {code: 'SA', value:'Pending Slot Assignment',activateSW:'Y'},
    {code: 'RL', value:'On Referral List',activateSW:'Y'},
    {code: 'PE', value:'Pending PAE',activateSW:'Y'},
    {code: 'TP', value:'TP Denied',activateSW:'Y'},
    {code: 'CP', value:'Complete',activateSW:'Y'},
    {code: 'EN', value:'Ended',activateSW:'Y'},
    {code: 'UC', value:'Unable to Contact',activateSW:'Y'},
    {code: 'IE', value:'Intake Ended by Applicant Request',activateSW:'Y'},
    {code: 'RE', value:'To be Removed from Referral List',activateSW:'Y'},
    {code: 'CL', value:'Closed',activateSW:'Y'},
    {code: 'EN', value:'Ended',activateSW:'Y'},
    {code: 'IT', value:'Ended - Initiate Transition',activateSW:'Y'}
  ];

  refSourceList = [
    { code: 'MP', value: 'Member Portal', activateSW: 'Y'},
    { code: 'PER', value: 'PERLSS', activateSW: 'Y'},
    { code: 'EXT', value: 'External', activateSW: 'Y'}
  ];

  slotStatusList = [
    {code: 'PEV', value:'Pending Evaluation',activateSW:'Y'},
    {code: 'UNA', value:'Unallocated',activateSW:'Y'},
    {code: 'EXC', value:'Exception',activateSW:'Y'},
    {code: 'MIP', value:'Match In Progress',activateSW:'Y'},
    {code: 'AVA', value:'Available',activateSW:'Y'},
    {code: 'HEL', value:'Held',activateSW:'Y'},
    {code: 'FIL', value:'Filled',activateSW:'Y'},
    {code: 'TIP', value:'Internal Transition In Progress',activateSW:'Y'},
    {code: 'ETR', value:'External Transition Requested',activateSW:'Y'},
    {code: 'ETC', value:'External Transition Complete',activateSW:'Y'},
    {code: 'POC', value:'Pending Over Capacity',activateSW:'Y'},
    {code: 'EOC', value:'Enrolled Over Capacity',activateSW:'Y'},
    {code: 'REL', value:'Released',activateSW:'Y'},
    {code: 'VAC', value:'Vacated',activateSW:'Y'},
    {code: 'WAI', value:'On Waiting List',activateSW:'Y'},
    {code: 'RRL', value:'Removed from Referral List',activateSW:'Y'},
    {code: 'REF', value:'On Referral List',activateSW:'Y'}
  ];

  slotTypeList = [
    {code: 'RC', ENR_GROUP:'EC4', value:'ECF CHOICES 4 - Reserve Capacity', activateSW:'Y'},
    {code: 'PG', ENR_GROUP:'EC4', value:'ECF CHOICES 4 - Priority Group', activateSW:'Y'},
    {code: 'AC', ENR_GROUP:'EC4', value:'ECF CHOICES 4 - DD Aged Caregiver', activateSW:'Y'},
    {code: 'RC', ENR_GROUP:'EC5', value:'ECF CHOICES 5 - Reserve Capacity', activateSW:'Y'},
    {code: 'PG', ENR_GROUP:'EC5', value:'ECF CHOICES 5 - Priority Group', activateSW:'Y'},
    {code: 'AC', ENR_GROUP:'EC5', value:'ECF CHOICES 5 - DD Aged Caregiver', activateSW:'Y'},
    {code: 'RC', ENR_GROUP:'EC6', value:'ECF CHOICES 6 - Reserve Capacity', activateSW:'Y'},
    {code: 'PG', ENR_GROUP:'EC6', value:'ECF CHOICES 6 - Priority Group', activateSW:'Y'},
    {code: 'AC', ENR_GROUP:'EC6', value:'ECF CHOICES 6 - DD Aged Caregiver', activateSW:'Y'},
    {code: 'RC', ENR_GROUP:'EC7', value:'ECF CHOICES 7 - Reserve Capacity', activateSW:'Y'},
    {code: 'RC', ENR_GROUP:'EC8', value:'ECF CHOICES 8 - Reserve Capacity', activateSW:'Y'},
    {code: 'KBA', ENR_GROUP:'KBA', value:'Katie Beckett Part A', activateSW:'Y'},
    {code: 'KBB', ENR_GROUP:'KBB', value:'Katie Beckett Part B', activateSW:'Y'}
  ];

  masterPaeActionDropdownList = [
    {code: 'SUB', value:'PAE Submission', activateSW:'Y'},
    {code: 'CHG', value:'Change PAE', activateSW:'Y'},
    {code: 'CLS', value:'Close Referral ', activateSW:'Y'},
    {code: 'REV', value:'Review PAE', activateSW:'Y'},
    {code: 'RVS', value:'Revise PAE', activateSW:'Y'},
    {code: 'CER', value:'Recertify PAE', activateSW:'Y'},
    {code: 'EXT', value:'Add/Extend ERC', activateSW:'Y'},
    {code: 'MOP', value:'Add MOPD', activateSW:'Y'},
    {code: 'SEV', value:'Safety Evaluation', activateSW:'Y'},
    {code: 'SSI', value:'Add SSI Application Status', activateSW:'Y'},
    {code: 'TMD', value:'TMED Record', activateSW:'Y'},
    {code: 'SIS', value:'Add SIS Assessment', activateSW:'Y'},
    {code: 'EDT', value:'LTSS Edits', activateSW:'Y'},
    {code: 'LOC', value:'LOC Reassessment', activateSW:'Y'},
    {code: 'UPD', value:'Update Prioritization', activateSW:'Y'},
    {code: 'CST', value:'Add Cost of Care', activateSW:'Y'},
    {code: 'DSR', value:'Disenroll', activateSW:'Y'},
    {code: 'GRP', value:'Add Group 3 Interest', activateSW:'Y'},
    {code: 'CEA', value:'Add CEA Interest', activateSW:'Y'}
    ];

    PAE_ACTION_ROUTING = [
      {code: 'CHG', routingPath: '/ltss/pae/paeStart/paeReviewSubmit'},
      {code: 'CLS', routingPath: '/ltss/pae'},
      {code: 'REV', routingPath: '/ltss/pae/paeStart/paeReviewSubmit'},
      {code: 'RVS', routingPath: '/ltss/pae/paeStart/paeReviewSubmit'},
      {code: 'CER', routingPath: '/ltss/pae/paeStart/paeReviewSubmit'},
      {code: 'EXT', routingPath: '/ltss/pae/paeStart/paeReviewSubmit'},
      {code: 'MOP', routingPath: '/ltss/pae/paeStart/paeReviewSubmit'},
      {code: 'SSI', routingPath: ''},
      {code: 'TMD', routingPath: '/ltss/pae/paeStart/applicantInformation'},
      {code: 'SIS', routingPath: '/ltss/pae/paeStart/paeReviewSubmit'},
      {code: 'EDT', routingPath: '/ltss/pae/paeStart/paeReviewSubmit'},
      {code: 'LOC', routingPath: ''},
      {code: 'UPD', routingPath: '/ltss/pae/paeStart/paeReviewSubmit'},
      {code: 'CST', routingPath: '/ltss/pae'},
      {code: 'DSR', routingPath: '/ltss/pae/paeStart/LOCDetermination'},
      {code: 'GRP', routingPath: '/ltss/pae/paeStart/paeReviewSubmit'},
      {code: 'CEA', routingPath: '/ltss/pae/paeStart/paeReviewSubmit'}
      ];

    dropDownRoutingMap = new Map();

  menuItemsToDisplay = [];
  elementRow: any;


  constructor(
    private fb: FormBuilder,
    private paeService: PaeService,
    private router: Router,
    private customValidator: CustomvalidationService,
    private paeCommonService: PaeCommonService,
    private rightnavToggleService: RightnavToggleService
  ) {
    this.elementRow = this.paeCommonService.getRowElement();
  }
  paeId: any;
  refId: any;
  taskId: any;
  taskIdVal: any;
  paeStatus: any;
  programCode: any;
  assignedUserId: any;
  paeAvailable: any;
  lastThirty: any ;
  paeActionDropDownFilterList: any;
  lastModifiedDate: any;
  county: any;
  age: any;
  currentLivingCd: any;
  nextPageId: any;
  localStorageLocal = localStorage.getItem('APP_STORAGE_TOKEN');
  userId = JSON.parse(this.localStorageLocal).userName;
  entityId = JSON.parse(this.localStorageLocal).entityId;

  // Subscriptions
  subscription1$: Subscription;
  subscriptions: Subscription[] = [];


  ngOnInit(): void {
    for (const refStat of this.refStatusList) {
      this.mapForRefStatus.set(refStat.code, refStat.value);
    }
    for (const refSourc of this.refSourceList) {
      this.mapForRefSource.set(refSourc.code, refSourc.value);
    }
    for (const slotStat of this.slotStatusList) {
      this.mapForSlotStatus.set(slotStat.code, slotStat.value);
    }
    for (const slotTyp of this.slotTypeList) {
      this.mapForSlotType.set(slotTyp.code+slotTyp.ENR_GROUP, slotTyp.value);
    }
    console.log(this.elementRow);
    this.paeId = this.elementRow.paeId;
    this.refId = this.elementRow.refId;
    this.taskId = this.elementRow.taskQueue;
	if(this.elementRow.taskId!==null && this.elementRow.taskId!==undefined){
		this.taskIdVal = this.elementRow.taskId;
	}
    if (this.paeId !== undefined && this.paeId !== null && this.paeId !== '') {
      this.paeAvailable = 'available';
      this.getByPaeId();
    }
    else{
      this.getByRefId();
    }

    this.paeStatus = this.elementRow.paeStatus;
    this.programCode = this.paeCommonService.getProgramCd();
    
    this.assignedUserId = this.elementRow.assignedUserId;
    this.showSubmitButton = this.programCode === 'KB';
    this.lastThirty = this.elementRow.peaRqstLastModifiedDt;
    // this.entityId = this.elementRow.entityId;

    if ( this.taskId === 7 || this.taskId === 21) {
      this.statusHasECFReferral = true;
    }
    if ( this.taskId === 21) {
      this.statusHasKBRef = true;
    }

    for (const dropDowns of this.PAE_ACTION_ROUTING) {
      this.dropDownRoutingMap.set(dropDowns.code, dropDowns.routingPath);
    }
    if (this.assignedUserId == null || this.assignedUserId === undefined){
      this.assignedUserId = this.userId;
    }
    if (this.paeId == null || this.paeId === undefined) {
      this.paeId = '';
    }
    console.log("Last thirt value"+this.lastThirty);
    if (this.lastThirty !== null && this.lastThirty !== undefined) {
      const today = new Date();
      this.lastThirty = new Date(this.lastThirty);
      let difference = Math.abs(this.lastThirty.getTime() - today.getTime());
      difference = difference / (1000 * 60 * 60 * 24);
      difference = Math.round(difference);
      console.log(difference);
      if (difference < 30) {
        this.lastThirty = 'yes';
      }
      else {
        this.lastThirty = 'no';
      }
      console.log(this.lastThirty);
    }else {
      this.lastThirty = 'no';
    }
    if (this.taskId === null || this.taskId === undefined) {
      this.taskId = '';
      this.assignedUserId = this.userId;
    }
    if (this.paeStatus === null || this.paeStatus === undefined) {
      this.paeStatus = '';
    }
    if (this.programCode === null || this.programCode === undefined) {
      this.programCode = '';
    }


    console.log(this.paeActionDropDownFilterList);

    this.PaeWelcomeForm = this.fb.group({
      paeActionCd: ['', [Validators.required]],
      safetyEval: [''],
      ssiStatus: [''],
      requestExtension: [''],
      statusAverageCostOfCare: [''],
      closureReason: [''],
      closureComments: [''],
      closureAttest:  ['']
    });

    this.f = this.getControls();
    this.statusHasKBRef = false;

    this.filterDropDown();

  }
  getSSNMask(ssn: string) {
    if (ssn) {
      const formstring = ssn.substr(0,3) + '-' + ssn.substr(3,2) + '-' + ssn.substr(5,4);
      return formstring;
    }
  }
  filterDropDown(){
    this.paeActionDropDownFilterList = this.filterOptions(
      {
      taskId: this.taskId,
      paeStatus: this.paeStatus,
      programCode: this.programCode,
      paeId: this.paeAvailable,
      lastThirty: this.lastThirty
  },
  {
      SUB: {
          taskId: [7, 16, 17, 18, 19, 20, 21, 22, 83, 133, ''],
          paeStatus: ['', 'PS']
      },
      CHG: {
          taskId: [''],
          paeStatus: ['PS'],
          userRole: ['SUP'],
      },
      CLS: {
          taskId: [7, 21],
          paeStatus: ['', 'PS']
      },
      RVS: {
          taskId: [''],
          paeStatus: ['DN', 'AA'],
          lastThirty: ['yes']
      },
      REV: {
          paeId: ['available'],
      },
      CER: {
          taskId: ['14', '15'],
          paeStatus: ['AP', 'AA'],
      },
      EXT: {
          taskId: [''],
          paeStatus: ['PS'],
          programCode: ['CG1', 'CG2']

      },
      MOP: {
          taskId: ['', 74],
          paeStatus: ['PS', 'AD'],
          programCode: ['CG1', 'IFC', 'CAC']
      },

      SEV: {
          taskId: [75],
          paeStatus: ['AD']
      },

      SSI: {
          taskId: [29],
          paeStatus: ['AP'],
          kbPart: ['KBA']
      },
      TMD: {
          taskId: [''],
          userRole: ['ENR']
      },
      SIS: {
          taskId: [11],
          paeStatus: ['AP'],
          programCode: ['EC6']
      },
      EDT: {
          taskId: [''],
          kbPart: ['KBA', 'KBB']

      },
      LOC: {
          paeStatus: ['AP', 'AA'],
      },
      UPD: {
          taskId: [''],
          paeStatus: ['AP'],
          kbPart: ['KBA']
      },
      CST: {
          taskId: [146],
          paeStatus: ['AP', 'AA'],
          kbPart: ['KBA']
      },
      DSR: {
          taskId: [136, 137],
          paeStatus: ['AP'],
          kbPart: ['KBA', 'KBB']
      },
      GRP: {
          taskId: [73],
          paeStatus: ['AP'],
          programCode: ['CG3']

      },
      CEA: {
          taskId: [119],
          paeStatus: ['AP'],
          programCode: ['EC6']
      }
  },
  this.masterPaeActionDropdownList);
  }

  setMenuItems(){
    console.log(this.menuItemsToDisplay);
  }

  getByPaeId() {
    const response = this.paeService.getWelcomeByPaeId(this.paeId, 'paeId',this.taskId);
    const that = this;
    this.showWaiting = true;
    response.then(response => {
      that.prepareData(response);

      if(response.paeVO.programCd === null) {
        that.paeCommonService.setProgramName(response.slotMaterVO.enrGroupCd);
        that.rightnavToggleService.setRightNavProgramCode(response.slotMaterVO.enrGroupCd);
      }
      else {
        that.paeCommonService.setProgramName(response.paeVO.programCd);
        that.rightnavToggleService.setRightNavProgramCode(response.paeVO.programCd);
      }
      const tempObj = {
        aplId: null,
        paeId: that.paeId ? that.paeId : null,
        applicantName: that.elementRow.firstName + ' ' + that.elementRow.lastName,
        prsnId: that.elementRow.personId ? that.elementRow.personId : null,
        refId: that.elementRow.refId ? that.elementRow.refId : null
      };
      that.rightnavToggleService.setRightnavFlag(true);
      that.rightnavToggleService.setRightNavCategoryCode('PAE');
      that.rightnavToggleService.setRightnavData(tempObj);

      that.showResult = true;
    }).catch(function(reason) {
      that.showWaiting = false;
      that.error = 'Error:\n' + typeof reason == 'string' ? reason : JSON.stringify(reason, null, '  ');
    });
  }

  getByRefId() {
    const response = this.paeService.getWelcomeByPaeId(this.refId, 'refId',this.taskId);
    const that = this;
    this.showWaiting = true;
    response.then(response => {
      console.log("ResPonse==>"+JSON.stringify(response));
      that.joinEnrGrpnSltType = response.slotMaterVO.sltTypeCd+response.slotMaterVO.enrGroupCd;
      if(response.slotMaterVO.enrGroupCd !== null && response.slotMaterVO.enrGroupCd !== undefined){
        that.paeCommonService.setProgramName(response.slotMaterVO.enrGroupCd);
      }
      else {
        that.paeCommonService.setProgramName(response.refReqVO.programCd);
      }
      
      console.log(that.joinEnrGrpnSltType);
      that.displayedSlot = that.mapForSlotType.get(that.joinEnrGrpnSltType);
      that.prepareData(response);
      that.showResult = true;
    }).catch(function(reason) {
      that.showWaiting = false;
      that.error = 'Error:\n' + typeof reason == 'string' ? reason : JSON.stringify(reason, null, '  ');
    });
  }

  addDashes(x: string) {
    return x === '' ? '\u2508' : x;
  }

  makeRows(data: any, dataMap: any, outData: Array<any>) {
    let row = new Array<any>();
    dataMap.forEach(element => {

      let textValue: string = null;

      try {
        if (element[1].length > 0) {
          let split = element[1].split('.');
          let dataRef = data;

          for (let i = 0; i < split.length - 1; i++) {
            dataRef = dataRef[split[i]];
          }
          const text = [];
          split = split.pop().split('|');
          split.forEach(x => { text.push(dataRef[x]);  });
          textValue = text.join(' ');

          if (element[2] && textValue.length > 9 && element[2] == 'date') {
            const d = textValue.substring(0, 10).split('-');
            textValue =  d[1] + '/' + d[2] + '/' + d[0];
          }
        }
      } catch (e) {
        textValue = 'Error: ' + element[1];
      }

      row.push({ label: element[0], value: this.addDashes(textValue) });
      if (row.length == 2) {
        outData.push(row);
        row = new Array<any>();
      }
    });
  }

  filterOptions(values: any, map: any, source: Array<any>) {
    const result = [];
    source.forEach(el => {
      const code = el.code;
      let match = true;
      if (!map[code]) {
        return false;
      }
      const keys = Object.keys(map[code]);
      for (let i = 0; i < keys.length && match; i++) {
        let localMatch = false;
        const key = keys[i];
        const matchValues = map[code][key];
        for (let j = 0; j < matchValues.length && !localMatch; j++) {
          localMatch = values[key] === matchValues[j];
        }
        match = match && localMatch;
      }
      if (match) {
        result.push(el);
      }
    });
    return result;
  }

  prepareData(data: any) {

    const receivedDob = data.applicantVO.dobDt;
    console.log(receivedDob);
    const today = new Date();
    const birthDate = new Date(receivedDob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    this.paeCommonService.setAge(age);
    this.paeCommonService.setCounty(data.applicantVO.addressVO.cntyCd);
    this.paeCommonService.setLivingArrangement(data.currentLivingCd);

    const outData = new Array<any>();
    this.makeRows(data, this.dataMap.applicant, outData);
    if (this.statusHasECFReferral || this.statusHasKBRef) {
      outData.push('separator');
      this.makeRows(data, this.dataMap.referralData.base, outData);
      if (this.statusHasKBRef) {
        this.makeRows(data, this.dataMap.referralData.kbReferral, outData);
      } else {
        this.makeRows(data, this.dataMap.referralData.ecfReferral, outData);
      }
    }

    this.applicantData = outData;
    this.applicantDataJson = JSON.stringify(outData);
    console.log(this.applicantData);
  }

  onActionChange(value: string) {
    this.statusAction = value;
    console.log(value);
  }

  getControl(name: string): AbstractControl {
    return this.PaeWelcomeForm.get(name);
  }

  onSsiStatusChange(value: string) {
    this.statusSsi = value;
    if (this.statusSsi.length > 0) {
    }
  }

  onExtensionChange(event) {
    this.statusExtension = event.target.value;
  }

  getControls() {
    return this.PaeWelcomeForm.controls;
  }

  onSubmitClick() {

  }

  updateClosureComments(event) {
    this.closureComments = event.target.value;
  }

  onNextClick() {
    console.log(this.PaeWelcomeForm);
    this.submitted = true;
    const dateNow = new Date();
    const startDate = dateNow.toJSON();
    const paeActionRequest = new PaeAction(
      null,
      this.entityId,
      null,
      this.PaeWelcomeForm.controls.paeActionCd.value,
      startDate,
      this.userId,
      this.paeId,
	  this.refId,
	  this.taskIdVal
    );
    if (this.PaeWelcomeForm.valid) {
      const response = this.paeService.savePaeAction(paeActionRequest);
      response.then(paeActionResponse => {
        console.log(paeActionResponse);
		this.routeUser();
      });

    }
  }

  onSubmit() {
    // evaluation done here;
  }

  routeUser(){
  	this.nextPageId = this.paeCommonService.getNextPageIdContinue();
	if (this.statusAction === 'SUB'){
			if(this.nextPageId===null || this.nextPageId===undefined){
				this.router.navigate(['/ltss/pae/paeStart/applicantInformation']);
			} else {
				const routeToNextPage = PaeFlowSeq[this.nextPageId];
				this.router.navigate(['/ltss/pae/paeStart/' + routeToNextPage]);
			}
	    }
	else {
	      const routeToNextPage = this.dropDownRoutingMap.get(this.statusAction);
	      this.router.navigate([routeToNextPage]);
	    }
  }


}
