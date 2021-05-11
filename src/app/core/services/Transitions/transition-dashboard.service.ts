import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TransitionFilter } from 'src/app/_shared/model/TransitionFilter';
import { EnvService } from 'src/app/_shared/utility/env.service';

@Injectable({
  providedIn: 'root'
})
export class TransitionDashboardService {
  serverApiUrl: any;

  constructor(private http: HttpClient,
    private envService: EnvService) {
this.serverApiUrl = this.envService.apiUrl();
}

  getOpenTaskData(userId, dashboardCd): Observable<any>{
    let paramss = new HttpParams();
        paramss = paramss.append('userId', userId);
        paramss = paramss.append('dashboardCd', dashboardCd);
    return this.http.get<Observable<any>>(this.serverApiUrl.API_URL + `/transitions/tnsOpenTasksCount`,
    {params: paramss});
  
  }

  getQueueData(userId, dashboardCd, entityId, taskStatusCd)
  {
    let paramss = new HttpParams();
        paramss = paramss.append('userId', userId);
        paramss = paramss.append('dashboardCd', dashboardCd );
        paramss = paramss.append('entityId', entityId);
        paramss = paramss.append('taskStatusCd', taskStatusCd);
    return this.http.get<Observable<any>>(this.serverApiUrl.API_URL + `/transitions/transitionQueuesCount`,
    {params: paramss});
  }

  getTransitionData(userId): Observable<any>{
    let paramss = new HttpParams();
        paramss = paramss.append('userId', userId);
    return this.http.get<Observable<any>>(this.serverApiUrl.API_URL + `/transitions/requestedTransitions`,
    {params: paramss});
  
  }

  getTransitionSearchData(transitionFilterRequest: TransitionFilter, userId, entityId): Observable<any[]> {
    let paramss = new HttpParams();
    paramss = paramss.append('userId', userId);
    paramss = paramss.append('entityId', entityId);
    paramss = paramss.append('personId', transitionFilterRequest.personId);
    paramss = paramss.append('transitionId', transitionFilterRequest.transitionId);
    paramss = paramss.append('transitionStatus', transitionFilterRequest.transitionStatus);
    paramss = paramss.append('transitionFrom', transitionFilterRequest.transitionFrom);
    paramss = paramss.append('transitionTo', transitionFilterRequest.transitionTo);
  
  
    return this.http.get<any[]>(this.serverApiUrl.API_URL + `/transitions/search`, {params: paramss});
  }
}
