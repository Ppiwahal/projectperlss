import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaeRequestDate } from 'src/app/_shared/model/PaeRequestDate';
import { EnvService } from '../../../../_shared/utility/env.service';
import { PaeCommonService } from '../pae-common/pae-common.service';

@Injectable({
  providedIn: 'root'
})
export class PaeProgramSelectService {

serverApiUrl: any;
constructor(private http: HttpClient,
            private envService: EnvService,
            private paeCommonService: PaeCommonService) {
            this.serverApiUrl = this.envService.apiUrl();
}

async savePaeProgramRequestDate(paeProgramSelectionVO: PaeRequestDate): Promise<HttpResponse<any>> {
  return await this.http.post<any>(this.serverApiUrl.API_URL + `/pae/paeProgramSelection`,
  paeProgramSelectionVO, { observe: 'response', params: {progress: 'no' } }).toPromise();
}

getPaeDisplayPages(paeId): Observable<any>{
  let paramss = new HttpParams();
  paramss = paramss.append('paeId', paeId);
  return this.http.get<Observable<any>>(this.serverApiUrl.API_URL + `/pae/findPaeDisplayPages`, {params: paramss});
}

getPaeProgramName(paeId): Observable<any>{
  let paramss = new HttpParams();
  paramss = paramss.append('paeId', paeId);
  return this.http.get<Observable<any>>(this.serverApiUrl.API_URL + `/paeProgram/paeProgramSelection`, {params: paramss});
}

}
