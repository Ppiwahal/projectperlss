import { PaeCommonService } from './../../../../core/services/pae/pae-common/pae-common.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatRadioChange } from '@angular/material/radio';
import { SavePopupComponent } from '../../../../savePopup/savePopup.component';
import * as customValidation from '../../../../_shared/constants/validation.constants';
import { SkilledServicesDetails } from '../../../../_shared/model/skilledServicesDetails'
import { PaeSkilledServicesDetailsService } from 'src/app/core/services/pae/pae-skilled-services/pae-skilled-services-details.service';
import { PaeFlowSeq } from 'src/app/_shared/utility/PaeFlowSeq';
import { Subscription } from 'rxjs';
import { sectionTypeCdList } from '../../../../_shared/model/PaeSkilled'
import { Router } from '@angular/router';
import { PaeService } from 'src/app/core/services/pae/pae.service';
import { ViewChild } from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';
import * as Constants from '../../../../_shared/constants/application.constants';
import * as CryptoJS from 'crypto-js';
@Component({
  selector: 'app-pae-skilled-services-details-other',
  templateUrl: './pae-skilled-services-details-other.component.html',
  styleUrls: ['./pae-skilled-services-details-other.component.scss']
})
export class PaeSkilledServicesDetailsOtherComponent implements OnInit, OnDestroy {
  isSamePageNavigation: boolean;
  forms: FormGroup[] = [];
  skilledDetailsForm: FormGroup;
  sectionType: FormGroup;
  sectionType1: FormGroup;
  sectionType2: FormGroup;
  sectionType3: FormGroup;
  sectionType4: FormGroup;
  sectionType5: FormGroup;
  sectionType6: FormGroup;
  sectionType7: FormGroup;
  sectionType8: FormGroup;
  sectionType9: FormGroup;
  sectionType10: FormGroup;
  sectionType11: FormGroup;
  sectionType12: FormGroup;
  sectionType13: FormGroup;
  sectionType14: FormGroup;
  sectionType15: FormGroup;
  sectionType16: FormGroup;
  programName: any;
  reqPageId: string;
  paeId = this.paeCommonService.getPaeId(); pageId: any;
  subscription3$: Subscription;
  subscription2$: Subscription;
  ;
  submitted = false;
  customValidation = customValidation;
  minDate = new Date();
  nextPath: any;
  woundcareDataExists = false;
  programCd = 'EC4';
  startDate = new Date();

  SKILLEDSERVICE_NAME_NONKB =
    [{ "code": "WCS", "value": "Wound Care for Stage 3 or 4 Decubitus", "activateSW": "Y" },
    { "code": "OWC", "value": "Other Wound Care (i.e., infected or dehisced wounds)", "activateSW": "Y" },
    { "code": "ISS", "value": "Injections, sliding scale insulin", "activateSW": "Y" },
    { "code": "IOT", "value": "Injections, other: IV, IM", "activateSW": "Y" },
    { "code": "INT", "value": "Intravenous fluid administration", "activateSW": "Y" },
    { "code": "ISP", "value": "Isolation precautions", "activateSW": "Y" },
    { "code": "OCT", "value": "Occupational Therapy by OT or OT assistant", "activateSW": "Y" },
    { "code": "PHT", "value": "Physical Therapy by PT or PT assistant", "activateSW": "Y" },
    { "code": "TCO", "value": "Teaching Catheter/Ostomy care", "activateSW": "Y" },
    { "code": "TSI", "value": "Teaching self-injection", "activateSW": "Y" },
    { "code": "TPN", "value": "Total Parenteral nutrition", "activateSW": "Y" },
    { "code": "TFE", "value": "Tube feeding, enteral", "activateSW": "Y" },
    { "code": "PED", "value": "Peritoneal Dialysis", "activateSW": "Y" },
    { "code": "PCA", "value": "PCA Pump", "activateSW": "Y" },
    { "code": "TRS", "value": "Tracheostomy requiring suctioning", "activateSW": "Y" },
    { "code": "VNT", "value": "Ventilator", "activateSW": "Y" },
    { "code": "CVS", "value": "Chronic Ventilator Service ", "activateSW": "Y" },
    { "code": "SMT", "value": "Secretion Management Tracheal Suctioning ", "activateSW": "Y" }];
  woundcareDataCompleted = true;
  woundcareData: any;
  otherWoundcareData: any;
  otherWoundcareDataExists = false;
  injectionDataExists = false;
  injectionData: any;
  injectionOtherDataExists = false;
  injectionOtherData: any;
  intravenousFluidDataExists = false;
  intravenousFluidData: any;
  subscription1$: Subscription;
  subscriptions: Subscription[] = [];
  formDataCompleted = false;
  formData: any;
  formInitialized = false;
  woundCareDataCompleted = false;
  otherWoundcareDataCompleted = false;
  sectionTypeCd: any;
  injectionsDataCompleted = false;
  injectionsData: any;
  otherInjectionsDataCompleted = false;
  otherInjectionsData: any;
  isOpen: boolean;
  intFluidData: any;
  intFluidDataCompleted = false;
  isolationPreDataCompleted = false;
  isolationPreData: any;
  occTherapyData: any;
  occTherapyDataCompleted = false;
  phyTherapyDataCompleted = false;
  phyTherapyData: any;
  cathTeachingDataCompleted = false;
  cathTeachingData: any;
  selfTeachingDataCompleted = false;
  selfTeachingData: any;
  parNutritionDataCompleted = false;
  parNutritionData: any;
  tubeFeedingDataCompleted = false;
  tubeFeedingData: any;
  perDialysisDataCompleted = false;
  perDialysisData: any;
  pcaPumpDataCompleted = false;
  pcaPumpData: any;
  tracheostomyData: any;
  tracheostomyDataCompleted = false;
  ventilatorDataCompleted = false;
  ventilatorData: any;
  injectionDataCompleted = false;
  injectionOtherDataCompleted = false;
  intFluidDataExists = false;
  occTherapyDataExists = false;
  phyTherapyDataExists = false;
  teaCathDataExists = false;
  teaSelfDataExists = false;
  parNutritionDataExists = false;
  tubeFeedingDataExists = false;
  perDialysisDataExists = false;
  pcaPumpDataExists = false;
  tracheostomyDataExists = false;
  ventilatorDataExists = false;
  isolationPreDataExists = false;
  cathTeachingDataExists = false;
  selfTeachingDataExists = false;
  panelOpenState = false;
  teaCathDataCompleted: boolean;
  teaCathData: any;
  teaSelfData: any;
  teaSelfDataCompleted: boolean;
  accordionName: any;
  nextPagesubscription$: any;
  @ViewChild('mep', { static: true, read: MatExpansionPanel }) mep: MatExpansionPanel;
  @ViewChild('mea', { static: true, read: MatExpansionPanel }) mea: MatExpansionPanel;
  @ViewChild('mes', { static: true, read: MatExpansionPanel }) mes: MatExpansionPanel;
  @ViewChild('meb', { static: true, read: MatExpansionPanel }) meb: MatExpansionPanel;
  @ViewChild('mec', { static: true, read: MatExpansionPanel }) mec: MatExpansionPanel;
  @ViewChild('med', { static: true, read: MatExpansionPanel }) med: MatExpansionPanel;
  @ViewChild('mee', { static: true, read: MatExpansionPanel }) mee: MatExpansionPanel;
  @ViewChild('mef', { static: true, read: MatExpansionPanel }) mef: MatExpansionPanel;
  @ViewChild('meg', { static: true, read: MatExpansionPanel }) meg: MatExpansionPanel;
  @ViewChild('meh', { static: true, read: MatExpansionPanel }) meh: MatExpansionPanel;
  @ViewChild('mei', { static: true, read: MatExpansionPanel }) mei: MatExpansionPanel;
  @ViewChild('mej', { static: true, read: MatExpansionPanel }) mej: MatExpansionPanel;
  @ViewChild('mek', { static: true, read: MatExpansionPanel }) mek: MatExpansionPanel;
  @ViewChild('mel', { static: true, read: MatExpansionPanel }) mel: MatExpansionPanel;
  @ViewChild('mem', { static: true, read: MatExpansionPanel }) mem: MatExpansionPanel;
  @ViewChild('men', { static: true, read: MatExpansionPanel }) men: MatExpansionPanel;



  constructor(private fb: FormBuilder,
    private dialog: MatDialog,
    private paeCommonService: PaeCommonService,
    private paeService: PaeService,
    private PaeSkilledDetailsService: PaeSkilledServicesDetailsService,
    private router: Router) { }

