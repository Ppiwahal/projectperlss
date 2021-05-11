import { Component, OnInit, OnDestroy, Inject, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { RightnavComponent } from '../rightnav.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RightNavTaskService } from '../services/rightnav.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-view-notices',
  templateUrl: './view-notices.component.html',
  styleUrls: ['./view-notices.component.scss']
})
export class ViewNoticesComponent implements OnInit, OnChanges, OnDestroy {
  subscriptions$ = [];
  notesData: any[] = [];
  @Input() data: any;
  @Output() closeDialogEvent = new EventEmitter();

  constructor(
    private rightNavTaskService: RightNavTaskService,
    private toastr: ToastrService) { }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && changes['data'].previousValue !== changes['data'].currentValue) {
      console.log("data ", this.data);
      this.onInit();
    }
  }

  closeDialog() {
    this.closeDialogEvent.emit();
  }

  onInit(): void {
    let personId = '';
    if (this.data && this.data.prsnId) {
      personId = this.data.prsnId;
    }

    const getNotesSubscriptions$ = this.rightNavTaskService.searchNoticeRecordByPrsnId(personId).subscribe(res => {
      console.log("view notices", res);
      this.notesData = res;
    }, (error) => {
      this.toastr.error("Internal Server Error!");
    });
    this.subscriptions$.push(getNotesSubscriptions$);
  }

  viewPdf(languageCd, noticeId) {
    const viewPdfSubscriptions$ = this.rightNavTaskService.getPdfDocument(languageCd, noticeId).subscribe(res => {

      if (res && res.errorCode && res.errorCode.length > 0 && res.errorCode[0].description) {
        this.toastr.error(res.errorCode[0].description);
      } else {
        let pdfWindow = window.open("")
        pdfWindow.document.write(
          "<iframe width='100%' height='100%' src='data:application/pdf;base64, " +
          encodeURI(res.viewPdf) + "'></iframe>"
        )
      }

    });
    this.subscriptions$.push(viewPdfSubscriptions$);
  }

  ngOnDestroy() {
    if (this.subscriptions$ && this.subscriptions$.length > 0) {
      this.subscriptions$.forEach(subscription$ => subscription$.unsubscribe());
    }
  }

}
