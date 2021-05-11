import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { EnvService } from '../../../../_shared/utility/env.service';

@Injectable({
  providedIn: 'root'
})
export class PaeSisInformantService {

  serverApiUrl: any;
  dialogResult = new Subject<any>();
  response: any;
  paeId: string;
  reqpageId = 'PAESP';

  constructor(
    private http: HttpClient,
    private envService: EnvService
  ) {
    this.serverApiUrl = this.envService.apiUrl();
  }

  getPaeId() {
    return this.paeId;
  }

  getRequestpageId()
  {
    return this.reqpageId;
  }

  getSisInformantRequest(paeId: string): Observable<any[]> {
    let paramss = new HttpParams();
    paramss = paramss.append('paeId', paeId);
    return this.http.get<any>(
      this.serverApiUrl.API_URL + '/SupportingDocs/SisInformantForm',
      {params: paramss}
    );
  }

  addSisInformantRequest(request: any): Observable<any[]> {
    return this.http.post<any[]>(this.serverApiUrl.API_URL + '/SupportingDocs/SisInformantForm', request);
  }

}
