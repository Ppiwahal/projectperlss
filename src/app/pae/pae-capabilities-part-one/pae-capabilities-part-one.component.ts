import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as customValidation from '../../_shared/constants/validation.constants';
import { CustomvalidationService } from '../../_shared/utility/customvalidation.service';
import { Router } from '@angular/router';
import { PaeService } from '../../core/services/pae/pae.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { LeavePagePopupComponent } from '../../leave-page-popup/leave-page-popup.component';
import { SavePopupComponent } from '../../../app/savePopup/savePopup.component';
import { PaeAssesmentCapabilitiesNeed } from 'src/app/_shared/model/PaeAssesmentCapabilitiesNeed';
import { PaeCommonService } from 'src/app/core/services/pae/pae-common/pae-common.service';
import { PaeFlowSeq } from 'src/app/_shared/utility/PaeFlowSeq';

@Component({
  selector: 'app-pae-capabilities-part-one',
  templateUrl: './pae-capabilities-part-one.component.html',
  styleUrls: ['./pae-capabilities-part-one.component.scss']
})
export class PaeCapabilitiesPartOneComponent implements OnInit {
  customValidation = customValidation;
  submitted = false;
  transfers = false;
  mobility = false;
  eating = false;
  toileting = false;
  bathing = false;
  myForm: FormGroup;
  paeId: any;
  reqPageId: string;
  nextPath: any;
  applicantName: any;
  pageId: string;
  constructor(
    private fb: FormBuilder,
    private customValidator: CustomvalidationService,
    private router: Router,
    private paeService: PaeService,
    private dialog: MatDialog,
    private paeCommonService: PaeCommonService
  ) { }

  getFormData() {
    return this.myForm.controls;
  }

  get f() {
    return this.myForm.controls;
  }
  ngOnInit() {
    this.paeId = this.paeCommonService.getPaeId();
    this.reqPageId = 'PPFAC',
    this.pageId = 'PPFAC';
    this.myForm = this.fb.group({
      bathingCd: ['', [Validators.required]],
      behDesc: [''],
      behDisorderSw: [''],
      eatingCd: ['', [Validators.required]],
      expressiveCommunicationCd: [''],
      medSelfAdminsterCd: [''],
      mobilityCd: ['', [Validators.required]],
      orientationCd: [''],
      receptiveCommunicationCd: [''],
      toiletingCd: ['', [Validators.required]],
      trnsfrCd: ['', [Validators.required]],
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

  onSubmit(showPopup?: boolean) {
    this.submitted = true;
    console.log(this.myForm.valid);
    if (this.myForm.valid) {
      this.savePaeCapabilitiesNeeds(showPopup);
      //this.router.navigate(['/ltss/pae/paeStart/capabilitiesPartOne']);
      //this.saveAndExit();
    }
  }


    savePaeCapabilitiesNeeds(showPopup?: boolean) {
    if (this.myForm.valid) {
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
        // this.router.navigate(['ltss/pae/paeStart/confirmation']);
        const nextPage = res.headers.get('next');
        console.log(nextPage);
        this.nextPath = PaeFlowSeq[nextPage];
        console.log(this.nextPath);
        if (showPopup){
            const dialogConfig = new MatDialogConfig();
            dialogConfig.data = { route: 'ltss/pae' };
           // dialogConfig.data = { route: 'ltss/pae' , nextRoute: '/ltss/pae/paeStart/' + this.nextPath };
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

  openLeavePagePopup() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = { route: '/ltss/pae/paeStart/functionalAssessment' };
    dialogConfig.panelClass = 'exp_popup';
    dialogConfig.width = '648px';
    dialogConfig.height = '360px';
    this.dialog.open(LeavePagePopupComponent, dialogConfig);

  }

  // openSavedPopup() {
  //   // if(this.myForm.valid) {
  //   //
  //   // }
  //   const dialogConfig = new MatDialogConfig();
  //   dialogConfig.data = { route: '/ltss/pae/paeStart/functionalAssessment' };
  //   dialogConfig.panelClass = 'exp_popup';
  //   dialogConfig.width = '648px';
  //   dialogConfig.height = '360px';

  //   this.dialog.open(SavePopupComponent, dialogConfig);
  // }


  saveAndExit() {
    this.onSubmit(true);
  }
}
