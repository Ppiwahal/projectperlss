import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvService } from 'src/app/_shared/utility/env.service';
import { Favorite } from "../../../_shared/model/Favorite";

@Injectable({
  providedIn: 'root'
})
export class UserDetailsService {
  serverApiUrl: any;
  response: any;

  constructor(private http: HttpClient,
              private envService: EnvService) {
              this.serverApiUrl = this.envService.apiUrl();
    }

    getHomeDashboard(userId: string, entityId: string):Observable<any[]> {
      let paramss = new HttpParams();
      paramss = paramss.append('userId', userId);
      paramss = paramss.append('entityId', entityId);
      return this.http.get<any[]>(this.serverApiUrl.API_URL + `/home/getHomeDashboard/`, {params: paramss});
    }

    async saveHomeDash(fvrtDetails: Favorite): Promise<HttpResponse<any>> {
      const localStorageLocal = localStorage.getItem('APP_STORAGE_TOKEN');
      const userId = JSON.parse(localStorageLocal).userName;
      const entityId = JSON.parse(localStorageLocal).entityId;
      const response =  await this.http.post<any>(this.serverApiUrl.API_URL + `/home/saveHomeDashboard/?userId=${userId}&entityId=${entityId}`,
      fvrtDetails, { observe: 'response' }).toPromise();
      return response;
    }

}
