import { Component, HostListener, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomvalidationService } from 'src/app/_shared/utility/customvalidation.service';
import * as customValidation from '../../_shared/constants/validation.constants';
import { PaeReviewSubmit } from '../../_shared/model/PaeReviewSubmit';
import { PaeRecertificationVO } from '../../_shared/model/PaeRecertificationVO';
import { PaeSubmissionVO } from '../../_shared/model/PaeSubmissionVO';
import { PaeVO } from '../../_shared/model/PaeVO';
import { PaeService } from 'src/app/core/services/pae/pae.service';
import { MatRadioChange } from '@angular/material/radio';
import { Router } from '@angular/router';
import { PaeCommonService } from 'src/app/core/services/pae/pae-common/pae-common.service';
import { Observable, Subscription } from 'rxjs';
import { PaeFlowSeq } from 'src/app/_shared/utility/PaeFlowSeq';
import { ComponentCanDeactivate } from 'src/app/core/helpers/pending-change.guard';
import { PaeProgramSelectService } from 'src/app/core/services/pae/pae-program-select/pae-program-select.service';
import { AdjudicationDetailsService } from 'src/app/core/services/adjudication/adjudication-details.service';
import { PaeSisubmissionVO } from 'src/app/_shared/model/PaeSisSubmissionVO';
import * as Constants from '../../_shared/constants/application.constants';
import * as CryptoJS from 'crypto-js';

export interface SafetyDeterminationDetails {
  name: string;
  status: string;
  userActions: string;
}

export interface SupportingDocsDetails {
  name: string;
  icon: string;
}
export interface SupportingDocsDetailsPart2 {
  name: string;
  icon: string;
}

export interface SupportingDocsDetailsPart3 {
  name: string;
  icon: string;
}
export interface SupportingDocsDetailsPart4 {
  name: string;
  icon: string;
}

const ELEMENT_DATA: SafetyDeterminationDetails[] = [
  { name: 'Person Details', status: '', userActions: 'GO TO DETAILS' },
  { name: 'Program Request', status: '', userActions: 'GO TO DETAILS' },
  { name: 'Diagnosis', status: '', userActions: 'GO TO DETAILS' },
  { name: 'Functional Assessment', status: '', userActions: 'GO TO DETAILS' },
  { name: 'Skilled Services', status: '', userActions: 'GO TO DETAILS' },
  { name: 'I/DD', status: '', userActions: 'GO TO DETAILS' },
  { name: 'Safety Determination', status: '', userActions: 'GO TO DETAILS' },
  { name: 'Cost Neutrality', status: '', userActions: 'GO TO DETAILS' },
  { name: 'Behavioral Support', status: '', userActions: 'GO TO DETAILS' },
  { name: 'Prioritization', status: '', userActions: 'GO TO DETAILS' },
  { name: 'Supporting Documentation', status: '', userActions: 'GO TO DETAILS' }
];
const supportingDocuments: SupportingDocsDetails[] = [
  { name: 'ECF Recertification Form', icon: 'cloud_upload' },
  { name: 'Recertification Paper Form', icon: 'cloud_upload' },
];

const supportingDocumentsTwo: SupportingDocsDetailsPart2[] = [
  { name: 'SIS Assessment', icon: 'cloud_upload' },
];

const supportingDocumentsThree: SupportingDocsDetailsPart3[] = [
  { name: 'PAE Recertification', icon: 'cloud_upload' },
];

const supportingDocumentsFour: SupportingDocsDetailsPart4[] = [
  { name: 'CEA Determination', icon: 'cloud_upload' },
];

