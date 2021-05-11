import { EnvService } from './../../../../_shared/utility/env.service';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmergentCircumstancesFormService {
  serverApiUrl: any;
  constructor(public http: HttpClient,
    private envService: EnvService) {
    this.serverApiUrl = this.envService.apiUrl();

  }
  // tslint:disable-next-line: no-shadowed-variable
  async saveEmergentCircunstancesForm(data: any): Promise<HttpResponse<any>> {
    return await this.http.post<any>(this.serverApiUrl.API_URL + `/referral2/eform/emergentCircumstance`,
      data, { observe: 'response' }).toPromise();
  }

  async getEmergentCircunstancesForm(intakeOutcomeId: string): Promise<HttpResponse<any>> {
    return await this.http.get<any>(this.serverApiUrl.API_URL + '/referral2/eform/emergentCircumstance',
     { observe: 'response', params: {intakeOutcomeId: intakeOutcomeId} }).toPromise();
  }
}
