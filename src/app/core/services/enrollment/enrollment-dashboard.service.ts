import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EnvService } from 'src/app/_shared/utility/env.service';
import { EnrollmentFilter } from 'src/app/_shared/model/EnrollmentFilter';

@Injectable({
  providedIn: 'root'
})
export class EnrollmentDashboardService {
  serverApiUrl: any;
  response: any;

  constructor(private http: HttpClient,
    private envService: EnvService) {
this.serverApiUrl = this.envService.apiUrl();
}

getEnrollmentData(userId): Observable<any>{
  let paramss = new HttpParams();
      paramss = paramss.append('userId', userId);
  return this.http.get<Observable<any>>(this.serverApiUrl.API_URL + `/enrollment/enrDashboard`,
  {params: paramss});
}

getEnrollmentHoldData(userId):Observable<any>{
  let paramss = new HttpParams();
      paramss = paramss.append('userId', userId);
  return this.http.get<Observable<any>>(this.serverApiUrl.API_URL + `/enrollment/enrOnHold`,
  {params: paramss});
}

getOpenTaskData(userId, dashboardCd): Observable<any>{
  let paramss = new HttpParams();
      paramss = paramss.append('userId', userId);
      paramss = paramss.append('dashboardCd', dashboardCd);
  return this.http.get<Observable<any>>(this.serverApiUrl.API_URL + `/enrollment/enrOpenTasksCount`,
  {params: paramss});

}

getsearchEnrollment(enrollmentFilterRequest: EnrollmentFilter, entityId): Observable<any[]> {
  let paramss = new HttpParams();
  paramss = paramss.append('entityId', entityId);
  paramss = paramss.append('personId', enrollmentFilterRequest.personId);
  paramss = paramss.append('paeId', enrollmentFilterRequest.paeId);
  paramss = paramss.append('enrollmentGroup', enrollmentFilterRequest.enrollmentGroup);
  paramss = paramss.append('enrollmentStatus', enrollmentFilterRequest.enrollmentStatus);


  return this.http.get<any[]>(this.serverApiUrl.API_URL + `/enrollment/enrollmentSearch`, {params: paramss});
}

getQueuecount(userId, dashboardCd, entityId, taskStatusCd)
{
  let paramss = new HttpParams();
  paramss = paramss.append('userId', userId);
  paramss = paramss.append('entityId', entityId);
  paramss = paramss.append('dashboardCd', dashboardCd);
  paramss = paramss.append('taskStatusCd', taskStatusCd);

  return this.http.get<any[]>(this.serverApiUrl.API_URL + `/enrollment/enrQueuesCount`, {params: paramss});
}

getInitiateIntake(paeId, refId, taskId, userId): Observable<any>
{
  let body: any;
  body = {paeId : paeId, refId: refId, taskId:taskId, userId:userId};
  return this.http.post<Observable<any>>(this.serverApiUrl.API_URL + `/enrollment/initiateReview`, body);
}

}