@Component({
  selector: 'app-pae-submit',
  templateUrl: './pae-submit.component.html',
  styleUrls: ['./pae-submit.component.scss']
})
export class PaeSubmitComponent implements OnInit, ComponentCanDeactivate {
  localStorageLocal = localStorage.getItem('APP_STORAGE_TOKEN');
  entityTypeCd = JSON.parse(this.localStorageLocal).entityTypeCd;
  [x: string]: any;
  displayedColumns: string[] = ['name', 'status', 'userActions'];
  paeSubmitForm: FormGroup;
  supportingDocument = supportingDocuments;
  supportingDocumentPart2 = supportingDocumentsTwo;
  supportingDocumentPart3 = supportingDocumentsThree;
  supportingDocumentPart4 = supportingDocumentsFour;
  customValidation = customValidation;
  submitted = false;
  showInitateTransition: boolean;
  showTransitionNoMessage: boolean;
  showSupportingDocuments: boolean;
  showSupportingDocumentPart2: boolean;
  showRecertification: boolean;
  sisCommentShow: boolean;
  selectedValueMOPD: string;
  selectedValueRecertifyPAE: string;
  selectedValueCHOICEGroup3: string;
  showActualDischargeDate: boolean;
  selectedSISAssessmentDate: string;
  showPROCEEDLOCBtn: string;
  dataSource = [];
  dataSourceSet = false;
  event: string;
  reqPageId: string;
  paeId: any;
  elementRow: any;
  taskId: any;
  taskMasterId: any;
  ackSw = false;
  // paeRecertificationAckSw: boolean;
  revisedPaeSw: string;
  ceaSw: string;
  taskQueue: string;
  programCode: any;
  isKbProgram = false;
  applicantName: any;
  subscription1$: Subscription;
  subscription2$: Subscription;
  subscription3$: Subscription;
  subscriptions: Subscription[] = [];
  isSamePageNavigation: boolean;
  documentCeaSw: boolean;
  minDate: Date;
  maxDate: Date;
  minTenDate: Date;
  enableNext = false;
  differenceInDays: any;
  paeStatus: any;
  makeReadOnly = false;
  disabledNextButton = false;
  disabledFormButton = true;
  startDate = new Date();
  rectification = [{code: 'MET', value:'Applicant meets Criteria', activateSW:'Y'},
{code: 'NOT', value:'Applicant does not meet Criteria', activateSW:'Y'}];
  constructor(private fb: FormBuilder, private router: Router,
              private customValidator: CustomvalidationService,
              private paeService: PaeService,
              private paeCommonService: PaeCommonService,
              private paeProgramSelectService: PaeProgramSelectService,
              private adjudicationDetailsService: AdjudicationDetailsService) { }

  getFormData() {
    return this.paeSubmitForm.controls;
  }

