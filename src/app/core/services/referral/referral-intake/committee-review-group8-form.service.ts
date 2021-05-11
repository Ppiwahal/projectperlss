import { EnvService } from '../../../../_shared/utility/env.service';
import { HttpClient, HttpResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommitteeReviewGroup8FormService {
  serverApiUrl: any;
  constructor(public http: HttpClient,
              private envService: EnvService) {
    this.serverApiUrl = this.envService.apiUrl();
  }

  async savecommitteeReviewForm(data: any): Promise<HttpResponse<any>> {
    console.log('/referral2/eform/reviewGroup8Popup: \n' +  JSON.stringify(data, null, '  '));
    return await this.http.post<any>(this.serverApiUrl.API_URL + '/referral2/eform/reviewGroup8Popup',
      data, { observe: 'response' }).toPromise();
  }

  async getcommitteeReviewForm(intakeOutcomeId: string): Promise<HttpResponse<any>> {
    return await this.http.get<any>(this.serverApiUrl.API_URL + '/referral2/eform/reviewGroup8Popup',
     { observe: 'response', params: {intakeOutcomeId: intakeOutcomeId} }).toPromise();
  }

}
