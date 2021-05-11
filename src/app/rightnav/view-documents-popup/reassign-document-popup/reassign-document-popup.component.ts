import { EventEmitter, Output } from '@angular/core';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ToastrService } from 'ngx-toastr';
import { RightnavComponent } from '../../rightnav.component';
import { RightNavTaskService } from '../../services/rightnav.service';

@Component({
  selector: 'app-reassign-document-popup',
  templateUrl: './reassign-document-popup.component.html',
  styleUrls: ['./reassign-document-popup.component.scss']
})
export class ReassignDocumentPopupComponent implements OnInit, OnDestroy {

  @Input() reassignDocs: any;
  @Input() applicantName: any;
  @Input() docCats: any;
  @Input() data: any;
  @Output() navigateBackToDocs = new EventEmitter<any>();

  subscriptions$ = [];
  showCard = false;
  documentsError = false;
  recordsError = false;
  selectedDocuments = [];
  selectedRecords = [];
  documentSettings: IDropdownSettings;
  recordsSettings: IDropdownSettings;
  documentErrorText = '';
  recordsErrorText = '';
  documentsList = [];
  recordsList = [];
  isApplicantRecords = false;
  isDocumentTypes = false;
  responseDocCats = [];
  isShowSpinner = false;

  constructor(
              private rightNavTaskService: RightNavTaskService,
              private toastrService: ToastrService) { }

  ngOnInit() {
    this.getApplicantRecords();
    this.getDocTypesandDocCats();
    this.documentSettings = {
      singleSelection: false,
      idField: 'code',
      textField: 'value',
      enableCheckAll: false,
      allowSearchFilter: false
    };
    this.recordsSettings = {
      singleSelection: false,
      idField: 'code',
      textField: 'value',
      enableCheckAll: false,
      allowSearchFilter: false,
      noDataAvailablePlaceholderText: 'No Records available for the Applicant'
    };
    this.reassignDocs.documentType.forEach(element => {
      this.docCats.forEach(ele => {
        if (ele.code === element) {
          this.selectedDocuments.push(ele);
        }
      });
    });
  }

  // closeDialog() {
  //   this.dialogRef.close();
  // }

  getApplicantRecords() {
    this.isShowSpinner = true;
    const ApplicantRecordsSubscriptions = this.rightNavTaskService.getApplicantRecords(this.reassignDocs.prsnId,
      this.reassignDocs.documentId).subscribe(response => {
        this.isShowSpinner = false;
        if (response && !response.errorCode) {
          const tempArray = [];
          response.forEach(element => {
            const tempObj = {
              value: element,
              code: element
            };
            tempArray.push(tempObj);
          });
          this.isApplicantRecords = true;
          this.recordsList = tempArray;
          this.recordsList.forEach(element => {
            if (element.value === this.data.paeId ||
              element.value === this.data.aplId ||
              element.value === this.data.refId) {
              this.selectedRecords.push(element);
            }
          });
        }
      }, error => {
        this.isShowSpinner = false;
      });
    this.subscriptions$.push(ApplicantRecordsSubscriptions);
  }

  getDocTypesandDocCats() {
    let input = '';
    if (this.data.prsnId) {
      input = input + 'personId=' + this.data.prsnId;
    }
    if (this.data.refId) {
      if (input === '') {
        input = input + 'refId=' + this.data.refId;
      } else {
        input = input + '&refId=' + this.data.refId;
      }
    }
    if (this.data.paeId) {
      if (input === '') {
        input = input + 'paeId=' + this.data.paeId;
      } else {
        input = input + '&paeId=' + this.data.paeId;
      }
    }
    if (this.data.aplId) {
      if (input === '') {
        input = input + 'aplId=' + this.data.aplId;
      } else {
        input = input + '&aplId=' + this.data.aplId;
      }
    }
    const DocTypesDocCatsSubscriptions$ = this.rightNavTaskService.getDocTypesandDocCats(input).subscribe(response => {
      const res = response.response;
      if (res.Appeals && res.Appeals.length > 0) {
        res.Appeals.forEach(element => {
          this.responseDocCats.push(element);
        });
      }
      if (res['PAE Documentation (Non-KB)'] && res['PAE Documentation (Non-KB)'].length > 0) {
        res['PAE Documentation (Non-KB)'].forEach(element => {
          this.responseDocCats.push(element);
        });
      }
      if (res.Transitions && res.Transitions.length > 0) {
        res.Transitions.forEach(element => {
          this.responseDocCats.push(element);
        });
      }
      if (res['Change Management'] && res['Change Management'].length > 0) {
        res['Change Management'].forEach(element => {
          this.responseDocCats.push(element);
        });
      }
      if (res['PAE Documentation (Only for KB)'] && res['PAE Documentation (Only for KB)'].length > 0) {
        res['PAE Documentation (Only for KB)'].forEach(element => {
          this.responseDocCats.push(element);
        });
      }
      if (res['ECF Referral Intake Documents'] && res['ECF Referral Intake Documents'].length > 0) {
        res['ECF Referral Intake Documents'].forEach(element => {
          this.responseDocCats.push(element);
        });
      }
      const tempArray = [];
      this.docCats.forEach(element => {
        this.responseDocCats.forEach(ele => {
          if (ele === element.code) {
            tempArray.push(element);
          }
        });
      });
      this.isDocumentTypes = true;
      this.documentsList = tempArray;
    });
    this.subscriptions$.push(DocTypesDocCatsSubscriptions$);
  }

