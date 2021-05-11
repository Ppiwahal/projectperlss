import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { MatRadioChange } from '@angular/material/radio';
import {
  debounceTime,
  map,
  distinctUntilChanged,
  filter
} from 'rxjs/operators';
import { fromEvent, Subject } from 'rxjs';
import { NoticesService } from '../services/notices.service';
import * as customValidation from '../../_shared/constants/validation.constants';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { StaticDataMapService } from '../../core/helpers/static.data.map.service';

@Component({
  selector: 'app-create-manual-notice',
  templateUrl: './create-manual-notice.component.html',
  styleUrls: ['./create-manual-notice.component.scss']
})

export class CreateManualNoticeComponent implements OnInit, OnDestroy {
  noticeCreateForm: FormGroup;
  previewForm: FormGroup;
  selectedNoticeDetail = '';
  @ViewChild('applicantNameInput', { static: true }) applicantNameInput: ElementRef;
  personOptions:any[] = [];
  selectedPersonId:number;
  formData = {};
  isSubmitStep3 = false;
  recipientDetails: any;
  printTypes: any[];
  formAttachmentCodes: any[];
  selectedFormAttachment: any = '';
  customValidation = customValidation;
  step5Submitted: boolean = false;
  proceedToStep2: boolean = false;
  generateNotices:any[];
  noticesTemplates:any[];
  filteredNoticeTemplates:any[];
  subscriptions$: any[] = [];
  localStorageLocal = localStorage.getItem('APP_STORAGE_TOKEN');
  userId = JSON.parse(this.localStorageLocal).userName;
  entityId = JSON.parse(this.localStorageLocal).entityId;

  constructor(private router: Router,
              private noticeService: NoticesService,
              private formBuilder: FormBuilder,
              private staticDataService: StaticDataMapService,
              private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getAllPersonDetails();
    this.getPrintTypes();
    this.getFormAttachmentCodes();
    this.generateNoticesDetails();
    this.getNoticesTemplateDetails();
    this.noticeCreateForm = this.formBuilder.group({
      personSearchInput: ['', Validators.required]
    });
    this.previewForm = this.formBuilder.group({
      selectedPrintTypeValue:['', Validators.required],
      generateNoticeType:['', Validators.required],
      noticesTemplateDetail:['', Validators.required]
    })
  }

  postAllData() {
    this.step5Submitted = true;
    if(this.previewForm.controls.selectedPrintTypeValue.value) {
      this.formData["print_type"] = this.previewForm.controls.selectedPrintTypeValue.value;
      console.log("form data ", this.formData);
    }
    this.formData['onFlySw'] = false;
    const postcall$ = this.noticeService.createManualNotice(this.formData).subscribe(res => {
      console.log("createManualNotice ",res);
      if(res.successMessage) {
        this.toastr.success(res.successMessage);
      }
      this.router.navigate(['/ltss/notices/noticesDashboard']);
    });
    this.subscriptions$.push(postcall$);
  }

  capturePersonId(stepper) {
    this.proceedToStep2 = true;
    if (this.selectedPersonId) {
      this.formData["prsnId"] = this.selectedPersonId;
      const localStorageforLocal = localStorage.getItem('APP_STORAGE_TOKEN');
      this.formData["userId"] = JSON.parse(localStorageforLocal).userName;
      console.log("formData ", this.formData);
      stepper.next();
  }
  }

  handleSelectedNoticeRec(noticeRecord) {
    console.log("handleSelectedNoticeRec")
    this.formData = {...this.formData, ...noticeRecord};
    console.log("formData ", this.formData);
    let queryParams = `prsnId=${this.formData["prsnId"]}`;
    if(this.formData["aplId"]) {
      queryParams = queryParams + "&aplId=" + this.formData["aplId"]
    } else if(this.formData["paeId"]) {
      queryParams = queryParams + "&paeId=" + this.formData["paeId"]
    } else if(this.formData["refId"]) {
      queryParams = queryParams + "&refId=" + this.formData["refId"]
    }
      this.noticeService.getRecipientDetails(queryParams).subscribe(res => {
      this.recipientDetails = res;
    })
  }

  getCountyName(personCountycd) {
		const countyCds = this.staticDataService.getStaticDataKeyValue('COUNTY');
		const filterCountyCds = countyCds.filter(item => item.code === personCountycd);
		return filterCountyCds.length > 0 ? filterCountyCds[0].value : ' ';
	}

  handleSelection(option){
    const personDisplayName = "Applicant Name: " + option.prsnDetail.firstName+" "+option.prsnDetail.lastName+", DOB: "+option.prsnDetail.dobDt+", SSN: "+option.prsnDetail.ssn +", Person ID: "+option.prsnDetail.prsnId+", County: "+option.prsnDetail.prsnCountyName;
    this.noticeCreateForm.controls['personSearchInput'].setValue(personDisplayName);
    this.selectedPersonId = option.prsnDetail.prsnId;
  }

