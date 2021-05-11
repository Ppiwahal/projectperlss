import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvService } from '../../../../../_shared/utility/env.service';
import { PaeEnhancedRespiratory } from '../../../../../_shared/model/PaeEnhancedRespiratory';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaeEnhancedRespiratoryService {

serverApiUrl: any;
constructor(public http: HttpClient,
            private envService: EnvService) {
  this.serverApiUrl = this.envService.apiUrl();
}

async saveEnhancedRespiratoryForm(paeEnhancedRespiratory: PaeEnhancedRespiratory): Promise<HttpResponse<any>> {
  console.log(paeEnhancedRespiratory);
  return await this.http.post<any>(this.serverApiUrl.API_URL + `/pae/skilledService/enhancedRespCare`,
  paeEnhancedRespiratory, { observe: 'response' }).toPromise();
}

getEnhancedRespiratoryDetails(paeId): Observable <any> 
{
  let paramss = new HttpParams();
  paramss = paramss.append('paeId', paeId);
  return this.http.get<Observable<any>>(this.serverApiUrl.API_URL + `/pae/skilledService/enhancedRespCare`, {params: paramss});
}

}
