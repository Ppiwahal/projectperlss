import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http/';
import { Observable, of } from 'rxjs';
import { EnvService } from '../../_shared/utility/env.service';

@Injectable({
  providedIn: 'root'
})
export class WaitingListService {

  public serverApiUrl: any;
  constructor(private http: HttpClient,
              private envService: EnvService) {
    this.serverApiUrl = this.envService.apiUrl();
  }

  getWaitingListStatusValues(): Observable<any[]>{
   return this.http.get<any[]>(this.serverApiUrl.API_URL +`/api/staticData/getStaticDataValue?dataNameKey=KB_REFERRAL_STATUS`);
 }

  getProgramTypes(): Observable<any[]>{
   return this.http.get<any[]>(this.serverApiUrl.API_URL +`/api/staticData/getStaticDataValue?dataNameKey=REF_PROGRAMS`);
  }

 getReassessmentDates(): Observable<any[]>{
  return this.http.get<any[]>(this.serverApiUrl.API_URL +`/api/staticData/getStaticDataValue?dataNameKey=OUTREACH_DUE`);
  }

 getTaskStatusValues(): Observable<any[]>{
   return this.http.get<any[]>(this.serverApiUrl.API_URL +`/api/staticData/getStaticDataValue?dataNameKey=TASK_STATUS`);
 }

  getTaskQueues(): Observable<any[]>{
    return this.http.get<any[]>(this.serverApiUrl.API_URL +`/api/staticData/getStaticDataValue?dataNameKey=TASK_QUEUE`);
  }

  getUpdateActionValues(): Observable<any[]> {
    return this.http.get<any[]>(this.serverApiUrl.API_URL +`/api/staticData/getStaticDataValue?dataNameKey=WAITING_LIST_UPDATE`);
  }

  getReasonValues(): Observable<any[]> {
    return this.http.get<any[]>(this.serverApiUrl.API_URL +`/api/staticData/getStaticDataValue?dataNameKey=REMOVE_FROM_REFERRAL_LIST`);
  }

  getRelationshipValues(): Observable<any[]> {
    return this.http.get<any[]>(this.serverApiUrl.API_URL +`/api/staticData/getStaticDataValue?dataNameKey=RELATIONSHIP`);
  }

  getTypeOfContactValues(): Observable<any[]> {
    return this.http.get<any[]>(this.serverApiUrl.API_URL +`/api/staticData/getStaticDataValue?dataNameKey=CONTACT_METHOD`);
  }

  getWaitingListQueues(userId, entityId): Observable<any> {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/waitingListManagement/waitingListQueues?userId=${userId}&entityId=${entityId}`);
  }

  getPartAWaitingList(): Observable<any[]> {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/waitingListManagement/kbPartAWaitingList`);
  }

  getPartBWaitingList(): Observable<any[]> {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/waitingListManagement/kbPartBWaitingList`);
  }

  getPersonDetails(searchText, entityId): Observable<any[]> {
    return this.http.get<any[]>(`${this.serverApiUrl.API_URL}/api/es-user/personSearch?searchText=${searchText}&entityId=${entityId}`);
  }

  searchPerson(queryParam, queryValue): Observable<any[]> {
    return this.http.get<any[]>(`${this.serverApiUrl.API_URL}/waitingListManagement/searchResults?${queryParam}=${queryValue}`);
  }

  getWaitingListDetails(personId): Observable<any> {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/waitingListManagement/waitingListDetails?personId=${personId}`);
  }

  getPartBRank(refid): Observable<any> {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/waitingListManagement/currentRank?refId=${refid}`);
  }

  getWaitingListHistory(waitingList, entityId): Observable<any[]> {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/waitingListManagement/waitingListHistory?waitingList=${waitingList}&entityId=${entityId}`);
  }

  getWaitingListHistoryContact(waitingList, entityId): Observable<any[]> {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/waitingListManagement/waitingListHistoryContact?waitingList=${waitingList}&entityId=${entityId}`);
  }

  updateWaitingListDetails(payload): Observable<any> {
    return this.http.post<any[]>(`${this.serverApiUrl.API_URL}/waitingListManagement/updateWaitingListDetails`,payload);
  }
}

