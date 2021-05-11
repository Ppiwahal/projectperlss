import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http/';
import { Observable, of } from 'rxjs';
import { EnvService } from '../../_shared/utility/env.service';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {

  public serverApiUrl: any;
  constructor(private http: HttpClient,
    private envService: EnvService) {
    this.serverApiUrl = this.envService.apiUrl();
  }

  getUserProfile(userId: string, entityId: any): Observable<any> {
    return this.http.get<any>(`${this.serverApiUrl.ADMIN_API_URL}/getUserProfiles?userId=${userId}&entityId=${entityId}`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  saveUserProfile(payload) {
    console.log("payload ", payload);
    return this.http.post<any>(`${this.serverApiUrl.ADMIN_API_URL}/editUserProfile`, payload, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  getSearchDropdowns(input): Observable<any> {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/api/staticData/getStaticDataValue?dataNameKey=${input}`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  getClassification(input): Observable<any> {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/api/staticData/getStaticDataValue?dataNameKey=${input}`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  getEntityDropdown(): Observable<any> {
    return this.http.get<any>(`${this.serverApiUrl.ADMIN_API_URL}/secOrgDetails`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  getSecRoleDetails(): Observable<any> {
    return this.http.get<any>(`${this.serverApiUrl.ADMIN_API_URL}/secRoleDetails`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

 

}
