import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EnvService } from 'src/app/_shared/utility/env.service';
import { AdjudicationSearch } from 'src/app/_shared/model/AdjuducationSearch';
import { refineEventDef } from '@fullcalendar/angular';
import { TaskDetailsComponent } from 'src/app/inbox/task-details/task-details.component';

@Injectable({
  providedIn: 'root'
})
export class AdjudicationDashboardService {
  serverApiUrl: any;
  response: any;


  constructor(private http: HttpClient,
    private envService: EnvService) {
this.serverApiUrl = this.envService.apiUrl();
}

getAdjudicationData(userId, paeId, entityId): Observable<any>{
  let paramss = new HttpParams();
      paramss = paramss.append('userId', userId);
      paramss = paramss.append('paeId', paeId);
      paramss = paramss.append('entityId', entityId);
  return this.http.get<Observable<any>>(this.serverApiUrl.API_URL + `/adj/getadjTasks`,
  {params: paramss});
}

getOpenTaskData(userId, dashboardCd): Observable<any>{
  let paramss = new HttpParams();
      paramss = paramss.append('userId', userId);
      paramss = paramss.append('dashboardCd', dashboardCd);
  return this.http.get<Observable<any>>(this.serverApiUrl.API_URL + `/adj/adjOpenTasksCount`,
  {params: paramss});

}

getQueueData(userId, dashboardCd, entityId, taskStatusCd)
{
  let paramss = new HttpParams();
      paramss = paramss.append('userId', userId);
      paramss = paramss.append('dashboardCd', dashboardCd );
      paramss = paramss.append('entityId', entityId);
      paramss = paramss.append('taskStatusCd', taskStatusCd);
  return this.http.get<Observable<any>>(this.serverApiUrl.API_URL + `/adj/getAdjQueues`,
  {params: paramss});
}

searchAdjudication(adjudicationSearchResult:AdjudicationSearch, entityId): Observable<any> {

  let paramss = new HttpParams();
      paramss = paramss.append('paeId', adjudicationSearchResult.paeId);
      paramss = paramss.append('entityId', entityId);
      paramss = paramss.append('personId', adjudicationSearchResult.personId)
      paramss = paramss.append('assignedUserId', adjudicationSearchResult.assignedUserId);
      paramss = paramss.append('submitDtFrom', adjudicationSearchResult.submitDtFrom);
      paramss = paramss.append('submitDtTo', adjudicationSearchResult.submitDtTo);
      paramss = paramss.append('adjDueDt', adjudicationSearchResult.adjDueDt);
      paramss = paramss.append('adjStatusCd', adjudicationSearchResult.adjStatusCd);
      paramss = paramss.append('queueNameCd', adjudicationSearchResult.queueNameCd);
      paramss = paramss.append('taskStatusCd', adjudicationSearchResult.taskStatusCd);
      paramss = paramss.append('applicantAge', adjudicationSearchResult.applicantAge);
      paramss = paramss.append('acutyScrore', adjudicationSearchResult.acutyScrore);

      console.log(adjudicationSearchResult);

  return this.http.get<Observable<any>>(this.serverApiUrl.API_URL + `/adj/searchAdjDashboard`, {params: paramss});
}

getInitiateIntake(paeId, taskId, userId): Observable<any>
{
  let body: any;
  body = {paeId : paeId, taskId:taskId,  userId:userId};
  return this.http.post<Observable<any>>(this.serverApiUrl.API_URL + `/adj/initiateReview`, body);
}



}

