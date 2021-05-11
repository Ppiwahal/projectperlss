import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ReferenceTable, ReferenceTables } from '../../_shared/utility/ReferenceTables';
import { EnrPatientLiabilityDetails } from '../../_shared/model/EnrPatientLiabilityDetails';
import { EnrDisenrollmentData } from '../../_shared/model/EnrDisenrollmentData';
import { EnrollmentData } from '../../_shared/model/EnrollmentData';
import { LiabilityPopupComponent } from '../liability-popup/liability-popup.component';
import { EnrollmentDetailsService } from '../../core/services/enrollment/enrollment-details.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { MatTableDataSource } from '@angular/material/table/table-data-source';
import { PaeCommonService } from 'src/app/core/services/pae/pae-common/pae-common.service';
import { DatePipe } from '@angular/common';
import { MatRadioChange } from '@angular/material/radio';
import { Router } from '@angular/router';
import { PatientLiabilityService } from 'src/app/core/services/enrollment/patient-liability/patient-liability.service';
import { MmisVerifyEligibilityLookupPopupComponent } from 'src/app/mmis-verify-eligibility-lookup-popup/mmis-verify-eligibility-lookup-popup.component'
import { ToastrService } from 'ngx-toastr';
import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import * as customValidation from 'src/app/_shared/constants/validation.constants';
import * as Constants from '../../_shared/constants/application.constants';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-enrollment-details',
  templateUrl: './enrollment-details.component.html',
  styleUrls: ['./enrollment-details.component.scss'],
})
export class EnrollmentDetailsComponent implements OnInit {
  myForm: FormGroup;
  enrDetailsForm: FormGroup;
  subscriptions: Subscription[] = [];
  applicationInformation: any;
  financialEligibilityData: any;
  enrollmentDetailData: any;
  enrollmentData: any;
  fileErrors: any;
  progressValue: any;
  opaInformation: any;
  disenrollmentDetail: any;
  effectivePateintLbltyDt1: string;
  files = [];
  customValidation = customValidation;
  submitted = false;
  isShown = false;
  showFiles = false;
  isDisenrollmentTask: boolean;
  chmDisenrollmentData: any;
  lookupData: any;
  enrGroup: string;
  showEndDt: boolean;
  showDateFields: boolean;
  displayFeEditButton = true;
  displaySpinner = false;
  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'indeterminate';
  value = 50;
  enrBenefitDataSource: MatTableDataSource<any>;
  enrSummaryDataSource: MatTableDataSource<any>;
  isTransitionReviewDropDownToggled = false;
  displayedBenefitColumns: string[] = ['description', 'group', 'amount', 'effectiveDate', 'endDate', 'userAction'];
  displayedSummaryColumns: string[] = ['group', 'startDate', 'endDate', 'status', 'date', 'recordId'];
  displayedChoicesGroupTble: string[] = [
    'Description',
    'Group',
    'Amount',
    'Effective Date',
    'End Date',
    'User Actions',
  ];
  choicesGroupDataSource = CHOICES_GROUP_DATA;
  authorizationStatusRT: ReferenceTable[] = [
    { code: 'APP', description: 'Approved' },
    { code: 'DEN', description: 'Denied' },
    // { code: 'RES', description: 'Enroll in Reserve Slot' },
    // { code: 'WAT', description: 'Add to Waiting List' },
    { code: 'CAN', description: 'Canceled' },
    { code: 'WIT', description: 'Withdrawn' },
    { code: 'DIS', description: 'Disenrolled' }
  ];
  medicaidEligibilityRt: ReferenceTable[] = [
    { code: 'NE', description: 'Approved' },
    { code: 'IN', description: 'In Progress' },
    { code: 'DN', description: 'Denied' },
    { code: 'CO', description: 'Complete' }
  ];

  disenrollmentTypeRT: ReferenceTable[] =
    [{ code: 'VOL', description: 'Voluntary Disenrollment' },
    { code: 'INV', description: 'Involuntary Disenrollment' }];

