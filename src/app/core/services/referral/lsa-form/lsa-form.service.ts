import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { EnvService } from 'src/app/_shared/utility/env.service';

@Injectable({
  providedIn: 'root'
})
export class LsaFormService {

  serverApiUrl: any;
  dialogResult = new Subject<any>();
  response: any;
  refId: string;

  constructor(
    private http: HttpClient,
    private envService: EnvService
  ) {
    this.serverApiUrl = this.envService.apiUrl();
  }

  getRefId(){
    if (this.refId == null) {
      console.log("Warning: null refId requested");
    }
    return this.refId;
  }

  setRefId(refId){
    this.refId = refId;
  }

  lsaFormInformant(request: any): Observable<any[]> {
    return this.http.post<any[]>(this.serverApiUrl.API_URL + '/intakeOutcome/lsaFormInformant', request);
  }

  getLsaFormRequest(refId: string): Observable<any[]> {
    let paramss = new HttpParams();
    paramss = paramss.append('refId', refId);
    return this.http.get<any>(
      this.serverApiUrl.API_URL + '/intakeOutcome/lsaFormRequest',
      {params: paramss}
    );
  }

  informantQuestionsResponse(request: any): Observable<any[]> {
    return this.http.post<any[]>(this.serverApiUrl.API_URL + '/intakeOutcome/saveInformantResponse', request);
  }

  lsaFormSubmissionRequest(request: any): Observable<any[]> {
    return this.http.post<any[]>(this.serverApiUrl.API_URL + '/intakeOutcome/lsaFormSubmission', request);
  }
}
