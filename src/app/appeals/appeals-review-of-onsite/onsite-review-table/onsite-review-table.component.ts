import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AppealService } from '../../services/appeal.service';		
import * as Constants from '../../../_shared/constants/application.constants';
import * as CryptoJS from 'crypto-js';

const ELEMENT_DATA: any[] = [
  {
    onsiteReferralDate: '3/10/2021',
    onsiteDueDate: '3/18/2021',
    onsiteStatus:'Pending Onsite',
    updatedDate:'3/10/2021'
  }
];


@Component({
  selector: 'app-onsite-review-table',
  templateUrl: './onsite-review-table.component.html',
  styleUrls: ['./onsite-review-table.component.scss']
})
export class OnsiteReviewTableComponent implements OnInit {

  dataSource: MatTableDataSource<any> = new MatTableDataSource(ELEMENT_DATA);
  columnsToDisplay: string[] = ['onsiteReferralDate','onsiteDueDate', 'onsiteStatus', 'updatedDate', 'userActions'];
  reasonToCancelOnsite: any[] = [];
  showOnlineDueDt: boolean = true;
  startDate = new Date();

  constructor(private appealService: AppealService) { }

  ngOnInit(): void {
    const timeTravelData = localStorage.getItem('TIME_TRAVEL_DATA');
    if(timeTravelData) {
      const timeTravelDataJson = JSON.parse(CryptoJS.AES.decrypt(timeTravelData, Constants.APP_ENC_DECRYPT_KEY).toString(CryptoJS.enc.Utf8));
      console.log("timeTravelDataJson ", timeTravelDataJson);
      if(timeTravelDataJson.timeTravelFlag && timeTravelDataJson.currentDate) {
        this.startDate = new Date(timeTravelDataJson.currentDate);
      }
    }
   this.appealService.getAppealDropdowns('CANCEL_ONSITE').subscribe(res => {
      this.reasonToCancelOnsite = res;
    });
  }

  

  cancel(element){
    this.showOnlineDueDt = false;
  }

}
