import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http/';
import { Observable, of, Subject } from 'rxjs';
import { EnvService } from '../../_shared/utility/env.service';

@Injectable({
  providedIn: 'root'
})
export class InboxService {

  reloadInboxComponent$$ = new Subject<void>();
  public serverApiUrl: any;
  constructor(private http: HttpClient,
              private envService: EnvService) {
    this.serverApiUrl = this.envService.apiUrl();
  }

  getTaskDetail(taskId: number): Observable<any>{
    return  this.http.get<any>(`${this.serverApiUrl.ADMIN_API_URL}/getTaskDetail?taskId=${taskId}`);
  }

  getAssignTaskDetails(taskMasterId: number): Observable<any>{
    return  this.http.get<any>(`${this.serverApiUrl.ADMIN_API_URL}/getAssignTaskDetails?taskMasterIds=${taskMasterId}`);
  }

  updateTaskClosure(taskId: number,closureDetaildesc: string): Observable<any>{
    return  this.http.post<any>(`${this.serverApiUrl.ADMIN_API_URL}/closeTask?taskId=${taskId}&closuredetaildesc=${closureDetaildesc}`, null, {
      headers: {'Content-Type': 'application/json'}
    });
  }

  reassignTask(payload): Observable<any>{
    return  this.http.post<any>(`${this.serverApiUrl.ADMIN_API_URL}/reassignTask`, payload);
  }

  sendBackToQueue(taskIds: number[]) {
    return  this.http.post<any>(`${this.serverApiUrl.ADMIN_API_URL}/sendBackToQueue?taskIds=${taskIds.join(',')}`, null, {
      headers: {'Content-Type': 'application/json'}
    });
  }

  getNotificationTask(userId,entityId){
    return this.http.get<any[]>(`${this.serverApiUrl.ADMIN_API_URL}/notificationTask?userId=${userId}&entityId=${entityId}`,{
      headers : {'Content-Type': 'application/json'}
    });
  }

  getMyTaskDetails(userId,entityId){
    return this.http.get<any[]>(`${this.serverApiUrl.ADMIN_API_URL}/myTasks?userId=${userId}&entityId=${entityId}`,{
      headers : {'Content-Type': 'application/json'}
    });
  }

  updateNotificationStatus(notificationId: number): Observable<any>{
    return  this.http.post<any>(`${this.serverApiUrl.ADMIN_API_URL}/updateNotificationStatus?notificationId=${notificationId}`, null, {
      headers: {'Content-Type': 'application/json'}
    });
  }

  getTaskPriorityCodes(): Observable<any[]>{
   return this.http.get<any[]>(this.serverApiUrl.API_URL +`/api/staticData/getStaticDataValue?dataNameKey=TASK_PRIORITY`);
 }

  getModuleValues(): Observable<any[]>{
    return this.http.get<any[]>(this.serverApiUrl.API_URL +`/api/staticData/getStaticDataValue?dataNameKey=DASHBOARD`);
}

 getTaskStatusCodes(): Observable<any[]>{
   return this.http.get<any[]>(this.serverApiUrl.API_URL +`/api/staticData/getStaticDataValue?dataNameKey=TASK_STATUS`);
}

 getReadUnreadCodes(): Observable<any[]>{
   return this.http.get<any[]>(this.serverApiUrl.API_URL +`/api/staticData/getStaticDataValue?dataNameKey=READ_UNREAD`);
 }

  getTaskQueues(): Observable<any[]>{
    return this.http.get<any[]>(this.serverApiUrl.API_URL +`/api/staticData/getStaticDataValue?dataNameKey=TASK_QUEUE`);
  }

  getPagingOptions(): Observable<any[]>{
    return this.http.get<any[]>(this.serverApiUrl.API_URL +`/api/staticData/getStaticDataValue?dataNameKey=TABLE_RESULTS`);
  }

  getRecordType(): Observable<any[]>{
    return this.http.get<any[]>(this.serverApiUrl.API_URL +`/api/staticData/getStaticDataValue?dataNameKey=RECORD_TYPE`);
  }

  getGrandRegion(): Observable<any[]>{
    return this.http.get<any[]>(this.serverApiUrl.API_URL +`/api/staticData/getStaticDataValue?dataNameKey=GRAND_REGION`);
  }

  getPersonDetails(searchText, entityId): Observable<any[]> {
    return this.http.get<any[]>(`${this.serverApiUrl.API_URL}/api/es-user/personSearch?searchText=${searchText}&entityId=${entityId}`);
  }

  createTask(payload: any): Observable<any>{
    return  this.http.post<any>(`${this.serverApiUrl.ADMIN_API_URL}/createTask`, payload);
  }

  getAllTaskNames(userId): Observable<any[]> {
    return this.http.get<any[]>(`${this.serverApiUrl.ADMIN_API_URL}/getAllTaskMaster?userId=${userId}`);
  }

  getRoleNames(): Observable<any[]>{
    return this.http.get<any[]>(this.serverApiUrl.ADMIN_API_URL +`/secRoleDetails`);
  }

  getEntityNames(): Observable<any[]>{
    return this.http.get<any[]>(this.serverApiUrl.ADMIN_API_URL +`/secOrgDetails`);
  }

  getPageId(taskMasterId: number) {
    return this.http.get<any[]>(`${this.serverApiUrl.ADMIN_API_URL}/moduleLandingPage?taskMasterId=${taskMasterId}`);
  }

  updateTask(payload: any): Observable<any>{
    return  this.http.post<any>(`${this.serverApiUrl.ADMIN_API_URL}/updateTask`, payload);
  }

}
