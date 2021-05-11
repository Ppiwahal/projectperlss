import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HcbsBenefitsComponent } from '../../../core/widgets/hcbs-benefits/hcbs-benefits.component';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ReferralService } from '../../../core/services/referral/referral.service';
import { IntakeActionsService } from '../../../core/services/referral/intake-actions/intake-actions.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import * as customValidation from '../../../_shared/constants/validation.constants';
import { RefIntakeActionExtension } from '../../../_shared/model/RefIntakeActionExtension';
import { RefIntakeActionReassignment } from '../../../_shared/model/RefIntakeActionReassignment';
import { RightnavToggleService } from '../../../_shared/services/rightnav-toggle.service';
import { NGX_MAT_DATE_FORMATS } from '@angular-material-components/datetime-picker';

export const DATE_TIME_FORMAT = {
  parse: {
    dateInput: 'l, LT',
  },
  display: {
    dateInput: 'l, LT',
    monthYearLabel: 'MM yyyy',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  }
}

@Component({
  selector: 'app-referral-intake-actions',
  templateUrl: './referral-intake-actions.component.html',
  styleUrls: ['./referral-intake-actions.component.scss'],
  providers: [{provide: NGX_MAT_DATE_FORMATS, useValue: DATE_TIME_FORMAT}]
})
export class ReferralIntakeActionsComponent implements OnInit, OnDestroy {
  HEADER_DATA: any;
  mapForSubmitter = new Map();
  SUMMARY_DATA = {
    ageOfTheApplicant: '',
    hasaJob: '',
    currentEnrollment: '',
    currentLivingCd: '',
    dcsCstdy: '',
    inSchool: '',
    hasCareGiven: '',
    agedCaregiver: '',
    needsSupportsToLeaveANursingFacilityICF: '',
    possibleAbuseNeglectExploitation: '',
    needsHelpRightAwayToKeepLivingWhereTheyAre: '',
    refId: '',
    hasHarmfulBehaviors: '',
    wantsOrNeedsToMoveSoon: '',
  };

  listofSubmitters = [
    {code: 'NO', value:'None',activateSW:'Y'},
    {code: 'SE', value:'Self (person who wants services)',activateSW:'Y'},
    {code: 'FR', value:'Friend',activateSW:'Y'},
    {code: 'CLR', value:'Conservator or legal representative',activateSW:'Y'},
    {code: 'FM', value:'Family Member',activateSW:'Y'},
    {code: 'DI', value:'DIDD',activateSW:'Y'},
    {code: 'MCO', value:'MCO',activateSW:'Y'},
    {code: 'DCS', value:'Department of Child Services',activateSW:'Y'},
    {code: 'APS', value:'APS',activateSW:'Y'},
    {code: 'RM', value:'RMHI',activateSW:'Y'},
    {code: 'SP', value:'Service Provider',activateSW:'Y'},
    {code: 'OTH', value:'Other',activateSW:'Y'}
  ];

  SUMMARY_MAP = [
    {
      key: 'ageOfTheApplicant',
      value: 'Age of the applicant',
    },
    {
      key: 'hasaJob',
      value: 'Has a Job',
    },
    {
      key: 'inSchool',
      value: 'In School',
    },
    {
      key: 'hasCareGiven',
      value: 'Has Caregiver',
    },
    {
      key: 'agedCaregiver',
      value: 'Aged Caregiver',
    },
    {
      key: 'needsSupportsToLeaveANursingFacilityICF',
      value: 'Needs supports to leave a Nursing Facility / ICF',
    },
    {
      key: 'possibleAbuseNeglectExploitation',
      value: 'Possible Abuse, Neglect or Exploitation',
    },
    {
      key: 'needsHelpRightAwayToKeepLivingWhereTheyAre',
      value: 'Needs help right away to keep living where they are',
    },
    {
      key: 'hasHarmfulBehaviors',
      value: 'Has harmful behaviors',
    },
    {
      key: 'wantsOrNeedsToMoveSoon',
      value: 'Wants or needs to move soon',
    },
  ];

