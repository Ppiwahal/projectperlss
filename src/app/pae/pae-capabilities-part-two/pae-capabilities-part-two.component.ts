import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatRadioChange, MatRadioButton } from '@angular/material/radio';
import * as customValidation from '../../_shared/constants/validation.constants';
import { Router } from '@angular/router';
import { PaeAssesmentCapabilitiesNeed } from 'src/app/_shared/model/PaeAssesmentCapabilitiesNeed';
import { PaeService } from 'src/app/core/services/pae/pae.service';
import { PaeCommonService } from 'src/app/core/services/pae/pae-common/pae-common.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CustomvalidationService } from 'src/app/_shared/utility/customvalidation.service';
import { PaeFlowSeq } from 'src/app/_shared/utility/PaeFlowSeq';
import { SavePopupComponent } from 'src/app/savePopup/savePopup.component';

@Component({
  selector: 'app-pae-capabilities-part-two',
  templateUrl: './pae-capabilities-part-two.component.html'
})
export class PaeCapabilitiesPartTwoComponent implements OnInit {
  paeCapabilitiesPartTwoForm: FormGroup;
  hasIssues = false;
  customValidation = customValidation;
  submitted = false;
  reqPageId: string;
  paeId: any;
  nextPath: any;
  applicantName: any;
  pageId: string;
  constructor(private fb: FormBuilder,
              private router: Router,
              private paeService: PaeService,
              private paeCommonService: PaeCommonService,
              private customValidator: CustomvalidationService,
              private dialog: MatDialog, ) { }

  ngOnInit(): void {
    this.paeId = this.paeCommonService.getPaeId();
    this.reqPageId = 'PPFAA',
    this.pageId = 'PPFAA';
    this.paeCapabilitiesPartTwoForm = this.fb.group({
      bathingCd: [''],
      behDesc: [''],
      behDisorderSw: [''],
      eatingCd: [''],
      expressiveCommunicationCd: [''],
      medSelfAdminsterCd: [''],
      mobilityCd: [''],
      orientationCd: [''],
      receptiveCommunicationCd: [''],
      toiletingCd: [''],
      trnsfrCd: [''],
      visionCd: [''],
      walkWithoutHelpCd: ['']
    });

    if (this.paeCommonService.getApplicantName() === null || this.paeCommonService.getApplicantName() === ''
    || this.paeCommonService.getApplicantName() === undefined){
      this.getApplicantName();
    } else {
      this.applicantName =  this.paeCommonService.getApplicantName();
    }
  }
  getApplicantName(){
    this.paeService.getPaeApplicantInformation(this.paeCommonService.getPaeId(), this.pageId).then((response) => {
      console.log('reponseforName' + JSON.stringify(response.body.firstName));
      this.applicantName =  response.body.firstName + ' ' + response.body.lastName;
      this.paeCommonService.setApplicantName(this.applicantName);
    });
  }

  get f() {
    return this.paeCapabilitiesPartTwoForm.controls;
  }

  getFormData() {
    return this.paeCapabilitiesPartTwoForm.controls;
  }

  onChange(mrChange: MatRadioChange) {
    console.log(mrChange.value);
    if (mrChange.value === 'N') {
      this.hasIssues = false;
    }
    else if (mrChange.value === 'Y') {
      this.hasIssues = true;
    }
  }

  next(showPopup?: boolean) {
    this.submitted = true;
    console.log(this.paeCapabilitiesPartTwoForm.valid);
    if (this.paeCapabilitiesPartTwoForm.valid) {
      this.savePaeCapabilitiesNeeds(showPopup);
    }
  }

  savePaeCapabilitiesNeeds(showPopup?: boolean) {
    if (this.paeCapabilitiesPartTwoForm.valid) {
      const paeAssesmentCapabilitiesNeed = new PaeAssesmentCapabilitiesNeed(
        this.getFormData().bathingCd.value,
        this.getFormData().behDesc.value,
        this.getFormData().behDisorderSw.value,
        this.getFormData().eatingCd.value,
        this.getFormData().expressiveCommunicationCd.value,
        this.getFormData().medSelfAdminsterCd.value,
        this.getFormData().mobilityCd.value,
        this.getFormData().orientationCd.value,
        this.paeId,
        this.getFormData().receptiveCommunicationCd.value,
        this.reqPageId,
        this.getFormData().toiletingCd.value,
        this.getFormData().trnsfrCd.value,
        this.getFormData().visionCd.value,
        this.getFormData().walkWithoutHelpCd.value,

      );
      this.paeService.savePaeAssesmentCapabilitiesNeed(paeAssesmentCapabilitiesNeed).then((res) => {
        console.log('res', res);
        const nextPage = res.headers.get('next');
        console.log(nextPage);
        this.nextPath = PaeFlowSeq[nextPage];
        console.log(this.nextPath);
        if (showPopup){
            const dialogConfig = new MatDialogConfig();
            dialogConfig.data = { route: 'ltss/pae' };
            dialogConfig.panelClass = 'exp_popup';
            dialogConfig.width = '648px';
            dialogConfig.height = '360px';
            this.dialog.open(SavePopupComponent, dialogConfig );
          }else {
          this.router.navigate(['/ltss/pae/paeStart/' + this.nextPath]);
          }
      });
    }
  }

  saveAndExit() {
    this.next(true);
  }

}
