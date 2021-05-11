import { HttpClient, HttpParams,HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SkilledServicesDetails } from '../../../../_shared/model/skilledServicesDetails'
import { EnvService } from '../../../../_shared/utility/env.service';
import { SkilledServiceUpdatePage } from '../../../../_shared/model/SkilledServiceUpdatePage'

@Injectable({
  providedIn: 'root'
})
export class PaeSkilledServicesDetailsService {serverApiUrl: any;
  response: any;

  constructor(private http: HttpClient,
              private envService: EnvService) {
      this.serverApiUrl = this.envService.apiUrl();
    }

postSkilledDetails(SkilledServicesDetails: SkilledServicesDetails): Promise<HttpResponse<any>>  {
    return this.http.post<any>(this.serverApiUrl.API_URL + `/pae/skilledService/details `, 
    SkilledServicesDetails,{ observe: 'response' }).toPromise();;
  }

getSkilledDetails(paeId): Observable<any> 
{
  let paramss = new HttpParams();
  paramss = paramss.append('paeId', paeId);
  return this.http.get<Observable<any>>(this.serverApiUrl.API_URL + `/pae/skilledService/details`, {params: paramss});
}
deleteSkilledDetails(paeId,sectionTypeCd): Observable<any> 
{
  let body : any;
      body = {'paeId': paeId,'sectionTypeCd': sectionTypeCd};
  return this.http.post<Observable<any>>(this.serverApiUrl.API_URL + `/pae/skilledService/delete`, body);
}

getNextpageDetails(paeId, reqPageId): Observable<any> 
{
  let paramss = new HttpParams();
  paramss = paramss.append('paeId', paeId);
  paramss = paramss.append('reqPageId', reqPageId);
  return this.http.get<Observable<any>>(this.serverApiUrl.API_URL + `/pae/findPaeRoutePages`, {params: paramss});
}

postPageUpdate(SkilledServiceUpdatePage:SkilledServiceUpdatePage): Promise<HttpResponse<any>>  {
  return this.http.post<any>(this.serverApiUrl.API_URL + `/pae/updatePageStatus `, 
  SkilledServiceUpdatePage,{ observe: 'response' }).toPromise();;
}


}
