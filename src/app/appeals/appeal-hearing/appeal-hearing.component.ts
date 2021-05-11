import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output } from '@angular/core';
import { AppealStepper } from 'src/app/_shared/utility/AppealFlowSeq';
import { AppealService } from '../services/appeal.service';

@Component({
  selector: 'app-appeal-hearing',
  templateUrl: './appeal-hearing.component.html',
  styleUrls: ['./appeal-hearing.component.scss']
})
export class AppealHearingComponent implements OnDestroy, OnChanges {

  @Input() appealId: any;
  @Input() appellantInfoStatus: any;
  @Input() isShowReconsiderations: any;
  @Output() backNextNavigationAppealHearing: EventEmitter<any> = new EventEmitter<any>();

  appellantInfo: any;
  nohDueDate: any;
  isAppellantInfo = false;
  isNextEnabled = false;
  isShowReconsideration = false;
  subscriptions$ = [];

  constructor(private appealService: AppealService) { }

  ngOnChanges() {
    if (this.appealId) {
      this.getAppellantDetails();
    }
    if (this.isShowReconsiderations) {
      this.isShowReconsideration = true;
    }
  }

  nohPastDueDateFunction(event) {
    this.nohDueDate = event;
  }

  getAppellantDetails() {
    const GetAppealDetailsSubscriptions = this.appealService.getAppealDetails(this.appealId).subscribe(response => {
      this.appellantInfo = response;
      this.isAppellantInfo = true;
    });
    this.subscriptions$.push(GetAppealDetailsSubscriptions);
  }

  enableSave(event) {
    this.isNextEnabled = true;
  }

  enableReconsiderations(event) {
    if (this.appellantInfo.aplTypCd !== 'PR') {
      this.isShowReconsideration = true;
    }
  }

  back() {
    const previousForm = 'APPEAL_REVIEW';
    const nextStepperData = { nextStepper: AppealStepper[previousForm] };
    this.backNextNavigationAppealHearing.emit(nextStepperData);
  }

  next() {
    const nextForm = 'APPEAL_RESOLUTION';
    const nextStepperData = { nextStepper: AppealStepper[nextForm] };
    this.backNextNavigationAppealHearing.emit(nextStepperData);
  }

  ngOnDestroy() {
    if (this.subscriptions$ && this.subscriptions$.length > 0) {
      this.subscriptions$.forEach(subscription$ => subscription$.unsubscribe());
    }
  }

}
