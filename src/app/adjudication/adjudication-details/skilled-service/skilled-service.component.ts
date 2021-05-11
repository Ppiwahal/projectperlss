import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';
import { ToastrService } from 'ngx-toastr';
import { AdjudicationDetailsService } from 'src/app/core/services/adjudication/adjudication-details.service';
import { PaeCommonService } from 'src/app/core/services/pae/pae-common/pae-common.service';
import * as _ from 'lodash';
import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { MatTable } from '@angular/material/table';

export interface PeriodicElement {
  ServiceName?: string;
  RequestedDays?: any;
  ApprovedDays?: any;
  AcuityValue?: any;
  RNReviewerResponse?: string;
  code?: string;
  value?: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { ServiceName: 'ERC Chronic Ventilator Service', RequestedDays: 32, ApprovedDays: 32, AcuityValue: 5, RNReviewerResponse: 'A' },
  { ServiceName: 'ERC Secretion Management Tracheal Suctioning', RequestedDays: '---', ApprovedDays: '---', AcuityValue: 0, RNReviewerResponse: 'D' }
];

@Component({
  selector: 'app-skilled-service',
  templateUrl: './skilled-service.component.html',
  styleUrls: ['./skilled-service.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class SkilledServiceComponent implements OnInit {
  @Output() savedSkilled = new EventEmitter<boolean>();
  @ViewChild('table') table: MatTable<any>;
  subscriptions$: any[] = [];
  campaignOne: FormGroup;
  campaignTwo: FormGroup;
  displayedColumns: string[] = ['ErcAction', 'ServiceName', 'RequestedDays', 'ApprovedDays', 'AcuityValue', 'RNReviewerResponse'];
  dataSource = ELEMENT_DATA;
  isTableExpanded = false;
  expandedElement;
  disabledApprovedCalendar: any;
  showTracheostomySection: boolean = false;
  showVentilatorSection: boolean = false;
  adjId: any;
  paeRespiratoryCareForAdjId: any;
  paeSkilledServiceDetails: any;
  skilledServicesMainFormGroup: FormGroup;
  chrncErc = false;
  trachealScnErc = false;
  paeId: any;
  showChronicVentilatorSection = false;
  showCVSection = false;
  backup: any;
  displayEditButton = true;
  selectedElement: any;
  comments: String;
  commentsForm: FormGroup;
  displaySpinner = false;
  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'indeterminate';
  value = 50;
  trsExists: boolean;
  ventExists: boolean;
  submitted = false;
  constructor(
    private adjudicationDetailsService: AdjudicationDetailsService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private paeCommonService: PaeCommonService,
    private changeDetectorRefs: ChangeDetectorRef) {
    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();

    this.campaignOne = new FormGroup({
      start: new FormControl(new Date(year, month, 13)),
      end: new FormControl(new Date(year, month, 16))
    });

    this.campaignTwo = new FormGroup({
      start: new FormControl(new Date(year, month, 15)),
      end: new FormControl(new Date(year, month, 19))
    });
  }

  ngOnInit(): void {
    this.paeId = this.paeCommonService.getPaeId();
    this.adjId = this.paeCommonService.getAdjId();
    this.getRequiredData();

    this.skilledServicesMainFormGroup = this.fb.group({
      skilledServicesFormGroupArray: this.fb.array([])
    });
    this.buildFormArray();
    this.commentsForm = this.fb.group({
      reqPageId: "2",
      id: '',
      adjId: '',
      comments: [{ value: '', disabled: true }],
      adjSkilledSrvcVO: ''
    })
  }

  buildFormArray(): void {
    (this.skilledServicesMainFormGroup.get('skilledServicesFormGroupArray') as FormArray).clear();
    this.dataSource.forEach(item => {
      (this.skilledServicesMainFormGroup.get('skilledServicesFormGroupArray') as FormArray).push(this.fb.group({
        reqPageId: "2",
        id: null,
        adjId: this.adjId,
        acuityScore: null,
        adjctorRspCd: [null, Validators.required],
        aprvdEffDt: null,
        aprvdEndDt: null,
        comments: null,
        rqstEffDt: null,
        rqstEndDt: null,
        srvcNameCd: item?.code,
        trachealScrnReqSw: null,
        requestedDays: null
      }));
    });
  }

  onChangService(mrChange: MatRadioChange, index) {
    (this.skilledServicesMainFormGroup.get('skilledServicesFormGroupArray') as FormArray).get(String(index))
      .get('trachealScrnReqSw').setValue(mrChange.value);
    if (mrChange.value === 'Y') {
      this.showVentilatorSection = true;
      let indexTrs = this.dataSource.findIndex((element, index) => {
        return element.code === 'TRS'
      });
      if (indexTrs && indexTrs >= 0) {
        (this.skilledServicesMainFormGroup.get('skilledServicesFormGroupArray') as FormArray).get(String(indexTrs))
          .get('adjctorRspCd').setValue('A');
      } else {
        this.dataSource = [
          ...this.dataSource,
          {
            code: 'TRS',
            value: 'Tracheostomy requiring suctioning'
          }
        ];
        (this.skilledServicesMainFormGroup.get('skilledServicesFormGroupArray') as FormArray).push(this.fb.group({
          reqPageId: "5",
          id: (this.skilledServicesMainFormGroup.get('skilledServicesFormGroupArray') as FormArray).get(String(index))
            .get('id')?.value,
          adjId: this.adjId,
          acuityScore: (this.skilledServicesMainFormGroup.get('skilledServicesFormGroupArray') as FormArray).get(String(index))
            .get('acuityScore')?.value,
          adjctorRspCd: (this.skilledServicesMainFormGroup.get('skilledServicesFormGroupArray') as FormArray).get(String(index))
            .get('adjctorRspCd')?.setValue('A'),
          aprvdEffDt: (this.skilledServicesMainFormGroup.get('skilledServicesFormGroupArray') as FormArray).get(String(index))
            .get('aprvdEffDt')?.value,
          aprvdEndDt: (this.skilledServicesMainFormGroup.get('skilledServicesFormGroupArray') as FormArray).get(String(index))
            .get('aprvdEndDt')?.value,
          comments: null,
          rqstEffDt: (this.skilledServicesMainFormGroup.get('skilledServicesFormGroupArray') as FormArray).get(String(index))
            .get('rqstEffDt')?.value,
          rqstEndDt: (this.skilledServicesMainFormGroup.get('skilledServicesFormGroupArray') as FormArray).get(String(index))
            .get('rqstEndDt')?.value,
          srvcNameCd: 'TRS',
          trachealScrnReqSw: (this.skilledServicesMainFormGroup.get('skilledServicesFormGroupArray') as FormArray).get(String(index))
            .get('trachealScrnReqSw')?.value,
          requestedDays: null
        }));
      }
    } else {
      this.showVentilatorSection = false;
      if (this.trsExists) {
      } else {
       const index =  this.dataSource.findIndex(element => element.code = 'TRS');
       this.dataSource.splice(index, 1)
       const arr = this.skilledServicesMainFormGroup.get('skilledServicesFormGroupArray') as FormArray
       arr.removeAt(index)
      }
    }
  }

  onVentilatorChangService(mrChange: MatRadioChange, index) {
    (this.skilledServicesMainFormGroup.get('skilledServicesFormGroupArray') as FormArray).get(String(index))
      .get('trachealScrnReqSw').setValue(mrChange.value);
    if (mrChange.value === 'Y') {
      this.showChronicVentilatorSection = true;
      let indexVNT = this.dataSource.findIndex((element, index) => {
        return element.code === 'VNT'
      });
      if (indexVNT && indexVNT >= 0) {
        (this.skilledServicesMainFormGroup.get('skilledServicesFormGroupArray') as FormArray).get(String(indexVNT))
          .get('adjctorRspCd').setValue('A');
      } else {
        this.dataSource = [
          ...this.dataSource,
          {
            code: 'VNT',
            value: 'Ventilator'
          }
        ];
        (this.skilledServicesMainFormGroup.get('skilledServicesFormGroupArray') as FormArray).push(this.fb.group({
          reqPageId: "5",
          id: (this.skilledServicesMainFormGroup.get('skilledServicesFormGroupArray') as FormArray).get(String(index))
            .get('id')?.value,
          adjId: this.adjId,
          acuityScore: (this.skilledServicesMainFormGroup.get('skilledServicesFormGroupArray') as FormArray).get(String(index))
            .get('acuityScore')?.value,
          adjctorRspCd: (this.skilledServicesMainFormGroup.get('skilledServicesFormGroupArray') as FormArray).get(String(index))
            .get('adjctorRspCd')?.setValue('A'),
          aprvdEffDt: (this.skilledServicesMainFormGroup.get('skilledServicesFormGroupArray') as FormArray).get(String(index))
            .get('aprvdEffDt')?.value,
          aprvdEndDt: (this.skilledServicesMainFormGroup.get('skilledServicesFormGroupArray') as FormArray).get(String(index))
            .get('aprvdEndDt')?.value,
          comments: null,
          rqstEffDt: (this.skilledServicesMainFormGroup.get('skilledServicesFormGroupArray') as FormArray).get(String(index))
            .get('rqstEffDt')?.value,
          rqstEndDt: (this.skilledServicesMainFormGroup.get('skilledServicesFormGroupArray') as FormArray).get(String(index))
            .get('rqstEndDt')?.value,
          srvcNameCd: 'VNT',
          trachealScrnReqSw: (this.skilledServicesMainFormGroup.get('skilledServicesFormGroupArray') as FormArray).get(String(index))
            .get('trachealScrnReqSw')?.value,
          requestedDays: null
        }));
      }
    } else {
      this.showChronicVentilatorSection = false;
      if (this.ventExists) {

      } else {
        const index =  this.dataSource.findIndex(element => element.code === 'VNT');
        this.dataSource.splice(index, 1)
        this.table.renderRows();
        const arr = this.skilledServicesMainFormGroup.get('skilledServicesFormGroupArray') as FormArray
        arr.removeAt(index)
      }
    }
  }

  openExpandedTable(value, element, index) {
    this.showCVSection = false;
    this.showTracheostomySection = false;
    this.selectedElement = element;
    const arrGrp = (this.skilledServicesMainFormGroup.get('skilledServicesFormGroupArray') as FormArray).get(String(index))
    arrGrp.get('adjctorRspCd').setValue(value);
    if (value == 'A') {
      this.expandedElement = element;
      this.disabledApprovedCalendar = 'A';
      arrGrp.get('aprvdEffDt').setValidators(Validators.required);
      arrGrp.get('aprvdEndDt').setValidators(Validators.required);
      arrGrp.get('aprvdEffDt').updateValueAndValidity();
      arrGrp.get('aprvdEndDt').updateValueAndValidity();
    } else {
      arrGrp.get('aprvdEffDt').clearValidators();
      arrGrp.get('aprvdEndDt').clearValidators();
      arrGrp.get('aprvdEffDt').updateValueAndValidity();
      arrGrp.get('aprvdEndDt').updateValueAndValidity();
      this.disabledApprovedCalendar = 'D';
      (this.skilledServicesMainFormGroup.get('skilledServicesFormGroupArray') as FormArray).get(String(index))
        .get('acuityScore').setValue(0);
      if (element.code === 'SMT' && !this.trsExists) {
        this.showTracheostomySection = true;
        this.expandedElement = element;
      } else if (element.code === 'CVS' && !this.ventExists) {
        this.showCVSection = true;
        this.expandedElement = element;
      }
    }
  }

  getRequiredData(): void {
    this.getSkilledServices();
  }

  getSkilledServices(): void {
    const getSkilledServices$ = this.adjudicationDetailsService.getSearchDropdowns('SKILLEDSERVICE_NAME_NONKB').subscribe(
      res => {
        this.dataSource = res;
        this.buildFormArray();
        this.getSkilledService();
      })
    this.subscriptions$.push(getSkilledServices$);
  }

  getSkilledService(): void {
    const getSkilledService$ = this.adjudicationDetailsService.getSkilledService(this.adjId).subscribe(
      res => {
        if (res.errorCode) {
          this.getPaeSkilledServiceDetails();
        } else {
          this.displaySpinner = false;
          this.dataSource = this.dataSource.filter(element => {
            return res.adjSkilledSrvcVO.some(item => element.code === item.srvcNameCd);
          });
          this.buildFormArray();
          if (this.dataSource.some(item => item.code === 'CVS')) {
            this.chrncErc = true;
          }
          if (this.dataSource.some(item => item.code === 'SMT')) {
            this.trachealScnErc = true;
          }
          const skilledServicesFormGroupArray = this.skilledServicesMainFormGroup.get('skilledServicesFormGroupArray') as FormArray
          this.dataSource.forEach((element, index) => {
            for (let i = 0; i < res.adjSkilledSrvcVO.length; i++) {
              if (element.code === res.adjSkilledSrvcVO[i].srvcNameCd) {
                skilledServicesFormGroupArray.at(index).patchValue({
                  reqPageId: "5",
                  id: res.adjSkilledSrvcVO[i].id,
                  adjId: res.adjId,
                  acuityScore: res.adjSkilledSrvcVO[i].acuityScore,
                  adjctorRspCd: res.adjSkilledSrvcVO[i].adjctorRspCd,
                  aprvdEffDt: res.adjSkilledSrvcVO[i].aprvdEffDt,
                  aprvdEndDt: res.adjSkilledSrvcVO[i].aprvdEndDt,
                  comments: res.adjSkilledSrvcVO[i].comments,
                  rqstEffDt: res.adjSkilledSrvcVO[i].rqstEffDt,
                  rqstEndDt: res.adjSkilledSrvcVO[i].rqstEndDt,
                  srvcNameCd: res.adjSkilledSrvcVO[i].srvcNameCd,
                  trachealScrnReqSw: res.adjSkilledSrvcVO[i].trachealScrnReqSw,
                  requestedDays: this.calculateDiff(res.adjSkilledSrvcVO[i].rqstEffDt, res.adjSkilledSrvcVO[i].rqstEndDt)
                });
              }
            }
          });
          this.checkServices();
          this.backup = _.cloneDeep(this.skilledServicesMainFormGroup.getRawValue());
          this.commentsForm.patchValue({
            id: res.id,
            adjId: res.adjId,
            comments: res.comments && res.comments
          });
          this.displayEditButton = true;
          this.commentsForm.get('comments').disable();
        }

      })
    this.subscriptions$.push(getSkilledService$);
  }

  getPaeSkilledServiceDetails(): void {
    const getPaeSkilledServiceDetails$ = this.adjudicationDetailsService.getPaeSkilledServiceDetails(this.adjId).subscribe(res => {
      if (res.errorCode) {
        this.dataSource = [];
        this.getpaeRespiratoryCareForAdjId();
      } else {
        this.paeSkilledServiceDetails = res;
        this.dataSource = this.dataSource.filter(element => {
          return this.paeSkilledServiceDetails.sectionTypeCd.some(item => element.code === item.sectionTypeCd || element.value === item.sectionTypeCd);
        });
        this.buildFormArray();
        const skilledServicesFormGroupArray = this.skilledServicesMainFormGroup.get('skilledServicesFormGroupArray') as FormArray
        this.dataSource.forEach((element, index) => {
          const paeSectionType = this.paeSkilledServiceDetails.sectionTypeCd.find(item => element.code === item.sectionTypeCd || element.value === item.sectionTypeCd);
          if (paeSectionType != null) {
            skilledServicesFormGroupArray.at(index).patchValue({
              reqPageId: "5",
              adjId: this.adjId,
              rqstEffDt: paeSectionType.rqstdStartDt,
              rqstEndDt: paeSectionType.rqstdEndDt,
              requestedDays: this.calculateDiff(paeSectionType.rqstdStartDt, paeSectionType.rqstdEndDt)
            });
          }
        });
        this.checkServices();
        this.backup = _.cloneDeep(this.skilledServicesMainFormGroup.getRawValue());
        this.getpaeRespiratoryCareForAdjId();
        this.commentsForm.patchValue({
          adjId: this.adjId,
        });
      }
    });
    this.subscriptions$.push(getPaeSkilledServiceDetails$);
  }

  checkServices(): void {
    let indexVNT = this.dataSource.findIndex((element, index) => {
      return element.code === 'VNT'
    });
    if (indexVNT && indexVNT >= 0) {
      this.ventExists = true;
    } else {
      this.ventExists = false;
    }
    let indexTrs = this.dataSource.findIndex((element, index) => {
      return element.code === 'TRS'
    });
    if (indexTrs && indexTrs >= 0) {
      this.trsExists = true;
    } else {
      this.trsExists = false;
    }
  }

    getpaeRespiratoryCareForAdjId(): void {
    const getpaeRespiratoryCareForAdjId$ = this.adjudicationDetailsService.paeRespiratoryCareForAdjId(this.adjId).subscribe(
      res => {
        if (res.errorCode) {
          this.dataSource = [];
          this.displaySpinner = false;
          return;
        } else {
          this.displaySpinner = false;
          this.paeRespiratoryCareForAdjId = res;
          if (res.chrncVentilatorSw === 'Y') {
            let cvs_exists = false;
            this.chrncErc = true;
            const skilledServicesFormGroupArray = this.skilledServicesMainFormGroup.get('skilledServicesFormGroupArray') as FormArray
            this.dataSource.forEach((element, index) => {
              if (element.code === 'CVS') {
                cvs_exists = true;
                skilledServicesFormGroupArray.at(index).patchValue({
                  rqstEffDt: res.chrncReqStartDt,
                  rqstEndDt: res.chrncReqEndDt,
                  requestedDays: this.calculateDiff(res.chrncReqStartDt, res.chrncReqEndDt)
                });
              }
            })
            if (!cvs_exists) {
              this.dataSource = [
                ...this.dataSource,
                {
                  code: 'CVS',
                  value: 'Chronic Ventilator Service'
                }
              ];
              skilledServicesFormGroupArray.push(this.fb.group({
                reqPageId: "5",
                id: null,
                adjId: this.adjId,
                acuityScore: null,
                adjctorRspCd: null,
                aprvdEffDt: null,
                aprvdEndDt: null,
                comments: null,
                rqstEffDt: res.chrncReqStartDt,
                rqstEndDt: res.chrncReqEndDt,
                srvcNameCd: 'CVS',
                trachealScrnReqSw: null,
                requestedDays: this.calculateDiff(res.trachealReqStartDt, res.trachealReqEndDt)
              }))
            }
          }
          if (res.trachealSuctionSw === 'Y') {
            let smt_exists = false;
            this.trachealScnErc = true;
            const skilledServicesFormGroupArray = this.skilledServicesMainFormGroup.get('skilledServicesFormGroupArray') as FormArray
            this.dataSource.forEach((element, index) => {
              if (element.code === 'SMT') {
                smt_exists = true;
                skilledServicesFormGroupArray.at(index).patchValue({
                  rqstEffDt: res.trachealReqStartDt,
                  rqstEndDt: res.trachealReqEndDt,
                  requestedDays: this.calculateDiff(res.trachealReqStartDt, res.trachealReqEndDt)
                });
              }
            })
            if (!smt_exists) {
              this.dataSource = [
                ...this.dataSource,
                {
                  code: 'SMT',
                  value: 'Secretion Management Tracheal Suctioning'
                }
              ];
              skilledServicesFormGroupArray.push(this.fb.group({
                reqPageId: "5",
                id: null,
                adjId: this.adjId,
                acuityScore: null,
                adjctorRspCd: null,
                aprvdEffDt: null,
                aprvdEndDt: null,
                comments: null,
                rqstEffDt: res.trachealReqStartDt,
                rqstEndDt: res.trachealReqEndDt,
                srvcNameCd: 'SMT',
                trachealScrnReqSw: null,
                requestedDays: this.calculateDiff(res.trachealReqStartDt, res.trachealReqEndDt)
              }))
            }
          }
          this.backup = _.cloneDeep(this.skilledServicesMainFormGroup.getRawValue());
          this.getAcuityScore();
        }
      },
      error => {
        this.displaySpinner = false;
      })
    this.subscriptions$.push(getpaeRespiratoryCareForAdjId$);
  }

  getAcuityScore(): void {
    const getAcuityScore$ = this.adjudicationDetailsService.getSkilledServiceAcuityScore(this.paeId).subscribe(
      res => {
        if (res.errorCode) {
          return;
        } else {
          const skilledServicesFormGroupArray = this.skilledServicesMainFormGroup.get('skilledServicesFormGroupArray') as FormArray
          this.dataSource.forEach((element, index) => {
            const acuityScores = res.paeSkilledSummaryScoreVOs.find(item => element.value === item.sectionTypeCd);
            if (acuityScores != null) {
              skilledServicesFormGroupArray.at(index).patchValue({
                acuityScore: acuityScores.sectionScore
              });
            }
          })
          this.backup = _.cloneDeep(this.skilledServicesMainFormGroup.getRawValue());
        }
        this.changeDetectorRefs.detectChanges();
      }
    )
  }

  setSaved(): void {
    this.savedSkilled.emit(true);
  }

  onSave(): void {
    this.submitted = true;
    this.displaySpinner = true;
    if (this.skilledServicesMainFormGroup.valid && this.commentsForm.valid) {
      const skilledFormVal = this.skilledServicesMainFormGroup.getRawValue().skilledServicesFormGroupArray;
      this.commentsForm.get('adjSkilledSrvcVO').setValue(skilledFormVal);
      const payload = this.commentsForm.value;
      this.adjudicationDetailsService.saveSkiledServices(payload).subscribe(
        res => {
          this.toastr.success("Saved Successfully");
          this.getRequiredData();
          this.setSaved();
        },
        error => {
          this.displaySpinner = false;
          this.toastr.error("Server Error");
        }
      )
    } else {
      this.toastr.error("Please input all the values.");
    }
  }

  getApprovedDays(index): any {
    let apprvdDays = null;
    const appStDt = (this.skilledServicesMainFormGroup.get('skilledServicesFormGroupArray') as FormArray).get(String(index))
      .get('aprvdEffDt').value;
    const appEndDt = (this.skilledServicesMainFormGroup.get('skilledServicesFormGroupArray') as FormArray).get(String(index))
      .get('aprvdEndDt').value;
    if (appStDt && appEndDt) {
      apprvdDays = this.calculateDiff(appStDt, appEndDt);
      return apprvdDays;
    }
    return;
  }

  getTotalScr(): any {
    let totScr = 0;
    const ssArray = (this.skilledServicesMainFormGroup.get('skilledServicesFormGroupArray') as FormArray)
    this.dataSource.forEach((element, index) => {
      const scr = ssArray.get(String(index)).get('acuityScore')?.value ? ssArray.get(String(index)).get('acuityScore')?.value : 0;
      totScr = totScr + scr;
    });
    return totScr;
  }

  calculateDiff(reqDt, endDt): any {
    if (reqDt && endDt) {
      reqDt = new Date(reqDt);
      endDt = new Date(endDt);
      return Math.floor((Date.UTC(endDt.getFullYear(), endDt.getMonth(), endDt.getDate()) - Date.UTC(reqDt.getFullYear(), reqDt.getMonth(), reqDt.getDate())) / (1000 * 60 * 60 * 24));
    }
  }

  onEdit(): void {
    this.displayEditButton = false;
    this.commentsForm.get('comments').enable();
  }

  onCancel(): void {
    this.skilledServicesMainFormGroup.patchValue(this.backup);
  }

  onDestroy(): void {
    if (this.subscriptions$ && this.subscriptions$.length > 0) {
      this.subscriptions$.forEach(subscription$ => subscription$.unsubscribe());
    }
  }
}
