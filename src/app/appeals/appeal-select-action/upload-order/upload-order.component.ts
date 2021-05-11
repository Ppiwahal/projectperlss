import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { RightnavToggleService } from 'src/app/_shared/services/rightnav-toggle.service';
import { AppealService } from '../../services/appeal.service';
import * as customValidation from '../../../_shared/constants/validation.constants';

@Component({
  selector: 'app-upload-order',
  templateUrl: './upload-order.component.html',
  styleUrls: ['./upload-order.component.scss']
})
export class UploadOrderComponent implements OnInit, OnDestroy {

  @Input() searchElement: any;

  continuanceReason = [];
  subscriptions$ = [];
  isShowErrors = false;
  customValidation = customValidation;
  uploadOrderForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private appealService: AppealService,
              private toastrService: ToastrService,
              private rightnavToggleService: RightnavToggleService) { }

  ngOnInit() {
    this.uploadOrderForm = this.formBuilder.group({
      judgeWritingOrder: ['', Validators.required],
    });
  }

  cancel() {
    this.uploadOrderForm.reset();
  }

  uploadOrder() {
    if (this.uploadOrderForm.valid) {
      this.isShowErrors = false;
      const payload = {
        actionPerformedCd: 'UO',
        aplHrngDtlsId: 10,
        hrngPrsnlCd: 'JD',
        hrngPrsnlName: this.uploadOrderForm.value.judgeWritingOrder
      };
      const UploadOrderSubscriptions = this.appealService.uploadOrder(payload).subscribe(response => {
        if (response && response.successMessage) {
          this.toastrService.success(response.successMessage);
        } else {
          this.toastrService.error('Failed to Upload Order');
        }
      }, error => {
        this.toastrService.error('Failed to Upload Order');
      });
      this.subscriptions$.push(UploadOrderSubscriptions);
    } else {
      Object.keys(this.uploadOrderForm.controls).forEach(field => {
        const control = this.uploadOrderForm.get(field);
        control.markAsTouched({ onlySelf: true });
      });
      this.isShowErrors = true;
    }
  }

  openUploadRightNav() {
    this.rightnavToggleService.setAppealSelectUploadFlag(true);
  }

  ngOnDestroy() {
    if (this.subscriptions$ && this.subscriptions$.length > 0) {
      this.subscriptions$.forEach(subscription$ => subscription$.unsubscribe());
    }
  }

}