  ngOnInit() {
    const timeTravelData = localStorage.getItem('TIME_TRAVEL_DATA');
    if(timeTravelData) {
      const timeTravelDataJson = JSON.parse(CryptoJS.AES.decrypt(timeTravelData, Constants.APP_ENC_DECRYPT_KEY).toString(CryptoJS.enc.Utf8));
      console.log("timeTravelDataJson ", timeTravelDataJson);
      if(timeTravelDataJson.timeTravelFlag && timeTravelDataJson.currentDate) {
        this.startDate = new Date(timeTravelDataJson.currentDate);
      }
    }
    this.formInitialized = true;
    this.programName = this.paeCommonService.getProgramName();
    this.paeId = this.paeCommonService.getPaeId();;
    this.skilledDetailsForm = this.fb.group({
      programCd: [this.programName],
      phyclSw: [null],
      speechSw: [null],
      occptnlSw: [null],
      noneSw: [null],
      intensive6wSessionSw: [null]
    });

    this.sectionType = this.fb.group({
      sectionTypeCd: [null],
      rqstdEndDt: [null, [Validators.required]],
      rqstdStartDt: [null, [Validators.required]],
      frqcy12monSw: [null],
      frqcyCd: [null],
      serviceRequiredSw: [null]
    });

    this.sectionType1 = this.fb.group({
      sectionTypeCd: [null],
      rqstdEndDt: [null, [Validators.required]],
      rqstdStartDt: [null, [Validators.required]],
      frqcy12monSw: [null],
      frqcyCd: [null],
      serviceRequiredSw: [null]
    });

    this.sectionType2 = this.fb.group({
      sectionTypeCd: [null],
      rqstdEndDt: [null, [Validators.required]],
      rqstdStartDt: [null, [Validators.required]],
      frqcy12monSw: [null],
      frqcyCd: [null],
      serviceRequiredSw: [null]
    });

    this.sectionType3 = this.fb.group({
      sectionTypeCd: [null],
      rqstdEndDt: [null, [Validators.required]],
      rqstdStartDt: [null, [Validators.required]],
      frqcy12monSw: [null],
      frqcyCd: [null],
      serviceRequiredSw: [null]
    })

    this.sectionType4 = this.fb.group({
      sectionTypeCd: [null],
      rqstdEndDt: [null, [Validators.required]],
      rqstdStartDt: [null, [Validators.required]],
      frqcy12monSw: [null],
      frqcyCd: [null],
      serviceRequiredSw: [null]
    })

    this.sectionType5 = this.fb.group({
      sectionTypeCd: [null],
      rqstdEndDt: [null, [Validators.required]],
      rqstdStartDt: [null, [Validators.required]],
      frqcy12monSw: [null],
      frqcyCd: [null],
      serviceRequiredSw: [null]
    })

    this.sectionType6 = this.fb.group({
      sectionTypeCd: [null],
      rqstdEndDt: [null, [Validators.required]],
      rqstdStartDt: [null, [Validators.required]],
      frqcy12monSw: [null],
      frqcyCd: [null],
      serviceRequiredSw: [null]
    })

    this.sectionType7 = this.fb.group({
      sectionTypeCd: [null],
      rqstdEndDt: [null, [Validators.required]],
      rqstdStartDt: [null, [Validators.required]],
      frqcy12monSw: [null],
      frqcyCd: [null],
      serviceRequiredSw: [null]
    })

    this.sectionType8 = this.fb.group({
      sectionTypeCd: [null],
      rqstdEndDt: [null, [Validators.required]],
      rqstdStartDt: [null, [Validators.required]],
      frqcy12monSw: [null],
      frqcyCd: [null],
      serviceRequiredSw: [null]
    })

    this.sectionType9 = this.fb.group({
      sectionTypeCd: [null],
      rqstdEndDt: [null, [Validators.required]],
      rqstdStartDt: [null, [Validators.required]],
      frqcy12monSw: [null],
      frqcyCd: [null],
      serviceRequiredSw: [null]
    })

    this.sectionType10 = this.fb.group({
      sectionTypeCd: [null],
      rqstdEndDt: [null, [Validators.required]],
      rqstdStartDt: [null, [Validators.required]],
      frqcy12monSw: [null],
      frqcyCd: [null],
      serviceRequiredSw: [null]
    })

    this.sectionType11 = this.fb.group({
      sectionTypeCd: [null],
      rqstdEndDt: [null, [Validators.required]],
      rqstdStartDt: [null, [Validators.required]],
      frqcy12monSw: [null],
      frqcyCd: [null],
      serviceRequiredSw: [null]
    })

    this.sectionType12 = this.fb.group({
      sectionTypeCd: [null],
      rqstdEndDt: [null, [Validators.required]],
      rqstdStartDt: [null, [Validators.required]],
      frqcy12monSw: [null],
      frqcyCd: [null],
      serviceRequiredSw: [null]
    })

    this.sectionType13 = this.fb.group({
      sectionTypeCd: [null],
      rqstdEndDt: [null, [Validators.required]],
      rqstdStartDt: [null, [Validators.required]],
      frqcy12monSw: [null],
      frqcyCd: [null],
      serviceRequiredSw: [null]
    })

    this.sectionType14 = this.fb.group({
      sectionTypeCd: [null],
      rqstdEndDt: [null, [Validators.required]],
      rqstdStartDt: [null, [Validators.required]],
      frqcy12monSw: [null],
      frqcyCd: [null],
      serviceRequiredSw: [null]
    })

    this.sectionType15 = this.fb.group({
      sectionTypeCd: [null],
      rqstdEndDt: [null, [Validators.required]],
      rqstdStartDt: [null, [Validators.required]],
      frqcy12monSw: [null],
      frqcyCd: [null],
      serviceRequiredSw: [null]
    })

    this.sectionType16 = this.fb.group({
      sectionTypeCd: [null],
      rqstdEndDt: [null, [Validators.required]],
      rqstdStartDt: [null, [Validators.required]],
      frqcy12monSw: [null],
      frqcyCd: [null],
      serviceRequiredSw: [null]
    })

    this.getAccordionData();
    this.forms = [
      this.skilledDetailsForm,
      this.sectionType,
      this.sectionType1,
      this.sectionType2,
      this.sectionType3,
      this.sectionType4,
      this.sectionType5,
      this.sectionType6,
      this.sectionType7,
      this.sectionType8,
      this.sectionType9,
      this.sectionType10,
      this.sectionType11,
      this.sectionType12,
      this.sectionType13,
      this.sectionType14,
      this.sectionType15,
      this.sectionType16
    ]
  }

  sendingYorN(input: boolean) {
    if (input === true) {
      return 'Y';
    } else if (input === false) {
      return 'N';
    }
    else {
      return null;
    }
  }

