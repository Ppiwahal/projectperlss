import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RefHcbsPopup } from 'src/app/_shared/model/RefHcbsPopup';
import { RefHcbsFormService } from 'src/app/core/services/referral/referral-intake/hcbs-form-popup.service';
import * as customValidation from 'src/app/_shared/constants/validation.constants';
import { IntakeOutcomeService } from '../../services/referral/intake-outcome/intake-outcome.service';
const hcbcBenefitsPart1 = [
  { code: 'VNT', value: 'Adult Care Home - Level 2 Day for Vent Dependent', activateSW: 'Y' },
  { code: 'TRA', value: 'Adult Care Home - Level 2 Day for Traumatic Brain Injury', activateSW: 'Y' },
  { code: 'ADC', value: 'Adult Day Care', activateSW: 'Y' },
  {
    code: 'ACD',
    value: 'Assisted Care Living Facility - Day',
    activateSW: 'Y'
  },
  {
    code: 'ACM',
    value: 'Assisted Care Living Facility - Month',
    activateSW: 'Y'
  },
  {
    code: 'ATH',
    value: 'Assistive Technology',
    activateSW: 'Y'
  },
  {
    code: 'ATC',
    value: 'Attendant Care',
    activateSW: 'Y'
  },
  {
    code: 'CLS',
    value: 'Community Living Supports',
    activateSW: 'Y'
  },
  {
    code: 'CFM',
    value: 'Community Living Supports - Family Model',
    activateSW: 'Y'
  },
  {
    code: 'CCB',
    value: 'Companion Care - Backup',
    activateSW: 'Y'
  },
];

const hcbsBenefitsPart2 = [
  {
    code: 'CCD',
    value: 'Companion Care - Daily Fee - 5 Days Per Week / 24 hours per day',
    activateSW: 'Y'
  },
  {
    code: 'CCF',
    value: 'Companion Care - Daily Fee - 7 Days Per Week / 24 hours per day',
    activateSW: 'Y'
  },
  {
    code: 'HDM',
    value: 'Home-Delivered Meals',
    activateSW: 'Y'
  },
  {
    code: 'HRC',
    value: 'In-home Respite Care',
    activateSW: 'Y'
  },
  {
    code: 'PRC',
    value: 'In-Patient Respite Care',
    activateSW: 'Y'
  },
  {
    code: 'MHM',
    value: 'Minor Home Modifications',
    activateSW: 'Y'
  },
  {
    code: 'PCV',
    value: 'Personal Care Visits',
    activateSW: 'Y'
  },
  {
    code: 'PER',
    value: 'Personal Emergency Response System - Installation',
    activateSW: 'Y'
  },
  {
    code: 'PEM',
    value: 'Personal Emergency Response System - Monthly Fee',
    activateSW: 'Y'
  },
  {
    code: 'PCO',
    value: 'Pest Control',
    activateSW: 'Y'
  }
];

const proposedECFBenefitsPart1 = [
  { code: 'EXP', value: 'Exploration', activateSW: 'Y' },
  { code: 'BCO', value: 'Benefits counseling', activateSW: 'Y' },
  { code: 'DIS', value: 'Discovery', activateSW: 'Y' },
  { code: 'SOA', value: 'Situational observation and assessment', activateSW: 'Y' },
  { code: 'JDP', value: 'Job development plan or self-employment plan', activateSW: 'Y' },
  { code: 'JDS', value: 'Job development plan or self-employment start up', activateSW: 'Y' }
];

const proposedECFBenefitsPart2 = [
  { code: 'JCI', value: 'Job coaching for individualized, integrated employment', activateSW: 'Y' },
  { code: 'CWS', value: 'Co-worker supports', activateSW: 'Y' },
  { code: 'CAD', value: 'Career advancement', activateSW: 'Y' },
  { code: 'SSG', value: 'Supported employment - small group', activateSW: 'Y' },
  { code: 'IEP', value: 'Integrated employment path services', activateSW: 'Y' }
];

const communityBenefitsPart1 = [
  { code: 'CIS', value: 'Community integration support services', activateSW: 'Y' },
  { code: 'CTR', value: 'Community transportation', activateSW: 'Y' },
  { code: 'ILS', value: 'Independent living skills training', activateSW: 'Y' },
  { code: 'ATA', value: 'Assistive technology, adaptive equipment and supplies', activateSW: 'Y' },
  { code: 'MHMS', value: 'Minor home modifications', activateSW: 'Y' },
  { code: 'CSD', value: 'Community support development, organization and navigation', activateSW: 'Y' },
  { code: 'FCE', value: 'Family caregiver education and training', activateSW: 'Y' },
  { code: 'FTF', value: 'Family-to-family support', activateSW: 'Y' },
  { code: 'DMS', value: 'Decision making supports and options', activateSW: 'Y' },
  { code: 'HIC', value: 'Health insurance counseling / forms assistance', activateSW: 'Y' },
  { code: 'IBC', value: 'Intensive Behavioral Community Transition and Stabilization', activateSW: 'Y' },
  { code: 'IET', value: 'Individual education and training', activateSW: 'Y' }
];

