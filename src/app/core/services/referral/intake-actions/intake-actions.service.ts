import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RefEnterIntakeOutcome } from '../../../../_shared/model/RefEnterIntakeOutcome';
import { RefIntakeActionExtension } from '../../../../_shared/model/RefIntakeActionExtension';
import { RefIntakeActionReassignment } from '../../../../_shared/model/RefIntakeActionReassignment';
import { RefIntakeActionAppointment } from '../../../../_shared/model/RefIntakeActionAppointment';
import { EnvService } from '../../../../_shared/utility/env.service';

@Injectable({
  providedIn: 'root'
})
export class IntakeActionsService {
    serverApiUrl: any;
  response: any;

  constructor(private http: HttpClient,
    private envService: EnvService) {
    this.serverApiUrl = this.envService.apiUrl();
  }

  getIntakeActionsHeader(refId): Observable<any> {
    let paramss = new HttpParams();
    paramss = paramss.append('refId', refId);
    return this.http.get<Observable<any>>(this.serverApiUrl.API_URL + `/referral/intakeAction/header`, { params: paramss });
  }

  getIntakeActionsSummary(refId): Observable<any> {
    let paramss = new HttpParams();
    paramss = paramss.append('refId', refId);
    return this.http.get<Observable<any>>(this.serverApiUrl.API_URL + `/referral/intakeAction/summary`, { params: paramss });
  }


  getIntakeActionsExtension(refId): Observable<any> {
    let paramss = new HttpParams();
    paramss = paramss.append('refId', refId);
    return this.http.get<Observable<any>>(this.serverApiUrl.API_URL + `/referral/intakeAction/requestExtension`, { params: paramss });
  }


  getIntakeActionsScheduleVisit(refId): Observable<any> {
    let paramss = new HttpParams();
    paramss = paramss.append('refId', refId);
    return this.http.get<Observable<any>>(this.serverApiUrl.API_URL + `/referral/intakeAction/scheduleIntakeVisit`, { params: paramss });
  }


  getIntakeActionsReassignment(refId): Observable<any> {
    let paramss = new HttpParams();
    paramss = paramss.append('refId', refId);
    return this.http.get<Observable<any>>(this.serverApiUrl.API_URL + `/referral/intakeAction/returnForReassignment`, { params: paramss });
  }


  getIntakeActionsEnterIntakeOutcome(refId): Observable<any> {
    let paramss = new HttpParams();
    paramss = paramss.append('refId', refId);
    return this.http.get<Observable<any>>(this.serverApiUrl.API_URL + `/referral/intakeAction/enterIntakeOutcome`, { params: paramss });
  }

  getUniqueAddressList(refId, personId) {
    let paramss = new HttpParams();
    paramss = paramss.append('refId', refId);
    paramss = paramss.append('prsnId', personId);
    return this.http.get<Observable<any>>(this.serverApiUrl.API_URL + `/referral/intakeAction/uniqueAddressList`, { params: paramss });
  }

  postRequestExtension(requestExtensionData: RefIntakeActionExtension): Observable<any[]> {
    return this.http.post<any[]>(this.serverApiUrl.API_URL + `/referral/intakeAction/requestExtension`, requestExtensionData);
  }

  postReassignment(reassignmentData: RefIntakeActionReassignment): Observable<any[]> {
    return this.http.post<any[]>(this.serverApiUrl.API_URL + `/referral/intakeAction/returnForReassignment`, reassignmentData);
  }

  postScheduleAppointment(scheduleAppointmentData: RefIntakeActionAppointment): Observable<any[]> {
    return this.http.post<any[]>(this.serverApiUrl.API_URL + `/referral/intakeAction/scheduleIntakeVisit`, scheduleAppointmentData);
  }

  postEnterIntakeOutcome(enterIntakeOutcomeData: RefEnterIntakeOutcome): Observable<any> {
    return this.http.post<any>(this.serverApiUrl.API_URL + `/referral/intakeAction/enterIntakeOutcome`, enterIntakeOutcomeData);
  }

}