  openedAccordion(accordionName) {

    if (accordionName === 'WCS') {

      const sectionTypeCdList = [];
      sectionTypeCdList.push({
        'sectionTypeCd': this.sectionType1.controls.sectionTypeCd = accordionName,
        'rqstdEndDt': this.sectionType1.controls.rqstdEndDt.value,
        'rqstdStartDt': this.sectionType1.controls.rqstdStartDt.value,
        'frqcy12monSw': this.sectionType1.controls.frqcy12monSw.value,
        'frqcyCd': this.sectionType1.controls.frqcyCd.value,
        'serviceRequiredSw': this.sendingYorN(this.sectionType1.controls.serviceRequiredSw.value)
      });

      if (this.sectionType1.valid) {
        this.reqPageId = 'PPSSD';
        const paeSkilleddetails = new SkilledServicesDetails(
          this.reqPageId,
          this.paeId,
          this.programCd,
          sectionTypeCdList
        );
        const that = this;
        this.PaeSkilledDetailsService.postSkilledDetails(paeSkilleddetails).then((res) => {
          console.log('res', res);
          this.woundcareDataExists = true;
          this.sectionType1.controls.rqstdStartDt.disable();
          this.sectionType1.controls.rqstdEndDt.disable();
          this.mep.close();

        });
      }
    }

    else if (accordionName === 'OWC') {
      const sectionTypeCdList = [];
      sectionTypeCdList.push({
        'sectionTypeCd': this.sectionType2.controls.sectionTypeCd = accordionName,
        'rqstdEndDt': this.sectionType2.controls.rqstdEndDt.value,
        'rqstdStartDt': this.sectionType2.controls.rqstdStartDt.value,
        'frqcy12monSw': this.sectionType2.controls.frqcy12monSw.value,
        'frqcyCd': this.sectionType2.controls.frqcyCd.value,
        'serviceRequiredSw': this.sendingYorN(this.sectionType2.controls.serviceRequiredSw.value)
      });

      if (this.sectionType2.valid) {
        this.reqPageId = 'PPSSD';
        const paeSkilleddetails = new SkilledServicesDetails(
          this.reqPageId,
          this.paeId,
          this.programCd,
          sectionTypeCdList
        );
        const that = this;
        this.PaeSkilledDetailsService.postSkilledDetails(paeSkilleddetails).then((res) => {
          console.log('res', res);
          this.otherWoundcareDataExists = true;
          this.sectionType2.controls.rqstdStartDt.disable();
          this.sectionType2.controls.rqstdEndDt.disable();
          this.mea.close();

        });

      }
    }

    else if (accordionName === 'ISS') {
      const sectionTypeCdList = [];
      sectionTypeCdList.push({
        'sectionTypeCd': this.sectionType3.controls.sectionTypeCd = accordionName,
        'rqstdEndDt': this.sectionType3.controls.rqstdEndDt.value,
        'rqstdStartDt': this.sectionType3.controls.rqstdStartDt.value,
        'frqcy12monSw': this.sectionType3.controls.frqcy12monSw.value,
        'frqcyCd': this.sectionType3.controls.frqcyCd.value,
        'serviceRequiredSw': this.sendingYorN(this.sectionType3.controls.serviceRequiredSw.value)
      });

      if (this.sectionType3.valid) {
        this.reqPageId = 'PPSSD';
        const paeSkilleddetails = new SkilledServicesDetails(
          this.reqPageId,
          this.paeId,
          this.programCd,
          sectionTypeCdList
        );
        const that = this;
        this.PaeSkilledDetailsService.postSkilledDetails(paeSkilleddetails).then((res) => {
          console.log('res', res);
          this.injectionDataExists = true;
          this.sectionType3.controls.rqstdStartDt.disable();
          this.sectionType3.controls.rqstdEndDt.disable();
          this.mes.close();

        });

      }

    }

    else if (accordionName === 'IOT') {
      const sectionTypeCdList = [];
      sectionTypeCdList.push({
        'sectionTypeCd': this.sectionType4.controls.sectionTypeCd = accordionName,
        'rqstdEndDt': this.sectionType4.controls.rqstdEndDt.value,
        'rqstdStartDt': this.sectionType4.controls.rqstdStartDt.value,
        'frqcy12monSw': this.sectionType4.controls.frqcy12monSw.value,
        'frqcyCd': this.sectionType4.controls.frqcyCd.value,
        'serviceRequiredSw': this.sendingYorN(this.sectionType4.controls.serviceRequiredSw.value)
      });

      if (this.sectionType4.valid) {
        this.reqPageId = 'PPSSD';
        const paeSkilleddetails = new SkilledServicesDetails(
          this.reqPageId,
          this.paeId,
          this.programCd,
          sectionTypeCdList
        );
        const that = this;
        this.PaeSkilledDetailsService.postSkilledDetails(paeSkilleddetails).then((res) => {
          console.log('res', res);
          this.injectionOtherDataExists = true;
          this.sectionType4.controls.rqstdStartDt.disable();
          this.sectionType4.controls.rqstdEndDt.disable();
          this.meb.close();
        });

      }
    }

    else if (accordionName === 'INT') {
      const sectionTypeCdList = [];
      sectionTypeCdList.push({
        'sectionTypeCd': this.sectionType5.controls.sectionTypeCd = accordionName,
        'rqstdEndDt': this.sectionType5.controls.rqstdEndDt.value,
        'rqstdStartDt': this.sectionType5.controls.rqstdStartDt.value,
        'frqcy12monSw': this.sectionType5.controls.frqcy12monSw.value,
        'frqcyCd': this.sectionType5.controls.frqcyCd.value,
        'serviceRequiredSw': this.sendingYorN(this.sectionType5.controls.serviceRequiredSw.value)
      });

      if (this.sectionType5.valid) {
        this.reqPageId = 'PPSSD';
        const paeSkilleddetails = new SkilledServicesDetails(
          this.reqPageId,
          this.paeId,
          this.programCd,
          sectionTypeCdList
        );
        const that = this;
        this.PaeSkilledDetailsService.postSkilledDetails(paeSkilleddetails).then((res) => {
          console.log('res', res);
          this.intFluidDataExists = true;
          this.sectionType5.controls.rqstdStartDt.disable();
          this.sectionType5.controls.rqstdEndDt.disable();
          this.mec.close();
        });

      }
    }

    else if (accordionName === 'ISP') {
      const sectionTypeCdList = [];
      sectionTypeCdList.push({
        'sectionTypeCd': this.sectionType6.controls.sectionTypeCd = accordionName,
        'rqstdEndDt': this.sectionType6.controls.rqstdEndDt.value,
        'rqstdStartDt': this.sectionType6.controls.rqstdStartDt.value,
        'frqcy12monSw': this.sectionType6.controls.frqcy12monSw.value,
        'frqcyCd': this.sectionType6.controls.frqcyCd.value,
        'serviceRequiredSw': this.sendingYorN(this.sectionType6.controls.serviceRequiredSw.value)
      });

      if (this.sectionType6.valid) {
        this.reqPageId = 'PPSSD';
        const paeSkilleddetails = new SkilledServicesDetails(
          this.reqPageId,
          this.paeId,
          this.programCd,
          sectionTypeCdList
        );
        const that = this;
        this.PaeSkilledDetailsService.postSkilledDetails(paeSkilleddetails).then((res) => {
          console.log('res', res);
          this.isolationPreDataExists = true;
          this.sectionType6.controls.rqstdStartDt.disable();
          this.sectionType6.controls.rqstdEndDt.disable();
          this.med.close();
        });

      }
    }

    else if (accordionName === 'OCT') {
      const sectionTypeCdList = [];
      sectionTypeCdList.push({
        'sectionTypeCd': this.sectionType7.controls.sectionTypeCd = accordionName,
        'rqstdEndDt': this.sectionType7.controls.rqstdEndDt.value,
        'rqstdStartDt': this.sectionType7.controls.rqstdStartDt.value,
        'frqcy12monSw': this.sectionType7.controls.frqcy12monSw.value,
        'frqcyCd': this.sectionType7.controls.frqcyCd.value,
        'serviceRequiredSw': this.sendingYorN(this.sectionType7.controls.serviceRequiredSw.value)
      });

      if (this.sectionType7.valid) {
        this.reqPageId = 'PPSSD';
        const paeSkilleddetails = new SkilledServicesDetails(
          this.reqPageId,
          this.paeId,
          this.programCd,
          sectionTypeCdList
        );
        const that = this;
        this.PaeSkilledDetailsService.postSkilledDetails(paeSkilleddetails).then((res) => {
          console.log('res', res);
          this.occTherapyDataExists = true;
          this.sectionType7.controls.rqstdStartDt.disable();
          this.sectionType7.controls.rqstdEndDt.disable();
          this.mee.close();

        });

      }
    }

    else if (accordionName === 'PHT') {
      const sectionTypeCdList = [];
      sectionTypeCdList.push({
        'sectionTypeCd': this.sectionType8.controls.sectionTypeCd = accordionName,
        'rqstdEndDt': this.sectionType8.controls.rqstdEndDt.value,
        'rqstdStartDt': this.sectionType8.controls.rqstdStartDt.value,
        'frqcy12monSw': this.sectionType8.controls.frqcy12monSw.value,
        'frqcyCd': this.sectionType8.controls.frqcyCd.value,
        'serviceRequiredSw': this.sendingYorN(this.sectionType8.controls.serviceRequiredSw.value)
      });

      if (this.sectionType8.valid) {
        this.reqPageId = 'PPSSD';
        const paeSkilleddetails = new SkilledServicesDetails(
          this.reqPageId,
          this.paeId,
          this.programCd,
          sectionTypeCdList
        );
        const that = this;
        this.PaeSkilledDetailsService.postSkilledDetails(paeSkilleddetails).then((res) => {
          console.log('res', res);
          this.phyTherapyDataExists = true;
          this.sectionType8.controls.rqstdStartDt.disable();
          this.sectionType8.controls.rqstdEndDt.disable();
          this.mef.close();

        });

      }
    }

    else if (accordionName === 'TCO') {
      const sectionTypeCdList = [];
      sectionTypeCdList.push({
        'sectionTypeCd': this.sectionType9.controls.sectionTypeCd = accordionName,
        'rqstdEndDt': this.sectionType9.controls.rqstdEndDt.value,
        'rqstdStartDt': this.sectionType9.controls.rqstdStartDt.value,
        'frqcy12monSw': this.sectionType9.controls.frqcy12monSw.value,
        'frqcyCd': this.sectionType9.controls.frqcyCd.value,
        'serviceRequiredSw': this.sendingYorN(this.sectionType9.controls.serviceRequiredSw.value)
      });

      if (this.sectionType9.valid) {
        this.reqPageId = 'PPSSD';
        const paeSkilleddetails = new SkilledServicesDetails(
          this.reqPageId,
          this.paeId,
          this.programCd,
          sectionTypeCdList
        );
        const that = this;
        this.PaeSkilledDetailsService.postSkilledDetails(paeSkilleddetails).then((res) => {
          console.log('res', res);
          this.teaCathDataExists = true;
          this.sectionType9.controls.rqstdStartDt.disable();
          this.sectionType9.controls.rqstdEndDt.disable();
          this.meg.close();

        });

      }

    }

    else if (accordionName === 'TSI') {

      const sectionTypeCdList = [];
      sectionTypeCdList.push({
        'sectionTypeCd': this.sectionType10.controls.sectionTypeCd = accordionName,
        'rqstdEndDt': this.sectionType10.controls.rqstdEndDt.value,
        'rqstdStartDt': this.sectionType10.controls.rqstdStartDt.value,
        'frqcy12monSw': this.sectionType10.controls.frqcy12monSw.value,
        'frqcyCd': this.sectionType10.controls.frqcyCd.value,
        'serviceRequiredSw': this.sendingYorN(this.sectionType10.controls.serviceRequiredSw.value)
      });

      if (this.sectionType10.valid) {
        this.reqPageId = 'PPSSD';
        const paeSkilleddetails = new SkilledServicesDetails(
          this.reqPageId,
          this.paeId,
          this.programCd,
          sectionTypeCdList
        );
        const that = this;
        this.PaeSkilledDetailsService.postSkilledDetails(paeSkilleddetails).then((res) => {
          console.log('res', res);
          this.teaSelfDataExists = true;
          this.sectionType10.controls.rqstdStartDt.disable();
          this.sectionType10.controls.rqstdEndDt.disable();
          this.meh.close();

        });

      }
    }

    else if (accordionName === 'TPN') {
      const sectionTypeCdList = [];
      sectionTypeCdList.push({
        'sectionTypeCd': this.sectionType11.controls.sectionTypeCd = accordionName,
        'rqstdEndDt': this.sectionType11.controls.rqstdEndDt.value,
        'rqstdStartDt': this.sectionType11.controls.rqstdStartDt.value,
        'frqcy12monSw': this.sectionType11.controls.frqcy12monSw.value,
        'frqcyCd': this.sectionType11.controls.frqcyCd.value,
        'serviceRequiredSw': this.sendingYorN(this.sectionType11.controls.serviceRequiredSw.value)
      });

      if (this.sectionType11.valid) {
        this.reqPageId = 'PPSSD';
        const paeSkilleddetails = new SkilledServicesDetails(
          this.reqPageId,
          this.paeId,
          this.programCd,
          sectionTypeCdList
        );
        const that = this;
        this.PaeSkilledDetailsService.postSkilledDetails(paeSkilleddetails).then((res) => {
          console.log('res', res);
          this.parNutritionDataExists = true;
          this.sectionType11.controls.rqstdStartDt.disable();
          this.sectionType11.controls.rqstdEndDt.disable();
          this.mei.close();

        });

      }
    }

    else if (accordionName === 'TFE') {
      const sectionTypeCdList = [];
      sectionTypeCdList.push({
        'sectionTypeCd': this.sectionType12.controls.sectionTypeCd = accordionName,
        'rqstdEndDt': this.sectionType12.controls.rqstdEndDt.value,
        'rqstdStartDt': this.sectionType12.controls.rqstdStartDt.value,
        'frqcy12monSw': this.sectionType12.controls.frqcy12monSw.value,
        'frqcyCd': this.sectionType12.controls.frqcyCd.value,
        'serviceRequiredSw': this.sendingYorN(this.sectionType12.controls.serviceRequiredSw.value)
      });

      if (this.sectionType12.valid) {
        this.reqPageId = 'PPSSD';
        const paeSkilleddetails = new SkilledServicesDetails(
          this.reqPageId,
          this.paeId,
          this.programCd,
          sectionTypeCdList
        );
        const that = this;
        this.PaeSkilledDetailsService.postSkilledDetails(paeSkilleddetails).then((res) => {
          console.log('res', res);
          this.tubeFeedingDataExists = true;
          this.sectionType12.controls.rqstdStartDt.disable();
          this.sectionType12.controls.rqstdEndDt.disable();
          this.mej.close();

        });

      }
    }

    else if (accordionName === 'PED') {
      const sectionTypeCdList = [];
      sectionTypeCdList.push({
        'sectionTypeCd': this.sectionType13.controls.sectionTypeCd = accordionName,
        'rqstdEndDt': this.sectionType13.controls.rqstdEndDt.value,
        'rqstdStartDt': this.sectionType13.controls.rqstdStartDt.value,
        'frqcy12monSw': this.sectionType13.controls.frqcy12monSw.value,
        'frqcyCd': this.sectionType13.controls.frqcyCd.value,
        'serviceRequiredSw': this.sendingYorN(this.sectionType13.controls.serviceRequiredSw.value)
      });

      if (this.sectionType13.valid) {
        this.reqPageId = 'PPSSD';
        const paeSkilleddetails = new SkilledServicesDetails(
          this.reqPageId,
          this.paeCommonService.getPaeId(),
          this.programCd,
          sectionTypeCdList
        );
        const that = this;
        this.PaeSkilledDetailsService.postSkilledDetails(paeSkilleddetails).then((res) => {
          console.log('res', res);
          this.perDialysisDataExists = true;
          this.sectionType13.controls.rqstdStartDt.disable();
          this.sectionType13.controls.rqstdEndDt.disable();
          this.mek.close();
        });

      }

    }

    else if (accordionName === 'PCA') {
      const sectionTypeCdList = [];
      sectionTypeCdList.push({
        'sectionTypeCd': this.sectionType14.controls.sectionTypeCd = accordionName,
        'rqstdEndDt': this.sectionType14.controls.rqstdEndDt.value,
        'rqstdStartDt': this.sectionType14.controls.rqstdStartDt.value,
        'frqcy12monSw': this.sectionType14.controls.frqcy12monSw.value,
        'frqcyCd': this.sectionType14.controls.frqcyCd.value,
        'serviceRequiredSw': this.sendingYorN(this.sectionType14.controls.serviceRequiredSw.value)
      });

      if (this.sectionType14.valid) {
        this.reqPageId = 'PPSSD';
        const paeSkilleddetails = new SkilledServicesDetails(
          this.reqPageId,
          this.paeId,
          this.programCd,
          sectionTypeCdList
        );
        const that = this;
        this.PaeSkilledDetailsService.postSkilledDetails(paeSkilleddetails).then((res) => {
          console.log('res', res);
          this.pcaPumpDataExists = true;
          this.sectionType14.controls.rqstdStartDt.disable();
          this.sectionType14.controls.rqstdEndDt.disable();
          this.mel.close();

        });

      }
    }

    else if (accordionName === 'TRS') {
      const sectionTypeCdList = [];
      sectionTypeCdList.push({
        'sectionTypeCd': this.sectionType15.controls.sectionTypeCd = accordionName,
        'rqstdEndDt': this.sectionType15.controls.rqstdEndDt.value,
        'rqstdStartDt': this.sectionType15.controls.rqstdStartDt.value,
        'frqcy12monSw': this.sectionType15.controls.frqcy12monSw.value,
        'frqcyCd': this.sectionType15.controls.frqcyCd.value,
        'serviceRequiredSw': this.sendingYorN(this.sectionType15.controls.serviceRequiredSw.value)
      });

      if (this.sectionType15.valid) {
        this.reqPageId = 'PPSSD';
        const paeSkilleddetails = new SkilledServicesDetails(
          this.reqPageId,
          this.paeId,
          this.programCd,
          sectionTypeCdList
        );
        const that = this;
        this.PaeSkilledDetailsService.postSkilledDetails(paeSkilleddetails).then((res) => {
          console.log('res', res);
          this.tracheostomyDataExists = true;
          this.sectionType15.controls.rqstdStartDt.disable();
          this.sectionType15.controls.rqstdEndDt.disable();
          this.mem.close();

        });

      }
    }

    else if (accordionName === 'VNT') {
      const sectionTypeCdList = [];
      sectionTypeCdList.push({
        'sectionTypeCd': this.sectionType16.controls.sectionTypeCd = accordionName,
        'rqstdEndDt': this.sectionType16.controls.rqstdEndDt.value,
        'rqstdStartDt': this.sectionType16.controls.rqstdStartDt.value,
        'frqcy12monSw': this.sectionType16.controls.frqcy12monSw.value,
        'frqcyCd': this.sectionType16.controls.frqcyCd.value,
        'serviceRequiredSw': this.sendingYorN(this.sectionType16.controls.serviceRequiredSw.value)
      });

      if (this.sectionType16.valid) {
        this.reqPageId = 'PPSSD';
        const paeSkilleddetails = new SkilledServicesDetails(
          this.reqPageId,
          this.paeId,
          this.programCd,
          sectionTypeCdList
        );
        const that = this;
        this.PaeSkilledDetailsService.postSkilledDetails(paeSkilleddetails).then((res) => {
          console.log('res', res);
          this.ventilatorDataExists = true;
          this.sectionType16.controls.rqstdStartDt.disable();
          this.sectionType16.controls.rqstdEndDt.disable();
          this.men.close();

        });

      }
    }

  }



