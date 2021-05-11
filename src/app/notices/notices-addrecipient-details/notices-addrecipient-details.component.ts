import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NoticesService } from '../services/notices.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as customValidation from '../../_shared/constants/validation.constants';
import { CustomvalidationService } from '../../_shared/utility/customvalidation.service';
import { DisplayMode } from '../../_shared/utility/DisplayMode';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-notices-addrecipient-details',
  templateUrl: './notices-addrecipient-details.component.html',
  styleUrls: ['./notices-addrecipient-details.component.scss']
})
export class NoticesAddrecipientDetailsComponent implements OnInit {
  isShow = false;
  recipientTypes: any;
  addRecipients: FormGroup;
  @Input() recipientDetails: any;
  @Input() formData: any;
  selectedRecipient: any;
  @Output() emitReceipientForm = new EventEmitter();
  customValidation = customValidation;
  editMode = true;
  recepientList: any[] = [];
  selectedIndex = -1;
  recipientNames = [];
  selectedRecipientList = [];
  submitted = false;
  constructor(private noticeService: NoticesService, private fb: FormBuilder, private customValidator: CustomvalidationService, private toastr: ToastrService,) { }

  ngOnInit(): void {
    this.noticeService.getRecipientTypes().subscribe(res => {
      if (res) {
        this.recipientTypes = res.sort(function (a, b) {
          return a.value < b.value ? -1 : 1;
        })
      }
    });
    this.addRecipients = this.fb.group({
      recipient: ['', [Validators.required]],
      recipientName: ['', [Validators.required]]
    });
  }

  handleRecipientChange() {
    this.recipientNames = [];
    if (this.recipientDetails && this.recipientDetails.length > 0) {
      const matchedRecipients = this.recipientDetails.filter(recDetail => recDetail.recipient === this.addRecipients.controls.recipient.value);
      if (matchedRecipients && matchedRecipients.length > 0) {
        matchedRecipients.forEach(match => {
          this.recipientNames.push({ code: match.firstName + " " + match.lastName, value: match.firstName + " " + match.lastName });
        });
        this.addRecipients.controls.recipientName.setValue(this.recipientNames[0].code);
        this.selectedRecipient = matchedRecipients[0];
      }else{
        this.selectedRecipient = null;
      }
    }
  }

  getRecipientName(code) {
    if (this.recipientTypes && this.recipientTypes.length > 0) {
      const recipientObj = this.recipientTypes.filter(recipientType => recipientType.code === code);
      if (recipientObj && recipientObj.length > 0) {
        return recipientObj[0].value;
      } else {
        return '';
      }
    }
    return '';
  }

  displayEditMode(index) {
    this.selectedRecipient = this.recepientList[index];
    this.addRecipients.patchValue(this.recepientList[index]);
    this.recepientList.splice(index, 1);
    this.selectedRecipientList = this.recepientList.map(recipientObj => recipientObj.recipient);
  }


  addNewRecipient() {
    this.addRecipients.markAllAsTouched();
    this.addRecipients.controls.recipient.clearValidators();
    this.addRecipients.get('recipient').updateValueAndValidity();

    this.addRecipients.controls.recipientName.clearValidators();
    this.addRecipients.get('recipientName').updateValueAndValidity();

    if (this.addRecipients.valid) {
      this.recepientList.push(this.selectedRecipient);
      this.selectedRecipientList = this.recepientList.map(recipientObj => recipientObj.recipient);
       this.selectedRecipient = null;
      this.selectedIndex = -1;
      this.addRecipients.reset();
    }

  }

  get f() {
    return this.addRecipients.controls;
  }
  OnSearch() {
    let payload = this.formData;
    payload['recipientAddr'] = [this.selectedRecipient];
    payload['onFlySw'] = true;


    const postcall$ = this.noticeService.manualNotice(payload).subscribe(res => {
      console.log("privewnotice", res);
      if (res && res.errorCode && res.errorCode.length > 0 && res.errorCode[0].description) {
        this.toastr.error(res.errorCode[0].description);
      }
      else {
        let pdfWindow = window.open("")
        pdfWindow.document.write(
          "<iframe width='100%' height='100%' src='data:application/pdf;base64, " +
          encodeURI(res.noticeViewResponseVO.viewPdf) + "'></iframe>"
        )
      }
    });
  }

  postRecipientDetails() {
    this.submitted = true;
    if (this.addRecipients.valid) {
     // this.addNewRecipient();
    //  console.log('recplist',this.recepientList);
    //  console.log('selrecp',this.selectedRecipient);
    //  if(this.selectedRecipient != null){
    //  this.recepientList.push(this.selectedRecipient);
    //  }

     if(this.recepientList.length>0){
       if(this.selectedRecipient != null){
         var recpt = [...this.recepientList,this.selectedRecipient]
        this.emitReceipientForm.emit(recpt);

       }else{
      this.emitReceipientForm.emit(this.recepientList);
       }
     }else{
      this.emitReceipientForm.emit([this.selectedRecipient]);

     }

    }
  }

}
