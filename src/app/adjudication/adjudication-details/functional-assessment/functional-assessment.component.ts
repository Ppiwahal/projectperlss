import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { AdjudicationDetailsService } from 'src/app/core/services/adjudication/adjudication-details.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Toast, ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';
import { PaeCommonService } from 'src/app/core/services/pae/pae-common/pae-common.service';
import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';

export interface PeriodicElement {
  functionalMeasureCd: string;
  functionalmeasure: string;
  description: string;

}

const ELEMENT_DATA: PeriodicElement[] = [
  { functionalMeasureCd: 'TRAN', functionalmeasure: 'Transfer', description: 'The applicant is incapable of transfer to and from bed, chair, or toilet unless physical assistance is provided by others on an ongoing basis.\n \n*Approval of this deficit requires documentation of the medical condition(s) contributing to this deficit, as well as the specific type and frequency of transfer assistance required.' },
  { functionalMeasureCd: 'MOBL', functionalmeasure: 'Mobility', description: 'The applicant requires physical assistance from another person for mobility on an ongoing basis. Mobility is defined as the ability to walk, using mobility aids such as a walker, crutch, or cane if required, or the ability to use a wheelchair (manual or electric) if walking is not feasible.\n \n*Approval of this deficit required documentation of the medical condition(s) contributing to this deficit, as well as the specific type and frequency of mobility assistance required.' },
  { functionalMeasureCd: 'MOBW', functionalmeasure: 'Mobility - WheelChair', description: 'The applicant requires physical assistance from another person for mobility on an ongoing basis. Mobility is defined as the ability to walk, using mobility aids such as a walker, crutch, or cane if required, or the ability to use a wheelchair (manual or electric) if walking is not feasible.\n \n*Approval of this deficit required documentation of the medical condition(s) contributing to this deficit, as well as the specific type and frequency of mobility assistance required.' },
  { functionalMeasureCd: 'EATG', functionalmeasure: 'Eating', description: 'The applicant requires physical assistance with gastrostomy tube feedings or physical assistance or constant one-on-one observation and verbal assistance (reminding, encouraging) to consume prepared food and drink (or self-administer tube feedings, as applicable) or must be fed part or all of each meal. Food preparation, tray set-up, assistance in cutting up foods, and general supervision of multiple residents shall not be considered to meet this requirement.\n \n*Approval of this deficit requires documentation which supports the need for such intervention, along with evidence that in the absence of such physical assistance or constant one-on-one observation and verbal assistance, the applicant would be unable to self-perform this task. For PAEs submitted by an entity other than an MCO, NF, or PACE, an eating or feeding plan specifying the type, frequency and duration of supports required by the applicant for feeding, along with evidence that in the absence of such physical assistance or constant one-on-one observation and verbal assistance, the applicant would be unable to self-perform this task is required.' },
  { functionalMeasureCd: 'TLTG', functionalmeasure: 'Toileting', description: 'The applicant requires physical assistance from another person to use the toilet on an ongoing basis.' },
  { functionalMeasureCd: 'TLTI', functionalmeasure: 'Toileting - Incontinence', description: 'The applicant requires physical assistance from another person to use the toilet on an ongoing basis.' },
  { functionalMeasureCd: 'TLTC', functionalmeasure: 'Toileting - Catheter/Ostomy', description: 'Applicant requires physical assistance from another person to perform catheter/ostomy care on an ongoing basis.' },
  { functionalMeasureCd: 'VISN', functionalmeasure: 'Vision', description: '' },
  { functionalMeasureCd: 'ORNT', functionalmeasure: 'Orientation', description: 'The applicant is disoriented to person (e.g., fails to remember own name, or recognize immediate family members), place (e.g., does not know residence is a NF), or event/situation (e.g., is unaware of current circumstances in order to make decisions that prevent risk of harm).\n \n*Approval of this deficit requires documentation of the specific orientation deficit(s), including the frequency of occurrence of such deficit(s), and the impact of such deficit(s) on the applicant.' },
  { functionalMeasureCd: 'ECOM', functionalmeasure: 'Expressive Communication', description: 'The applicant is incapable of reliably communicating basic needs and wants (e.g., need for assistance with toileting; presence of pain) in a manner that can be understood by others, including through the use of assistive devices.\n \n*Approval of this deficit requires documentation of the medical condition(s) contributing to this deficit, as well as the specific type and frequency of communication assistance required.' },
  { functionalMeasureCd: 'RCOM', functionalmeasure: 'Receptive Communication', description: 'The applicant is incapable of understanding and following very simple instructions and commands without continual intervention.\n \n*Approval of this deficit requires documentation of the medical condition(s) contributing to this deficit, as well as the specific type and frequency of communication assistance required.' },
  { functionalMeasureCd: 'MEDC', functionalmeasure: 'Medication', description: 'The applicant is not cognitively or physically capable of self-administering prescribed medications at the prescribed schedule despite the availability of limited assistance from another person.  Limited assistance includes, but is not limited to, reminding when to take medications, encouragement to take, reading medication labels, opening bottles, handing to applicant, reassurance of the correct dose, and the use of assistive devices including a prepared medication box. An occasional lapse in adherence to a medication schedule shall not be sufficient for approval of this deficit; the applicant must have physical or cognitive impairments which persistently inhibit his or her ability to self-administer medications.\n \n*Approval of this deficit requires evidence that such interventions have been tried or would not be successful, and that in the absence of intervention, the applicant’s health would be at serious and imminent risk of harm.' },
  { functionalMeasureCd: 'BHVR', functionalmeasure: 'Behavior', description: 'The applicant requires persistent staff or caregiver intervention and supervision (due to an established and persistent pattern of behavioral problems which are not primarily related to a mental health condition (for which mental health treatment would be the most appropriate course of treatment) or a substance abuse disorder (for which substance abuse treatment would be the most appropriate course of treatment), and which, absent such continual intervention and supervision, place the applicant or others at imminent and serious risk of harm. Such behaviors may include physical aggression (including assaultive or self-injurious behavior, destruction of property, resistive or combative to personal and other care, intimidating/threatening, or sexual acting out or exploitation) or inappropriate or unsafe behavior (including disrobing in public, eating non-edible substances, fire setting, unsafe cooking or smoking, wandering, elopement, or getting lost).\n \n*Approval of this deficit requires documentation of the specific behaviors and the frequency of such behaviors.' }
];

