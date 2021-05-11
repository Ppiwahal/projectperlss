import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvService } from 'src/app/_shared/utility/env.service';

@Injectable({
  providedIn: 'root'
})
export class TransitionsDetailsService {
  serverApiUrl: any;

  constructor(private http: HttpClient,
    private envService: EnvService) {
this.serverApiUrl = this.envService.apiUrl();
}


getpaeDetails(personId): Observable<any>{
  let paramss = new HttpParams();
      paramss = paramss.append('personId', personId);
  return this.http.get<Observable<any>>(this.serverApiUrl.API_URL + `/transitions/paeDetails`,
  {params: paramss});

}
}
