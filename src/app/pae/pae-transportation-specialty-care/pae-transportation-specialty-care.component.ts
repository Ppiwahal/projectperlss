import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaeService } from '../../core/services/pae/pae.service';
import { PaeCommonService } from './../../core/services/pae/pae-common/pae-common.service';
import * as customValidation from '../../_shared/constants/validation.constants';
import { CustomvalidationService } from '../../_shared/utility/customvalidation.service';
import { PaeTransportationSpeciality } from 'src/app/_shared/model/PaeTransportationSpeciality';
import { Router } from '@angular/router';
import { LeavePagePopupComponent } from 'src/app/leave-page-popup/leave-page-popup.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SavePopupComponent } from 'src/app/savePopup/savePopup.component';
import { PaeFlowSeq } from 'src/app/_shared/utility/PaeFlowSeq';
import { ComponentCanDeactivate } from 'src/app/core/helpers/pending-change.guard';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-pae-transportation-specialty-care',
  templateUrl: './pae-transportation-specialty-care.component.html',
  styleUrls: ['./pae-transportation-specialty-care.component.scss']
})
export class PaeTransportationSpecialtyCareComponent implements OnInit, ComponentCanDeactivate {
  myForm: FormGroup;
  event: string;
  reqPageId: string;
  paeId = 'PAE1000017';
  customValidation = customValidation;
  submitted = false;
  transportSelected =  false;
  transportNoneSelected = false;
  transportCheckboxSelectedCount = 0;
  pageId: string;
  isSamePageNavigation: boolean;

  constructor(private fb: FormBuilder,
              private customValidator: CustomvalidationService,
              private paeService: PaeService,
              private paeCommonService: PaeCommonService,
              private router: Router,
              private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.pageId = 'PPPTS';
    this.paeId = this.paeCommonService.paeId;
    this.myForm = this.fb.group({
      aplcntAmbSplcareSw: ['', Validators.required],
      aplcntTransEquipSw: ['', Validators.required],
      aplcntSplMonitorSw: ['', Validators.required],
      reqSixPrim6mnthsSw: [null],
      reqTransFiftyPrimSw: [null],
      reqTransFiftySplSw: [null],
      notAppliSw: [null]
    });
  }

  getFormData() {
    return this.myForm.controls;
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
      this. transportNoneSelected = true;
    } else if (!event.checked) {
      this.transportNoneSelected = false;
    }
  }

  saveTransportationSpeciality(eventType) {
    if (this.myForm.valid) {
      this.reqPageId = 'PPAEPA';
      const paeTransportationSpeciality  = new PaeTransportationSpeciality(
        this.reqPageId,
        this.paeId,
        this.getFormData().aplcntAmbSplcareSw.value,
        this.getFormData().aplcntTransEquipSw.value,
        this.getFormData().aplcntSplMonitorSw.value,
        this.sendingYesorNo(this.getFormData().reqSixPrim6mnthsSw.value),
        this.sendingYesorNo(this.getFormData().reqTransFiftyPrimSw.value),
        this.sendingYesorNo(this.getFormData().reqTransFiftySplSw.value),
        this.sendingYesorNo(this.getFormData().notAppliSw.value),
      );
      this.paeService.savePaeTransportationSpeciality(paeTransportationSpeciality).then((res) => {
          if (res.status === 200) {
            if (eventType !== 'Next') {
              const dialogConfig = new MatDialogConfig();
              dialogConfig.data = { route: 'ltss/pae/paeStart/prioritizationSummary' };
              dialogConfig.panelClass = 'exp_popup';
              dialogConfig.width = '648px';
              dialogConfig.height = '360px';

              this.dialog.open(SavePopupComponent, dialogConfig);
            } else {
              this.router.navigate(['ltss/pae/paeStart/nonFebrileSeizures']);
            }
          }
      });
    }
  }

  sendingYesorNo(input: boolean) {
    if (input === true) {
      return 'Y';
    } else if (input === false) {
      return 'N';
    }
    else{
      return null;
    }
  }

  next(){
    this.isSamePageNavigation =  true;
    this.event = 'Next';
    this.submitted = true;
    if (this.myForm.valid) {
      this.saveTransportationSpeciality(this.event);
    }
    console.log(this.myForm);
  }

  goBack() {
    this.isSamePageNavigation =  true;
    this.paeService.getChidPageNavigation(this.paeId, this.pageId).subscribe(response => {
      const backPath = PaeFlowSeq[response.prevPageId];
      const path =  '/ltss/pae/paeStart/' + backPath;
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = { route: 'ltss/pae/paeStart/medicalRegimen' };
      dialogConfig.panelClass = 'exp_popup';
      dialogConfig.width = '648px';
      dialogConfig.height = '360px';
      this.dialog.open(LeavePagePopupComponent, dialogConfig);
    });
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
