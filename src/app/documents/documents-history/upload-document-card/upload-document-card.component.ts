import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import * as customValidation from '../../../_shared/constants/validation.constants';

@Component({
  selector: 'app-upload-document-card',
  templateUrl: './upload-document-card.component.html',
  styleUrls: ['./upload-document-card.component.scss'],
})
export class UploadDocumentCardComponent implements OnInit, OnDestroy {

  @Input() cardInput: any;
  @Output() cancelFromChild = new EventEmitter<any>();
  @Output() saveFromChild = new EventEmitter<any>();

  subscriptions$ = [];
  documentSettings: IDropdownSettings;
  files = [];
  documentStatus = [];
  documentName = '';
  errorText = false;
  customValidation = customValidation;
  submitted = false;
  fileError = false;
  showFiles = false;
  documents = [];
  fileText = '';
  docType = [];
  docDesc = '';
  selectedItems = [];
  isThirtyMB = false;

  constructor() { }

  ngOnInit() {
    const docTypeArray = [];
    this.cardInput.myFormInput.value.docType.forEach(element => {
      this.cardInput.responseDocCatsInput.forEach(ele => {
        if (element.code === ele.value) {
          docTypeArray.push(ele.code);
        }
      });
    });
    this.documentStatus = this.cardInput.documentStatusInput;
    this.documents = this.cardInput.documentsInput;
    if (docTypeArray.includes('Appeals')) {
      this.documentName = 'Appeals';
    } else if (docTypeArray.includes('Transitions')) {
      this.documentName = 'Transitions';
    } else if (docTypeArray.includes('Change Management')) {
      this.documentName = 'Change Management';
    } else if (docTypeArray.includes('PAE Documentation (Only for KB)')) {
      this.documentName = 'PAE Documentation (Only for KB)';
    } else if (docTypeArray.includes('PAE Documentation (Non-KB)')) {
      this.documentName = 'PAE Documentation (Non-KB)';
    } else if (docTypeArray.includes('ECF Referral Intake Documents')) {
      this.documentName = 'ECF Referral Intake Documents';
    }
    this.documentSettings = {
      singleSelection: false,
      idField: 'code',
      textField: 'value',
      enableCheckAll: false,
      allowSearchFilter: false
    };
    this.showFiles = true;
    this.files = this.cardInput.filesInput;
    this.selectedItems = this.cardInput.docTypeInput;
    this.selectedItems.forEach(element => {
      if (element.value === 'Notice of Hearing' || element.value === 'Onsite Assessment') {
        this.isThirtyMB = true;
      }
    });
    this.docType = this.cardInput.docTypeInput;
    this.docDesc = this.cardInput.docDescInput;
    this.cardInput.myFormInput.reset();
  }

  fileBrowseHandler(files) {
    this.prepareFilesList(files);
  }

  prepareFilesList(files: Array<any>) {
    this.files = [];
    this.documents = [];
    for (const file of files) {
      file.progress = 0;
      const fileNameArray = file.name.split('.');
      const fileType = fileNameArray[fileNameArray.length - 1].toLowerCase();
      if (fileType !== 'tiff' && fileType !== 'tif' && fileType !== 'bmp' &&
        fileType !== 'jpeg' && fileType !== 'pdf' && fileType !== 'xlsx' && fileType !== 'docx' && fileType !== 'jpg') {
          this.fileError = true;
          this.fileText = 'Please make sure the document uploaded is the .tiff, .bmp, .jpeg, .pdf, .xslx, or .docx format and under 2MB.';
          return;
      }
      if (this.isThirtyMB && file.size >= 30 * 1024 * 1024) {
        this.fileError = true;
        this.fileText = 'Please choose a file that is less than 30MB size.';
      } else if (!this.isThirtyMB && file.size >= 2 * 1024 * 1024) {
        this.fileError = true;
        this.fileText = 'Please choose a file that is less than 2MB size.';
      } else {
        this.fileError = false;
        this.files.push(file);
        this.getBase64(file);
        this.showFiles = true;
      }
    }
  }

  getBase64(files) {
    const reader = new FileReader();
    reader.readAsDataURL(files);
    reader.onload = () => {
      const value = reader.result.toString();
      const data = value.split(',')[1];
      this.documents.push({ document: data, file: files });
    };
  }

  onItemSelect() {
    const docTypeArray = [];
    this.files = [];
    this.documents = [];
    this.isThirtyMB = false;
    this.selectedItems.forEach(element => {
      this.cardInput.responseDocCatsInput.forEach(ele => {
        if (element.code === ele.value) {
          docTypeArray.push(ele.code);
        }
        if (element.value === 'Notice of Hearing' || element.value === 'Onsite Assessment') {
          this.isThirtyMB = true;
        }
      });
    });
    if (docTypeArray.includes('Appeals')) {
      this.documentName = 'Appeals';
    } else if (docTypeArray.includes('Transitions')) {
      this.documentName = 'Transitions';
    } else if (docTypeArray.includes('Change Management')) {
      this.documentName = 'Change Management';
    } else if (docTypeArray.includes('PAE Documentation (Only for KB)')) {
      this.documentName = 'PAE Documentation (Only for KB)';
    } else if (docTypeArray.includes('PAE Documentation (Non-KB)')) {
      this.documentName = 'PAE Documentation (Non-KB)';
    } else if (docTypeArray.includes('ECF Referral Intake Documents')) {
      this.documentName = 'ECF Referral Intake Documents';
    }
  }

  onItemDeSelect() {
    const docTypeArray = [];
    this.files = [];
    this.documents = [];
    this.isThirtyMB = false;
    this.selectedItems.forEach(element => {
      this.cardInput.responseDocCatsInput.forEach(ele => {
        if (element.code === ele.value) {
          docTypeArray.push(ele.code);
        }
        if (element.value === 'Notice of Hearing' || element.value === 'Onsite Assessment') {
          this.isThirtyMB = true;
        }
      });
    });
    if (docTypeArray.includes('Appeals')) {
      this.documentName = 'Appeals';
    } else if (docTypeArray.includes('Transitions')) {
      this.documentName = 'Transitions';
    } else if (docTypeArray.includes('Change Management')) {
      this.documentName = 'Change Management';
    } else if (docTypeArray.includes('PAE Documentation (Only for KB)')) {
      this.documentName = 'PAE Documentation (Only for KB)';
    } else if (docTypeArray.includes('PAE Documentation (Non-KB)')) {
      this.documentName = 'PAE Documentation (Non-KB)';
    } else if (docTypeArray.includes('ECF Referral Intake Documents')) {
      this.documentName = 'ECF Referral Intake Documents';
    }
  }

  onSave() {
    this.submitted = true;
    this.errorText = false;
    if (!this.docType || !this.docDesc || this.docDesc === '' || this.docType.length === 0) {
      this.errorText = true;
      return;
    }
    if (this.documents.length === 0) {
      this.errorText = true;
      return;
    }
    const tempArray = this.cardInput;
    tempArray.documentsInput = this.documents;
    tempArray.filesInput = this.files;
    tempArray.docDescInput = this.docDesc;
    tempArray.docTypeInput = this.selectedItems;
    this.cardInput = tempArray;
    this.saveFromChild.emit(this.cardInput);
  }

  onCancel() {
    this.cancelFromChild.emit(this.cardInput);
  }

  ngOnDestroy() {
    if (this.subscriptions$ && this.subscriptions$.length > 0) {
      this.subscriptions$.forEach(subscription$ => subscription$.unsubscribe());
    }
  }

}
