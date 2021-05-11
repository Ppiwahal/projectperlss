import { LsaFormComponent } from './../referral-forms/lsa-form/lsa-form.component';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommitteeReviewGroup8FormComponent } from '../referral-forms/committee-review-group8-form/committee-review-group8-form.component';
import { CommitteeReviewGroup7FormComponent } from '../referral-forms/committee-review-group7-form/committee-review-group7-form.component';
import { RecommendationFormComponent } from '../referral-forms/recommendation-form/recommendation-form.component';
import { EmergentCircumstancesReviewFormComponent } from '../referral-forms/emergent-circumstances-review-form/emergent-circumstances-review-form.component';
import { MultipleComplexFormComponent } from '../referral-forms/multiple-complex-form/multiple-complex-form.component';
import { SustainCurrentFamilyLivArrangementsFormComponent } from '../referral-forms/sustain-current-family-liv-arrangements-form/sustain-current-family-liv-arrangements-form.component';
import { PlannedTransitionPopupComponent } from '../referral-forms/planned-transition-popup/planned-transition-popup.component';
import { UploadDocumentsPopupComponent } from '../../../rightnav/upload-documents-popup/upload-documents-popup.component'
import { CustomvalidationService } from '../../../_shared/utility/customvalidation.service';
import { HcbsBenefitsComponent } from '../../../../app/core/widgets/hcbs-benefits/hcbs-benefits.component';
import * as customValidation from '../../../_shared/constants/validation.constants';
import { Subscription } from 'rxjs/internal/Subscription';
import { ReferralService } from '../../../core/services/referral/referral.service';
import { IntakeOutcomeService } from '../../../core/services/referral/intake-outcome/intake-outcome.service';
import { PaeService } from 'src/app/core/services/pae/pae.service';
import { HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { IntakeActionsService } from '../../../core/services/referral/intake-actions/intake-actions.service';
import { DatePipe } from '@angular/common';
import { RightnavToggleService } from 'src/app/_shared/services/rightnav-toggle.service';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-referral-intake-outcome',
  templateUrl: './referral-intake-outcome.component.html',
  styleUrls: ['./referral-intake-outcome.component.scss'],
})
export class ReferralIntakeOutcomeComponent implements OnInit {

  trgtPopltnDiagnsCdList = [
    { code: 'ID', value: 'Intellectual Disability ( ID )', activateSW: 'Y' },
    { code: 'DD', value: 'Developmental Disability ( DD )', activateSW: 'Y' },
    { code: 'NO', value: 'None', activateSW: 'Y' },
  ];

  masterResultCdList = [
    { "code": "SI", "value": "Submit to IARC", "activateSW": "Y" },
    { "code": "CR", "value": "Close Referral - TP Not Met", "activateSW": "Y" },
    { "code": "TP", "value": "Does not meet Reserve Capacity", "activateSW": "Y" },
    { "code": "SE", "value": "Send for Slot Evaluation", "activateSW": "Y" },
    { "code": "NE", "value": "Need Additional Information", "activateSW": "Y" },
    {"code": "RL", "value": "Add to Referral List", "activateSW": "Y"}
  ];

