import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { CustomvalidationService } from 'src/app/_shared/utility/customvalidation.service';
import * as customValidation from '../../../_shared/constants/validation.constants';


@Component({
  selector: 'app-pae-skilled-services-acknowledgement-popup',
  templateUrl: './pae-skilled-services-acknowledgement-popup.component.html',
  styleUrls: ['./pae-skilled-services-acknowledgement-popup.component.scss']
})
export class PaeSkilledServicesAcknowledgementPopupComponent implements OnInit {
  selectStatement: FormGroup;
  submitted = false;
  customValidation = customValidation;
  isSelected = false;

  constructor(public dialogRef: MatDialogRef<PaeSkilledServicesAcknowledgementPopupComponent>,
              private fb: FormBuilder) { }

  ngOnInit(): void {
    this.selectStatement = this.fb.group({
      selectcheck: ['', [Validators.required]]
     });
  }

  closePopup(){
    this.dialogRef.close();
  }

  getFormData()
  {
    return this.selectStatement.controls;
  }

  onackSt(event)
  {
    if(event.checked)
    {
      this.isSelected = true;
    }
  }

  onSubmit()
  {
    this.dialogRef.close();
    // this.submitted = true;
    // if(this.selectStatement.valid){
    // console.log("submitted");
    // }
    // else {
    //   this.isSelected = false;
    // console.log("not submitted");
    // }
  }

}
