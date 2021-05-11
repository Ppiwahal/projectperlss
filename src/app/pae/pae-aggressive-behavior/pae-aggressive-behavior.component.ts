
import { Component, HostListener, OnInit, ViewEncapsulation } from '@angular/core';
import * as customValidation from '../../_shared/constants/validation.constants';
import { CustomvalidationService } from '../../_shared/utility/customvalidation.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { PaeSexuallyAggressiveBehavior } from '../../_shared/model/PaeSexuallyAggressiveBehavior'
import { PaePhysicallyAggressiveBehaviorRequest } from '../../_shared/model/PaePhysicallyAggressiveBehavior'
import { PaeService } from '../../core/services/pae/pae.service';
import { SavePopupComponent } from 'src/app/savePopup/savePopup.component';
import { ComponentCanDeactivate } from 'src/app/core/helpers/pending-change.guard';
import { Observable } from 'rxjs';
import { PaeCommonService } from 'src/app/core/services/pae/pae-common/pae-common.service';

@Component({
  selector: 'app-pae-aggressive-behavior',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './pae-aggressive-behavior.component.html',
  styleUrls: ['./pae-aggressive-behavior.component.scss']
})
export class PaeAggressiveBehaviorComponent implements OnInit, ComponentCanDeactivate {
  paeSexuallyAggressiveBehaviorFormGroup: FormGroup;
  paePhysicallyAggressiveBehaviorFormGroup: FormGroup;
  customValidation = customValidation;
  submitted = false;
  pageId: string;
  paeId: string;
  // dataSource : any;
  isSamePageNavigation: boolean;
  applicantName: any;
  isSexuallyAggressiveSaved = false;
  isPhysicallyAggressiveSaved = false;
  physicallyAggressiveEditMode = false;
  sexuallyAggressiveEditMode = false;
  physicallyAggressiveTypeCd = "PHAB";
  sexuallyAggressiveTypeCd = "SXAB";
  summaryDetails;

  constructor(private fb: FormBuilder,
    private customValidator: CustomvalidationService,
    private paeService: PaeService,
    private paeCommonService: PaeCommonService,
    private dialog: MatDialog,
    // private committeeReviewFormService: committeeReviewFormService,
    public dialogRef: MatDialog) { }

  ngOnInit(): void {
    this.pageId = 'PPBPA';
    this.paeId = this.paeCommonService.getPaeId();
    // this.getpaeSexuallyAggressiveBehavior(); 
    this.paeSexuallyAggressiveBehaviorFormGroup = this.fb.group({
      childAggressiveBehavior: ['', [Validators.required]],
      armReachIntervention: ['', [Validators.required]],
      crisisIntervention: ['', [Validators.required]],
      supportNeedsBehavior: ['', [Validators.required]]
    });
    this.paePhysicallyAggressiveBehaviorFormGroup = this.fb.group({
      childAggressiveBehavior: ['', [Validators.required]],
      armReachIntervention: ['', [Validators.required]],
      crisisIntervention: ['', [Validators.required]],
      supportNeedsBehavior: ['', [Validators.required]]
    })
    if (this.paeCommonService.getApplicantName() === null || this.paeCommonService.getApplicantName() === '' || this.paeCommonService.getApplicantName() === undefined) {
      this.getApplicantName();
    } else {
      this.applicantName = this.paeCommonService.getApplicantName();
    }
    this.getBehaviorSummaryData()
  }

  getBehaviorSummaryData() {
    if (this.paeCommonService.getPaeId()) {
      this.paeService.getAggresiveBehaviorDetails(this.paeCommonService.getPaeId()).subscribe(res => {
        if (!res.errorCode) {
          this.summaryDetails = res;
          if (res) {
            this.patchValue(res);
          }
        }
      })
    }
  }

  patchValue(data, typeCode = "") {
    if (typeCode) {
      data = data.filter(res => res.typeCd === typeCode)
    }
    data.forEach(element => {
      if (element.id && element.typeCd === this.physicallyAggressiveTypeCd) {
        this.isPhysicallyAggressiveSaved = true;
        this.paePhysicallyAggressiveBehaviorFormGroup.patchValue({
          childAggressiveBehavior: element.agrBehSw,
          armReachIntervention: element.agrBehArmReachCd,
          crisisIntervention: element.agrBehCrsisInterCd,
          supportNeedsBehavior: element.agrBehDurationSw
        })
      } else if (element.id && element.typeCd === this.sexuallyAggressiveTypeCd) {
        this.isSexuallyAggressiveSaved = true;
        this.paeSexuallyAggressiveBehaviorFormGroup.patchValue({
          childAggressiveBehavior: element.agrBehSw,
          armReachIntervention: element.agrBehArmReachCd,
          crisisIntervention: element.agrBehCrsisInterCd,
          supportNeedsBehavior: element.agrBehDurationSw
        })
      }
    });
  }

  getApplicantName() {
    this.paeService.getPaeApplicantInformation(this.paeCommonService.getPaeId(), this.pageId).then((response) => {
      console.log("reponseforName" + JSON.stringify(response.body.firstName));
      this.applicantName = response.body.firstName + " " + response.body.lastName;
      this.paeCommonService.setApplicantName(this.applicantName);
    });
  }

