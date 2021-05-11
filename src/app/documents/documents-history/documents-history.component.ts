import { Component, DoCheck, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatPaginator } from '@angular/material/paginator';
import { DocumentsService } from 'src/app/core/services/documents/documents.service';
import { Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';
import { EnvService } from 'src/app/_shared/utility/env.service';
import { HttpClient } from '@angular/common/http';
import {MatDialog} from '@angular/material/dialog';
import * as customValidation from '../../_shared/constants/validation.constants';
import {DeleteRecordPopupComponent} from '../../_shared/modal/delete-record-popup/delete-record-popup.component';

@Component({
  selector: 'app-documents-history',
  templateUrl: './documents-history.component.html',
  styleUrls: ['./documents-history.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class DocumentsHistoryComponent implements OnInit, OnDestroy, DoCheck {

  subscriptions$ = [];
  documentSettings: IDropdownSettings;
  customValidation = customValidation;
  files: any[] = [];
  submitted = false;
  showAddBtnError = false;
  myForm: FormGroup;
  searchForm: FormGroup;
  displayedColumns: string[] = ['docType', 'ubloadDate', 'uploadedBy', 'userAction'];
  dataSource: MatTableDataSource<any>;
  expandedElement;
  applicantInformation: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  data = [];
  isShow = false;
  tableData = [];
  documents = [];
  filesToUpload = [];
  documentStatus = [];
  docAndCatStatus = [];
  responseDocCats: any[] = [];
  documentsAccordian = [];
  dataToCard = [];
  fileError = false;
  fileText = '';
  isThirtyMB = false;
  tableResponse = [];
  isDisableUpload = false;
  isShowAddDocument = false;
  serverApiUrl: any;
  showFiles = false;
  matDialogRef:any;

  constructor(private fb: FormBuilder,
              private documentsService: DocumentsService,
              private router: Router,
              private toastrService: ToastrService,
              private envService: EnvService,
              private http: HttpClient,
              private deleteDialogRef: MatDialog) { }

  ngOnInit(): void {
    this.serverApiUrl = this.envService.apiUrl();
    this.getDocumentStatusDropdowns();
    this.applicantInformation = this.documentsService.getHistoryData();
    this.documentSettings = {
      singleSelection: false,
      idField: 'code',
      textField: 'value',
      enableCheckAll: false,
      allowSearchFilter: false
    };
    this.myForm = this.fb.group({
      docType: [null, Validators.required],
      docDesc: [null, [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')] ]
    });
    this.getDocTypesandDocCats();
    this.getDocByPersonId();
  }

  getDocTypesandDocCats() {
    let input = '';
    if (this.applicantInformation.prsnId) {
      input = input + 'personId=' + this.applicantInformation.prsnId;
    }
    if (this.applicantInformation.refId) {
      if (input === '') {
        input = input + 'refId=' + this.applicantInformation.refId;
      } else {
        input = input + '&refId=' + this.applicantInformation.refId;
      }
    }
    if (this.applicantInformation.paeId) {
      if (input === '') {
        input = input + 'paeId=' + this.applicantInformation.paeId;
      } else {
        input = input + '&paeId=' + this.applicantInformation.paeId;
      }
    }
    if (this.applicantInformation.aplId) {
      if (input === '') {
        input = input + 'aplId=' + this.applicantInformation.aplId;
      } else {
        input = input + '&aplId=' + this.applicantInformation.aplId;
      }
    }
    const DocTypesDocCatsSubscriptions$ = this.documentsService.getDocTypesandDocCats(input).subscribe(response => {
      const res = response.response;
      if (res.Appeals && res.Appeals.length > 0) {
        let tempObj = {};
        res.Appeals.forEach(element => {
          tempObj = {
            code: 'Appeals',
            value: element
          };
          this.responseDocCats.push(tempObj);
          this.docAndCatStatus.push(element);
        });
      }
      if (res['PAE Documentation (Non-KB)'] && res['PAE Documentation (Non-KB)'].length > 0) {
        let tempObj = {};
        res['PAE Documentation (Non-KB)'].forEach(element => {
          tempObj = {
            code: 'PAE Documentation (Non-KB)',
            value: element
          };
          this.responseDocCats.push(tempObj);
          this.docAndCatStatus.push(element);
        });
      }
      if (res.Transitions && res.Transitions.length > 0) {
        let tempObj = {};
        res.Transitions.forEach(element => {
          tempObj = {
            code: 'Transitions',
            value: element
          };
          this.responseDocCats.push(tempObj);
          this.docAndCatStatus.push(element);
        });
      }
      if (res['Change Management'] && res['Change Management'].length > 0) {
        let tempObj = {};
        res['Change Management'].forEach(element => {
          tempObj = {
            code: 'Change Management',
            value: element
          };
          this.responseDocCats.push(tempObj);
          this.docAndCatStatus.push(element);
        });
      }
      if (res['PAE Documentation (Only for KB)'] && res['PAE Documentation (Only for KB)'].length > 0) {
        let tempObj = {};
        res['PAE Documentation (Only for KB)'].forEach(element => {
          tempObj = {
            code: 'PAE Documentation (Only for KB)',
            value: element
          };
          this.responseDocCats.push(tempObj);
          this.docAndCatStatus.push(element);
        });
      }
      if (res['ECF Referral Intake Documents'] && res['ECF Referral Intake Documents'].length > 0) {
        let tempObj = {};
        res['ECF Referral Intake Documents'].forEach(element => {
          tempObj = {
            code: 'ECF Referral Intake Documents',
            value: element
          };
          this.responseDocCats.push(tempObj);
          this.docAndCatStatus.push(element);
        });
      }
    });
    this.subscriptions$.push(DocTypesDocCatsSubscriptions$);
  }

  getDocumentStatusDropdowns() {
    const input = 'DOCUMENT_TYPE';
    const DocumentStatusDropdownSubscriptions = this.documentsService.getSearchDropdowns(input).subscribe(response => {
      this.documentStatus = response;
    });
    this.subscriptions$.push(DocumentStatusDropdownSubscriptions);
  }

  getDocByPersonId() {
    this.dataSource = new MatTableDataSource([]);
    this.dataSource.paginator = this.paginator;
    let searchId = '';
    if (this.applicantInformation.paeId) {
      searchId = 'paeId=' + this.applicantInformation.paeId;
    } else if (this.applicantInformation.refId) {
      searchId = 'refId=' + this.applicantInformation.refId;
    } else if (this.applicantInformation.aplId) {
      searchId = 'aplId=' + this.applicantInformation.aplId;
    }
    const DocByPersonSubscriptions = this.documentsService.getDocByPersonId(this.applicantInformation.prsnId, searchId)
      .subscribe(response => {
        if (response && response[0].documentVO.length > 0) {
          const tempResponseArray = response[0].documentVO;
          tempResponseArray.forEach(element => {
            const formattedDate = new Date(element.createdDt);
            element.createdDateFormat = formattedDate;
            let tempDocType = '';
            element.documentType.forEach(ele => {
              this.documentStatus.forEach(res => {
                if (res.code === ele) {
                  if (tempDocType !== '') {
                    tempDocType = tempDocType + ', ' + res.value;
                  } else {
                    tempDocType = res.value;
                  }
                }
              });
            });
            element.docType = tempDocType;
          });
          this.tableResponse = tempResponseArray.sort((a, b) => b.createdDateFormat - a.createdDateFormat);
          this.dataSource = new MatTableDataSource(tempResponseArray);
          this.dataSource.paginator = this.paginator;
        } else {
          this.dataSource = new MatTableDataSource([]);
          this.dataSource.paginator = this.paginator;
        }
      }, error => {
        this.dataSource = new MatTableDataSource([]);
        this.dataSource.paginator = this.paginator;
      });
    this.subscriptions$.push(DocByPersonSubscriptions);
  }

  uploadFile() {
    this.submitted = true;
    if (this.isShow === true) {
      if (this.documents.length === 0 || this.myForm.value.docType.length === 0 || this.myForm.value.docDesc === '' || this.myForm.controls.docDesc.errors) {
        return;
      }
      if (this.myForm.value.docType && this.myForm.value.docDesc) {
        this.isDisableUpload = true;
        const docTypesPayload = [];
        this.myForm.value.docType.forEach(element => {
          docTypesPayload.push(element.code);
        });
        const payload = [{
          prsnId: this.applicantInformation.prsnId ? this.applicantInformation.prsnId : null,
          aplPdfTypeCd: null,
          aplRequestId: null,
          appPdfSw: null,
          destinationCd: null,
          genDocumentId: null,
          paeId: this.applicantInformation.paeId ? this.applicantInformation.paeId : null,
          pageId: null,
          refId: this.applicantInformation.refId ? this.applicantInformation.refId : null,
          aplId: this.applicantInformation.aplId ? this.applicantInformation.aplId : null,
          documents: this.documents,
          documentType: docTypesPayload,
          docDesc: this.myForm.value.docDesc,
        }];
        const UploadFileSubscriptions = this.documentsService.uploadFile(payload).subscribe(response => {
          if (this.dataToCard.length === 0) {
            this.isDisableUpload = false;
          }
          if (response && !response.errorCode) {
            this.files = [];
            this.documents = [];
            this.filesToUpload = [];
            this.tableData = [];
            this.isShow = false;
            if (this.dataToCard.length === 0) {
              this.getDocByPersonId();
            }
            this.toastrService.success('Document uploaded successfully');
          } else {
            this.isDisableUpload = false;
            this.toastrService.error('Error uploading the document');
          }
        }, error => {
          this.toastrService.error('Error uploading the document');
          this.isDisableUpload = false;
        });
        this.subscriptions$.push(UploadFileSubscriptions);
      }
    }
    if (this.dataToCard.length > 0) {
      const reloadCount = this.dataToCard.length;
      let currentCount = 0;
      this.isDisableUpload = true;
      const callsData = this.dataToCard;
      callsData.forEach(element => {
        currentCount++;
        const docTypesPayload = [];
        element.docTypeInput.forEach(ele => {
          docTypesPayload.push(ele.code);
        });
        const documentsPayload = [];
        element.documentsInput.forEach(ele => {
          const tempObj = {
            document: ele.document
          };
          documentsPayload.push(tempObj);
        });
        const payload = [{
          prsnId: this.applicantInformation.prsnId ? this.applicantInformation.prsnId : null,
          aplPdfTypeCd: null,
          aplRequestId: null,
          appPdfSw: null,
          destinationCd: null,
          genDocumentId: null,
          paeId: this.applicantInformation.paeId ? this.applicantInformation.paeId : null,
          pageId: null,
          refId: this.applicantInformation.refId ? this.applicantInformation.refId : null,
          aplId: this.applicantInformation.aplId ? this.applicantInformation.aplId : null,
          documents: documentsPayload,
          documentType: docTypesPayload,
          docDesc: element.docDescInput,
        }];
        const UploadFileSubscriptions = this.documentsService.uploadFile(payload).subscribe(response => {
          if (reloadCount === currentCount) {
            this.getDocByPersonId();
            this.isDisableUpload = false;
          }
          if (response && !response.errorCode) {
            this.dataToCard = this.dataToCard.filter(ele => {
              return ele.number !== element.number;
            });
            this.files = [];
            this.documents = [];
            this.filesToUpload = [];
            this.tableData = [];
            this.isShow = false;
            this.toastrService.success('Document uploaded successfully');
          } else {
            this.toastrService.error('Error uploading the document');
          }
        }, error => {
          if (reloadCount === currentCount) {
            this.getDocByPersonId();
            this.isDisableUpload = false;
          }
          this.toastrService.error('Error uploading the document');
        });
        this.subscriptions$.push(UploadFileSubscriptions);
      });
    }
  }

  fileBrowseHandler(files) {
    this.prepareFilesList(files);
  }

  formatSSN(val) {
    if (val) {
      const formstring = 'XXX-XX-' + val.slice(5, val.length);
      return formstring;
    } else {
      return '---';
    }
  }

  prepareFilesList(files) {
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
    if (this.isThirtyMB && file.size >= 30 * 1024 * 1024) {
      this.fileError = true;
      this.fileText = 'Please choose a file that is less than 30MB size.';
    } else if (!this.isThirtyMB && file.size >= 2 * 1024 * 1024) {
      this.fileError = true;
      this.fileText = 'Please choose a file that is less than 2MB size.';
    }
    else {
      this.fileError = false;
      this.files.push(file);
      this.getBase64(file);
    }
  }
  this.showFiles = true;
}

  getBase64(files) {
    const reader = new FileReader();
    reader.readAsDataURL(files);
    reader.onload = () => {
      const value = reader.result.toString();
      const data = value.split(',')[1];
      this.documents.push({ document: data });
    };
  }

  getPDF(element) {
    const url = `${this.serverApiUrl.API_URL}/filenet/readDocument?guid=${element.genDocumentId}`;
    return this.http.get(url, { responseType:'arraybuffer' }).pipe(map(response => {
      return response;
    }));
  }

  viewDoc(element) {
    if (element.genDocumentId) {
      this.getPDF(element).subscribe(response => {
        const array8 = new Uint8Array(response);
        const file = new Blob([array8], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      });
    } else {
      const DocByIdSubscriptions = this.documentsService.getDocByDocId(element.documentId).subscribe(response => {
        if (response && response.document) {
          this.debugBase64('data:application/pdf;base64,' + response.document);
        } else if (response && response.errorCode) {
          this.toastrService.error('Document is not found');
        }
      }, error => {
        this.toastrService.error('Error viewing the document');
      });
      this.subscriptions$.push(DocByIdSubscriptions);
    }
  }

  debugBase64(base64URL) {
    const win = window.open();
    win.document.write('<iframe src="' + base64URL + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>');
  }

  navigateToReassignDoc(doc) {
    const updatedDocStatus = [];
    this.documentStatus.forEach(element => {
      this.docAndCatStatus.forEach(ele => {
        if (element.code === ele) {
          updatedDocStatus.push(element);
        }
      });
    });
    this.documentStatus = updatedDocStatus.sort((a, b) => (a.value > b.value) ? 1 : -1);
    this.router.navigate(['/ltss/documents/reassign-document'],
      { state: { document: doc, documentStatus: this.documentStatus } });
  }

  deleteDoc(doc) {
    const DeleteDocumentSubscription = this.documentsService.deleteDocument(doc.documentId).subscribe(response => {
      if (response && response.message) {
        this.toastrService.success('Document is successfully deleted');
        const tempArray = this.tableResponse.filter(element => {
          return element.documentId !== doc.documentId;
        });
        this.tableResponse = tempArray;
        this.dataSource = new MatTableDataSource(tempArray);
        this.dataSource.paginator = this.paginator;
      } else {
        this.toastrService.error('Error deleting the document');
      }
    }, error => {
      this.toastrService.error('Error deleting the document');
    });
    this.subscriptions$.push(DeleteDocumentSubscription);
  }

  toggleDisplay() {
    if(this.applicantInformation && this.applicantInformation.paeStatus
          && (this.applicantInformation.paeStatus.toUpperCase() === 'CLOSED' ||
      this.applicantInformation.paeStatus.toUpperCase() === 'INACTIVE')) {
      this.showAddBtnError = true;
      return;
    }
    this.showAddBtnError = false;
    const updatedDocStatus = [];
    this.files = [];
    this.myForm.reset();
    this.documentStatus.forEach(element => {
      this.docAndCatStatus.forEach(ele => {
        if (element.code === ele) {
          updatedDocStatus.push(element);
        }
      });
    });
    const uniqueArray = [...new Map(updatedDocStatus.map(item => [item.code, item])).values()];
    this.documentStatus = uniqueArray.sort((a, b) => (a.value > b.value) ? 1 : -1);
    this.isShow = !this.isShow;
    this.isDisableUpload = false;
  }

  ngDoCheck() {
    if (this.documentStatus.length !== 0 && this.docAndCatStatus.length !== 0) {
      this.isShowAddDocument = true;
    }
  }

  cancelFromChild(data) {
    this.dataToCard = this.dataToCard.filter(element => {
      return element.number !== data.number;
    });
  }

  saveFromChild(data) {
    const tempArray = this.dataToCard;
    tempArray.forEach(element => {
      if (element.number === data.number) {
        data = element;
      }
    });
    this.dataToCard = tempArray;
  }

  onSave() {
    if (this.myForm.valid && this.documents.length !== 0) {
      this.files.forEach(element => {
        this.filesToUpload.push(element);
        this.tableData.push({ ...this.myForm.value, file: element });
      });
      const date = new Date();
      const numberToSave = date.getHours().toString() + date.getMinutes().toString() + date.getMilliseconds().toString();
      const tempObj = {
        number: numberToSave,
        documentStatusInput: this.documentStatus,
        filesInput: this.files,
        myFormInput: this.myForm,
        docTypeInput: this.myForm.value.docType,
        docDescInput: this.myForm.value.docDesc,
        responseDocCatsInput: this.responseDocCats,
        documentsInput: this.documents
      };
      this.dataToCard.push(tempObj);
      this.documents = [];
      this.submitted = false;
      this.isShow = !this.isShow;
    }
  }

  onItemSelect() {
    this.filesToUpload = [];
    let tempFlag: boolean;
    this.myForm.value.docType.forEach(element => {
      if (element.value === 'Notice of Hearing' || element.value === 'Onsite Assessment') {
        tempFlag = true;
      }
    });
    if (tempFlag === true) {
      this.isThirtyMB = true;
    } else {
      this.isThirtyMB = false;
    }
  }

  onItemDeSelect() {
    this.filesToUpload = [];
    let tempFlag: boolean;
    if (this.myForm.value.docType.length > 0) {
      this.myForm.value.docType.forEach(element => {
        if (element.value === 'Notice of Hearing' || element.value === 'Onsite Assessment') {
          tempFlag = true;
        }
      });
      if (tempFlag === true) {
        this.isThirtyMB = true;
      } else {
        this.isThirtyMB = false;
      }
    } else {
      this.isThirtyMB = false;
    }
  }

  onCancel() {
    this.files = [];
    this.documents = [];
    this.filesToUpload = [];
    this.tableData = [];
    this.myForm.reset();
    this.isShow = false;
    this.submitted = false;
    this.fileError = false;
    this.fileText = '';
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnDestroy() {
    if (this.subscriptions$ && this.subscriptions$.length > 0) {
      this.subscriptions$.forEach(subscription$ => subscription$.unsubscribe());
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

}
