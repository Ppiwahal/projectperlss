import { PaeCommonService } from './../../core/services/pae/pae-common/pae-common.service';
import { RightnavToggleService } from './../../_shared/services/rightnav-toggle.service';
import {Component, OnDestroy, OnInit, ViewChild, Input, OnChanges, SimpleChanges, Output, EventEmitter} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RightNavTaskService } from '../services/rightnav.service';
import { IntakeOutcomeService } from '../../core/services/referral/intake-outcome/intake-outcome.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';
import { DeleteRecordPopupComponent } from '../../_shared/modal/delete-record-popup/delete-record-popup.component';

@Component({
  selector: 'app-upload-documents-popup',
  templateUrl: './upload-documents-popup.component.html',
  styleUrls: ['./upload-documents-popup.component.scss']
})
export class UploadDocumentsPopupComponent implements OnInit, OnChanges, OnDestroy {

  subscriptions$ = [];
  documentStatus = [];
  files = [];
  documentSettings: IDropdownSettings;
  documentsList = [];
  selectedDocuments = [];
  documentsError = false;
  documentErrorText = '';
  showFiles = false;
  fileError = false;
  isSubmitted = false;
  fileText = '';
  documents = [];
  progressValue: any;
  documentId: null;
  cloudId: null;
  showPreselected = false;
  preselectedDocument: any;
  ready = false;
  success = false;
  docDesc = '';
  responseDocCats = [];
  responseList: any;
  errorText = '';
  isError = false;
  isRegError = false;
  paeStatus = [];
  matDialogRef: any;
  saved = false;
  isDocUpload = true;
  categoryCd: any;
  programCd: any;
  programCdPae: any;
  @ViewChild('documentUploadForm') documentUploadForm: NgForm;

  @Input() data:any;

  @Output() closeDialogEvent = new EventEmitter();

