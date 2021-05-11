import { AuditHistory } from './../../../_shared/model/AuditHistory';
import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import { EnvService } from '../../../_shared/utility/env.service';

@Injectable({
  providedIn: 'root'
})
export class AuditHistoryService {
  public serverApiUrl: any;

  constructor(private http: HttpClient,
              private envService: EnvService) {
                this.serverApiUrl = this.envService.apiUrl();
               }

  searchAuditHistory(auditHistory: AuditHistory): Observable<any[]> {
    let paramss = new HttpParams();
    paramss = paramss.append('appealId', auditHistory.appealId);
    paramss = paramss.append('paeId', auditHistory.paeId);
    paramss = paramss.append('userId', auditHistory.userId);
    paramss = paramss.append('personId', auditHistory.personId);
    paramss = paramss.append('pageId', auditHistory.pageId);
    paramss = paramss.append('referralId', auditHistory.referralId);
    paramss = paramss.append('modifiedFromDate', auditHistory.modifiedFromDate);
    paramss = paramss.append('modifiedToDate', auditHistory.modifiedToDate);
    return this.http.get<any[]>(this.serverApiUrl.API_URL + `/audit/search`, {params: paramss});
  }
}