  USER_ROLES = [
    {
      code: 'APS',
      value: 'AAAD PAE Submitter',
      activateSW: 'Y',
    },
    {
      code: 'AS',
      value: 'AAAD Supervisor',
      activateSW: 'Y',
    },
    {
      code: 'AA',
      value: 'AAAD Administrator',
      activateSW: 'Y',
    },
    {
      code: 'OCA',
      value: 'Ops Contractor Admin',
      activateSW: 'Y',
    },
    {
      code: 'OCS',
      value: 'Ops Contractor Supervisor',
      activateSW: 'Y',
    },
    {
      code: 'KBC',
      value: 'KB Contractor',
      activateSW: 'Y',
    },
    {
      code: 'KBP',
      value: 'KB Physician',
      activateSW: 'Y',
    },
    {
      code: 'OC',
      value: 'Ops Contractor',
      activateSW: 'Y',
    },
    {
      code: 'IFPS',
      value: 'ICF Facility PAE Submitter',
      activateSW: 'Y',
    },
    {
      code: 'IFS',
      value: 'ICF Facility Supervisor',
      activateSW: 'Y',
    },
    {
      code: 'IFA',
      value: 'ICF Facility Administrator',
      activateSW: 'Y',
    },
    {
      code: 'MPS',
      value: 'MCO Submitter',
      activateSW: 'Y',
    },
    {
      code: 'MS',
      value: 'MCO Supervisor',
      activateSW: 'Y',
    },
    {
      code: 'MA',
      value: 'MCO Administrator',
      activateSW: 'Y',
    },
    {
      code: 'FPS',
      value: 'Facility PAE Submitter',
      activateSW: 'Y',
    },
    {
      code: 'FS',
      value: 'Facility Supervisor',
      activateSW: 'Y',
    },
    {
      code: 'FA',
      value: 'Facility Administrator',
      activateSW: 'Y',
    },
    {
      code: 'PPS',
      value: 'PACE Submitter',
      activateSW: 'Y',
    },
    {
      code: 'PS',
      value: 'PACE Supervisor',
      activateSW: 'Y',
    },
    {
      code: 'PA',
      value: 'PACE Administrator',
      activateSW: 'Y',
    },
    {
      code: 'DD',
      value: 'DIDD Director',
      activateSW: 'Y',
    },
    {
      code: 'DS',
      value: 'DIDD Supervisor',
      activateSW: 'Y',
    },
    {
      code: 'DIS',
      value: 'DIDD Intake Specialist',
      activateSW: 'Y',
    },
    {
      code: 'DKW',
      value: 'DIDD KB Worker',
      activateSW: 'Y',
    },
    {
      code: 'DPS',
      value: 'DIDD Submitter',
      activateSW: 'Y',
    },
    {
      code: 'DA',
      value: 'DIDD Administrator',
      activateSW: 'Y',
    },
    {
      code: 'DPAU',
      value: 'DIDD PASRR Appeals User',
      activateSW: 'Y',
    },
    {
      code: 'DN',
      value: 'DIDD Nurse',
      activateSW: 'Y',
    },
    {
      code: 'DIU',
      value: 'DIDD IARC User',
      activateSW: 'Y',
    },
    {
      code: 'DPAU',
      value: 'DMHSAS PASRR Appeals User',
      activateSW: 'Y',
    },
    {
      code: 'LAU',
      value: 'LTSS Appeals User',
      activateSW: 'Y',
    },
    {
      code: 'LAN',
      value: 'LTSS Appeals Nurse',
      activateSW: 'Y',
    },
    {
      code: 'LAUD',
      value: 'LTSS Audit User',
      activateSW: 'Y',
    },
    {
      code: 'LH',
      value: 'LTSS Helpdesk',
      activateSW: 'Y',
    },
    {
      code: 'LEU',
      value: 'LTSS Enrollment User',
      activateSW: 'Y',
    },
    {
      code: 'LN',
      value: 'LTSS Nurse',
      activateSW: 'Y',
    },
    {
      code: 'LSU',
      value: 'LTSS Superuser',
      activateSW: 'Y',
    },
    {
      code: 'LA',
      value: 'LTSS Admin',
      activateSW: 'Y',
    },
    {
      code: 'LS',
      value: 'LTSS Supervisor',
      activateSW: 'Y',
    },
    {
      code: 'LSM',
      value: 'LTSS Slot Management',
      activateSW: 'Y',
    },
    {
      code: 'LDS',
      value: 'LTSS Data Steward',
      activateSW: 'Y',
    },
    {
      code: 'LNR',
      value: 'LTSS Notices Reviewer',
      activateSW: 'Y',
    },
    {
      code: 'LRM',
      value: 'LTSS Return Mail',
      activateSW: 'Y',
    },
    {
      code: 'MSU',
      value: 'Member Services User',
      activateSW: 'Y',
    },
    {
      code: 'MSS',
      value: 'Member Services Supervisor',
      activateSW: 'Y',
    },
    {
      code: 'OGCU',
      value: 'OGC User',
      activateSW: 'Y',
    },
    {
      code: 'OGCS',
      value: 'OGC Supervisor',
      activateSW: 'Y',
    },
    {
      code: 'TRO',
      value: 'TennCare - Read Only',
      activateSW: 'Y',
    },
  ];

