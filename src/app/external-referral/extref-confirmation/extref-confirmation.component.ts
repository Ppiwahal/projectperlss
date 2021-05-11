import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReferralService } from '../../core/services/referral/referral.service';
import { ExternalreferralService } from '../services/externalreferral.service';
import * as Constants from '../../_shared/constants/application.constants';
import * as CryptoJS from 'crypto-js';
@Component({
  selector: 'app-extref-confirmation',
  templateUrl: './extref-confirmation.component.html',
  styleUrls: ['./extref-confirmation.component.scss']
})
export class ExtrefConfirmationComponent implements OnInit{
  refId: string; 
  constructor(private extRefService: ExternalreferralService, private router: ActivatedRoute) {
    const searchParamsBySession = sessionStorage.getItem('ACTIVE_SESSION_DATA');
    const deCryptedSearchParams = CryptoJS.AES.decrypt(searchParamsBySession, Constants.APP_ENC_DECRYPT_KEY).toString(CryptoJS.enc.Utf8);
                const searchParamJson = JSON.parse(deCryptedSearchParams);
                console.log("searchParamJson",searchParamJson);
            this.refId=searchParamJson.refId;
   }

  ngOnInit(): void {
  }



}
