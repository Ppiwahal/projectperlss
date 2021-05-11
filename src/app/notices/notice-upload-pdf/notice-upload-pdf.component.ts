import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Form, FormBuilder, FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {NoticesService} from '../services/notices.service';
import * as customValidation from '../../_shared/constants/validation.constants';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-notice-upload-pdf',
  templateUrl: './notice-upload-pdf.component.html',
  styleUrls: ['./notice-upload-pdf.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class NoticeUploadPdfComponent implements OnInit {
  uploadForm: FormGroup;
  files: any[] = [];
  myForm: FormGroup;
  searchForm: FormGroup;
  tableData = [];
  isAccordionShow = false;
  isUploaded = false;
  @Output() emitUploadForm = new EventEmitter();
  @Input() submitStep3: boolean;
  customValidation = customValidation;

  @Input() personId: number;
  @Input() allowMultiple: boolean;
  fileErrors: any;

  documentIds: any[] = [];

  constructor(
              private fb: FormBuilder,
              private toastr: ToastrService,
              private noticeService: NoticesService) { }

  ngOnInit(): void {
    this.uploadForm = this.fb.group({
      uploadFile: ['', Validators.required],
    });
    this.noticeService.submitStep3.subscribe(res => {
      if (res) {
        if ((Object.keys(this.fileErrors).length === 0) && this.documentIds) {
                console.log('emitting doc ids ');
                this.emitUploadForm.emit(this.documentIds);
              }
      }
    });

    this.myForm = this.fb.group({
      docType:[null, Validators.required],
      docDesc: [null, Validators.required]
    });
  }


  fileBrowseHandler(files) {
    this.prepareFilesList(files);
  }


  prepareFilesList(files: Array<any>) {
    this.fileErrors = {};
    this.files = [];
    for (const file of files) {
      file.progress = 0;
      if (file.size >= 5 * 1024 * 1024) {
        this.fileErrors.maxSizeErr = true;

      } else if (!file.type.match('application/pdf')) {
        this.fileErrors.fileTypeErr = true;

      }  else if ((file.name.length > 30)) {
        this.fileErrors.fileNameErr = true;

      }  else {
        const stringReader = new FileReader();
        stringReader.readAsBinaryString(file);
        stringReader.onloadend = res => {
          const count = stringReader.result.toString().match(/\/Type[\s]*\/Page[^s]/g).length;
          console.log('Number of Pages:', count );
          const coOrdinates = stringReader.result.toString().match(/\/MediaBox(.*)\//g);
          let isDesiredSizePdf = true;
          coOrdinates.forEach(value => {
            const viewPorts = value.substring(value.indexOf('[') + 1, value.indexOf(']'));
            const dimensions:any = viewPorts.split(' ');
            if(dimensions && dimensions.length === 4) {
              const width = (dimensions[2] / 72);
              const height = (dimensions[3] / 72);
              console.log('width ', width);
              console.log('height ', height);
              if(width !== 8.5 || height !== 11) {
                isDesiredSizePdf = false;
              }
            }
          });
          if(!isDesiredSizePdf) {
            this.fileErrors.isPageSizeErr = true;
          } else {
            this.files.push(file);
          }

        };

      }

    }
  }

  uploadFile() {
    const payload = [{
      prsnId: this.personId,
      aplPdfTypeCd: null,
      aplRequestId: null,
      appPdfSw: null,
      destinationCd: null,
      genDocumentId: null,
      paeId: null,
      pageId: null,
      refId: null,
      documentType: [
        null
      ],
      docDesc: null,
      documents: null
    }];
    const documents = [];
    this.files.forEach(file => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = rs => {
        const pdfData = reader.result.toString().startsWith('data:application/pdf;base64,') ? reader.result.toString().replace('data:application/pdf;base64,', '') : reader.result.toString()
        ;
        documents.push(
            {
              document: pdfData
            }
        );
        payload[0].documents = documents;
        if (this.files.length === documents.length) {
          this.documentIds = [];
          this.noticeService.uploadFile(payload).subscribe(res => {
            this.isUploaded = true;
            if(res && res.errorCode && res.errorCode.length > 0) {
              this.toastr.error(res.errorCode[0].description);
              return;
            }

            res.forEach((docRes, index) => {
              this.documentIds.push(docRes.documentId);
              this.files[index].documentId = docRes.documentId;
            });
            this.emitUploadForm.emit(this.documentIds);
            this.toastr.success('Document uploaded successfully');
          }, (error) => {
            this.toastr.error('Internal Server Error');
          });
        }
      };
      reader.onerror = () => {
      };
    });

  }


  onSave(){
    if (this.myForm.valid) {
      console.log(this.files);
      this.tableData.push({...this.myForm.value, file:this.files[0]});
      this.files = [];
    }
    this.isAccordionShow = true;
  }

  onCancel(){
    this.files = [];
  }
  get f() {
    return this.uploadForm.controls;
   }

  deleteFile(index) {
    this.files.splice(index, 1);
    this.documentIds = this.files.map(file => file.documentId);
    this.emitUploadForm.emit(this.documentIds);
    if (this.files.length === 0) {
      this.isUploaded = false;
    }
  }

}