  REF_TYPE = [
    {
      code: 'KN',
      value: 'Katie Beckett',
      activateSW: 'Y',
    },
    {
      code: 'ECF',
      value: 'ECF',
      activateSW: 'Y',
    },
    {
      code: 'OT',
      value: 'Other',
      activateSW: 'Y',
    },
  ];

  LIVING_ARRANGEMENT = [
    {
      code: 'LTC',
      value: 'Long-term care facility — e.g., nursing home, ICF',
      activateSW: 'Y',
    },
    {
      code: 'HJC',
      value: 'Harold Jordan Center',
      activateSW: 'Y',
    },
    {
      code: 'MEN',
      value: 'Mental health residence---behavioral health group home',
      activateSW: 'Y',
    },
    {
      code: 'HOM',
      value: 'Family member’s home/own home',
      activateSW: 'Y',
    },
    {
      code: 'NON',
      value:
        'Living with non-relative e.g. apartment or house with friend or roommate(s)',
      activateSW: 'Y',
    },
    {
      code: 'JAL',
      value: 'Jail',
      activateSW: 'Y',
    },
    {
      code: 'FOS',
      value: 'Foster Home',
      activateSW: 'Y',
    },
    {
      code: 'MED',
      value: 'Medical Hospital',
      activateSW: 'Y',
    },
    {
      code: 'SHL',
      value: 'Homeless/Shelter ',
      activateSW: 'Y',
    },
    {
      code: 'HLS',
      value: 'Psychiatric hospital or unit',
      activateSW: 'Y',
    },
    {
      code: 'RMH',
      value: 'Regional Mental Health Institute',
      activateSW: 'Y',
    },
    {
      code: 'RTC',
      value: 'Residential Treatment Center for youth',
      activateSW: 'Y',
    },
    {
      code: 'SCH',
      value: 'Specialized school — e.g., school for deaf, blind',
      activateSW: 'Y',
    },
    {
      code: 'OTH',
      value: 'Other',
      activateSW: 'Y',
    },
  ];

  AGED_CAREGIVER = [
    {
      code: 'ON',
      value:
        'Can no longer care for me because they have a physical or mental health problem or disability',
      activateSW: 'Y',
    },
    {
      code: 'TW',
      value: 'Health is poor and getting worse',
      activateSW: 'Y',
    },
    {
      code: 'TH',
      value: 'None of the above',
      activateSW: 'Y',
    },
  ];

  REF_JOB_SITUATION = [
    {
      code: 'HAV',
      value: 'I have a job right now',
      activateSW: 'Y',
    },
    {
      code: 'OFF',
      value:
        'I have a job offer. I can only get the job if I have someone to help me while I am working',
      activateSW: 'Y',
    },
    {
      code: 'NED',
      value:
        'I lost my job not long ago and need help to get or keep a new job',
      activateSW: 'Y',
    },
    {
      code: 'WAN',
      value:
        'I do not have a job but I know I want to work and need help to get or keep a job',
      activateSW: 'Y',
    },
    {
      code: 'EXP',
      value:
        'I do not have a job and I am not sure about work but I am willing to explore the possibility of working',
      activateSW: 'Y',
    },
    {
      code: 'NOT',
      value: 'I am not interested in working',
      activateSW: 'Y',
    },
  ];

