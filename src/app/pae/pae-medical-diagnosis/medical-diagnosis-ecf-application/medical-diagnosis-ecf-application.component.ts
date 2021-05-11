import { PaeCommonService } from './../../../core/services/pae/pae-common/pae-common.service';
import { Component, HostListener, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatRadioChange, MatRadioButton } from '@angular/material/radio';
import { MatSelectChange } from '@angular/material/select';
import { CustomvalidationService } from '../../../_shared/utility/customvalidation.service';
import * as customValidation from '../../../_shared/constants/validation.constants';
import { MedicalDiagonsis } from '../../Diagnosisdata';
import { MedicalDiagnosisService } from '../../../core/services/pae/medicalDiagnosis/medical-diagnosis.service';
import { Router } from '@angular/router';
import { PaeMedical } from 'src/app/_shared/model/PaeMedicalDiagnosis/PaeMedical';
import { PaeFlowSeq } from 'src/app/_shared/utility/PaeFlowSeq';
import { PaeService } from '../../../core/services/pae/pae.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgSelectComponent } from '@ng-select/ng-select';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SavePopupComponent } from 'src/app/savePopup/savePopup.component';
import { ReferralService } from 'src/app/core/services/referral/referral.service';
import { IntakeOutcomeService } from 'src/app/core/services/referral/intake-outcome/intake-outcome.service';
import { ComponentCanDeactivate } from 'src/app/core/helpers/pending-change.guard';
import { Observable } from 'rxjs';
import * as Constants from '../../../_shared/constants/application.constants';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-medical-diagnosis-ecf-application',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './medical-diagnosis-ecf-application.component.html',
  styleUrls: ['./medical-diagnosis-ecf-application.component.scss']
})
export class MedicalDiagnosisEcfApplicationComponent implements OnInit, OnDestroy {
  documentSettings: IDropdownSettings;
  @ViewChild(NgSelectComponent) ngSelectComponent: NgSelectComponent;
  medicalDocumentSettings: IDropdownSettings;
  subscription1$: Subscription;
  meidicalDiagnosis: any = [];
  customValidation = customValidation;
  medicalDiagnosis: FormGroup;
  showPsychologicalSection = false;
  showDocumentSection = false;
  showOtherSection = false;
  showLevelIntellectualSection = false;
  showPresentingChronicDiagnosis = false;
  submitted = false;
  medDocuments = [];
  medDiagnosisDoc = [];
  reqPageId: string;
  paeId: string;
  personId: string;
  nextPath: any;
  showNotes = false;
  backSubscription$: Subscription;
  subscriptions$: any;
  pageId: any;
  refId: string;
  startDate = new Date();
  documentList = [{ code: 'OFF', value: 'Office Notes', activateSW: 'Y' },
  { code: 'ATT', value: 'Attestations from Family', activateSW: 'Y' },
  { code: 'SCH', value: 'School records', activateSW: 'Y' },
  { code: 'ISP', value: 'ISP', activateSW: 'Y' },
  { code: 'IQT', value: 'IQ Test Scores', activateSW: 'Y' },
  { code: 'PSY', value: 'Psychosocial Assessment', activateSW: 'Y' },
  { code: 'ICA', value: 'ICAP', activateSW: 'Y' },
  { code: 'OTH', value: 'Other', activateSW: 'Y' }];
  data: any;
  targetPopulation: any;
  isSamePageNavigation: boolean;
  applicantName: string;
  constructor(private fb: FormBuilder,
              private router: Router,
              private paeCommonService: PaeCommonService,
              private medicalDiagnosisService: MedicalDiagnosisService,
              private paeService: PaeService,
              private dialog: MatDialog,
              private medicalDiagonsis: MedicalDiagonsis,
              private intakeOutcomeService: IntakeOutcomeService, private refService: ReferralService) { }


