import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppealService } from '../services/appeal.service';
import * as customValidation from '../../_shared/constants/validation.constants';

@Component({
  selector: 'app-appeal-select-action',
  templateUrl: './appeal-select-action.component.html',
  styleUrls: ['./appeal-select-action.component.scss']
})
export class AppealSelectActionComponent implements OnInit, OnDestroy {

  @Input() searchElement: any;
  @Input() appellantInfoStatus: any;
  @Output() navigateToStepper = new EventEmitter<string>();
  @Output() showReconsiderations = new EventEmitter();

  addHearingSummaryForm: FormGroup;
  code = '';
  appellantInfo: any;
  appealActions = [
    { code: 'A', value: 'Provide Requested Documents' },
    { code: 'B', value: 'Add / Review Appellant Special Services' },
    { code: 'C', value: 'Update Docket Number' },
    { code: 'D', value: 'Reschedule Hearing' },
    { code: 'E', value: 'Upload Order' },
    { code: 'F', value: 'Withdraw Appeal' },
    { code: 'G', value: 'Hearing Took Place-Add Hearing Summary' },
    { code: 'H', value: 'Upload PASRR Correction Letter' },
    { code: 'I', value: 'Add Documents- Post Notice of Hearing' },
    { code: 'J', value: 'Reopen Appeal' },
    { code: 'K', value: 'Revise Appeal' }];
  yesOrNo = [
    { code: 'Y', value: 'Yes', activateSW: 'Y' },
    { code: 'N', value: 'No', activateSW: 'Y' }];
  dummyForRadioButtons = ['Yes', 'No'];
  continuanceReason = [];
  requestSummary: any;
  documentType: any;
  otherDepartmentNameDetails: any;
  whoIsFilingAppeal: any;
  appealFilingMethod: any;
  docketNum: any;
  isShowErrors = false;
  customValidation = customValidation;
  subscriptions$ = [];

  constructor(private appealService: AppealService, private formBuilder: FormBuilder, private toastrService: ToastrService) { }

  ngOnInit() {
    this.addHearingSummaryForm = this.formBuilder.group({
      hearingSummary: ['', Validators.required],
    });
    if (this.searchElement && this.searchElement.aplId) {
      this.getAppealActionRequestSummary(this.searchElement.aplId);
      this.getAppellantDetails(this.searchElement.aplId);
    }
    this.documentCategory();
    this.otherDepartment();
    this.personFilingApl();
    this.apFilingMethod();
  }

  cancelHearingSummary() {
    this.addHearingSummaryForm.reset();
  }

  getAppellantDetails(aplId) {
    this.appealService.getAppealDetails(aplId).subscribe(res => {
      this.appellantInfo = res;
    });
  }

  hearingSummary() {
    if (this.addHearingSummaryForm.valid) {
      this.isShowErrors = false;
      const payload = {
        actionPerformedCd: 'AH',
        aplId: this.searchElement.aplId,
        hrngSummary: this.addHearingSummaryForm.value.hearingSummary
      };
      const HearingSummaruSubscriptions = this.appealService.hearingSummary(payload).subscribe(response => {
        if (response && response.successMessage) {
          this.toastrService.success(customValidation.B7);
        }
      });
      this.subscriptions$.push(HearingSummaruSubscriptions);
    } else {
      Object.keys(this.addHearingSummaryForm.controls).forEach(field => {
        const control = this.addHearingSummaryForm.get(field);
        control.markAsTouched({ onlySelf: true });
      });
      this.isShowErrors = true;
    }
  }

  navigateToOnsiteAssesment() {
    const routeToNavigate = 'Onsite Assessment';
    this.navigateToStepper.emit(routeToNavigate);
  }

  navigateToAppealantDetails() {
    const routeToNavigate = 'Appealant Details';
    this.navigateToStepper.emit(routeToNavigate);
  }

  documentCategory() {
    const DocumentCategorySubscriptions$ = this.appealService.getAppealDropdowns('DOCUMENT_CATEGORY').subscribe(res => {
      this.documentType = res.sort((a, b) => {
        return a.value < b.value ? -1 : 1;
      });
    });
    this.subscriptions$.push(DocumentCategorySubscriptions$);
  }

  otherDepartment() {
    const OtherDepartmentSubscriptions$ = this.appealService.getAppealDropdowns('OTHER_DEPARTMENT').subscribe(res => {
      this.otherDepartmentNameDetails = res;
    });
    this.subscriptions$.push(OtherDepartmentSubscriptions$);
  }

  personFilingApl() {
    const PersonFilingAplSubscriptions$ = this.appealService.getAppealDropdowns('PERSON_FILINGAPL').subscribe(res => {
      this.whoIsFilingAppeal = res;
    });
    this.subscriptions$.push(PersonFilingAplSubscriptions$);
  }

  apFilingMethod() {
    const ApFilingMethodSubscriptions$ = this.appealService.getAppealDropdowns('APFILING_METHOD').subscribe(res => {
      this.appealFilingMethod = res;
    });
    this.subscriptions$.push(ApFilingMethodSubscriptions$);
  }

  getAppealActionRequestSummary(aplId) {
    const AppealActionRequestSummarySubscriptions$ = this.appealService.getAppealActionRequestSummary(aplId)
      .subscribe(res => {
        this.requestSummary = res;
      });
    this.subscriptions$.push(AppealActionRequestSummarySubscriptions$);
  }

  onAppealActionChange(value) {
    this.appealActions.forEach(data => {
      if (value === data.code) {
        if (value === 'C') {
          this.docketDetails(value);
        } else {
          this.code = value;
        }
      }
    });
  }

  docketDetails(value) {
    const DocketDetailsSubscriptions = this.appealService.docketDetails(this.searchElement.aplId).subscribe(response => {
      this.docketNum = response.docketNum;
      this.code = value;
    }, error => {
      this.code = value;
    });
    this.subscriptions$.push(DocketDetailsSubscriptions);
  }

  reopenAppeal() {
    if (this.searchElement && this.searchElement.aplId) {
      const payload = {
        actionPerformedCd: 'RO',
        aplId: this.searchElement.aplId
      };
      const ReopenAppealSubscriptions$ = this.appealService.reopenAppeal(payload).subscribe(response => {
        if (response && response.successMessage) {
          this.showReconsiderations.emit(true);
          this.toastrService.success(customValidation.B7);
        }
      });
      this.subscriptions$.push(ReopenAppealSubscriptions$);
    }
  }

  ngOnDestroy() {
    if (this.subscriptions$ && this.subscriptions$.length > 0) {
      this.subscriptions$.forEach(subscription$ => subscription$.unsubscribe());
    }
  }

}