  viewDoc() {
    this.isShowSpinner = true;
    const docId = this.reassignDocs.documentId;
    const DocByDocIDSubscriptions$ = this.rightNavTaskService.getDocByDocId(docId).subscribe(response => {
      this.isShowSpinner = false;
      if (response && response.document) {
        this.debugBase64('data:application/pdf;base64,' + response.document);
      } else {
        this.toastrService.error('Document not found');
      }
    }, error => {
      this.toastrService.error('Error viewing the document');
      this.isShowSpinner = false;
    });
    this.subscriptions$.push(DocByDocIDSubscriptions$);
  }

  debugBase64(base64URL) {
    const win = window.open();
    win.document.write('<iframe src="' + base64URL + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>');
  }

  navigateBack() {
    this.navigateBackToDocs.emit(false);
  }

  contactCardOver() {
    this.showCard = true;
  }

  contactCardLeave() {
    this.showCard = false;
  }

  saveDocTypes() {
    this.documentsError = false;
    this.recordsError = false;
    this.isShowSpinner = true;
    if (this.selectedDocuments.length === 0) {
      this.documentsError = true;
      this.documentErrorText = 'Please select at least one Document Type.';
      return;
    }
    const docTypeRequest = [];
    this.selectedDocuments.forEach(element => {
      docTypeRequest.push(element.code);
    });
    const payload = {
      docTypes: docTypeRequest,
      documentId: this.reassignDocs.documentId
    };
    const ChangeDocumentSubscriptions = this.rightNavTaskService.changeDocumentType(payload).subscribe(response => {
      this.isShowSpinner = false;
      if (response && response.message === 'Success') {
        this.toastrService.success('Document types updated successfully');
      } else {
        this.documentsError = true;
        this.documentErrorText = response.message;
        this.toastrService.error(response.message);
      }
    }, error => {
      this.isShowSpinner = false;
      this.documentsError = true;
      this.documentErrorText = 'Document types are not updated. Please try again.';
      this.toastrService.error('Document types are not updated');
    });
    this.subscriptions$.push(ChangeDocumentSubscriptions);
  }

  saveApplicantRecord() {
    this.documentsError = false;
    this.isShowSpinner = true;
    this.recordsError = false;
    if (this.selectedRecords.length === 0) {
      this.recordsError = true;
      this.recordsErrorText = 'Please select at least one record to be added.';
      return;
    }
    const recordsPayload = [];
    this.selectedRecords.forEach(element => {
      recordsPayload.push(element.code);
    });
    const payload = {
      docId: this.reassignDocs.documentId,
      records: recordsPayload
    };
    const AddDocToRecordSubscriptions = this.rightNavTaskService.addDocToRecord(payload).subscribe(response => {
      this.isShowSpinner = false;
      if (response && response.message === 'Success') {
        this.toastrService.success('Records are added successfully');
      } else {
        this.recordsError = true;
        this.recordsErrorText = response.message;
        this.toastrService.error(response.message);
      }
    }, error => {
      this.isShowSpinner = false;
      this.recordsError = true;
      this.recordsErrorText = 'Records are not added to the Applicant. Please try again.';
      this.toastrService.error('Records are not added to the Applicant');
    });
    this.subscriptions$.push(AddDocToRecordSubscriptions);
  }

  ngOnDestroy() {
    if (this.subscriptions$ && this.subscriptions$.length > 0) {
      this.subscriptions$.forEach(subscription$ => subscription$.unsubscribe());
    }
  }

}
