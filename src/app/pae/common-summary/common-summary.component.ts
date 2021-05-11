import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PaeService } from 'src/app/core/services/pae/pae.service';
import { UploadDocumentsPopupComponent } from 'src/app/rightnav/upload-documents-popup/upload-documents-popup.component';
import { PaeDiagnosisSummaryDocument } from 'src/app/_shared/model/PaeDiagnosis/PaeDiagnosisSummaryDocument';
import { RightnavToggleService } from 'src/app/_shared/services/rightnav-toggle.service';
export interface SupportingDocsDetails {
  name: string;
  icon: string;
}

const ELEMENT_DATA2: SupportingDocsDetails[] = [
  { name: 'Cost Neutrality', icon: 'cloud_upload' },
  { name: 'Change in Needs', icon: 'cloud_upload' },
];

@Component({
  selector: 'app-common-summary',
  templateUrl: './common-summary.component.html',
  styleUrls: ['./common-summary.component.scss']
})
export class CommonSummaryComponent implements OnInit {
  @Input() supportingDocumentData;
  displayedColumnsSuppDocs: string[] = ['name', 'status'];
  dataSource2 = ELEMENT_DATA2;
  ImageBaseData = [];
  fileNames = [];
  fileType: string;
  paeDiagnosisSummaryDocument: PaeDiagnosisSummaryDocument[] = [];
  peaDiagnosisForm: FormGroup;
  showUploadBtn: boolean;
  showTick: boolean;
  showFileUpload = true;
  selectedRow: any;
  constructor(private paeService: PaeService, private fb: FormBuilder,
              private router: Router,
              private rightnavToggleService: RightnavToggleService,
              public dialog: MatDialog) { }

  ngOnInit(): void {
    /* this.deleteDocument(); */
    this.dataSource2 = this.supportingDocumentData;
  }


  getFormData() {
    return this.peaDiagnosisForm.controls;
  }

  uploadDocument() {
    this.openUploadDocument();
    console.log('upload document');
  }

  openUploadDocument() {
    this.rightnavToggleService.emitToRightNavComp$.next('UPLOAD_DOC');
  }

}
