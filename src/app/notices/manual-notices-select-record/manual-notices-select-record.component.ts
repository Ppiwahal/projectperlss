import {Component, OnInit, Input, Output, EventEmitter, SimpleChanges} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { animate, state, style, transition, trigger } from '@angular/animations';
import {NoticesService} from '../services/notices.service';
import {forkJoin} from 'rxjs';

@Component({
  selector: 'app-manual-notices-select-record',
  templateUrl: './manual-notices-select-record.component.html',
  styleUrls: ['./manual-notices-select-record.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class ManualNoticesSelectRecordComponent implements OnInit {
  noticeForm: FormGroup;
  dataSource : any;
  columnsToDisplay = ['recordId', 'recordStatus', 'enrollmentGroup', 'enrollmentStatus', 'action'];
  expandedElement: any | null;
  selectedRecordId = -1;
  selectedIndex = -1;
  selectedRow: any;

  @Input() personId:number;
  @Output() emitNoticeRecord = new EventEmitter();

  constructor(private fb: FormBuilder, private noticeService: NoticesService) { }

  ngOnInit(): void {
    this.noticeForm = this.fb.group({
      dobDt: '',
      outreachResult: ''
    });
  }

  ngOnChanges(changes: SimpleChanges) {

    console.log("person id", this.personId);
    if(changes['personId'] && changes['personId'].currentValue !==  changes['personId'].previousValue) {
      const observables = [];
      observables.push( this.noticeService.getNoticeRecords(this.personId));
      observables.push(this.noticeService.getEnrollmentGroup());
      observables.push(this.noticeService.getEnrollmentStatus());
      observables.push(this.noticeService.getAppealStatus());
      observables.push(this.noticeService.getPaeStatus());
      observables.push(this.noticeService.getKbReferralStatus());
      observables.push(this.noticeService.getReferralStatus());

      forkJoin(observables).subscribe((res:any) => {
        console.log("response ", res);
        const allStatus = [...res[3],...res[4],...res[5],...res[6]];
        res[0].forEach(rec => {
          if(rec['recordId'] != null) {
            rec['type'] = rec['recordId'].startsWith("APL") ? 'aplId' : (rec['recordId'].startsWith("REF") ? 'refId' : 'paeId');
          }
          else if(rec['aplId'] != null) {
            rec['recordId'] = rec['aplId'];
            rec['type'] = 'aplId';
          }
          else if(rec['refId'] != null) {
            rec['recordId'] = rec['refId'];
            rec['type'] = 'refId';
          }
          else if(rec['paeId'] != null) {
            rec['recordId'] = rec['paeId'];
            rec['type'] = 'paeId';
          }
          if(res[1] && res[1].length > 0) {
            const enrollRecObj =  res[1].filter(enrollRec => enrollRec.code === rec['enrGrpCd']);
            if(enrollRecObj && enrollRecObj.length > 0) {
             rec['enrGrpVal'] =  enrollRecObj[0].value;
            }else {
              rec['enrGrpVal'] = '';
            }
          }
          if(res[2] && res[2].length > 0) {
            const enrollRecObj =  res[2].filter(enrollRec => enrollRec.code === rec['enrStatusCd']);
            if(enrollRecObj && enrollRecObj.length > 0) {
              rec['enrStatusVal'] =  enrollRecObj[0].value;
            }else {
              rec['enrStatusVal'] = '';
            }
          }
          if(allStatus && allStatus.length > 0) {
            const enrollRecObj =  allStatus.filter(enrollRec => enrollRec.code === rec['statusCd']);
            if(enrollRecObj && enrollRecObj.length > 0) {
              rec['statusVal'] =  enrollRecObj[0].value;
            }else {
              rec['statusVal'] = '';
            }
          }
        });
        this.dataSource = res[0];
      });
    }
  }


  get f() {
    return this.noticeForm.controls;
  }

  search(): void {

  }

  postNoticeRecord() {
    let payload = {
      'paeId':null,
      'refId': null,
      'aplId': null,
      'recordStatus': this.selectedRow.statusCd,
      'enrollmentGroup': this.selectedRow.enrGrpCd,
      'enrollmentStatus': this.selectedRow.enrStatusCd
    };
    if(this.selectedRow.type) {
      payload[this.selectedRow.type] = this.selectedRow.recordId;
    }

    this.emitNoticeRecord.emit(payload);
  }

  selectRow(row, index) {
    this.selectedIndex = index;
    this.selectedRow = row;
    this.selectedRecordId = row.recordId;
  }

}