  getFormData() {
    return this.medicalDiagnosis.controls;
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
    this.refId = this.paeCommonService.getRowElement().refId;
    this.paeId = this.paeCommonService.getPaeId();
    this.personId = this.paeCommonService.getPersonId(),
      this.pageId = 'PPDMD';
    this.meidicalDiagnosis = this.medicalDiagonsis.data;
    this.medicalDiagnosis = this.fb.group({
      intlctulDisSw: [''
      ],
      psycEvalSw: ['', [Validators.required]],
      iqTestScore: [''],
      iqTestDt: [''],
      iqTestTypeDesc: ['', [Validators.maxLength(2000), Validators.pattern('^[a-zA-Z0-9\' \-]+$')]],
      chrncDiagnsSw: ['', [Validators.required]],
      trgtPopDiagnsCd: [''],
      docDtlsDesc: ['', [Validators.maxLength(2000), Validators.pattern('^[a-zA-Z0-9\' \-]+$')]],
      lvlIntelDisabilityCd: [''],
      personId: [''],
      medicalDiagnosisCdList: [''],
      othrMedDiagns: [''],
      persist6MonthsSw: [''],
      expctd12MonthsSw: [''],
      primaryDiagnsSw: [''],
      medDiagnsCd: [''],
      medDocumentCd: ['']
    });
    this.getPaeDiagnosisData();
    this.getIntakeoutcomeForm();
      // this.getPaeDiagnosisData();
    this.getIntakeoutcomeForm();
    if ((this.paeCommonService.getRowElement()).refId !== null && (this.paeCommonService.getRowElement()).refId !== undefined){
       this.getIntakeoutcomeForm();
       console.log('this.paeCommonService.getRowElement()', this.paeCommonService.getRowElement());
     } else if (this.paeCommonService.getPaeId() !== null && this.paeCommonService.getPaeId() !== undefined){
       this.getPaeDiagnosisData();
     }

    if (this.paeCommonService.getApplicantName() === null || this.paeCommonService.getApplicantName() === ''
    || this.paeCommonService.getApplicantName() === undefined){
      this.getApplicantName();
    } else {
      this.applicantName =  this.paeCommonService.getApplicantName();
    }
   }

   getApplicantName(){
    this.paeService.getPaeApplicantInformation(this.paeCommonService.getPaeId(), this.pageId).then((response) => {
      console.log('reponseforName' + JSON.stringify(response.body.firstName));
      this.applicantName =  response.body.firstName + ' ' + response.body.lastName;
      this.paeCommonService.setApplicantName(this.applicantName);
    });
  }

  ngOnDestroy() {
    if (this.subscriptions$ && this.subscriptions$.length > 0) {
      this.subscriptions$.forEach(subscription$ => subscription$.unsubscribe());
    }
  }
  switchPsychologicalEvaluation(matRadioChange: MatRadioChange) {
    if (matRadioChange.value === 'N') {
      this.showLevelIntellectualSection = false;
      this.showDocumentSection = true;
      this.medicalDiagnosis.get('lvlIntelDisabilityCd').clearValidators();
      this.medicalDiagnosis.get('iqTestScore').clearValidators();
      this.medicalDiagnosis.get('iqTestDt').clearValidators();
      this.medicalDiagnosis.get('iqTestTypeDesc').clearValidators();
      this.showNotes = true;
    }
    if (matRadioChange.value === 'Y') {
      this.medicalDiagnosis.get('medDocumentCd').setValue(null);
      this.showDocumentSection = false;
      this.showLevelIntellectualSection = true;
      this.showNotes = false;
      this.showOtherSection = false;
      this.medicalDiagnosis.get('lvlIntelDisabilityCd').setValidators(Validators.required);
      this.medicalDiagnosis.get('iqTestScore').setValidators(Validators.required);
      this.medicalDiagnosis.get('iqTestDt').setValidators(Validators.required);
      this.medicalDiagnosis.get('iqTestTypeDesc').setValidators(Validators.required);

      this.medicalDiagnosis.get('lvlIntelDisabilityCd').markAsUntouched();
      this.medicalDiagnosis.get('iqTestScore').markAsUntouched();
      this.medicalDiagnosis.get('iqTestDt').markAsUntouched();
      this.medicalDiagnosis.get('iqTestTypeDesc').markAsUntouched();
    }
    this.medicalDiagnosis.get('lvlIntelDisabilityCd').updateValueAndValidity();
    this.medicalDiagnosis.get('iqTestScore').updateValueAndValidity();
    this.medicalDiagnosis.get('iqTestDt').updateValueAndValidity();
    this.medicalDiagnosis.get('iqTestTypeDesc').updateValueAndValidity();
    this.medicalDiagnosis.get('lvlIntelDisabilityCd').setValue(null);
    this.medicalDiagnosis.get('iqTestScore').setValue(null);
    this.medicalDiagnosis.get('iqTestDt').setValue(null);
    this.medicalDiagnosis.get('iqTestTypeDesc').setValue(null);
  }