  constructor(
    private intakeOutcomeService: IntakeOutcomeService,
    private rightNavTaskService: RightNavTaskService,
    private toastrService: ToastrService,
    public deleteDialogRef: MatDialog,
    private rightnavToggleService: RightnavToggleService,
    private paeCommonService: PaeCommonService
  ) {


  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes['data'] && changes['data'].previousValue !== changes['data'].currentValue) {
      console.log("data ",this.data);
      this.cloudId = this.data.cloudId;
      this.categoryCd = this.rightnavToggleService.getRightNavCategoryCode();
      this.programCd = this.rightnavToggleService.getRightNavProgramCode();
      this.programCdPae = this.paeCommonService.getProgramName();
      this.getDocumentRequiredDropdown();
      this.getDocumentsDropdown();
      this.getPAEStatus();
    }
  }

  ngOnInit() {

    this.documentSettings = {
      singleSelection: false,
      idField: 'documentTypeCd',
      textField: 'documentName',
      enableCheckAll: false,
      allowSearchFilter: false
    };
  }

  getPAEStatus() {
    const PAEStatusDropdownSubscriptions$ = this.rightNavTaskService.getPAEStatus().subscribe(response => {
      this.paeStatus = response;
    });
    this.subscriptions$.push(PAEStatusDropdownSubscriptions$);
  }

  closeDialog() {
    if (this.preselectedDocument) {
      this.intakeOutcomeService.setDialogResult(this.data.documentId, this.success);
    }
    this.closeDialogEvent.emit();
  }

  getDocumentRequiredDropdown(){
    console.log(this.categoryCd);
    console.log(this.programCd);
    console.log(this.programCdPae);
    const DocumentsDropdownSubscriptions1$ = this.rightNavTaskService.getRequiredDocumentsDropdown(this.categoryCd, this.programCd).subscribe(response => {
      console.log(response);
      this.documentsList = response;
    }, error => {
      this.toastrService.error("Internal Server Error!");
    });
    this.subscriptions$.push(DocumentsDropdownSubscriptions1$);
  }

  getDocumentsDropdown() {
    const that = this;
    const DocumentsDropdownSubscriptions$ = this.rightNavTaskService.getDocumentsDropdown().subscribe(response => {
      let found = false;
      if (that.cloudId && !found) {
        for (let i = 0; i < response.length && !that.showPreselected; i++) {
          const a = response[i];
          if (a.code === that.cloudId) {
            that.preselectedDocument = a;
            that.selectedDocuments.push(a);
            found = true;
            // that.showPreselected = true;
          }
        }
      }
      that.ready = true;
      that.responseList = response;
      // that.getDocTypesandDocCats();
    }, error => {
      this.toastrService.error("Internal Server Error!");
    });
    this.subscriptions$.push(DocumentsDropdownSubscriptions$);
  }

  getDocTypesandDocCats() {
    const input = [];
    const that = this;
    ['prsnId', 'refId', 'paeId', 'aplId'].forEach(attr => {
      if (that.data[attr]) {
        input.push((attr === 'prsnId' ? 'personId' : attr) + '=' + that.data[attr]);
      }
    });
    const DocTypesDocCatsSubscriptions$ = this.rightNavTaskService.getDocTypesandDocCats(input.join('&')).subscribe(response => {
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
      this.responseList.forEach(element => {
        this.responseDocCats.forEach(ele => {
          if (element.code === ele) {
            tempArray.push(element);
          }
        });
      });
      this.documentsList = tempArray.sort((a, b) => (a.value > b.value) ? 1 : -1);
    }, error => {
      this.toastrService.error("Internal Server Error!");
    });
    this.subscriptions$.push(DocTypesDocCatsSubscriptions$);
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
        this.fileText = 'Please make sure the document uploaded is the .tiff, .bmp, .jpeg, .pdf, .xslx, or .docx format and under 2MB.';
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
  }

  getBase64(files) {
    this.documents = [];
    const reader = new FileReader();
    reader.readAsDataURL(files);
    reader.onload = () => {
      const value = reader.result.toString();
      const data = value.split(',')[1];
      this.documents.push({ document: data });
      if (this.files.length === this.documents.length) {
        this.uploadDocument();
      }
    };
  }

  docValidate() {
    const regex = new RegExp('^[^<>{}\"/|;:~^=*\\]\\\\()\\[¿§«»ω⊙¤°℃℉€¥£¢¡®©_+]*$');
    const valid = regex.test(this.docDesc);
    if (!valid && this.docDesc !== '') {
      this.isRegError = true;
    } else {
      this.isRegError = false;
    }
  }

  uploadDocument() {
    this.rightnavToggleService.setAppealOnsiteassessmentDocData(null);
    const docTypesPayload = [];
    let isMCODocType = false;
    this.selectedDocuments.forEach(element => {
      docTypesPayload.push(element.documentTypeCd);
      if (element.documentTypeCd === 'MCO') {
        isMCODocType = true;
      }
    });
    let pae;
    if (this.data.paeStatus) {
      this.paeStatus.forEach(element => {
        if (element.value === this.data.paeStatus) {
          pae = element.code;
        }
      });
    }
    const payload = {
      documents: this.documents,
      documentType: docTypesPayload,
      docDesc: this.docDesc,
    };
    const that = this;
    ['prsnId', 'aplPdfTypeCd', 'aplRequestId', 'appPdfSw',
      'destinationCd', 'genDocumentId', 'paeId',
      'pageId', 'refId', 'aplId'].forEach(f => {
        payload[f] = null;
      });

    ['refId', 'aplId', 'paeId', 'prsnId', 'pageId'].forEach(f => {
      const val = that.data[f];
      if (typeof val !== 'undefined') {
        payload[f] = val;
      }
    });
    const UploadFileSubscriptions = this.rightNavTaskService.uploadFile([payload]).subscribe(response => {
      if (response && !response.errorCode) {
        this.rightnavToggleService.setAppealOnsiteassessmentDocData(response);
        that.toastrService.success('Document(s) uploaded successfully');
        this.rightnavToggleService.onDynamicFormSubmit(this.isDocUpload);
        this.isSubmitted = false;
        if (isMCODocType) {
          const date = new Date();
          const month = date.getMonth() + 1;
          const payloadMCODate = date.getFullYear().toString() + '-' + month.toString() + '-' + date.getDate().toString() +
            ' ' + date.getHours().toString() + ':' + date.getMinutes().toString() + ':' + date.getSeconds().toString();
          console.log(date);
          console.log(date.getDate());
          console.log(payloadMCODate);
          const mcoPayload = {
            transactionID: 'P2TMCOc7fc3b58ae85462fa52af5d164fc2684',
            indvId: this.data.prsnId,
            ssn: parseInt(this.data.ssn),
            paeId: this.data.paeId ? this.data.paeId : null,
            paeEffectiveDate: '2020-01-20',
            paeEndDate: '2020-01-20',
            paeStatus: pae,
            dateTimeStamp: payloadMCODate,
            documentType: docTypesPayload,
            documentId: response.documentId,
            locCode: 'FAC',
            mcoCode: null,
            checklistUploadDate: payloadMCODate
          };
          const MCOchecklistSubscription$ = this.rightNavTaskService.mcochecklist(mcoPayload).subscribe(response => {
            console.log(response);
          });
          this.subscriptions$.push(MCOchecklistSubscription$);
        }
        this.documentUploadForm.reset();
        if (that.cloudId) {
          that.success = true;
        } else {
          that.files = [];
          that.fileError = false;
          that.documents = [];
          that.selectedDocuments = [];
          that.docDesc = '';
        }
      } else {
        that.isError = true;
        that.toastrService.error('Failed to upload the documents');
        that.errorText = 'Failed to upload the documents';
      }
    }, error => {
      that.isError = true;
      that.toastrService.error('Failed to upload the documents');
      that.errorText = 'Failed to upload the documents';
    });
    this.subscriptions$.push(UploadFileSubscriptions);
  }

  uploadFile() {
    this.isSubmitted = true;
    if(this.documentUploadForm && this.documentUploadForm.form.valid && this.files && this.files.length) {
      for (const file of this.files) {
        this.getBase64(file);
      }
    }
  }

  showDeleteConfirmDialog(file)  {
    this.matDialogRef = this.deleteDialogRef.open(DeleteRecordPopupComponent, {
      width: '810px',
      height: 'auto',
    });
    this.matDialogRef.afterClosed()
      .subscribe((isDelete) => {
        if (isDelete.isDelete) {
            this.deleteFile(file);
        } else {
          console.log('Delete Rejected');
        }
      });
  }

  deleteFile(file) {
    this.files = this.files.filter(element => {
      return file.name !== element.name;
    });
  }

  ngOnDestroy() {
    if (this.subscriptions$ && this.subscriptions$.length > 0) {
      this.subscriptions$.forEach(subscription$ => subscription$.unsubscribe());
    }
  }
}
