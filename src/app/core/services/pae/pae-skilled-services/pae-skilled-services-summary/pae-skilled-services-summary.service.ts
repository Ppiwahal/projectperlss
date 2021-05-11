import { PaeCommonService } from '../../pae-common/pae-common.service';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvService } from '../../../../../_shared/utility/env.service';
import { SkilledServicesSummary } from '../../../../../_shared/model/SkilledServicesSummary';
import { skilledSumSw } from 'src/app/_shared/model/skilledSumSw';

@Injectable({
  providedIn: 'root',
})

export class PaeSkilledServicesSummaryService {

  serverApiUrl: any;
  paeId: any;
  reqpageId:any;

  constructor(private http: HttpClient,
              private envService: EnvService,
              private paeCommonService: PaeCommonService) {
    this.serverApiUrl = this.envService.apiUrl();
    // this.paeId = this.paeCommonService.getPaeId();
    //this.paeId = 'PAE100000073';
  }

  //getSkilledServicesSummary(PageId,paeId): Observable<any>{
   // let paramss = new HttpParams();
    //paramss = paramss.append('PageId', PageId);
    //paramss = paramss.append('paeId', paeId);
    //return this.http.get<Observable<any>>(
      //this.serverApiUrl.API_URL + `/paeSummary/getSummaryData`, {params: paramss});
  //}

  getSkilledServicesSummaryScore(paeId): Observable<any>{
    let paramss = new HttpParams();
    paramss = paramss.append('paeId', paeId);
    return this.http.get<Observable<any>>(
      this.serverApiUrl.API_URL + `/pae/skilledService/summary`, {params: paramss});
  }

  async saveSkilledServicesSumForm(skilledSumdetails: skilledSumSw): Promise<HttpResponse<any>> {
    return await this.http.post<any>(this.serverApiUrl.API_URL + `/pae/skilledService/summary`,
    skilledSumdetails, { observe: 'response' }).toPromise();
}
}
