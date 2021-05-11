import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http/';
import { Observable, of } from 'rxjs';
import { EnvService } from '../../_shared/utility/env.service';


@Injectable({
  providedIn: 'root'
})
export class ReferralListManagementService {
  public serverApiUrl: any;
  public intakeOutcomeCodes;
  public referralListCodes;
  public taskQueueCodes;
  public taskStatusCodes;
  constructor(private http: HttpClient,
    private envService: EnvService) {
    this.serverApiUrl = this.envService.apiUrl();
  }

  getUpdateStatusCodes(): Observable<any[]>{
    return this.http.get<any[]>(this.serverApiUrl.API_URL +`/api/staticData/getStaticDataValue?dataNameKey=REFERRAL_LIST_UPDATE`);
  }

  getEnrollmentCodes(): Observable<any[]>{
    return this.http.get<any[]>(this.serverApiUrl.API_URL +`/api/staticData/getStaticDataValue?dataNameKey=REF_PROGRAMS`);
  }
  getSlotCodes(): Observable<any[]>{
    return this.http.get<any[]>(this.serverApiUrl.API_URL +`/api/staticData/getStaticDataValue?dataNameKey=SLOT_STATUS`);
  }
  getIntakeOutcomeCodes(): Observable<any[]>{
    return this.http.get<any[]>(this.serverApiUrl.API_URL +`/api/staticData/getStaticDataValue?dataNameKey=INTAKE_EVALUATION`);
  }
  getPaeStatusCodes(): Observable<any[]>{
    return this.http.get<any[]>(this.serverApiUrl.API_URL +`/api/staticData/getStaticDataValue?dataNameKey=PAE_STATUS`);
  }


  getReasonCodes(): Observable<any[]>{
    return this.http.get<any[]>(this.serverApiUrl.API_URL +`/api/staticData/getStaticDataValue?dataNameKey=REMOVE_FROM_REFERRAL_LIST`);
  }

  getAnnualOutreachCodes(): Observable<any[]>{
    return this.http.get<any[]>(this.serverApiUrl.API_URL +`/api/staticData/getStaticDataValue?dataNameKey=ANNUAL_OUTREACH`);
  }

  getInTakeOutcomeCount(): Observable<any[]>{
    return this.http.get<any[]>(this.serverApiUrl.API_URL +`/referralListManagement/countIntakeOutcome`);
  }

  getEvaluatedAgedCaregiver(): Observable<any[]>{
    return this.http.get<any[]>(this.serverApiUrl.API_URL +`/referralListManagement/countAgedCaregiver`);
  }

  getECFRefererralList(): Observable<any[]>{
    return this.http.get<any[]>(this.serverApiUrl.API_URL +`/referralListManagement/ecfReferralList`);
  }

  getReferralListQueue(): Observable<any[]>{
    return this.http.get<any[]>(this.serverApiUrl.API_URL +`/referralListManagement/referralListQueues?userId=dcu8641&entityId=1001`);
  }

    getReferralListStatus(): Observable<any[]>{
    return this.http.get<any[]>(this.serverApiUrl.API_URL +`/api/staticData/getStaticDataValue?dataNameKey=REFERRAL_LIST_STATUS`);
  }

  getIntakeOutCome(): Observable<any[]>{
    return this.http.get<any[]>(this.serverApiUrl.API_URL +`/api/staticData/getStaticDataValue?dataNameKey=INTAKE_EVALUATION`);
  }

  getOutreacDue(): Observable<any[]>{
    return this.http.get<any[]>(this.serverApiUrl.API_URL +`/api/staticData/getStaticDataValue?dataNameKey=OUTREACH_DUE`);
  }

  getTaskQueue(): Observable<any[]>{
    return this.http.get<any[]>(this.serverApiUrl.API_URL +`/api/staticData/getStaticDataValue?dataNameKey=TASK_QUEUE`);
  }

  getTaskStatus(): Observable<any[]>{
    return this.http.get<any[]>(this.serverApiUrl.API_URL +`/api/staticData/getStaticDataValue?dataNameKey=TASK_STATUS`);
  }

  getPersonDetails(searchText, entityId): Observable<any[]> {
    return this.http.get<any[]>(`${this.serverApiUrl.API_URL}/api/es-user/personSearch?searchText=${searchText}&entityId=${entityId}`);
  }

  getReferralSearhResult(queryParam:string): Observable<any[]> {
    return this.http.get<any[]>(`${this.serverApiUrl.API_URL}/referralListManagement/${queryParam}`);
  }

  getReferalListDetails(refId:any): Observable<any[]> {
    return this.http.get<any[]>(`${this.serverApiUrl.API_URL}/referralListManagement/refListDetails?refId=${refId}`);
  }

  getRelationshipValues(): Observable<any[]>{
    return this.http.get<any[]>(this.serverApiUrl.API_URL +`/api/staticData/getStaticDataValue?dataNameKey=RELATIONSHIP`);
  }

  getContactMethodValues(): Observable<any[]>{
    return this.http.get<any[]>(this.serverApiUrl.API_URL +`/api/staticData/getStaticDataValue?dataNameKey=CONTACT_METHOD`);
  }

  getReferalListHistory(refId:any): Observable<any[]> {
    return this.http.get<any[]>(`${this.serverApiUrl.API_URL}/referralListManagement/referralListHistory?refId=${refId}`);
  }

  updateReferralList(payload): Observable<any> {
    return this.http.post<any[]>(`${this.serverApiUrl.API_URL}/referralListManagement/referralStatus`,payload);
  }

  updateOutreachDetails(payload): Observable<any> {
    return this.http.post<any[]>(`${this.serverApiUrl.API_URL}/referralListManagement/outreachDetails`,payload);
  }


}