  makeReadOnly: boolean = false;
  storeRecvdUserType: any;
  needAdditionalInfo: boolean = false;
  intakeValidationPresent: boolean = false;
  age:  number;
  isHHorPDN: boolean = false;
  receivedDcsCustody: any;
  dcsCustodyYes: boolean = false;
  nurseReviewResultCdList: Array<any>;
  iarcReviewResultCdList: Array<any>;
  disableAssessor = false;
  uniqueQualifiedArray: any = [];
  qualifiedAssessorNameMap = new Map();
  isLsaformStart = false;
  isLsaformEdit = false;
  isLsaformComplete = false;
  isDisplayLsaSummary = false;
  submittingCdMap = new Map();
  codeExpired = false;
  showSpinner = false;
  enableButton = true;
  isDocumentUpload = false;
  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    private router: Router,
    private paeService: PaeService,
    private customValidator: CustomvalidationService,
    private referralService: ReferralService,
    private intakeOutcomeService: IntakeOutcomeService,
    private intakeActionsService: IntakeActionsService,
    private datePipe: DatePipe,
    private rightnavToggleService: RightnavToggleService
  ) {

    this.docLinks.sort(function (a, b) {
      return (a.title < b.title) ? -1 : 1;
    });

    this.lifeSkillsSummary['SLCR'] = 'Category I: Self-Care';
    this.lifeSkillsSummary['RECP'] = 'Category II: Receptive and Expressive Language';
    this.lifeSkillsSummary['LERN'] = 'Category III: Learning';
    this.lifeSkillsSummary['MBLT'] = 'Category IV: Mobility';
    this.lifeSkillsSummary['SEDR'] = 'Category V: Self-Direction';
    this.lifeSkillsSummary['CPID'] = 'Category VI: Capacity for Independent Living';
    this.lifeSkillsSummary['ECSL'] = 'Category VII: Economic Self-Sufficiency';
  }

  groupTableValues: any = {
    PG: { intake: null, nurseReview: null },
    RC: { intake: null, nurseReview: null, iarcReview: null }
  }

  forms: any = {
    intakeValidation: FormGroup,
    intakeOutcomeResult: FormGroup
  };

  intakeDataMap: any = {};
  groupTableSelection = [ null, null, null];
  taskId: any;
  taskQueue: any;
  userTypeCd: any;
  docLinkMap: any;
  taskStatus: any;
  assignedUser: any;
  entityValue: string;
  personId: any;
  userCodes = { '1': 'MCO', '2': 'DIDD', '3': 'DIDD' };
  pageLoaded = false;
  dataMap: any;
  intakeOutcomeId: any;
  checkboxControls: Array<string> = ['srvcNowSw', 'rqstEcfChoicesSw', 'rqstEcfChoices21Sw', 'noneSw'];
  documents: Array<any>;
  enableSaveClick: boolean = false;
  intakeOutcomeResltCd: string;
  showFirstPanel = false;
  lifeSkillsSummaryTotals: Array<number> = [];
  lsaRqstId: any;
  getIntakeDataResponse: any;
  getLsaTableDataResponse: any;
  intakeOutcomeData = [];
  groupTable: any;
  showGroupTable: boolean = false;
  incorrectCode = false;
  refData: any;
  pageStates: Array<string> = ['intake', 'nurseReview', 'iarcReview'];
  selected: any;
  isIntakeOutcomePresent = false;

  refDocLinks: Array<any> = null;
  refId: string;
  pageId: string = 'PRIOC';
  subscribed: Array<Subscription> = [];
  customValidation = customValidation;
  submitted: boolean = false;
  showResult: boolean = false;
  dueDate: string;
  pastDueDt = false;
  groupError = {};
  assessorSelected: any;
  retrievedToken: any;
  entTypeCode: any;
  groupControlsTouched = {};
  groupNoneTouched = {};
  controlErrorText = {};
  groupedControls = {
    noneSw: ['rqstEcfChoices21Sw', 'rqstEcfChoicesSw', 'srvcNowSw']
  };
  controlFormMap: any = null;
  originalValues: any = {
    ongoing_hcbs: null,
  }
  error: boolean = false;
  errorMessages: Array<string> = [];
  fieldMaps: any = {};
  userType: any;

  options: any = {
    pageStateIndex: 0,
    in_nurseReview: false,
    in_intake: true,
    in_iarcReview: false,
    is1915cWaiver: false,
    isMCO: true,
    isOver18: false,
    isUnder21: false,
    inDcsCustody: true,
    hasAppeal: true,
    lifeSkillsCompletionDate: '02/21/2020',
    intakeValidation: {
      submitted: false,
      dirty: false,
      saved: false
    },
    intakeOutcomeResult: {
      submitted: false,
      dirty: false,
      saved: false
    }
  };

  optionalControls: any = {
    isMCOandIsOver18: {
      controls: [{
        name: 'hhPdnOverLimitSw',
        validators: [],
      }]
    },
    isOver18andIsUnder21: {
      controls: [{
        name: 'clsReqSw',
        validators: [Validators.required]
      }]
    },
    inDcsCustody: {
      controls: [{
        name: 'dcsToClsPlanSw'
        // validators: [Validators.required]
      }, {
        name: 'dcsFmlylvngPlanSw'
        // validators: [Validators.required]
      }]
    },
    in_nurseReview: {
      controls: [{
        name: 'nurseReviewResultCd',
        validators: [Validators.required]
      }]
    },
    in_iarcReview: {
      controls: [{
        name: 'iarcReviewResultCd',
        validators: [Validators.required]
      }, {
        name: 'selectedCommitteeMember',
        validators: [Validators.required]
      }, {
        name: 'addInfoReview'
      }]
    }
  };

  dependentControls: any = {
    hhPdnOverLimitSw: [{
      values: ['T'],
      controls: [
      { name: 'noneSw',
        validators: [],
      }, {
        name: 'srvcNowSw',
        validators: [],
      }, {
        name: 'rqstEcfChoicesSw',
        validators: [],
      }, {
        name: 'rqstEcfChoices21Sw',
        validators: [],
      }]
    }],
    aplntSrvcNowSw: [{
      values: ['Y'],
      controls:
        [{
          name: 'intakeOutcomeCd',
          validators: [Validators.required]
        }]
    }],
    appLvngArgnmtCd: [{
      values: ['OTH'],
      controls:
        [{
          name: 'lvngArrgmnt',
          validators: [Validators.required]
        }]
    }, {
      values: ['OTH', 'RMH'],
      controls:
        [{
          name: 'admissionDt',
          validators: [Validators.required, this.customValidator.dateInFuture()]
        }, {
          name: 'planTrnstnDt',
          validators: [Validators.required, this.customValidator.dateInPast()]
        }]
    }]
  };

  docLinkPopups: any = {
    refIntakePlanTransRvw: {
      component: PlannedTransitionPopupComponent,
      config: {
        width: '70vw',
        height: '85vh',
        panelClass: 'exp_popup'
      }
    },
    refIntakeComplxCondRvw: {
      component: MultipleComplexFormComponent,
      config: {
        width: '70vw',
        height: '85vh',
        panelClass: 'exp_popup'
      }
    },
    refIntakeLvngArngmtRvw: {
      component: SustainCurrentFamilyLivArrangementsFormComponent,
      config: {
        width: '70vw',
        height: '85vh',
        panelClass: 'exp_popup'
      }
    },
    refIntakeReviewGrp7: {
      component: CommitteeReviewGroup7FormComponent,
      config: {
        width: '70vw',
        height: '85vh',
        panelClass: 'exp_popup',
        autoFocus: false
      }
    },
    refIntakeReviewGrp8: {
      component: CommitteeReviewGroup8FormComponent,
      config: {
        width: '70vw',
        height: '85vh',
        panelClass: 'exp_popup',
        autoFocus: false,
      }
    },
    refIntakeEmergentRvw: {
      component: EmergentCircumstancesReviewFormComponent,
      config: {
        width: '70vw',
        height: '85vh',
        panelClass: 'exp_popup'
      }
    },
    lsaFormEfill: {
      component: LsaFormComponent,
      config: {
        width: '70vw',
        height: '85vh',
        panelClass: 'exp_popup'
      }
    },
    refIntakeRecommendationForm: {
      component: RecommendationFormComponent,
      config: {
        width: '70vw',
        height: '85vh',
        panelClass: 'my-custom-dialog-class'
      }
    },
    refIntakeHcbsBenefit: {
      component: HcbsBenefitsComponent,
      config: {
        width: '70vw',
        height: '85vh',
        panelClass: 'exp_popup'
      }
    }
  }

  lifeSkillsSummary = [];

  public applicantData: Array<any>;

  docLinks: Array<any> = [{
    title: 'Multiple Complex Health Conditions',
    saved: false,
    type: 'popup',
    id: 'refIntakeComplxCondRvw'
  }, {
    title: 'LSA Form',
    saved: false,
    type: 'popup',
    id: 'lsaFormEfill'
  }, {
    title: 'Sustain Current Family Living Arrangements',
    saved: false,
    type: 'popup',
    id: 'refIntakeLvngArngmtRvw'
  }, {
    title: 'Emergent Circumstances',
    saved: false,
    type: 'popup',
    id: 'refIntakeEmergentRvw'
  }, {
    title: 'Committee Review Form',
    saved: false,
    type: 'popup',
    id: 'refIntakeReviewGrp8'
  }, {
    title: 'Committee Group 7 Review Form',
    saved: false,
    type: 'popup',
    id: 'refIntakeReviewGrp7'
  }, {
    title: 'Planned Transition to Family Living',
    saved: false,
    type: 'popup',
    id: 'refIntakePlanTransRvw'
  }, {
    title: 'Target Population Documentation',
    saved: false,
    showUnavailable: true,
    unavailable: false,
    type: 'cloud',
    cloudId: 'TPD',
    id: 'tpdocument'
  }, {
    title: 'List of HCBS and ECF Services',
    saved: false,
    type: 'popup',
    id: 'refIntakeHcbsBenefit'
  }, {
    title: 'ICAP',
    saved: false,
    type: 'cloud',
    cloudId: 'ICAP',
    id: 'icap'
  }, {
    title: 'Proof of Caregiver Age',
    saved: false,
    showUnavailable: true,
    unavailable: false,
    type: 'cloud',
    cloudId: 'OTH',
    id: 'tbd_caregiver'
  }, {
    title: 'Recommendation',
    saved: false,
    type: 'popup',
    id: 'refIntakeRecommendationForm',
  }, {
    title: 'Other Documentation',
    saved: false,
    type: 'cloud',
    cloudId: 'OTH',
    id: 'otherSupportDoc'
  }, {
    title: 'Mailed Letter',
    saved: false,
    type: 'cloud',
    cloudId: 'MDL',
    id: 'mailedLetter'
  }];

  groupTables: any = {
    PG: {
      title: 'Priority Group',
      id: 'PG',
      columns: [
        { title: 'Priority Group\u00A01', id: 'PG1', documents: ['tpdocument', 'otherSupportDoc*opt'] },
        { title: 'Priority Group\u00A02', id: 'PG2', documents: ['tpdocument', 'otherSupportDoc*opt'] },
        { title: 'Priority Group\u00A03', id: 'PG3', documents: ['tpdocument', 'otherSupportDoc*opt'] },
        { title: 'Priority Group\u00A04', id: 'PG4', documents: ['tpdocument', 'otherSupportDoc*opt'] },
        { title: 'Priority Group\u00A05', id: 'PG5', documents: ['tpdocument', 'otherSupportDoc*opt'] },
        { title: 'Priority Group\u00A06', id: 'PG6', documents: ['tpdocument', 'otherSupportDoc*opt'] },
        { title: 'Priority Group\u00A07', id: 'PG7', documents: ['tpdocument', 'otherSupportDoc*opt'] },
        { title: 'Priority Group\u00A08', id: 'PG8', documents: ['tpdocument', 'otherSupportDoc*opt'] }
      ],
      rows: [
        { title: 'Intake Outcome' },
        { title: 'Nurse Review' },
      ]
    },

    RC: {
      title: 'Reserve Capacity Group',
      id: 'RC',
      columns: [
        { title: 'Aged Caregiver', id: 'ACG', documents: ['tpdocument', 'tbd_caregiver', 'otherSupportDoc*opt'] },
        { title: 'Emergent Circumstances', id: 'EMC', documents: ['tpdocument', 'refIntakeEmergentRvw', 'otherSupportDoc*opt'] },
        { title: 'Sustain Family Living Arrangement', id: 'SFL', documents: ['tpdocument', 'refIntakeLvngArngmtRvw', 'otherSupportDoc*opt'] },
        { title: 'Planned Transition', id: 'PTR', documents: ['tpdocument', 'refIntakePlanTransRvw', 'icap', 'otherSupportDoc*opt'] },
        { title: 'Multiple Complex Health Conditions', id: 'MCH', documents: ['tpdocument', 'refIntakeComplxCondRvw', 'otherSupportDoc*opt'] },
        { title: 'Intensive Behavioral Family Supports', id: 'IBS', documents: ['tpdocument', 'refIntakeReviewGrp7','refIntakeRecommendationForm', 'icap', 'otherSupportDoc*opt'] },
        { title: 'Comprehensive Behavioral Supports', id: 'CBS', documents: ['tpdocument', 'refIntakeReviewGrp8','refIntakeRecommendationForm', 'otherSupportDoc*opt'] },
      ],
      rows: [
        { title: 'Intake Outcome' },
        { title: 'Nurse Review' },
        { title: 'IARC Review' },
      ]
    }
  };

 isSubmittingCdRt = [{"code": "NO", "value":"None","activateSW":"Y"},
{"code": "SE", "value":"Self (person who wants services)","activateSW":"Y"},
{"code": "FR", "value":"Friend","activateSW":"Y"},
{"code": "CLR", "value":"Conservator or legal representative","activateSW":"Y"},
{"code": "FM", "value":"Family Member","activateSW":"Y"},
{"code": "DI", "value":"DIDD","activateSW":"Y"},
{"code": "MCO", "value":"MCO","activateSW":"Y"},
{"code": "DCS", "value":"Department of Child Services","activateSW":"Y"},
{"code": "APS", "value":"APS","activateSW":"Y"},
{"code": "RM", "value":"RMHI","activateSW":"Y"},
{"code": "SP", "value":"Service Provider","activateSW":"Y"},
{"code": "OTH", "value":"Other","activateSW":"Y"}];

  appealsUser = true;
  taskQueueNull = false;
  filteredData: any = [];
  dataSource: any = [];
  subscription1$: Subscription;
  HEADER_DATA: any;

  ngOnInit(): void {
    this.selected = 'DF';
    let that = this;
    this.retrievedToken = JSON.parse(localStorage.getItem('APP_STORAGE_TOKEN'));
    this.entTypeCode = this.retrievedToken.entityTypeCd;
    this.refId = this.referralService.getRefId();
    this.personId = this.referralService.getRowElement().personId;
    this.intakeOutcomeId = this.referralService.getIntakeOutcomeId();
    this.age = this.referralService.getAge();
    this.refData = {};
    this.userTypeCd = this.referralService.getUserTypeCd();
    this.taskQueue = this.referralService.getRowElement().taskQueue;
    this.options.in_nurseReview = this.taskQueue === 3;
    this.options.in_iarcReview = this.taskQueue === 4;
    this.disableAssessor = this.options.in_nurseReview || this.options.in_iarcReview;

    this.forms.intakeValidation = this.fb.group({
      hhPdnOverLimitSw: [''],
      noneSw: [''],
      rqstEcfChoices21Sw: [''],
      rqstEcfChoicesSw: [''],
      srvcNowSw: [''],
      dcsToClsPlanSw: [''],
      dcsFmlylvngPlanSw: [''],
      appLvngArgnmtCd: ['', [Validators.required]],
      lvngArrgmnt: [''],
      admissionDt: [''],
      planTrnstnDt: [''],
      clsReqSw: ['', [Validators.required]]
    });


    this.forms.intakeOutcomeResult = this.fb.group({
      trgtPopltnDiagnsCd: ['', [Validators.required]],
      aplntSrvcNowSw: ['', [Validators.required]],
      intakeOutcomeCd: [''],
      qualifiedAssessorName: [{ disabled: this.disableAssessor, value: '' }, [Validators.required]],
      qualifiedAssessorCd: [{ disabled: this.disableAssessor, value: '' }, [Validators.required]],
      nurseReviewResultCd: [''],
      iarcReviewResultCd: [''],
      selectedCommitteeMember: [''],
      addInfoReview: ['']

    });

    for (const isSubmittingCd of this.isSubmittingCdRt) {
      this.submittingCdMap.set(isSubmittingCd.code, isSubmittingCd.value);
    }

    if (that.taskQueue === 1) {
      that.options.pageStateIndex = 0;
    }
    else if (this.taskQueue === 3) {
      that.options.pageStateIndex = 1;
    }
    else {
      that.options.pageStateIndex = 2;
    }
    this.taskId = this.referralService.getRowElement().taskId;
    this.taskStatus = this.referralService.getRowElement().taskStatus;
    this.assignedUser = this.referralService.getRowElement().assignedUserId;

    this.subscription1$ = this.intakeActionsService
      .getIntakeActionsHeader(this.refId)
      .subscribe((intakeActionsHeaderResponse) => {
        if (intakeActionsHeaderResponse !== null) {
          this.HEADER_DATA = intakeActionsHeaderResponse;
          this.referralService.setAssignedEntity(this.HEADER_DATA.entityName);
          this.setData('header', this.HEADER_DATA);
          const intakeDueDt = new Date(this.HEADER_DATA.intakeDueDt);
          let today = new Date();
          if(today > intakeDueDt){
            this.pastDueDt = true;
          }
          else if(today < intakeDueDt){
            this.pastDueDt = false;
          }
          this.receivedDcsCustody = this.HEADER_DATA.dcsCustodySw;
        }
        this.dueDate = intakeActionsHeaderResponse.intakeDueDt;
    });

    var taskMasterIdValue = this.referralService.getRowElement().taskQueue;
    let entityName = this.referralService.getAssignedEntity();

    if (taskMasterIdValue === 1 || taskMasterIdValue === 6) {

      if(entityName === 'Amerigroup'){
        this.userType = 'AMU';
      }
      else if (entityName === 'BlueCare') {
          this.userType = 'BLU'
      }
      else if (entityName === 'UnitedHealthcare') {
          this.userType = 'UNT'
      }
      else if (entityName === 'DIDD') {
        this.userType = 'DID'
      } else {
        this.userType = null
      }

    } else if (taskMasterIdValue === 3) {
      this.userType = 'NRS';
    } else if (taskMasterIdValue === 4) {
      this.userType = 'IRC';
    } else if (taskMasterIdValue === undefined || this.userType === undefined) {
      this.userType = null
    }

    this.dataMap = [
      ['APPLICANT NAME', 'applicantDetails.firstName|applicantDetails.midInitial|applicantDetails.lastName'], ['REFERRAL ID', 'header.refId'],
      ['PERSON ID', 'applicantDetails.prsnId'], ['REFERRAL RECEIVED DATE', 'header.submissionDt', 'date'],
      ['DATE OF BIRTH', 'applicantDetails.dobDt', 'date'], ['REFERRAL SUBMITTER', 'header.whoIsSubmittingCd', 'lookup', 'whoIsSubmitting', 'desc'],
      ['SSN', 'applicantDetails.ssn|applicantDetails.ssnAvalSw', 'ssn'], ['ASSIGNED GROUP', 'header.entityName'],
      ['PROGRAM TYPE', 'header.programCd', 'lookup', 'program', 'desc'], ['ASSIGNED USER', 'header.assignedUser']
    ];




    this.taskQueueNull = this.taskQueue == null || this.taskQueue == undefined;


    console.log('/referral/intakeAction/header with refId = ' + this.refId);
    this.intakeOutcomeService.getHeader(this.refId, this.taskQueue).then(response => {
      let data = response.body;
      console.log('result: ' + JSON.stringify(response.body, null, '  '));
      this.setData('header', data);
    }).catch(reason => {
      this.errorMessages.push('getHeader Error');
      this.error = true;
      console.log('getHeader error: ' + reason);
    });

    this.intakeOutcomeService.getReferrals(this.refId, this.personId).then(response => {

      let data = Array<any>();
      let i = 0;
      while (response.body[i]) {
        data.push(response.body[i]);
        i++;
      }
      that.refDocLinks = data;
    });

    this.referralService.getApplicantDetails(this.refId, this.pageId).then(response => {
      let data = response.body;
      this.setData('applicantDetails', data);
    }).catch(reason => {
      console.log('getApplicantDetails error: ' + reason);
    });

    this.docLinkMap = {};
    this.docLinks.forEach(function (el, index) {
      that.docLinkMap[el.id] = index;
    });

    this.getIntakeData();
    console.log("life summary", this.lifeSkillsSummary);
    this.updateOptions();


    let currentKey = null;
    let currentControl = null;

    try {

      Object.keys(this.groupedControls).forEach(noneControlName => {

        currentKey = noneControlName;
        let checkControls = that.groupedControls[noneControlName];
        that.subscribed.push(that.getControl(noneControlName).valueChanges.subscribe(val => {
          that.groupClick(noneControlName, null, val);
        }));

        checkControls.forEach(function (ctrlName) {
          currentControl = ctrlName;
          that.subscribed.push(that.getControl(ctrlName).valueChanges.subscribe(val => {
            that.groupClick(noneControlName, ctrlName, val);
          }));
        });
      });
    } catch (e) {
      console.log('Grouped Controls Error: currentKey = ' + currentKey + '  currentControl = ' + currentControl);
    }

    try {
      Object.keys(this.dependentControls).forEach(key => {
        currentKey = key;
        let dependentControl = that.dependentControls[key];
        that.subscribed.push(that.getControl(key).valueChanges.subscribe(val => {
          that.parentClick(val, dependentControl);
        }));
        that.dependentControls[key].forEach(obj => {
          obj.controls.forEach(subObj => {
            currentControl = subObj.name;
            that.subscribed.push(
              that.getControl(subObj.name).valueChanges.subscribe(val => { that.dependentClick(val, subObj.name); })
            );
          });
        });
      });
    } catch (e) {
      console.log('Dependent Controls Error: currentKey = ' + currentKey + '  currentControl = ' + currentControl);
    }

    this.subscribed.push(this.intakeOutcomeService.dialogResult$.subscribe(action => {
      that.docLinks[that.docLinkMap[action.formName]].saved = action.result;
      that.documentCount();
    }));

    // if (this.referralService.getRefId() !== null && this.referralService.getRefId() !== undefined) {
      this.getAccessorData();
    // }
  }

  credChanged(value) {
    this.filteredData = [];
    this.filteredData = this.dataSource(item => item.credentialsCd === value);
	console.log(this.filteredData);
  }

  generatePdf(){
    const response = this.referralService.createPdf();
    response.then(resp => {
      if(resp){
        console.log(resp);
        this.debugBase64('data:application/pdf;base64,' + resp.body[0].document);
      }      
    });
  }

  debugBase64(base64URL) {
    console.log(base64URL);
    const win = window.open();
    win.document.write('<iframe src="' + base64URL + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>');
  }


  getFormData() {
    return this.forms.controls;
  }

  getAccessorData() {
    const localStorageLocal = localStorage.getItem('APP_STORAGE_TOKEN');
    const entityId = JSON.parse(localStorageLocal).entityId;
   this.paeService.getQualifierInfo(entityId)
   .then(data => {
      console.log(data.body);
      this.uniqueQualifiedArray = data.body;
      for(const data of this.uniqueQualifiedArray){
        this.qualifiedAssessorNameMap.set(data.assessorId, data.firstName + " " + data.lastName);
      }
      this.chkIfMapIsSet();
    });

  }

  chkIfMapIsSet(){
    console.log(this.qualifiedAssessorNameMap);
    console.log(this.qualifiedAssessorNameMap.get('E415908532460923'));
  }

  filterOptions(values: any, map: any, source: Array<any>) {
    let result = [];
    source.forEach(el => {
      let code = el.code;
      let match = true;
      if (!map[code]) return false;
      let keys = Object.keys(map[code]);
      for (let i = 0; i < keys.length && match; i++) {
        let localMatch = false;
        let key = keys[i];
        let matchValues = map[code][key];
        for (let j = 0; j < matchValues.length && !localMatch; j++) {
          localMatch = values[key] == matchValues[j];
        }
        match = match && localMatch;
      };
      if(match) {
        result.push(el);
      }
    });
    return result;
  }

  enableIntakeValidationControls(enabled: boolean) {
    let form = this.forms.intakeValidation as FormGroup;
    Object.keys(form.controls).forEach(key => {
      let control = form.controls[key];
      if (enabled) {
        control.enable();
      } else {
        control.disable();
      }
    });
  }

  getIntakeOutcomeResultData(){
    return this.forms.intakeOutcomeResult.controls;
  }
  onCodeIncorrect(event: any){
    this.incorrectCode = false;

    if((event.target.value !== this.assessorSelected))
    {
      this.incorrectCode = true;
    }
    else{
      this.incorrectCode = false;
    }
    // const name = this.qualifiedAssessorNameMap.get(this.getIntakeOutcomeResultData().qualifiedAssessorName);
    // console.log(name);
    // this.getIntakeOutcomeResultData().qualifiedAssessorName = name;
  }

  getIntakeData() {
    //let that = this;

    this.showFirstPanel = false;
    this.intakeOutcomeService.getIntakeOutcome(this.refId).then(response => {
      console.log(Object.keys(response.body).length);
      if (Object.keys(response.body).length <= 0) {
        console.log("Error in getIntakeOutcome for id: " + this.refId);
        this.enableIntakeValidationControls(true);
        this.options.intakeValidation.saved = false;
        this.options.intakeOutcomeResult.saved = false;
        this.showFirstPanel = true;
      }
      else if(Object.keys(response.body).length > 0){
        console.log(response.body);
        this.getIntakeDataResponse = response.body[0];
        console.log("old response", this.getIntakeDataResponse);
        this.showLsaformProcess();
        this.getLsaTableData();
        let data = Array<any>();
        let formData: any;
        let thirdAccordionData: any;
        let i = 0;
        let dataRow: any = null;
        do {
          if(response.body[0].validationVO !== null){
            this.intakeValidationPresent = true;
          }
          dataRow = response.body[i];
          console.log("Inside Do While with DATA ROW ----- ", JSON.stringify(dataRow, null, ' '));
          // TODO logic to grab the right list and right intake outcome ID to be set
          // task master id 1 and userTypeCode from last screen is not NRS and not IRC and not null set the appropriate intake outcome id of that
          // task master 3 and userType code NRS
          if (dataRow !== undefined) {
            this.storeRecvdUserType = dataRow.userTypeCd;
            if (dataRow.userTypeCd !== 'NRS' && dataRow.userTypeCd !== 'IRC' && dataRow.userTypeCd !== null) {
              formData = dataRow.validationVO;
              thirdAccordionData = dataRow;
              this.groupTableSelection[0] = dataRow.intakeOutcomeResltCd;
            }

            if (dataRow.userTypeCd === 'NRS') {
              this.makeReadOnly = true;
              this.groupTableSelection[1]= dataRow.intakeOutcomeResltCd;
            }

            if (dataRow.userTypeCd === 'IRC') {
              this.makeReadOnly = true;
              this.groupTableSelection[2]= dataRow.intakeOutcomeResltCd;
            }

            if (this.taskQueue === 1) {
              if (dataRow.userTypeCd !== 'NRS' && dataRow.userTypeCd !== 'IRC' && dataRow.userTypeCd !== null) {
                this.intakeOutcomeId = dataRow.intakeOutcomeId;
              }
            }
            if (this.taskQueue === 3) {
              if (dataRow.userTypeCd === 'NRS') {
                this.intakeOutcomeId = dataRow.intakeOutcomeId;
              }
            }
            if (this.taskQueue === 4) {
              if (dataRow.userTypeCd === 'IRC') {
                this.intakeOutcomeId = dataRow.intakeOutcomeId;
              }
            }
            if (dataRow.intakeOutcomeId) {
              this.dataMap[dataRow.intakeOutcomeId = i]
              console.log(this.dataMap[dataRow.intakeOutcomeId]);
              data.push(dataRow);
            }
          }
          i++;
        } while (dataRow);

        dataRow = data.pop();
        console.log(dataRow);
        this.intakeOutcomeService.map(this.intakeOutcomeService.entity, dataRow, 'code', 'desc', 'entity', 'Text');
        this.intakeOutcomeService.map(this.intakeOutcomeService.entity, dataRow, 'code', 'type', 'entity', 'Type');
        this.intakeOutcomeData = dataRow;
        let form = this.forms['intakeValidation'] as FormGroup;
        let form2 = this.forms['intakeOutcomeResult'] as FormGroup;
        this.enableIntakeValidationControls(false);

        console.log('intakeData = ' + JSON.stringify(dataRow, null, '  '));
        // that.intakeOutcomeId = formData.intakeOutcomeId;
        // identify which intakeOutcomeId is neeed for the right apss.

        this.checkboxControls.forEach(controlName => {
          formData[controlName] = (formData[controlName] == 'T');
        });
        this.options.intakeValidation.saved = true;
        this.options.intakeOutcomeResult.saved = true;

        form.patchValue(formData);
        console.log("third accordion", thirdAccordionData);
		if(thirdAccordionData.qualifiedAssessorCd!==null && thirdAccordionData.qualifiedAssessorCd!==undefined){
			thirdAccordionData.qualifiedAssessorName=thirdAccordionData.qualifiedAssessorCd;
			this.assessorSelected=thirdAccordionData.qualifiedAssessorCd;
		}
        form2.patchValue(thirdAccordionData);
        this.isIntakeOutcomePresent = true;
        this.getGroupTable();

        if (dataRow.docSw) {

          Object.keys(dataRow.docSw).forEach(key => {
            let docId = this.docLinkMap[key];
            if (typeof docId != 'undefined') {
              this.docLinks[docId].saved = dataRow.docSw[key] == 'YES';
            } else {
              console.log('Unrecognized docLinkPopup: ' + key);
            }
          });
        }
        this.showFirstPanel = true;
        if(this.entTypeCode === 'MCO' && this.age >= 18){
          this.isHHorPDN = true;
        }
        if(this.receivedDcsCustody === 'Y'){
          this.dcsCustodyYes = true;
          this.getFormData().dcsToClsPlanSw.setValidators([Validators.required]);
          this.getFormData().dcsFmlylvngPlanSw.setValidators([Validators.required]);
        }

      }
    });
    // .catch(reason => {
    //   console.log('getIntakeOutcome error: ' + reason);
    // });
  }

  lsaFormPopup() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'exp_popup';
    dialogConfig.width = '70vw';
    dialogConfig.height = '85vh'
    dialogConfig.autoFocus = false;
    const dialogRef = this.dialog.open(LsaFormComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(res => {
      this.lsaRqstId = this.getIntakeDataResponse.refIntLsaDetailVOs[0].lsaRqstId;
        this.intakeOutcomeService.getLsaTabledata(this.lsaRqstId).then(response => {
          this.getLsaTableDataResponse = response.body;
          this.isDisplayLsaSummary = true;
          console.log("checking lsa progress", this.isLsaformComplete);
          this.isLsaformComplete = true;
          this.calcSummaryTotals();
        });
      console.log('from popup close');
    })
  }

  getLsaTableData(){
    if(this.getIntakeDataResponse.refIntLsaDetailVOs !== null && this.getIntakeDataResponse.refIntLsaDetailVOs !== undefined){
      this.lsaRqstId = this.getIntakeDataResponse.refIntLsaDetailVOs[0].lsaRqstId;
      if(this.getIntakeDataResponse.refIntLsaDetailVOs[0].lsaStatusCd == "CP"){
        this.intakeOutcomeService.getLsaTabledata(this.lsaRqstId).then(response => {
          this.getLsaTableDataResponse = response.body;
          this.isDisplayLsaSummary = true;
          this.calcSummaryTotals();
        });
      }
    }
  }

  showLsaformProcess(){
    if(this.getIntakeDataResponse.refIntLsaDetailVOs == null){
      this.isLsaformStart = true;
    }
    else if(this.getIntakeDataResponse.refIntLsaDetailVOs !== null && this.getIntakeDataResponse.refIntLsaDetailVOs !== undefined){
      if(this.getIntakeDataResponse.refIntLsaDetailVOs[0].lsaStatusCd == "NA"){
        this.isLsaformStart = true;
      }
      else if(this.getIntakeDataResponse.refIntLsaDetailVOs[0].lsaStatusCd == "IP"){
        this.isLsaformEdit = true;
      }
      else if(this.getIntakeDataResponse.refIntLsaDetailVOs[0].lsaStatusCd == "CP"){
        this.isLsaformComplete = true;
      }
    }
  }

  getLength(controlName) {
    let control = this.getControl(controlName);
    if (control.value) {
      return control.value.length;
    }
    return 0;
  }

  getGroupTable() {
    let control = this.getControl('intakeOutcomeCd');
    let value = control.value;
    let showGroupTable = false;

    switch (value) {

      case '':
      case null:
        let serviceNow = this.getControl('aplntSrvcNowSw').value == 'Y';
        //let livingArrangement = this.getControl('trgtPopltnDiagnsCd').value;
        if (!serviceNow) {
          this.addDocuments(['tpdocument*opt', 'otherSupportDoc*opt']);
        } 
        else {
          this.addDocuments([]);
        }
        if(this.getControl('aplntSrvcNowSw').value === 'N'){
          this.addDocuments(['tpdocument', 'tbd_caregiver', 'otherSupportDoc*opt']);
        }

        break;

      case 'PG':

      case 'RC':

        this.groupTableValues[value][this.pageStates[this.options.pageStateIndex]] = null;
        this.groupTable = this.groupTables[value];
        showGroupTable = true;
        this.documents = null;
        break;

      case 'NO': //Does not meet Target Population',
        this.addDocuments(['tpdocument*opt', 'otherSupportDoc*opt']);
        break;

      case 'TP': //Does not meet Aged Caregiver Reserve Capacity or Priority Criteria
        this.addDocuments(['tpdocument', 'tbd_caregiver', 'otherSupportDoc*opt']);
        break;

      case 'WT': //Waiver Transition - Proceed to enrollment
        this.addDocuments(['mailedLetter']);
        break;

      case 'CT': //CHOICES HCBS Transition
        this.addDocuments(['tpdocument', 'refIntakeHcbsBenefit', 'otherSupportDoc*opt']);
        break;
    }
    this.showGroupTable = showGroupTable;
    this.entityValue = value;

    this.nurseReviewResultCdList = this.filterOptions(
      { taskQueue: this.taskQueue, intakeOutcomeCd: value },
      {
        SI: {
          taskQueue: [3,4],
          intakeOutcomeCd: ['RC']
        },
        CR: {
          taskQueue: [3,4],
        },
        TP: {
          taskQueue: [3,4],
        },
        SE: {
          taskQueue: [3,4],
        },
        NE: {
          taskQueue: [3,4]
        },
        RL: {
          taskQueue: [3,4]
        }
      },
      this.masterResultCdList);


    this.iarcReviewResultCdList = this.filterOptions(
      { taskQueue: this.taskQueue },
      {
        TP: {
          taskQueue: [4]
        },
        SE: {
          taskQueue: [4],
        },
        NE: {
          taskQueue: [4]
        }
      },
      this.masterResultCdList);

    console.log('filtered List:' + JSON.stringify(this.nurseReviewResultCdList, null, '  '));

  }

  edit(formName: string) {
    this.options[formName].edit = true;
    this.enableIntakeValidationControls(true);
    this.originalValues[formName] = this.forms[formName].value;
  }

  cancel(formName: string) {
    this.options[formName].saved = true;
    this.options[formName].dirty = false;

    let originalValues = this.originalValues[formName];
    let that = this;

    let timeout = setTimeout(function () {
      Object.keys(originalValues).forEach(controlName => {
        let control = that.getControl(controlName);
        control.setValue(originalValues[controlName]);
        control.markAsUntouched();
        control.setErrors(null);
        control.markAsPristine();
        control.disable();
      });
      clearTimeout(timeout);
    }, 10);
  }

  isLsaFormSaved() {
    return this.docLinks[this.docLinkMap['lsaFormEfill']].saved;
  }

  saveClick(formName: string) {
    let form = this.forms[formName] as FormGroup;
    this.options[formName].submitted = true;
    form.updateValueAndValidity();
    let that = this;
    console.log(form);
    if (form.valid) {
      switch (formName) {
        case 'intakeValidation':
          this.saveForm(formName, form);
          break;
        case 'intakeOutcomeResult':
          this.saveForm(formName, form, function () {
            if (that.options.pageStateIndex < 2) {
              if (that.taskQueue === 1) {
                that.options.pageStateIndex = 0;
              }
              else if (this.taskQueue === 3) {
                that.options.pageStateIndex = 1;
              }
              else {
                that.options.pageStateIndex = 2;
              }
            }
          });
          break;
      }
    }
  }

  setData(dataName: string, data: any) {

    if (!data || typeof data == 'undefined') {
      console.log('Bad referral data: ' + dataName);
      this.error = true;
      this.errorMessages.push('Got null records for ' + dataName + '.');
      data = {};
    }

    this.refData[dataName] = data;
    let complete = true;
    const expected: Array<string> = ['header', 'applicantDetails'];
    expected.forEach(e => { complete = complete && (typeof this.refData[e] !== 'undefined') });
    if (complete) {
      this.refData.header.refId = this.refId;
      this.refData.header.assignedUser = this.assignedUser;
      this.prepareData(this.refData);
      this.pageLoaded = true;

      let dobSplit = this.refData.applicantDetails.dobDt.split('/');
      let dob = new Date(dobSplit[0], dobSplit[1], dobSplit[0]);
      let currentDate = new Date();
      let age18 = new Date(dobSplit[0] + 18, dobSplit[1], dobSplit[0]);
      let age21 = new Date(dobSplit[0] + 21, dobSplit[1], dobSplit[0]);

      this.options.isOver18 = age18.getTime() > currentDate.getTime();
      this.options.isOver18andIsUnder21 = this.options.isOver18 && currentDate.getTime() < age21.getTime();

    }

    this.options.inDcsCustody = this.refData.header.dcsCustodySw == 'Y';
    //this.options.isMCO =

  }

  calcSummaryTotals() {
    this.lifeSkillsSummaryTotals = [0, 0, 0];
    this.getLsaTableDataResponse.forEach(el => {
      if(el.substantialLimitation == 'Yes'){
        this.lifeSkillsSummaryTotals[0] += 1;
      }
      if(el.noSubstantialLimitation == 'Yes'){
        this.lifeSkillsSummaryTotals[1] += 1;
      }
      if(el.possibleLimitation == 'Yes'){
        this.lifeSkillsSummaryTotals[2] += 1;
      }
    });
  }

  groupTableSelect(event: Event) {
    let clicked = event.currentTarget as HTMLButtonElement;
    let colIndex = clicked.getAttribute('colIndex');
    let groupId = clicked.getAttribute('groupId');
    let rowIndex = clicked.getAttribute('rowIndex');
    let rowId = clicked.getAttribute('rowId');
    let groupTable = this.groupTables[groupId];
    let column = groupTable.columns[colIndex];
    let colValue = column.id;
    this.groupTableSelection[rowIndex] = colValue;
    this.intakeOutcomeResltCd = colValue;
    let documents = column.documents;
    this.addDocuments(documents);
  }

  addDocuments(docs: Array<string>, append: boolean = false) {
    let documents = append ? JSON.parse(JSON.stringify(this.documents)) : [];
    for (var i = 0; i < docs.length; i++) {
      let split = docs[i].split('*');
      let docId = split[0];
      let notRequired = split[1] == 'opt';
      let doc = this.docLinks[this.docLinkMap[docId]];
      if (!doc) {
        console.log('bad docId:' + docId);
      } else {
        doc.required = !notRequired;
        documents.push(doc);
      }
    }
    this.documents = documents;
    this.documentCount();
  }

  saveForm(formName: string, form: FormGroup, onSave: Function = null) {
    let that = this;
    let timeout = setTimeout(function () {
      let data = form.value;
      that.originalValues[formName] = data;
      that.options[formName].dirty = false;
      that.options[formName].edit = false;
      that.options[formName].saved = true;

      data.refId = that.refId;
      data.reqPageId = that.pageId;
      data.userTypeCd = that.userType;
      data.taskId = that.taskId;
      data.taskMasterId = that.taskQueue;
      console.log(data.qualifiedAssessorCd);
      data.qualifiedAssessorName = that.qualifiedAssessorNameMap.get(data.qualifiedAssessorCd);
      console.log(data.qualifiedAssessorName);

      if (that.intakeOutcomeId) {
        data.intakeOutcomeId = that.intakeOutcomeId;
      }
      try {

        switch (formName) {
          case 'intakeValidation':

            that.checkboxControls.forEach(controlName => {
              data[controlName] = data[controlName] ? 'T' : 'F';
            });

            console.log('Data: ' + JSON.stringify(data, null, '  '));
            that.intakeOutcomeService.saveEditIntValidation(data).then(response => {
              that.getIntakeData();
              if (onSave !== null) {
                onSave();
              }

            }).catch(reason => {
              console.log('saveEditIntValidation error: ' + reason);
            });
            break;
          case 'intakeOutcomeResult':
            data.intakeOutcomeResltCd = that.intakeOutcomeResltCd;
            console.log('Data: ' + JSON.stringify(data, null, '  '));
			that.showSpinner = true;
			that.enableButton = false;
            that.intakeOutcomeService.updateIntakeOutcome(data).then(response => {
              //that.getIntakeData();
			  that.showSpinner = false;
			  that.enableButton = true;
              that.router.navigate(['/ltss/referral/referralDashboard']);
              if (onSave !== null) {
                onSave();
              }
            }).catch(reason => {
              console.log('updateIntakeOutcome error: ' + reason);
            });
            break;
        }
      } catch (e) {
        console.log('Submittal Error');
      }

      clearTimeout(timeout);
    }, 20);
  }

  submit(formName: string, onSave: Function = null) {
    let form = this.forms[formName];
    this.options[formName].submitted = true;
    if (form.valid) {
      this.saveForm(formName, form, onSave);
      this.options[formName].submitted = true;
    }
  }

  getControlAndForm(controlName: string): any {
    let formName = '';
    try {
      this.buildFormMap();
      formName = this.controlFormMap[controlName];
      let form = this.forms[formName] as FormGroup;
      return { control: form.controls[controlName], form: form, submitted: this.options[formName].submitted };
    } catch (e) {
      console.log('getControlAndForm error:' + controlName + ' formName:' + formName);
    }
  }

  buildFormMap() {
    let that = this;
    if (this.controlFormMap == null) {
      this.controlFormMap = {};
      Object.keys(this.forms).forEach(formName => {
        let form = that.forms[formName] as FormGroup;
        Object.keys(form.controls).forEach(controlName => {
          that.controlFormMap[controlName] = formName;
        });
      });
    }
  }

  getControl(controlName: string): AbstractControl {
    let formName = '';
    try {
      this.buildFormMap();
      formName = this.controlFormMap[controlName];
      let form = this.forms[formName] as FormGroup;
      return form.controls[controlName];

    } catch (e) {
      console.log('getControl error:' + controlName + ' formName:' + formName);
    }
  }

  updateOptions() {
    this.options.isMCOandIsOver18 = this.options.isMCO && this.options.isOver18;
    this.options.isOver18andIsUnder21 = this.options.isOver18 && this.options.isUnder21;

    let that = this;
    let currentKey = null;
    let currentControl = null;
    try {
      Object.keys(this.optionalControls).forEach(key => {
        let match = that.options[key];
        currentKey = key;
        that.optionalControls[key].controls.forEach(obj => {
          currentControl = obj.name;
          let control = that.getControl(obj.name);
          if (match) {
            control.setValidators(obj.validators)
          } else {
            control.clearValidators();
          }
        })
      });
    }
    catch (e) {
      console.log('Update options error: key=' + currentKey + ' control=' + currentControl);
    }
  }

  dependentClick(value: string, controlName: string) {
    try {
      let control = this.getControl(controlName);
      let message = null;
      if ((this.submitted || control.touched) && control.errors) {
        if (control.errors.required) {
          message = customValidation.A1;
        } else if (control.errors.dateInPast) {
          message = customValidation.A54;
        } else if (control.errors.dateInFuture) {
          message = customValidation.A5;
        }
      }
      this.controlErrorText[controlName] = message;
      if (message) {
        this.options.dependentErrors++;
      } else {
        this.options.dependentErrors--;
      }
    } catch (e) {
      console.log('Dependent Click error handling: ' + controlName);
    }
  }

  parentClick(value: string, config: Array<any>) {
    let controlName = '';
    try {
      let that = this;
      config.forEach(obj => {

        let match = false;
        obj.values.forEach(val => {
          match = match || (val == value);
        });
        obj.controls.forEach(obj => {
          controlName = obj.name;
          let control = that.getControl(controlName);
          if (match) {
            control.setValidators(obj.validators);
            control.markAsPristine();
            control.markAsUntouched();
          } else {
            control.clearValidators();
            control.setValue(null);
          }
        })
      })
    } catch (e) {
      console.log('Parent Click error handling control: ' + controlName);
    }
  }

  valueMatch(values: Array<string>, controlName: string) {
    let controlValue = this.getControl(controlName).value;
    let match = false;
    values.forEach(val => {
      match = match || (val == controlValue);
    });
    return match;
  }

  groupClick(noneControlName: string, checkControlName: string, val: any) {

    try {
      let othersChecked = false;
      let noneControl = this.getControl(noneControlName);
      let noneChecked = checkControlName == null ? val : !!noneControl.value;
      let othersTouched = this.groupControlsTouched[noneControlName] || false;

      this.groupedControls[noneControlName].forEach(ctrl => {
        let otherControl = this.getControl(ctrl);
        othersChecked = othersChecked || (ctrl == checkControlName ? val : !!otherControl.value);
        othersTouched = !!otherControl.value || othersTouched;
      });

      let othersPreviouslyTouched = this.groupControlsTouched[noneControlName] || false;
      this.groupControlsTouched[noneControlName] = othersTouched;
      let groupNoneTouched = this.groupNoneTouched[noneControlName] || false;
      let error = null;
      console.log('NoneChecked:' + noneChecked + ' othersChecked:' + othersChecked);
      if (noneChecked && othersChecked) {
        error = customValidation.A27;
      } else if (!noneChecked && !othersChecked && (!this.submitted || !othersPreviouslyTouched || !groupNoneTouched)) {
        error = customValidation.A1;
      }
      this.groupError[noneControlName] = error;

      if (noneChecked) {
        this.groupNoneTouched[noneControlName] = true;
      }

    } catch (e) {
      console.log('Error for: noneControlName: [' + noneControlName +
        '] checkControlName: [' + checkControlName + '] val: [' + val + ']');
    }
  }

  addDashes(x: string) {
    return x === '' ? '\u2508' : x;
  }

  controlError(controlName: string) {
    try {
      const controlAndForm = this.getControlAndForm(controlName);
      const error = (controlAndForm.submitted || controlAndForm.control.touched) && controlAndForm.control.errors && controlAndForm.control.errors.required;
      this.controlErrorText[controlName] = error ? (controlName == 'groupSelection' ? 'A group selection is required' : customValidation.A1) : '';
      return error
    } catch (e) {
      console.log('unrecognized control name: ' + controlName);
    }
  }

  makeRows(data: any, dataMap: any, outData: Array<any>) {
    let row = new Array<any>();

    dataMap.forEach(element => {
      let textValue: string;
      let textValues: Array<string> = [];

      try {
        if (element[1].length > 0) {

          let valuePaths = element[1].split('|');

          valuePaths.forEach(element => {
            let split = element.split('.');
            let dataRef = data;
            for (let i = 0; i < split.length - 1; i++) {
              dataRef = dataRef[split[i]];
            }
            textValues.push(dataRef[split.pop()]);
          });

          let type = element[2] ? element[2] : 'default';
          switch (type) {

            case 'lookup':
              textValue = this.getLookupValue(element[3], element[4], textValues[0], element[5]);
              break;

            case 'date':
              textValue = this.formatDate(textValues[0]);
              break;

            case 'ssn':
              if (textValues[0]) {
                textValue = textValues[0].split('-').join('');
                textValue = textValues[0].substr(0,3) + '-' + textValues[0].substr(3,2) + '-' + textValues[0].substr(5,4);
              } else {
                if (textValues[1] == 'T') {
                  textValue = 'Not Available';
                }
              }
              break;
            case 'default':
              textValue = textValues.join(' ');
              break;

          }

        }
      } catch (e) {
        textValue = 'Lookup Error: ' + element[1];
      }

      row.push({ label: element[0], value: this.addDashes(textValue) });
      if (row.length == 2) {
        outData.push(row);
        row = new Array<any>();
      }
    });
  }

  formatDate(value: string): string {
    if (value) {
      let date = new Date(value);
      return this.datePipe.transform(date, 'MM/dd/yyyy');
    }
    return null;
  }

  getLookupValue(from: string, to: string, value: string, allowNulls: boolean = false): string {
    let mapName = from + '_' + to;
    try {
      if (!this.fieldMaps[mapName]) {
        let map = {};
        this.intakeOutcomeService[from].forEach(item => {
          map[item.code] = item[to];
        });
        this.fieldMaps[mapName] = map;
      }

      if (!value) {
        return allowNulls ? null : 'bad value: ' + mapName;
      }

      let newValue = this.fieldMaps[mapName][value];
      if (!newValue) {
        return value;
      }
      return this.addDashes(newValue);
    } catch (e) {
      return '[' + value + '] not in ' + from + ' data';
    }
  }

  prepareData(data: any) {

    let outData = new Array<any>();
    console.log(JSON.stringify(data, null, '  '));
    this.makeRows(data, this.dataMap, outData);
    this.applicantData = outData;

    let docLinks = new Array<any>();
    if (data.referrals) {
      data.referrals.forEach(ref => {
        docLinks.push({
          docLink: '#',
          refId: ref.refId,
          receivedDt: this.formatDate(ref.receivedDt),
          submittedBy: this.getLookupValue('whoIsSubmitting', 'desc', ref.submittedBy)
        });
      })
      this.refDocLinks = docLinks;
    }

    this.showResult = true;
  }

  docLinkSetAvailable(event: Event) {
    let control = event.currentTarget as HTMLLabelElement;
    let index = control.getAttribute('index');
    this.documents[index].unAvailable = !this.documents[index].unAvailable;
    this.documentCount();
  }

  docLinkCloudLoad(event: Event) {
    this.rightnavToggleService.emitToRightNavComp$.next('UPLOAD_DOC');
    let control = event.currentTarget as HTMLLabelElement;
    let index = control.getAttribute('index');
    this.rightnavToggleService.eventEmmiterDocumentModal.subscribe(data=>{
      console.log("upload document check ", data);
      if(data == true) {
        this.documents[index].saved = true;
        this.documents[index].unAvailable = true;
        this.isDocumentUpload = true;
        this.documentCount();
      }
    });
  }

  docLinkOpenPopup(event: Event) {
    let control = event.currentTarget as HTMLDivElement;
    let index = control.getAttribute('index');
    this.showPopup(this.documents[index]);
  }

  docLinkOpenPopupLink(event: Event) {
    let control = event.currentTarget as HTMLLabelElement;
    let index = control.getAttribute('index');
    this.showPopup(this.documents[index]);
  }

  docLinkDelete(event: Event) {
    let control = event.currentTarget as HTMLLabelElement;
    let index = control.getAttribute('index');
    this.documents[index].saved = false;
    this.documentCount();
  }

  documentCount() {
    let length = this.documents.length;
    let missing = length == 0;
    for (var i = 0; i < length && !missing; i++) {
      let document = this.documents[i];
      if (document.required && (
        !document.saved && document.type == 'popup' ||
        !document.saved && document.type == 'cloud' && !document.unAvailable
      )
      ) {
        missing = true;
      }
    }
    if(this.storeRecvdUserType === 'NRS' || this.storeRecvdUserType === 'IRC'){
      this.enableSaveClick = true;
    }
    else {
      this.enableSaveClick = !missing;
    }    
  }

  trackNurseReviewResult(msChange: MatSelectChange){
    if (msChange.value === 'NE') {
      this.needAdditionalInfo = true;
    } 
    else {
      this.needAdditionalInfo = false;
    }
  }

  trackIarcReviewResult(msChange: MatSelectChange){
    if (msChange.value === 'NE') {
      this.needAdditionalInfo = true;
    } 
    else {
      this.needAdditionalInfo = false;
    }
  }

  showPopup(docLink: any) {
    let dialog = this.docLinkPopups[docLink.id];
    this.intakeOutcomeService.setDocExists(docLink.saved);
    this.intakeOutcomeService.setIntakeOutcomeId(this.intakeOutcomeId);
    this.dialog.open(dialog.component, dialog.config)
  }

  onSubmit() {
    // const name = this.qualifiedAssessorNameMap.get(this.getFormData().qualifiedAssessorName.value);
  }

  ngOnDestroy() {
    this.subscribed.forEach(subscription => { subscription.unsubscribe(); });
  }

}