  INTAKE_EXTENSION = [
    {
      code: 'FAM',
      value: 'Family Requested Additional Time',
      activateSW: 'Y',
    },
    {
      code: 'DOC',
      value: 'Waiting for Requested Documentation',
      activateSW: 'Y',
    },
  ];

  ASSIGN_ENTITY = [
    {
      code: 'AME',
      value: 'MCO - Amerigroup',
      activateSW: 'Y',
    },
    {
      code: 'BLU',
      value: 'MCO - BlueCare',
      activateSW: 'Y',
    },
    {
      code: 'UNT',
      value: 'MCO - UnitedHealthcare',
      activateSW: 'Y',
    },
    {
      code: 'DID',
      value: 'DIDD',
      activateSW: 'Y',
    },
  ];

  userTypeCd = [
    { code: 'MCO', taskMasterId: 1, activateSW: 'Y' },
    { code: 'NRS', taskMasterId: 3, activateSW: 'Y' },
    { code: 'IRC', taskMasterId: 4, activateSW: 'Y' }
  ];


  assignEntityList = [
    {code: 'AME', value:'MCO - Amerigroup',activateSW:'Y'},
    {code: 'BLU', value:'MCO - BlueCare',activateSW:'Y'},
    {code: 'UNT', value:'MCO - UnitedHealthcare',activateSW:'Y'},
    {code: 'DID', value:'DIDD',activateSW:'Y'}
  ];


  refId: any;
  chmTypeCd:any;
  taskMasterId: any;
  taskId: number;
  assignedUser: any;
  intakeActionsExtension: any;
  scheduleVisit: any;
  reassignment: any;
  enterIntakeOutcome: any;
  customValidation = customValidation;
  taskMasterIdValue: any;
  entityId: any;
  userType: any;

  // boolean
  headerApiComplete = false;
  summaryApiComplete = false;
  intakeActionExtensionCompleted = false;
  intakeActionsSubmitted = false;
  intakeActionsExtensionDataExists = false;
  reassignmentCompleted = false;
  reassignmentSubmitted = false;
  reassignmentDataExists = false;
  headerApiError = false;
  summaryApiError = false;
  disableRequestForExtensionButton = false;
  disableRequestForExtensionDiv = false;
  returnForReassignmentButton = false;
  returnForReassignmentDiv = false;
  pastDueDt = false;

  // Maps
  summaryMap = new Map();
  yesNoMap = new Map();
  extensionReasonMap = new Map();
  assignedEntityMap = new Map();
  userTypeCdMap = new Map();
  livingArrangementMap = new Map();

  // Subscriptions
  subscription1$: Subscription;
  subscription2$: Subscription;
  subscription3$: Subscription;
  subscription4$: Subscription;
  subscription5$: Subscription;
  subscription6$: Subscription;
  subscription7$: Subscription;
  subscription8$: Subscription;

  subscriptions: Subscription[] = [];

  // Forms
  extensionReasonForm: FormGroup;
  reassignmentForm: FormGroup;

  constructor(
    public router: Router,
    public dialog: MatDialog,
    private referralService: ReferralService,
    private intakeActionsService: IntakeActionsService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private rightnavToggleService: RightnavToggleService
  ) { }

