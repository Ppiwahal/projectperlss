import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';
import { EnvService } from '../../../_shared/utility/env.service';

@Injectable({
  providedIn: 'root'
})
export class AuditDetailsService {
  private parentId: any;
  public serverApiUrl: any;

  constructor(private http: HttpClient,
              private envService: EnvService) {
                this.serverApiUrl = this.envService.apiUrl();
  }

  setAuditSearchParentId(parentId) {
    this.parentId = parentId;
  }

  getAuditSearchParentId() {
    return this.parentId;
  }

  getAuditDetails(parentId: any): Observable<any[]> {
    let paramss = new HttpParams();
    paramss = paramss.append('parentId', String(parentId));
    return this.http.get<any[]>(this.serverApiUrl.API_URL + `/audit/searchDetails`, {params: paramss});
  }
}
