import { Component, HostListener, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CustomvalidationService } from '../../_shared/utility/customvalidation.service';
import * as customValidation from '../../_shared/constants/validation.constants';
import { SavePopupComponent } from '../../savePopup/savePopup.component';
import {Location} from '@angular/common';
import { Subscription } from 'rxjs/internal/Subscription';
import { PaeCommonService } from 'src/app/core/services/pae/pae-common/pae-common.service';
import { PaeService } from 'src/app/core/services/pae/pae.service';
import { ComponentCanDeactivate } from 'src/app/core/helpers/pending-change.guard';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-pae-cost-neutrality-plan-of-care',
  templateUrl: './pae-cost-neutrality-plan-of-care.component.html',
  styleUrls: ['./pae-cost-neutrality-plan-of-care.component.scss'],
})
export class PaeCostNeutralityPlanOfCareComponent implements OnInit, ComponentCanDeactivate {

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private customValidator: CustomvalidationService,
    private location: Location,
    private paeService: PaeService,
    private paeCommonService: PaeCommonService,
    private dialog: MatDialog
  ) {

    this.forms.waiver_service = this.fb.group({
      waiver_serviceType: new FormControl('',
        { validators: [Validators.required], updateOn: 'blur' }),
        waiver_serviceAmount: new FormControl('',
        { validators: [Validators.required, this.customValidator.currencyValidator()], updateOn: 'blur' }),
        waiver_serviceFrequency: new FormControl('',
        { validators: [Validators.required], updateOn: 'blur' })
    });
  }
  subscribed: Array<Subscription> = [];
   dropdownData: any = {

    cost_neutrality: [
      {
        'code': 'LRRR',
        'value': 'REF:LTSSReferralReassignmentReview',
      },
      {
        'code': 'CROA',
        'value': 'APL:CorrectionRequiredforOnsiteAssessment',
      },
      {
        'code': 'ARS',
        'value': 'SLT:AppeallantRequiresaSlot',
      },
      {
        'code': 'RDAN',
        'value': 'APL:ReviewAdditionalDocuments',
      },
      {
        'code': 'RDOC',
        'value': 'APL:ReviewAdditionalDocuments',
      },
      {
        'code': 'CNHR',
        'value': 'APL:CompleteaNurseHearingReferenceForm',
      },
      {
        'code': 'CNOH',
        'value': 'APL:CorrectNOH',
      },
      {
        'code': 'AP',
        'value': 'APL:ApprovePASRR',
      },
      {
        'code': 'CS',
        'value': 'APL:CreateaSupplemental',
      },
      {
        'code': 'UIO',
        'value': 'REF:UpdateIntakeOutcomeBasedonAppealDecision',
      },
      {
        'code': 'ADPI',
        'value': 'REF:AppealDecisionProcess-IntakeOutcome',
      },
      {
        'code': 'AOHS',
        'value': 'SLT:AppealOutcomeHoldaSlot',
      },
      {
        'code': 'UEAO',
        'value': 'ENR:UpdateEnrollmentbasedonAppealOutcome',
      },
      {
        'code': 'COBE',
        'value': 'ENR:<MMIS–AssignBenefitCOBError>',
      },
      {
        'code': 'OPUR',
        'value': 'ENR:OverridePAEUpdateReview',
      },
      {
        'code': 'ROPO',
        'value': 'APL:RequestOnsitetobePutOn-hold',
      },
      {
        'code': 'ARR',
        'value': 'APL:AppealisReadyforReview',
      },
      {
        'code': 'RRE',
        'value': 'ADJ:RecertificationReview-ECF',
      },
      {
        'code': 'MABE',
        'value': 'ENR:MMIS-AssignBenefitError',
      },
      {
        'code': 'RI',
        'value': 'ENR:ReinstatementImplementation',
        'activateSW': 'Y'
      },
      {
        'code': 'DICI',
        'value': 'ENR:DDtoIDChangeImplementation',
      },
      {
        'code': 'LCI',
        'value': 'ENR:LONChangeImplementation',
      },
      {
        'code': 'CTEC',
        'value': 'ENR:CompleteTransitionEnrollment-CAC',
      },
      {
        'code': 'CTEI',
        'value': 'ENR:CompleteTransitionEnrollment-ICF',
      },
      {
        'code': 'CTEP',
        'value': 'ENR:CompleteTransitionEnrollment-PACE',
      },
      {
        'code': 'CTE3',
        'value': 'ENR:CompleteTransitionEnrollment-CHOICESGroup3',
      },
      {
        'code': 'CTE2',
        'value': 'ENR:CompleteTransitionEnrollment-CHOICESGroup2',
      },
      {
        'code': 'CTE1',
        'value': 'ENR:CompleteTransitionEnrollment-CHOICESGroup1',
      },
      {
        'code': 'CTEE',
        'value': 'ENR:CompleteTransitionEnrollment-ECFCHOICES',
      },
      {
        'code': 'CSR',
        'value': 'SLT:CEASlotReview',
      },
      {
        'code': 'RC2S',
        'value': 'SLT:ReviewCHOICES2Slot',
      },
      {
        'code': 'CCR',
        'value': 'SLT:CaregiverChangeReview',
      },
      {
        'code': 'RSA',
        'value': 'SLT:ReviewSlotAssignment',

      },
      {
        'code': 'PM',
        'value': 'PER:PersonMatch',
      },
      {
        'code': 'ISPP',
        'value': 'PER:InputSSNforPendingPAE',
      },
      {
        'code': 'NECI',
        'value': 'REF:NewECFCHOICESIntake',
      },
      {
        'code': 'CCEI',
        'value': 'ENR:CostCapExceptionImplementation',
      },
      {
        'code': 'TECI',
        'value': 'REF:TransitionECFCHOICESIntake',
      },
      {
        'code': 'PRKA',
        'value': 'PAE:PhysicianReviewforKBPartA',
      },
      {
        'code': 'NRKA',
        'value': 'PAE:NurseReviewforKBPartA',
      },
      {
        'code': 'CEAR',
        'value': 'ADJ:CompleteCEAReview',
      },
      {
        'code': 'SISR',
        'value': 'ADJ:SISAssessmentReview',
      },
      {
        'code': 'NREC',
        'value': 'REF:NurseReviewforECFCHOICES',
      },
      {
        'code': 'EEAE',
        'value': 'ENR:ERCEnrollmentAdditon/Extension',
      },
      {
        'code': 'RNOH',
        'value': 'APL:ReviewNoticeofHearing',
      },
      {
        'code': 'UODD',
        'value': 'APL:Updateorderdecisiondetails',
      },
      {
        'code': 'ANR',
        'value': 'APL:AppealNurseReview',
      },
      {
        'code': 'RDUM',
        'value': 'APL:ReviewDocumentsUploadedbytheMCO',
      },
      {
        'code': 'RLSA',
        'value': 'APL:ReviewtheReturnedLSA',
      },
      {
        'code': 'CROA',
        'value': 'APL:Completeclinicalreviewofonsiteassessment',
      },
      {
        'code': 'CNEC',
        'value': 'ENR:CompleteNewEnrollment-CAC',
      },
      {
        'code': 'MCOP',
        'value': 'ENR:<MMIS-MCO_Update–PAE>',
      },
      {
        'code': 'MCOR',
        'value': 'ENR:<MMIS-MCO_Update–at-riskMCO>',
      },
      {
        'code': 'MIFE',
        'value': 'ENR:<MMISIn-flightEnrollment>',
      },
      {
        'code': 'MCOR',
        'value': 'ENR:ReviewtheMCO',
      },
      {
        'code': 'CNEI',
        'value': 'ENR:CompleteNewEnrollment-ICF',
      },
      {
        'code': 'CNEP',
        'value': 'ENR:CompleteNewEnrollment-PACE',
      },
      {
        'code': 'CNE3',
        'value': 'ENR:CompleteNewEnrollment-CHOICESGroup3',
      },
      {
        'code': 'CNE2',
        'value': 'ENR:CompleteNewEnrollment-CHOICESGroup2',
      },
      {
        'code': 'CNE1',
        'value': 'ENR:CompleteNewEnrollment-CHOICESGroup1',
      },
      {
        'code': 'CNEE',
        'value': 'ENR:CompleteNewEnrollment-ECFCHOICES',
      },
      {
        'code': 'CDR',
        'value': 'ENR:CompleteDisenrollmentRequest',
      },
      {
        'code': 'CCC',
        'value': 'PAE:Changeincaregiver\'scondition',
      },
      {
        'code': 'LONC',
        'value': 'ADJ:LONChangeRequest',
      },
      {
        'code': 'CCER',
        'value': 'ADJ:CostCapExceptionReview',
      },
      {
        'code': 'RAS',
        'value': 'ADJ:ReviewAuditSubmission',
      },
      {
        'code': 'PA',
        'value': 'ADJ:PerformAudit',
      },
      {
        'code': 'RSC',
        'value': 'SLT:ResolveSlotConflict',
      },
      {
        'code': 'CRDU',
        'value': 'GEN:CompleteDemographicUpdateRestrictedbyCaseStatus',
      },
      {
        'code': 'CSIS',
        'value': 'PAE:CompleteSISAssessmentRequest',
      },
      {
        'code': 'AINR',
        'value': 'REF:AdditionalInformationRequestfromNurseReview',
      },
      {
        'code': 'RRWL',
        'value': 'SLT:RemovefromReferral/WaitList',
      },
      {
        'code': 'SLSA',
        'value': 'APL:SendforLSA',
      },
      {
        'code': 'POA',
        'value': 'APL:PerformOnsiteAssessment',
      },
      {
        'code': 'KBSR',
        'value': 'PAE:DIDDPartBSupervisorReviewQueue',
      },
      {
        'code': 'ATC',
        'value': 'ADJ:AdjudicateTransitiontoCACPAE',
      },
      {
        'code': 'ATI',
        'value': 'ADJ:AdjudicateTransitiontoICFPAE',
      },
      {
        'code': 'KBWR',
        'value': 'PAE:ReviewKBWithdrawalRequest-DIDD',
      },
      {
        'code': 'ATP',
        'value': 'ADJ:AdjudicatePACETransitionPAE',
      },
      {
        'code': 'ATCH',
        'value': 'ADJ:AdjudicateCHOICEShcbsTransitionPAE',
      },
      {
        'code': 'ATCN',
        'value': 'ADJ:AdjudicateCHOICESNFTransitionPAE',
      },
      {
        'code': 'ATE',
        'value': 'ADJ:AdjudicateECFTransitionPAE',
      },
      {
        'code': 'ANC',
        'value': 'ADJ:AdjudicateCACPAE',
      },
      {
        'code': 'ANI',
        'value': 'ADJ:AdjudicateICFPAE',
      },
      {
        'code': 'ANP',
        'value': 'ADJ:AdjudicatePACEPAE',
      },
      {
        'code': 'ANCH',
        'value': 'ADJ:AdjudicateCHOICEShcbsPAE',
      },
      {
        'code': 'ANCN',
        'value': 'ADJ:AdjudicateCHOICESNFPAE',
      },
      {
        'code': 'ANE',
        'value': 'ADJ:AdjudicateECFPAE',
      },
      {
        'code': 'ERCR',
        'value': 'ADJ:ERCAddition/ExtensionReview',
      },
      {
        'code': 'PRR',
        'value': 'ADJ:RecertificationReview-PACE',
      },
      {
        'code': 'C1RR',
        'value': 'ADJ:RecertificationReview-CHOICES1',
      },
      {
        'code': 'ACEA',
        'value': 'PAE:AddCostEffectiveAlternativeInterest',
      },
      {
        'code': 'CSAR',
        'value': 'PAE:CompleteSafetyAssessmentRequest',
      },
      {
        'code': 'IARC',
        'value': 'REF:CompleteIARCReview',
      },
      {
        'code': 'ECFR',
        'value': 'PAE:CompleteECFRecertification',
      },
      {
        'code': 'ECFW',
        'value': 'REF:ReviewECFWithdrawalRequest',
      },
      {
        'code': 'CPAA',
        'value': 'PAE:CompletePartAAssessment',
      },
      {
        'code': 'KBTP',
        'value': 'PAE:TransitionKatieBeckettPAENeeded-DIDD',
      },
      {
        'code': 'CPC',
        'value': 'PAE:CompletePACERecertification/Reassessment',
      },
      {
        'code': 'ETP',
        'value': 'PAE:TransitionECFPAENeeded',
      },
      {
        'code': 'CNTP',
        'value': 'PAE:TransitionCHOICESNFPAENeeded',
      },
      {
        'code': 'AC3I',
        'value': 'PAE:AddGroup3InterestDetails',
      },
      {
        'code': 'CHTP',
        'value': 'PAE:TransitionCHOICEShcbsPAENeeded',
      },
      {
        'code': 'ENP',
        'value': 'PAE:CompleteECFPAE',
      },
      {
        'code': 'CTP',
        'value': 'PAE:TransitionCACPAENeeded',
      },
      {
        'code': 'ITP',
        'value': 'PAE:TransitionICFPAENeeded',
      },
      {
        'code': 'KBNP',
        'value': 'PAE:NewKatieBeckettReferralReceived-DIDD',
      },
      {
        'code': 'RMSC',
        'value': 'PAE:ReviewmembersubmittedECF/KatieBeckettChanges',
      },
      {
        'code': 'PTP',
        'value': 'PAE:TransitionPACEPAENeeded',
      },
      {
        'code': 'CCRP',
        'value': 'APL:CreateCaseReferralPacket',
      },
      {
        'code': 'CAO',
        'value': 'PAE:CompleteAnnualOutreach',
      },
      {
        'code': 'WLR',
        'value': 'PAE:Waiver-AnnualLOCReassessment',
        'activateSW': 'Y'
      },
      {
        'code': 'KALR',
        'value': 'PAE:KatieBeckett-PartAAnnualLOCReassessment',
      },
      {
        'code': 'ELR',
        'value': 'PAE:ECF-AnnualLOCReassessment',
      },
      {
        'code': 'CLR',
        'value': 'PAE:CHOICES-AnnualLOCReassessment',
      },
      {
        'code': 'ILR',
        'value': 'PAE:ICF-AnnualLOCReassessment',
      },
      {
        'code': 'KBLR',
        'value': 'PAE:KatieBeckett-PartBAnnualLOCReassessment',
      },
      {
        'code': 'KAAO',
        'value': 'PAE:KBA/CAge-OutReview',
      },
      {
        'code': 'AURD',
        'value': 'APL:UploadRequestedDocuments',
      },
      {
        'code': 'ICAP',
        'value': 'REF:ICAPRequest',
      },
      {
        'code': 'MOPD',
        'value': 'PAE:EnterMOPD',
      },
      {
        'code': 'SAR',
        'value': 'ADJ:SafetyAssessmentReview',
      },
      {
        'code': 'ITDD',
        'value': 'PAE:AddServiceInitiation/ActualTransition/ActualDischargeDate',
      },
      {
        'code': 'AIIR',
        'value': 'REF:AdditionalInformationRequestfromIARCReview',
      },
      {
        'code': 'KTCE',
        'value': 'ENR:TransitionwithinKatieBeckett-CompleteEnrollment',
      },
      {
        'code': 'PFE',
        'value': 'ENR:PendingFEdetermination',
      },
      {
        'code': 'SH',
        'value': 'APL:TobeSetforHearing',
      },
      {
        'code': 'MCOA',
        'value': 'GEN:<MMISat-riskMCO>',
      },
      {
        'code': 'UEEE',
        'value': 'ENR:Update/EnterEnrollmentEndDate',
      },
      {
        'code': 'TLA',
        'value': 'PER:TEDSLinkAcknowledgment',
      },
      {
        'code': 'L2I',
        'value': 'PER:LinkTwoIndividuals',
      },
      {
        'code': 'U2I',
        'value': 'PER:UnlinkTwoIndividuals',
      },
      {
        'code': 'UO',
        'value': 'APL:UploadtheOrder',
      },
      {
        'code': 'ORH',
        'value': 'APL:OGCtoRescheduleaHearing',
      },
      {
        'code': 'UNOH',
        'value': 'APL:CreateandUploadNOH',
      }
    ],
    cost_frequency: [
      {
        'code': 'DAY',
        'value': 'Day',
      },
      {
        'code': 'WEK',
        'value': 'Week',
      },
      {
        'code': 'MTH',
        'value': 'Month',
      },
      {
        'code': 'YER',
        'value': 'Year',
      }
    ]
  }

  public applicantData: Array<any>;

  options: any = {
    waiver_service: {
      edit: false,
      submitted: false,
      dirty: false,
      saved: false      
    }
  };

  applicantName: any;
  paeId: string;
  
  customValidation = customValidation;
  submitted: boolean = false;

  controlErrorText: any = {};
  controlFormMap: any;
  pageId: string = 'PPCPO';
  forms: any = {
    waiver_service: FormGroup
  };

  originalValues: any = {
    waiver_service: null
  }

  edit(formName: string) {
    this.options[formName].edit = true;
    this.originalValues[formName] = this.forms[formName].value;
    this.setControlState(formName);
  }

  cancel(formName: string) {
        
    let originalValues = this.originalValues[formName];
    let that = this;

    let timeout = setTimeout(function() {
      Object.keys(originalValues).forEach(controlName => {
        let control = that.getControl(controlName);
        control.setValue(originalValues[controlName]);
        control.markAsUntouched();
        control.setErrors(null);
        control.markAsPristine();
      });
      this.options[formName].dirty = false;
      this.options[formName].edit = false;
      this.options[formName].saved = true;
      that.setControlState(formName);
      clearTimeout(timeout);
    }, 10);
  }

  setControlState(formName: string) {
    let typeControl = this.getControl(formName + 'Type');
    if (this.options[formName].saved && !this.options[formName].edit) {
      typeControl.disable()
    } else {
      typeControl.enable();
    }
  }

  ngOnInit(): void {
    let that = this;
    Object.keys(this.forms).forEach(formName => {
      let form = that.forms[formName] as FormGroup;
      that.originalValues[formName] = form.value;
      Object.keys(form.controls).forEach(controlName => {
        let control = form.controls[controlName];
        that.subscribed.push(control.valueChanges.subscribe(() => {
          that.options[formName].dirty = true;
        }));
      });
    });
    if (this.paeCommonService.getApplicantName() === null || this.paeCommonService.getApplicantName() === '' || this.paeCommonService.getApplicantName() === undefined){
		this.getApplicantName();
	} else {
		this.applicantName =  this.paeCommonService.getApplicantName();
	}
  }

  getApplicantName(){
    this.paeService.getPaeApplicantInformation(this.paeCommonService.getPaeId(),this.pageId).then((response)=> {
      console.log("reponseforName"+JSON.stringify(response.body.firstName));
      this.applicantName =  response.body.firstName+" "+response.body.lastName;
	  this.paeCommonService.setApplicantName(this.applicantName);
    });
  }

  saveClick(formName:string) {
    this.submit(formName);
  }

  saveForm(formName: string, form: FormGroup, onSave: Function = null) {
    //async method will be used here
    let that = this;
    let timeout = setTimeout(function() {
      that.originalValues[formName]=form.value;
      that.options[formName].dirty = false;
      that.options[formName].edit = false;
      that.options[formName].saved = true;
      if (onSave !== null) {
        onSave();
      }
      clearTimeout(timeout);
    },200);
  }

  submit(formName: string, onSave: Function = null) {
    let form = this.forms[formName];
    this.options[formName].submitted = true;
    if (form.valid) {
      this.saveForm(formName, form, onSave);
      this.options[formName].submitted = true;
    }
    this.setControlState(formName);
  }

  getControl(controlName: string): AbstractControl {
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
    const form = this.forms[this.controlFormMap[controlName]] as FormGroup;
    return form.controls[controlName];
  }

  valueMatch(values: Array<string>, controlName: string) {
    let controlValue = this.getControl(controlName).value;
    let match = false;
    values.forEach(val => {
      match = match || (val == controlValue);
    });
    return match;
  }

  controlError(controlName: string) {
    try {
      const control = this.getControl(controlName);
      return this.controlErrorHandler(control, controlName);
      
    } catch (e) {
      console.log('unrecognized control name: ' + controlName);
    }
  }

  controlErrorHandler(control: AbstractControl, controlName: string) {
    let formName = this.controlFormMap[controlName];
    const error = (this.options[formName].submitted || control.touched) && !!control.errors;
    let message = '';
    
    if (error) {
      if (control.errors.invalidCurrency && control.value !== '') {
        message = 'Invalid currency value';
      } else if (control.errors.required) {
        message = customValidation.A1;
      }
    }
    this.controlErrorText[controlName] = message;
    return message !== '';
  }

  saveAllForms(onComplete: Function) {
     
    let dirty = false;
    let keys = Object.keys(this.forms);
    
    for (let i=0; i < keys.length && !dirty; i++) {

      let formName = keys[i];
      let form = this.forms[formName] as FormGroup;
      form.updateValueAndValidity();
      if (this.options[formName].dirty) {
        dirty = true;
        if (form.valid) {
          if (!this.options[formName].submitted || this.options[formName].edit ) {
            let that = this;
            let timeout = setTimeout(function() {
              that.submit(formName, function() { that.saveAllForms(onComplete) });
            }, 20);
            return;
          }
        }
      }
    };
    if (!dirty && onComplete !=null) {
      onComplete();
    }
  }

  next() {
    let that = this;
    this.saveAllForms(function() {
      that.router.navigate(['ltss/pae']);
    });
  }


  save() {
    let that = this;
    this.saveAllForms(function() {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = { route: 'ltss/pae' };
      dialogConfig.panelClass = 'exp_popup';
      dialogConfig.width = '648px';
    dialogConfig.height = '360px';

      that.dialog.open(SavePopupComponent, dialogConfig);
    })
  }

  back() {
    this.location.back()
  }

  ngOnDestroy() {
    this.subscribed.forEach(subscription => { subscription.unsubscribe(); });
  }
  
  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    console.log(this.forms.waiver_service) 
   return !this.forms.waiver_service.dirty;
  }

  resetForm(){
    this.forms.waiver_service.reset();
  }
}
