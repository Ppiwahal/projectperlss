import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as customValidation from '../../_shared/constants/validation.constants';
import { ReferralListManagementService } from '../services/referral-list-management.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-update-outreach-details',
  templateUrl: './update-outreach-details.component.html',
  styleUrls: ['./update-outreach-details.component.scss']
})
export class UpdateOutreachDetailsComponent implements OnInit {

  outreachForm: FormGroup;
  customValidation = customValidation;
  formData = {};
  annualOutreachs: any[] = [];
  @Input() referralId: any;
  constructor(private fb: FormBuilder,
              private referralListManagementService: ReferralListManagementService,
              private toastr: ToastrService) { }

  ngOnInit(): void {
    this.outreachForm = this.fb.group({
      outreachDueDt: ['', Validators.required],
      updateActionCd: ['', Validators.required]
    });
    this.getAnnualOutreach();
  }

  getAnnualOutreach(){

    this.referralListManagementService.getAnnualOutreachCodes().subscribe( res =>{
      this.annualOutreachs = res;
    });

  }

  get f() {
    return this.outreachForm.controls;
  }

  outreachDetails(){
    this.formData = this.outreachForm.value;
    this.formData = {...this.formData, ...{refId: this.referralId}};
    this.formData['outreachDueDt'] = new Date(this.formData['outreachDueDt']).toISOString().substring(0,10);
    let payload = this.formData ;
    this.referralListManagementService.updateOutreachDetails(payload).subscribe(res => {
      this.toastr.success(res.successMsgDescription);
    }, err => {
      this.toastr.error('Service Error!');
    })
  }

}
