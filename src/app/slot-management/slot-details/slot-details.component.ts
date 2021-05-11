import { Component, OnInit, ViewChild, OnDestroy, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { animate, state, style, transition, trigger } from '@angular/animations';
import * as DocumentDetail from '../../../assets/data/appointment-search.json';
import { MatPaginator } from '@angular/material/paginator';
import { SlotManagmentService } from '../services/slot-managment.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import * as CryptoJS from 'crypto-js';
import * as Constants from '../../_shared/constants/application.constants';

@Component({
  selector: 'app-slot-details',
  templateUrl: './slot-details.component.html',
  styleUrls: ['./slot-details.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class SlotDetailsComponent implements OnInit, OnDestroy {
  @ViewChild('changeEl') el!: ElementRef;
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['refId', 'enrGroupCd', 'sltStatusCd', 'lastModifiedDt', 'firstName'];
  expandedElement;
  refId;
  prsnId;
  taskId;
  taskMasterId;
  sltDetailsId;
  slotEvaluationResult =[];
  showSpinner = false;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  data = [];
  subscriptions$: any[] = [];
  slotDetail;
  enrollmentGroup;
  slotAvailability;
  slotHistory;
  slotDetailForm: FormGroup;
  programType: any;
  refStatus: any;
  enrGroup: any;
  enableNext = true;
  yesNo: any;
  slotHistoryData = false;
  constructor(private router: Router, private _Activatedroute: ActivatedRoute,
              private slotManagmentService: SlotManagmentService,
              private fb: FormBuilder, private toastr: ToastrService) { }
  ngOnInit(): void {
    const searchParams = sessionStorage.getItem('ACTIVE_SESSION_DATA');
      if(searchParams) {
        const deCryptedSearchParams = CryptoJS.AES.decrypt(searchParams, Constants.APP_ENC_DECRYPT_KEY).toString(CryptoJS.enc.Utf8);
        const searchParamJson = JSON.parse(deCryptedSearchParams);
        this.refId = searchParamJson.recordId;
        this.prsnId = searchParamJson.taskResponseVO.personId;
        this.sltDetailsId ='';
        this.taskId = searchParamJson.taskId;
        this.taskMasterId = searchParamJson.taskMasterId;
      } else {
        this.refId = this.slotManagmentService.refid;
        this.prsnId = this.slotManagmentService.prsnId;
        this.sltDetailsId =this.slotManagmentService.slotDetailsId;
        this.taskId = this.slotManagmentService.taskId;
        this.taskMasterId = this.slotManagmentService.taskMasterId;
    }
    const slotEvaluationResultSubscriptions = this.slotManagmentService.getslotEvaluationValues().subscribe(response => {
      this.slotEvaluationResult = response.sort((a, b) => (a.value > b.value) ? 1 : -1);
    });
    this.subscriptions$.push(slotEvaluationResultSubscriptions);
    this.slotDetailForm = this.fb.group({
      enrGroup: [''],
      slotsEvaluationResult: [''],
    });

    const slotDetailsCodeValues$ = this.slotManagmentService.getslotDetailsCodeValues().subscribe(res => {
      this.refStatus = res[0];
      if (res[1].errorCode) {
        this.enrGroup = [];
      } else {
        this.enrGroup = res[1];
      }
      this.yesNo = this.slotManagmentService.yesNoList;

    });
    this.subscriptions$.push(slotDetailsCodeValues$);
    const slotDetails$ = this.slotManagmentService.getSlotDetails(this.refId, this.prsnId, this.sltDetailsId).subscribe(res => {
      this.slotDetail = res[0];
      if (res[1].errorCode) {
        this.enrollmentGroup = [];
      } else {
        this.enrollmentGroup = res[1];
        this.enrollmentGroup = this.enrollmentGroup.sort((a, b) => a.enrGroupCd.localeCompare(b.enrGroupCd));
      }
      if (res[2].errorCode) {
        this.slotAvailability = [];
      } else {
        this.slotAvailability = res[2].slotsAvailable;
      }



    });
    this.subscriptions$.push(slotDetails$);
    const slotDetailHistory$ = this.slotManagmentService.getSlotDetailHistory(this.refId, this.prsnId, this.sltDetailsId).subscribe(res => {

      if (res.errorCode) {
      } else {
        this.slotHistory = res;
        this.dataSource = new MatTableDataSource(this.slotHistory);
        this.slotHistoryData = true;
      }


    });
    this.subscriptions$.push(slotDetailHistory$);

    this.data = JSON.parse(JSON.stringify(DocumentDetail)).default;
    this.dataSource = new MatTableDataSource(this.data);
  }


  getSSNMask(ssn: string) {
    if (ssn) {
      const formstring = ssn.substr(0,3) + '-' + ssn.substr(3,2) + '-' + ssn.substr(5,4);
      return formstring;
    }
  }
  getNameByCode(code: string, entity: string) {
    if (entity === 'RPM' && code) {
      const refPM = this.slotManagmentService.refProgramsList.filter(item => item.code === code);
      return refPM.length > 0 ? refPM[0].value : code;
    }
    if (entity === 'IOC' && code) {
      const intakeOutcome = this.slotManagmentService.intakeOutcomeList.filter(item => item.code === code);
      //console.log('intakeOutcome', intakeOutcome)
      return intakeOutcome.length > 0 ? intakeOutcome[0].value : code;
    }
    if (entity === 'RS' && code) {
      const refStatus = this.refStatus.filter(item => item.code === code);
      return refStatus.length > 0 ? refStatus[0].value : code;
    }
    if (entity === 'SLTS' && code) {
      const slotStatus = this.slotManagmentService.slotStatusList.filter(item => item.code === code);
      return slotStatus.length > 0 ? slotStatus[0].value : code;
    }
    if (entity === 'YN' && code) {
      const result = this.yesNo.filter(item => item.code === code);
      return result.length > 0 ? result[0].value : code;
    }
  }
  slotEvalutaionResultChange(event: any) {
    if (event.value && event.value == 'POC' && this.taskId != null && this.taskId != undefined) {
      this.slotDetailForm.addControl('notes', this.fb.control(null, [Validators.required]));
    } else if (event.value && this.taskId === null) {
      this.slotDetailForm.addControl('notes', this.fb.control(null, [Validators.required]));
    } else {
      this.slotDetailForm.contains('notes') ? this.slotDetailForm.removeControl('notes') : null;
    }
  }
  ngAfterViewInit() {
    this.slotEvalutaionResultChange(this.el);
  }
  onSubmit() {
    this.enableNext = false;
    this.showSpinner = true;
    const noteValue = this.slotDetailForm.contains('notes') ? this.slotDetailForm.controls.notes.value : '';
    const payload = {
      id: this.sltDetailsId,
      enrGroup: this.slotDetailForm.controls.enrGroup.value,
      slotEval: this.slotDetailForm.controls.slotsEvaluationResult.value,
      ref: this.refId,
      prsnId: this.prsnId,
      updateReason: noteValue,
      taskId: this.taskId,
      taskMasterId:this.taskMasterId
    };
    const updateSlot$ = this.slotManagmentService.updateSlot(payload).
      subscribe(res => {
        this.showSpinner = false;
        if (res.errorCode) {
          this.toastr.error(res.errorCode[0].description);
        } else {
          this.toastr.success(res.successMsgDescription);
          this.router.navigate(['/ltss/slotManagement']);
        }
      });
    this.subscriptions$.push(updateSlot$);

  }
  ngOnDestroy() {
    if (this.subscriptions$ && this.subscriptions$.length > 0) {
      this.subscriptions$.forEach(subscription$ => subscription$.unsubscribe());
    }
  }
}
