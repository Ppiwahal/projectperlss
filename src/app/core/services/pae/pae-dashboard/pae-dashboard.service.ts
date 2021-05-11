import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvService } from '../../../../_shared/utility/env.service';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { PaeFilter } from 'src/app/_shared/model/PaeFilter';

@Injectable({
  providedIn: 'root'
})
export class PaeDashboardService {

  serverApiUrl: any;
  response: any;
constructor(private http: HttpClient,
            private envService: EnvService) {
this.serverApiUrl = this.envService.apiUrl();
}

getOpenTaskData(userId, dashboardCd): Observable<any>{
  let paramss = new HttpParams();
  paramss = paramss.append('userId', userId);
  paramss = paramss.append('dashboardCd', dashboardCd);
  return this.http.get<Observable<any>>(this.serverApiUrl.API_URL + `/pae/paeOpenTasksCount`,
  {params: paramss});

}

getSearchData(paeFilterRequest: PaeFilter, entityId): Observable<any>{

  let paramss = new HttpParams();
  paramss = paramss.append('entityId', entityId);
  paramss = paramss.append('personId', paeFilterRequest.personId);
  paramss = paramss.append('referralId', paeFilterRequest.referralId);
  paramss = paramss.append('paeId', paeFilterRequest.paeId);
  paramss = paramss.append('paeStatus', paeFilterRequest.paeStatus);
  paramss = paramss.append('grandRegion', paeFilterRequest.grandRegion);
  paramss = paramss.append('enrollmentGroup', paeFilterRequest.enrollmentGroup);

  return this.http.get<Observable<any>>(this.serverApiUrl.API_URL + `/pae/paeSearch`,
  {params: paramss});

}

getQueueData(userId, dashboardCd, entityId, taskStatusCd)
{
  let paramss = new HttpParams();
  paramss = paramss.append('userId', userId);
  paramss = paramss.append('entityId', entityId);
  paramss = paramss.append('dashboardCd', dashboardCd);
  paramss = paramss.append('taskStatusCd', taskStatusCd);

  return this.http.get<any[]>(this.serverApiUrl.API_URL + `/pae/paeQueueCount`, {params: paramss});
}
// TODO PAE DASHBOARD SERVICES
/* getCountPendingPae(userId): Observable<HttpResponse<any>>{
  let paramss = new HttpParams();
  paramss = paramss.append('userId', userId);
  return this.http.get<Observable<any>>(this.serverApiUrl.API_URL + `/pae/paePendingSubmissions` ,
  { observe: 'response' });
} */

getCountPendingPae(userId): Observable<any>{
  let paramss = new HttpParams();
  paramss = paramss.append('userId', userId);
  return this.http.get<Observable<any>>(this.serverApiUrl.API_URL + `/pae/paePendingSubmissions`, {params: paramss});
}

getPaeSubmissions(userId): Observable<any>{
  let paramss = new HttpParams();
  paramss = paramss.append('userId', userId);
  return this.http.get<Observable<any>>(this.serverApiUrl.API_URL + `/pae/paeSubmissions`, {params: paramss});
}

getPaeQueueCount(userId, entityId, dashboardCd, taskStatusCd): Observable<any>{
  let paramss =  new HttpParams();
  paramss = paramss.append('userId', userId);
  paramss = paramss.append('dashboardCd', dashboardCd);
  paramss = paramss.append('taskStatusCd', taskStatusCd);
  paramss = paramss.append('entityId', entityId);
  return this.http.get<Observable<any>>(this.serverApiUrl.API_URL + `/pae/paeQueueCount`, {params: paramss});
}

deletePae(paeId): Observable<any>{
  let body: any;
  body = {paeId : paeId };
  return this.http.post<Observable<any>>(this.serverApiUrl.API_URL + `/pae/deletePaeRequest`, body);
}

initiateIntake(paeId, refId, taskId, userId): Observable<any>{
  let body: any;
  body = {paeId: paeId, refId: refId, taskId: taskId, userId: userId};
  return this.http.post<Observable<any>>(this.serverApiUrl.API_URL + `/pae/initiatePae`, body);
}

}