  get f() {
   return  this.noticeCreateForm.controls;
  }

  sortData(data) {
    if(data) {
     return data.sort(function (a, b){
        return a.value < b.value ? -1 : 1;
      });
    }
    return data;
  }

  getPrintTypes() {
    const noticePrintType$ = this.noticeService.getPrintTypes().subscribe((res) => {
      this.printTypes = this.sortData(res);
    });
    this.subscriptions$.push(noticePrintType$);
  }

  getFormAttachmentCodes() {
    const formAttachmentCodes$ = this.noticeService.getFormAttachmentCodes().subscribe((res) => {
      this.formAttachmentCodes = this.sortData(res);
    });
    this.subscriptions$.push(formAttachmentCodes$);
  }

  generateNoticesDetails() {
    const noticeDetails$ = this.noticeService.getGenerateNoticeType().subscribe((res) => {
      this.generateNotices = res;
    });
    this.subscriptions$.push(noticeDetails$);
  }

  getNoticesTemplateDetails() {
    const noticeTemplate$ = this.noticeService.getNoticeTemplate().subscribe((res) => {
      this.noticesTemplates = res;
    });
    this.subscriptions$.push(noticeTemplate$);
  }

  handleNoticeTypeChange() {
    const noticeType = this.previewForm.get('generateNoticeType').value;
    if(noticeType) {
     this.filteredNoticeTemplates =  this.noticesTemplates.filter(template => template.mapCode === noticeType);
    }
  }

  getAllPersonDetails() {
    fromEvent(this.applicantNameInput.nativeElement, 'keyup').pipe(
      map((event: any) => {
        return event.target.value;
      })
      , filter(res => res.length >= 1)
      , debounceTime(500)
      , distinctUntilChanged()
    ).subscribe((text: string) => {
      const personDetails$ = this.noticeService.getPersonDetails(text, this.entityId).subscribe((res) => {
        this.personOptions =[];
        if(res && res.length > 0) {
          res.forEach(personDetail => {
            const prsnCountyName = this.getCountyName(personDetail.cntyCd);
            personDetail = {...personDetail, ...{prsnCountyName}};
            this.personOptions.push({
              personId: personDetail.prsnId,
              prsnDetail: personDetail
            })
          })
        } else {

        }
        console.log("res ",res);
      }, (err) => {
        console.log('error', err);
      });
      this.subscriptions$.push(personDetails$);
    });    
  }

  submitAndProceedToStep4(stepper) {

    this.isSubmitStep3 = true;
    if(this.formData['manualNoticeTypeVO'] && this.formData['manualNoticeTypeVO']['formAttachment'] && this.selectedFormAttachment){
      stepper.next();
    } else {
      this.noticeService.submitStep3.next(true);
    }
  }

  noticeDetailsChange(event: MatRadioChange) {
    this.selectedNoticeDetail = event.value;
  }

  resetNoticeFormDetails() {
    this.formData["manualNoticeTypeVO"] = {
      "formAttachment": null,
      "docId": null,
      "pdfUpload": null,
      "documentId":null,
      "freeFormText": null,
      "header": null,
      "body": null,
      "shAttachment": null,
      "flaAttachment": null,
      "erAttachment": null,
      "gpAttachment": null,
      "ppAttachment": null,
      "kbpqAttachment": null,
      "prpForm": null,
      "tairForm": null,
      "taorForm": null,
      "hfaCode": null,
      "wsucfhCode": null,
      "duacCode": null,
      "hcuCode": null,
      "wform": null,
      "drthCode": null
    };
  }

  handleNoticeFormSubmit(payload, stepper) {
    this.resetNoticeFormDetails();
    this.formData["manualNoticeTypeVO"] = {...this.formData["manualNoticeTypeVO"],...payload};
    stepper.next();
  }

  handleNoticeUploadForm(payload, stepper) {
    this.resetNoticeFormDetails();
    const pdfPayload = {"documentId": payload, "pdfUpload": true};
    this.formData["manualNoticeTypeVO"] = {...this.formData["manualNoticeTypeVO"],...pdfPayload};
    stepper.next();
  }

  handleFormAttachment(payload) {
    this.resetNoticeFormDetails();
    const attachmentPayload = {"formAttachment": true, "docId": payload.value};
    this.selectedFormAttachment = payload.value;
    this.formData["manualNoticeTypeVO"] = {...this.formData["manualNoticeTypeVO"],...attachmentPayload};
    console.log("formData ",this.formData);
  }


  handleRecipientFormSubmit(payload, stepper) {
    this.formData["recipientAddr"] = payload;

    stepper.next();
  }

//   isValid() {
//     if(this.previewForm.valid) {
//   }
// }

  ngOnDestroy() {
    if (this.subscriptions$ && this.subscriptions$.length > 0) {
      this.subscriptions$.forEach(subscription$ => subscription$.unsubscribe());
    }
  }

}
