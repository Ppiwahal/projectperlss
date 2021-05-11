import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http/';
import { EnvService } from '../../_shared/utility/env.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PersonReconciliationService {

  public serverApiUrl: any;

  constructor(private http: HttpClient, private envService: EnvService) {
    this.serverApiUrl = this.envService.apiUrl();
  }

  getMDMRecipient(payload) {
    return this.http.post<any>(this.serverApiUrl.API_URL + `/mdm/getRecipient`, payload);
  }

  getConfirmLinkDetails(taskId, personId1, personId2) {
    return this.http.get<any>(`${this.serverApiUrl.ADMIN_API_URL}/confirmLinkDetails?taskId=${taskId}&primaryPrsnId=${personId1}&secondaryPrsnId=${personId2}`, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json'})
    });
  }

  personReconsiliation(userId, entityId) {
    return this.http.get<any>(`${this.serverApiUrl.ADMIN_API_URL}/personReconciliation?userId=${userId}&entityId=${entityId}`, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json'})
    });
  }

  getStaticDataValue(input): Observable<any> {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/api/staticData/getStaticDataValue?dataNameKey=` + input, {
      headers : {'Content-Type': 'application/json'}
    });
  }

  initiateLink(payload) {
    return this.http.post<any>(`${this.serverApiUrl.ADMIN_API_URL}/initiateLink`, payload);
  }

  mergeRecipient(payload) {
    return this.http.post<any>(`${this.serverApiUrl.API_URL}/mdm/mergeRecipient`, payload);
  }

  unMergeRecipient(payload) {
    return this.http.post<any>(`${this.serverApiUrl.API_URL}/mdm/unMergeRecipient`, payload);
  }

  triggerLinkUnlink(payload) {
    return this.http.post<any>(`${this.serverApiUrl.API_URL}/trigger`, payload);
  }

  initiateUnlink(payload) {
    return this.http.post<any>(`${this.serverApiUrl.ADMIN_API_URL}/initiateUnlink`, payload);
  }

  getAppealDropdowns(input): Observable<any> {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/api/staticData/getStaticDataValue?dataNameKey=${input}`, {
      headers : {'Content-Type': 'application/json'}
    });
  }

  getPersonMatchDetails(personId, recordId, recordType) { 
    return this.http.get<any>(`${this.serverApiUrl.ADMIN_API_URL}/admin/personMatch?personId=${personId}&recordId=${recordId}&recordType=${recordType}`, {
      headers : {'Content-Type': 'application/json'}
    });
  }

  updatePersonMatch(payload) {
    return this.http.post<any>(`${this.serverApiUrl.ADMIN_API_URL}/admin/personMatch`, payload);
  }

  updateTaskClosure(taskId: number,closureDetaildesc: string): Observable<any>{
    return  this.http.post<any>(`${this.serverApiUrl.ADMIN_API_URL}/closeTask?taskId=${taskId}&closuredetaildesc=${closureDetaildesc}`, null, {
      headers: {'Content-Type': 'application/json'}
    });
  }

  getsearchRecipient(payload) {
    return this.http.post<any>(`${this.serverApiUrl.API_URL}/mdm/searchRecipient`, payload);
  }

  updateRecipient(payload) {
    return this.http.post<any>(`${this.serverApiUrl.API_URL}/mdm/updateRecipient`, payload);
  }

  getMDMData() {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/api/staticData/getStaticDataValue?dataNameKey=MDM_THRESHOLD`  , {
      headers : {'Content-Type': 'application/json'}
    });
  }

  createTask(payload: any): Observable<any>{
    return this.http.post<any>(`${this.serverApiUrl.ADMIN_API_URL}/createTask`, payload);
  }

  verifyNewIndividual(payload: any): Observable<any>{
    return this.http.post<any>(`${this.serverApiUrl.ADMIN_API_URL}/admin/personMatch/verifyNewIndividual?personId=${payload.personId}&paeId=${payload.paeId}`, null);
  }

  updatePAEWithPerson(payload: any): Observable<any>{
    return this.http.post<any>(`${this.serverApiUrl.ADMIN_API_URL}/admin/personMatch/update-pae-with-person?personId=${payload.personId}&paeId=${payload.paeId}`, null);
  }

  updateREFWithPerson(payload: any): Observable<any>{
    return this.http.post<any>(`${this.serverApiUrl.ADMIN_API_URL}/admin/personMatch/update-ref-with-person?personId=${payload.personId}&refId=${payload.refId}`, null);
  }

}