const communityBenefitsPart2 = [
  { code: 'PTP', value: 'Peer-to-peer person-centered planning, self-direction', activateSW: 'Y' },
  { code: 'SCT', value: 'Specialized consultation and training', activateSW: 'Y' },
  { code: 'ADU', value: 'Adult dental services', activateSW: 'Y' },
  { code: 'PERS', value: 'Personal Assistance', activateSW: 'Y' },
  { code: 'CLSS', value: 'Community Living Supports and Community Living Supports', activateSW: 'Y' },
  { code: 'RES', value: 'Respite', activateSW: 'Y' },
  { code: 'SHC', value: 'Supportive Home Care', activateSW: 'Y' },
  { code: 'FAM', value: 'Family Caregiver Stipend in lieu of Supportive Home Care', activateSW: 'Y' },
  { code: 'HOM', value: 'Home Health Aid', activateSW: 'Y' },
  { code: 'STA', value: 'Stabilization and Monitoring', activateSW: 'Y' },
  { code: 'IBS', value: 'Intensive Behavioral Supportive Home Care', activateSW: 'Y' },
  { code: 'IBF', value: 'Intensive Behavioral Family-Centered Treatment, Stabilization(IBFCTSS)', activateSW: 'Y' }
];
@Component({
  selector: 'app-hcbs-benefits',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './hcbs-benefits.component.html',
  styleUrls: ['./hcbs-benefits.component.scss']
})
export class HcbsBenefitsComponent implements OnInit {
  benefitsListPart1 = [];
  benefitsListPart2 = [];
  ECFBenefitsPart1 = [];
  ECFBenefitsPart2 = [];
  communityServiceBenefitsPart1 = [];
  communityServiceBenefitsPart2 = [];
  benefitsList: any;
  length = 20;
  pageSize = 10;
  pageEvent: PageEvent;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  benefitsTitle = 'HCBS BENEFITS';
  hcbsBenefits: FormGroup;
  customValidation = customValidation;
  submitted = false;
  constructor(public refHcbsFormService: RefHcbsFormService, private intakeOutcomeService: IntakeOutcomeService, public dialogRef: MatDialogRef<HcbsBenefitsComponent>, private fb: FormBuilder) { }
  getFormData() {
    return this.hcbsBenefits.controls;
  }
  ngOnInit(): void {
    this.benefitsListPart1 = hcbcBenefitsPart1;
    this.benefitsListPart2 = hcbsBenefitsPart2;
    this.ECFBenefitsPart1 = proposedECFBenefitsPart1;
    this.ECFBenefitsPart2 = proposedECFBenefitsPart2;
    this.communityServiceBenefitsPart1 = communityBenefitsPart1;
    this.communityServiceBenefitsPart2 = communityBenefitsPart2;
    this.hcbsBenefits = this.fb.group({
      VNT: [''],
      TRA: [''],
      ADC: [''],
      ACD: [''],
      ACM: [''],
      ATH: [''],
      ATC: [''],
      CLS: [''],
      CFM: [''],
      CCB: [''],
      CCD: [''],
      CCF: [''],
      HDM: [''],
      HRC: [''],
      PRC: [''],
      MHM: [''],
      PCV: [''],
      PER: [''],
      PEM: [''],
      PCO: [''],
      EXP: [''],
      BCO: [''],
      DIS: [''],
      SOA: [''],
      JDP: [''],
      JDS: [''],
      JCI: [''],
      CWS: [''],
      CAD: [''],
      SSG: [''],
      IEP: [''],
      CIS: [''],
      CTR: [''],
      ILS: [''],
      ATA: [''],
      MHMS: [''],
      CSD: [''],
      FCE: [''],
      FTF: [''],
      DMS: [''],
      HIC: [''],
      IBC: [''],
      IET: [''],
      PTP: [''],
      SCT: [''],
      ADU: [''],
      PERS: [''],
      CLSS: [''],
      RES: [''],
      SHC: [''],
      FAM: [''],
      HOM: [''],
      STA: [''],
      IBS: [''],
      IBF: [''],
      qualEnrolPriCatTxt: ['', [Validators.required]]
    })
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }
  }

  onPageChange(event) {
    console.log('event====', event.pageIndex);
    if (event.pageIndex === 1) {
      this.benefitsTitle = 'REQUESTED ECF CHOICES BENEFITS';
    } else {
      this.benefitsTitle = 'HCBS BENEFITS';
    }
  }

  closePopup() {
    this.dialogRef.close();
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

  saveBenefits() {
    this.submitted = true
    let data = this.hcbsBenefits.value;
    if (this.hcbsBenefits.valid) {
      const refHcbsPopup = new RefHcbsPopup(
        '41756',
        data.intakeOutcomeId = this.intakeOutcomeService.getIntakeOutcomeId(),
        this.getFormData().qualEnrolPriCatTxt.value,
        this.sendingYesorNo(this.getFormData().VNT.value),
        this.sendingYesorNo(this.getFormData().TRA.value),
        this.sendingYesorNo(this.getFormData().ADC.value),
        this.sendingYesorNo(this.getFormData().ACD.value),
        this.sendingYesorNo(this.getFormData().ACM.value),
        this.sendingYesorNo(this.getFormData().ATH.value),
        this.sendingYesorNo(this.getFormData().ATC.value),
        this.sendingYesorNo(this.getFormData().CLS.value),
        this.sendingYesorNo(this.getFormData().CFM.value),
        this.sendingYesorNo(this.getFormData().CCB.value),
        this.sendingYesorNo(this.getFormData().CCD.value),
        this.sendingYesorNo(this.getFormData().CCF.value),
        this.sendingYesorNo(this.getFormData().HDM.value),
        this.sendingYesorNo(this.getFormData().HRC.value),
        this.sendingYesorNo(this.getFormData().PRC.value),
        this.sendingYesorNo(this.getFormData().MHM.value),
        this.sendingYesorNo(this.getFormData().PCV.value),
        this.sendingYesorNo(this.getFormData().PER.value),
        this.sendingYesorNo(this.getFormData().PEM.value),
        this.sendingYesorNo(this.getFormData().PCO.value),
        this.sendingYesorNo(this.getFormData().EXP.value),
        this.sendingYesorNo(this.getFormData().BCO.value),
        this.sendingYesorNo(this.getFormData().DIS.value),
        this.sendingYesorNo(this.getFormData().SOA.value),
        this.sendingYesorNo(this.getFormData().JDP.value),
        this.sendingYesorNo(this.getFormData().JDS.value),
        this.sendingYesorNo(this.getFormData().JCI.value),
        this.sendingYesorNo(this.getFormData().CWS.value),
        this.sendingYesorNo(this.getFormData().CAD.value),
        this.sendingYesorNo(this.getFormData().SSG.value),
        this.sendingYesorNo(this.getFormData().IEP.value),
        this.sendingYesorNo(this.getFormData().CIS.value),
        this.sendingYesorNo(this.getFormData().CTR.value),
        this.sendingYesorNo(this.getFormData().ILS.value),
        this.sendingYesorNo(this.getFormData().ATA.value),
        this.sendingYesorNo(this.getFormData().MHMS.value),
        this.sendingYesorNo(this.getFormData().CSD.value),
        this.sendingYesorNo(this.getFormData().FCE.value),
        this.sendingYesorNo(this.getFormData().FTF.value),
        this.sendingYesorNo(this.getFormData().DMS.value),
        this.sendingYesorNo(this.getFormData().HIC.value),
        this.sendingYesorNo(this.getFormData().IBC.value),
        this.sendingYesorNo(this.getFormData().IET.value),
        this.sendingYesorNo(this.getFormData().PTP.value),
        this.sendingYesorNo(this.getFormData().SCT.value),
        this.sendingYesorNo(this.getFormData().ADU.value),
        this.sendingYesorNo(this.getFormData().PERS.value),
        this.sendingYesorNo(this.getFormData().CLSS.value),
        this.sendingYesorNo(this.getFormData().RES.value),
        this.sendingYesorNo(this.getFormData().SHC.value),
        this.sendingYesorNo(this.getFormData().FAM.value),
        this.sendingYesorNo(this.getFormData().HOM.value),
        this.sendingYesorNo(this.getFormData().STA.value),
        this.sendingYesorNo(this.getFormData().IBS.value),
        this.sendingYesorNo(this.getFormData().IBF.value),
      );
      this.refHcbsFormService.saveHCBSPopupForm(refHcbsPopup).then((res) => {
        if (res.status === 200) {
          console.log(res)
        }
      });
    }

  }
}
