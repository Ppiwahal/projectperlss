import { EnvService } from '../../../../_shared/utility/env.service';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlannedTransitionFormService {
  serverApiUrl: any;
  constructor(public http: HttpClient,
              private envService: EnvService) {
    this.serverApiUrl = this.envService.apiUrl();
  }

  async savePlannedTransitionForm(data: any): Promise<HttpResponse<any>> {
    console.log('/referral2/eform/refPlannedTransistionFormData: \n' +  JSON.stringify(data, null, '  '));
    return await this.http.post<any>(this.serverApiUrl.API_URL + '/referral2/eform/refPlannedTransistionFormData',
      data, { observe: 'response' }).toPromise();
  }

  async getPlannedTransitionForm(intakeOutcomeId: string): Promise<HttpResponse<any>> {
    const response = await this.http.get<Observable<any>>(this.serverApiUrl.API_URL + '/referral2/eform/getRefPlannedTransistionFormData',
    { observe: 'response', params: { intakeOutcomeId } }).toPromise();
    return response;
  }

}
