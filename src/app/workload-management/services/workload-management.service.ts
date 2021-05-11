import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http/';
import {forkJoin, Observable, of, Subject} from 'rxjs';
import { EnvService } from '../../_shared/utility/env.service';

@Injectable({
  providedIn: 'root'
})
export class WorkloadManagementService {
  reloadWorkfloadComponent$$ = new Subject<boolean>();
  refreshWorkloadComponent$$ = new Subject<boolean>();
  reloadInboxComponent$$ = new Subject<void>();
  priority;
  grandRegion;
  taskStatus;
  yesNo;
  public serverApiUrl: any;
  constructor(private http: HttpClient,
    private envService: EnvService) {
      this.serverApiUrl = this.envService.apiUrl();
     }

     getDropDownValues(input: string): Observable<any[]>{
      return this.http.get<any[]>(this.serverApiUrl.API_URL +`/api/staticData/getStaticDataValue?dataNameKey=${input}`);
    }

    getTaskSearchData(input, entityId): Observable<any[]>{
      return this.http.get<any[]>(this.serverApiUrl.ADMIN_API_URL +`/searchTask?${input}&entityId=${entityId}`);
    }

    getPersonDetails(searchText, entityId): Observable<any[]> {
      return this.http.get<any[]>(`${this.serverApiUrl.API_URL}/api/es-user/personSearch?searchText=${searchText}&entityId=${entityId}`);
    }

    getTaskPerformancedDetails(userId:any, entityId:any): Observable<any[]>{
      return this.http.get<any[]>(this.serverApiUrl.ADMIN_API_URL +`/taskPerformanceDetails/stats?userId=${userId}&entityId=${entityId}`);
    }

  getPastDueTaskPerformanceDetails(userId:any, entityId:any): Observable<any[]>{
    return this.http.get<any[]>(this.serverApiUrl.ADMIN_API_URL +`/taskPerformanceDetails/past-due?userId=${userId}&entityId=${entityId}`);
  }

  getOpenTaskPerformanceDetails(userId:any, entityId:any): Observable<any[]>{
    return this.http.get<any[]>(this.serverApiUrl.ADMIN_API_URL +`/taskPerformanceDetails/open?userId=${userId}&entityId=${entityId}`);
  }

    getTaskDetail(taskId: number): Observable<any>{
      return  this.http.get<any>(`${this.serverApiUrl.ADMIN_API_URL}/getTaskDetail?taskId=${taskId}`);
    }

    getAssignTaskDetails(taskMasterIds: number[]): Observable<any>{
      return  this.http.get<any>(`${this.serverApiUrl.ADMIN_API_URL}/getAssignTaskDetails?taskMasterIds=${taskMasterIds.join(',')}`);
    }

    closeTask(taskId: number,closuredetaildesc: string): Observable<any>{
      return  this.http.post<any>(`${this.serverApiUrl.ADMIN_API_URL}/closeTask?taskId=${taskId}&closuredetaildesc=${closuredetaildesc}`,  {
        headers: {'Content-Type': 'application/json'}
      });
    }

    sendBackToQueue(taskIds: number): Observable<any>{
      return  this.http.post<any>(`${this.serverApiUrl.ADMIN_API_URL}/sendBackToQueue?taskIds=${taskIds}`,  {
        headers: {'Content-Type': 'application/json'}
      });
    }

    reassignTask(payload: any): Observable<any>{
      return  this.http.post<any>(`${this.serverApiUrl.ADMIN_API_URL}/reassignTask`, payload);
    }

    updateAdminTask(payload: any): Observable<any>{
      return  this.http.post<any>(`${this.serverApiUrl.ADMIN_API_URL}/update/adminTask`, payload);
    }

    taskHistory(taskId: number): Observable<any>{
      return  this.http.post<any>(`${this.serverApiUrl.ADMIN_API_URL}/get/taskHistory?taskId=${taskId}`,  {
        headers: {'Content-Type': 'application/json'}
      });
    }

    getRoleNames(): Observable<any[]>{
      return this.http.get<any[]>(this.serverApiUrl.ADMIN_API_URL +`/secRoleDetails`);
    }

    getEntityNames(): Observable<any[]>{
      return this.http.get<any[]>(this.serverApiUrl.ADMIN_API_URL +`/secOrgDetails`);
    }

    getTaskPriority(): Observable<any[]>{
      return this.http.get<any[]>(this.serverApiUrl.API_URL +`/api/staticData/getStaticDataValue?dataNameKey=TASK_PRIORITY`);
    }

    getGrandRegion(): Observable<any[]>{
      return this.http.get<any[]>(this.serverApiUrl.API_URL +`/api/staticData/getStaticDataValue?dataNameKey=GRAND_REGION`);
    }

    getExpediteReferral(): Observable<any[]>{
      return this.http.get<any[]>(this.serverApiUrl.API_URL +`/api/staticData/getStaticDataValue?dataNameKey=YES_NO`);
    }

    public getTaskDetailsCodeValues(): Observable<any[]> {
    let response1 = this.http.get<any>(`${this.serverApiUrl.API_URL}/api/staticData/getStaticDataValue?dataNameKey=TASK_PRIORITY`, {
      headers: { 'Content-Type': 'application/json' }
    });
    let response2 = this.http.get<any>(`${this.serverApiUrl.API_URL}/api/staticData/getStaticDataValue?dataNameKey=GRAND_REGION`, {
      headers: { 'Content-Type': 'application/json' }
    });
    let response3 = this.http.get<any>(`${this.serverApiUrl.API_URL}/api/staticData/getStaticDataValue?dataNameKey=YES_NO`, {
      headers: { 'Content-Type': 'application/json' }
    });
    return forkJoin([response1, response2,response3]);
  }


}
