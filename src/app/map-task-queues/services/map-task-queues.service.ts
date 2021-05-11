import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http/';
import { forkJoin, Observable, of } from 'rxjs';
import { EnvService } from '../../_shared/utility/env.service';

@Injectable({
  providedIn: 'root'
})

export class MapTaskService {
 
  public serverApiUrl: any;
  public requestOptions: Object = {
    responseType: 'text'
  }
  constructor(private http: HttpClient,
    private envService: EnvService) {
    this.serverApiUrl = this.envService.apiUrl();
  }

  public getStaticDataValues(): Observable<any[]> {
    let response1 = this.http.get<any[]>(this.serverApiUrl.API_URL + `/api/staticData/getStaticDataValue?dataNameKey=ENTITY_TYPE`,{
    
      headers: { 'Content-Type': 'application/json' }
    });
    
    let response2 = this.http.get<any>(`${this.serverApiUrl.API_URL}/api/staticData/getStaticDataValue?dataNameKey=CLASSIFICATION`, {
      headers: { 'Content-Type': 'application/json' }
    });
   
    let response3 = this.http.get<any>(`${this.serverApiUrl.API_URL}/api/staticData/getStaticDataValue?dataNameKey=DASHBOARD`, {
      headers: { 'Content-Type': 'application/json' }
    });
   
   
    return forkJoin([response1, response2, response3]);
  }
  getEntityNames(): Observable<any[]> {
    return this.http.get<any[]>(this.serverApiUrl.ADMIN_API_URL + `/secOrgDetails`);
  }
  getUserRoles(): Observable<any[]> {
    return this.http.get<any[]>(this.serverApiUrl.ADMIN_API_URL + `/secRoleDetails`);
  }

  getMapQueuesByRoleId(roleId: number): Observable<any> {
    return this.http.get<any>(`${this.serverApiUrl.ADMIN_API_URL}/admintask/mapqueues/${roleId}`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  mapQueues(payload: any): Observable<any> {
    return this.http.post<any>(`${this.serverApiUrl.ADMIN_API_URL}/admintask/mapqueues`, payload,
      this.requestOptions);
  }
}

