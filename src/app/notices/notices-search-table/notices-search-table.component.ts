import {AfterViewInit, Component, Input, OnDestroy, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {NoticesService} from '../services/notices.service';
import {ToastrService} from 'ngx-toastr';


@Component({
  selector: 'app-notices-search-table',
  templateUrl: './notices-search-table.component.html',
  styleUrls: ['./notices-search-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class NoticesSearchTableComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  dataSource;
  columnsToDisplay = ['personName', 'ssn', 'recipientType', 'noticeType', 'programType','generateDate', 'noticeStatus', 'printType'];
  expandedElement: any | null;
  @Input() noticeRecords:any[];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  subscriptions$: any[] = [];
  countyList:any;

  constructor(private noticeService: NoticesService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.noticeService.getNoticeCounty().subscribe(res => {
      this.countyList = res;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes['noticeRecords']) {
      this.dataSource =  new MatTableDataSource(this.noticeRecords);
      setTimeout(() => this.dataSource.paginator = this.paginator);

    }
  }
  getNameByCode(code: string, entity: string) {
    if (entity === 'CT' && code) {
      const countyType = this.countyList.filter(item => item.code === code);
      return countyType.length > 0 ? countyType[0].value : code;
    }
   
   
  }
  

  viewPdf(languageCd, row) {
    if(row.noticeStatus === 'Suppressed') {
      return ;
    }
    const viewPdfSubscriptions$ =this.noticeService.getPdfDocument(languageCd, row.noticeId).subscribe(res => {
      if(res && res.errorCode && res.errorCode.length > 0 && res.errorCode[0].description){
        this.toastr.error( res.errorCode[0].description);
      } else {
        let pdfWindow = window.open("")
        pdfWindow.document.write(
          "<iframe width='100%' height='100%' src='data:application/pdf;base64, " +
          encodeURI(res.viewPdf) + "'></iframe>"
        )
      }
    }, (error) => {
    });
    this.subscriptions$.push(viewPdfSubscriptions$);
  }

  ngAfterViewInit() {
    if(this.dataSource) {
     this.paginator._intl.getRangeLabel = (page, pageSize, length ) => {
       if (length === 0 || pageSize === 0) {
         return `0 - 0 of 0 records`;
       }
       length = Math.max(length, 0);
       const startIndex = page * pageSize;
       const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
       return `${startIndex + 1} – ${endIndex} of ${length} records`;
     }
      this.dataSource.paginator = this.paginator;
    }
  }

  ngOnDestroy() {
    if (this.subscriptions$ && this.subscriptions$.length > 0) {
      this.subscriptions$.forEach(subscription$ => subscription$.unsubscribe());
    }
  }

  formatSSN(val) {
    if (val) {
      const formstring = 'XXX-XX-' + val.slice(5, val.length);
      return formstring;
    } else {
      return '---';
    }
  }

}
