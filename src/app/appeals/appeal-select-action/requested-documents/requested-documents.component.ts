import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppealService } from '../../services/appeal.service';
import * as customValidation from '../../../_shared/constants/validation.constants';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-requested-documents',
  templateUrl: './requested-documents.component.html',
  styleUrls: ['./requested-documents.component.scss']
})
export class RequestedDocumentsComponent implements OnInit {

  subscriptions$ = [];
  documentStatus = [];
  files = [];
  showFiles = false;
  fileErrors: any;
  documents = [];
  progresValue: any;
  @Input() documentType: any[];
  fileError = false;
  fileText = '';
  requestedDocForm: FormGroup;
  documentRequested: any;
  customValidation = customValidation;
  @Input() searchElement: any;

  constructor(private formBuilder: FormBuilder,private appealService: AppealService, private toastrService: ToastrService) { }

  ngOnInit(): void {
    this.requestedDocForm = this.formBuilder.group({
      documentType:['', Validators.required],
      docDesc: ['', Validators.required],
    });

    this.appealService.getAppealActionDocumnetRequested(this.searchElement.aplId).subscribe(res => {
     this.documentRequested = res;
    });

  }

  f() {
    return this.requestedDocForm.controls;
  }

  fileBrowseHandler(files) {
    this.fileError = false;
    for (const file of files) {
      file.progress = 0;
      const fileNameArray = file.name.split('.');
      const fileType = fileNameArray[fileNameArray.length - 1].toLowerCase();
      if (fileType !== 'tiff' && fileType !== 'tif' && fileType !== 'bmp' &&
        fileType !== 'jpeg' && fileType !== 'pdf' && fileType !== 'xlsx' && fileType !== 'docx' && fileType !== 'jpg') {
        this.fileError = true;
        this.fileText = 'Please make sure the document uploaded is valid';
        return;
      }
      if (file.size >= 30 * 1024 * 1024) {
        this.fileError = true;
        this.fileText = 'Please choose a file that is less than 30MB size.';
      } else {
        this.fileError = false;
        this.files.push(file);
      }
    }
    this.showFiles = true;
    this.convertAllFilesToBase64(this.files);
  }

  getBase64(file) {
    this.documents = [];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const value = reader.result.toString();
      const data = value.split(',')[1];
      this.documents.push(data);
    };
  }

  
  convertAllFilesToBase64(files) {
      for (const file of this.files) {
        this.getBase64(file);
      }
  }

  deleteFile(file) {
    this.files = this.files.filter(element => {
      return file.name !== element.name;
    });
    this.convertAllFilesToBase64(this.files);
  }

  submit(){
    if(this.requestedDocForm.valid){
      if(this.files.length !== 0){
        if(this.files.length === 0){
          this.documents = [];
        }
        this.requestedDocForm.value.aplId = this.searchElement.aplId;
        this.requestedDocForm.value.document = this.documents;
        this.appealService.saveAppealActnRequestedDoc(this.requestedDocForm.value).subscribe(res => {
          this.toastrService.success(res.successMessage);
        });
      }
    }
  }

}
