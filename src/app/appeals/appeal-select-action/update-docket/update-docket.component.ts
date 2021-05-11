import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppealService } from '../../services/appeal.service';
import * as customValidation from '../../../_shared/constants/validation.constants';

@Component({
  selector: 'app-update-docket',
  templateUrl: './update-docket.component.html',
  styleUrls: ['./update-docket.component.scss']
})
export class UpdateDocketComponent implements OnInit, OnDestroy {

  @Input() searchElement: any;
  @Input() docketNum: any;

  updateDocketForm: FormGroup;
  customValidation = customValidation;
  isShowErrors = false;
  subscriptions$ = [];

  yesOrNo = [
    { code: 'Y', value: 'Yes', activateSW: 'Y' },
    { code: 'N', value: 'No', activateSW: 'Y' }];

  constructor(private appealService: AppealService,
              private formbuilder: FormBuilder,
              private toastrService: ToastrService) { }

  ngOnInit() {
    this.updateDocketForm = this.formbuilder.group({
      docketNumber: ['', [Validators.required]],
      include: ['', Validators.required]
    });
    if (this.docketNum) {
      this.updateDocketForm.get('docketNumber').setValue(this.docketNum);
    }
  }

  updateDocket() {
    if (this.updateDocketForm.valid) {
      this.isShowErrors = false;
      const payload = {
        aplHrngDtlsId: 10,
        docketNum: this.updateDocketForm.value.docketNumber,
        docketWrkbkSw: this.updateDocketForm.value.include,
        aplId: this.searchElement.aplId
      };
      const UpdateDocketSubscriptions$ = this.appealService.updateDocket(payload).subscribe(response => {
        if (response && response.successMessage) {
          this.toastrService.success(customValidation.B7);
        }
      });
      this.subscriptions$.push(UpdateDocketSubscriptions$);
    } else {
      Object.keys(this.updateDocketForm.controls).forEach(field => {
        const control = this.updateDocketForm.get(field);
        control.markAsTouched({ onlySelf: true });
      });
      this.isShowErrors = true;
    }
  }

  cancelDocket() {
    this.updateDocketForm.reset();
  }

  ngOnDestroy() {
    if (this.subscriptions$ && this.subscriptions$.length > 0) {
      this.subscriptions$.forEach(subscription$ => subscription$.unsubscribe());
    }
  }

}
