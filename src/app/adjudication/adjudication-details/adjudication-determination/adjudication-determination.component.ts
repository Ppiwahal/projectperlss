import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { endWith } from 'rxjs/operators';
import { AdjudicationDetailsService } from 'src/app/core/services/adjudication/adjudication-details.service';
import { PaeCommonService } from 'src/app/core/services/pae/pae-common/pae-common.service';
import * as customValidation from 'src/app/_shared/constants/validation.constants';
import { AdjudicationClarificationPopupComponent } from '../../adjudication-clarification-popup/adjudication-clarification-popup.component';
import { AdjudicationDenialPopupComponent } from '../../adjudication-denial-popup/adjudication-denial-popup.component';

@Component({
  selector: 'app-adjudication-determination',
  templateUrl: './adjudication-determination.component.html',
  styleUrls: ['./adjudication-determination.component.scss']
})
export class AdjudicationDeterminationComponent implements OnInit {
  @Output() savedDetermn = new EventEmitter<boolean>();
  @Output() savedDetermnOverride = new EventEmitter<boolean>();

  customValidation = customValidation;
  adjDescision: any;
  adjDescisionSummary: any;
  enrollmentGroupCodes: any;
  adjDscncodes: any;
  adjDscnForm: FormGroup;
  adjId: any;
  subscriptions$: any = [];
  submitted = false;
  minDate: Date;
  maxDate: Date;
  paeEndminDate: Date;
  adjSummaryForm: FormGroup;
  isTrgtPopNotMeetSw = false;
  isTrgtPopPhyDiagnosisSw = false;
  isTrgtPopQualFunSw = false;
  recertStatus: any;
  task_id: any;
  task_queue: any;
  taskStatus: any;
  row_element: any;
  loN: any;
  levelOfNeed: any;
  enrollGrpCd: any;
  paeEndDt: any;
  targetPopulatinoChoices: any;
  adjOptions: any;
  adjDscncodesKB: any;
  displaySpinner = false;
  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'indeterminate';
  value = 50;
  erlGrpCd: any;
  skilledServiceDateList: any;
  sltEnrGrpCd: any;
  sltChangeSw = false;
  isECF = false;
  targetPopulatinodiaDiagonosis: any;
  isDenied = false;
  denialReasons: any;
  grandFatheredSw: any;
  fromChangeManagement = false;
  safetyAccordionCompleted: any;
  safetyAccordionPresent: any;
  paeEndMaxDate: Date;
  fromChngMgmt = false;
  adjStatusCd: string;

  constructor(private adjudicationDetailsService: AdjudicationDetailsService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private paeCommonService: PaeCommonService,
    private router: Router) { }

