import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppealService } from '../../services/appeal.service';
import * as customValidation from '../../../_shared/constants/validation.constants';
import { ToastrService } from 'ngx-toastr';
import * as Constants from '../../../_shared/constants/application.constants';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-hearing-order-details',
  templateUrl: './hearing-order-details.component.html',
  styleUrls: ['./hearing-order-details.component.scss']
})
export class HearingOrderDetailsComponent implements OnInit, OnDestroy {

  @Input() appealId: any;
  @Input() reconsiderationRequestSubmitted: any;
  @Input() initialOrderAppealed: any;
  @Output() saveSuccess = new EventEmitter();
  @Output() isInitialOrderGranting = new EventEmitter();

  initialOrderForm: FormGroup;
  aplHrngDtlsId: any;
  orderGrantingService = [];
  isShowErrors = false;
  customValidation = customValidation;
  subscriptions$ = [];
  startDate = new Date();

  constructor(private formBuilder: FormBuilder, private toastrService: ToastrService, private appealService: AppealService) { }

  ngOnInit() {
    const timeTravelData = localStorage.getItem('TIME_TRAVEL_DATA');
    if(timeTravelData) {
      const timeTravelDataJson = JSON.parse(CryptoJS.AES.decrypt(timeTravelData, Constants.APP_ENC_DECRYPT_KEY).toString(CryptoJS.enc.Utf8));
      console.log("timeTravelDataJson ", timeTravelDataJson);
      if(timeTravelDataJson.timeTravelFlag && timeTravelDataJson.currentDate) {
        this.startDate = new Date(timeTravelDataJson.currentDate);
      }
    }
    this.iohHearingDecision();
    this.getHearingSummaryDescription();
    this.getHearingDetails();
    this.initialOrderForm = this.formBuilder.group({
      orderGrantingServices: ['', Validators.required],
      hearingDate: ['', Validators.required],
      judgeWritingOrder: ['', Validators.required],
      hearingSummary: [null],
      comments: [null]
    });
  }

  getHearingSummaryDescription() {
    const HearingSummarySUbscriptions = this.appealService.getHearingSummaryDescription(this.appealId).subscribe(response => {
      if (response && response.hrngSummary) {
        this.initialOrderForm.get('hearingSummary').setValue(response.hrngSummary);
        this.initialOrderForm.updateValueAndValidity();
      }
    });
    this.subscriptions$.push(HearingSummarySUbscriptions);
  }

  getHearingDetails() {
    const HearingDetailsSubscriptions$ = this.appealService.getHearingDetails(this.appealId).subscribe(response => {
      if (response && response.aplHrngDtlsId) {
        this.aplHrngDtlsId = response.aplHrngDtlsId;
      }
    });
    this.subscriptions$.push(HearingDetailsSubscriptions$);
  }

  iohHearingDecision() {
    const IOHHearingDecisionSubscriptions = this.appealService.getStaticDataValue('IOHEARING_DECISION').subscribe(response => {
      this.orderGrantingService = response;
    });
    this.subscriptions$.push(IOHHearingDecisionSubscriptions);
  }

  saveHearingOrderDetails() {
    if (this.initialOrderForm.valid) {
      if (this.reconsiderationRequestSubmitted || this.initialOrderAppealed) {
        const date = new Date(this.initialOrderForm.value.hearingDate);
        const zuluDate = date.toISOString();
        const payload = {
          addOrderDetailsVO: {
            aplId: this.appealId,
            comments: this.initialOrderForm.value.orderGrantingServices,
            hrngPrsnlCd: 'JD',
            hrngPrsnlName: this.initialOrderForm.value.judgeWritingOrder,
            id: this.aplHrngDtlsId,
            judgeOrderDt: zuluDate,
            orderTypeCd: this.initialOrderForm.value.orderGrantingServices
          },
          rcndrRqstBy: null,
          rcndrRqstCd: null,
          rcndrRqstSw: null,
          ioAplBy: null,
          ioAplSw: null
        };
        if (this.reconsiderationRequestSubmitted) {
          payload.rcndrRqstBy = this.reconsiderationRequestSubmitted.rcndrRqstBy;
          payload.rcndrRqstCd = this.reconsiderationRequestSubmitted.rcndrRqstCd;
          payload.rcndrRqstSw = this.reconsiderationRequestSubmitted.rcndrRqstSw;
          payload.ioAplBy = this.reconsiderationRequestSubmitted.ioAplBy;
          payload.ioAplSw = this.reconsiderationRequestSubmitted.ioAplSw;
        } else if (this.initialOrderAppealed) {
          payload.rcndrRqstBy = this.initialOrderAppealed.rcndrRqstBy;
          payload.rcndrRqstCd = this.initialOrderAppealed.rcndrRqstCd;
          payload.rcndrRqstSw = this.initialOrderAppealed.rcndrRqstSw;
          payload.ioAplBy = this.initialOrderAppealed.ioAplBy;
          payload.ioAplSw = this.initialOrderAppealed.ioAplSw;
        }
        const ReconsiderationsSubscriptions = this.appealService.reconsiderations(payload).subscribe(response => {
          this.saveSuccess.emit(true);
          this.toastrService.success(customValidation.B7);
        });
        this.subscriptions$.push(ReconsiderationsSubscriptions);
      } else {
        const date = new Date(this.initialOrderForm.value.hearingDate);
        const zuluDate = date.toISOString();
        const payload = {
          id: this.aplHrngDtlsId,
          aplId: this.appealId,
          comments: this.initialOrderForm.value.comments,
          hrngPrsnlCd: 'JD',
          hrngPrsnlName: this.initialOrderForm.value.judgeWritingOrder,
          judgeOrderDt: zuluDate,
          orderTypeCd: this.initialOrderForm.value.orderGrantingServices
        };
        const InitialOrderSubscriptions = this.appealService.initialorder(payload).subscribe(response => {
          if (payload.orderTypeCd === 'OG') {
            this.isInitialOrderGranting.emit(true);
          }
          this.saveSuccess.emit(true);
          this.toastrService.success(customValidation.B7);
        });
        this.subscriptions$.push(InitialOrderSubscriptions);
      }
    } else {
      this.isShowErrors = true;
      Object.keys(this.initialOrderForm.controls).forEach(field => {
        const control = this.initialOrderForm.get(field);
        control.markAsTouched({ onlySelf: true });
      });
    }
  }

  ngOnDestroy() {
    if (this.subscriptions$ && this.subscriptions$.length > 0) {
      this.subscriptions$.forEach(subscription$ => subscription$.unsubscribe());
    }
  }

}
