import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as customValidation from '../../_shared/constants/validation.constants';
import { CustomvalidationService } from '../../_shared/utility/customvalidation.service';
import { ChangeManagementService } from '../../core/services/change-management/change-management.service';
import { Subscription } from 'rxjs';
import { ReinstateMember } from 'src/app/_shared/model/change-management/reinStateMember';
import { PaeCommonService } from 'src/app/core/services/pae/pae-common/pae-common.service';
import { PaeService } from 'src/app/core/services/pae/pae.service';
import { PaeDocumentSummaryService } from 'src/app/core/services/pae/pae-document-Summary/pae-document-summary.service';
import { RightnavToggleService } from 'src/app/_shared/services/rightnav-toggle.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { UploadDocumentsPopupComponent } from '../../rightnav/upload-documents-popup/upload-documents-popup.component';
import { ReassessmentDetails } from 'src/app/_shared/model/change-management/reassessmentDetails';

@Component({
  selector: 'app-cm-loc-reassignment',
  templateUrl: './cm-loc-reassignment.component.html',
  styleUrls: ['./cm-loc-reassignment.component.scss']
})
export class CmLocReassignmentComponent implements OnInit {

  customValidation = customValidation;
  errorText: any = {};
  paeId: string;
  submitted = false;
  myForm: FormGroup;
  disenrollmentReasons: Array<any>;
  disenrollmentType: Array<any>;
  subscribed: Array<Subscription> = [];
  personData: any;
  prsnId: any;
  personId: string;
  documentSummary: any;
  ismedUploaded = false;
  chmTypeCd: any;
  enrollmentGroup: any;

  constructor(
    private customValidator: CustomvalidationService,
    private changeManagementService: ChangeManagementService,
    private fb: FormBuilder,
    private router: Router,
    private paeCommonService: PaeCommonService,
    private paeService: PaeService,
    private paeDocummentSummaryService: PaeDocumentSummaryService,
    private rightnavToggleService: RightnavToggleService,
    public dialog: MatDialog,

  ) {


    this.disenrollmentType = this.changeManagementService.data.disenrollmentType;

  }

  ngOnInit(): void {
      this.myForm = this.fb.group({
         applcntCntctSw:[''],
         chmTypeCd: [''],
         careNfImproveSw:[''],
         commentTxt:[''],
         currAcuityScore:[''],
         dailyNursingCareSw:[''],
         enrGrpCd:[''],
         idLmtnSw:[''],
         locImpactSw:[''],
         noOfFunctnlDeficits:[''],
         paeId:[''],
         paeRvwSw:[''],
         partaImpactSw:[''],
         physOrderNfSw:[''],
         reassmntDt:[''],
         reassmntOutcomeCd:[''],
         reqHcbsSw:[''],
         safetyDetermnReqSw: [''],
         specificCondDesc: ['']
      });
      this.subscribed.push(
      this.changeManagementService.personData$.subscribe(personData => {
        this.personData = personData;
        this.enrollmentGroup = this.personData.enrollmentGroup;
        this.fixControls();
      })
    );
      this.getChangeReinStateEnrollment();
  }
  getFormData() {
    return this.myForm.controls;
  }
  getControl(controlName: string) {
    return this.myForm.controls[controlName];
  }

  get f() {
    return this.myForm.controls;
  }

  getChangeReinStateEnrollment() {
    this.changeManagementService.getreinstateMember(this.personId).then((response) => {
      console.log(' PaeCostNeuCalcAnnualAmt response===', response);
    });
  }

  fixControls() {

    const that = this;

    const timeout = setTimeout(function() {
      Object.keys(that.myForm.controls).forEach(controlName => {
        if (controlName != 'search') {
          const control = that.myForm.controls[controlName];
          if (control.errors) {
            const errorKeys = Object.keys(control.errors);
            errorKeys.forEach(key => {
              delete control.errors[key];
            });
          }
          control.setErrors(null);
          control.markAsUntouched();
          that.errorText[controlName] = null;
        }
      });
      clearTimeout(timeout);
    }, 100);
  }

  controlError(controlName: string): boolean {

    let error = null;
    try {
      const control = this.myForm.controls[controlName];
      if ((this.submitted || control.touched) && control.errors) {
        if (controlName.slice(-4) == 'Date' && control.errors.matDatepickerParse?.text && control.status == 'INVALID') {
          error = customValidation.BD;
        } else if (control.errors.dateInFuture) {
          error = customValidation.A5;
        } else if (control.errors.dateInPast) {
          error = customValidation.A15;
        } else if (control.errors.required) {
          error = customValidation.A1;
        }
      }
    } catch (e) {
      console.log('bad control name: ' + controlName);
    }

    this.errorText[controlName + 'Error'] = error;
    return error != null;
  }

  dateFilter(event: KeyboardEvent) {
    const control = event.currentTarget as HTMLInputElement;
    const key = event.key;
    const allowed = '0123456789/';
    if (key && key.length == 1 && allowed.indexOf(key) < 0) {
      event.preventDefault();
    }
  }

  save() {
    this.submitted = true;
    console.log(this.getFormData());
    if (this.myForm.valid) {
      const reassessmentDetails = new ReassessmentDetails(
        this.getFormData().applcntCntctSw.value,
        this.chmTypeCd = 'LOCR',
        this.getFormData().careNfImproveSw.value,
        this.getFormData().commentTxt.value,
        this.getFormData().currAcuityScore.value,
        this.getFormData().dailyNursingCareSw.value,
        this.personData.enrollmentGroup,
        this.getFormData().idLmtnSw.value,
        this.getFormData().locImpactSw.value,
        this.getFormData().noOfFunctnlDeficits.value,
        this.personData.paeId,
        this.getFormData().paeRvwSw.value,
        this.getFormData().partaImpactSw.value,
        this.getFormData().physOrderNfSw.value,
        this.getFormData().reassmntDt.value,
        this.getFormData().reassmntOutcomeCd.value,
        this.getFormData().reqHcbsSw.value,
        this.getFormData().safetyDetermnReqSw.value,
        this.getFormData().specificCondDesc.value,

      );

      this.changeManagementService.SaveReassessmentDetails(reassessmentDetails).then((response) => {
        console.log('res', response);
        this.router.navigate(['/ltss/changeManagement/dashboard']);
      });

    }
  }

  getPaeDocumentSummaryData() {
    // const paeId = this.paeService.getPaeId();
    const pageId = 'PPBBS';
    // const paeId = this.paeCommonService.getPaeId();
    this.paeService.getPaeDocumentSummary(this.paeId).then((response) => {
      console.log('response===', response);
      if (response.status === 200) {
        this.documentSummary = response.body;
        console.log(this.documentSummary);
      }
    });
  }


  openDocument(url) {
    window.open('http://www.africau.edu/images/default/sample.pdf', '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes');
  }

  openUploadDocument() {
    this.rightnavToggleService.emitToRightNavComp$.next('UPLOAD_DOC');
  }

  getDocumentData()
  {
    this.paeDocummentSummaryService.getDocumentSummary(this.paeId)
    .subscribe((response) => {
      console.log(response);
      console.log(response[0].documentType);
      console.log(response.length);
      for (let i = 0; i <= response.length; i++)
      {
        // console.log(response[i].documentType);
      if (response[i].documentType[0])
      {
        this.ismedUploaded = true;
      }
    }
    });

  }

  uploadDocument() {
    this.openUploadDocument();
    console.log('upload document');
  }

}
