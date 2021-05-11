import { Component, HostListener, OnInit, ViewEncapsulation } from '@angular/core';
import * as customValidation from '../../_shared/constants/validation.constants';
import { CustomvalidationService } from '../../_shared/utility/customvalidation.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { PaeNonFebrileSeizuresForm } from '../../_shared/model/PaeNonFebrileSeizuresForm'
// import { CommitteeReviewGroup7Form } from './../../../../_shared/model/Forms/CommitteeReviewGroup7Form';
import { PaeService } from '../../core/services/pae/pae.service';
import { SavePopupComponent } from 'src/app/savePopup/savePopup.component';
import { ComponentCanDeactivate } from 'src/app/core/helpers/pending-change.guard';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-pae-non-febrile-seizures',
  templateUrl: './pae-non-febrile-seizures.component.html',
  styleUrls: ['./pae-non-febrile-seizures.component.scss']
})
export class PaeNonFebrileSeizuresComponent implements OnInit, ComponentCanDeactivate {
  paeNonFebrileSeizuresFormGroup: FormGroup;
  customValidation = customValidation;
  submitted = false; 
  dataSource : any;
  pageId: string;
  isSamePageNavigation: boolean;
  constructor(private fb: FormBuilder,
              private customValidator: CustomvalidationService,
              private dialog:MatDialog,
               private paeService: PaeService,
              // private committeeReviewFormService: committeeReviewFormService,
              public dialogRef: MatDialog) { }

  ngOnInit(): void {
    this.pageId='PPPNF';
     this.getNonFebrileSeizuresInfoCall(); 
    this.paeNonFebrileSeizuresFormGroup = this.fb.group({
      reqPageId: [''],
      paeId: [''],
      freqOfProlongedSeizuresCd: ['', [Validators.required]],
      freqOfShortSeizuresFreqCd : ['', [Validators.required]]
    });
  }
back(){
  this.isSamePageNavigation =  true;
  this.paeService.navigateToChildPreviousPage(this.pageId);
}
saveAndExit(){
  this.saveNonFebrileSeizuresInfo(true) 
}
saveNonFebrileSeizuresInfo(showPopup?:boolean){
  this.isSamePageNavigation =  true;
  // this.markFormGroupTouched(this.paeFormGroup);
    this.submitted = true;
    try {
      if(this.paeNonFebrileSeizuresFormGroup.valid && this.submitted) {

      const formValue = this.paeNonFebrileSeizuresFormGroup.value;
      const PaeNonFebrileSeizuresValue = new PaeNonFebrileSeizuresForm(
        "23",
        "PAE1000084",
        formValue.freqOfProlongedSeizuresCd,
        formValue.freqOfShortSeizuresFreqCd
      );

      this.paeService.saveNonFebrileSeizures(PaeNonFebrileSeizuresValue).then(response=> {
        console.log("saveNonFebrileSeizuresInfo response : "+ JSON.stringify(response));
        if(showPopup){
          const dialogConfig = new MatDialogConfig();
        dialogConfig.data = { route: 'ltss/pae' };
       // dialogConfig.data = { route: 'ltss/pae' , nextRoute: '/ltss/pae/paeStart/' + this.nextPath };
        dialogConfig.panelClass = 'exp_popup';
        dialogConfig.width = '648px';
        dialogConfig.height = '360px';  
        this.dialog.open(SavePopupComponent, dialogConfig );
        }
      })      

    }

    } catch (e) {
      console.log("PaeNonFebrileSeizures Catch : ", e);
    }

}

  getFormData() {
    return this.paeNonFebrileSeizuresFormGroup.controls;
  }

  async onSubmit() {
  //   this.submitted = true;
  //   try {
  //     if(this.committeeReviewForm.valid && this.submitted) {
  //       const response = await this.committeeReviewFormService.savecommitteeReviewForm({
  //         ...this.committeeReviewForm.value,
  //       });
  //       console.log(response);
  //   }

  //   } catch (e) {
  //     console.log(e);
  //   }
  }

  // saveForm(form) {
  //   const data = '';
  //   if (this.committeeReviewForm.valid && this.submitted) {
  //     const response = this.committeeReviewFormService.savecommitteeReviewForm(form);
  //     // tslint:disable-next-line: no-shadowed-variable
  //     response.then(data => {
  //       data = data.body;
  //       this.closePopup();
  //       console.log(data);
  //     });
  //   }
  // }
getNonFebrileSeizuresInfoCall() {
//TODO: Pass correct personid from UI

  this.paeService.getNonFebrileSeizuresInfo('PAE1000082').then((response)=> {
    console.log('getNonFebrileSeizuresInfo : ' + JSON.stringify(response));
    this.dataSource = response;
  })  
}

  closePopup() {
    // this.dialogRef.close();
  }
  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    console.log(this.paeNonFebrileSeizuresFormGroup) 
   return this.isSamePageNavigation ? true : !this.paeNonFebrileSeizuresFormGroup.dirty;
  }

  resetForm(){
    this.paeNonFebrileSeizuresFormGroup.reset();
  }
}
