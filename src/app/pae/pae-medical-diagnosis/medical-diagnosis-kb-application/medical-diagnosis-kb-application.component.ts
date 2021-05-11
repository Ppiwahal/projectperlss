import { Component, HostListener, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatRadioChange, MatRadioButton } from '@angular/material/radio';
import { Observable } from 'rxjs';
import { ComponentCanDeactivate } from 'src/app/core/helpers/pending-change.guard';
import { MedicalDiagnosisService } from 'src/app/core/services/pae/medicalDiagnosis/medical-diagnosis.service';
import { PaeMedical } from 'src/app/_shared/model/PaeMedicalDiagnosis/PaeMedical';
//import { MatSelectChange } from '@angular/material/select';
import { CustomvalidationService } from 'src/app/_shared/utility/customvalidation.service';
import * as customValidation from '../../../_shared/constants/validation.constants';
import { MedicalDiagonsis } from '../../Diagnosisdata';
/* import { MedicalDiagonsis } from '../Diagnosisdata';
import { MedicalDiagnosisService } from '../../core/services/pae/medicalDiagnosis/medical-diagnosis.service'; */

@Component({
  selector: 'app-medical-diagnosis-kb-application',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './medical-diagnosis-kb-application.component.html',
  styleUrls: ['./medical-diagnosis-kb-application.component.scss']
})
export class MedicalDiagnosisKbApplicationComponent implements OnInit {
  meidicalDiagnosis: any;
  customValidation = customValidation;
  medicalDiagnosis: FormGroup;
  addDiagnosisDetails: FormGroup;
  showPresentingChronicDiagnosis: boolean = false;
  panelOpenState = false;
  showOtherSection: boolean = false;
  submitted: boolean = false;
  showAddDiagnosisForm: boolean = true;
  reqPageId: string;
  paeId: string;
  personId: string;
  medDocuments= [];
  medicalDiagnosisDetail = [];
  isSamePageNavigation:boolean;

  constructor(private fb: FormBuilder,
    private customValidator: CustomvalidationService,
    private medicalDiagonsis: MedicalDiagonsis,
    private medicalDiagnosisService: MedicalDiagnosisService) { }

  getFormData() {
    return this.medicalDiagnosis.controls;
  }

  ngOnInit(): void {
    this.getMedicalDiagnosisData();
    this.meidicalDiagnosis = this.medicalDiagonsis.data;
    this.medicalDiagnosis = this.fb.group({
      intlctulDisSw: [''],
      psycEvalSw: [''],
      iqTestScore: [''],
      iqTestDt: [''],
      iqTestTypeDesc: [''],
      chrncDiagnsSw: [''],
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
      docDetailsDesc: [''],
      presistedSw: ['', []],
      expectedSw: ['', []],
      primarySw: ['', []]
    });
  }

  switchChronicDiagnosis(matRadioChange: MatRadioChange) {
    if (matRadioChange.value === 'Y') {
      this.showPresentingChronicDiagnosis = true;
      this.medicalDiagnosis.get('presistedSw').setValidators(Validators.required);
      this.medicalDiagnosis.get('expectedSw').setValidators(Validators.required);
      this.medicalDiagnosis.get('primarySw').setValidators(Validators.required);
    } else {
      this.showPresentingChronicDiagnosis = false;
      this.medicalDiagnosis.get('presistedSw').clearValidators();
      this.medicalDiagnosis.get('presistedSw').clearValidators();
      this.medicalDiagnosis.get('primarySw').clearValidators();
    }
  }

  selectMedicalDiagnosis(event) {
    console.log('value=====', event.name);
    if (event.name == 'Other') {
      this.showOtherSection = true;
    } else {
      this.showOtherSection = false;
    }
    for(let eventCount=0; eventCount < event.length; eventCount++) {
        if(this.medDocuments.indexOf(event[eventCount].id) == -1) {
          this.medDocuments.push(event[eventCount].id);
        }
    }
  }

  toggleAddDiagnosis() {
    this.showAddDiagnosisForm = false;
  }

  cancelAddDiagnosis() {
    this.isSamePageNavigation =  true;

    this.showAddDiagnosisForm = true;
  }

