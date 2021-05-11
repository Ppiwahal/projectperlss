import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AppealService } from '../../services/appeal.service';

@Component({
  selector: 'app-reconsiderations-initial-order',
  templateUrl: './reconsiderations-initial-order.component.html',
  styleUrls: ['./reconsiderations-initial-order.component.scss']
})

export class ReconsiderationsInitialOrderComponent implements OnInit, OnDestroy {

  @Input() appealId: any;
  @Output() enableSave = new EventEmitter();

  reconsiderationsInitialOrderForm: FormGroup;
  orderGrantingService = [];
  yesOrNo = [{code:'Y', value:'Yes'}, {code:'N', value:'No'}];
  reqConsideration = [{code:'TennCare', value:'TennCare'}, {code:'Petitioner', value:'Petitioner'}];
  reconsPetitionReq = [];
  ShowReconsidRequest: boolean;
  ShowInitialOrderAppeal: boolean;
  showPFRdetails1: boolean;
  showPFRdetails2: boolean;
  reconsiderationRequestSubmitted: any;
  initialOrderAppealed: any;
  subscriptions$ = [];

  constructor(private formBuilder: FormBuilder, private appealService: AppealService) { }

  ngOnInit() {
    this.reconsiderationDecision();
    this.reconsiderationsInitialOrderForm = this.formBuilder.group({
      rcndrRqstCd: [''],
      ioAplSw: [''],
      rcndrRqstBy: [''],
      rcndrRqstSw: [''],
      ioAplBy: ['']
    });
  }

  reconsiderationDecision() {
    const ReconsiderationDecisionSubscriptions = this.appealService.getStaticDataValue('RECONSIDERATION_DECISION').subscribe(response => {
      this.reconsPetitionReq = response;
    });
    this.subscriptions$.push(ReconsiderationDecisionSubscriptions);
  }

  reconsiderationReqChnaged(value) {
    this.reconsiderationsInitialOrderForm.get('rcndrRqstBy').setValue('TennCare');
    if (value === 'Y') {
      this.ShowReconsidRequest = true;
    } else {
      this.ShowReconsidRequest = false;
    }
  }

  addPFRorderDetails1() {
    this.reconsiderationRequestSubmitted = this.reconsiderationsInitialOrderForm.value;
    this.showPFRdetails1 = true;
  }

  initialOrderAppealChanged(value) {
    this.reconsiderationsInitialOrderForm.get('ioAplBy').setValue('TennCare');
    if (value === 'Y') {
      this.ShowInitialOrderAppeal = true;
    } else {
      this.ShowInitialOrderAppeal = false;
    }
  }

  addPFRorderDetails2() {
    this.initialOrderAppealed = this.reconsiderationsInitialOrderForm.value;
    this.showPFRdetails2 = true;
  }

  saveSuccess(event) {
    this.enableSave.emit(true);
  }

  ngOnDestroy() {
    if (this.subscriptions$ && this.subscriptions$.length > 0) {
      this.subscriptions$.forEach(subscription$ => subscription$.unsubscribe());
    }
  }

}
