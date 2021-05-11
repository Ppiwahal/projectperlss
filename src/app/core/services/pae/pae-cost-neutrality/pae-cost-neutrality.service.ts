import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { EnvService } from 'src/app/_shared/utility/env.service';

@Injectable({
  providedIn: 'root'
})

export class PaeCostNeutralityService {
  serverApiUrl: any;
  dialogResult = new Subject<any>();
  response: any;

  constructor(
    private http: HttpClient,
    private envService: EnvService
  ) {
    this.serverApiUrl = this.envService.apiUrl();
  }

  async getPaeCostNeutrality(paeId: string) {
    const response = await this.http.get<Observable<any>>(this.serverApiUrl.API_URL + '/pae/findPaeCostNeuDetails',
      { observe: 'response', params: { paeId } }).toPromise();
    return response;
  }

  // {
  //   "costNeuTypeCd": "string",
  //   "id": 0,
  //   "paeId": "string",
  //   "reqPageId": "string",
  //   "srvcAmt": 0,
  //   "srvcFreqCd": "string",
  //   "srvcTypeCd": "string"
  // }

  async savePaeCostNeutrality(request: any) {
    const response = await this.http.post<Observable<any>>(this.serverApiUrl.API_URL + '/pae/savePaeCostNeuDetails', request, { observe: 'response' }).toPromise();
    return response;
  }
}
