import { EnvService } from './../../../../_shared/utility/env.service';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SustainCurrentFamilyLiveArrangementsFormService {
  serverApiUrl: any;
  constructor(public http: HttpClient,
              private envService: EnvService) {
              this.serverApiUrl = this.envService.apiUrl();
  }

  async saveSustainCurrentFamilyLiveArrangementsForm(data: any): Promise<HttpResponse<any>> {
    return await this.http.post<any>(this.serverApiUrl.API_URL + '/referral/eform/livingArragPopup',
    data, { observe: 'response' }).toPromise();
  }

  async getSustainCurrentFamilyLiveArrangementsForm(intakeOutcomeId: string): Promise<HttpResponse<any>> {
    return await this.http.post<any>(this.serverApiUrl.API_URL + '/referral/eform/livingArragPopup',
    { observe: 'response',params: {intakeOutcomeId: intakeOutcomeId} }).toPromise();
  }
  
}