  back() {
    this.isSamePageNavigation = true;
    this.paeService.navigateToChildPreviousPage(this.reqPageId);
  }

  next() {
    this.isSamePageNavigation = true;
    this.submitted = true;
    if (this.submitted) {
      if (this.mep.toggle && this.sectionType1.controls.rqstdStartDt.value !== null
        && this.sectionType1.controls.rqstdEndDt.value !== null && !this.woundcareDataExists) {
        this.openedAccordion('WCS');

      }
      if (this.mea.toggle && this.sectionType2.controls.rqstdStartDt.value !== null
        && this.sectionType2.controls.rqstdEndDt.value !== null && !this.otherWoundcareDataExists) {
        this.openedAccordion('OWC');

      }
      if (this.mes.toggle && this.sectionType3.controls.rqstdStartDt.value !== null
        && this.sectionType3.controls.rqstdEndDt.value !== null && !this.injectionDataExists) {
        this.openedAccordion('ISS');

      }
      if (this.meb.toggle && this.sectionType4.controls.rqstdStartDt.value !== null
        && this.sectionType4.controls.rqstdEndDt.value !== null && !this.injectionOtherDataExists) {
        this.openedAccordion('IOT');

      }
      if (this.mec.toggle && this.sectionType5.controls.rqstdStartDt.value !== null
        && this.sectionType5.controls.rqstdEndDt.value !== null && !this.intFluidDataExists) {
        this.openedAccordion('INT');

      }
      if (this.med.toggle && this.sectionType6.controls.rqstdStartDt.value !== null
        && this.sectionType6.controls.rqstdEndDt.value !== null && !this.isolationPreDataExists) {
        this.openedAccordion('ISP');

      }
      if (this.mee.toggle && this.sectionType7.controls.rqstdStartDt.value !== null
        && this.sectionType7.controls.rqstdEndDt.value !== null && !this.occTherapyDataExists) {
        this.openedAccordion('OCT');

      }
      if (this.mef.toggle && this.sectionType8.controls.rqstdStartDt.value !== null
        && this.sectionType8.controls.rqstdEndDt.value !== null && !this.phyTherapyDataExists) {
        this.openedAccordion('PHT');

      }
      if (this.meg.toggle && this.sectionType9.controls.rqstdStartDt.value !== null
        && this.sectionType9.controls.rqstdEndDt.value !== null && !this.teaCathDataExists) {
        this.openedAccordion('TCO');

      }
      if (this.meh.toggle && this.sectionType10.controls.rqstdStartDt.value !== null
        && this.sectionType10.controls.rqstdEndDt.value !== null && !this.teaSelfDataExists) {
        this.openedAccordion('TSI');

      }
      if (this.mei.toggle && this.sectionType11.controls.rqstdStartDt.value !== null
        && this.sectionType11.controls.rqstdEndDt.value !== null && !this.parNutritionDataExists) {
        this.openedAccordion('TPN');
      }

      if (this.mej.toggle && this.sectionType12.controls.rqstdStartDt.value !== null
        && this.sectionType12.controls.rqstdEndDt.value !== null && !this.tubeFeedingDataExists) {
        this.openedAccordion('TFE');

      }
      if (this.mek.toggle && this.sectionType13.controls.rqstdStartDt.value !== null
        && this.sectionType13.controls.rqstdEndDt.value !== null && !this.perDialysisDataExists) {
        this.openedAccordion('PED');

      }
      if (this.mel.toggle && this.sectionType14.controls.rqstdStartDt.value !== null
        && this.sectionType14.controls.rqstdEndDt.value !== null && !this.pcaPumpDataExists) {
        this.openedAccordion('PCA');

      }

      if (this.mem.toggle && this.sectionType15.controls.rqstdStartDt.value !== null
        && this.sectionType15.controls.rqstdEndDt.value !== null && !this.tracheostomyDataExists) {
        this.openedAccordion('TRS');

      }
      if (this.men.toggle && this.sectionType16.controls.rqstdStartDt.value !== null
        && this.sectionType16.controls.rqstdEndDt.value !== null && !this.ventilatorDataExists) {
        this.openedAccordion('VNT');

      }
    }
    this.paeService.navigateToChildNextPage('PPSSD');
  }

