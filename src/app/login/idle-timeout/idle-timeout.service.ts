import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient, HttpResponse } from '@angular/common/http/';
import { Observable, of } from 'rxjs';
import { EnvService } from '../../_shared/utility/env.service';


@Injectable({ providedIn: 'root' })
export class IdleTimeoutService {
  id: string;
  createdBy: string;
  response: any;
  httpClient: HttpClient;
  public serverApiUrl: any;
  constructor(private http: HttpClient,
    handler: HttpBackend,
    private envService: EnvService) {
    this.serverApiUrl = this.envService.apiUrl();
    this.httpClient = new HttpClient(handler);
  }

  getSessionInfo(payload: any): Observable<any> {
    return this.httpClient.post<any>(`${this.serverApiUrl.ADMIN_API_URL}/api/accounts/getSessionInfo`, payload, {
      headers: { 'Content-Type': 'application/json' }
    });

  }


  idleTimeout(payload: any): Observable<any> {
    return this.httpClient.post<any>(`${this.serverApiUrl.ADMIN_API_URL}/api/accounts/timeRefresh`, payload, {
      headers: { 'Content-Type': 'application/json' }
    });
  }




}