  getFormData(accordion: number) {
    return accordion === 1 ? this.paePhysicallyAggressiveBehaviorFormGroup.controls : this.paeSexuallyAggressiveBehaviorFormGroup.controls;
  }
  next() {
    this.paeService.navigateToChildNextPage(this.pageId)
  }
  back() {
    this.paeService.navigateToChildPreviousPage(this.pageId)
  }

  saveAndExit() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = { route: 'ltss/pae' };
    dialogConfig.panelClass = 'exp_popup';
    dialogConfig.width = '648px';
    dialogConfig.height = '360px';
    this.dialog.open(SavePopupComponent, dialogConfig);
  }

  savePhysicallyAggressiveBehaviorInfo() {
    this.isSamePageNavigation = true;
    this.submitted = true;
    if (this.paePhysicallyAggressiveBehaviorFormGroup.valid) {
      this.submitted = false;
      //save service call
      const formValue = this.paePhysicallyAggressiveBehaviorFormGroup.value;
      const request: PaePhysicallyAggressiveBehaviorRequest = {
        paeId: this.paeId,
        id: "",
        typeCd: this.physicallyAggressiveTypeCd,
        agrBehArmReachCd: formValue.armReachIntervention,
        agrBehCrsisInterCd: formValue.crisisIntervention,
        agrBehDurationSw: formValue.supportNeedsBehavior,
        agrBehSw: formValue.childAggressiveBehavior,
        reqPageId: this.pageId
      }
      this.paeService.saveAggressiveBehavior(request).then(response => {
        this.isPhysicallyAggressiveSaved = response.body.id && response.body.typeCd === this.physicallyAggressiveTypeCd;
        this.physicallyAggressiveEditMode = false;
        this.submitted = false;
        this.getBehaviorSummaryData();
        console.log("savePhysicallyAggressiveBehavior response : " + JSON.stringify(response));
      
      });
    }
  }

  saveSexuallyAggressiveBehaviorInfo(showPopup?: boolean) {
    this.isSamePageNavigation = true;
    // this.markFormGroupTouched(this.paeFormGroup);
    this.submitted = true;
    try {
      if (this.paeSexuallyAggressiveBehaviorFormGroup.valid && this.submitted) {

        const formValue = this.paeSexuallyAggressiveBehaviorFormGroup.value;
        const request: PaePhysicallyAggressiveBehaviorRequest = {
          paeId: this.paeId,
          id: "",
          typeCd: this.sexuallyAggressiveTypeCd,
          agrBehArmReachCd: formValue.armReachIntervention,
          agrBehCrsisInterCd: formValue.crisisIntervention,
          agrBehDurationSw: formValue.supportNeedsBehavior,
          agrBehSw: formValue.childAggressiveBehavior,
          reqPageId: this.pageId
        }
        this.paeService.saveAggressiveBehavior(request).then(response => {
          this.isSexuallyAggressiveSaved = response.body.id && response.body.typeCd === this.sexuallyAggressiveTypeCd;
          this.sexuallyAggressiveEditMode = false;
          this.submitted = false;
        this.getBehaviorSummaryData();
        console.log("saveSexuallyAggressiveBehaviorInfo response : " + JSON.stringify(response));
          if (showPopup) {
            const dialogConfig = new MatDialogConfig();
            dialogConfig.data = { route: 'ltss/pae' };
            // dialogConfig.data = { route: 'ltss/pae' , nextRoute: '/ltss/pae/paeStart/' + this.nextPath };
            dialogConfig.panelClass = 'exp_popup';
            dialogConfig.width = '648px';
            dialogConfig.height = '360px';
            this.dialog.open(SavePopupComponent, dialogConfig);
          }
        });

      }

    } catch (e) {
      console.log("PaeNonFebrileSeizures Catch : ", e);
    }
  }


  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    console.log(this.paeSexuallyAggressiveBehaviorFormGroup)
    return this.isSamePageNavigation ? true : !this.paeSexuallyAggressiveBehaviorFormGroup.dirty;
  }

  resetForm() {
    this.paeSexuallyAggressiveBehaviorFormGroup.reset();
  }

  cancel(accordion) {
    if (accordion === 1) {
      this.summaryDetails && this.summaryDetails.find(res => res.typeCd === this.physicallyAggressiveTypeCd) ? this.patchValue(this.summaryDetails, this.physicallyAggressiveTypeCd) : this.paePhysicallyAggressiveBehaviorFormGroup.reset();
      this.physicallyAggressiveEditMode = false;
    } else {
      this.summaryDetails  && this.summaryDetails.find(res => res.typeCd === this.sexuallyAggressiveTypeCd) ? this.patchValue(this.summaryDetails, this.sexuallyAggressiveTypeCd) : this.paeSexuallyAggressiveBehaviorFormGroup.reset();
      this.sexuallyAggressiveEditMode = false;
    }
  }

  edit(accordion) {
    if (accordion === 1) {
      this.physicallyAggressiveEditMode = true;
    } else {
      this.sexuallyAggressiveEditMode = true;
    }
  }

  delete(accordion) {

  }
}