  ngOnInit(): void {
    this.erlGrpCd = this.paeCommonService.getProgramCd();
    this.grandFatheredSw = this.adjudicationDetailsService.grandFatheredSw$$.value;
    this.sltEnrGrpCd = this.adjudicationDetailsService.sltEnrGrpCd$$.value;
    this.adjId = this.paeCommonService.getAdjId();
    this.task_queue = this.paeCommonService.getTaskQueue();
    this.task_id = this.paeCommonService.getTaskId();
    this.fromChngMgmt = this.paeCommonService.getFromChngMgmt();
    this.adjStatusCd = this.paeCommonService.getAdjudicationStatusCd();
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 120, 0, 1);
    this.maxDate = this.adjSummaryForm?.get('lvl2EndDt')?.value ? this.adjSummaryForm?.get('lvl2EndDt')?.value : new Date();
    this.paeEndminDate = new Date()
    this.paeEndMaxDate =  new Date();
    this.adjudicationDetailsService.getSafetyExists().subscribe(value => this.safetyAccordionPresent = value ? value : false);
    this.adjudicationDetailsService.getSafetyCompleted().subscribe(value => this.safetyAccordionCompleted = value ? value : false);
    this.buildAdjDscnForm();
    this.buidAdjSummaryForm();
    this.getAdjDescision(this.adjId);
    this.getAdjSummaryDetails(this.adjId);
    this.getEnrollmentGroup();
    this.getAdjDscnCodes();
    this.getKBAdjDscnCodes();
    this.getRecertStatus();
    this.getTargetPopulatinoChoices();
    this.getTargetPopulatinoDiagonosis();
    this.getLevelOfNeed();
    this.getDenialReasons();
  }



  openPopUp(popupExample: number) { //popupExample is just for demo
    // const paeRequestDate: Date = new Date(); // just for demo 
    // const submissionDate: Date = new Date();  // dummy value. need t o check the control name
    // const paeEffectiveDate: Date = this.adjDscnForm.controls.paeEffDt.value;

    // const addressType = "SA"; // just for demo  // this.adjDscnForm.controls.paeAdressType.value
    // const submitterNotiicaton = "SN"; // just for demo
    // const enrollmenDenialReason = "test" //just for demo
    // const is10dayDeniedCondition = this.adjDscnForm.controls.enrollGrpCd.value === 'CG1' &&
    //   (
    //     this.adjDscnForm.controls.locDcsnCd.value === 'NFS' ||
    //     this.adjDscnForm.controls.locDcsnCd.value === 'NSE' ||
    //     this.adjDscnForm.controls.locDcsnCd.value === 'NWE' ||
    //     this.adjDscnForm.controls.locDcsnCd.value === 'NEP' ||
    //     this.adjDscnForm.controls.locDcsnCd.value === 'NED'
    //   ) &&
    //   (
    //     (paeRequestDate && paeEffectiveDate && (new Date(paeRequestDate.setDate(paeRequestDate.getDate() + 10)) > paeEffectiveDate))
    //     ||
    //     (paeRequestDate && submissionDate && (new Date(paeRequestDate.setDate(paeRequestDate.getDate() + 10)) > submissionDate))
    //   ) &&
    //   (addressType === "SA")
    // // && (submitterNotiicaton === )

    // const isDeniedCondition = (
    //   (
    //     this.adjDscnForm.controls.enrollGrpCd.value === 'CG1' ||
    //     this.adjDscnForm.controls.enrollGrpCd.value === 'HCBS' || // HCBS needs to be checked
    //     this.adjDscnForm.controls.enrollGrpCd.value === 'EC4' ||
    //     this.adjDscnForm.controls.enrollGrpCd.value === 'EC5' ||
    //     this.adjDscnForm.controls.enrollGrpCd.value === 'EC6' ||
    //     this.adjDscnForm.controls.enrollGrpCd.value === 'EC7' ||
    //     this.adjDscnForm.controls.enrollGrpCd.value === 'EC8' ||
    //     this.adjDscnForm.controls.enrollGrpCd.value === 'ICF' ||
    //     this.adjDscnForm.controls.enrollGrpCd.value === 'PACE' ||
    //     this.adjDscnForm.controls.enrollGrpCd.value === 'CAC'
    //   ) &&
    //   (
    //     this.adjDscnForm.controls.locDcsnCd.value === 'NTD' // need to check for non technical denial
    //   ) &&
    //   (addressType === "SA")
    // ) ||
    //   (
    //     this.adjDscnForm.controls.enrollGrpCd.value === 'CG3' &&
    //     this.adjDscnForm.controls.locDcsnCd.value === 'DNF' && // need to check for Denied NF LOC, Approved at Risk
    //     enrollmenDenialReason === "test" // need to check for Target Population Not Met
    //   )

    // const techCondition = (
    //   this.adjDscnForm.controls.enrollGrpCd.value === 'CG1' ||
    //   this.adjDscnForm.controls.enrollGrpCd.value === 'HCBS' || // HCBS needs to be checked
    //   this.adjDscnForm.controls.enrollGrpCd.value === 'EC4' ||
    //   this.adjDscnForm.controls.enrollGrpCd.value === 'EC5' ||
    //   this.adjDscnForm.controls.enrollGrpCd.value === 'EC6' ||
    //   this.adjDscnForm.controls.enrollGrpCd.value === 'EC7' ||
    //   this.adjDscnForm.controls.enrollGrpCd.value === 'EC8' ||
    //   this.adjDscnForm.controls.enrollGrpCd.value === 'ICF' ||
    //   this.adjDscnForm.controls.enrollGrpCd.value === 'PACE' ||
    //   this.adjDscnForm.controls.enrollGrpCd.value === 'CAC'
    // ) &&
    //   (
    //     this.adjDscnForm.controls.locDcsnCd.value === 'TD'
    //   ) &&
    //   (addressType === "SA")


    // const key = isDeniedCondition ? 'SUBMITTER_CLARIFICATION_DENIAL' :
    //   is10dayDeniedCondition ? 'SUBMITTER_CLARIFICATION_10DAY' :
    //     techCondition ? 'SUBMITTER_CLARIFICATION_TECH' :
    //       'SUBMITTER_CLARIFICATION_TECH'  // default one

    // this.dialog.open(AdjudicationClarificationPopupComponent,
    //   { data: { key } })

    //for demo
    this.dialog.open(AdjudicationClarificationPopupComponent,
      {
        data: {
          adjId: this.adjId, key: (popupExample === 1) ? 'SUBMITTER_CLARIFICATION_DENIAL' :
            (popupExample === 2) ? 'SUBMITTER_CLARIFICATION_10DAY' :
              'SUBMITTER_CLARIFICATION_TECH'
        },
        width: '65vw'
      })
  }

  buildAdjDscnForm(): void {
    this.adjDscnForm = this.fb.group({
      reqPageId: ['6'],
      adjId: [this.adjId],
      taskMasterId: this.task_queue,
      taskId: this.task_id,
      enrollGrpCd: [this.erlGrpCd ? this.erlGrpCd : '', Validators.required],
      locDcsnCd: ['', Validators.required],
      paeEffDt: ['', Validators.required],
      paeEndDt: [''],
      recrtfctnDueDt: [''],
      recrtfctnWaiveSw: [''],
      recrtfctStatus: [''],
      sisAssmntReqSw: [''],
      sisLvlOfNeedCd: [''],
      comments: ['', Validators.required],
      trgtPopCd: [''],
      trgtPopNotMeetSw: [''],
      trgtPopPhyDiagnosisSw: [''],
      trgtPopQualFunSw: [''],
      tpIdSw: [''],
      tpDdSw: [''],
      lonChngSw: [''],
      ercChngSw: [''],
      ceaApprovedSw: ['']
    });
  }

  buidAdjSummaryForm(): void {
    this.adjSummaryForm = this.fb.group({
      reqPageId: null,
      adjId: null,
      lvl1DcsnDt: null,
      lvl2EffDt: null,
      lvl2EndDt: null,
      paeSubmissionDt: null,
      paeCertificationDt: null,
      aplAcuityScoreNum: null,
      auditAcuityScoreNum: null,
      rnAcuityScoreNum: null,
      sbmttrAcuityScoreNum: null,
      skilledServiceDateList: null,
      acuityScore: null,
      ltssSftyDcsnCd: null,
      mdcertificationDt: null
    })
  }

  onLocCdChange(event): void {
    if (event.value === 'DNF') {
      this.getAdjFormData().trgtPopCd.setValidators([Validators.required]);
      this.getAdjFormData().trgtPopCd.updateValueAndValidity();
    } else {
      this.getAdjFormData().trgtPopCd.clearValidators();
      this.getAdjFormData().trgtPopCd.updateValueAndValidity();
    }
    this.checkForDenied(event.value);
  }
  onRectificationChange(event): void {
    if (event.value === 'Y') {
      this.getAdjFormData().recrtfctnWaiveSw.patchValue('Y');
    } else {
      this.getAdjFormData().recrtfctnWaiveSw.patchValue('N');
    }
  }

  onSisChange(event): void {
    if (event.value === 'Y') {
      this.getAdjFormData().sisAssmntReqSw.patchValue('Y');
      this.getAdjFormData().sisLvlOfNeedCd.clearValidators();
      this.getAdjFormData().sisLvlOfNeedCd.updateValueAndValidity();
    } else {
      this.getAdjFormData().sisAssmntReqSw.patchValue('N');
      this.getAdjFormData().sisLvlOfNeedCd.setValidators(Validators.required);
      this.getAdjFormData().sisLvlOfNeedCd.updateValueAndValidity();
    }
  }

  ontargetPopulationChange(event): void {
    if (event.value === 'PDS') {
      this.getAdjFormData().trgtPopPhyDiagnosisSw.patchValue("Y");
      this.getAdjFormData().trgtPopNotMeetSw.patchValue("N");
      this.getAdjFormData().trgtPopQualFunSw.patchValue("N");
    } else if (event.value === 'QFL') {
      this.getAdjFormData().trgtPopPhyDiagnosisSw.patchValue("N");
      this.getAdjFormData().trgtPopNotMeetSw.patchValue("N");
      this.getAdjFormData().trgtPopQualFunSw.patchValue("Y");
    } else if (event.value === 'NOT') {
      this.getAdjFormData().trgtPopPhyDiagnosisSw.patchValue("N");
      this.getAdjFormData().trgtPopNotMeetSw.patchValue("Y");
      this.getAdjFormData().trgtPopQualFunSw.patchValue("N");
    }
  }

  getAdjFormData(): any {
    return this.adjDscnForm.controls;
  }

  getAdjSummaryFormData(): any {
    return this.adjSummaryForm.controls
  }

  getAdjDescision(adjId: any): any {
    const getAdjDescision$ = this.adjudicationDetailsService.getAdjDescision(adjId).subscribe(res => {
      if (res.errorCode) {
        return;
      } else {
        this.adjDescision = res;
        this.adjDscnForm.patchValue({
          reqPageId: '6',
          adjId: res.adjId,
          currTaskId: this.task_id,
          enrollGrpCd: res.enrollGrpCd ? res.enrollGrpCd : this.erlGrpCd,
          locDcsnCd: res.locDcsnCd,
          paeEffDt: res.paeEffDt,
          paeEndDt: res.paeEndDt,
          recrtfctnDueDt: res.recrtfctnDueDt,
          recrtfctnWaiveSw: res.recrtfctnWaiveSw,
          recrtfctStatus: res.recrtfctStatus,
          sisAssmntReqSw: 'N',
          sisLvlOfNeedCd: res.sisLvlOfNeedCd,
          comments: res.comments,
          trgtPopNotMeetSw: res.trgtPopNotMeetSw,
          trgtPopPhyDiagnosisSw: res.trgtPopPhyDiagnosisSw,
          trgtPopQualFunSw: res.trgtPopQualFunSw,
          tpIdSw: res.tpIdSw,
          tpDdSw: res.tpDdSw,
          lonChngSw: res.lonChngSw,
          ercChngSw: 'N',
          ceaApprovedSw: res.ceaApprovedSw
        });
        this.enrollGrpCd = this.getAdjFormData()?.enrollGrpCd.value;
        this.paeEndDt = this.getAdjFormData().paeEndDt.value;
        this.checkForDenied(res.locDcsnCd);
      }
    })
    this.subscriptions$.push(getAdjDescision$);
  }

  getAdjSummaryDetails(adjId: any): any {
    const getAdjSummaryDetails$ = this.adjudicationDetailsService.getAdjSummaryDetails(adjId).subscribe(res => {
      this.adjDescisionSummary = res;
      this.adjSummaryForm.patchValue({
        reqPageId: res.reqPageId,
        adjId: res.adjId,
        lvl1DcsnDt: res.lvl1DcsnDt,
        lvl2EffDt: res.lvl2EffDt,
        lvl2EndDt: res.lvl2EndDt,
        paeSubmissionDt: res.paeSubmissionDt,
        paeCertificationDt: res.paeCertificationDt,
        aplAcuityScoreNum: res.aplAcuityScoreNum,
        auditAcuityScoreNum: res.auditAcuityScoreNum,
        rnAcuityScoreNum: res.rnAcuityScoreNumull,
        sbmttrAcuityScoreNum: res.sbmttrAcuityScoreNum,
        skilledServiceDateList: res.skilledServiceDateList,
        acuityScore: res.acuityScore,
        ltssSftyDcsnCd: res.ltssSftyDcsnCd,
        mdcertificationDt: res.nulmdcertificationDtl
      });
      this.skilledServiceDateList = res.skilledServiceDateList;
    })
    this.subscriptions$.push(getAdjSummaryDetails$);
  }

  onEnrChange(event): void {
    this.isECF = false;
    if (this.erlGrpCd.substring(0, 2) === "EC") {
      if (this.enrollGrpCd === event.value) {
        this.sltChangeSw = false;
      } else {
        this.sltChangeSw = true;
      }
    }
    this.setAdjChoices(event.value);
  }

  setAdjChoices(code): void {
    if (code === 'EC4' || code === 'EC5' || code === 'EC6' || code === 'EC7' || code === 'EC8') {
      this.isECF = true;
      this.adjOptions = this.adjDscncodes.filter(element => {
        return element.code === 'NFL' || element.code === 'TPN' || element.code === 'DNF'
      });
    } else if (code === 'CG1' || code === 'CG2' || code === 'CG3') {
      this.adjOptions = this.adjDscncodes.filter(element => {
        return element.code === 'NWE' || element.code === 'NED' || (element.code === 'NEP' && code === 'CG1')
          || element.code === 'NFS' || element.code === 'NSE' || element.code === 'FAC'
          || element.code === 'NMN' || element.code === 'MIC' || element.code === 'NIC'
          || element.code === 'MFA' || (element.code === 'NPA' && code === 'CG1') || element.code === 'DNF' || element.code === 'DWE'
      });
    } else if (code === 'ICF' || code === 'CAC') {
      this.adjOptions = this.adjDscncodes.filter(element => {
        return element.code === 'AP' || (element.code === 'ID' && code === 'ICF') || (element.code === 'CAC' && code === 'CAC')
      })
    } else if (code === 'KBB' || code === 'KBA') {
      this.adjOptions = this.adjDscncodesKB;
    } else if (code === 'PACE') {
      this.adjOptions = this.adjDscncodes.filter(element => {
        return element.code === 'NWE' || element.code === 'NED' || element.code === 'NMN'
          || element.code === 'NFS' || element.code === 'NSE' || element.code === 'FAC'
          || element.code === 'DNF' || element.code === 'DWE'
      })
    } else {
      this.adjOptions = this.adjDscncodes;
    }

  }

  getEnrollmentGroup(): void {
    const getEnrollmentGroup$ = this.adjudicationDetailsService.getSearchDropdowns('GROUP_NAME').subscribe(res => {
      if (this.erlGrpCd != null && this.erlGrpCd !== '') {
        if (this.erlGrpCd.substring(0, 2) === "EC") {
          this.enrollmentGroupCodes = res.filter(element => {
            return element.code.substring(0, 2) === "EC"
          });
        } else {
          this.enrollmentGroupCodes = res;
        }
      }
    })
    this.subscriptions$.push(getEnrollmentGroup$);
  }

  getLevelOfNeed(): void {
    const getLevelOfNeed$ = this.adjudicationDetailsService.getSearchDropdowns('LEVEL_OF_NEED').subscribe(res => {
      this.levelOfNeed = res;
    })
    this.subscriptions$.push(getLevelOfNeed$);

  }

  getAdjDscnCodes(): void {
    const getAdjDscnCodes$ = this.adjudicationDetailsService.getSearchDropdowns('ADJUDICATION_DECISION').subscribe(res => {
      this.adjDscncodes = res;
      this.setAdjChoices(this.erlGrpCd);
    })
    this.subscriptions$.push(getAdjDscnCodes$);
  }

  getKBAdjDscnCodes(): void {
    const getAdjDscnCodes$ = this.adjudicationDetailsService.getSearchDropdowns('KB_ADJUDICATION_DECISIONS').subscribe(res => {
      this.adjDscncodesKB = res;
    })
    this.subscriptions$.push(getAdjDscnCodes$);
  }

  getRecertStatus(): void {
    const getRecertStatus$ = this.adjudicationDetailsService.getSearchDropdowns('RECERTIFICATION').subscribe(res => {
      this.recertStatus = res;
    })
    this.subscriptions$.push(getRecertStatus$);
  }

  getTargetPopulatinoChoices(): void {
    const getTargetPopulatinoChoices$ = this.adjudicationDetailsService.getSearchDropdowns('TP_CHOICES').subscribe(res => {
      this.targetPopulatinoChoices = res;
      this.targetPopulatinoChoices.forEach(element => {
        element.push("isSelected", false)
      });
    })
    this.subscriptions$.push(getTargetPopulatinoChoices$);
  }

  getTargetPopulatinoDiagonosis(): void {
    const getTargetPopulatinoChoices$ = this.adjudicationDetailsService.getSearchDropdowns('TP_DIAGNOSIS').subscribe(res => {
      this.targetPopulatinodiaDiagonosis = res;
    })
    this.subscriptions$.push(getTargetPopulatinoChoices$);
  }

  getDenialReasons(): void {
    this.adjudicationDetailsService.getSearchDropdowns('DENIAL_CLARIFICATION_STATEMENT').subscribe(
      res => {
        this.denialReasons = res;
      }
    )
  }

  openDenialPopup(): void {
    this.dialog.open(AdjudicationDenialPopupComponent,
      {
        data: {
          adjId: this.adjId, denialReasons: this.denialReasons
        },
        width: '65vw'
      })

  }

  filterDenialReasons(): void {
    if (this.getAdjFormData().enrollGrpCd.value.substring(0, 2) === 'EC') {
      this.denialReasons = this.denialReasons.filter(element => {
        return element.code === 'DIQ' || element.code === 'MEN' || element.code === 'IDD'
      })
    } else if (this.getAdjFormData().enrollGrpCd.value === 'CG1' && this.grandFatheredSw === 'Y') {
      this.denialReasons = this.denialReasons.filter(element => {
        return element.code === 'COR' || element.code === 'FAC' || element.code === 'NUR' || element.code === 'ONG' || element.code === 'DOC' || element.code === 'ADL'
      })
    } else if (this.getAdjFormData().enrollGrpCd.value === 'CG1' && (this.getAdjFormData().locDcsnCd.value === 'NMN' || this.getAdjFormData().locDcsnCd.value === 'MFA')) {
      this.denialReasons = this.denialReasons.filter(element => {
        return element.code === 'COR' || element.code === 'FAC' || element.code === 'NUR' || element.code === 'ONG' || element.code === 'DOC'
      })
    } else if (this.getAdjFormData().enrollGrpCd.value === 'CG2' && (this.grandFatheredSw === 'Y' || this.getAdjFormData().locDcsnCd.value === 'NMN' || this.getAdjFormData().locDcsnCd.value === 'MFA')) {
      this.denialReasons = this.denialReasons.filter(element => {
        return element.code === 'DIS' || element.code === 'CHO' || element.code === 'CAR'
      })
    } else if (this.getAdjFormData().enrollGrpCd.value === 'PACE' && this.grandFatheredSw === 'Y') {
      this.denialReasons = this.denialReasons.filter(element => {
        return element.code === 'ADL' || element.code === 'CAR' || element.code === 'PAC'
      })
    } else if (this.getAdjFormData().locDcsnCd.value === 'TD') {
      this.denialReasons = this.denialReasons.filter(element => {
        return element.code === 'CER' || element.code === 'INV' || element.code === 'INC' || element.code === 'TRA' || element.code === 'PAE' || element.code === 'OTH'
      })
    } else if (this.getAdjFormData().enrollGrpCd.value === 'CAC' || this.getAdjFormData().enrollGrpCd.value === 'ICF') {
      this.denialReasons = this.denialReasons.filter(element => {
        return element.code === 'ICF' || element.code === 'DIA' || element.code === 'SPE'
      })
    }
  }
  isCheckboxSelected(item): void {
    this.targetPopulatinoChoices.forEach(element => {
      if (element.name === item.name) {
        element.isSelected = !element.isSelected
      } else {
        element.isSelected = false;
      }
    })
    if (item.name === 'NOT') {
      this.getAdjFormData().trgtPopNotMeetSw.patchValue('Y')
      this.getAdjFormData().trgtPopPhyDiagnosisSw.patchValue('N')
      this.getAdjFormData().trgtPopQualFunSw.patchValue('N')
    } else if (item.name === 'QFL') {
      this.getAdjFormData().trgtPopNotMeetSw.patchValue('N')
      this.getAdjFormData().trgtPopPhyDiagnosisSw.patchValue('N')
      this.getAdjFormData().trgtPopQualFunSw.patchValue('Y')
    } else if (item.name === 'PDS') {
      this.getAdjFormData().trgtPopNotMeetSw.patchValue('N')
      this.getAdjFormData().trgtPopPhyDiagnosisSw.patchValue('Y')
      this.getAdjFormData().trgtPopQualFunSw.patchValue('N')
    }
  }

  checkForDenied(code): void {
    this.isDenied = false;
    if (code === 'DNF' || code === 'DWE' || code === 'FAC' || code === 'NMN' || code === 'MIC' || code === 'NIC' || code === 'MFA' || code === 'NPA' || code === 'TPN' || code === 'ID' || code === 'CAC' || code === 'KBD' || code === 'TD') {
      this.isDenied = true;
      this.filterDenialReasons();
    }
  }

  convertToString(skilledServiceDateList): void {
    return skilledServiceDateList?.join('<br>');
  }

  saveAdjDscn(): void {
    if (this.checkForSafetyAccordionState()) {
      this.displaySpinner = true;
      this.submitted = true;
      if (this.adjDscnForm.invalid) {
        this.displaySpinner = false
        this.toastr.error("Please enter all the required values")
      } else {
        this.adjDscnForm.get('taskMasterId').patchValue(this.task_queue);
        this.adjDscnForm.get('taskId').patchValue(this.task_id);
        const payload = this.adjDscnForm.value;
        this.adjudicationDetailsService.saveAdjDscn(payload).subscribe(res => {
          this.isECF = false;
          this.displaySpinner = false;
          if (res.errorCode) {
            return;
          } else {
            this.toastr.success("saved successfully");
            this.setSaved();
            if(this.fromChngMgmt){
              this.setSavedOverride();
            }
            this.router.navigate(['ltss/adjudicationDashboard']);
          }
        },
          error => {
            this.isECF = false;
            this.toastr.error("Failed to save")
            this.displaySpinner = false
          })
      }
    } else {
      this.toastr.error("Please complete Safety accordian before subitting Adjudication Determination!")
    }
  }

  checkForSafetyAccordionState(): boolean {
    if (this.safetyAccordionPresent) {
      if (this.safetyAccordionCompleted) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }

  setSaved(): void {
    this.savedDetermn.emit(true);
  }

  setSavedOverride(): void {
    this.savedDetermnOverride.emit(true);
  }

  onDestroy(): void {
    if (this.subscriptions$ && this.subscriptions$.length > 0) {
      this.subscriptions$.forEach(subscription$ => subscription$.unsubscribe());
    }
  }
}
