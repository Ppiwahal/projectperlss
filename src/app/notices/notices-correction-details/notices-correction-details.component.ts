import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { NoticesService } from '../services/notices.service';
import { ToastrService } from 'ngx-toastr';




@Component({
  selector: 'app-notices-correction-details',
  templateUrl: './notices-correction-details.component.html',
  styleUrls: ['./notices-correction-details.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class NoticesCorrectionDetailsComponent implements OnInit, OnChanges, AfterViewInit {
  noticeForm: FormGroup;
  dataSource;
  columnsToDisplay = ['noticeId', 'noticeType', 'programType', 'generateDate', 'userAction'];
  expandedElement: any | null;

  @Input() corId;
  @Input() noticeRecords: any[];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  reasonForCahnge = '';
  incorrectNoticeId = -1;
  selectedIndex = -1;
  selectedRow: any;
  updateRes: any;
  languageCd: any;
  userId: any;
  subscriptions$ = [];

  constructor(private fb: FormBuilder,
              private noticesService: NoticesService,
              private toastr: ToastrService) { }

  ngOnInit(): void {
    this.noticeForm = this.fb.group({
      reasonForCahnge: ''
    });
  }

  get f() {
    return this.noticeForm.controls;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['noticeRecords']) {
      this.noticeRecords = this.noticeRecords.filter(rec => rec.noticeId !== this.corId);
      this.dataSource = new MatTableDataSource(this.noticeRecords);
    }
  }

  selectRow(row, index) {
    this.languageCd = row.langCd;
    this.selectedIndex = index;
    this.selectedRow = row;
    this.incorrectNoticeId = row.noticeId;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  search(): void {
    const localStorageforLocal = localStorage.getItem('APP_STORAGE_TOKEN');
    this.userId= JSON.parse(localStorageforLocal).userName;
    const payload = {
      correctCorId: this.corId,
      userId: this.userId,
      inCorrectCorId: this.incorrectNoticeId,
      reasonForChange: this.f['reasonForCahnge'].value
    };
    this.noticesService.updateCorrectionLetter(payload).subscribe(res => {
      this.updateRes = res;
      this.toastr.success(this.updateRes.successMessage);
      this.noticeForm.reset();
    }, (error) => {
      this.toastr.error('Internal Server Error');
    });
  }

  previewNotice() {
    const viewPdfSubscriptions$ = this.noticesService.getPdfDocument(this.languageCd, this.incorrectNoticeId).subscribe(res => {
      if (res && res.errorCode && res.errorCode.length > 0 && res.errorCode[0].description){
        this.toastr.error( res.errorCode[0].description);
      } else {
        const pdfWindow = window.open('');
        pdfWindow.document.write(
          '<iframe width=\'100%\' height=\'100%\' src=\'data:application/pdf;base64, ' +
          encodeURI(res.viewPdf) + '\'></iframe>'
        );
      }
    }, (error) => {
      this.toastr.error('Internal Server Run-Time Error!');
    });
    this.subscriptions$.push(viewPdfSubscriptions$);
  }

}
