import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { EnvService } from '../../_shared/utility/env.service';

@Injectable({
  providedIn: 'root'
})
export class StaticDataMapService {

  serverApiUrl: any;
  staticDataParsed: any;

constructor( private router: Router,
             private envService: EnvService,
             private http: HttpClient) {
              this.serverApiUrl = this.envService.apiUrl();
             }

getStaticData(): Promise<Observable<any>> {
  return this.http.get<Observable<any>>(this.serverApiUrl.API_URL + `/api/staticData/load`).toPromise();
}

getStaticDataKeyValue(key){
  this.staticDataParsed = JSON.parse(localStorage.getItem('STATIC_DATA_MAP'));
  if (this.staticDataParsed) {
    return this.staticDataParsed.staticDataMap[key];
  }
}

}
