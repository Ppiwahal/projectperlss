import {Component, OnInit, ViewChild, Input, EventEmitter, Output} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { NoticesService } from '../services/notices.service';
import {forkJoin} from 'rxjs';
import {MatTableDataSource} from '@angular/material/table';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute} from '@angular/router';


@Component({
  selector: 'app-notices-details-dashboard',
  templateUrl: './notices-details-dashboard.component.html',
  styleUrls: ['./notices-details-dashboard.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class NoticesDetailsDashboardComponent implements OnInit {
  noticeForm: FormGroup;
  dataSource ;
  columnsToDisplay = ['updateDate', 'updateUser', 'correctionLetter', 'noticeStatus', 'printType'];
  expandedElement: any | null;
  noticesIdDetails: any;
  corId: any;
  noticeRecords: any[];
  noticeStatusList: any[];
  userId;
  applicantName = ' ';

  constructor(
              private fb: FormBuilder,
              private noticesService: NoticesService,
              private toastr: ToastrService, private route: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.loadNoticesListDetails();
  }

  loadNoticesListDetails(){
    const localStorageLocal = localStorage.getItem('APP_STORAGE_TOKEN');

    if (history.state.data) {
      this.corId = history.state.data.row.noticeId;
      this.noticeRecords = history.state.data.noticeRecords;
    } else {
      this.corId = this.route.snapshot.paramMap.get('id');
    }
    console.log('corId ', this.corId);
    this.userId = JSON.parse(localStorageLocal).userName;
    const observables = [];
    observables.push(this.noticesService.getNoticeIdDetails(this.corId, this.userId));
    observables.push(this.noticesService.getPrintType());
    observables.push(this.noticesService.getNoticeStatus());
    observables.push(this.noticesService.getAppealStatus());
    observables.push(this.noticesService.getPaeStatus());
    observables.push(this.noticesService.getNoticeTypes());
    observables.push(this.noticesService.getProgramTypes());

    forkJoin(observables).subscribe( (res:any) => {
      console.log('res ', res[0]);
      res[0].noticeUpdateHistory.forEach(history => {

        const matchedPrintType = res[1].filter(printType => printType.name === history['printType']);
        if (matchedPrintType && matchedPrintType.length > 0) {
          history['printType'] = matchedPrintType[0].value;
        } else {
          history['printType'] = '---';
        }

        const matchedNoticeStatus = res[2].filter(status => status.name === history['noticeStatus']);
        if (matchedNoticeStatus && matchedNoticeStatus.length > 0) {
          history['noticeStatus'] = matchedNoticeStatus[0].value;
        } else {
          history['noticeStatus'] = '---';
        }
      });

       this.noticeStatusList = res[2];
      const matchedPrintType = res[1].filter(printType => printType.name ===  res[0]['printType']);
      if (matchedPrintType && matchedPrintType.length > 0) {
        res[0]['printType'] = matchedPrintType[0].value;
      } else {
        res[0]['printType'] = '---';
      }

      const matchedNoticeStatus = res[2].filter(status => status.name === res[0]['noticeStatus']);
      if (matchedNoticeStatus && matchedNoticeStatus.length > 0) {
        res[0]['noticeStatus'] = matchedNoticeStatus[0].value;
      } else {
        res[0]['noticeStatus'] = '---';
      }

      const matchedAppealStatus = res[3].filter(appealStatus => appealStatus.code === res[0]['appealStatus']);
      if (matchedAppealStatus && matchedAppealStatus.length > 0) {
        res[0]['appealStatus'] = matchedAppealStatus[0].value;
      } else {
        res[0]['appealStatus'] = '---';
      }

      const matchedPaeStatus = res[4].filter(paeStatus => paeStatus.code === res[0]['paeStatus']);
      if (matchedPaeStatus && matchedPaeStatus.length > 0) {
        res[0]['paeStatus'] = matchedPaeStatus[0].value;
      } else {
        res[0]['paeStatus'] = '---';
      }

      const matchedNoticeType = res[5].filter(noticeType => noticeType.code === res[0]['noticesType']);
      if (matchedNoticeType && matchedNoticeType.length > 0) {
        res[0]['noticesType'] = matchedNoticeType[0].value;
      } else {
        res[0]['noticesType'] = '---';
      }

      const matchedProgramType = res[6].filter(programType => programType.code === res[0]['programType']);
      if (matchedProgramType && matchedProgramType.length > 0) {
        res[0]['programType'] = matchedProgramType[0].name;
      } else {
        res[0]['programType'] = '---';
      }

      res[0].noticeUpdateHistory.sort(
        function(a, b) {
           if (a.updateDate === b.updateDate) {
             return Number(new Date(b.updateDate)) - Number(new Date(a.updateDate));
           }
           return b.updateDate > a.updateDate ? 1 : -1;
       });

      this.noticesIdDetails = res[0];
      this.dataSource = new MatTableDataSource(res[0].noticeUpdateHistory);
    }, (error) => {
      this.toastr.error('Internal Server Error');
    });
  }

  formatSSN(val) {
    if (val) {
      const formstring = 'XXX-XX-' + val.slice(5, val.length);
      return formstring;
    } else {
      return '---';
    }
  }

  reloadData() {
    this.ngOnInit();
  }

}
