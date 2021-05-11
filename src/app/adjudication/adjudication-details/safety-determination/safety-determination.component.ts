import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { ToastrService } from 'ngx-toastr';
import { AdjudicationDetailsService } from 'src/app/core/services/adjudication/adjudication-details.service';
import { PaeCommonService } from 'src/app/core/services/pae/pae-common/pae-common.service';
export interface PeriodicElement {
  SafetyReqyestSwName: string;
  SafetyRequestDescription: string;
  RnReviewerResponse: string;
  safetyRqstCd?: string;
}

export interface SafetyPendingElement {
  SafetyPendDate?: string;
  SafetyDueDate?: string;
  Status?: string;
  UpdateDate?: string;
  UpdateUser?: string;
  UserActions?: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { SafetyReqyestSwName: 'acutyScr5Less8Sw', SafetyRequestDescription: 'Has an approved acuity score of at least (5) but no more than eight (8).', RnReviewerResponse: '', safetyRqstCd: 'ASFE' },
  { SafetyReqyestSwName: 'intlctlDisbltySw', SafetyRequestDescription: 'Has an intellectual or developmental disability and is under the age of 18.', RnReviewerResponse: '', safetyRqstCd: 'IDDA' },
  { SafetyReqyestSwName: 'intelDisMalaIndex12Sw', SafetyRequestDescription: 'Has an intellectual or developmental disability and a General Maladaptive Index value of -21 or lower.', RnReviewerResponse: '', safetyRqstCd: 'GMIV' },
  { SafetyReqyestSwName: 'acutyScr2behavSw', SafetyRequestDescription: 'Has an individual acuity score of at least 2 for the Behavior measure', RnReviewerResponse: '', safetyRqstCd: 'ASTB' },
  { SafetyReqyestSwName: 'acutyScr3orinetSw', SafetyRequestDescription: 'Has an individual acuity score of at least 3 for the Orientation measure', RnReviewerResponse: '', safetyRqstCd: 'ASOM' },
  {
    SafetyReqyestSwName: 'acutyScr3mobTrnsfrSw', SafetyRequestDescription: 'Has an individual acuity score of at least 3 for the mobility or transfer measures', RnReviewerResponse: '', safetyRqstCd: 'ASMT'
  },
  {
    SafetyReqyestSwName: 'acutyScr2toiletingSw', SafetyRequestDescription: 'Has an individual acuity score of at least 2 for the toileting measure', RnReviewerResponse: '', safetyRqstCd: 'ASTM'
  },
  { SafetyReqyestSwName: 'changPhyclBehvSw', SafetyRequestDescription: 'Has significant change in physical or behavioral health or functional needs for applicant', RnReviewerResponse: '', safetyRqstCd: 'SCPB' },
  { SafetyReqyestSwName: 'changPhyclBehvPrimaryCareSw', SafetyRequestDescription: 'Has significant change in physical or behavioral health or functional needs for applicants primary caregiver.', RnReviewerResponse: '', safetyRqstCd: 'SCPC' },
  {
    SafetyReqyestSwName: 'rcntFallSw', SafetyRequestDescription: 'Has pattern of recent falls resulting in injury', RnReviewerResponse: '', safetyRqstCd: 'PRFR'
  },
  {
    SafetyReqyestSwName: 'rcntEmergtHospAdmsnSw', SafetyRequestDescription: 'Has pattern of recent emergent hospital admissions, NF admissions or ER visits', RnReviewerResponse: '', safetyRqstCd: 'PREH'
  },
  { SafetyReqyestSwName: 'selfNegliSw', SafetyRequestDescription: 'Displays self-negligence resulting in involvement by law enforcement or Adult Protective services', RnReviewerResponse: '', safetyRqstCd: 'SNLA' },
  {
    SafetyReqyestSwName: 'rcntDischargeSw', SafetyRequestDescription: 'Is recently discharged from a community-based residential alternative setting', RnReviewerResponse: '', safetyRqstCd: 'RDCR'
  },