  selectDocument(event) {
    console.log('value=====', event);
    if (event.length === 0) {
      this.showOtherSection = false;
    }
    for (let eventCount = 0; eventCount < event.length; eventCount++) {
      if (this.medDocuments.indexOf(event[eventCount].code) == -1) {
        this.medDocuments.push(event[eventCount].code);
      }
      if (event[eventCount].code === 'OTH') {
        this.showOtherSection = true;
      }
    }
    this.medicalDiagnosis.patchValue(event);

  }

  switchChronicDiagnosis(matRadioChange: MatRadioChange) {
    if (matRadioChange.value === 'Y') {
      this.showPresentingChronicDiagnosis = true;
      this.medicalDiagnosis.get('medDiagnsCd').setValue(null);
    } else {
      this.showPresentingChronicDiagnosis = false;
    }
  }

  selectTargetPopulation(matSelectChange: MatSelectChange) {
    console.log('value=====', matSelectChange.value);
    if (matSelectChange.value === 'ID') {
      this.showPsychologicalSection = true;
      this.showOtherSection = false;
    } else {
      this.showPsychologicalSection = false;
      this.showLevelIntellectualSection = false;
      this.showDocumentSection = false;
      this.medicalDiagnosis.get('psycEvalSw').clearValidators();
      this.medicalDiagnosis.get('psycEvalSw').setValue(null);
    }
    if (matSelectChange.value === 'DD') {
      this.showOtherSection = false;
      this.medicalDiagnosis.get('psycEvalSw').clearValidators();
      this.medicalDiagnosis.get('psycEvalSw').setValue(null);
    }
    if (matSelectChange.value === 'NO') {
      this.showOtherSection = false;
      this.medicalDiagnosis.get('psycEvalSw').clearValidators();
      this.medicalDiagnosis.get('psycEvalSw').setValue(null);
    }

  }

  selectMedicalDiagnosis(event) {
    console.log('event====', event);
    for (let eventCount = 0; eventCount < event.length; eventCount++) {
      if (this.medDiagnosisDoc.indexOf(event[eventCount].id) == -1) {
        this.medDiagnosisDoc.push(event[eventCount].id);
      }
    }
    this.medicalDiagnosis.patchValue(event);


  }
  async onSubmit(showPopup?: boolean) {
    this.isSamePageNavigation = true;
    this.submitted = true;
    console.log(this.getFormData());
    console.log('√=====', this.medicalDiagnosis.valid);
    if (this.medicalDiagnosis.valid) {
      const medicalDiagnosisCDList = [];
      for (let i = 0; i < this.medDiagnosisDoc.length; i++) {
        medicalDiagnosisCDList.push({
          medDiagnsCd: this.medDiagnosisDoc[i]
        });
      }


      const paeMedical = new PaeMedical(
        this.reqPageId = 'PPDMD',
        this.paeId = this.paeCommonService.getPaeId(),
        this.getFormData().intlctulDisSw.value,
        this.getFormData().psycEvalSw.value,
        this.getFormData().iqTestScore.value,
        this.getFormData().iqTestDt.value,

        this.getFormData().iqTestTypeDesc.value,
        this.getFormData().chrncDiagnsSw.value,
        this.getFormData().trgtPopDiagnsCd.value,
        this.getFormData().docDtlsDesc.value,
        this.getFormData().lvlIntelDisabilityCd.value,
        this.personId,
        medicalDiagnosisCDList,
        this.medDocuments
      );
      const that = this;
      console.log('paeMedical=====', paeMedical);
      this.medicalDiagnosisService.saveMedicalDiagnosis(paeMedical).then((response) => {
        console.log('res', response);
        const nextPage = response.headers.get('next');
        console.log(nextPage);
        that.nextPath = PaeFlowSeq[nextPage];
        console.log(that.nextPath);
        if (showPopup) {
          const dialogConfig = new MatDialogConfig();
          dialogConfig.data = { route: 'ltss/pae' };
          // dialogConfig.data = { route: 'ltss/pae' , nextRoute: '/ltss/pae/paeStart/' + this.nextPath };
          dialogConfig.panelClass = 'exp_popup';
          dialogConfig.width = '648px';
          dialogConfig.height = '360px';
          this.dialog.open(SavePopupComponent, dialogConfig);
        } else {
          that.router.navigate(['/ltss/pae/paeStart/' + that.nextPath]);
        }
      });

    }
  }

