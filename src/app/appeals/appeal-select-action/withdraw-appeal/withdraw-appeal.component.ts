import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { RightnavToggleService } from 'src/app/_shared/services/rightnav-toggle.service';
import { AppealService } from '../../services/appeal.service';
import * as customValidation from '../../../_shared/constants/validation.constants';

@Component({
  selector: 'app-withdraw-appeal',
  templateUrl: './withdraw-appeal.component.html',
  styleUrls: ['./withdraw-appeal.component.scss']
})
export class WithdrawAppealComponent implements OnInit, OnDestroy {

  @Input() searchElement: any;
  withdrawAppealForm: FormGroup;
  isShowErrors = false;
  customValidation = customValidation;
  continuanceReason = [];
  subscriptions$ = [];

  constructor(private formBuilder: FormBuilder,
              private appealService: AppealService,
              private toastrService: ToastrService,
              private rightnavToggleService: RightnavToggleService) { }

  ngOnInit() {
    this.withdrawAppealForm = this.formBuilder.group({
      withdrawalComments: ['', Validators.required]
    });
  }

  withdrawAppeal() {
    if (this.withdrawAppealForm.valid) {
      this.isShowErrors = false;
      const payload = {
        actionPerformedCd: 'WA',
        aplId: this.searchElement.aplId,
        withdrawalComments: this.withdrawAppealForm.value.withdrawalComments
      };
      const WithdrawAppealSubscriptions$ = this.appealService.withdrawAppeal(payload).subscribe(response => {
        if (response && response.successMessage) {
          this.toastrService.success(response.successMessage);
        } else {
          this.toastrService.error('Failed to Withdraw Appeal');
        }
      }, error => {
        this.toastrService.error('Failed to Withdraw Appeal');
      });
      this.subscriptions$.push(WithdrawAppealSubscriptions$);
    } else {
      Object.keys(this.withdrawAppealForm.controls).forEach(field => {
        const control = this.withdrawAppealForm.get(field);
        control.markAsTouched({ onlySelf: true });
      });
      this.isShowErrors = true;
    }
  }

  openUploadRightNav() {
    this.rightnavToggleService.setAppealSelectUploadFlag(true);
  }

  cancel() {
    this.withdrawAppealForm.reset();
  }

  ngOnDestroy() {
    if (this.subscriptions$ && this.subscriptions$.length > 0) {
      this.subscriptions$.forEach(subscription$ => subscription$.unsubscribe());
    }
  }

}
