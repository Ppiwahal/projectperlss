import { EnvService } from './../../../../_shared/utility/env.service';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MultipleComplexFormService {
  serverApiUrl: any;
  constructor(public http: HttpClient,
              private envService: EnvService) {
              this.serverApiUrl = this.envService.apiUrl();
  }

  async saveMultipleComplexForm(data: any): Promise<HttpResponse<any>> {
    console.log('/referral2/eform/CmplxCondRvwFormPopup: ' + JSON.stringify(data, null, '  '));
    return await this.http.post<any>(this.serverApiUrl.API_URL + '/referral2/eform/CmplxCondRvwFormPopup',
    data, { observe: 'response' }).toPromise();
  }

  async getMultipleComplexForm(intakeOutcomeId: string): Promise<HttpResponse<any>> {
    return await this.http.get<any>(this.serverApiUrl.API_URL + '/referral2/eform/CmplxCondRvwFormPopup',
     { observe: 'response', params: {intakeOutcomeId: intakeOutcomeId} }).toPromise();
  }

}
