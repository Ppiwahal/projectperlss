import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvService } from 'src/app/_shared/utility/env.service';
import { PaeCommonService } from '../../pae-common/pae-common.service';

@Injectable({
  providedIn: 'root'
})
export class PaePrioritizationSummaryService {

  serverApiUrl: any;
  paeId: any;
  pageId = 'PPPPS';

  constructor(private http: HttpClient,
              private envService: EnvService,
              private paeCommonService: PaeCommonService) {
    this.serverApiUrl = this.envService.apiUrl();
    this.paeId = this.paeCommonService.getPaeId();
    //this.paeId = 'PAE1000040';
  }

  getPrioritizationSummary(): Observable<any>{
    let paramss = new HttpParams();
    paramss = paramss.append('pageId', this.pageId);
    paramss = paramss.append('paeId', this.paeId);
    return this.http.get<Observable<any>>(
      this.serverApiUrl.API_URL + `/paeSummary/getSummaryData`, {params: paramss});
  }

}