@Component({
  selector: 'app-functional-assessment',
  templateUrl: './functional-assessment.component.html',
  styleUrls: ['./functional-assessment.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class FunctionalAssessmentComponent implements OnInit {
  @Output() savedFa = new EventEmitter<boolean>();
  displayedColumns: string[] = ['functionalmeasure', 'submitterresponse', 'submittedacuityscore',
    'revieweraction', 'adjudicatedacuityscore'];
  dataSource = ELEMENT_DATA;
  isTableExpanded = false;
  expandedElement;
  selectedButton: any;
  functionalAssessmentDetails: any;
  paefunctionalAssessmentDetails: any;
  rnResponseForAP: any;
  rnResponseForD: any;
  functionalAsessmentMainFormGroup: FormGroup;
  taskMasterId = 0;
  userRole = 'r';
  adjId: any;
  backup: any;
  acutityScoresFromOPA: any;
  submitted = false;
  displaySpinner = false;
  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'indeterminate';
  value = 50;
  displayEditButton = false;
  

  constructor(private adjudicationDetailsService: AdjudicationDetailsService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private paeCommonService: PaeCommonService) { }

  ngOnInit(): void {
    this.adjId = this.paeCommonService.getAdjId();
    //  this.getAcuityScoresFromOPA();
    this.getFunctionalAssessment(this.adjId);
    this.getRnResponseForAP();
    this.getRnResponseForD();
    this.functionalAsessmentMainFormGroup = this.fb.group({
      functionalAsessmentFormGroupArray: this.fb.array([])
    });
    this.buildFAform();
    window['abcd'] = this;
  }

  buildFAform(): void {
    (this.functionalAsessmentMainFormGroup.get('functionalAsessmentFormGroupArray') as FormArray).clear();
    this.dataSource.forEach(item => {
      (this.functionalAsessmentMainFormGroup.get('functionalAsessmentFormGroupArray') as FormArray).push(this.fb.group({
        adjId: this.adjId,
        id: null,
        funcMeasureCd: item.functionalMeasureCd,
        aplAcuityScoreNum: null,
        aplApprovalCd: null,
        aplComment: null,
        aplDenialCd: null,
        auditAcuityScoreNum: null,
        auditApprovalCd: null,
        auditComment: null,
        auditDenialCd: null,
        rnActionCd: [null, Validators.required],
        rnAcuityScoreNum: [null],
        rnApprovalCd: null,
        rnComment: null,
        rnDenialCd: null,
        sbmttrAcuityCd: null,
        sbmttrAcuityScoreNum: null,
        sbmttrCapNeedRspCd: null,
        sbmttrRspCd: null,
        comments: null,
        adjudicatedAcuityScoreNum: null
      }));
    });
  }

  openExpandedTable(value, element, index) {
    (this.functionalAsessmentMainFormGroup.get('functionalAsessmentFormGroupArray') as FormArray).get(String(index))
      .get('rnActionCd').setValue(value);
    if (value == 'A') {
      this.expandedElement = element;
      this.selectedButton = 'A';
      (this.functionalAsessmentMainFormGroup.get('functionalAsessmentFormGroupArray') as FormArray).get(String(index))
        .get('rnApprovalCd').disable();
      const sbmttrAcuityScoreNum = (this.functionalAsessmentMainFormGroup.get('functionalAsessmentFormGroupArray') as FormArray).get(String(index))
        .get('sbmttrAcuityScoreNum').value;
      const sbmttrAcuityCd = (this.functionalAsessmentMainFormGroup.get('functionalAsessmentFormGroupArray') as FormArray).get(String(index))
        .get('sbmttrAcuityCd').value;
      (this.functionalAsessmentMainFormGroup.get('functionalAsessmentFormGroupArray') as FormArray).get(String(index))
        .get('adjudicatedAcuityScoreNum').patchValue(sbmttrAcuityScoreNum);
      (this.functionalAsessmentMainFormGroup.get('functionalAsessmentFormGroupArray') as FormArray).get(String(index))
        .get('rnApprovalCd').patchValue(sbmttrAcuityCd);
      (this.functionalAsessmentMainFormGroup.get('functionalAsessmentFormGroupArray') as FormArray).get(String(index))
        .get('rnAcuityScoreNum').patchValue(sbmttrAcuityScoreNum);
      this.clearRnDenialCdValidators(index);
      this.setRnApprovalCdValidators(index);
    } else if (value == 'P') {
      this.selectedButton = 'P';
      this.expandedElement = element;
      (this.functionalAsessmentMainFormGroup.get('functionalAsessmentFormGroupArray') as FormArray).get(String(index))
        .get('rnApprovalCd').enable();
      const sbmttrAcuityScoreNum = (this.functionalAsessmentMainFormGroup.get('functionalAsessmentFormGroupArray') as FormArray).get(String(index))
        .get('sbmttrAcuityScoreNum').value;
      const sbmttrAcuityCd = (this.functionalAsessmentMainFormGroup.get('functionalAsessmentFormGroupArray') as FormArray).get(String(index))
        .get('sbmttrAcuityCd').value;
      this.clearRnDenialCdValidators(index);
      this.setRnApprovalCdValidators(index)

    } else if (value == 'D') {
      this.selectedButton = 'D';
      this.expandedElement = element;
      (this.functionalAsessmentMainFormGroup.get('functionalAsessmentFormGroupArray') as FormArray).get(String(index))
        .get('rnApprovalCd').enable();
      (this.functionalAsessmentMainFormGroup.get('functionalAsessmentFormGroupArray') as FormArray).get(String(index))
        .get('rnAcuityScoreNum').patchValue(0);
      (this.functionalAsessmentMainFormGroup.get('functionalAsessmentFormGroupArray') as FormArray).get(String(index))
        .get('adjudicatedAcuityScoreNum').patchValue(0);
      this.setRnDenialCdValidators(index);
      this.clearRnApprovalCdValidators(index)
    }

  }

  clearRnApprovalCdValidators(index): void {
    (this.functionalAsessmentMainFormGroup.get('functionalAsessmentFormGroupArray') as FormArray).get(String(index))
      .get('rnApprovalCd').clearValidators();
    (this.functionalAsessmentMainFormGroup.get('functionalAsessmentFormGroupArray') as FormArray).get(String(index))
      .get('rnApprovalCd').updateValueAndValidity();
    (this.functionalAsessmentMainFormGroup.get('functionalAsessmentFormGroupArray') as FormArray).get(String(index))
      .get('rnAcuityScoreNum').clearValidators();
    (this.functionalAsessmentMainFormGroup.get('functionalAsessmentFormGroupArray') as FormArray).get(String(index))
      .get('rnAcuityScoreNum').updateValueAndValidity();
  }
  setRnApprovalCdValidators(index): void {
    (this.functionalAsessmentMainFormGroup.get('functionalAsessmentFormGroupArray') as FormArray).get(String(index))
      .get('rnApprovalCd').setValidators(Validators.required);
    (this.functionalAsessmentMainFormGroup.get('functionalAsessmentFormGroupArray') as FormArray).get(String(index))
      .get('rnApprovalCd').updateValueAndValidity();
    (this.functionalAsessmentMainFormGroup.get('functionalAsessmentFormGroupArray') as FormArray).get(String(index))
      .get('rnAcuityScoreNum').setValidators(Validators.required);
    (this.functionalAsessmentMainFormGroup.get('functionalAsessmentFormGroupArray') as FormArray).get(String(index))
      .get('rnAcuityScoreNum').updateValueAndValidity();
  }
  clearRnDenialCdValidators(index): void {
    (this.functionalAsessmentMainFormGroup.get('functionalAsessmentFormGroupArray') as FormArray).get(String(index))
      .get('rnDenialCd').clearValidators();
    (this.functionalAsessmentMainFormGroup.get('functionalAsessmentFormGroupArray') as FormArray).get(String(index))
      .get('rnDenialCd').updateValueAndValidity();
  }

  setRnDenialCdValidators(index): void {
    (this.functionalAsessmentMainFormGroup.get('functionalAsessmentFormGroupArray') as FormArray).get(String(index))
      .get('rnDenialCd').setValidators(Validators.required);
    (this.functionalAsessmentMainFormGroup.get('functionalAsessmentFormGroupArray') as FormArray).get(String(index))
      .get('rnDenialCd').updateValueAndValidity();
  }

  clearRnActiondValidators(index): void {
    (this.functionalAsessmentMainFormGroup.get('functionalAsessmentFormGroupArray') as FormArray).get(String(index))
      .get('rnActionCd').clearValidators();
    (this.functionalAsessmentMainFormGroup.get('functionalAsessmentFormGroupArray') as FormArray).get(String(index))
      .get('rnActionCd').updateValueAndValidity();
  }

  getFunctionalAssessment(adjId): void {
    this.adjudicationDetailsService.getfunctionalAssessment(adjId).subscribe(
      res => {
        this.functionalAssessmentDetails = res;
        if (res.errorCode) {
          this.loadFunctionalAssessmentsFromPae(adjId);
        } else {
          this.displayEditButton = true;
          this.displaySpinner = false;
          this.dataSource = this.dataSource.filter(element => {
            return res.some(item => element.functionalMeasureCd === item.funcMeasureCd && item.sbmttrAcuityCd != null && item.sbmttrAcuityCd !== '');
          });
          this.buildFAform();
          const functionalAsessmentFormGroupArray = this.functionalAsessmentMainFormGroup?.get('functionalAsessmentFormGroupArray') as FormArray;
          this.dataSource.forEach((element, index) => {
            for (let i = 0; i < res.length; i++) {
              if (element.functionalMeasureCd === res[i].funcMeasureCd) {
                functionalAsessmentFormGroupArray.at(index).patchValue({
                  adjId: res[i].adjId,
                  id: res[i].id,
                  funcMeasureCd: res[i].funcMeasureCd,
                  aplAcuityScoreNum: res[i].aplAcuityScoreNum,
                  aplApprovalCd: res[i].aplApprovalCd,
                  aplComment: res[i].aplComment,
                  aplDenialCd: res[i].aplDenialCd,
                  auditAcuityScoreNum: res[i].auditAcuityScoreNum,
                  auditApprovalCd: res[i].auditApprovalCd,
                  auditComment: res[i].auditComment,
                  auditDenialCd: res[i].auditDenialCd,
                  rnActionCd: res[i].rnActionCd,
                  rnAcuityScoreNum: res[i].rnAcuityScoreNum,
                  rnApprovalCd: res[i].rnApprovalCd,
                  rnComment: res[i].rnComment,
                  rnDenialCd: res[i].rnDenialCd,
                  sbmttrAcuityCd: res[i].sbmttrAcuityCd,
                  sbmttrAcuityScoreNum: res[i].sbmttrAcuityScoreNum,
                  sbmttrCapNeedRspCd: res[i].sbmttrCapNeedRspCd,
                  sbmttrRspCd: res[i].sbmttrRspCd,
                  comments: res[i].comments,
                  adjudicatedAcuityScoreNum: res[i].rnAcuityScoreNum
                });
                this.updateValidators();
              }
            }
          });
          this.backup = _.cloneDeep(this.functionalAsessmentMainFormGroup.getRawValue());
        }
      },
      error => {
        this.toastr.error("Cannot Load Functional Assessment!")
      })
  }

  loadFunctionalAssessmentsFromPae(adjId): void {
    this.adjudicationDetailsService.loadFunctionalAssessmentFromPae(adjId).subscribe(
      res => {
        if (res.errorCode) {
          this.displaySpinner = false;
          return;
        } else {
          this.displayEditButton = true
          this.displaySpinner = false;
          const functionalAsessmentFormGroupArray = this.functionalAsessmentMainFormGroup?.get('functionalAsessmentFormGroupArray') as FormArray;
          (functionalAsessmentFormGroupArray?.get(String(0)) as FormGroup).get('sbmttrAcuityCd').patchValue(res[0].trnsfrWithoutHelpCd);
          (functionalAsessmentFormGroupArray?.get(String(1)) as FormGroup).get('sbmttrAcuityCd').patchValue(res[0].walkWithoutHelpCd);
          (functionalAsessmentFormGroupArray?.get(String(2)) as FormGroup).get('sbmttrAcuityCd').patchValue(res[0].wheelChairCapableCd);
          (functionalAsessmentFormGroupArray?.get(String(3)) as FormGroup).get('sbmttrAcuityCd').patchValue(res[0].eatWithoutHelpCd);
          (functionalAsessmentFormGroupArray?.get(String(4)) as FormGroup).get('sbmttrAcuityCd').patchValue(res[0].toiletWithoutHelpCd);
          (functionalAsessmentFormGroupArray?.get(String(5)) as FormGroup).get('sbmttrAcuityCd').patchValue(res[0].incontWithoutHelpCd);
          (functionalAsessmentFormGroupArray?.get(String(6)) as FormGroup).get('sbmttrAcuityCd').patchValue(res[0].cathOstWhithoutHelpCd);
          (functionalAsessmentFormGroupArray?.get(String(7)) as FormGroup).get('sbmttrAcuityCd').patchValue('');
          (functionalAsessmentFormGroupArray?.get(String(8)) as FormGroup).get('sbmttrAcuityCd').patchValue(res[0].orientationPrsnPlaceCd);
          (functionalAsessmentFormGroupArray?.get(String(9)) as FormGroup).get('sbmttrAcuityCd').patchValue(res[0].communicateWantsCd);
          (functionalAsessmentFormGroupArray?.get(String(10)) as FormGroup).get('sbmttrAcuityCd').patchValue(res[0].followInstructionsCd);
          (functionalAsessmentFormGroupArray?.get(String(11)) as FormGroup).get('sbmttrAcuityCd').patchValue(res[0].selfAdmMedicationCd);
          (functionalAsessmentFormGroupArray?.get(String(12)) as FormGroup).get('sbmttrAcuityCd').patchValue(res[0].behProblemCd);
          this.setAcuityScoreNum();
          this.updateValidators();
          this.backup = _.cloneDeep(this.functionalAsessmentMainFormGroup.getRawValue());
        }
      })
  }

  isFormValid(): boolean {
    const functionalAsessmentFormGroupArray = this.functionalAsessmentMainFormGroup?.get('functionalAsessmentFormGroupArray') as FormArray;
    const filteredControls = functionalAsessmentFormGroupArray.controls.filter(item => {
      return item.get('sbmttrAcuityCd').value != null && item.get('sbmttrAcuityCd').value !== '';
    });
    const isAnyInvalid = filteredControls.some(item => item.invalid);
    return !isAnyInvalid;
  }

  getTotalSubActScr(): number {
    let totalScore = 0;
    const faArray = this.functionalAsessmentMainFormGroup?.get('functionalAsessmentFormGroupArray') as FormArray;
    this.dataSource.forEach((element, index) => {
      const adjScr = faArray.get(String(index)).get('sbmttrAcuityCd')?.value;
      if (typeof adjScr === 'number') {
        totalScore = totalScore + adjScr;
      }
    });
    return totalScore;
  }

  getTotalScr(): number {
    let totalScore = 0;
    const faArray = this.functionalAsessmentMainFormGroup?.get('functionalAsessmentFormGroupArray') as FormArray;
    this.dataSource.forEach((element, index) => {
      const adjScr = faArray.get(String(index)).get('adjudicatedAcuityScoreNum')?.value;
      totalScore = totalScore + adjScr;
    });
    return totalScore;
  }

  getRnResponseForAP(): void {
    this.adjudicationDetailsService.getSearchDropdowns('FUNCTIONAL_ASSESSMENT').subscribe(
      res => {
        this.rnResponseForAP = res
      })
  }

  getRnResponseForP(index) :any {
    const faArray = this.functionalAsessmentMainFormGroup?.get('functionalAsessmentFormGroupArray') as FormArray;
    const controlValue = faArray.at(index).get('sbmttrAcuityScoreNum').value;
    const functionalCd = faArray.at(index).get('funcMeasureCd').value;
    let responseVal = this.rnResponseForAP.filter(item => {
      return this.getAcuityScore(functionalCd, item.code) <= controlValue;
    })
    return responseVal;
  }

  getRnResponseForD(): void {
    this.adjudicationDetailsService.getSearchDropdowns('FUNCTIONAL_DENIAL').subscribe(
      res => { this.rnResponseForD = res })
  }

  getAdjudicatedAcuityScore(index): any {
    return (this.functionalAsessmentMainFormGroup?.get('functionalAsessmentFormGroupArray') as FormArray)?.get(String(index))?.get('aplAcuityScoreNum')?.value;
  }

  onRnApprovalCdChange(index, event): void {
    const value = event.value;
    const functionalCd = (this.functionalAsessmentMainFormGroup.get('functionalAsessmentFormGroupArray') as FormArray).get(String(index))
      .get('funcMeasureCd').value;
    const score = this.getAcuityScore(functionalCd, value);
    (this.functionalAsessmentMainFormGroup.get('functionalAsessmentFormGroupArray') as FormArray).get(String(index))
      .get('rnAcuityScoreNum').patchValue(score);
    (this.functionalAsessmentMainFormGroup.get('functionalAsessmentFormGroupArray') as FormArray).get(String(index))
      .get('adjudicatedAcuityScoreNum').patchValue(score);
  }
  onAplApprovalCdChange(index, event): void {
    const value = event.value;
    const functionalCd = (this.functionalAsessmentMainFormGroup.get('functionalAsessmentFormGroupArray') as FormArray).get(String(index))
      .get('funcMeasureCd').value;
    const score = this.getAcuityScore(functionalCd, value);
    (this.functionalAsessmentMainFormGroup.get('functionalAsessmentFormGroupArray') as FormArray).get(String(index))
      .get('aplAcuityScoreNum').patchValue(score);
  }
  onAplAuditCdChange(index, event): void {
    const value = event.value;
    const functionalCd = (this.functionalAsessmentMainFormGroup.get('functionalAsessmentFormGroupArray') as FormArray).get(String(index))
      .get('funcMeasureCd').value;
    const score = this.getAcuityScore(functionalCd, value);
    (this.functionalAsessmentMainFormGroup.get('functionalAsessmentFormGroupArray') as FormArray).get(String(index))
      .get('auditAcuityScoreNum').patchValue(score);
  }

  setAcuityScoreNum(): void {
    const formArrayLength = (this.functionalAsessmentMainFormGroup.get('functionalAsessmentFormGroupArray') as FormArray).length;
    for (let i = 0; i < formArrayLength; i++) {
      const submitterCd = (this.functionalAsessmentMainFormGroup.get('functionalAsessmentFormGroupArray') as FormArray).get(String(i))
        .get('sbmttrAcuityCd').value;
      const functionalCd = (this.functionalAsessmentMainFormGroup.get('functionalAsessmentFormGroupArray') as FormArray).get(String(i))
        .get('funcMeasureCd').value;
      const submitterAcuityNum = this.getAcuityScore(functionalCd, submitterCd);
      (this.functionalAsessmentMainFormGroup.get('functionalAsessmentFormGroupArray') as FormArray).get(String(i))
        .get('sbmttrAcuityScoreNum').patchValue(submitterAcuityNum);
    }
  }

  updateValidators(): void {
    const formArrayLength = (this.functionalAsessmentMainFormGroup.get('functionalAsessmentFormGroupArray') as FormArray).length;
    for (let index = 0; index < formArrayLength; index++) {
      let rnActionCd = (this.functionalAsessmentMainFormGroup.get('functionalAsessmentFormGroupArray') as FormArray).get(String(index))
        .get('rnActionCd').value;
      if (rnActionCd === 'A') {
        this.setRnApprovalCdValidators(index);
        this.clearRnDenialCdValidators(index);
        this.selectedButton = 'A';
      } else if (rnActionCd === 'D') {
        this.setRnDenialCdValidators(index);
        this.clearRnApprovalCdValidators(index);
        this.selectedButton = 'D';
      } else if (rnActionCd === 'P') {
        this.setRnApprovalCdValidators(index);
        this.clearRnDenialCdValidators(index);
        this.selectedButton = 'P';
      } else {
        this.clearRnDenialCdValidators(index);
        this.clearRnApprovalCdValidators(index);
      }
    }
  }

  onSave(): void {
    this.displaySpinner = true;
    if (this.isFormValid()) {
      let payload = this.functionalAsessmentMainFormGroup.getRawValue().functionalAsessmentFormGroupArray;
      payload = payload.filter(element => { return element.sbmttrAcuityCd != null && element.sbmttrAcuityCd !== '' });
      this.adjudicationDetailsService.saveFunctionalAssessmentTable(payload).subscribe(
        res => {
          if (res.errorCode) {
            this.displaySpinner = false;
            return;
          } else {
            this.submitted = true;
            this.toastr.success("Saved Successfully");
            this.getFunctionalAssessment(this.adjId);
            this.setSavedFa();
          }
        },
        error => {
          this.toastr.error("Server Error");
          this.displaySpinner = false;
        }
      )
    } else {
      this.toastr.error("Please input all the values.");
    }

  }

  onCancel(): void {
    this.functionalAsessmentMainFormGroup.patchValue(this.backup);
    this.updateValidators();
  }

  getFunctionalAssessmentValue(index): any {
    const submitterCd = (this.functionalAsessmentMainFormGroup.get('functionalAsessmentFormGroupArray') as FormArray).get(String(index))
      .get('sbmttrAcuityCd').value;
    if (submitterCd !== '' && submitterCd !== null) {
      const element = this.rnResponseForAP?.filter(element => {
        return element.code === submitterCd
      });
      return element && element[0]?.value;
    } else {
      return '';
    }
  }

  setSavedFa() {
    this.savedFa.emit(true);
  }

  onEdit(): void {
    this.displayEditButton = false;
  }

  getAcuityScoresFromOPA(): any {
    const payload = {
      "outcomes": [
        "out_opaAcuityValuesServiceVersion",
        "out_acuityValue_transferAlways",
        "out_acuityValue_transferUsually",
        "out_acuityValue_transferUsuallyNot",
        "out_acuityValue_transferNever",
        "out_acuityValue_mobilityAlways",
        "out_acuityValue_mobilityUsually",
        "out_acuityValue_mobilityUsuallyNot",
        "out_acuityValue_mobilityNever",
        "out_acuityValue_eatingAlways",
        "out_acuityValue_eatingUsually",
        "out_acuityValue_eatingUsuallyNot",
        "out_acuityValue_eatingNever",
        "out_acuityValue_toiletingAlways",
        "out_acuityValue_toiletingUsually",
        "out_acuityValue_toiletingUsuallyNot",
        "out_acuityValue_toiletingNever",
        "out_acuityValue_incontinenceCareAlways",
        "out_acuityValue_incontinenceCareUsually",
        "out_acuityValue_incontinenceCareUsuallyNot",
        "out_acuityValue_incontinenceCareNever",
        "out_acuityValue_catheterOstomyCareAlways",
        "out_acuityValue_catheterOstomyCareUsually",
        "out_acuityValue_catheterOstomyCareUsuallyNot",
        "out_acuityValue_catheterOstomyCareNever",
        "out_acuityValue_orientationAlways",
        "out_acuityValue_orientationUsually",
        "out_acuityValue_orientationUsuallyNot",
        "out_acuityValue_orientationNever",
        "out_acuityValue_expressiveCommunicationAlways",
        "out_acuityValue_expressiveCommunicationUsually",
        "out_acuityValue_expressiveCommunicationUsuallyNot",
        "out_acuityValue_expressiveCommunicationNever",
        "out_acuityValue_receptiveCommunicationAlways",
        "out_acuityValue_receptiveCommunicationUsually",
        "out_acuityValue_receptiveCommunicationUsuallyNot",
        "out_acuityValue_receptiveCommunicationNever",
        "out_acuityValue_selfAdministrationOfMedicationAlways",
        "out_acuityValue_selfAdministrationOfMedicationUsually",
        "out_acuityValue_selfAdministrationOfMedicationUsuallyNot",
        "out_acuityValue_selfAdministrationOfMedicationNever",
        "out_acuityValue_behaviorAlways",
        "out_acuityValue_behaviorUsually",
        "out_acuityValue_behaviorUsuallyNot",
        "out_acuityValue_behaviorNever",
        "out_acuityValue_ssVentilator",
        "out_acuityValue_ssInfrequentTrachealSuctioning",
        "out_acuityValue_ssTotalParenteralNutrition",
        "out_acuityValue_ssComplexWoundCare",
        "out_acuityValue_ssWoundCareStage3or4Decubitus",
        "out_acuityValue_ssPeritonealDialysis",
        "out_acuityValue_ssTubeFeedingEnteral",
        "out_acuityValue_ssIntravenousFluidAdministration",
        "out_acuityValue_ssInjectionsSlidingScaleInsulin",
        "out_acuityValue_ssInjectionsOtherIvIm",
        "out_acuityValue_ssIsolationPrecautions",
        "out_acuityValue_ssPcaPump",
        "out_acuityValue_ssOccupationalTherapyByOt",
        "out_acuityValue_ssPhysicalTherapyByPt",
        "out_acuityValue_ssTeachingCatheterOstomyCare",
        "out_acuityValue_ssTeachingSelfInjection",
        "out_acuityValue_ercsChronicVentilator",
        "out_acuityValue_ercsTrachealSuctioning"
      ],
      "cases": [
        {
          "@id": 1,

          "rel_acuityValueData": [
            {
              "@id": 1,
              "in_acuityValue_dataRequest": "Yes"
            }
          ]
        }
      ]
    }
    this.adjudicationDetailsService.getAcuityScoresFromOPA(payload).subscribe(res => {
      this.acutityScoresFromOPA = res;
      // this.getFunctionalAssessment(this.adjId);
    })
  }

  getAcuityScore(functionalCd, value): number {
    var score: number;
    if (functionalCd === "TRAN") {
      switch (value) {
        case "AL": {
          score = 0;
          break;
        }
        case "US": {
          score = 1;
          break;
        }
        case "UN": {
          score = 3;
          break;
        }
        case "NE": {
          score = 4;
          break;
        }
        default:
          break;

      }
    }
    else if (functionalCd === "MOBL") {
      switch (value) {
        case "AL": {
          score = 0;
          break;
        }
        case "US": {
          score = 1;
          break;
        }
        case "UN": {
          score = 2;
          break;
        }
        case "NE": {
          score = 3;
          break;
        }
        default:
          break;

      }
    }
    else if (functionalCd === "MOBW") {
      switch (value) {
        case "AL": {
          score = 0;
          break;
        }
        case "US": {
          score = 1;
          break;
        }
        case "UN": {
          score = 2;
          break;
        }
        case "NE": {
          score = 3;
          break;
        }
        default:
          break;

      }
    }
    else if (functionalCd === "EATG") {
      switch (value) {
        case "AL": {
          score = 0;
          break;
        }
        case "US": {
          score = 1;
          break;
        }
        case "UN": {
          score = 3;
          break;
        }
        case "NE": {
          score = 4;
          break;
        }
        default:
          break;

      }
    }
    else if (functionalCd === "TLTG") {
      switch (value) {
        case "AL": {
          score = 0;
          break;
        }
        case "US": {
          score = 0;
          break;
        }
        case "UN": {
          score = 1;
          break;
        }
        case "NE": {
          score = 2;
          break;
        }
        default:
          break;

      }
    }
    else if (functionalCd === "TLTI") {
      switch (value) {
        case "AL": {
          score = 0;
          break;
        }
        case "US": {
          score = 1;
          break;
        }
        case "UN": {
          score = 2;
          break;
        }
        case "NE": {
          score = 3;
          break;
        }
        default:
          break;

      }
    }
    else if (functionalCd === "TLTC") {
      switch (value) {
        case "AL": {
          score = 0;
          break;
        }
        case "US": {
          score = 1;
          break;
        }
        case "UN": {
          score = 2;
          break;
        }
        case "NE": {
          score = 3;
          break;
        }
        default:
          break;

      }
    }
    else if (functionalCd === "VISN") {
      switch (value) {
        case "AL": {
          score = 0;
          break;
        }
        case "US": {
          score = 1;
          break;
        }
        case "UN": {
          score = 2;
          break;
        }
        case "NE": {
          score = 3;
          break;
        }
        default:
          break;

      }
    }
    else if (functionalCd === "ORNT") {
      switch (value) {
        case "AL": {
          score = 0;
          break;
        }
        case "US": {
          score = 1;
          break;
        }
        case "UN": {
          score = 3;
          break;
        }
        case "NE": {
          score = 4;
          break;
        }
        default:
          break;

      }
    }
    else if (functionalCd === "ECOM") {
      switch (value) {
        case "AL": {
          score = 0;
          break;
        }
        case "US": {
          score = 0;
          break;
        }
        case "UN": {
          score = 0;
          break;
        }
        case "NE": {
          score = 1;
          break;
        }
        default:
          break;

      }
    }
    else if (functionalCd === "RCOM") {
      switch (value) {
        case "AL": {
          score = 0;
          break;
        }
        case "US": {
          score = 0;
          break;
        }
        case "UN": {
          score = 0;
          break;
        }
        case "NE": {
          score = 1;
          break;
        }
        default:
          break;

      }
    }
    else if (functionalCd === "MEDC") {
      switch (value) {
        case "AL": {
          score = 0;
          break;
        }
        case "US": {
          score = 0;
          break;
        }
        case "UN": {
          score = 1;
          break;
        }
        case "NE": {
          score = 2;
          break;
        }
        default:
          break;

      }
    }
    else if (functionalCd === "BHVR") {
      switch (value) {
        case "AL": {
          score = 3;
          break;
        }
        case "US": {
          score = 2;
          break;
        }
        case "UN": {
          score = 1;
          break;
        }
        case "NE": {
          score = 0;
          break;
        }
        default:
          break;

      }
    }
    return score;

  }
}
