import { animate, state, style, transition, trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';
import { RightnavToggleService } from 'src/app/_shared/services/rightnav-toggle.service';
import { EnvService } from 'src/app/_shared/utility/env.service';
import { AppealService } from '../../services/appeal.service';
import * as Constants from '../../../_shared/constants/application.constants';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-case-referral-packet',
  templateUrl: './case-referral-packet.component.html',
  styleUrls: ['./case-referral-packet.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class CaseReferralPacketComponent implements OnInit, OnDestroy, OnChanges {

  @Input() appealId: any;
  @Input() nohDueDate: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Output() enableSave = new EventEmitter();

  serverApiUrl: any;
  displayedColumns = ['documentType', 'selection'];
  dataSource: MatTableDataSource<any>;
  displayedColumns2 = ['actionPerformed', 'date', 'user', 'NOHStatus', 'userActions'];
  dataSource2: MatTableDataSource<any>;
  expandedElement: any | null;
  hearingPersonnel = [];
  userId: any;
  documentTypes: any;
  isShowDownloadZip = false;
  selectedDocuments = [];
  isNohDueDate = false;
  nohStatus: any;
  isShowDocs = false;
  isShowNoh = false;
  subscriptions$ = [];
  startDate = new Date();

  constructor(private appealService: AppealService,
              private toastrService: ToastrService,
              private envService: EnvService,
              private http: HttpClient,
              private rightnavToggleService: RightnavToggleService) { }

  ngOnChanges() {
    if (this.nohDueDate) {
      this.isNohDueDate = true;
    } else {
      this.isNohDueDate = false;
    }
  }

  ngOnInit() {
    const timeTravelData = localStorage.getItem('TIME_TRAVEL_DATA');
    if(timeTravelData) {
      const timeTravelDataJson = JSON.parse(CryptoJS.AES.decrypt(timeTravelData, Constants.APP_ENC_DECRYPT_KEY).toString(CryptoJS.enc.Utf8));
      console.log("timeTravelDataJson ", timeTravelDataJson);
      if(timeTravelDataJson.timeTravelFlag && timeTravelDataJson.currentDate) {
        this.startDate = new Date(timeTravelDataJson.currentDate);
      }
    }
    this.serverApiUrl = this.envService.apiUrl();
    this.getDocumentType();
    const localStorageLocal = localStorage.getItem('APP_STORAGE_TOKEN');
    this.userId = JSON.parse(localStorageLocal).userName;
    this.getNohStatus();
  }

  getNohStatus() {
    const GetNohStatusSubscriptions = this.appealService.getStaticDataValue('NOH_STATUS').subscribe(response => {
      this.nohStatus = response;
    });
    this.subscriptions$.push(GetNohStatusSubscriptions);
  }

  getDocumentType() {
    const GetDocumentTypeSubscriptions = this.appealService.getStaticDataValue('DOCUMENT_TYPE').subscribe(response => {
      if (response && response.length > 0) {
        this.documentTypes = response;
        this.getDocByAplId();
      }
    });
    this.subscriptions$.push(GetDocumentTypeSubscriptions);
  }

  getDocByAplId() {
    const GetDocByAplIdSubscriptions = this.appealService.getDocByAplId(this.appealId).subscribe(response => {
      this.documentTypes.forEach(element => {
        response.forEach(ele => {
          if (element.code === ele.documentType) {
            ele.docType = element.value;
          }
        });
      });
      this.isShowDocs = true;
      this.dataSource = new MatTableDataSource(response);
      this.dataSource.paginator = this.paginator;
    });
    this.subscriptions$.push(GetDocByAplIdSubscriptions);
  }

  docSearch(element) {
    this.appealService.getDocByDocId(element.documentId).subscribe(response => {
      if (response && response.document) {
        this.debugBase64('data:application/pdf;base64,' + response.document);
      } else if (response && response.errorCode && response.errorCode[0].description) {
        this.toastrService.error(response.errorCode[0].description);
      }
    }, error => {
      this.toastrService.error('No record found with this document Id');
    });
  }

  uploadRightNav() {
    this.rightnavToggleService.setAppealSelectUploadFlag(true);
  }

  upload(file: File, element) {
    console.log(file);
  }

  debugBase64(base64URL) {
    const win = window.open();
    win.document.write('<iframe src="' + base64URL + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>');
  }

  documentSelected(element) {
    element.isSelected = !element.isSelected;
  }

  getAllDocZipByAplId() {
    const payload = [];
    this.selectedDocuments.forEach(element => {
      const docs = {
        documentId: element.documentId,
        documentType: element.documentType,
        aplId: this.appealId,
        doc: element.doc
      };
      payload.push(docs);
    });
    this.downloadZip(payload).subscribe(response => {
      console.log(response);
    });
    // const GetAllDocZipByAplIdSubscriptions = this.appealService.getAllDocZipByAplId(payload).subscribe(response => {
    //   console.log(response);
    // });
    // this.subscriptions$.push(GetAllDocZipByAplIdSubscriptions);
  }

  downloadZip(payload) {
    const url = `${this.serverApiUrl.API_URL}/appeal/hearing/caseReferralPacket/getAllDocZipByAplId`;
    return this.http.post(url, payload, { responseType:'arraybuffer' }).pipe(map(response => {
      return response;
    }));
  }

  submitOGC() {
    this.selectedDocuments = [];
    this.dataSource.data.forEach(element => {
      if (element.isSelected) {
        this.selectedDocuments.push(element);
      }
    });
    if (this.selectedDocuments.length > 0) {
      const payloadDocuments = [];
      this.selectedDocuments.forEach(element => {
        const docs = {
          doc: element.doc,
          docDesc: element.docDesc,
          documentId: element.documentId,
          documentType: element.documentType
        };
        payloadDocuments.push(docs);
      });
      const payload = {
        aplId: this.appealId,
        nohActionPerformeCd: 'test',
        statusCd: 'noh',
        user: this.userId,
        caseReferralPacketResponseVOs: payloadDocuments
      };
      const UploadDocByAplIdSubscriptions = this.appealService.uploadDocByAplId(payload).subscribe(response => {
        if (response && !response.errorCode) {
          this.nohdetails();
          this.isShowDownloadZip = true;
          this.enableSave.emit(true);
          this.toastrService.success('Document submitted successfully.');
        } else {
          this.toastrService.error('Failed to submit document');
        }
      }, error => {
        this.toastrService.error('Failed to submit document');
      });
      this.subscriptions$.push(UploadDocByAplIdSubscriptions);
    } else {
      this.toastrService.error('Please select at least one document to submit for OGC');
    }
  }

  nohdetails() {
    const NohDetailsSubscriptions = this.appealService.nohdetails(this.appealId).subscribe(response => {
      this.isShowNoh = true;
      this.dataSource2 = new MatTableDataSource(response);
      this.dataSource2.paginator = this.paginator;
    });
    this.subscriptions$.push(NohDetailsSubscriptions);
  }

  submitNOH() {
    const payload = {
      aplId: this.appealId
    };
    const NohSubmitSubscriptions = this.appealService.nohSubmit(payload).subscribe(response => {
      if (response && response.aplId) {
        this.nohdetails();
      }
    });
    this.subscriptions$.push(NohSubmitSubscriptions);
  }

  ngOnDestroy() {
    if (this.subscriptions$ && this.subscriptions$.length > 0) {
      this.subscriptions$.forEach(subscription$ => subscription$.unsubscribe());
    }
  }

}
