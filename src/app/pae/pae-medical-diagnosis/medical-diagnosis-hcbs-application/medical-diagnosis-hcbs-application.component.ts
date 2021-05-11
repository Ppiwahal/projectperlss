import { Component, HostListener, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatRadioChange, MatRadioButton } from '@angular/material/radio';
import { CustomvalidationService } from '../../../_shared/utility/customvalidation.service';
import * as customValidation from '../../../_shared/constants/validation.constants';
import { MedicalDiagonsis } from '../../Diagnosisdata';
import { MedicalDiagnosisService } from '../../../core/services/pae/medicalDiagnosis/medical-diagnosis.service';
import { Router } from '@angular/router';
import { PaeMedical } from 'src/app/_shared/model/PaeMedicalDiagnosis/PaeMedical';
import { Observable, Subscription } from 'rxjs';
import { PaeService } from 'src/app/core/services/pae/pae.service';
import { PaeCommonService } from 'src/app/core/services/pae/pae-common/pae-common.service';
import { PaeFlowSeq } from 'src/app/_shared/utility/PaeFlowSeq';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SavePopupComponent } from 'src/app/savePopup/savePopup.component';
import { ComponentCanDeactivate } from 'src/app/core/helpers/pending-change.guard';
@Component({
  selector: 'app-medical-diagnosis-hcbs-application',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './medical-diagnosis-hcbs-application.component.html',
  styleUrls: ['./medical-diagnosis-hcbs-application.component.scss']
})
export class MedicalDiagnosisHcbsApplicationComponent implements OnInit {
  submitted: boolean;
  meidicalDiagnosis: any;
  customValidation = customValidation;
  medicalDiagnosis: FormGroup;
  reqPageId: string;
  paeId: string;
  paeMedicalDiagnosis: any;
  medDocuments = [];
  personId: string;
  chrncDiagnsSw: boolean;
  pageId: any;
  medDiagnosisDoc = [];
  backSubscription$: Subscription;
  subscriptions$: any;
  subscription1$: Subscription;
  nextPath: any;
  isSamePageNavigation: boolean;
  applicantName: any;
  constructor(private fb: FormBuilder,
              private router: Router,
              private customValidator: CustomvalidationService,
              private medicalDiagonsis: MedicalDiagonsis,
              private paeService: PaeService,
              private dialog: MatDialog,
              private medicalDiagnosisService: MedicalDiagnosisService,
              private paeCommonService: PaeCommonService
  ) { }

  getFormData() {
    return this.medicalDiagnosis.controls;
  }
  ngOnInit(): void {
    this.getPaeDiagnosisData();
    this.paeId = this.paeCommonService.getPaeId();
    this.personId = this.paeCommonService.getPersonId(),
      this.meidicalDiagnosis = this.medicalDiagonsis.data;
    this.medicalDiagnosis = this.fb.group({
      intlctulDisSw: [''],
      psycEvalSw: [''],
      iqTestScore: [''],
      iqTestDt: [''],
      iqTestTypeDesc: [''],
      chrncDiagnsSw: [],
      trgtPopDiagnsCd: [''],
      docDtlsDesc: [''],
      lvlIntelDisabilityCd: [''],
      personId: [''],
      medicalDiagnosisCdList: [''],
      othrMedDiagns: [''],
      persist6MonthsSw: [''],
      expctd12MonthsSw: [''],
      primaryDiagnsSw: [''],
      medDiagnsCd: [''],
      medDocumentCd: [''],
    });

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

  switchChronicDiagnosis(matRadioChange: MatRadioChange) {
    if (matRadioChange.value === 'Y') {
      this.chrncDiagnsSw = true;
    } else {
      this.chrncDiagnsSw = false;
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
    this.isSamePageNavigation =  true;
    this.submitted = true;
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
      this.medicalDiagnosisService.saveMedicalDiagnosis(paeMedical).then((res) => {
        console.log('res', res);
        if (showPopup){
          const dialogConfig = new MatDialogConfig();
          dialogConfig.data = { route: 'ltss/pae' };
       // dialogConfig.data = { route: 'ltss/pae' , nextRoute: '/ltss/pae/paeStart/' + this.nextPath };
          dialogConfig.panelClass = 'exp_popup';
          dialogConfig.width = '648px';
          dialogConfig.height = '360px';
          this.dialog.open(SavePopupComponent, dialogConfig );
        } else {
          const nextPage = res.headers.get('next');
          console.log(nextPage);
          that.nextPath = PaeFlowSeq[nextPage];
          console.log(that.nextPath);
          that.router.navigate(['/ltss/pae/paeStart/' + that.nextPath]);
        }
      });

    }
  }
  saveAndExit(){
    this.isSamePageNavigation =  true;
     this.onSubmit(true);
  }
  goBack() {
    this.isSamePageNavigation =  true;
      this.paeService.navigateToChildPreviousPage(this.pageId);
  }


  getPaeDiagnosisData() {
    this.subscription1$ = this.medicalDiagnosisService
      .getMedicalDiagnosisData(this.paeCommonService.getPaeId())
      .subscribe((diagnosisResponse) => {
        console.log('diagnosisResponse====', diagnosisResponse);
        if (diagnosisResponse.chrncDiagnsSw === 'Y') {
          this.chrncDiagnsSw = true;
        }
        const sampleArrayMedDocument = [];
        const sampleArrayMedDiagns = [];

        for (let i = 0; i < this.meidicalDiagnosis.length; i++) {
          if (diagnosisResponse.medicalDiagnosisCdList) {
            for (let j = 0; j < diagnosisResponse.medicalDiagnosisCdList.length; j++) {
              if (diagnosisResponse.medicalDiagnosisCdList[j].medDiagnsCd == this.meidicalDiagnosis[i].id) {
                sampleArrayMedDiagns.push(this.meidicalDiagnosis[i].name);
              }
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
}
