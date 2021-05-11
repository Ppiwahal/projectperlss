import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppealService } from '../../services/appeal.service';
import * as customValidation from '../../../_shared/constants/validation.constants';

@Component({
  selector: 'app-special-service',
  templateUrl: './special-service.component.html',
  styleUrls: ['./special-service.component.scss']
})
export class SpecialServiceComponent implements OnInit, OnDestroy {

  @Input() searchElement: any;

  addReviewForm: FormGroup;
  appealActions = [];
  yesOrNo = [];
  specilizedServices = [];
  languages = [];
  isShowErrors = false;
  isShowSpecialServices = false;
  isShowInterpreterServices = false;
  customValidation = customValidation;
  subscriptions$ = [];

  constructor(private formBuilder: FormBuilder, private appealService: AppealService, private toastrService: ToastrService) { }

  ngOnInit() {
    this.language();
    this.specialServicesList();
    this.yesNo();
    this.addReviewForm = this.formBuilder.group({
      isInterpretor: [null],
      interpretorLanguage: [null],
      serviceDetails: [null],
      specialServicesSelected: [null],
      isSpecialServices: [null]
    });
  }

  language() {
    const LanguageSubscriptions = this.appealService.getAppealDropdowns('LANGUAGE').subscribe(response => {
      this.languages = response;
    });
    this.subscriptions$.push(LanguageSubscriptions);
  }

  specialServicesList() {
    const SpecialServicesListSubscriptions = this.appealService.getAppealDropdowns('SPECIAL_SERVICES').subscribe(res => {
      this.specilizedServices = res;
    });
    this.subscriptions$.push(SpecialServicesListSubscriptions);
  }

  yesNo() {
    const YesNoSubscriptions = this.appealService.getAppealDropdowns('YES_NO').subscribe(res => {
      this.yesOrNo = res;
    });
    this.subscriptions$.push(YesNoSubscriptions);
  }

  onSpecialServicesSelected(event) {
    this.addReviewForm.get('specialServicesSelected').clearValidators();
    this.addReviewForm.get('serviceDetails').clearValidators();
    if (event === 'Y') {
      this.isShowSpecialServices = true;
      this.addReviewForm.get('specialServicesSelected').setValidators(Validators.required);
      this.addReviewForm.get('serviceDetails').setValidators(Validators.required);
    } else {
      this.isShowSpecialServices = false;
    }
    this.addReviewForm.get('serviceDetails').updateValueAndValidity();
    this.addReviewForm.get('specialServicesSelected').updateValueAndValidity();
  }

  onInterpretorServicesSelected(event) {
    this.addReviewForm.get('interpretorLanguage').clearValidators();
    if (event === 'Y') {
      this.addReviewForm.get('interpretorLanguage').setValidators(Validators.required);
      this.isShowInterpreterServices = true;
    } else {
      this.isShowInterpreterServices = false;
    }
    this.addReviewForm.get('interpretorLanguage').updateValueAndValidity();
  }

  specialServices() {
    if (this.addReviewForm.valid) {
      this.isShowErrors = false;
      let selectedSpecialServices;
      if (this.addReviewForm.value.specialServicesSelected && this.addReviewForm.value.specialServicesSelected.length > 0) {
        selectedSpecialServices = this.addReviewForm.value.specialServicesSelected.join(', ');
      }
      const payload = {
        actionPerformedCd: 'SS',
        interSw: this.addReviewForm.value.isInterpretor,
        interprtLang: this.addReviewForm.value.interpretorLanguage,
        otherSpecialSrvcs: this.addReviewForm.value.serviceDetails,
        specialSrvcs: selectedSpecialServices,
        specialSrvcsNeedSw: this.addReviewForm.value.isSpecialServices,
        aplId: this.searchElement.aplId,
        prsnId: this.searchElement.prsnId
      };
      const SpecialServicesSubscriptions = this.appealService.specialServices(payload).subscribe(response => {
        if (response && response.successMessage) {
          this.toastrService.success(customValidation.B7);
        }
      });
      this.subscriptions$.push(SpecialServicesSubscriptions);
    } else {
      Object.keys(this.addReviewForm.controls).forEach(field => {
        const control = this.addReviewForm.get(field);
        control.markAsTouched({ onlySelf: true });
      });
      this.isShowErrors = true;
    }
  }

  cancel() {
    this.addReviewForm.reset();
  }

  ngOnDestroy() {
    if (this.subscriptions$ && this.subscriptions$.length > 0) {
      this.subscriptions$.forEach(subscription$ => subscription$.unsubscribe());
    }
  }

}
