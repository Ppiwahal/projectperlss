import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http/';
import { forkJoin, Observable, of } from 'rxjs';
import { EnvService } from '../../_shared/utility/env.service';

@Injectable({
  providedIn: 'root'
})

export class UserRolesService {
  module;
  accessLevel;
  dashboardcode;
  public serverApiUrl: any;
  public requestOptions: Object = {
    responseType: 'text'
  }
  constructor(private http: HttpClient,
    private envService: EnvService) {
    this.serverApiUrl = this.envService.apiUrl();
  }

  createUserRole(payload: any): Observable<any> {
    return this.http.post<any>(`${this.serverApiUrl.ADMIN_API_URL}/manageRoles/createRole`, payload, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  getStatusValues(): Observable<any> {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/api/staticData/getStaticDataValue?dataNameKey=USER_ROLE_STATUS`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  editUserRole(payload: any): Observable<any> {
    return this.http.post<any>(`${this.serverApiUrl.ADMIN_API_URL}/manageRoles/updateRole`, payload, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  getUserRoles(userId: string, entityId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.serverApiUrl.ADMIN_API_URL}/manageRoles/Roles?userId=${userId}&entityId=${entityId}`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  getUserRoleDetailsByRoleId(roleId: number): Observable<any> {
    return this.http.get<any>(`${this.serverApiUrl.ADMIN_API_URL}/viewroles/${roleId}`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  getMapFunctionsByRoleId(roleId: number): Observable<any> {
    return this.http.get<any>(`${this.serverApiUrl.ADMIN_API_URL}/mapfunctions/${roleId}`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  mapFunctions(payload: any): Observable<any> {
    return this.http.post<any>(`${this.serverApiUrl.ADMIN_API_URL}/mapfunctions`, payload,
      this.requestOptions);
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

  getPagingOptions(): Observable<any[]> {
    return this.http.get<any[]>(this.serverApiUrl.API_URL + `/api/staticData/getStaticDataValue?dataNameKey=TABLE_RESULTS`);
  }

  getGrandRegion(): Observable<any[]> {
    return this.http.get<any[]>(this.serverApiUrl.API_URL + `/api/staticData/getStaticDataValue?dataNameKey=GRAND_REGION`);
  }

  getUserRoleByRoleId(): Observable<any[]> {
    return this.http.get<any[]>(this.serverApiUrl.API_URL + `/api/staticData/getStaticDataValue?dataNameKey=USER_ROLES`);
  }

  getEntityTypes(): Observable<any[]> {
    return this.http.get<any[]>(this.serverApiUrl.API_URL + `/api/staticData/getStaticDataValue?dataNameKey=ENTITY_TYPE`);
  }

  getEntityNames(): Observable<any[]> {
    return this.http.get<any[]>(this.serverApiUrl.ADMIN_API_URL + `/secOrgDetails`);
  }
  public getstaticCodeValues(): Observable<any[]> {

    let response1 = this.http.get<any>(`${this.serverApiUrl.API_URL}/api/staticData/getStaticDataValue?dataNameKey=MODULE`, {
      headers: { 'Content-Type': 'application/json' }

    });
    let response2 = this.http.get<any>(`${this.serverApiUrl.API_URL}/api/staticData/getStaticDataValue?dataNameKey=ACCESS_LEVEL`, {
      headers: { 'Content-Type': 'application/json' }

    });
    let response3 = this.http.get<any>(`${this.serverApiUrl.API_URL}/api/staticData/getStaticDataValue?dataNameKey=DASHBOARD`, {
      headers: { 'Content-Type': 'application/json' }

    });


    return forkJoin([response1, response2, response3]);
  }

}