  ngOnInit() {
    this.rightnavToggleService.setRightnavFlag(false);
    this.assignedUser = '';
    this.refId = this.referralService.getRefId();
    console.log('@@', this.refId);
    this.chmTypeCd=this.referralService.getChmType();
    if(!this.chmTypeCd){
      this.taskMasterId = this.referralService.getTaskQueue() ||  this.referralService.getRowElement().taskQueue;
      this.taskId = this.referralService.getTaskId() || this.referralService.getRowElement().taskId;
      this.assignedUser = this.referralService.getAssignedUser() || this.referralService.getRowElement().assignedUserId;
    }
    console.log('Task Queue' + (this.taskMasterId) + ' Task Id' + (this.taskId));
    this.getHeaderAndSummaryData();
    this.setMaps();
    this.prepareUserTypeCd();
    this.getAccordionData();
  }
  setMaps() {
    for (const summary of this.SUMMARY_MAP) {
      this.summaryMap.set(summary.key, summary.value);
    }

    for (const livingArrangement of this.LIVING_ARRANGEMENT){
      this.livingArrangementMap.set(livingArrangement.code, livingArrangement.value);
    }

    for (const extensionReason of this.INTAKE_EXTENSION) {
      this.extensionReasonMap.set(extensionReason.code, extensionReason.value);
    }

    for (const assignedEntity of this.ASSIGN_ENTITY) {
      this.assignedEntityMap.set(assignedEntity.code, assignedEntity.value);
    }

    for (const submitter of this.listofSubmitters) {
      this.mapForSubmitter.set(submitter.code, submitter.value);
    }

    this.yesNoMap.set('Y', 'Yes');
    this.yesNoMap.set('N', 'No');
  }
  getHeaderAndSummaryData() {
    this.subscription1$ = this.intakeActionsService
      .getIntakeActionsHeader(this.refId)
      .subscribe((intakeActionsHeaderResponse) => {
        if (intakeActionsHeaderResponse !== null) {
          this.HEADER_DATA = intakeActionsHeaderResponse;
          const intakeDueDt = new Date(this.HEADER_DATA.intakeDueDt);
          let today = new Date();
          if(today > intakeDueDt){
            this.pastDueDt = true;
          }
          else if(today < intakeDueDt){
            this.pastDueDt = false;
          }
          this.headerApiComplete = true;
          const tempObj = {
            aplId: null,
            paeId: null,
            applicantName: this.HEADER_DATA.firstName + ' ' + this.HEADER_DATA.lastName,
            prsnId: this.HEADER_DATA.personId ? this.HEADER_DATA.personId : null,
            refId: this.HEADER_DATA.refId ? this.HEADER_DATA.refId : null
          };
          this.rightnavToggleService.setRightnavFlag(true);
          this.rightnavToggleService.setRightnavData(tempObj);
          this.referralService.setAssignedEntity(this.HEADER_DATA.entityName);
        }
        if (intakeActionsHeaderResponse === null) {
          this.headerApiComplete = true;
          this.HEADER_DATA = '';
        }
      }, err => {
        this.headerApiComplete = false;
        this.headerApiError = true;
      });
    this.subscriptions.push(this.subscription1$);

    this.subscription2$ = this.intakeActionsService
      .getIntakeActionsSummary(this.refId)
      .subscribe((intakeActionsSummaryResponse) => {
        if (intakeActionsSummaryResponse !== null) {
          this.summaryApiComplete = true;
          this.SUMMARY_DATA = intakeActionsSummaryResponse;
        }
        if (intakeActionsSummaryResponse === null) {
          this.summaryApiComplete = true;
          this.summaryApiError = true;
        }
      }, err => {
        this.summaryApiComplete = false;
        this.summaryApiError = true;
      });
    this.subscriptions.push(this.subscription2$);
  }

  getSSNMask(ssn: string) {
    if (ssn) {
      const formstring = ssn.substr(0,3) + '-' + ssn.substr(3,2) + '-' + ssn.substr(5,4);
      return formstring;
    }
  }

