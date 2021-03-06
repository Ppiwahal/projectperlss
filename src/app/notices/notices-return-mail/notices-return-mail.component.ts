import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as customValidation from '../../_shared/constants/validation.constants';
import {NoticesService} from '../services/notices.service';
import {forkJoin} from 'rxjs';
import {CustomvalidationService} from '../../_shared/utility/customvalidation.service';
import { MatStepper } from '@angular/material/stepper';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import * as Constants from '../../_shared/constants/application.constants';
import * as CryptoJS from 'crypto-js';


@Component({
  selector: 'app-notices-return-mail',
  templateUrl: './notices-return-mail.component.html',
  styleUrls: ['./notices-return-mail.component.scss']
})
export class NoticesReturnMailComponent implements OnInit {
  noticeReturnForm: FormGroup;
  customValidation = customValidation;
  proceedToStep2: boolean = false;
  submitted = false;
  subscriptions$:any[] = [];
  retunNoticeTypes:any[];
  formData = {};
  oldAddress: any;
  updatedAddress: any;
  personId = '';
  userId;
  today = new Date();
  startDate = new Date();
 


  constructor(private router: Router,
              private formBuilder: FormBuilder,
              private noticesService: NoticesService,
              private toastr: ToastrService) { }

  ngOnInit(): void {
    const timeTravelData = localStorage.getItem('TIME_TRAVEL_DATA');
    if(timeTravelData) {
      const timeTravelDataJson = JSON.parse(CryptoJS.AES.decrypt(timeTravelData, Constants.APP_ENC_DECRYPT_KEY).toString(CryptoJS.enc.Utf8));
      console.log("timeTravelDataJson ", timeTravelDataJson);
      if(timeTravelDataJson.timeTravelFlag && timeTravelDataJson.currentDate) {
        this.startDate = new Date(timeTravelDataJson.currentDate);
      }
    }
    this.noticeReturnForm = this.formBuilder.group({
      mailPieceId: ['', Validators.required],
      dobDt: ['', Validators.required],
      mailtoproceed: ['', Validators.required]
    });
    this.getReturnNoticeDetails();
  }

  handleMailId(stepper) {
    this.noticeReturnForm.controls['mailPieceId'].markAsTouched();
    if(this.noticeReturnForm.controls['mailPieceId'].value) {
      this.formData['mailPieceId'] = this.noticeReturnForm.controls['mailPieceId'].value;
      this.noticesService.getReturnMailAddress(this.formData['mailPieceId']).subscribe(res => {
        console.log("res ", res);
        if(res &&  res.errorCode && res.errorCode.length > 0) {
         this.toastr.error(res.errorCode[0].description);

          return;
        }
        this.oldAddress = res.oldAddress;
        this.updatedAddress = res.updatedAddress;
        this.personId = res.personId;
        stepper.next();
      })

    }
  }

  get f() {
    return this.noticeReturnForm.controls;
   }

  handleMailDetails(stepper) {
    this.noticeReturnForm.controls['dobDt'].markAsTouched();
    const dobDt = this.noticeReturnForm.controls['dobDt'].value;
    console.log("dobDt ",dobDt)
    console.log("this.formData['fileNetId'] ",this.formData['fileNetId'])
    if(dobDt && this.formData['fileNetId']) {
      this.formData['returnMailDt'] = dobDt.toISOString();
      stepper.next();
    }
  }

  handleNoticeFormSubmit(payload) {
    if(payload && payload.length > 0) {
      this.formData['fileNetId'] = payload[0];
    } else {
      this.formData['fileNetId'] = null;
    }

  }

  getReturnNoticeDetails(){
    let observables = [];
    observables.push(this.noticesService.getReturnMailOptions());
    const returnNoticeDetailsSubscriptions$ = forkJoin(observables).subscribe((res: any) => {
      if(res[0]) {
        this.retunNoticeTypes = res[0].sort(function (a, b){
          return a.value < b.value ? -1 : 1;
        })
      }
    });
    this.subscriptions$.push(returnNoticeDetailsSubscriptions$);
  }

  getFormData() {
    return this.noticeReturnForm.controls;
  }

  capturMailPieceId(stepper) {
  }

  submitReturnMailForm() {
    this.noticeReturnForm.controls['mailtoproceed'].markAsTouched();
    this.submitted = true;
    const mailToProceed = this.noticeReturnForm.controls['mailtoproceed'].value;
    if(mailToProceed) {
      this.formData["sendNotice"] = (mailToProceed === 'UPD') ? true : false;
      this.formData = {...this.formData,...this.updatedAddress};
      const localStorageLocal = localStorage.getItem('APP_STORAGE_TOKEN');
      this.userId = JSON.parse(localStorageLocal).userName;
      this.formData = {...this.formData,...{userId: this.userId}};
      this.noticesService.updateReturnMail(this.formData).subscribe(res => {
        console.log("return mail res ", res);
        this.toastr.success(res.successMessage);
        this.router.navigate(['ltss/notices/noticesDashboard']);
      }, (error) => {
        this.toastr.error("Internal Server Error");
      })
    }

  }

  ngOnDestroy() {
    if(this.subscriptions$ && this.subscriptions$.length > 0) {
      this.subscriptions$.forEach(subscription$ => subscription$.unsubscribe());
    }
  }



}
