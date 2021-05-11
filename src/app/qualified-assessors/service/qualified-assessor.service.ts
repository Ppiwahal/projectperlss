import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http/';
import {Observable, of} from 'rxjs';
import { EnvService } from '../../_shared/utility/env.service';

@Injectable({
  providedIn: 'root'
})
export class QualifiedAssessorService {
  public serverApiUrl: any;
  constructor(private http: HttpClient,
    private envService: EnvService) {
      this.serverApiUrl = this.envService.apiUrl();
    }

    getEntityDropdown(): Observable<any> {
      return this.http.get<any>(`${this.serverApiUrl.ADMIN_API_URL}/secOrgDetails`, {
        headers : {'Content-Type': 'application/json'}
      });
    }

    getAssessorData(params:string): Observable<any> {
      return this.http.get<any>(`${this.serverApiUrl.API_URL}/api/getAssessors?${params}`, {
        headers : {'Content-Type': 'application/json'}
      });
    }

    getAssessorPopUpData(assessorId:any): Observable<any> {
      return this.http.get<any>(`${this.serverApiUrl.API_URL}/api/getAssessor?assessorId=${assessorId}`, {
        headers : {'Content-Type': 'application/json'}
      });
    }

    getDropDownValues(input) : Observable<any> {
      return this.http.get<any>(`${this.serverApiUrl.API_URL}/api/staticData/getStaticDataValue?dataNameKey=${input}`, {
        headers : {'Content-Type': 'application/json'}
      });
    }

    updateAssessor(payload) {
      return this.http.post<any>(`${this.serverApiUrl.API_URL}/api/updateAssessor`, payload,{
        headers : {'Content-Type': 'application/json'}
      });
    }

    addAssessor(payLoad){
      return this.http.post<any>(`${this.serverApiUrl.API_URL}/api/addAssessor`, payLoad,{
        headers : {'Content-Type': 'application/json'}
      });
    }

    getAssesserElasticSearch(input) : Observable<any> {
      return this.http.get<any>(`${this.serverApiUrl.ADMIN_API_URL}/api/es-assessor/search?search=${input}`, {
        headers : {'Content-Type': 'application/json'}
      });
    }

    getDataByAssessrId(assessorId:any): Observable<any> {
      return this.http.get<any>(`${this.serverApiUrl.API_URL}/api/getAssessor?assessorId=${assessorId}`, {
        headers : {'Content-Type': 'application/json'}
      });
    }

}