  sectionTypeDataForm() {
    this.woundcareDataCompleted = true;
    if (this.woundcareData !== undefined) {
      if (this.woundcareData !== null) {
        if (!(this.woundcareData.hasOwnProperty('errorCode'))) {
          this.sectionType1.patchValue(this.woundcareData);

        }
      }

    }

    this.otherWoundcareDataCompleted = true;
    if (this.otherWoundcareData !== undefined) {
      if (this.otherWoundcareData !== null) {
        if (!(this.otherWoundcareData.hasOwnProperty('errorCode'))) {
          this.sectionType2.patchValue(this.otherWoundcareData);

        }
      }
    }
    this.injectionDataCompleted = true;
    if (this.injectionData !== undefined) {
      if (this.injectionData !== null) {
        if (!(this.injectionData.hasOwnProperty('errorCode'))) {
          this.sectionType3.patchValue(this.injectionData);

        }
      }
    }

    this.injectionOtherDataCompleted = true;
    if (this.injectionOtherData !== undefined) {
      if (this.injectionOtherData !== null) {
        if (!(this.injectionOtherData.hasOwnProperty('errorCode'))) {
          this.sectionType4.patchValue(this.injectionOtherData);
        }
      }
    }

    this.intFluidDataCompleted = true;
    if (this.intFluidData !== undefined) {
      if (this.intFluidData !== null) {
        if (!(this.intFluidData.hasOwnProperty('errorCode'))) {
          this.sectionType5.patchValue(this.intFluidData);

        }
      }
    }

    this.isolationPreDataCompleted = true;
    if (this.isolationPreData !== undefined) {
      if (this.isolationPreData !== null) {
        if (!(this.isolationPreData.hasOwnProperty('errorCode'))) {
          this.sectionType6.patchValue(this.isolationPreData);

        }
      }
    }

    this.occTherapyDataCompleted = true;
    if (this.occTherapyData !== undefined) {
      if (this.occTherapyData !== null) {
        if (!(this.occTherapyData.hasOwnProperty('errorCode'))) {
          this.sectionType7.patchValue(this.occTherapyData);

        }
      }
    }

    this.phyTherapyDataCompleted = true;
    if (this.phyTherapyData !== undefined) {
      if (this.phyTherapyData !== null) {
        if (!(this.phyTherapyData.hasOwnProperty('errorCode'))) {
          this.sectionType8.patchValue(this.phyTherapyData);

        }
      }
    }

    this.teaCathDataCompleted = true;
    if (this.teaCathData !== undefined) {
      if (this.teaCathData !== null) {
        if (!(this.teaCathData.hasOwnProperty('errorCode'))) {
          this.sectionType9.patchValue(this.teaCathData);

        }
      }
    }

    this.teaSelfDataCompleted = true;
    if (this.teaSelfData !== undefined) {
      if (this.teaSelfData !== null) {
        if (!(this.teaSelfData.hasOwnProperty('errorCode'))) {
          this.sectionType10.patchValue(this.teaSelfData);

        }
      }
    }

    this.parNutritionDataCompleted = true;
    if (this.parNutritionData !== undefined) {
      if (this.parNutritionData !== null) {
        if (!(this.parNutritionData.hasOwnProperty('errorCode'))) {
          this.sectionType11.patchValue(this.parNutritionData);

        }
      }
    }

    this.tubeFeedingDataCompleted = true;
    if (this.tubeFeedingData !== undefined) {
      if (this.tubeFeedingData !== null) {
        if (!(this.tubeFeedingData.hasOwnProperty('errorCode'))) {
          this.sectionType12.patchValue(this.tubeFeedingData);

        }
      }
    }

    this.perDialysisDataCompleted = true;
    if (this.perDialysisData !== undefined) {
      if (this.perDialysisData !== null) {
        if (!(this.perDialysisData.hasOwnProperty('errorCode'))) {
          this.sectionType13.patchValue(this.perDialysisData);

        }
      }
    }

    this.pcaPumpDataCompleted = true;
    if (this.pcaPumpData !== undefined) {
      if (this.pcaPumpData !== null) {
        if (!(this.pcaPumpData.hasOwnProperty('errorCode'))) {
          this.sectionType14.patchValue(this.pcaPumpData);

        }
      }
    }

    this.tracheostomyDataCompleted = true;
    if (this.tracheostomyData !== undefined) {
      if (this.tracheostomyData !== null) {
        if (!(this.tracheostomyData.hasOwnProperty('errorCode'))) {
          this.sectionType15.patchValue(this.tracheostomyData);

        }
      }
    }

    this.ventilatorDataCompleted = true;
    if (this.ventilatorData !== undefined) {
      if (this.ventilatorData !== null) {
        if (!(this.ventilatorData.hasOwnProperty('errorCode'))) {
          this.sectionType16.patchValue(this.ventilatorData);

        }
      }
    }
  }