  /* async onSubmit() {
    this.submitted = true;
    console.log("this.medicalDiagnosis.valid===", this.addDiagnosisDetails.valid)
    if (this.addDiagnosisDetails.valid) {
      try {
        let response = await this.medicalDiagnosisService.saveMedicalDiagnosis({
          ...this.addDiagnosisDetails.value,
        });
        // this.myForm.reset();
        console.log(response);
      } catch (e) {

      }
    }
  } */

  async onSubmit() {
    this.isSamePageNavigation =  true;
    this.submitted = true;
    console.log("√=====", this.medicalDiagnosis.valid)
    if (this.medicalDiagnosis.valid) {
      let medicalDiagnosisCDList = [];
      medicalDiagnosisCDList.push({
        "othrMedDiagns":this.getFormData().othrMedDiagns.value,
        "persist6MonthsSw": this.getFormData().persist6MonthsSw.value,
        "expctd12MonthsSw": this.getFormData().expctd12MonthsSw.value,
        "primaryDiagnsSw": this.getFormData().primaryDiagnsSw.value,
        "medDiagnsCd": this.getFormData().medDiagnsCd.value

      })
    //  const medicalDiagnosisCDList = new MedicalDiagnosisCDList(
      //  this.getFormData().othrMedDiagns.value,
      //  this.getFormData().persist6MonthsSw.value,
      //  this.getFormData().expctd12MonthsSw.value,
      //  this.getFormData().primaryDiagnsSw.value,
      //  this.getFormData().medDiagnsCd.value ,
      //);

      const paeMedical = new PaeMedical(
        this.reqPageId = '1',
        this.paeId = 'PAE1000007',
        this.getFormData().intlctulDisSw.value,
        this.getFormData().psycEvalSw.value,
        this.getFormData().iqTestScore.value,
        this.getFormData().iqTestDt.value,
        this.getFormData().iqTestTypeDesc.value,
        this.getFormData().chrncDiagnsSw.value,
        this.getFormData().trgtPopDiagnsCd.value,
        this.getFormData().docDtlsDesc.value,
        this.getFormData().lvlIntelDisabilityCd.value,
        this.personId ='8000001',
        medicalDiagnosisCDList,
        this.medDocuments
      )
      this.medicalDiagnosisService.saveMedicalDiagnosis(paeMedical).then((res) => {
        console.log('res', res)
      });
    }
  }

  sendingYesorNo(input: boolean) {
    if (input === true) {
      return 'Y';
    } else if (input === false) {
      return 'N';
    }
    else {
      return null;
    }
  }

  getMedicalDiagnosisData() {
    this.paeId = 'PAE1000007'
    // this.medicalDiagnosisService.getMedicalDiagnosisData(this.paeId).then((res) => {
    //   console.log('res', res)
    //   console.log("this.meidicalDiagnosis====", this.meidicalDiagnosis)
    //   if(res.status == 200 && res.body.medicalDiagnosisCdList.length >0) {
    //     this.medicalDiagnosisDetail = res.body.medicalDiagnosisCdList;
    //     for(let medicalCount = 0; medicalCount < this.meidicalDiagnosis.length; medicalCount++) {
    //       for(let medicalDiagnosisCount = 0; medicalDiagnosisCount < this.medicalDiagnosisDetail.length; medicalDiagnosisCount++) {
    //         if(this.medicalDiagnosisDetail[medicalDiagnosisCount].medDiagnsCd == this.meidicalDiagnosis[medicalCount].name) {
    //           let data = [{
    //             "expctd12MonthsSw": this.medicalDiagnosisDetail[medicalDiagnosisCount].expctd12MonthsSw,
    //             "medDiagnsCd": this.meidicalDiagnosis[medicalCount].name,
    //             "othrMedDiagns": this.medicalDiagnosisDetail[medicalDiagnosisCount].othrMedDiagns,
    //             "persist6MonthsSw": this.medicalDiagnosisDetail[medicalDiagnosisCount].persist6MonthsSw,
    //             "primaryDiagnsSw": this.medicalDiagnosisDetail[medicalDiagnosisCount].primaryDiagnsSw
    //           }]
    //           this.medicalDiagnosisDetail.push(this.meidicalDiagnosis[medicalCount].name)
    //         }
    //       }
    //     }
    //     console.log("this.medicalDiagnosisDetail====after for loop", this.medicalDiagnosisDetail)
    //
    //   } else {
    //     this.medicalDiagnosisDetail = [];
    //   }
    // });
  }

}
