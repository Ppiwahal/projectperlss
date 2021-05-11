import { EnvService } from 'src/app/_shared/utility/env.service';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  serverApiUrl: any;
  response: any;
  localStorageLocal = localStorage.getItem('APP_STORAGE_TOKEN');
  userId = JSON.parse(this.localStorageLocal).userName;
  entityId = JSON.parse(this.localStorageLocal).entityId;

  constructor(private http: HttpClient,
              private envService: EnvService) {
              this.serverApiUrl = this.envService.apiUrl();
    }

    getNotifications(assignedUserID: string):Observable<any[]> {
      let params = new HttpParams();
      params = params.append('assignedUserID', this.userId);
      return this.http.get<any[]>(this.serverApiUrl.API_URL + `/supportFunctions/getAllNotifications`, {params: params});
    }

    getNotificationDetails(assignedUserID: string, notificationId: number):Observable<any[]> {
      // let params = new HttpParams();
      // params = params.append('assignedUserID', 'dcu8172');
      return this.http.get<any[]>(this.serverApiUrl.API_URL
        + `/supportFunctions/getNotificationDetails?notificationId=${notificationId}`/*, {params: params}*/);
    }


}
