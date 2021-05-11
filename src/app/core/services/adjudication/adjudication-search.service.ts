import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {Observable} from 'rxjs';
import { EnvService } from '../../../_shared/utility/env.service';

@Injectable({
  providedIn: 'root'
})
export class AdjudicationSearchService {
  public serverApiUrl: any;
  constructor(private http: HttpClient,
              private envService: EnvService) {
                this.serverApiUrl = this.envService.apiUrl();
              }

  searchAdjudication(adjudication): Observable<any[]> {
    let paramss = new HttpParams();
    paramss = paramss.append('person', adjudication.appealId);
    paramss = paramss.append('paeId', adjudication.paeId);
    paramss = paramss.append('assignedUser', adjudication.assignedUser);
    paramss = paramss.append('paeSubmisstionFromDate', adjudication.paeSubmisstionFromDate);
    paramss = paramss.append('paeSubmisstionToDate', adjudication.paeSubmisstionToDate);
    paramss = paramss.append('adjudicationDueDays', adjudication.adjudicationDueDays);
    paramss = paramss.append('enrollmentGroup', adjudication.enrollmentGroup);
    paramss = paramss.append('adjudicationStatus', adjudication.adjudicationStatus);
    paramss = paramss.append('queueName', adjudication.queueName);
    paramss = paramss.append('taskStatus', adjudication.taskStatus);
    return this.http.post<any[]>(this.serverApiUrl.API_URL + `/adj/searchAdjQueue`, {params: paramss});
  }
}