  denialReasonCdRT: ReferenceTable[] =
    [{ code: 'DEC', description: 'Deceased' },
    { code: 'ELI', description: 'Eligible for Medicaid only – asset transfer penalty for NF vendor payments' },
    { code: 'NOT', description: 'Not Medicaid Eligible in SSI or institutional category' },
    { code: 'EXP', description: 'Expired PAE' },
    { code: 'TPO', description: 'Does Not Meet Target Population (Elderly/Physically Disabled) - A doctor diagnosed a chronic physical health condition that limits your movement' },
    { code: 'YHP', description: 'Does Not Meet Target Population (Elderly/Physically Disabled) - You have problems doing daily activities like walking or moving from a bed to a chair.' },
    { code: 'TPS', description: 'Non-SSI and Does Not Meet Target Population - A doctor diagnosed a chronic physical health condition that limits your movement' },
    { code: 'YHS', description: 'Non-SSI and Does Not Meet Target Population - You have problems doing daily activities like walking or moving from a bed to a chair' },
    { code: 'SSI', description: 'Not an Active SSI Recipient (Group 3)' },
    { code: 'NOS', description: 'Non-SSI and Does not meet TP (Group 3)' },
    { code: 'MED', description: 'Not Medicaid Eligible in SSI or institutional category (Group 2)' },
    { code: 'OVR', description: 'Over the Cost Neutrality Cap' },
    { code: 'ENR', description: 'Enrollment Target Met – Doesn’t meet specified expectations' },
    { code: 'SAF', description: 'Safety' },
    { code: 'MOV', description: 'Moved out of service area' },
    { code: 'TAR', description: 'Does not meet target pop/Does not meet target criteria (Elderly/Physically Disabled)' },
    { code: 'SIR', description: 'Not an Active SSI Recipient' },
    { code: 'HAR', description: 'Harold Jordan Center 90 day requirement' }];

  disenrollementReasonRT: ReferenceTable[] =
    [{ code: 'MDE', description: 'Member Deceased' },
    { code: 'HOS', description: 'Election of Hospice Services in a NF' },
    { code: 'NFD', description: 'NF discharge (Group 1 only)' },
    { code: 'DEN', description: 'Denied PAE and no longer meets LOC (NF LOC or At Risk)' },
    { code: 'COS', description: 'Cannot safetly meet needs within Cost Neutrality/Expenditure Cap, refusal of alternative services, including NF or ICF/IID as applicable' },
    { code: 'SAF', description: 'Cannot safely meet needs (HCBS only)' },
    { code: 'NTC', description: 'Member is not receiving TennCare reimbursed Long Term Services and Supports' },
    { code: 'NON', description: 'Non-payment of patient liability and member cannot transfer to another MCO' },
    { code: 'STA', description: 'Moved out of State' },
    { code: 'DCS', description: 'DCS Custody' },
    { code: 'COT', description: 'Cost exceeds Institution' },
    { code: 'NOS', description: 'I don’t want/ need long-term care anymore.' },
    { code: 'PAY', description: 'I don’t want to pay part of the cost of my long- term care (called patient liability)' },
    { code: 'HOM', description: 'I don’t want my home or things I own (my estate) to be used to pay TennCare back for my long-term care after my death. Services I may have to pay back include nursing home care and home care (or HCBS). It’s called “estate recovery,” and it’s part of federal law.' },
    { code: 'HNF', description: 'I don’t want home and community-based (HCB)  services. I want care in a NF or ICF/ IID.' },
    { code: 'MED', description: '[insert child’s name] doesn’t want/ need Medicaid, including Katie Beckett Part A services.' },
    { code: 'PRE', description: 'I don’t want to pay premiums for [insert child’s name] to be in Katie Beckett Part A.' },
    { code: 'OTH', description: 'Other' },
    { code: 'DET', description: 'Disenrolled due to transition' }
    ]

