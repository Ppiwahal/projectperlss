import { Injectable } from '@angular/core';
import { EnvService } from 'src/app/_shared/utility/env.service';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http/';
import { Observable } from 'rxjs';
import { SearchPerson } from 'src/app/_shared/model/SearchPerson';
import { PaeFilter } from 'src/app/_shared/model/PaeFilter';

@Injectable({
  providedIn: 'root'
})
export class PersonSearchService {
  public serverApiUrl: any;

  constructor(private http: HttpClient, private envService: EnvService) {
    this.serverApiUrl = this.envService.apiUrl()}


  getPersonDetails(searchText, entityId): Observable<any[]> {
    return this.http.get<any[]>(`${this.serverApiUrl.API_URL}/api/es-user/personSearch?searchText=${searchText}&entityId=${entityId}`);
  }

  getUserProfilesByEntityId(entityId): Observable<any[]>{
    return this.http.get<any[]>(this.serverApiUrl.API_URL +`/supportFunctions/getUserProfileByEntityId?entityId=${entityId}`);
  }


  getPersonMatchDetails(personId, recordId, recordType) {
    return this.http.get<any>(`${this.serverApiUrl.ADMIN_API_URL}/admin/personMatch?personId=${personId}&recordId=${recordId}&recordType=${recordType}`, {
      headers : {'Content-Type': 'application/json'}
    });
  }
  getApplicantRecords(personId, documentId) {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/supportFunctions/getApplicantRecords/` + personId + `/` + documentId, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  getSearchData(paeFilterRequest: PaeFilter, entityId): Observable<any>{

    let paramss = new HttpParams();
    paramss = paramss.append('entityId', entityId);
    paramss = paramss.append('personId', paeFilterRequest.personId);
    paramss = paramss.append('referralId', paeFilterRequest.referralId);
    paramss = paramss.append('paeId', paeFilterRequest.paeId);
    paramss = paramss.append('paeStatus', paeFilterRequest.paeStatus);
    paramss = paramss.append('grandRegion', paeFilterRequest.grandRegion);
    paramss = paramss.append('enrollmentGroup', paeFilterRequest.enrollmentGroup);

    return this.http.get<Observable<any>>(this.serverApiUrl.API_URL + `/pae/paeSearch`,
    {params: paramss});

  }
}
  // async getSearchPerson(searchPersonObject: SearchPerson): Promise<HttpResponse<any>> {
  //   const response = await this.http.get<any>(this.serverApiUrl.API_URL + '/pae/searchPerson', { observe: 'response', params: { firstName: searchPersonObject.firstName, lastName: searchPersonObject.lastName, ssn: searchPersonObject.ssn, dobDt: searchPersonObject.dobDt, midInitial: searchPersonObject.midInitial, suffix: searchPersonObject.suffix, genderCd: searchPersonObject.genderCd } }).toPromise();
  //   return response;
  // }