  { SafetyReqyestSwName: 'cmpxChrncSw', SafetyRequestDescription: 'Has diagnosed complex acute or chronic medical conditions', RnReviewerResponse: '', safetyRqstCd: 'DCAC' },
  {
    SafetyReqyestSwName: 'mcoDetemiationGrp5Sw', SafetyRequestDescription: 'MCO has determined applicants needs cannot be safely met if enrolled in Group 5', RnReviewerResponse: '', safetyRqstCd: 'MDGF'
  },
  {
    SafetyReqyestSwName: 'noCriteriaMetGrp5Sw', SafetyRequestDescription: 'None of the criteria have been met, but other safety concerns which impact the applicant being safely served in CHOICES Group 5 exist', RnReviewerResponse: '', safetyRqstCd: 'NCSC'
  },
  { SafetyReqyestSwName: 'mcoDetemiationGrp3Sw', SafetyRequestDescription: 'MCO has determined applicants needs cannot be safely met if enrolled in Group 3.', RnReviewerResponse: '', safetyRqstCd: 'MDGT' },
  {
    SafetyReqyestSwName: 'noCriteriaMetGrp3Sw', SafetyRequestDescription: 'None of the criteria have been met, but other safety concerns which impact the applicant being safely served in CHOICES Group 3 exist', RnReviewerResponse: '', safetyRqstCd: 'CHGT'
  },
  {
    SafetyReqyestSwName: 'donotBelieveSw', SafetyRequestDescription: 'I do not believe individual can be safely served in the community in the CHOICE group 3.', RnReviewerResponse: '', safetyRqstCd: 'IDBI'
  },
  {
    SafetyReqyestSwName: 'doBelieveSw', SafetyRequestDescription: 'I believe this individual can be safely served in the community in the CHOICE group 3.', RnReviewerResponse: '', safetyRqstCd: 'IBTI'
  },
  {
    SafetyReqyestSwName: 'reqApplcntSw', SafetyRequestDescription: 'This safety determination form was completed at the request of applicant/representative.', RnReviewerResponse: '', safetyRqstCd: 'TSDF'
  },
  { SafetyReqyestSwName: 'doBelieveAtRiskSw', SafetyRequestDescription: 'I believe this individual, who is under 18 with an Intellectual and/ or developmental disability is at imminent risk of placement outside the home without the availability of benefits in ECF CHOICES Group 4.', RnReviewerResponse: '', safetyRqstCd: 'IBUI' }
];

const Safety_ELEMENT_DATA: SafetyPendingElement[] = [
  { SafetyPendDate: '05/19/2020', SafetyDueDate: '06/18/2020', Status: 'Completed', UpdateDate: '06/14/2020', UpdateUser: 'Jane Doe', UserActions: 'cancel' }
];


@Component({
  selector: 'app-safety-determination',
  templateUrl: './safety-determination.component.html',
  styleUrls: ['./safety-determination.component.scss']
})
export class SafetyDeterminationComponent implements OnInit {
  @Output() savedSafety = new EventEmitter<boolean>();
  @Output() displaySafety = new EventEmitter<boolean>();
  subscriptions$: any[] = [];
  displayedColumns: string[] = ['SafetyRequestDescription', 'RNReviewerResponse'];
  displayedSafetDecisionColumns: string[] = ['SafetyPendDate', 'SafetyDueDate', 'Status', 'UpdateDate', 'UpdateUser', 'UserActions'];
  dataSource = ELEMENT_DATA;
  dataSource1 = Safety_ELEMENT_DATA;
  showSafetyPendingTable: boolean;
  adjId: any;
  SafetyDetermination: any;
  safetyDeterminationFromPAE: any;
  safetyStatuses: any;
  ltsSafetyOptions: any;
  rnResponse: any;
  safetyAssessmentMainFormGroup: FormGroup;
  safetyStatusesMainFormGroup: FormGroup;
  safetyFormGroup: FormGroup;
  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'indeterminate';
  value = 50;
  displaySpinner = false;
  displayEditButton = true;

  constructor(
    private adjudicationDetailsService: AdjudicationDetailsService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private paeCommonService: PaeCommonService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.adjId = this.paeCommonService.getAdjId();
    this.safetyFormGroup = this.fb.group({
      reqPageId: ['5'],
      id: [''],
      adjId: this.adjId,
      comments: [''],
      ltssSafetyDcsnCd: [''],
      safetyAssesmtReqSw: [''],
      adjSafetyRqstVO: ['']
    });

    this.safetyAssessmentMainFormGroup = this.fb.group({
      safetyAssessmentFormGroupArray: this.fb.array([])
    });
    this.buildsafetyAssessmentFormArray();

    // this.safetyStatusesMainFormGroup = this.fb.group({
    //   safetyStatusesFormGroupArray: this.fb.array([])
    // });
    // this.buildsafetyStatusesFormArray();

    this.getSafetyDetermination();
    this.getRnResponse();
    this.getltsSafetyDscn();
  }

  buildsafetyAssessmentFormArray(): void {
    (this.safetyAssessmentMainFormGroup.get('safetyAssessmentFormGroupArray') as FormArray).clear();
    this.dataSource.forEach(item => {
      (this.safetyAssessmentMainFormGroup.get('safetyAssessmentFormGroupArray') as FormArray).push(this.fb.group({
        id: [''],
        adjId: this.adjId,
        safetyRqstCd: item.safetyRqstCd,
        rnRvwrRspCd: ['']
      }));
    });
  }