  getAccordionData() {
    this.subscription3$ = this.intakeActionsService
      .getIntakeActionsExtension(this.refId)
      .subscribe((intakeActionsExtensionResponse) => {
        this.intakeActionsExtension = intakeActionsExtensionResponse;
        if (intakeActionsExtensionResponse !== undefined) {
          if (intakeActionsExtensionResponse != null) {
            if (!intakeActionsExtensionResponse.hasOwnProperty('errorCode')) {
              this.intakeActionsExtension = intakeActionsExtensionResponse;
              this.initializeExtensionForm();
              this.intakeActionExtensionCompleted = true;
              if (intakeActionsExtensionResponse.flag
                && intakeActionsExtensionResponse.flag === 'Y') {
                this.intakeActionsExtensionDataExists = true;
                this.disableRequestForExtensionButton = true;
              }
              if (this.referralService.getUserTypeCd()
                && (this.referralService.getUserTypeCd() === 'NRS'
                  || this.referralService.getUserTypeCd() === 'IRC')) {
                this.disableRequestForExtensionDiv = true;
              }
            }
          }
          if (intakeActionsExtensionResponse === null) {
            this.initializeExtensionForm();
            this.intakeActionExtensionCompleted = true;
          }
        }
      }, err => {
        this.initializeExtensionForm();
        this.intakeActionExtensionCompleted = true;
      });
    this.subscriptions.push(this.subscription3$);

    this.subscription4$ = this.intakeActionsService
      .getIntakeActionsReassignment(this.refId)
      .subscribe((reassignmentResponse) => {
        this.reassignment = reassignmentResponse;
        if (reassignmentResponse !== undefined) {
          if (reassignmentResponse !== null) {
            if (!reassignmentResponse.hasOwnProperty('errorCode')) {
              this.reassignment = reassignmentResponse;
              this.initializeReassignmentForm();
              this.returnForReassignmentButton = true;
              if (reassignmentResponse.flag
                && reassignmentResponse.flag === 'Y') {
                this.reassignmentDataExists = true;
                // this.returnForReassignmentButton = true;
              }
              if (this.referralService.getUserTypeCd()
                && (this.referralService.getUserTypeCd() === 'NRS'
                  || this.referralService.getUserTypeCd() === 'IRC')) {
                this.returnForReassignmentDiv = true;
              }
            }
            if (reassignmentResponse.hasOwnProperty('errorCode')) {
              this.initializeReassignmentForm();
              this.reassignmentDataExists = false;
            }
            this.reassignmentCompleted = true;
          }
          if (reassignmentResponse === null) {
            this.initializeReassignmentForm();
            this.reassignmentCompleted = true;
          }
        }
      }, err => {
        this.initializeReassignmentForm();
        this.reassignmentCompleted = true;
      });
    this.subscriptions.push(this.subscription4$);
  }


  initializeExtensionForm() {
    this.extensionReasonForm = this.fb.group({
      extsnRsnCd: ['', [Validators.required]],
    });
    this.intakeActionExtensionCompleted = true;
    if (this.intakeActionsExtension !== undefined) {
      if (this.intakeActionsExtension !== null) {
        if (!(this.intakeActionsExtension.hasOwnProperty('errorCode'))) {
          this.extensionReasonForm.patchValue(this.intakeActionsExtension);
        }
      }
    }
  }

  intakeExtensionSubmitted() {
    this.intakeActionsSubmitted = true;
    if (this.extensionReasonForm.valid) {
      this.subscription7$ = this.intakeActionsService
        .postRequestExtension({ ...this.extensionReasonForm.value, refId: this.refId, taskId: this.taskId })
        .subscribe((postRequestExtensionResponse) => {
          console.log('success');
          this.intakeActionsExtensionDataExists = true;
          this.router.navigate(['/ltss/referral/referralDashboard']);
        }, err => {
          console.log('error');
        });
      this.subscriptions.push(this.subscription7$);
    }
  }

  initializeReassignmentForm() {
    if(this.taskMasterId === 2){
      this.reassignmentForm = this.fb.group({
        reassmntRsnTxt: [
          '',
          [
            Validators.required,
            Validators.maxLength(2000),
            Validators.pattern('^[A-Za-z0-9 ]+$'),
          ],
        ],
        assignedEntityCd: ['', [Validators.required]],
        ltssRsnTxt: [
          '',
          [
            Validators.required,
            Validators.maxLength(2000),
            Validators.pattern('^[A-Za-z0-9 ]+$'),
          ],
        ],
      });
    } else {
      this.reassignmentForm = this.fb.group({
        reassmntRsnTxt: [
          '',
          [
            Validators.required,
            Validators.maxLength(2000),
            Validators.pattern('^[A-Za-z0-9 ]+$'),
          ],
        ],
        assignedEntityCd: [''],
        ltssRsnTxt: [''],
      });
    }
    this.reassignmentCompleted = true;
    if (this.reassignment !== undefined) {
      if (this.reassignment !== null) {
        if (!(this.reassignment.hasOwnProperty('errorCode'))) {
          this.reassignmentForm.patchValue(this.reassignment);
        }
      }
    }
  }

