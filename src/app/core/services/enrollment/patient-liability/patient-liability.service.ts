import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvService } from 'src/app/_shared/utility/env.service';

@Injectable({
  providedIn: 'root',
})
export class PatientLiabilityService {
  
  personId: any;
  serverApiUrl: any;
  enrId: string;
  constructor(
    private http: HttpClient,
    private envService: EnvService
  ) {
    this.serverApiUrl = this.envService.apiUrl();
    // this.paeId = this.paeCommonService.getPaeId();
    this.personId = '1232345439';
  }
  setEnrId(enrId: string) {
    this.enrId=enrId;
  }
  
  getPersonLiability(): Observable<any> {
  
    return this.http.get<Observable<any>>(
      this.serverApiUrl.API_URL + `/enrollment/getPatientLiabilityDetails/`+this.enrId
    );
  }
}
