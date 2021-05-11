import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { EnvService } from '../../../_shared/utility/env.service';
import { Router } from '@angular/router';
import { Cookie } from 'ng2-cookies';
import { PaeCommonService } from '../../services/pae/pae-common/pae-common.service';

@Injectable({
  providedIn: 'root'
})
export class AdjudicationDetailsService {
  private parentId: any;
  public serverApiUrl: any;
  public adjId$$ = new BehaviorSubject<any>(null);
  public paeCommonServiceData$$ = new BehaviorSubject<any>(null);
  public sltEnrGrpCd$$ = new BehaviorSubject<any>(null);
  public rqstdEnrGrpCd$$ = new BehaviorSubject<any>(null);
  public grandFatheredSw$$ = new BehaviorSubject<any>(null);
  public safetyExists$$ = new BehaviorSubject<any>(null);
  public safetyCompleted$$ = new BehaviorSubject<any>(null);

  rqstdEnrGrpCd: any;
  sltEnrGrpCd: any;

  getSafetyExists(): any {
    if (!this.safetyExists$$.value){
      this.safetyExists$$.next(false);
    }
    return this.safetyExists$$.asObservable()
  }

  updateSafetyExists(value: boolean): void {
    this.safetyExists$$.next(value);
  }

  getSafetyCompleted(): any {
    if (!this.safetyCompleted$$.value){
      this.safetyCompleted$$.next(false);
    }
    return this.safetyCompleted$$.asObservable()
  }

  updateSafetyCompleted(value: boolean): void {
    this.safetyCompleted$$.next(value);
  }


  constructor(private http: HttpClient,
    private envService: EnvService,
    private paeCommonService: PaeCommonService,
    private _router: Router) {
    this.serverApiUrl = this.envService.apiUrl();
  }

  public getSltEnrGrpCd(): string {
    return this.sltEnrGrpCd;
  }

  public setSltEnrGrpCd(sltEnrGrpCd) {
    this.sltEnrGrpCd = sltEnrGrpCd;
  }

  getEnrGrpCd() {
    return this.rqstdEnrGrpCd;
  }
  setEnrGrpCd(rqstdEnrGrpCd) {
    this.rqstdEnrGrpCd = rqstdEnrGrpCd;
  }

  setAdjudicationSearchParentId(parentId: any) {
    this.parentId = parentId;
  }
  getAdjudicationSearchParentId() {
    return this.parentId;
  }

  getAdjIdbyPaeId(paeId) {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/adj/getAdjDetailsByPeaId/${paeId}`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  getSearchDropdowns(input): Observable<any> {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/api/staticData/getStaticDataValue?dataNameKey=${input}`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  safetyDetermination(payload): any {
    return this.http.post<any>(`${this.serverApiUrl.API_URL}/adj/safetyDetermination`, payload, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  getSafetyDetermination(adjudicationId: any): any {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/adj/safetyDetermination/${adjudicationId}`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  getSafetyDeterminationFromPAE(adjudicationId: any): any {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/adj/safetyDeterminationFromPAE/${adjudicationId}`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  getAdjSafetyStatuses(adjudicationId: any): any {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/adj/getAdjSafetyStatuses/${adjudicationId}`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  getAdjudicationDetails(parentId: any): Observable<any[]> {
    let paramss = new HttpParams();
    paramss = paramss.append('parentId', String(parentId));
    return this.http.get<any[]>(this.serverApiUrl.API_URL + `/audit/searchDetails`, { params: paramss });
  }

  getAdjApplicantDetails(paeId, entityId): any {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/adj/viewAdjApplicantDetails/${paeId}/${entityId}`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  savePassrOutcome(payload): any {
    return this.http.post<any>(`${this.serverApiUrl.API_URL}/adj/savePasrrOutcome`, payload, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  getPassrOutcome(adjId: any): any {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/adj/pasrrOutcome/adj/${adjId}`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  getSupportingDocuments(adjId: any): any {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/adj/getAdjSupportingDocuments/${adjId}`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  getAcuityScoresFromOPA(payload) {
    return this.http.post<any>(`https://dev-opa.eppp.tenncare.tn.gov/opasbx/determinations-server/batch/12.2.19/policy-models/PERLSSOPAAcuityValues/assessor`, payload, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  paeRespiratoryCareForAdjId(adjId: any): any {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/adj/paeRespiratoryCareForAdjId/${adjId}`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  getPaeSkilledServiceDetails(adjId: any): any {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/adj/getPaeSkilledServiceDetails/${adjId}`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  getSkilledService(adjId: any): any {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/adj/SkilledServices/${adjId}`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  getSkilledServiceAcuityScore(paeId: any): any {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/pae/skilledService/summary?paeId=${paeId}`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  getfunctionalAssessment(adjId: any): any {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/adj/functionalAssessment/${adjId}`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  getAdjSummaryDetails(adjId: any): any {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/adj/getAdjSummaryDetails/${adjId}`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  getAdjDescision(adjId: any): any {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/adj/adjDetermination/${adjId}`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  loadFunctionalAssessmentFromPae(adjId: any): any {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/adj/loadFuncAssessmentFromPAE/${adjId}`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  saveAdjDscn(payload): any {
    return this.http.post<any>(`${this.serverApiUrl.API_URL}/adj/adjDetermination`, payload, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  saveFunctionalAssessmentTable(payload): any {
    return this.http.post<any>(`${this.serverApiUrl.API_URL}/adj/functionalAssessment`, payload, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  saveSkiledServices(payload): any {
    return this.http.post<any>(`${this.serverApiUrl.API_URL}/adj/SkilledServices`, payload, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  saveSafety(payload): any {
    return this.http.post<any>(`${this.serverApiUrl.API_URL}/adj/safetyDetermination`, payload, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  getAdjPopupDetail(dataNameKey) {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/api/staticData/getStaticDataValue?dataNameKey=${dataNameKey}`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  getAdjAdjClrRsnByAdId(adjId) {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/AdjClrfcnRsnPopUp/getAdjClrRsn?adjId=${adjId}`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  submitAdjPopupData(payload) {
    return this.http.post<any>(`${this.serverApiUrl.API_URL}/AdjClrfcnRsnPopUp/submit`, payload, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  async createPdf(): Promise<HttpResponse<any>> {
    let paramss = new HttpParams();
    paramss = paramss.append('adjId', this.paeCommonService.getAdjId());
    paramss = paramss.append('personId', this.paeCommonService.getPersonId());
    console.log('/referral/generatePdf: ' + JSON.stringify(paramss, null, ' '));
    return this.http.get<any>(this.serverApiUrl.API_URL + `/referral/generatePdf`, {params: paramss, observe: 'response'}).toPromise();
  }
}