  buildsafetyStatusesFormArray(): void {
    (this.safetyStatusesMainFormGroup.get('safetyStatusesFormGroupArray') as FormArray).clear();
    this.dataSource1.forEach(item => {
      (this.safetyStatusesMainFormGroup.get('safetyStatusesFormGroupArray') as FormArray).push(this.fb.group({
        id: '',
        adjId: this.adjId,
        safetyPendingDt: '',
        safetyDueDt: '',
        safetyStatusCd: '',
        lastModifiedBy: '',
        lastModifiedDt: ''
      }));
    });
  }

  onChangeLTSSSafetyDecision(event) {
    if (event.value === 'INC' || event.value === 'PEN') {
      this.showSafetyPendingTable = true;
    } else {
      this.showSafetyPendingTable = false;
    }
  }

  deleteSelectedRow(row_obj) {
    this.dataSource1 = this.dataSource1.filter((value, key) => {
      return value.UpdateUser != row_obj.UpdateUser;
    });
  }

  sendValue(event, index) {
    const code = event.value;
    console.log(event);
    (this.safetyAssessmentMainFormGroup.get('safetyAssessmentFormGroupArray') as FormArray).at(index).get('rnRvwrRspCd').patchValue(event.value);
  }

  compareWithFn(listOfItems, selectedItem) {
    return listOfItems && selectedItem && listOfItems.code === selectedItem.code;
  }

  getSafetyDetermination(): void {
    const getAcuityScore$ = this.adjudicationDetailsService.getSafetyDetermination(this.adjId).subscribe(
      res => {
        if (res.errorCode) {
          this.displaySpinner = false;
          this.getSafetyDeterminationFromPAE();
        } else {
          this.adjudicationDetailsService.updateSafetyCompleted(true);
          this.disableFormControls();
          this.displayEditButton = true;
          this.displaySpinner = false;
          this.SafetyDetermination = res;
          this.dataSource = this.dataSource.filter(element => {
            return res.adjSafetyRqstVO.some(item => element.safetyRqstCd === item.safetyRqstCd);
          });
          this.buildsafetyAssessmentFormArray();
          this.dataSource.forEach((element, index) => {
            const safetyDtrmArray = this.safetyAssessmentMainFormGroup.get('safetyAssessmentFormGroupArray') as FormArray;
            const adjSafetyRqstVO = res.adjSafetyRqstVO.find(item => element.safetyRqstCd === item.safetyRqstCd);
            if (adjSafetyRqstVO != null) {
              safetyDtrmArray.at(index).patchValue({
                id: adjSafetyRqstVO.id,
                adjId: adjSafetyRqstVO.adjId,
                safetyRqstCd: adjSafetyRqstVO.safetyRqstCd,
                rnRvwrRspCd: adjSafetyRqstVO.rnRvwrRspCd
              });
            }
          });
          this.safetyFormGroup.patchValue({
            id: res.id,
            adjId: res.adjId,
            comments: res.comments,
            ltssSafetyDcsnCd: res.ltssSafetyDcsnCd,
            safetyAssesmtReqSw: res.safetyAssesmtReqSw
          });
          this.getAdjSafetyStatuses();
          this.changeDetectorRef.markForCheck();
          if (res.ltssSafetyDcsnCd === 'INC' || res.ltssSafetyDcsnCd === 'PEN') {
            this.showSafetyPendingTable = true;
          } else {
            this.showSafetyPendingTable = false;
          }
        }
      }
    )
    this.subscriptions$.push(getAcuityScore$);
  }

  getSafetyDeterminationFromPAE(): void {
    const getSafetyDeterminationFromPAE$ = this.adjudicationDetailsService.getSafetyDeterminationFromPAE(this.adjId).subscribe(
      res => {
        if (res.errorCode) {
          this.displaySpinner = false;
          this.dataSource = null;
          this.setDisplaySafety();
          return;
        } else {
          this.adjudicationDetailsService.updateSafetyExists(true);
          this.disableFormControls();
          this.displayEditButton = true;
          this.displaySpinner = false;
          this.safetyDeterminationFromPAE = res;
          this.safetyDeterminationFromPAE = Object.keys(res).filter(key => res[key] === 'Y');
          this.dataSource = this.dataSource.filter(element => {
            return this.safetyDeterminationFromPAE.includes(element.SafetyReqyestSwName);
          });
          this.buildsafetyAssessmentFormArray();
        }
      },
      error => {
        //this.toastr.error("Safety Information does not exist!")
        this.setDisplaySafety();
      });
    this.subscriptions$.push(getSafetyDeterminationFromPAE$);
  }