  ngOnInit(): void {
    const timeTravelData = localStorage.getItem('TIME_TRAVEL_DATA');
    if(timeTravelData) {
      const timeTravelDataJson = JSON.parse(CryptoJS.AES.decrypt(timeTravelData, Constants.APP_ENC_DECRYPT_KEY).toString(CryptoJS.enc.Utf8));
      console.log("timeTravelDataJson ", timeTravelDataJson);
      if(timeTravelDataJson.timeTravelFlag && timeTravelDataJson.currentDate) {
        this.startDate = new Date(timeTravelDataJson.currentDate);
      }
    }

    // const selectedMenu = this.paeCommonService.getProgramName();

    this.Status = this. paeCommonService.getPaeStatus();

    this.entityId = this.paeCommonService.getEntityId();
    console.log('entityTypeCd', this.entityTypeCd);

    this.elementRow = this.paeCommonService.getRowElement();
    this.dueDate = this.paeCommonService.getDueDate();
    console.log('this.dueDate', this.dueDate);

    this.chmTypeCd = this.paeCommonService.getChmType();
    console.log('this.chmTypeCd', this.chmTypeCd);

    console.log(' this.paeStatus',  this.paeStatus);
    if (this.elementRow !== undefined && this.elementRow !== null){
      this.taskMasterId = this.elementRow.taskQueue;
      this.prsnId = this.elementRow.personId;
      this.paeStatus = this.elementRow.paeStatus;
    }
    if (this.paeCommonService.getTaskId() !== null && this.paeCommonService.getTaskId() !== undefined) {
      this.taskId = this.paeCommonService.getTaskId();
      console.log('this.taskId ', this.taskMasterId);
    }
    this.paeId = this.paeCommonService.getPaeId();
    this.programCode = this.paeCommonService.getProgramName();
    console.log('this.programCode', this.programCode);

    if (this.programCode === 'KB'){
       this.isKbProgram = true;
     }

    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 119, 0, 1);
    this.maxDate = new Date();
    this.paeSubmitForm = this.fb.group({
      ackSw: [''],
      recrtfctnDcsnCd: [''],
      trnstnExpctdSw: [''],
      reasonDtl: [''],
      sisAssmntComment: [''],
      sisDatSrvcSw: [''],
      sisOutcomeCd: [''],
      sisPaSrvcSw: [''],
      sisResidentialSrvcSw: [''],
      ceaDeterminationCd: [''],
      ceaSw: [''],
      certificateDt: [''],
      comments: ['', [Validators.required]],
      paeRecrtfctnAckSw: [''],
      paeRecrtfctnSw: [''],
      revisedPaeSw: [''],
      signature: [''],
      submitDt: [''],
      whoSubmittingCd: [''],
      actualDischargeDt: [''],
      assignedEntity: [''],
      assignedGrpSubmitSw: [''],
      assignedUserId: [''],
      beginDt: [''],
      closureAttestationSw: [''],
      closureRsnCd: [''],
      closureRsnDesc: [''],
      dueDt: [''],
       entityCd: [''],
      entityId: [''],
      entityType: [''],
      grandRegionCd: [''],
      grp3IntrstSw: [''],
      legacyId: [''],
      modeCd: [''],
      mopdDt: [''],
      newPrsnSw: [''],
      paeActionCd: [''],
      paeRequestDt: [''],
      paeRqstDt: [''],
      paeTypeCd: [''],
      pdfGeneratedSw: [''],
      reassessmentDueDt: [''],
      recrtfctnDueDt: [''],
      rqstdEnrGrpCd: [''],
      ssiApplcatnStatusCd: [''],
      statusCd: [''],
      submissionDt: [''],
      submittedEnrGrpCd: [''],

     });

    if (this.paeCommonService.getApplicantName() === null || this.paeCommonService.getApplicantName() === '' ||
    this.paeCommonService.getApplicantName() === undefined){
      this.getApplicantName();
  } else {
    this.applicantName =  this.paeCommonService.getApplicantName();
  }
    this.getPaeSubmitSummaryData();
    console.log('inside if====', this.programCode);

    if (this.taskMasterId === '74' || this.chmTypeCd === 'AOUM') {
      this.paeSubmitForm.get('mopdDt').setValidators(Validators.required);
    } else if ( this.taskMasterId !== '74' || this.chmTypeCd !== 'AOUM') {
      this.paeSubmitForm.get('mopdDt').clearValidators();
      console.log('this.paeStatus ===', this.Status);
    }

    if ( this.programCode === 'CG1' || this.programCode === 'EC4' || this.programCode === 'ICF' || this.programCode === 'PACE') {
    this.paeSubmitForm.get('paeRqstDt').setValidators(Validators.required);
  } else if (this.programCode !== 'CG1' || this.programCode !== 'EC4' || this.programCode !== 'ICF' || this.programCode !== 'PACE') {
    this.paeSubmitForm.get('paeRqstDt').clearValidators();
  }


    if (this.chmTypeCd === 'RECT') {
      this.paeSubmitForm.get('recrtfctnDcsnCd').setValidators(Validators.required);
    } else if (this.chmTypeCd !== 'RECT') {
      this.paeSubmitForm.get('recrtfctnDcsnCd').clearValidators();
    }