  reassignmentSubmit() {
    this.reassignmentSubmitted = true;
    if (this.reassignmentForm.valid) {
      this.subscription8$ = this.intakeActionsService
        .postReassignment({ ...this.reassignmentForm.value, refId: this.refId, taskId: this.taskId, taskMasterId: this.taskMasterId })
        .subscribe((postReassignmentResponse) => {
          console.log('success');
          this.reassignmentDataExists = true;
          this.router.navigate(['/ltss/referral/referralDashboard']);
        }, err => {
          console.log('error');
        });
      this.subscriptions.push(this.subscription8$);
    }
  }


  openDocument() {
    window.open("http://www.africau.edu/images/default/sample.pdf", '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes');
  }

  getExtensionFormData() {
    return this.extensionReasonForm.controls;
  }

  getReassignmentFormData() {
    return this.reassignmentForm.controls;
  }

  // Events and Checkboxes
  extensionReason($event) { }

  prepareUserTypeCd() {
    this.taskMasterIdValue = this.referralService.getRowElement().taskQueue;
    this.entityId = this.referralService.getRowElement().entityId;

    console.log(this.referralService.getRowElement().taskQueue);
    console.log(this.referralService.getRowElement().entityId);

    for (const code of this.userTypeCd) {
      this.userTypeCdMap.set(code.taskMasterId, code.code);
    }
    console.log("userTypeCdMap", this.userTypeCdMap.get(this.taskMasterIdValue));
    this.userType = this.userTypeCdMap.get(this.taskMasterIdValue);
    let entityName = this.referralService.getAssignedEntity();
    let chmType = this.referralService.getChmType();
    let localStorageLocal = localStorage.getItem('APP_STORAGE_TOKEN');
    let entityID = JSON.parse(localStorageLocal).entityId;
    let entityNameForCM = JSON.parse(localStorageLocal).entityName;
    console.log(this.referralService.getAssignedEntity());
    if (this.taskMasterIdValue === 1 || this.taskMasterIdValue === 6) {
      // if (this.entityId === 4001) {
      //   this.userType = 'AME';
      // } else if (this.entityId === 4002) {
      //   this.userType = 'BLU'
      // } else if (this.entityId === 4003) {
      //   this.userType = 'UNT'
      // } else if (this.entityId === 7001) {
      //   this.userType = 'DID'
      // } else {
      //   this.userType = null
      // }
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
    } else if (this.taskMasterIdValue === 3) {
      this.userType = 'NRS';
    } else if (this.taskMasterIdValue === 4) {
      this.userType = 'IRC';
    } else if(chmType === 'CRFI' && (this.taskMasterIdValue === undefined || this.userType === undefined)){
        if(entityNameForCM === 'Amerigroup'){
          this.userType = 'AMU';
        }
        else if (entityNameForCM === 'BlueCare') {
            this.userType = 'BLU'
        }
        else if (entityNameForCM === 'UnitedHealthcare') {
            this.userType = 'UNT'
        }
        else if (entityNameForCM === 'DIDD') {
          this.userType = 'DID'
        } else {
          this.userType = null
        }
    }
    else if (this.taskMasterIdValue === undefined || this.userType === undefined) {
      this.userType = null;
    }

    this.referralService.setUserTypeCd(this.userType);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    console.log('Unsubscribed');
  }



  openHCBS() {
    const dialogRef = this.dialog.open(HcbsBenefitsComponent, {
      width: 'auto',
      height: 'auto',
      autoFocus: false,
      maxHeight: '90vh',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