  getAdjSafetyStatuses(): void {
    const getAdjSafetyStatuses$ = this.adjudicationDetailsService.getAdjSafetyStatuses(this.adjId).subscribe(
      res => {
        if (res.errorCode) {
          this.toastr.error(res.errorCode[0].description);
          this.displaySpinner = false;
        } else {
          this.displaySpinner = false;
          this.displayEditButton = true;
          this.safetyStatuses = res;
          this.dataSource1 = res;
          this.buildsafetyStatusesFormArray();
          const safetyStatusesMainFormGroup = this.safetyStatusesMainFormGroup.get('safetyStatusesFormGroupArray') as FormArray
          this.dataSource1.forEach((element, index) => {
            safetyStatusesMainFormGroup.at(index).patchValue({
              id: res[index].id,
              adjId: res[index].adjId,
              safetyPendingDt: res[index].safetyPendingDt,
              safetyDueDt: res[index].safetyDueDt,
              safetyStatusCd: res[index].safetyStatusCd,
              lastModifiedBy: res[index].lastModifiedBy,
              lastModifiedDt: res[index].lastModifiedDt
            });
          })
        }
      }
    )
    this.subscriptions$.push(getAdjSafetyStatuses$);
  }

  getRnResponse(): void {
    const getSkilledServices$ = this.adjudicationDetailsService.getSearchDropdowns('ADJUDICATION_SAFETY').subscribe(
      res => {
        this.rnResponse = res;
      })
    this.subscriptions$.push(getSkilledServices$);
  }

  getltsSafetyDscn(): void {
    const getSkilledServices$ = this.adjudicationDetailsService.getSearchDropdowns('LTSS_SAFETY_DECISION').subscribe(
      res => {
        this.ltsSafetyOptions = res;
      })
    this.subscriptions$.push(getSkilledServices$);
  }

  onSaftAssntChng(event): void {
    this.safetyFormGroup.get('safetyAssesmtReqSw').setValue(event.value);
  }

  onEdit(): void {
    this.displayEditButton = false;
    this.safetyFormGroup.get('comments').enable();
    this.safetyFormGroup.get('ltssSafetyDcsnCd').enable();
    this.safetyFormGroup.get('safetyAssesmtReqSw').enable();
    const safetyStatusesMainFormArray = this.safetyAssessmentMainFormGroup.get('safetyAssessmentFormGroupArray') as FormArray
    // this.dataSource.forEach((element, index) => {
    //   safetyStatusesMainFormArray.at(index).get('rnRvwrRspCd').enable();
    // })
  }

  disableFormControls(): void {
    this.safetyFormGroup.get('comments').disable();
    this.safetyFormGroup.get('ltssSafetyDcsnCd').disable();
    this.safetyFormGroup.get('safetyAssesmtReqSw').disable();
    const safetyStatusesMainFormArray = this.safetyAssessmentMainFormGroup.get('safetyAssessmentFormGroupArray') as FormArray
    // this.dataSource.forEach((element, index) => {
    //   safetyStatusesMainFormArray.at(index).get('rnRvwrRspCd').disable();
    // })
  }

  onSave(): void {
    this.displaySpinner = true;
    const safetyAssessmentFormGroupArray = this.safetyAssessmentMainFormGroup.getRawValue().safetyAssessmentFormGroupArray;
    const payload = this.safetyFormGroup.getRawValue();
    payload.adjSafetyRqstVO = safetyAssessmentFormGroupArray;
    this.adjudicationDetailsService.saveSafety(payload).subscribe(
      res => {
        this.disableFormControls();
        this.displayEditButton = true;
        this.displaySpinner = false;
        if (res.errorCode) {
          this.toastr.error(res.errorCode[0].description);
        } else {
          this.toastr.success("Saved Successfully");
          this.getSafetyDetermination();
          this.setSaved();
        }
      },
      error => {
        this.toastr.error("Server Error");
        this.displaySpinner = false;
      }
    )
  }
  setSaved(): void {
    this.savedSafety.emit(true);
    this.adjudicationDetailsService.updateSafetyCompleted(true);
  }

  setDisplaySafety(): void {
    this.displaySafety.emit(false);
  }

  onDestroy(): void {
    if (this.subscriptions$ && this.subscriptions$.length > 0) {
      this.subscriptions$.forEach(subscription$ => subscription$.unsubscribe());
    }
  }

}