  getAccordionData() {
    this.subscription1$ = this.PaeSkilledDetailsService
      .getSkilledDetails(this.paeId)
      .subscribe((DataResponse) => {
        for (let i = 0; i <= DataResponse.sectionTypeCd.length; i++) {
          if (DataResponse.sectionTypeCd[i] === null ||
            DataResponse.sectionTypeCd[i] === undefined ||
            DataResponse.sectionTypeCd[i] === "")
            break;

          const sectionTypeCd = [];
          if (DataResponse.sectionTypeCd[i].sectionTypeCd === "WCS") {
            if (this.woundcareDataExists = true) {
              this.sectionType1.disable();
            }
            if (DataResponse !== undefined) {
              if (DataResponse !== null) {
                if (!DataResponse.hasOwnProperty('errorCode')) {
                  this.woundcareData = DataResponse.sectionTypeCd[i];
                  this.sectionTypeDataForm();
                  this.woundcareDataExists = true;
                }
                if (DataResponse.hasOwnProperty('errorCode')) {
                  this.sectionTypeDataForm();
                  this.woundcareDataExists = false;
                }
                this.woundCareDataCompleted = true;
              }
              if (DataResponse === null) {
                this.sectionTypeDataForm();
                this.woundCareDataCompleted = true;
              }
            }
          }

          if (DataResponse.sectionTypeCd[i].sectionTypeCd === "OWC") {
            if (this.otherWoundcareDataExists = true) {
              this.sectionType2.disable();
            }
            if (DataResponse !== undefined) {
              if (DataResponse !== null) {
                if (!DataResponse.hasOwnProperty('errorCode')) {
                  this.otherWoundcareData = DataResponse.sectionTypeCd[i];
                  this.sectionTypeDataForm();
                  this.otherWoundcareDataExists = true;
                }
                if (DataResponse.hasOwnProperty('errorCode')) {
                  this.sectionTypeDataForm();
                  this.otherWoundcareDataExists = false;
                }
                this.otherWoundcareDataCompleted = true;
              }
              if (DataResponse === null) {
                this.sectionTypeDataForm();
                this.otherWoundcareDataCompleted = true;
              }
            }
          }

          if (DataResponse.sectionTypeCd[i].sectionTypeCd === "ISS") {
            if (this.injectionDataExists = true) {
              this.sectionType3.disable();
            }
            if (DataResponse !== undefined) {
              if (DataResponse !== null) {
                if (!DataResponse.hasOwnProperty('errorCode')) {
                  this.injectionData = DataResponse.sectionTypeCd[i];
                  this.sectionTypeDataForm();
                  this.injectionDataExists = true;
                }
                if (DataResponse.hasOwnProperty('errorCode')) {
                  this.sectionTypeDataForm();
                  this.injectionDataExists = false;
                }
                this.injectionDataCompleted = true;
              }
              if (DataResponse === null) {
                this.sectionTypeDataForm();
                this.injectionDataCompleted = true;
              }
            }
          }

          if (DataResponse.sectionTypeCd[i].sectionTypeCd === "IOT") {
            if (this.injectionOtherDataExists = true) {
              this.sectionType4.disable();
            }
            if (DataResponse !== undefined) {
              if (DataResponse !== null) {
                if (!DataResponse.hasOwnProperty('errorCode')) {
                  this.injectionOtherData = DataResponse.sectionTypeCd[i];
                  this.sectionTypeDataForm();
                  this.injectionOtherDataExists = true;
                }
                if (DataResponse.hasOwnProperty('errorCode')) {
                  this.sectionTypeDataForm();
                  this.injectionOtherDataExists = false;
                }
                this.injectionOtherDataCompleted = true;
              }
              if (DataResponse === null) {
                this.sectionTypeDataForm();
                this.injectionOtherDataCompleted = true;
              }
            }
          }

          if (DataResponse.sectionTypeCd[i].sectionTypeCd === "INT") {

            if (this.intFluidDataExists = true) {
              this.sectionType5.disable();
            }
            if (DataResponse !== undefined) {
              if (DataResponse !== null) {
                if (!DataResponse.hasOwnProperty('errorCode')) {
                  this.intFluidData = DataResponse.sectionTypeCd[i];
                  this.sectionTypeDataForm();
                  this.intFluidDataExists = true;
                }
                if (DataResponse.hasOwnProperty('errorCode')) {
                  this.sectionTypeDataForm();
                  this.intFluidDataExists = false;
                }
                this.intFluidDataCompleted = true;
              }
              if (DataResponse === null) {
                this.sectionTypeDataForm();
                this.intFluidDataCompleted = true;
              }
            }
          }

          if (DataResponse.sectionTypeCd[i].sectionTypeCd === "ISP") {
            if (this.isolationPreDataExists = true) {
              this.sectionType6.disable();
            }
            if (DataResponse !== undefined) {
              if (DataResponse !== null) {
                if (!DataResponse.hasOwnProperty('errorCode')) {
                  this.isolationPreData = DataResponse.sectionTypeCd[i];
                  this.sectionTypeDataForm();
                  this.isolationPreDataExists = true;
                }
                if (DataResponse.hasOwnProperty('errorCode')) {
                  this.sectionTypeDataForm();
                  this.isolationPreDataExists = false;
                }
                this.isolationPreDataCompleted = true;
              }
              if (DataResponse === null) {
                this.sectionTypeDataForm();
                this.isolationPreDataCompleted = true;
              }
            }
          }

          if (DataResponse.sectionTypeCd[i].sectionTypeCd === "OCT") {
            if (this.occTherapyDataExists = true) {
              this.sectionType7.disable();
            }
            if (DataResponse !== undefined) {
              if (DataResponse !== null) {
                if (!DataResponse.hasOwnProperty('errorCode')) {
                  this.occTherapyData = DataResponse.sectionTypeCd[i];
                  this.sectionTypeDataForm();
                  this.occTherapyDataExists = true;
                }
                if (DataResponse.hasOwnProperty('errorCode')) {
                  this.sectionTypeDataForm();
                  this.occTherapyDataExists = false;
                }
                this.occTherapyDataCompleted = true;
              }
              if (DataResponse === null) {
                this.sectionTypeDataForm();
                this.occTherapyDataCompleted = true;
              }
            }
          }

          if (DataResponse.sectionTypeCd[i].sectionTypeCd === "PHT") {
            if (this.phyTherapyDataExists = true) {
              this.sectionType8.disable();
            }
            if (DataResponse !== undefined) {
              if (DataResponse !== null) {
                if (!DataResponse.hasOwnProperty('errorCode')) {
                  this.phyTherapyData = DataResponse.sectionTypeCd[i];
                  this.sectionTypeDataForm();
                  this.phyTherapyDataExists = true;
                }
                if (DataResponse.hasOwnProperty('errorCode')) {
                  this.sectionTypeDataForm();
                  this.phyTherapyDataExists = false;
                }
                this.phyTherapyDataCompleted = true;
              }
              if (DataResponse === null) {
                this.sectionTypeDataForm();
                this.phyTherapyDataCompleted = true;
              }
            }
          }

          if (DataResponse.sectionTypeCd[i].sectionTypeCd === "TCO") {
            if (this.teaCathDataExists = true) {
              this.sectionType9.disable();
            }
            if (DataResponse !== undefined) {
              if (DataResponse !== null) {
                if (!DataResponse.hasOwnProperty('errorCode')) {
                  this.teaCathData = DataResponse.sectionTypeCd[i];
                  this.sectionTypeDataForm();
                  this.teaCathDataExists = true;
                }
                if (DataResponse.hasOwnProperty('errorCode')) {
                  this.sectionTypeDataForm();
                  this.teaCathDataExists = false;
                }
                this.teaCathDataCompleted = true;
              }
              if (DataResponse === null) {
                this.sectionTypeDataForm();
                this.teaCathDataCompleted = true;
              }
            }
          }

          if (DataResponse.sectionTypeCd[i].sectionTypeCd === "TSI") {
            if (this.teaSelfDataExists = true) {
              this.sectionType10.disable();
            }
            if (DataResponse !== undefined) {
              if (DataResponse !== null) {
                if (!DataResponse.hasOwnProperty('errorCode')) {
                  this.teaSelfData = DataResponse;
                  this.sectionTypeDataForm();
                  this.teaSelfDataExists = true;
                }
                if (DataResponse.hasOwnProperty('errorCode')) {
                  this.sectionTypeDataForm();
                  this.teaSelfDataExists = false;
                }
                this.teaSelfDataCompleted = true;
              }
              if (DataResponse === null) {
                this.sectionTypeDataForm();
                this.teaSelfDataCompleted = true;
              }
            }
          }

          if (DataResponse.sectionTypeCd[i].sectionTypeCd === "TPN") {
            if (this.parNutritionDataExists = true) {
              this.sectionType11.disable();
            }
            if (DataResponse !== undefined) {
              if (DataResponse !== null) {
                if (!DataResponse.hasOwnProperty('errorCode')) {
                  this.parNutritionData = DataResponse;
                  this.sectionTypeDataForm();
                  this.parNutritionDataExists = true;
                }
                if (DataResponse.hasOwnProperty('errorCode')) {
                  this.sectionTypeDataForm();
                  this.parNutritionDataExists = false;
                }
                this.parNutritionDataCompleted = true;
              }
              if (DataResponse === null) {
                this.sectionTypeDataForm();
                this.parNutritionDataCompleted = true;
              }
            }
          }

          if (DataResponse.sectionTypeCd[i].sectionTypeCd === "TFE") {

            if (this.tubeFeedingDataExists = true) {
              this.sectionType12.disable();
            }
            if (DataResponse !== undefined) {
              if (DataResponse !== null) {
                if (!DataResponse.hasOwnProperty('errorCode')) {
                  this.tubeFeedingData = DataResponse;
                  this.sectionTypeDataForm();
                  this.tubeFeedingDataExists = true;
                }
                if (DataResponse.hasOwnProperty('errorCode')) {
                  this.sectionTypeDataForm();
                  this.tubeFeedingDataExists = false;
                }
                this.tubeFeedingDataCompleted = true;
              }
              if (DataResponse === null) {
                this.sectionTypeDataForm();
                this.tubeFeedingDataCompleted = true;
              }
            }
          }

          if (DataResponse.sectionTypeCd[i].sectionTypeCd === "PED") {
            if (this.perDialysisDataExists = true) {
              this.sectionType13.disable();
            }
            if (DataResponse !== undefined) {
              if (DataResponse !== null) {
                if (!DataResponse.hasOwnProperty('errorCode')) {
                  this.perDialysisData = DataResponse;
                  this.sectionTypeDataForm();
                  this.perDialysisDataExists = true;
                }
                if (DataResponse.hasOwnProperty('errorCode')) {
                  this.sectionTypeDataForm();
                  this.perDialysisDataExists = false;
                }
                this.perDialysisDataCompleted = true;
              }
              if (DataResponse === null) {
                this.sectionTypeDataForm();
                this.perDialysisDataCompleted = true;
              }
            }
          }

          if (DataResponse.sectionTypeCd[i].sectionTypeCd === "PCA") {
            if (this.pcaPumpDataExists = true) {
              this.sectionType14.disable();
            }
            if (DataResponse !== undefined) {
              if (DataResponse !== null) {
                if (!DataResponse.hasOwnProperty('errorCode')) {
                  this.pcaPumpData = DataResponse;
                  this.sectionTypeDataForm();
                  this.pcaPumpDataExists = true;
                }
                if (DataResponse.hasOwnProperty('errorCode')) {
                  this.sectionTypeDataForm();
                  this.pcaPumpDataExists = false;
                }
                this.pcaPumpDataCompleted = true;
              }
              if (DataResponse === null) {
                this.sectionTypeDataForm();
                this.pcaPumpDataCompleted = true;
              }
            }
          }

          if (DataResponse.sectionTypeCd[i].sectionTypeCd === "TRS") {
            if (this.tracheostomyDataExists = true) {
              this.sectionType15.disable();
            }
            if (DataResponse !== undefined) {
              if (DataResponse !== null) {
                if (!DataResponse.hasOwnProperty('errorCode')) {
                  this.tracheostomyData = DataResponse;
                  this.sectionTypeDataForm();
                  this.tracheostomyDataExists = true;
                }
                if (DataResponse.hasOwnProperty('errorCode')) {
                  this.sectionTypeDataForm();
                  this.tracheostomyDataExists = false;
                }
                this.tracheostomyDataCompleted = true;
              }
              if (DataResponse === null) {
                this.sectionTypeDataForm();
                this.tracheostomyDataCompleted = true;
              }
            }
          }

          if (DataResponse.sectionTypeCd[i].sectionTypeCd === "VNT") {
            if (this.ventilatorDataExists = true) {
              this.sectionType16.disable();
            }
            if (DataResponse !== undefined) {
              if (DataResponse !== null) {
                if (!DataResponse.hasOwnProperty('errorCode')) {
                  this.ventilatorData = DataResponse;
                  this.sectionTypeDataForm();
                  this.ventilatorDataExists = true;
                }
                if (DataResponse.hasOwnProperty('errorCode')) {
                  this.sectionTypeDataForm();
                  this.ventilatorDataExists = false;
                }
                this.ventilatorDataCompleted = true;
              }
              if (DataResponse === null) {
                this.sectionTypeDataForm();
                this.ventilatorDataCompleted = true;
              }
            }
          }

        }
      }, err => {
        this.sectionTypeDataForm();
      });

    this.subscriptions.push(this.subscription1$);

  }

