import { Component, OnInit } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { PaeService } from 'src/app/core/services/pae/pae.service';
import { PaeAcuteOrChronicConditionsVO } from '../../_shared/model/PaeAcuteOrChronicConditionsVO';
import { HttpResponse } from '@angular/common/http';
import { PaeCommonService } from './../../core/services/pae/pae-common/pae-common.service';

@Component({
  selector: 'app-pae-acute-or-chronic-conditions',
  templateUrl: './pae-acute-or-chronic-conditions.component.html',
  styleUrls: ['./pae-acute-or-chronic-conditions.component.scss']
})
export class PaeAcuteOrChronicConditionsComponent implements OnInit {
  acuteForm: FormGroup;
  formInformation: any;
  panelOpenState = false;
  isShown = false;
  fillThisArray: any = [];
  acuteChronicList = [
    {code: 'A', value:'Acute', activateSW:'Y'},
    {code: 'C', value:'Chronic', activateSW:'Y'}
  ];
  constructor(public dialogRef: MatDialogRef<PaeAcuteOrChronicConditionsComponent>,
              private paeService: PaeService,
              private paeCommonService: PaeCommonService,
              private fb: FormBuilder) { }

  ngOnInit(): void {
    this.loadAccordions();

    this.acuteForm = this.fb.group({
      medCndtn: [''],
      acuteChrncCd: [''],
      licensedStaffReq: [''],
      interventionReq: ['']

    });
  }
  
  loadAccordions() {
    const response = this.paeService.getAcuteCondInfo(this.paeCommonService.getPaeId());
    response.then(resp => {
      this.formInformation = resp.body;
      console.log(resp);
    });
  }

  saveNewRecord(){
    const paeAcuteOrChronicVO = new PaeAcuteOrChronicConditionsVO(
      this.paeCommonService.getPaeId(),
      this.getFormData().acuteChrncCd.value,
      this.getFormData().interventionReq.value,
      this.getFormData().licensedStaffReq.value,
      this.getFormData().medCndtn.value,
    );

    this.fillThisArray.push(paeAcuteOrChronicVO);    
    const resp = this.paeService.setAcuteConditions(this.fillThisArray);    
    const that = this;
    resp.then(function(resp: HttpResponse<any>) {
     that.loadAccordions();
     that.fillThisArray = [];
     that.cancelForm();
    });
  }

  getFormData() {
    return this.acuteForm.controls;
  }

  closePopup() {
    this.dialogRef.close();
  }

  cancelForm() {
    this.isShown = false;
  }

  clearForm() {
    this.acuteForm.reset();
    this.ngOnInit();
  }

  toggleShow() {
    this.isShown = ! this.isShown;
  }

}
