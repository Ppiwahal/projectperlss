import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpParams } from '@angular/common/http/';
import { Observable } from 'rxjs';
import { EnvService } from '../../../_shared/utility/env.service';

@Injectable({
  providedIn: 'root'
})
export class ReferenceTableService {
  serverApiUrl: any;

  constructor(private http: HttpClient,
              private envService: EnvService) {
                this.serverApiUrl = this.envService.apiUrl();
               }

async getReferral(referenceTable){
let paramss = new HttpParams();
paramss = paramss.append('dataNameKey', referenceTable);
return await this.http.get(this.serverApiUrl.API_URL + `/api/staticData/getStaticDataValue`, {params: paramss}).toPromise(); }
}
