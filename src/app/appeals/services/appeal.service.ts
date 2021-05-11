import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http/';
import { Observable, of } from 'rxjs';
import { EnvService } from '../../_shared/utility/env.service';

@Injectable({
  providedIn: 'root'
})
export class AppealService {

  public serverApiUrl: any;
  public appealIdCreatedData: any;

  constructor(private http: HttpClient, private envService: EnvService) {
    this.serverApiUrl = this.envService.apiUrl();
  }

  getPersonDetails(searchText, entityId): Observable<any[]> {
    return this.http.get<any[]>(`${this.serverApiUrl.API_URL}/api/es-user/personSearch?searchText=${searchText}&entityId=${entityId}`);
  }

  getAppealDropdowns(input): Observable<any> {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/api/staticData/getStaticDataValue?dataNameKey=${input}`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  getStaticDataValue(input): Observable<any> {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/api/staticData/getStaticDataValue?dataNameKey=${input}`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  getAppeallantDetails(personId, userId): Observable<any> {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/appeal-details/appellantsByPrsnId?prsnId=${personId}&userId=${userId}`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  getAppealType(input): Observable<any> {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/appeal-details/aplType?aplType=${input}`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  searchApplicantMdn(payload) {
    return this.http.post<any>(`${this.serverApiUrl.API_URL}/appeal-details/search`, payload, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  addPasrr(payload) {
    return this.http.post<any>(`${this.serverApiUrl.API_URL}/appealDetails/addPasrr`, payload, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  createAppeal(payload) {
    return this.http.post<any>(`${this.serverApiUrl.API_URL}/appeal-details`, payload, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  saveAppellantDetails(payload) {
    return this.http.post<any>(`${this.serverApiUrl.API_URL}/appeal-details/saveAppealDetail`, payload, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  getAppealReviewOnLoad(aplId) {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/appeals/${aplId}/review`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  saveAppealOverView(aplId, payLoad) {
    return this.http.post<any>(`${this.serverApiUrl.API_URL}/appeals/${aplId}/review/overview`, payLoad, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  saveAppealNurseReview(aplId, payLoad) {
    return this.http.post<any>(`${this.serverApiUrl.API_URL}/appeals/${aplId}/review/appeal-nurse`, payLoad, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  saveTargetPopulation(aplId, payLoad) {
    return this.http.post<any>(`${this.serverApiUrl.API_URL}/appeals/${aplId}/review/target-population`, payLoad, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  saveDisenrollment(aplId, payLoad) {
    return this.http.post<any>(`${this.serverApiUrl.API_URL}/appeals/${aplId}/review/disenrollment`, payLoad, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  saveAppealDecision(aplId, payLoad) {
    return this.http.post<any>(`${this.serverApiUrl.API_URL}/appeals/${aplId}/review/appeal-review-decision`, payLoad, {
      headers: { 'Content-Type': 'application/json' }
    });
  }


  getAppealNurseRev(input): Observable<any> {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/appeals/${input}/review/appeal-nurse`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  getOnsiteAssessmentOnLoad(input, userId): Observable<any> {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/appeals/${input}/onsite-assesment?userId=${userId}`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  getAcuityScore(aplId, payLoad) {
    return this.http.post<any>(`${this.serverApiUrl.API_URL}/appeal/findAplFunctionalAssessmentAcuityScore?aplId=${aplId}`, payLoad, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  onsiteassesments() {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/appeals/dashboard/onsiteassesments`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  appealsDashboard() {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/appeals/dashboard`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  saveReviewOnsiteAssessmentRequest(aplId, payLoad) {
    return this.http.post<any>(`${this.serverApiUrl.API_URL}/appeals/${aplId}/review/onsite-assessment`, payLoad, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  searchAppeals(searchText) {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/appeals?${searchText}`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  hearingDetails(payLoad) {
    return this.http.post<any>(`${this.serverApiUrl.API_URL}/appeal/hearing/hearingDetails`, payLoad, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  getAppealDetails(aplId) {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/appeal-details?aplId=${aplId}`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  openAppeals() {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/appeals/dashboard/openappeals`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  nohPastDue() {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/appeals/dashboard/nohpastdue`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  onsitePastDue() {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/appeals/dashboard/onsitepastdue`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  anrReviewPastDue() {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/appeals/dashboard/anrreviewpastdue`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  countDifferentDepartments() {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/appeals/dashboard/countdifferentdepartments`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  countDifferentStatus() {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/appeals/dashboard/countdifferentstatus`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  overDueAppeals() {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/appeals/dashboard/overdueappeals`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  unassignedQueue() {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/appeals/dashboard/unassignedqueue`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  getAppealActionRequestSummary(aplId) {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/appeal/selectAction/requestSummary?aplId=${aplId}`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  saveAppealActnRequestedDoc(payLoad) {
    return this.http.post<any>(`${this.serverApiUrl.API_URL}/appeal/selectAction/requestedDocuments`, payLoad, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  getAppealActionDocumnetRequested(aplId) {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/appeal/selectAction/requestDocument?aplId=${aplId}`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  updateDocket(payload) {
    return this.http.post<any>(`${this.serverApiUrl.API_URL}/appeal/selectAction/updateDocket`, payload, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  rescheduleHearing(payload) {
    return this.http.post<any>(`${this.serverApiUrl.API_URL}/appeal/selectAction/rescheduleHearing`, payload, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  reopenAppeal(payload) {
    return this.http.post<any>(`${this.serverApiUrl.API_URL}/appeal/selectAction/reopenAppeal`, payload, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  withdrawAppeal(payload) {
    return this.http.post<any>(`${this.serverApiUrl.API_URL}/appeal/selectAction/withdrawAppeal`, payload, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  pasrrCorrectionLetter(payload) {
    return this.http.post<any>(`${this.serverApiUrl.API_URL}/appeal/selectAction/PASRRCorrectionLetter`, payload, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  specialServices(payload) {
    return this.http.post<any>(`${this.serverApiUrl.API_URL}/appeal/selectAction/specialServices`, payload, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  hearingSummary(payload) {
    return this.http.post<any>(`${this.serverApiUrl.API_URL}/appeal/selectAction/hearingSummary`, payload, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  uploadOrder(payload) {
    return this.http.post<any>(`${this.serverApiUrl.API_URL}/appeal/selectAction/uploadOrder`, payload, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  saveAppealResolutionDetails(payload) {
    return this.http.post<any>(`${this.serverApiUrl.API_URL}/appeal/appealResolution/saveAppealResolutionDetails`, payload, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  getAppealHearingOrderDetails(aplId) {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/appeal/appealResolution/getAppealHearingOrderDetails?aplId=${aplId}`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  getDocByAplId(aplId) {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/appeal/hearing/caseReferralPacket/getDocByAplId?aplId=${aplId}`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  getDocByDocId(docId) {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/doc/getDocByDocId?docId=` + docId, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  uploadDocByAplId(payload) {
    return this.http.post<any>(`${this.serverApiUrl.API_URL}/appeal/hearing/caseReferralPacket/uploadDocByAplId`, payload, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  getAllDocZipByAplId(payload) {
    return this.http.post<any>(`${this.serverApiUrl.API_URL}/appeal/hearing/caseReferralPacket/getAllDocZipByAplId`, payload, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Appeal Resolution Form
  getAppealResolutionDetails(aplId) {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/appeal/appealResolution/getAppealResolutionDetails?aplId=` + aplId, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  saveOnSiteAssessmentEvaluation(aplId, payload) {
    return this.http.post<any>(`${this.serverApiUrl.API_URL}/appeals/${aplId}/onsite-assesment/evaluation`, payload, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Notice of hearing three

  nohdetails(aplId) {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/appeal/hearingNotice/nohdetails?aplId=` + aplId, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  correctionneeded(payload) {
    return this.http.post<any>(`${this.serverApiUrl.API_URL}/appeal/hearingNotice/correctionneeded`, payload, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  mailednoh(payload) {
    return this.http.post<any>(`${this.serverApiUrl.API_URL}/appeal/hearingNotice/mailednoh`, payload, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  initialorder(payload) {
    return this.http.post<any>(`${this.serverApiUrl.API_URL}/appeal/hearing/initialorder`, payload, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  getHearingSummaryDescription(aplId) {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/appeal/hearing/hearingSummary?aplId=` + aplId, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  reconsiderations(payload) {
    return this.http.post<any>(`${this.serverApiUrl.API_URL}/appeal/hearing/reconsiderations/initialorder`, payload, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  getAppealResolutionPDF(aplId) {
    return this.http.post<any>(`${this.serverApiUrl.API_URL}/appeal/appealResolution/${aplId}/pdf`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  saveOnsiteAssessment(aplId, payLoad, userId) {
    return this.http.post<any>(`${this.serverApiUrl.API_URL}/appeals/${aplId}/onsite-assesment?userId=${userId}`, payLoad, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  docketDetails(aplId) {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/appeal/selectAction/docketDetails?aplId=` + aplId, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  downloadOnsiteAssessmentPdf(aplId) {
    return this.http.post<any>(`${this.serverApiUrl.API_URL}/appeals/${aplId}/onsite-assesment/pdf`, {}, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  getHearingDetails(aplId) {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/appeal/hearing/details?aplId=` + aplId, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  schedulesummary(aplId) {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/appeal/hearing/schedulesummary?aplId=` + aplId, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  appealQueueCount(userId, entityId) {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/appeals/appealQueueCount?userId=` + userId +
      '&dashboardCd=APL' + '&entityId=' + entityId + '&taskStatusCd=NW', {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  getHearingSummary(aplId) {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/appeal/hearing?aplId=` + aplId, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  pasrrdetails(aplId) {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/appeal/selectAction/pasrrdetails?aplId=` + aplId, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  aplOnsiteCorrection(aplId, payLoad) {
    return this.http.post<any>(`${this.serverApiUrl.API_URL}/appeals/${aplId}/onsite-review/correction`, payLoad, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  async hearingcalendar(): Promise<HttpResponse<any>> {
    return await this.http.get<any>(this.serverApiUrl.API_URL + `/appeals/dashboard/hearingcalendar`,
      { observe: 'response' }).toPromise();
  }

  getDisenrollHistoryData(aplId){
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/appeals/${aplId}/review/disenrollhistory`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  getNurseReviewHistoryData(aplId){
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/appeals/${aplId}/review/aplNursHistory`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  nohSubmit(payload) {
    return this.http.post<any>(`${this.serverApiUrl.API_URL}/appeal/hearingNotice/nohsubmit`, payload, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  getOnsiteAssessmentHistory(aplId){
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/appeals/${aplId}/onsite-assesment/onsiteAssessmentHistory`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }


  onsiteAssessmentRequestHold(aplId, payLoad) {
    return this.http.post<any>(`${this.serverApiUrl.API_URL}/appeals/${aplId}/onsite-assesment/requestHold`, payLoad, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  onsiteAssessmentCancelHold(aplId, payLoad, id) {
    return this.http.post<any>(`${this.serverApiUrl.API_URL}/appeals/${aplId}/onsite-assesment/cancelHold?aplOnsiteAssmntReqId=${id}`, payLoad, {
      headers: { 'Content-Type': 'application/json' }
    });
  }


  onsiteAssessmentSubmitHold(aplId, payLoad) {
    return this.http.post<any>(`${this.serverApiUrl.API_URL}/appeals/${aplId}/onsite-assesment/submitHold`, payLoad, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
