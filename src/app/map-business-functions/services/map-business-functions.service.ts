import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http/';
import { Observable } from 'rxjs';
import { EnvService } from '../../_shared/utility/env.service';

@Injectable({
  providedIn: 'root'
})

export class MapBusinessFunctionsService {

  public serverApiUrl: any;

  constructor(private http: HttpClient, private envService: EnvService) {
    this.serverApiUrl = this.envService.apiUrl();
  }

  getSearchDropdowns(input): Observable<any> {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/api/staticData/getStaticDataValue?dataNameKey=` + input, {
      headers : {'Content-Type': 'application/json'}
    });
  }

  getEntityNames(): Observable<any[]> {
    return this.http.get<any[]>(this.serverApiUrl.ADMIN_API_URL + `/secOrgDetails`);
  }

  getUserRoles(): Observable<any[]> {
    return this.http.get<any[]>(this.serverApiUrl.ADMIN_API_URL + `/secRoleDetails`);
  }

  getMapFunctionsByRoleId(roleId: number): Observable<any> {
    return this.http.get<any>(`${this.serverApiUrl.ADMIN_API_URL}/mapfunctions/${roleId}`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  mapFunctions(payload: any): Observable<any> {
    return this.http.post<any>(`${this.serverApiUrl.ADMIN_API_URL}/mapfunctions`, payload);
  }

}

