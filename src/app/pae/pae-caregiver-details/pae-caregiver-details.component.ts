import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { ComponentCanDeactivate } from 'src/app/core/helpers/pending-change.guard';
import { PaeCommonService } from 'src/app/core/services/pae/pae-common/pae-common.service';
import { PaeService } from 'src/app/core/services/pae/pae.service';
import { PaeCareGiverDeatils } from 'src/app/_shared/model/PaeCareGiverDetails';
import { CustomvalidationService } from 'src/app/_shared/utility/customvalidation.service';
import * as customValidation from '../../_shared/constants/validation.constants';

@Component({
  selector: 'app-pae-caregiver-details',
  templateUrl: './pae-caregiver-details.component.html',
  styleUrls: ['./pae-caregiver-details.component.scss']
})
export class PaeCaregiverDetailsComponent implements OnInit, ComponentCanDeactivate {
  submitted = false;
  customValidation = customValidation;
  myForm: FormGroup;
  reqPageId: string;
  paeId: any;
  event: any;
  transportCheckboxSelectedCount: any;
  transportSelected: boolean;
  transportNoneSelected: boolean;
  subscriptions$ = [];
  subscription1$: Subscription;
  receivedData: any;
  response: any;
  subscriptions: any;
  isSamePageNavigation: boolean;

  constructor(private fb: FormBuilder,
              private customValidator: CustomvalidationService,
              private paeService: PaeService,
              private paeCommonService: PaeCommonService,
              private router: Router) { }

  ngOnInit(): void {
    this.paeId = this.paeCommonService.paeId;
    this.myForm = this.fb.group({
      aplcntAmbSplcareSw: [''],
      addNoneAboveSw: [''],
      aplcntFreqAwkeMonitrCd: [''],
      caregiverIntervnCd: [''],
      hansonCaregvngSw: [''],
      homeBoundEduSw: [''],
      implBehvPlanSw: [''],
      moreChildDisSw: [''],
      moreParntHealthDisCd: [''],
      musculoContracDeformSw: [''],
      othrAdultCaregiverSw: [''],
      othrAdultDisSw: [''],
      othrCareNoneAboveSw: [''],
      othrChildLivHmeSw: [''],
      paeId: [''],
      parntAdultDisSw: [''],
      parntHealthDisSw: [''],
      reqLocMonSw: [''],
      reqPageId: [''],
      riskChokRespDisSw: [''],
      singleTwoPrntFmlyCd: ['']
    });
  }

  sendingYesorNo(input: boolean) {
    if (input === true) {
      return 'Y';
    } else if (input === false) {
      return 'N';
    }
    else {
      return null;
    }
  }

  onDeclineHealth(event) {
    if (event.checked) {
      this.transportCheckboxSelectedCount =
        this.transportCheckboxSelectedCount + 1;
    } else if (!event.checked) {
      this.transportCheckboxSelectedCount =
        this.transportCheckboxSelectedCount - 1;
    }
    if (this.transportCheckboxSelectedCount > 0) {
      this.transportSelected = true;
    } else {
      this.transportSelected = false;
    }
  }

  onNoneSelected(event) {
    if (event.checked) {
      this.transportNoneSelected = true;
    } else if (!event.checked) {
      this.transportNoneSelected = false;
    }
  }

  savePaeCareGiverDetails(eventType) {
    if (this.myForm.valid) {
      const paeCareGiverDeatils = new PaeCareGiverDeatils(
        this.sendingYesorNo(this.getFormData().addNoneAboveSw.value),
        this.getFormData().aplcntFreqAwkeMonitrCd.value,
        this.getFormData().caregiverIntervnCd.value,
        this.sendingYesorNo(this.getFormData().hansonCaregvngSw.value),
        this.sendingYesorNo(this.getFormData().homeBoundEduSw.value),
        this.sendingYesorNo(this.getFormData().implBehvPlanSw.value),
        this.sendingYesorNo(this.getFormData().moreChildDisSw.value),
        this.sendingYesorNo(this.getFormData().moreParntHealthDisCd.value),
        this.sendingYesorNo(this.getFormData().musculoContracDeformSw.value),
        this.getFormData().othrAdultCaregiverSw.value,
        this.sendingYesorNo(this.getFormData().othrAdultDisSw.value),
        this.sendingYesorNo(this.getFormData().othrCareNoneAboveSw.value),
        this.sendingYesorNo(this.getFormData().othrChildLivHmeSw.value),
        this.paeId,
        this.getFormData().parntAdultDisSw.value,
        this.getFormData().parntHealthDisSw.value,
        this.sendingYesorNo(this.getFormData().reqLocMonSw.value),
        this.reqPageId = 'PPAEPA',
        this.sendingYesorNo(this.getFormData().riskChokRespDisSw.value),
        this.getFormData().singleTwoPrntFmlyCd.value,
      );
      this.paeService.savePaeCareGiverDeatils(paeCareGiverDeatils).then((res) => {
        console.log('res', res);
        if (res.status === 200) {
          this.router.navigate(['/ltss/pae/paeStart/prioritizationSummary']);
        }
      });
    }
    this.getPrioritizationDetailsData();
  }

  getPrioritizationDetailsData() {
    this.paeService.getPaeCareGiverDeatils(this.paeCommonService.paeId).subscribe(response => {
      this.receivedData = response;
      console.log('hgfgdf response', response);
      // console.log('receivedData' + JSON.stringify(receivedData));
      this.myForm.patchValue(this.receivedData.body);
    });
  }


  next() {
    this.isSamePageNavigation =  true;
    this.event = 'Next';
    this.submitted = true;
    if (this.myForm.valid) {
      this.savePaeCareGiverDetails(this.event);
    }
  }

  getFormData() {
    return this.myForm.controls;
  }

  goBack() {
    this.isSamePageNavigation =  true;
   }
  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    console.log(this.myForm) 
   return this.isSamePageNavigation ? true : !this.myForm.dirty;
  }

  resetForm(){
    this.myForm.reset();
  }

}
