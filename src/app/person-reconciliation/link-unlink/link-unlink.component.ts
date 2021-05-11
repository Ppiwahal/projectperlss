import { Component, OnInit } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import * as Constants from '../../_shared/constants/application.constants';

@Component({
  selector: 'app-link-unlink',
  templateUrl: './link-unlink.component.html',
  styleUrls: ['./link-unlink.component.scss']
})
export class LinkUnlinkComponent implements OnInit {

  showConfirmLink: any;
  hideIndividualSection: boolean;
  constructor() {
    const searchParams = sessionStorage.getItem('ACTIVE_SESSION_DATA');
    if (searchParams) {
      const decryptedSearchParams =  CryptoJS.AES.decrypt(searchParams, Constants.APP_ENC_DECRYPT_KEY).toString(CryptoJS.enc.Utf8);
      const searchParamJson = JSON.parse(decryptedSearchParams);
      this.showConfirmLink = searchParamJson.showConfirmLink;
      this.hideIndividualSection = searchParamJson.hideIndividualSection;
    }
  }

  ngOnInit(): void {
  }

}
