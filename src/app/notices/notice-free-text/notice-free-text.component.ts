import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as customValidation from '../../_shared/constants/validation.constants';
import {CustomvalidationService} from '../../_shared/utility/customvalidation.service';
import {NoticesService} from '../services/notices.service';

const HELP_ATTACHMENT = {
  shAttachment: true,
  wform: false,
  flaAttachment: true,
  prpForm: false,
  erAttachment: false,
  tairForm: false,
  gpAttachment: false,
  taorForm: false,
  ppAttachment: false,
  kbpqAttachment: false
};


@Component({
  selector: 'app-notice-free-text',
  templateUrl: './notice-free-text.component.html',
  styleUrls: ['./notice-free-text.component.scss']
})
export class NoticeFreeTextComponent implements OnInit {

  @Input() showAllOptions:boolean;
  @Output() emitNoticeForm = new EventEmitter();
  @Input() submitStep3: boolean;
  freetextForm: FormGroup;
  customValidation = customValidation;

  constructor( private fb: FormBuilder, private customValidator: CustomvalidationService, private noticeService: NoticesService ) { }

  ngOnInit(): void {

    this.noticeService.submitStep3.subscribe(res => {
      if(res) {
        this.freetextForm.markAllAsTouched();
        this.isNoneSelected();
        if(this.freetextForm.valid) {
          const freeText = {freeFormText: true};
          this.emitNoticeForm.emit({...this.freetextForm.value, ...freeText});
        }
      }
    });

    if(this.showAllOptions) {
      this.freetextForm = this.fb.group({
        header: ['',[this.customValidator.specialCharacterValidator()]],
        body: ['', [Validators.required, this.customValidator.nameValidator()]],
          ...HELP_ATTACHMENT,
        hfaCode: false,
        wsucfhCode: false,
        duacCode: false,
        hcuCode: false,
        drthCode: false
      });
   }
    else {
      this.freetextForm = this.fb.group({
          ...HELP_ATTACHMENT
      });
     }
  }

  isNoneSelected() {
    const HELP_ATTACHMENT_KEYS = Object.keys(HELP_ATTACHMENT);
    HELP_ATTACHMENT_KEYS.forEach(key => {
      if(this.freetextForm.controls[key].value) {
      }
    });
  }

  get f() { return this.freetextForm.controls; }

}