  ltssDscnRT: ReferenceTable[] =
    [{ code: 'APP', description: 'Approved' }, { code: 'DEN', description: 'Denied' }]
  isFinancialEligibilityDropDownToggled = false;
  isEnrollmentDetailsDropDownToggled = false;
  isEnrollmentSummaryDropDownToggled = false;
  isAuthorizationDenied = false;
  paeId: string;
  enrId: string ;
  showSpinner = false;
  enrStatus: any;
  showTransitions = false;
  enrSummary = false;
  isEnrolled = false;
  ischeckEligiblity = false;
  subscriptions1$: Subscription;
  subscriptions2$: Subscription;
  subscriptions3$: Subscription;
  startDate = new Date();
  constructor(private fb: FormBuilder,
    public dialog: MatDialog,
    private enrDetailService: EnrollmentDetailsService,
    private paeCommonService: PaeCommonService,
    public datePipe: DatePipe,
    private router: Router,
    public patientLiabilityService: PatientLiabilityService,
    private toastr: ToastrService) {
  }
  getLookupData() {
    const req = {
      messageHeader: {
        dateTimestamp:  '2021-02-02T19:09:55.680',
        OriginatorId: 'PRL',
        TransactionId: 'PRL',
      },
      personalInformation: {
        personId:  this.applicationInformation.prsnId, // 1000000020,
        ssn:  this.applicationInformation.ssn //"888888888"
      }
    }
    this.enrDetailService.getMmisLookupData(req).subscribe(data => {
      this.lookupData = data;
      // this.enrDetailService.getEntityAssociation(this.applicationInformation.prsnId).subscribe(res => {
      //   this.lookupData.infoTableData = res
      // })
       this.enrDetailService.getMCOInfo(this.applicationInformation.prsnId).subscribe(res => {
      //this.enrDetailService.getMCOInfo(1000000064).subscribe(res => {
        this.lookupData.infoTableData = res
      })
    })
  }

  mmisPopup() {

    const dialogConfig = new MatDialogConfig();
    if(this.lookupData && this.applicationInformation){
    this.lookupData.personId = this.applicationInformation.prsnId;
    this.lookupData.ssn = this.getSSNMask(this.applicationInformation.ssn);
    this.lookupData.grandfathered = this.applicationInformation.grandfatheredSw;
    }
    dialogConfig.data = { route: 'ltss/pae', lookupData: this.lookupData };
    // dialogConfig.data = { route: 'ltss/pae' , nextRoute: '/ltss/pae/paeStart/' + this.nextPath };
    dialogConfig.panelClass = 'exp_popup';
    dialogConfig.width = '80vw';
    dialogConfig.height = '80vh';
    dialogConfig.autoFocus = false;
    this.dialog.open(MmisVerifyEligibilityLookupPopupComponent, dialogConfig);

  }

  enrollmentStatusResponseCode: ReferenceTable[] = [
    { code: 'NEE', description: 'New' },
    { code: 'PRO', description: 'In Progress' },
    { code: 'MOP', description: 'Pending MOPD' },
    { code: 'PDD', description: 'Pending Discharge Date' },
    { code: 'PFE', description: 'Pending Financial Eligibility' },
    { code: 'PTD', description: 'Pending Transition Date' },
    { code: 'SSI', description: 'Pending SSI Resolution' },
    { code: 'ENR', description: 'Enrolled' },
    { code: 'DEN', description: 'Denied' },
    { code: 'WNF', description: 'Withdrawn by NF' },
    { code: 'WMC', description: 'Withdrawn by MCO/AAAD' },
    { code: 'ERS', description: 'Enrolled in Reserve Slot' },
    { code: 'RWL', description: 'Referred to Waiting List' },
    { code: 'DIS', description: 'Disenrolled' }
  ];

  slotStatusResponseCode: ReferenceTable[] = [
    { code: 'PEV', description: 'Pending Evaluation' },
    { code: 'UNA', description: 'Unallocated' },
    { code: 'EXC', description: 'Exception' },
    { code: 'MIP', description: 'Match In Progress' },
    { code: 'AVA', description: 'Available' },
    { code: 'HEL', description: 'Held' },
    { code: 'FIL', description: 'Filled' },
    { code: 'TIP', description: 'Internal Transition In Progress' },
    { code: 'ETR', description: 'External Transition Requested' },
    { code: 'ETC', description: 'External Transition Complete' },
    { code: 'POC', description: 'Pending Over Capacity' },
    { code: 'EOC', description: 'Enrolled Over Capacity' },
    { code: 'REL', description: 'Released' },
    { code: 'VAC', description: 'Vacated' },
    { code: 'WAI', description: 'On Waiting List' },
    { code: 'RRL', description: 'Removed from Referral List' },
    { code: 'REF', description: 'On Referral List' }
  ];

  appealFiledResponseCode: ReferenceTable[] = [
    { code: 'Y', description: 'Yes' },
    { code: 'N', description: 'No' }
  ];