    this.minTenDate = new Date();
    this.maxDate = new Date(this.minTenDate.setDate(this.minTenDate.getDate() + 10));
    this.getProgramNameForm();
    this.adjId = this.paeCommonService.getAdjId();
     // this.getAdjDescision();
    if (this.taskMasterId === 74 || this.chmTypeCd === 'AOUM') {
       this.makeReadOnly = true;
       this.paeSubmitForm.get('paeRqstDt').clearValidators();
       this.paeSubmitForm.get('grp3IntrstSw').clearValidators();
       this.paeSubmitForm.get('actualDischargeDt').clearValidators();
       this.paeSubmitForm.get('comments').clearValidators();
       this.paeSubmitForm.get('paeRecertificationAckSw').clearValidators();
       this.paeSubmitForm.get('ceaSw').clearValidators();
       
     }

    if (this.chmTypeCd === 'RECT') {
      this.makeReadOnly = true;
      this.paeSubmitForm.get('paeRqstDt').clearValidators();
      this.paeSubmitForm.get('grp3IntrstSw').clearValidators();
      this.paeSubmitForm.get('actualDischargeDt').clearValidators();
      this.paeSubmitForm.get('comments').clearValidators();
      this.paeSubmitForm.get('mopdDt').clearValidators();
      this.paeSubmitForm.get('ceaSw').clearValidators();
    }

