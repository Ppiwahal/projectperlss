import { ReferralFilter } from './../../../../_shared/model/ReferralFilter';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvService } from 'src/app/_shared/utility/env.service';
import { RefEnterIntakeOutcome } from '../../../../_shared/model/RefEnterIntakeOutcome';

@Injectable({
  providedIn: 'root'
})
export class ReferralDashboardService {
  serverApiUrl: any;
  response: any;

  constructor(private http: HttpClient,
              private envService: EnvService) {
      this.serverApiUrl = this.envService.apiUrl();
    }

    getCountPendingReferral(userId): Observable<any>{
      let paramss = new HttpParams();
      paramss = paramss.append('userId', userId);
      return this.http.get<Observable<any>>(this.serverApiUrl.API_URL + `/referral/countPendingReferrals`, {params: paramss});
    }

    getIntakeStats(userId): Observable<any>{
      let paramss = new HttpParams();
      paramss = paramss.append('userId', userId);
      return this.http.get<Observable<any>>(this.serverApiUrl.API_URL + `/referral/countIntakeStats`, {params: paramss});
    }

    getEcfReferralStats(region, entity): Observable<any>{
      let paramss = new HttpParams();
      paramss = paramss.append('region', region);
      paramss = paramss.append('categoryType', entity);
      return this.http.get<Observable<any>>(this.serverApiUrl.API_URL + `/referral/getECFReferralStatCount`, {params: paramss});
    }

    getKbReferralStats(region): Observable<any>{
      let paramss = new HttpParams();
      paramss = paramss.append('region', region);
      return this.http.get<Observable<any>>(this.serverApiUrl.API_URL + `/referral/getKBReferralStatCount`, {params: paramss});
    }

    getReferralQueueCount(userId, entityId, dashboardCd, taskStatusCd): Observable<any>{
      let paramss =  new HttpParams();
      paramss = paramss.append('userId', userId);
      paramss = paramss.append('entityId', entityId);
      paramss = paramss.append('dashboardCd', dashboardCd);
      paramss = paramss.append('taskStatusCd', 'NW');

      return this.http.get<Observable<any>>
      (this.serverApiUrl.API_URL
        + `/referral/referralQueueCount`, {params: paramss});
    }

    getPersonDetails(searchText,entityId): Observable<any[]> {
      let paramss =  new HttpParams();
      paramss = paramss.append('searchText', searchText);
      paramss = paramss.append('entityId', entityId);
      return this.http.get<any[]>(`${this.serverApiUrl.API_URL}/api/es-user/personSearch`, {params: paramss});
    }
    
    getReferralMyOpenTaskList(userId, dashboardCd): Observable<any[]> {
      let paramss =  new HttpParams();
      paramss = paramss.append('userId', userId);
      paramss = paramss.append('dashboardCd', dashboardCd);

     // getAdjudicationDetails(parentId: any): Observable<any[]> {

      return this.http.get<any[]>
      (this.serverApiUrl.API_URL
        + `/referral/refOpenTasksCount`, {params: paramss});
      }


    getReferralSearch(referralFilterRequest: ReferralFilter, entityId): Observable<any>{
      let paramss = new HttpParams();
      paramss = paramss.append('personId', referralFilterRequest.personId);
      paramss = paramss.append('entityId', entityId); 
      paramss = paramss.append('grandRegion', referralFilterRequest.grandRegion);
      paramss = paramss.append('referralId', referralFilterRequest.referralId);
      paramss = paramss.append('referralReceivedDate', referralFilterRequest.referralReceivedDate);
      paramss = paramss.append('referralStatus', referralFilterRequest.referralStatus);
      paramss = paramss.append('taskQueue', referralFilterRequest.taskQueue);
      paramss = paramss.append('taskStatus', referralFilterRequest.taskStatus);
      console.log(referralFilterRequest);
      return this.http.get<Observable<any>>(this.serverApiUrl.API_URL + `/referral/referralSearch`, {params: paramss});
    }

    initiateIntake(refId, taskId, userId): Observable<any>{
      let body: any;
      body = {'refId': refId, 'taskId': taskId, 'userId': userId};
      return this.http.post<Observable<any>>(this.serverApiUrl.API_URL + `/referral/initiateIntake`, body);
    }

    deleteReferral(refId): Observable<any>{
      let body: any;
      body = {refId : refId };
      return this.http.post<Observable<any>>(this.serverApiUrl.API_URL + `/referral/deleteRefRequest`, body);
    }

    async getReferralPage(refId: string) {
      const response = await this.http.get(this.serverApiUrl.API_URL + `/referral/getNextPageId`,
      { observe: 'response', params: {refId} }).toPromise();
      return response;
    }

    async postEnterIntakeOutcome(enterIntakeOutcomeData: RefEnterIntakeOutcome): Promise<HttpResponse<any>> {
      console.log("i am inside service call");
      return await this.http.post<any>(this.serverApiUrl.API_URL + `/referral/intakeAction/enterIntakeOutcome`,
      enterIntakeOutcomeData, { observe: 'response' }).toPromise();
    }
}