  grandfatheredResponseCode: ReferenceTable[] = [
    { code: 'Y', description: 'Yes' },
    { code: 'N', description: 'No' }
  ];
  taskQueue=this.paeCommonService.getTaskQueue();
  isdataSaved = false;
  isFinancial = false;
  yesSelected = false;
  noSelected = false;
  isAppeal = false;


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
    this.enrGroup=  this.paeCommonService.getProgramName();
    console.log("Program Code "+this.enrGroup);
    console.log("Pae ID Code "+this.paeId);
    console.log("Task queue "+this.paeCommonService.getTaskQueue());
    if(this.paeCommonService.getTaskQueue()!=undefined && this.paeCommonService.getTaskQueue()===69){
      this.isDisenrollmentTask = true;
    }
    const element = document.getElementById('pM');
    if (element !== null) {
        element.scrollIntoView(true);
      }
    //this.isDisenrollmentTask = true;
    //this.paeId='PAE100000818';
    //this.enrId='100000042';
    this.myForm = this.fb.group({
      patientLibltyAmnt: [''],
      ctgryEligDesc: [{value:'',disable: true}],
      ctgryEligBeginDt: [{value:'',disable: true}],
      ctgryEligEndDt: [{value:'',disable: true}],
      patientLbltyStartDt: [{value:'',disable: true}],
      amount: [''],
      authStatusCd: [null],
      enrStartDt: [null],
      enrEndDt: [null],
      enrDenialRsnCd: [null],
      disEnrTypeCd: [null],
      dsnReasonCd: [null],
      ltssDscnCd: [null],
      disEnrDt: [null],
      comments: [null]

    });
    this.getEnrollmentData();
    this.transitionData();
    
  }
  getFormData() {
    return this.myForm.controls;
  }

  onClickCheckFinancialElgbltyBtn() {
    this.myForm.get('ctgryEligDesc').disable();
    this.myForm.get('patientLbltyStartDt').disable();
    this.myForm.get('ctgryEligBeginDt').disable();
    this.myForm.get('ctgryEligEndDt').disable();
    this.myForm.get('amount').disable();
    this.subscriptions2$ = this.enrDetailService
      .checkFinancialEligibility(this.enrId)
      .subscribe((response) => {
        if(response !== null)
        {
          this.isFinancial = true;
          this.isdataSaved = true;
        } else if(response === null)
        {
          this.isFinancial = false;
          this.ischeckEligiblity = true;
        }
        this.financialEligibilityData = response;
        this.patchFinancialEligibility();
      }, (error) => {
        console.log("error");
      });

      this.subscriptions.push(this.subscriptions2$);
  }

  patchFinancialEligibility(){
      if(this.financialEligibilityData!=undefined && this.financialEligibilityData!=null
        && this.financialEligibilityData.enrFinancialEligibilityVO!=null 
        && this.financialEligibilityData.enrPatientLbltyDtlVO!=null){
        this.myForm.patchValue({ 
          patientLbltyStartDt: this.financialEligibilityData.enrPatientLbltyDtlVO.patientLbltyStartDt,
          ctgryEligBeginDt: this.financialEligibilityData.enrFinancialEligibilityVO.ctgryEligBeginDt,
          ctgryEligDesc: this.financialEligibilityData.enrFinancialEligibilityVO.ctgryEligDesc,
          ctgryEligEndDt: this.financialEligibilityData.enrFinancialEligibilityVO.ctgryEligEndDt,
          amount: this.financialEligibilityData.enrFinancialEligibilityVO.patientLiabilityAmount
        });
      }
  }
  onLtssDecision(event) {
    if(event=='APP'){
      this.showEndDt=true;
    }else {
      this.showEndDt=false;
    }
  }
  covertDate(date: string): string{
    let convertedDate: string = this.datePipe.transform(date, 'MM/dd/yyyy');
    console.log('convertedDate '+convertedDate);
    return convertedDate;
  }

  editFinancialEligibility() {
    this.displayFeEditButton = false;
    this.myForm.get('ctgryEligDesc').enable();
    this.myForm.get('patientLbltyStartDt').enable();
    this.myForm.get('ctgryEligBeginDt').enable();
    this.myForm.get('ctgryEligEndDt').enable();
    this.myForm.get('amount').enable();
  }

  saveFinancialEligibility() {
    this.submitted = true;
    this.displaySpinner = true;
    this.displayFeEditButton= true;
    let amount=this.getFormData().amount.value;
    amount = amount.replace('$', '')
    const patientliabilityDetails = new EnrPatientLiabilityDetails(
      '',
      this.enrId,
      this.getFormData().ctgryEligDesc.value,
      this.getFormData().ctgryEligBeginDt.value,
      this.getFormData().ctgryEligEndDt.value,
      this.getFormData().patientLbltyStartDt.value,
      amount);

    const reponse = this.enrDetailService.editFinancialEligibilityDetails(patientliabilityDetails);
    this.myForm.get('ctgryEligDesc').disable();
    this.myForm.get('patientLbltyStartDt').disable();
    this.myForm.get('ctgryEligBeginDt').disable();
    this.myForm.get('ctgryEligEndDt').disable();
    this.myForm.get('amount').disable();
    this.isdataSaved = true;
  }
 
  

  onViewPatientLiabilityDetails() {
    this.patientLiabilityService.setEnrId(this.enrId);
    this.dialog.open(LiabilityPopupComponent, {
      width: '75%',
      height: 'auto',
      autoFocus: false,
      maxHeight: '90vh',
    });
  }

  transitionData()
  {
    console.log(this.taskQueue);
    if(this.taskQueue === '64' || '66' || '68')
    {
      this.showTransitions = true;
    }
    else{
      this.showTransitions = false;
    }
  }

  getEnrollmentData() {
    this.enrDetailService.getEnrollmentData(this.paeId)
      .subscribe((response) => {
        if (response.errorcode) {
          this.toastr.error("Enrollment Data not Found");
        } else {
        this.enrollmentData = response;
        //console.log("receivedData" + JSON.stringify(this.enrollmentData));
        this.applicationInformation = this.enrollmentData.enrollmentApplicantInfoVO;
        //this.enrStatus = this.applicationInformation.enrStatusCdDesc;
        this.enrId = this.applicationInformation.enrId;
        console.log('Enr ID '+this.enrId);
        if(this.enrollmentData.opaacuityScoreResponse!=null){
          this.opaInformation = this.enrollmentData.opaacuityScoreResponse.cases[0].rel_adj[0];
        }
        this.enrBenefitDataSource = this.enrollmentData.enrBnftVOList;
        this.enrSummaryDataSource = this.enrollmentData.enrSummaryTableVOList;
        this.disenrollmentDetail = this.enrollmentData.enrDsnrDtlVO;
        this.enrollmentDetailData = this.enrollmentData.enrDetailsSummaryVO;
        this.financialEligibilityData = this.enrollmentData.feLookupResponseVO;
        if(this.financialEligibilityData !== null)
        {
          this.isFinancial = true;
          this.isdataSaved = true;
        } else if(this.financialEligibilityData === null)
        {
          this.isFinancial = false;
          this.ischeckEligiblity = true;
        }
        this.patchFinancialEligibility();

        if(this.isDisenrollmentTask) {
          this.myForm.patchValue({ 
            authStatusCd: this.enrollmentData.enrollmentDetailsVO.authStatusCd,
            enrStartDt: this.covertDate(this.enrollmentData.enrollmentDetailsVO.enrStartDt),
            enrEndDt: this.covertDate(this.enrollmentData.enrollmentDetailsVO.enrEndDt),
            enrDenialRsnCd: this.enrollmentData.enrollmentDetailsVO.enrDenialRsnCd,
              comments: this.enrollmentData.enrollmentDetailsVO.comments
            });
            if (this.enrollmentData.enrollmentDetailsVO.authStatusCd == 'DEN') {
              this.isAuthorizationDenied = true;
            }
         this.myForm.get('authStatusCd').disable();
         this.myForm.get('enrStartDt').disable();
         this.myForm.get('enrEndDt').disable();
         this.myForm.get('enrDenialRsnCd').disable();
         this.myForm.get('comments').disable();
        }
        this.getLookupData();
        this.myForm.patchValue(this.enrollmentData); 
        this.myForm.patchValue(this.enrollmentData.enrollmentDetailsVO) 
        }

        if(this.isDisenrollmentTask) {
          this.chmDisenrollmentData= this.getChmDisenrollmentDetails();
          
        }
      }, (error) => {
        console.log("error");
      });
  }

  getChmDisenrollmentDetails() {
    
    this.enrDetailService
      .getChmDisenrollmentDetails(this.enrId)
      .subscribe((response) => {
        this.chmDisenrollmentData = response;
        console.log("response--->" +this.chmDisenrollmentData);
        this.myForm.patchValue({ disEnrTypeCd: this.chmDisenrollmentData.disenrTypeCd});
        this.myForm.patchValue({ dsnReasonCd: this.chmDisenrollmentData.disenrRsnCd });
      }, (error) => {
        console.log("error");
      });
      
  }

  onDisenrollmentSubmit() {
    const enrDisenrollmentData = new EnrDisenrollmentData(
      '',
      this.enrId,
      //this.getFormData().authDt.value,
      '',
      //this.getFormData().authUserId.value,
      null,
      this.getFormData().disEnrDt.value,
      this.getFormData().dsnReasonCd.value,
      this.getFormData().ltssDscnCd.value,
      this.getFormData().disEnrTypeCd.value);
    const reponse = this.enrDetailService.saveDisEnrollmentDetails(enrDisenrollmentData);
   
    this.router.navigate(['ltss/enrollmentDashboard']);
   
  }

  toggleDropDown(dropDown) {
    if (dropDown === 'financialEligibilityCriteria') {
      this.isFinancialEligibilityDropDownToggled = !this
        .isFinancialEligibilityDropDownToggled;
    } else if (dropDown === 'enrollmentDetailsDropDown') {

      this.isEnrollmentDetailsDropDownToggled = !this
        .isEnrollmentDetailsDropDownToggled;
    } else if (dropDown === 'enrollmentSummaryDropdown') {
      this.isEnrollmentSummaryDropDownToggled = !this
        .isEnrollmentSummaryDropDownToggled;
    }
    if(dropDown === 'transitionReviewCriteria'){
      this.isTransitionReviewDropDownToggled = !this.isTransitionReviewDropDownToggled;
    }

  }

  onAlternateNameChange(mrChange: MatRadioChange) {
    if (mrChange.value === 'N') {
      this.noSelected = true;
    }
    else if (mrChange.value === 'Y') {
      this.yesSelected = true;
    }
  }

  fileBrowseHandler(files) {
    this.fileErrors = {};
    for (const file of files) {
      this.progressValue = file.progress;
      file.progress = 0;
      if (file.size >= 2 * 1024 * 1024) {
        this.fileErrors.maxSizeErr = true;
      } else if (file.name.length > 30) {
        this.fileErrors.fileNameErr = true;
      } else {
        this.files.push(file);
      }
    }
    this.showFiles = true;
  }

  getSSNMask(ssn: string) {
    if (ssn) {
      const formstring = ssn.substr(0,3) + '-' + ssn.substr(3,2) + '-' + ssn.substr(5,4);
      return formstring;
    }
  }


  // getEnrollmentStatusCode() {
  //   const enrollmentStatus = {};
  //   this.enrollmentStatusResponseCode.forEach(function (value) {
  //     enrollmentStatus[value['code']] = value;
  //   });
  //   return enrollmentStatus;
  // }

  // getEnrollmentDescription(code) {
  //   if (code == null) {
  //     return '';
  //   }
  //   const enrollmentStatusDescription = this.getEnrollmentStatusCode();
  //   return enrollmentStatusDescription[code]['description'];
  // }

  // getEnrollmentGroupDescription(code) {
  //   if (code == null) {
  //     return '';
  //   }
  //   //let rtValue=this.referenceTable.getRtValue('ENROLLMENT_GROUP_RT');
  //   //const enrollmentStatusDescription = this.getEnrollmentStatusCode();
  //   return 'rtValue';
  // }

  authorizeEnrollment() {
    const taskId=this.paeCommonService.getTaskId();
    const enrollmentData = new EnrollmentData(
      '',
      this.enrId,
      this.getFormData().enrDenialRsnCd.value,
      this.getFormData().enrEndDt.value,
      this.getFormData().enrStartDt.value,
      this.getFormData().authStatusCd.value,
      this.getFormData().comments.value,
      taskId);
      this.showSpinner=true;
    this.enrDetailService.authorizeEnrollment(enrollmentData).then((response) => {   
      this.router.navigate(['ltss/enrollmentDashboard']);
    });
    
    this.isEnrolled = true;
  }
  disableFinancialEligibility(){
    this.myForm.patchValue({ 
      patientLbltyStartDt: this.financialEligibilityData.enrPatientLbltyDtlVO.patientLbltyStartDt,
      ctgryEligBeginDt: this.financialEligibilityData.enrFinancialEligibilityVO.ctgryEligBeginDt,
      ctgryEligDesc: this.financialEligibilityData.enrFinancialEligibilityVO.ctgryEligDesc,
      ctgryEligEndDt: this.financialEligibilityData.enrFinancialEligibilityVO.ctgryEligEndDt,
      amount: this.financialEligibilityData.enrFinancialEligibilityVO.patientLiabilityAmount
    });
   this.myForm.get('ctgryEligDesc').disable();
   this.myForm.get('patientLbltyStartDt').disable();
   this.myForm.get('ctgryEligBeginDt').disable();
   this.myForm.get('ctgryEligEndDt').disable();
   this.myForm.get('amount').disable();
  }
  // getSlotStatusCode() {
  //   const slotStatus = {};
  //   this.slotStatusResponseCode.forEach(function (value) {
  //     slotStatus[value['code']] = value;
  //   });
  //   return slotStatus;
  // }

  // getSlotDescription(code) {
  //   if (code == null) {
  //     return '';
  //   }
  //   const slotStatusDescription = this.getSlotStatusCode();
  //   console.log("slot status", slotStatusDescription);
  //   return slotStatusDescription[code]['description'];
  // }

  // getAppealFiledCode() {
  //   const appealFiled = {};
  //   this.appealFiledResponseCode.forEach(function (value) {
  //     appealFiled[value['code']] = value;
  //   });
  //   return appealFiled;
  // }

  // getAppealFiledDescription(code) {
  //   if (code == null) {
  //     return '';
  //   }
  //   const appealFiledDescription = this.getAppealFiledCode();
  //   return appealFiledDescription[code]['description'];
  // }

  // getGrandfatheredCode() {
  //   const grandfathered = {};
  //   this.grandfatheredResponseCode.forEach(function (value) {
  //     grandfathered[value['code']] = value;
  //   });
  //   return grandfathered;
  // }

  // getGrandfatheredDescription(code) {
  //   if (code == null) {
  //     return '';
  //   }
  //   const grandfatheredDescription = this.getGrandfatheredCode();
  //   return grandfatheredDescription[code]['description'];
  // }
  onAuthorizationStatusChange(value) {
    if (value == 'DEN') {
      this.isAuthorizationDenied = true;
    } else {
      this.isAuthorizationDenied = false;
    }
  }

}

