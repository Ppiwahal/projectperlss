import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AdjudicationDetailsService } from 'src/app/core/services/adjudication/adjudication-details.service';
import { PaeCommonService } from 'src/app/core/services/pae/pae-common/pae-common.service';
import * as customValidation from 'src/app/_shared/constants/validation.constants';

@Component({
  selector: 'app-pasrr-outcome',
  templateUrl: './pasrr-outcome.component.html',
  styleUrls: ['./pasrr-outcome.component.scss']
})
export class PasrrOutcomeComponent implements OnInit {
  @Output() savedPassr = new EventEmitter<boolean>();
  passrOutcomeForm: FormGroup;
  subscriptions$: any[] = [];
  customValidation = customValidation;
  minDate: Date;
  maxDate: Date;
  submitted: boolean;
  payorSrcCdList: any;
  lvl1DcsnCdList: any;
  lvl2DcsnCdList: any;
  isDisabled = true;
  isHidden = true;
  passrArray: any[] = [];
  adjId: any;

  constructor(private fb: FormBuilder,
    private adjudicationDetailsService: AdjudicationDetailsService,
    private toastr: ToastrService,
    private paeCommonService: PaeCommonService) { }

  ngOnInit(): void {
    this.adjId = this.paeCommonService.getAdjId();
    this.getpayorSrcCd();
    this.getlvl1DcsnCd();
    this.getlvl2DcsnCd();
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 120, 0, 1);
    this.maxDate = new Date();
    this.passrOutcomeForm = this.fb.group({
      reqPageId: [{ value: '', disabled: true }],
      adjId: [this.adjId],
      lvl1DcsnCd: [{ value: '', disabled: true }],
      lvl1DcsnDt: [{ value: '', disabled: true }],
      lvl1SubmitDt: [{ value: '', disabled: true }],
      lvl2DcsnCd: [{ value: '', disabled: true }],
      lvl2EffDt: [{ value: '', disabled: true }],
      lvl2EndDt: [{ value: '', disabled: true }],
      payorSrcCd: [{ value: '', disabled: true }]
    });
    this.getPassrOutcome(this.adjId);
  }

  onLvl1Cng(): void {
    if (this.getFormData().lvl1DcsnDt.value === null && this.getFormData().lvl1DcsnCd.value === null &&
      this.getFormData().lvl1SubmitDt.value === null && this.getFormData().payorSrcCd.value === null) {
      this.clearLvl1Validations();
      this.enableLevel2Fields();
    } else {
      this.setLvl1Validations();
      this.diableLevel2Fields();
      this.clearLvl2Validations();
    }
  }

  onLvl2Cng(): void {
    if (this.getFormData().lvl2EffDt.value === null && this.getFormData().lvl2EffDt.value === null &&
      this.getFormData().lvl2EndDt.value === null) {
      this.clearLvl2Validations();
      this.enableLevel1Fields();
    } else {
      this.setLvl1Validations();
      this.diableLevel1Fields();
      this.clearLvl1Validations();
    }
  }

  diableLevel1Fields(): void {
    this.passrOutcomeForm.controls["lvl1DcsnCd"].disable();
    this.passrOutcomeForm.controls["lvl1DcsnDt"].disable();
    this.passrOutcomeForm.controls["lvl1SubmitDt"].disable();
    this.passrOutcomeForm.controls["payorSrcCd"].disable();
  }
  diableLevel2Fields(): void {
    this.passrOutcomeForm.controls["lvl2DcsnCd"].disable();
    this.passrOutcomeForm.controls["lvl2EffDt"].disable();
    this.passrOutcomeForm.controls["lvl2EndDt"].disable();
  }
  enableLevel1Fields(): void {
    this.passrOutcomeForm.controls["lvl1DcsnCd"].enable();
    this.passrOutcomeForm.controls["lvl1DcsnDt"].enable();
    this.passrOutcomeForm.controls["lvl1SubmitDt"].enable();
    this.passrOutcomeForm.controls["payorSrcCd"].enable();
  }
  enableLevel2Fields(): void {
    this.passrOutcomeForm.controls["lvl2DcsnCd"].enable();
    this.passrOutcomeForm.controls["lvl2EffDt"].enable();
    this.passrOutcomeForm.controls["lvl2EndDt"].enable();
  }

  setLvl1Validations(): void {
    this.getFormData().lvl1DcsnDt.setValidators([Validators.required]),
      this.getFormData().lvl1DcsnCd.setValidators([Validators.required]),
      this.getFormData().lvl1SubmitDt.setValidators([Validators.required]),
      this.getFormData().payorSrcCd.setValidators([Validators.required]),
      this.getFormData().lvl1SubmitDt.updateValueAndValidity(),
      this.getFormData().lvl1DcsnDt.updateValueAndValidity(),
      this.getFormData().lvl1DcsnCd.updateValueAndValidity(),
      this.getFormData().payorSrcCd.updateValueAndValidity()
  }
  clearLvl1Validations(): void {
    this.getFormData().lvl1DcsnDt.clearValidators(),
      this.getFormData().lvl1DcsnCd.clearValidators(),
      this.getFormData().lvl1SubmitDt.clearValidators(),
      this.getFormData().payorSrcCd.clearValidators(),
      this.getFormData().lvl1SubmitDt.updateValueAndValidity(),
      this.getFormData().lvl1DcsnDt.updateValueAndValidity(),
      this.getFormData().lvl1DcsnCd.updateValueAndValidity(),
      this.getFormData().payorSrcCd.updateValueAndValidity()
  }
  setLvl2Validations(): void {
    this.getFormData().lvl2EffDt.setValidators([Validators.required]),
      this.getFormData().lvl2DcsnCd.setValidators([Validators.required]),
      this.getFormData().lvl2EndDt.setValidators([Validators.required]),
      this.getFormData().lvl2EffDt.updateValueAndValidity(),
      this.getFormData().lvl2DcsnCd.updateValueAndValidity(),
      this.getFormData().lvl2EndDt.updateValueAndValidity()
  }
  clearLvl2Validations(): void {
    this.getFormData().lvl2EffDt.clearValidators(),
      this.getFormData().lvl2DcsnCd.clearValidators(),
      this.getFormData().lvl2EndDt.clearValidators(),
      this.getFormData().lvl2EffDt.updateValueAndValidity(),
      this.getFormData().lvl2DcsnCd.updateValueAndValidity(),
      this.getFormData().lvl2EndDt.updateValueAndValidity()
  }

  getFormData(): any {
    return this.passrOutcomeForm.controls;
  }

  setSavedPassr() {
    this.savedPassr.emit(true);
  }

  onSave(): void {
    this.submitted = true;
    if (this.passrOutcomeForm.valid) {
      const payload = {
        "reqPageId": "",
        "adjId": this.getFormData().adjId.value,
        "lvl1DcsnCd": this.getFormData().lvl1DcsnCd.value,
        "lvl1DcsnDt": this.getFormData().lvl1DcsnDt.value,
        "lvl1SubmitDt": this.getFormData().lvl1SubmitDt.value,
        "lvl2DcsnCd": this.getFormData().lvl2DcsnCd.value,
        "lvl2EffDt": this.getFormData().lvl2EffDt.value,
        "lvl2EndDt": this.getFormData().lvl2EndDt.value,
        "payorSrcCd": this.getFormData().payorSrcCd.value,
      }
      const savePssrOutcomeSubscription$ = this.adjudicationDetailsService.savePassrOutcome(payload).subscribe(
        res => {
          this.toastr.success("Successfully Saved");
          this.getPassrOutcome(res.adjId);
          this.setSavedPassr();
        },
        error => this.toastr.error('Service Error')
      );
      this.subscriptions$.push(savePssrOutcomeSubscription$);
    } else {
      this.toastr.error("Please fill in the required value for PASSR Outcome!");
    }
    this.submitted = false;
  }

  getpayorSrcCd(): any {
    const constPayorSrcCdSub$ = this.adjudicationDetailsService.getSearchDropdowns('PAYOR_SOURCE').subscribe(res => {
      this.payorSrcCdList = res;
    });
    this.subscriptions$.push(constPayorSrcCdSub$);
  }

  getlvl1DcsnCd(): any {
    const getlvl1DcsnCd$ = this.adjudicationDetailsService.getSearchDropdowns('LEVEL_1_DETERMINATION').subscribe(res => {
      this.lvl1DcsnCdList = res;
    });
    this.subscriptions$.push(getlvl1DcsnCd$);
  }

  getlvl2DcsnCd(): any {
    const getlvl2DcsnCd$ = this.adjudicationDetailsService.getSearchDropdowns('LEVEL_2_PASRR').subscribe(res => {
      this.lvl2DcsnCdList = res;
    });
    this.subscriptions$.push(getlvl2DcsnCd$);
  }

  getPassrOutcome(adj: any): any {
    const passrOutcomeValues$ = this.adjudicationDetailsService.getPassrOutcome(adj).subscribe(
      res => {
        this.passrOutcomeForm.patchValue({
          lvl1DcsnCd: res.lvl1DcsnCd,
          lvl1DcsnDt: res.lvl1DcsnDt,
          lvl1SubmitDt: res.lvl1SubmitDt,
          lvl2DcsnCd: res.lvl2DcsnCd,
          lvl2EffDt: res.lvl2EffDt,
          lvl2EndDt: res.lvl2EndDt,
          payorSrcCd: res.payorSrcCd
        })
        this.passrArray.push(res);
      },
      error => this.toastr.error("Error Retriving PASSR Outcome Info!")
    )
  }

  onEdit(): void {
    this.isDisabled = false;
    this.isHidden = false;
    this.passrOutcomeForm.controls["lvl1DcsnCd"].enable();
    this.passrOutcomeForm.controls["lvl1DcsnDt"].enable();
    this.passrOutcomeForm.controls["lvl1SubmitDt"].enable();
    this.passrOutcomeForm.controls["lvl2DcsnCd"].enable();
    this.passrOutcomeForm.controls["lvl2EffDt"].enable();
    this.passrOutcomeForm.controls["lvl2EndDt"].enable();
    this.passrOutcomeForm.controls["payorSrcCd"].enable();
  }


  onDelete(): void {
    this.passrOutcomeForm.patchValue({
      lvl1DcsnCd: '',
      lvl1DcsnDt: '',
      lvl1SubmitDt: '',
      lvl2DcsnCd: '',
      lvl2EffDt: '',
      lvl2EndDt: '',
      payorSrcCd: ''
    });
    this.enableLevel1Fields();
    this.enableLevel2Fields();
  }

  onCancel(): void {
    if (this.passrArray.length >= 1) {
      this.passrOutcomeForm.patchValue({
        lvl1DcsnCd: this.passrArray[this.passrArray.length - 1].lvl1DcsnCd,
        lvl1DcsnDt: this.passrArray[this.passrArray.length - 1].lvl1DcsnDt,
        lvl1SubmitDt: this.passrArray[this.passrArray.length - 1].lvl1SubmitDt,
        lvl2DcsnCd: this.passrArray[this.passrArray.length - 1].lvl2DcsnCd,
        lvl2EffDt: this.passrArray[this.passrArray.length - 1].lvl2EffDt,
        lvl2EndDt: this.passrArray[this.passrArray.length - 1].lvl2EndDt,
        payorSrcCd: this.passrArray[this.passrArray.length - 1].payorSrcCd
      });
      this.enableLevel1Fields();
      this.enableLevel2Fields();
    }
  }

  onDestroy(): void {
    if (this.subscriptions$ && this.subscriptions$.length > 0) {
      this.subscriptions$.forEach(subscription$ => subscription$.unsubscribe());
    }
  }

}
