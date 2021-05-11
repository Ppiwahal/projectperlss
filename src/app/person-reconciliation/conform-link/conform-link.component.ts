import { Component, OnInit } from '@angular/core';
import {PersonReconciliationService} from '../services/person-reconciliation.service';
import * as Constants from '../../_shared/constants/application.constants';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-conform-link',
  templateUrl: './conform-link.component.html',
  styleUrls: ['./conform-link.component.scss']
})
export class ConformLinkComponent implements OnInit {

  confirmLinkDetails: any;

  constructor(private personReconciliationService: PersonReconciliationService) {
    const searchParams = sessionStorage.getItem('ACTIVE_SESSION_DATA');
    if (searchParams) {
      const decryptedSearchParams =  CryptoJS.AES.decrypt(searchParams, Constants.APP_ENC_DECRYPT_KEY).toString(CryptoJS.enc.Utf8);
      const searchParamJson = JSON.parse(decryptedSearchParams);
      const taskId = searchParamJson.taskId;
      const personId1 = searchParamJson.personId;
      const personId2 = searchParamJson.personId2;
      this.getConfirmLinkDetails(taskId, personId1, personId2);
    }

  }

  ngOnInit(): void {
  }

  getConfirmLinkDetails(taskId, personId1, personId2)
  {
   this.personReconciliationService.getConfirmLinkDetails(taskId, personId1, personId2).subscribe(res => {
     this.confirmLinkDetails = res;
   })
  }
}
