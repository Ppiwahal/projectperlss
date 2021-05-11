import { EnvService } from './../../../../_shared/utility/env.service';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RefHcbsPopup } from '../../../../_shared/model/RefHcbsPopup';

@Injectable({
  providedIn: 'root'
})
export class RefHcbsFormService {
  serverApiUrl: any;
  constructor(public http: HttpClient,
              private envService: EnvService) {
              this.serverApiUrl = this.envService.apiUrl();
  }

  async saveHCBSPopupForm(refHcbsPopup: RefHcbsPopup): Promise<HttpResponse<any>> {
    return await this.http.post<any>(this.serverApiUrl.API_URL + `/referral/eform/Hcbspopup`,
    refHcbsPopup, { observe: 'response' }).toPromise();
  }
}
