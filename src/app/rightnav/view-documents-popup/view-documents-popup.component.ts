import { HttpClient } from '@angular/common/http';
import {Component, OnInit, OnDestroy, Input, SimpleChanges, OnChanges, Output, EventEmitter} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';
import { EnvService } from 'src/app/_shared/utility/env.service';
import { RightNavTaskService } from '../services/rightnav.service';
import { MatDialog } from '@angular/material/dialog';
import { DeleteRecordPopupComponent } from '../../_shared/modal/delete-record-popup/delete-record-popup.component';

@Component({
  selector: 'app-view-documents-popup',
  templateUrl: './view-documents-popup.component.html',
  styleUrls: ['./view-documents-popup.component.scss']
})
export class ViewDocumentsPopupComponent implements OnInit, OnChanges, OnDestroy {

  subscriptions$ = [];
  documentsList = [];
  isReassign = false;
  reassignDocs: any;
  docCats = [];
  isNoDocs = false;
  serverApiUrl: any;
  @Input() data;
  matDialogRef: any;
  @Output() closeDialogEvent = new EventEmitter();

  constructor(
              private rightNavTaskService: RightNavTaskService,
              private toastrService: ToastrService,
              private envService: EnvService,
              private http: HttpClient,
              public deleteDialogRef: MatDialog) { }

  ngOnInit() {
    this.serverApiUrl = this.envService.apiUrl();

  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes['data'] && changes['data'].previousValue !== changes['data'].currentValue) {
      console.log("data ",this.data);
      this.getDocumentStatusDropdowns();
    }
  }

  closeDialog() {
    this.closeDialogEvent.emit();
  }

  getDocumentStatusDropdowns() {
    const input = 'DOCUMENT_TYPE';
    const DocumentStatusDropdownSubscriptions = this.rightNavTaskService.getSearchDropdowns(input).subscribe(response => {
      this.docCats = response;
      this.getDocByPersonId();
    });
    this.subscriptions$.push(DocumentStatusDropdownSubscriptions);
  }

  getDocByPersonId() {
    let searchId = '';
    if (this.data.paeId) {
      searchId = 'paeId=' + this.data.paeId;
    } else if (this.data.refId) {
      searchId = 'refId=' + this.data.refId;
    } else if (this.data.aplId) {
      searchId = 'aplId=' + this.data.aplId;
    }
    const DocByPersonSubscriptions = this.rightNavTaskService.getDocByPersonId(this.data.prsnId, searchId).subscribe(response => {
      if (response && response[0].documentVO.length > 0) {
        response[0].documentVO.forEach(element => {
          const formattedDate = new Date(element.createdDt);
          element.createdDateFormat = formattedDate;
          const displayDate = element.createdDt.split(' ')[0];
          element.displayDate = displayDate;
          element.showCard = false;
          if (element.documentType && element.documentType.length > 0) {
            let tempDocType = '';
            element.documentType.forEach(ele => {
              this.docCats.forEach(res => {
                if (res.code === ele) {
                  if (tempDocType !== '') {
                    tempDocType = tempDocType + ' , ' + res.value;
                  } else {
                    tempDocType = res.value;
                  }
                }
              });
            });
            element.docType = tempDocType;
          } else {
            element.docType = 'No Doc Type';
          }
        });
        this.documentsList = response[0].documentVO.sort((a, b) => b.createdDateFormat - a.createdDateFormat);
      } else {
        this.isNoDocs = true;
      }
    }, error => {
      this.toastrService.error("Internal Server Error!");
    });
    this.subscriptions$.push(DocByPersonSubscriptions);
  }

  contactCardOver(docs) {
    docs.showCard = true;
  }

  contactCardLeave(docs) {
    docs.showCard = false;
  }

  getPDF(element) {
    const url = `${this.serverApiUrl.API_URL}/filenet/readDocument?guid=${element.genDocumentId}`;
    return this.http.get(url, { responseType:'arraybuffer' }).pipe(map(response => {
      return response;
    }));
  }

  viewDoc(doc) {
    if (doc.genDocumentId) {
      this.getPDF(doc).subscribe(response => {
        const array8 = new Uint8Array(response);
        const file = new Blob([array8], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      });
    } else {
      const DocByDocIDSubscriptions$ = this.rightNavTaskService.getDocByDocId(doc.documentId).subscribe(response => {
        if (response && response.document) {
          this.debugBase64('data:application/pdf;base64,' + response.document);
        } else {
        }
      }, error => {
        this.toastrService.error("Internal Server Error!");
      });
      this.subscriptions$.push(DocByDocIDSubscriptions$);
    }
  }

  debugBase64(base64URL){
    const win = window.open();
    win.document.write('<iframe src="' + base64URL  + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>');
  }

  reassignDoc(docs) {
    this.reassignDocs = docs;
    this.isReassign = true;
  }

  navigateBackToDocs(value) {
    this.isReassign = false;
    this.documentsList = [];
    this.getDocByPersonId();
  }

  showDeleteConfirmDialog(docs)  {
    this.matDialogRef = this.deleteDialogRef.open(DeleteRecordPopupComponent, {
      width: '810px',
      height: 'auto',
    });
    this.matDialogRef.afterClosed()
      .subscribe((isDelete) => {
        if (isDelete.isDelete) {
            this.deleteDoc(docs)
        } else {
          console.log('Delete Rejected');
        }
      });
  }

  deleteDoc(docs) {
    this.rightNavTaskService.deleteDocument(docs.documentId).subscribe(response => {
      if (response && response.message) {
        this.toastrService.success('Document deleted successfully');
        const tempArray = this.documentsList.filter(element => {
          return element.documentId !== docs.documentId;
        });
        this.documentsList = tempArray;
      } else {
        this.toastrService.error('Error deleting document');
      }
    }, error => {
      this.toastrService.error('Error deleting document');
    });
  }

  ngOnDestroy() {
    if (this.subscriptions$ && this.subscriptions$.length > 0) {
      this.subscriptions$.forEach(subscription$ => subscription$.unsubscribe());
    }
  }

}