  saveAndExit() {
    this.onSubmit(true);
  }
  goBack() {
    this.isSamePageNavigation = true;
    this.paeService.navigateToChildPreviousPage(this.pageId);
  }

  getIntakeoutcomeForm(){
    const response = this.intakeOutcomeService.getIntakeOutcome(this.paeCommonService.getRowElement().refId);
    response.then(data => {
      console.log(data.body);
      this.targetPopulation = data.body[0].trgtPopltnDiagnsCd;
      console.log(' response, response, response',  this.targetPopulation);
      if (this.targetPopulation === 'ID') {
        this.showPsychologicalSection = true;
      }
      this.getFormData().trgtPopDiagnsCd.patchValue(this.targetPopulation);
    });
  }


  getPaeDiagnosisData() {
    this.subscription1$ = this.medicalDiagnosisService
      .getMedicalDiagnosisData(this.paeCommonService.getPaeId())
      .subscribe((diagnosisResponse) => {
        console.log('diagnosisResponse====', diagnosisResponse);
        if (diagnosisResponse.trgtPopDiagnsCd === 'ID') {
          this.showPsychologicalSection = true;
        }
        if (diagnosisResponse.psycEvalSw === 'N') {
          this.showLevelIntellectualSection = false;
          this.showDocumentSection = true;
          this.showNotes = false;
        } else if (diagnosisResponse.psycEvalSw === 'Y') {
          this.showLevelIntellectualSection = true;
          this.showDocumentSection = false;
          this.showNotes = true;
        }
        if (diagnosisResponse.chrncDiagnsSw === 'Y') {
          this.showPresentingChronicDiagnosis = true;
        } else if (diagnosisResponse.chrncDiagnsSw === 'N') {
          this.showPresentingChronicDiagnosis = false;
        }
        const sampleArrayMedDocument = [];
        const sampleArrayMedDiagns = [];
        for (let i = 0; i < this.documentList.length; i++) {
          for (let j = 0; j < diagnosisResponse.medDocumentCd.length; j++) {
            if (diagnosisResponse.medDocumentCd[j] == this.documentList[i].code) {
              sampleArrayMedDocument.push(this.documentList[i].value);
            }
          }
        }

        for (let i = 0; i < this.meidicalDiagnosis.length; i++) {
          for (let j = 0; j < diagnosisResponse.medicalDiagnosisCdList.length; j++) {
            if (diagnosisResponse.medicalDiagnosisCdList[j].medDiagnsCd == this.meidicalDiagnosis[i].id) {
              sampleArrayMedDiagns.push(this.meidicalDiagnosis[i].name);
            }
          }
        }
        diagnosisResponse.medDocumentCd = sampleArrayMedDocument;
        diagnosisResponse.medDiagnsCd = sampleArrayMedDiagns;

        this.medicalDiagnosis.patchValue(diagnosisResponse);
      });
  }

  onItemDeSelect(value) {
    this.medDiagnosisDoc = this.medDiagnosisDoc.filter(obj => obj !== value.label);
  }

  onItemDeSelectDocument(value) {
    this.medDocuments = this.medDocuments.filter(obj => obj !== value.label);
    if (value.label === 'Other') {
      this.showOtherSection = false;
    }
  }
}
