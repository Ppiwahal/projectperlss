import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ToastrService } from 'ngx-toastr';
import { DocumentsService } from 'src/app/core/services/documents/documents.service';

@Component({
  selector: 'app-reassign-document',
  templateUrl: './reassign-document.component.html',
  styleUrls: ['./reassign-document.component.scss'],
})

export class ReassignDocumentComponent implements OnInit, OnDestroy {

  subscriptions$ = [];
  applicantInformation: any;
  document: any;
  selectedDocuments = [];
  selectedRecords = [];
  documentSettings: IDropdownSettings;
  recordsSettings: IDropdownSettings;
  documentsList = [];
  recordsList = [];
  documentsError = false;
  recordsError = false;
  documentErrorText = '';
  recordsErrorText = '';
  isShowTypeAndRecords = false;
  isShowSpinner = false;

  constructor(private documentsService: DocumentsService, private router: Router, private toastrService: ToastrService) { }

  ngOnInit() {
    this.applicantInformation = this.documentsService.getHistoryData();
    this.documentsList = history.state.documentStatus;
    this.document = history.state.document;
    this.getApplicantRecords();
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
    this.document.documentType.forEach(element => {
      this.documentsList.forEach(ele => {
        if (ele.code === element) {
          this.selectedDocuments.push(ele);
        }
      });
    });
  }

  getApplicantRecords() {
    this.isShowSpinner = true;
    const ApplicantRecordsSubscriptions = this.documentsService.getApplicantRecords(this.applicantInformation.prsnId,
      this.document.documentId).subscribe(response => {
        this.isShowSpinner = false;
        this.isShowTypeAndRecords = true;
        if (response && !response.errorCode) {
          response.forEach(element => {
            const tempObj = {
              value: element,
              code: element
            };
            this.recordsList.push(tempObj);
          });
          this.recordsList.forEach(element => {
            if (element.value === this.applicantInformation.paeId ||
              element.value === this.applicantInformation.aplId ||
              element.value === this.applicantInformation.refId) {
                this.selectedRecords.push(element);
            }
          });
        }
      }, error => {
        this.isShowSpinner = false;
        this.isShowTypeAndRecords = true;
      });
    this.subscriptions$.push(ApplicantRecordsSubscriptions);
  }

  saveDocTypes() {
    this.documentsError = false;
    this.recordsError = false;
    if (this.selectedDocuments.length === 0) {
      this.documentsError = true;
      this.documentErrorText = 'Please select at least one Document Type.';
      return;
    }
    this.isShowSpinner = true;
    const docTypeCode = [];
    const docTypeValue = [];
    this.selectedDocuments.forEach(element => {
      docTypeCode.push(element.code);
      docTypeValue.push(element.value);
    });
    const payload = {
      docTypes: docTypeCode,
      documentId: this.document.documentId
    };
    const ChangeDocumentSubscriptions = this.documentsService.changeDocumentType(payload).subscribe(response => {
      this.isShowSpinner = false;
      if (response && response.message === 'Success') {
        this.toastrService.success('Document types updated successfully');
      } else {
        this.documentsError = true;
        this.documentErrorText = 'Document types are not updated. Please try again.';
      }
    }, error => {
      this.isShowSpinner = false;
      this.documentsError = true;
      this.documentErrorText = 'Document types are not updated. Please try again.';
    });
    this.subscriptions$.push(ChangeDocumentSubscriptions);
  }

  saveApplicantRecord() {
    this.documentsError = false;
    this.recordsError = false;
    if (this.selectedRecords.length === 0) {
      this.recordsError = true;
      this.recordsErrorText = 'Please select at least one record to be added.';
      return;
    }
    this.isShowSpinner = true;
    const recordsPayload = [];
    this.selectedRecords.forEach(element => {
      recordsPayload.push(element.code);
    });
    const payload = {
      docId: this.document.documentId,
      records: recordsPayload
    };
    const AddDocToRecordSubscriptions = this.documentsService.addDocToRecord(payload).subscribe(response => {
      this.isShowSpinner = false;
      if (response && response.message === 'Success') {
        this.toastrService.success('Applicant records updated successfully');
      } else {
        this.recordsError = true;
        this.recordsErrorText = 'Records were not updated for this document. Please try again.';
      }
    }, error => {
      this.isShowSpinner = false;
      this.recordsError = true;
      this.recordsErrorText = 'Records were not updated for this document. Please try again.';
    });
    this.subscriptions$.push(AddDocToRecordSubscriptions);
  }

  viewDoc(document) {
    const DocByIdSubscriptions = this.documentsService.getDocByDocId(document.documentId).subscribe(response => {
      if (response && response.document) {
        this.debugBase64('data:application/pdf;base64,' + response.document);
      }
    });
    this.subscriptions$.push(DocByIdSubscriptions);
  }

  debugBase64(base64URL) {
    const win = window.open();
    win.document.write('<iframe src="' + base64URL + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>');
  }

  navigateToHistory() {
    this.router.navigate(['/ltss/documents/history']);
  }

  ngOnDestroy() {
    if (this.subscriptions$ && this.subscriptions$.length > 0) {
      this.subscriptions$.forEach(subscription$ => subscription$.unsubscribe());
    }
  }

}