    if (new Date().getTime() > new Date(this.dueDate).getTime()) {
      this.sisCommentShow = true;
      console.log('sisCommentShow', this.dueDate);
    }

  }

  onSsnOptionChange(event) {

  }

  getApplicantName(){
    this.paeService.getPaeApplicantInformation(this.paeCommonService.getPaeId(), this.pageId).then((response) => {
      console.log('reponseforName' + JSON.stringify(response.body.firstName));
      this.applicantName =  response.body.firstName + ' ' + response.body.lastName;
      this.paeCommonService.setApplicantName(this.applicantName);
    });
  }

  get f() {
    return this.paeSubmitForm.controls;
  }

  submit() {
    this.submitted = true;
  //  this.disabledFormButton = false;
    this.isSamePageNavigation =  true;
    this.event = 'Submit';
    console.log(this.getFormData());
    if (this.paeSubmitForm.valid) {
      this.paeCommonService.setPaeSubmitted(true);
      this.savePaeReviewAndSubmit();
    }
  }

  sendingYorN(input: boolean) {
    if (input === true) {
      return 'Y';
    } else if (input === false) {
      return 'N';
    }
  }

  onNeedHelp(event) {
    if (event.checked) {
      this.needHelpCheckboxSelectedCount =
        this.needHelpCheckboxSelectedCount + 1;
    } else if (!event.checked) {
      this.needHelpCheckboxSelectedCount =
        this.needHelpCheckboxSelectedCount - 1;
    }
    if (this.needHelpCheckboxSelectedCount > 0) {
      this.needHelpSelected = true;
    } else {
      this.needHelpSelected = false;
    }
  }

  savePaeReviewAndSubmit(showPopup?: boolean) {
    if (this.paeSubmitForm.valid) {
      this.enableNext = true;
      this.reqPageId = 'PPSRR';
      const paeRecertificationVO = new PaeRecertificationVO(
        this.reqPageId,
        this.paeId,
        this.sendingYorN(this.ackSw),
        null,
        this.getFormData().recrtfctnDcsnCd.value,
        '2020-11-03',
        this.getFormData().trnstnExpctdSw.value,
      );

      const paeSisSubmissionVO = new PaeSisubmissionVO(

        this.paeId,
        this.getFormData().reasonDtl.value,
        this.getFormData().sisAssmntComment.value,
        this.getFormData().sisDatSrvcSw.value,
        this.getFormData().sisOutcomeCd.value,
        this.getFormData().sisPaSrvcSw.value,
        this.getFormData().sisResidentialSrvcSw.value,

      );

      const paeSubmissionVO = new PaeSubmissionVO(

        this.getFormData().ceaDeterminationCd.value,
        this.getFormData().ceaSw.value,
        this.getFormData().certificateDt.value,
        this.getFormData().comments.value,
        this.paeId,
        this.sendingYorN(this.paeRecrtfctnAckSw),
        this.getFormData().paeRecrtfctnSw.value,
        this.reqPageId,
        this.getFormData().revisedPaeSw.value,
        this.getFormData().signature.value,
        this.getFormData().submitDt.value,
        this.getFormData().whoSubmittingCd.value,

      );

      const paeVO = new PaeVO(
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        this.getFormData().grp3IntrstSw.value,
        '',
        '',
        this.getFormData().mopdDt.value,
        this.getFormData().newPrsnSw.value,
        this.getFormData().paeActionCd.value,
        this.paeId,
        this.getFormData().paeRequestDt.value,
        this.getFormData().paeRqstDt.value,
        this.getFormData().paeTypeCd.value,
        '',
        this.programCode,
        this.paeCommonService.getPersonId(),
        this.getFormData().reassessmentDueDt.value,
        this.getFormData().recrtfctnDueDt.value,
        '',
        this.getFormData().rqstdEnrGrpCd.value,
        this.getFormData().ssiApplcatnStatusCd.value,
        this.getFormData().statusCd.value,
        this.getFormData().submissionDt.value,
        this.getFormData().submittedEnrGrpCd.value,
        '',
        '',
        ''

      );

      const paeReviewSubmit = new PaeReviewSubmit(
        this.taskMasterId,
        paeRecertificationVO,
        paeSisSubmissionVO,
        paeSubmissionVO,
        paeVO,
        this.taskId,
        this.reqPageId

      );
      const that = this;
      this.paeService.savePaeReviewAndSubmit(paeReviewSubmit).then((res) => {
        console.log('res', res);
        that.paeCommonService.setPaeStatus(res.body.paeVO.statusCd);
        this.router.navigate(['ltss/pae/paeStart/confirmation']);
      });
    }
  }


  getPaeSubmitSummaryData() {
    this.subscription1$ = this.paeService.getSubmitSummaryData(this.paeId).subscribe((response) => {
      this.summaryDataList = response.pageStatusList;
      for (const pageStatus of this.summaryDataList){
        if (pageStatus.pageId === 'PPPAI') {
          this.dataSource.push(pageStatus);
        }
        if (pageStatus.pageId === 'PPPSP') {
          this.dataSource.push(pageStatus);
        }
        if (pageStatus.summarySw === 'Y' && pageStatus.summarySw !== null) {
            this.dataSource.push(pageStatus);
                  }
      }
      this.dataSourceSet = true;
    });
    this.subscriptions.push(this.subscription1$);
  }


  getProgramNameForm(){
    if ( this.paeId ){
      this.subscription2$ = this.paeProgramSelectService.getPaeProgramName(this.paeId).subscribe((paeSelectedProgram) =>
    {
      this.paeRqstDt = paeSelectedProgram.programRqstDt;
      this.grp3IntrstSw = paeSelectedProgram.choicesGroup3Sw;
      this.actualDischargeDt = paeSelectedProgram.actualDischargeDt;
      console.log('+++++++', this.paeRqstDt);
      if (this.grp3IntrstSw === 'Y') {
        this.showActualDischargeDate = true;
      }
      const date2 = new Date();
      const date1 = new Date(this.paeRqstDt);
      let Difference_In_Time = date2.getTime() - date1.getTime();
      this.difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
      this.paeSubmitForm.patchValue({paeRqstDt: this.paeRqstDt, grp3IntrstSw: this.grp3IntrstSw, actualDischargeDt: this.actualDischargeDt});
      console.log('+++++++ programselect', this.paeRqstDt);
    }, err => {
      console.log('Error');
    });
      this.subscriptions.push(this.subscription2$);
    }

  }

  getAdjDescision() {
    this.subscription3$ = this.paeService.getAdjDescision(this.adjId).subscribe(response => {
      console.log('adjudication response', response);
    });
    this.subscriptions.push(this.subscription3$);
  }

   chkDays(event) {
     console.log('event===', event);
     this.disabledNextButton = false;
     const date2 = new Date(event.value);
     const date1 = new Date(this.paeRqstDt);
     const DifferenceInTime = date2.getTime() - date1.getTime();
     const differenceInDays = DifferenceInTime / (1000 * 3600 * 24);
     console.log('difference_In_Days===', differenceInDays);
     if ( differenceInDays > 90 ){
      this.showRecertification = true;
      this.x = true;
    }
  }


  onSelectApplicant(event) {
    if (event.value === 'NOT') {
      console.log('event', event);
      this.showInitateTransition = true;
      this.paeSubmitForm.get('ackSw').clearValidators();
      this.paeSubmitForm.get('trnstnExpctdSw').setValidators(Validators.required);
      this.showSupportingDocuments = false;
    } else if (event.value === 'MET') {
      this.showSupportingDocuments = true;
      this.showInitateTransition = false;
      this.paeSubmitForm.get('trnstnExpctdSw').clearValidators();
      this.showInitateTransition = false;
      this.paeSubmitForm.get('ackSw').setValidators(Validators.required);
    }
  }


  onSelectSIsApplicant(event){
    if (event.value === 'SAC') {
      console.log('event', event);
      this.showSupportingDocumentPart2 = true;
      this.serviceReceived = true;
      this.showReason = false;
      this.paeSubmitForm.get('sisDatSrvcSw').setValidators(Validators.required);
      this.paeSubmitForm.get('sisResidentialSrvcSw').setValidators(Validators.required);
      this.paeSubmitForm.get('sisPaSrvcSw').setValidators(Validators.required);
      this.paeSubmitForm.get('reasonDtl').clearValidators();
    }  else
    if (event.value === 'SAN') {
      this.showReason = true;
      this.showSupportingDocumentPart2 = false;
      this.serviceReceived = false;
      this.paeSubmitForm.get('reasonDtl').setValidators(Validators.required);
      this.paeSubmitForm.get('sisPaSrvcSw').clearValidators();
      this.paeSubmitForm.get('sisResidentialSrvcSw').clearValidators();
      this.paeSubmitForm.get('sisDatSrvcSw').clearValidators();
    }

  }

  onChangeapplicantIncontSw(mrChange: MatRadioChange) {
    if (mrChange.value === 'N') {
      this.showTransitionNoMessage = true;
    }
    else if (mrChange.value === 'Y') {
      this.showTransitionNoMessage = false;
    }
  }

  onChangeCHOICESGROUP3(mrChange: MatRadioChange) {
    if (mrChange.value === 'N') {
      this.showActualDischargeDate = false;
      this.paeSubmitForm.get('actualDischargeDt').clearValidators();
    }
    else if (mrChange.value === 'Y') {
      this.showActualDischargeDate = true;
      this.paeSubmitForm.get('actualDischargeDt').setValidators(Validators.required);
    }
  }


  onChangeCeaSw(mrChange: MatRadioChange) {
    if (mrChange.value === 'Y') {
      this.documentCeaSw = true; 
    }
    else if (mrChange.value === 'N') {
      this.documentCeaSw = false;
    }
  }

  back() {
    this.isSamePageNavigation =  true;
    this.router.navigate(['/ltss/pae/paeStart/paeSummary']);
  }

  edit(pageId) {
    console.log('pageId===', pageId);
    const nextPath = PaeFlowSeq[pageId];
    this.router.navigate(['/ltss/pae/paeStart/' + nextPath]);
  }

  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    console.log(this. paeSubmitForm);
    return this.isSamePageNavigation ? true : !this. paeSubmitForm.dirty;
  }

  resetForm(){
    this. paeSubmitForm.reset();
  }
}
