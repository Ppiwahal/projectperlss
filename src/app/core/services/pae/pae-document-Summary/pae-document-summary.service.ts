import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvService } from '../../../../../../src/app/_shared/utility/env.service';
import { physicalHisdetails } from 'src/app/_shared/model/phyHisDetails'

@Injectable({
  providedIn: 'root'
})
export class PaeDocumentSummaryService {

  serverApiUrl: any;
  paeId: any;
  reqpageId:any;

  constructor(private http: HttpClient,
              private envService: EnvService) {
    this.serverApiUrl = this.envService.apiUrl();
    
  }

  getDocumentSummary(paeId): Observable<any>{
    let paramss = new HttpParams();
    paramss = paramss.append('paeId', paeId);
    // paramss = paramss.append('applId', applId);
    // paramss = paramss.append('refId', refId);
    // paramss = paramss.append('docTypes', docTypes);

    return this.http.get<Observable<any>>(
      this.serverApiUrl.API_URL + `/doc/getDocByTypes`, {params: paramss});
  }

  postPhyData(phyHisdetails: physicalHisdetails): Observable<any>
  {
    return this.http.post<Observable<any>>(this.serverApiUrl.API_URL + `/pae/savePaeDocumentSummary`, phyHisdetails, 
    { headers: { 'Content-Type': 'application/json' } });

  }


}