export interface ChoicesGroup {
  description: string;
  group: string;
  amount: number;
  effectiveDate: string;
  effectiveEndDate: string;
  userAction: string;
}

const CHOICES_GROUP_DATA: ChoicesGroup[] = [
  {
    description: 'Choices Group 2',
    group: 'Base',
    amount: 1230,
    effectiveDate: '2/3/2020',
    effectiveEndDate: '4/6/2021',
    userAction: 'Edit',
  },
  {
    description: 'Choices Group 2',
    group: 'Base',
    amount: 1230,
    effectiveDate: '2/3/2020',
    effectiveEndDate: '4/6/2021',
    userAction: 'Edit',
  },
  {
    description: 'Choices Group 2',
    group: 'Base',
    amount: 1230,
    effectiveDate: '2/3/2020',
    effectiveEndDate: '4/6/2021',
    userAction: 'Edit',
  },
  {
    description: 'Choices Group 2',
    group: 'Base',
    amount: 1230,
    effectiveDate: '2/3/2020',
    effectiveEndDate: '4/6/2021',
    userAction: 'Edit',
  },
  {
    description: 'Choices Group 2',
    group: 'Base',
    amount: 1230,
    effectiveDate: '2/3/2020',
    effectiveEndDate: '4/6/2021',
    userAction: 'Edit',
  },
  {
    description: 'Choices Group 2',
    group: 'Base',
    amount: 1230,
    effectiveDate: '2/3/2020',
    effectiveEndDate: '4/6/2021',
    userAction: 'Edit',
  },
];