  openpopup() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = { route: 'ltss/pae' };
    dialogConfig.panelClass = 'exp_popup';
    dialogConfig.width = '36vw';
    dialogConfig.height = '20vw';

    this.dialog.open(SavePopupComponent, dialogConfig);
  }

  saveAndExit() {
    this.isSamePageNavigation = true;
    this.submitted = true;
    if (this.submitted) {
      if (this.mep.toggle && this.sectionType1.controls.rqstdStartDt.value !== null
        && this.sectionType1.controls.rqstdEndDt.value !== null && !this.woundcareDataExists) {
        this.openedAccordion('WCS');
        this.openpopup();
      }
      if (this.mea.toggle && this.sectionType2.controls.rqstdStartDt.value !== null
        && this.sectionType2.controls.rqstdEndDt.value !== null && !this.otherWoundcareDataExists) {
        this.openedAccordion('OWC');
        this.openpopup();
      }
      if (this.mes.toggle && this.sectionType3.controls.rqstdStartDt.value !== null
        && this.sectionType3.controls.rqstdEndDt.value !== null && !this.injectionDataExists) {
        this.openedAccordion('ISS');
        this.openpopup();
      }
      if (this.meb.toggle && this.sectionType4.controls.rqstdStartDt.value !== null
        && this.sectionType4.controls.rqstdEndDt.value !== null && !this.injectionOtherDataExists) {
        this.openedAccordion('IOT');
        this.openpopup();
      }
      if (this.mec.toggle && this.sectionType5.controls.rqstdStartDt.value !== null
        && this.sectionType5.controls.rqstdEndDt.value !== null && !this.intFluidDataExists) {
        this.openedAccordion('INT');
        this.openpopup();
      }
      if (this.med.toggle && this.sectionType6.controls.rqstdStartDt.value !== null
        && this.sectionType6.controls.rqstdEndDt.value !== null && !this.isolationPreDataExists) {
        this.openedAccordion('ISP');
        this.openpopup();
      }
      if (this.mee.toggle && this.sectionType7.controls.rqstdStartDt.value !== null
        && this.sectionType7.controls.rqstdEndDt.value !== null && !this.occTherapyDataExists) {
        this.openedAccordion('OCT');
        this.openpopup();
      }
      if (this.mef.toggle && this.sectionType8.controls.rqstdStartDt.value !== null
        && this.sectionType8.controls.rqstdEndDt.value !== null && !this.phyTherapyDataExists) {
        this.openedAccordion('PHT');
        this.openpopup();
      }
      if (this.meg.toggle && this.sectionType9.controls.rqstdStartDt.value !== null
        && this.sectionType9.controls.rqstdEndDt.value !== null && !this.teaCathDataExists) {
        this.openedAccordion('TCO');
        this.openpopup();
      }
      if (this.meh.toggle && this.sectionType10.controls.rqstdStartDt.value !== null
        && this.sectionType10.controls.rqstdEndDt.value !== null && !this.teaSelfDataExists) {
        this.openedAccordion('TSI');
        this.openpopup();
      }
      if (this.mei.toggle && this.sectionType11.controls.rqstdStartDt.value !== null
        && this.sectionType11.controls.rqstdEndDt.value !== null && !this.parNutritionDataExists) {
        this.openedAccordion('TPN');
        this.openpopup();
      }

      if (this.mej.toggle && this.sectionType12.controls.rqstdStartDt.value !== null
        && this.sectionType12.controls.rqstdEndDt.value !== null && !this.tubeFeedingDataExists) {
        this.openedAccordion('TFE');
        this.openpopup();
      }
      if (this.mek.toggle && this.sectionType13.controls.rqstdStartDt.value !== null
        && this.sectionType13.controls.rqstdEndDt.value !== null && !this.perDialysisDataExists) {
        this.openedAccordion('PED');
        this.openpopup();
      }
      if (this.mel.toggle && this.sectionType14.controls.rqstdStartDt.value !== null
        && this.sectionType14.controls.rqstdEndDt.value !== null && !this.pcaPumpDataExists) {
        this.openedAccordion('PCA');
        this.openpopup();
      }

      if (this.mem.toggle && this.sectionType15.controls.rqstdStartDt.value !== null
        && this.sectionType15.controls.rqstdEndDt.value !== null && !this.tracheostomyDataExists) {
        this.openedAccordion('TRS');
        this.openpopup();
      }
      if (this.men.toggle && this.sectionType16.controls.rqstdStartDt.value !== null
        && this.sectionType16.controls.rqstdEndDt.value !== null && !this.ventilatorDataExists) {
        this.openedAccordion('VNT');
        this.openpopup();
      }

      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = { route: 'ltss/pae' };
      dialogConfig.panelClass = 'exp_popup';
      dialogConfig.width = '36vw';
      dialogConfig.height = '20vw';

      this.dialog.open(SavePopupComponent, dialogConfig);
    }
  }
  editAccordion(accordion) {
    if (accordion == 'WCS') {
      this.sectionType1.controls.rqstdStartDt.enable();
      this.sectionType1.controls.rqstdEndDt.enable();
      this.woundcareDataExists = false;
    }
    if (accordion == 'OWC') {
      this.sectionType2.controls.rqstdStartDt.enable();
      this.sectionType2.controls.rqstdEndDt.enable();
      this.otherWoundcareDataExists = false;
    }
    if (accordion === 'ISS') {
      this.sectionType3.controls.rqstdStartDt.enable();
      this.sectionType3.controls.rqstdEndDt.enable();
      this.injectionDataExists = false;
    }
    if (accordion === 'IOT') {
      this.sectionType4.controls.rqstdStartDt.enable();
      this.sectionType4.controls.rqstdEndDt.enable();
      this.injectionOtherDataExists = false;
    }
    if (accordion === 'INT') {
      this.sectionType5.controls.rqstdStartDt.enable();
      this.sectionType5.controls.rqstdEndDt.enable();
      this.intravenousFluidDataExists = false;
    }
    if (accordion === 'ISP') {
      this.sectionType6.controls.rqstdStartDt.enable();
      this.sectionType6.controls.rqstdEndDt.enable();
      this.isolationPreDataExists = false;
    }
    if (accordion === 'OCT') {
      this.sectionType7.controls.rqstdStartDt.enable();
      this.sectionType7.controls.rqstdEndDt.enable();
      this.occTherapyDataExists = false;
    }
    if (accordion === 'PHT') {
      this.sectionType8.controls.rqstdStartDt.enable();
      this.sectionType8.controls.rqstdEndDt.enable();
      this.phyTherapyDataExists = false;
    }
    if (accordion === 'TCO') {
      this.sectionType9.controls.rqstdStartDt.enable();
      this.sectionType9.controls.rqstdEndDt.enable();
      this.teaCathDataExists = false;
    }
    if (accordion === 'TSI') {
      this.sectionType10.controls.rqstdStartDt.enable();
      this.sectionType10.controls.rqstdEndDt.enable();
      this.teaSelfDataExists = false;
    }
    if (accordion === 'TPN') {
      this.sectionType11.controls.rqstdStartDt.enable();
      this.sectionType11.controls.rqstdEndDt.enable();
      this.parNutritionDataExists = false;
    }
    if (accordion === 'TFE') {
      this.sectionType12.controls.rqstdStartDt.enable();
      this.sectionType12.controls.rqstdEndDt.enable();
      this.tubeFeedingDataExists = false;
    }
    if (accordion === 'PED') {
      this.sectionType13.controls.rqstdStartDt.enable();
      this.sectionType13.controls.rqstdEndDt.enable();
      this.perDialysisDataExists = false;

    }
    if (accordion === 'PCA') {
      this.sectionType14.controls.rqstdStartDt.enable();
      this.sectionType14.controls.rqstdEndDt.enable();
      this.pcaPumpDataExists = false;
    }
    if (accordion === 'TRS') {
      this.sectionType15.controls.rqstdStartDt.enable();
      this.sectionType15.controls.rqstdEndDt.enable();
      this.tracheostomyDataExists = false;
    }
    if (accordion === 'VNT') {
      this.sectionType16.controls.rqstdStartDt.enable();
      this.sectionType16.controls.rqstdEndDt.enable();
      this.ventilatorDataExists = false;
    }
  }


  toggelPanel() {

    this.panelOpenState = !this.panelOpenState
  }

  deleteAccordion(accordionName) {
    this.subscription2$ = this.PaeSkilledDetailsService
      .deleteSkilledDetails(this.paeId, accordionName)
      .subscribe((Response) => {
        console.log(Response);

        if (accordionName === 'WCS') {
          this.sectionType1.controls.rqstdStartDt.setValue(null);
          this.sectionType1.controls.rqstdEndDt.setValue(null);
          this.woundcareDataExists = false;
          this.sectionType1.enable();
        }
        if (accordionName === 'OWC') {
          this.sectionType2.controls.rqstdStartDt.setValue(null);
          this.sectionType2.controls.rqstdEndDt.setValue(null);
          this.otherWoundcareDataExists = false;
          this.sectionType2.enable();
        }
        if (accordionName === 'ISS') {
          this.sectionType3.controls.rqstdStartDt.setValue(null);
          this.sectionType3.controls.rqstdEndDt.setValue(null);
          this.injectionDataExists = false;
          this.sectionType3.enable();
        }
        if (accordionName === 'IOT') {
          this.sectionType4.controls.rqstdStartDt.setValue(null);
          this.sectionType4.controls.rqstdEndDt.setValue(null);
          this.injectionOtherDataExists = false;
          this.sectionType4.enable();
        }
        if (accordionName === 'INT') {
          this.sectionType5.controls.rqstdStartDt.setValue(null);
          this.sectionType5.controls.rqstdEndDt.setValue(null);
          this.intravenousFluidDataExists = false;
          this.sectionType5.enable();
        }
        if (accordionName === 'ISP') {
          this.sectionType6.controls.rqstdStartDt.setValue(null);
          this.sectionType6.controls.rqstdEndDt.setValue(null);
          this.isolationPreDataExists = false;
          this.sectionType6.enable();
        }
        if (accordionName === 'OCT') {
          this.sectionType7.controls.rqstdStartDt.setValue(null);
          this.sectionType7.controls.rqstdEndDt.setValue(null);
          this.occTherapyDataExists = false;
          this.sectionType7.enable();
        }
        if (accordionName === 'PHT') {
          this.sectionType8.controls.rqstdStartDt.setValue(null);
          this.sectionType8.controls.rqstdEndDt.setValue(null);
          this.phyTherapyDataExists = false;
          this.sectionType8.enable();
        }
        if (accordionName === 'TCO') {
          this.sectionType9.controls.rqstdStartDt.setValue(null);
          this.sectionType9.controls.rqstdEndDt.setValue(null);
          this.teaCathDataExists = false;
          this.sectionType9.enable();
        }
        if (accordionName === 'TSI') {
          this.sectionType10.controls.rqstdStartDt.setValue(null);
          this.sectionType10.controls.rqstdEndDt.setValue(null);
          this.teaSelfDataExists = false;
          this.sectionType10.enable();
        }
        if (accordionName === 'TPN') {
          this.sectionType11.controls.rqstdStartDt.setValue(null);
          this.sectionType11.controls.rqstdEndDt.setValue(null);
          this.parNutritionDataExists = false;
          this.sectionType11.enable();
        }
        if (accordionName === 'TFE') {
          this.sectionType12.controls.rqstdStartDt.setValue(null);
          this.sectionType12.controls.rqstdEndDt.setValue(null);
          this.tubeFeedingDataExists = false;
          this.sectionType12.enable();
        }
        if (accordionName === 'PED') {
          this.sectionType13.controls.rqstdStartDt.setValue(null);
          this.sectionType13.controls.rqstdEndDt.setValue(null);
          this.perDialysisDataExists = false;
          this.sectionType13.enable();
        }
        if (accordionName === 'PCA') {
          this.sectionType14.controls.rqstdStartDt.setValue(null);
          this.sectionType14.controls.rqstdEndDt.setValue(null);
          this.pcaPumpDataExists = false;
          this.sectionType14.enable();
        }
        if (accordionName === 'TRS') {
          this.sectionType15.controls.rqstdStartDt.setValue(null);
          this.sectionType15.controls.rqstdEndDt.setValue(null);
          this.tracheostomyDataExists = false;
          this.sectionType15.enable();
        }
        if (accordionName === 'VNT') {
          this.sectionType16.controls.rqstdStartDt.setValue(null);
          this.sectionType16.controls.rqstdEndDt.setValue(null);
          this.ventilatorDataExists = false;
          this.sectionType16.enable();
        }
      });
    this.subscriptions.push(this.subscription2$);
  }

  isFormDirty(): boolean{
    const formsDirtyResults = this.forms.map(res => {
      return res.dirty
      })
     return formsDirtyResults.includes(true);
  }

  resetForms() {
     this.forms.forEach(res => {
      return res.reset();
      })
  }
  goBack() {
    this.router.navigate(['ltss/pae/paeStart/skilledServicesSummary']);
  }

  nextClicked() {
    this.subscription3$ = this.PaeSkilledDetailsService.getNextpageDetails(this.paeId, 'PPSSD')
      .subscribe((response) => {
        const nextPath = PaeFlowSeq[response.nextPageId];
        this.router.navigate(['/ltss/pae/paeStart/' + nextPath]);

      }, err => {
        console.log(err);
      });
    this.subscriptions.push(this.subscription3$);
  }

  cancelAccordion() {
    this.getAccordionData();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    console.log('Skilled Services Unsubscribed');
  }
}


