import { EnvService } from '../../../../app/_shared/utility/env.service';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationDetailsService {
  serverApiUrl: any;
  response: any;
  localStorageLocal = localStorage.getItem('APP_STORAGE_TOKEN');
  userId = JSON.parse(this.localStorageLocal).userName;
  entityId = JSON.parse(this.localStorageLocal).entityId;

  constructor(private http: HttpClient,
              private envService: EnvService) {
              this.serverApiUrl = this.envService.apiUrl();
    }

    getNotificationDetails(assignedUserID: string):Observable<any[]> {
      let params = new HttpParams();
      params = params.append('assignedUserID', this.userId);
      return this.http.get<any[]>(this.serverApiUrl.API_URL + ``, {params: params});
    }



}
function userName(arg0: string, userName: any): HttpParams {
  throw new Error('Function not implemented.');
}

