import { LoaderService } from './../../../loader/loader.service';
import { PaeCommonService } from './pae-common/pae-common.service';
import { Injectable } from '@angular/core';
import { SearchPerson } from '../../../_shared/model/SearchPerson';
import { PaeApplicant } from '../../../_shared/model/PaeApplicant';

import { PaeAction } from '../../../_shared/model/PaeAction';
import { PaeAppointment } from '../../../_shared/model/PaeAppointment';
import { PaeMedPrognosis } from '../../../_shared/model/PaeMedPrognosis';
import { PaeNutritionFeeding } from '../../../_shared/model/PaeNutritionFeeding';
import { HttpClient, HttpResponse, HttpParams } from '@angular/common/http/';
import { Observable, of } from 'rxjs';
import { EnvService } from '../../../_shared/utility/env.service';
import { PaeTransportationSpeciality } from 'src/app/_shared/model/PaeTransportationSpeciality';
import { PaeAdditionalBehavioural } from 'src/app/_shared/model/PaeAdditionalBehavioral';
import { PaeNonFebrileSeizuresForm } from '../../../_shared/model/PaeNonFebrileSeizuresForm';
import { PaeSexuallyAggressiveBehavior } from '../../../_shared/model/PaeSexuallyAggressiveBehavior';
import { PaeDiagnosisSummaryDocument } from 'src/app/_shared/model/PaeDiagnosis/PaeDiagnosisSummaryDocument';
import { PaeReviewSubmit } from 'src/app/_shared/model/PaeReviewSubmit';
import { Applicant } from '../../../_shared/model/Applicant';
import { SafetyAttestationForm } from 'src/app/_shared/model/SafetyAttestationForm';
import { PaeIntelDisabilityDetailsForm } from '../../../_shared/model/PaeIntelDisabilityDetailsForm';
import { PaeLivingArrangement } from 'src/app/_shared/model/PaeLivingArrangement';
import { PaeContactInformation } from 'src/app/_shared/model/PaeContactInformation';
import { PaeSafetyDeterminationSummary } from 'src/app/_shared/model/PaeSafetyDeterminationSummary';
import { PaeSafetyDeterminationSummaryForm } from 'src/app/_shared/model/PaeSafetyDeterminationForm';
import { PaeFallHistory } from 'src/app/_shared/model/PaeFallHistory';
import { PaeFlowSeq } from 'src/app/_shared/utility/PaeFlowSeq';
import { Router } from '@angular/router';
import { PaeAcuteOrChronicConditionsVO } from '../../../_shared/model/PaeAcuteOrChronicConditionsVO';
import { PaeCareGiverDeatils } from 'src/app/_shared/model/PaeCareGiverDetails';
import { PaeCertData } from 'src/app/_shared/model/PaeCertData';
import { PaeAssesmentCapabilitiesNeed } from '../../../_shared/model/PaeAssesmentCapabilitiesNeed';
import { ActivityDailyPartTwo } from '../../../_shared/model/ActivityDailyLivingPart-2';
import { PaePhysicallyAggressiveBehaviorRequest } from 'src/app/_shared/model/PaePhysicallyAggressiveBehavior';
@Injectable({
  providedIn: 'root'
})
export class PaeService {
  age: number;
  paeId: any;
  personId: any;
  pageId: string;
  response: any;
  serverApiUrl: any;
  paeApplicantDetail: PaeApplicant;
  functionalAssessmentRoutes: Array<string> = null;
  FunctionalAssessmentPaths: any;
  constructor(private http: HttpClient,
              private envService: EnvService,
              private router: Router,
              public loaderService: LoaderService,
              private paeCommonService: PaeCommonService) {
    this.serverApiUrl = this.envService.apiUrl();
  }

  getPersonId() {
    return this.personId;
  }

  getPaeId() {
    return this.paeId;
  }

  getPageId() {
    return this.pageId;
  }

  getPaeApplicantDetail() {
    return this.paeApplicantDetail;
  }

  // async savePae(paeCoreDtl: PaeCoreDtl): Promise<HttpResponse<any>> {
  //  const response =  await this.http.post<any>(this.serverApiUrl.API_URL + '/pae/addPae',
  //                   paeCoreDtl, { observe: 'response' }).toPromise();
  //  this.paeId = response.body.paeId;
  //  this.personId = response.body.applcantVO.prsnId;
  //  return response;
  // }

  async savePaeAction(request: PaeAction) {
    const response = await this.http.post<any>(this.serverApiUrl.API_URL + '/pae/savePaeAction',
      request, { observe: 'response' }).toPromise();
    return response;
  }

  async getPaeDefaultPages() {
    return this.http.get<any>(this.serverApiUrl.API_URL + '/api/staticData/getStaticDataValue?dataNameKey=PAE_DEFAULT_PAGES', {
      headers: { 'Content-Type': 'application/json' }
    }).toPromise();
  }

  async getPaeMenuPageStatus(paeId) {
    let paramss = new HttpParams();
    paramss = paramss.append('paeId', paeId);
    return this.http.get<any>(this.serverApiUrl.API_URL + '/pae/getPaeMenuPageStatus', { params: paramss }).toPromise();
  }

  async getNonFebrileSeizuresInfo(paeId: string) {
    let paramss = new HttpParams();
    paramss = paramss.append('paeId', paeId);
    return await this.http.get<any>(this.serverApiUrl.API_URL + '/pae/getNonFebrileSeizuresInfo',
      { params: paramss }).toPromise();
  }

  async getPaeIntelDisabilityDetailsInfo(paeId, requestPageId) {
    let paramss = new HttpParams();
    paramss = paramss.append('paeId', paeId);
    paramss = paramss.append('requestPageId', requestPageId);
    return await this.http.get<any>(this.serverApiUrl.API_URL + '/pae/getPaeIntelDisabilityDetails',
      { params: paramss }).toPromise();
  }

  async getWelcomeByPaeId(id, idType,taskId) {

    let paramss = new HttpParams();
    if (idType === 'paeId') {
      paramss = paramss.append('paeId', id);
    }
    else {
      paramss = paramss.append('refId', id);
    }
    if(taskId!=null || taskId!=''|| taskId!=undefined){
      paramss = paramss.append('taskId', taskId);
    }
    return await this.http.get<any>(this.serverApiUrl.API_URL + '/pae/welcomeByPaeId',
      { params: paramss }).toPromise();
  }

  getFunctionalAssessmentPath(partId: string): string {
    return this.FunctionalAssessmentPaths[partId];
  }
  setFunctionalAssessmentPath(type: string) {
    this.FunctionalAssessmentPaths = {};
    this.functionalAssessmentRoutes = [];
    let routes = { KB: 'capabilitiesKbPartOne', Activities: 'activitiesPartOne', Capabilities: 'capabilitiesPartOne' };
    this.FunctionalAssessmentPaths.partOne = '/ltss/pae/paeStart/' + routes[type];
    this.functionalAssessmentRoutes.push(routes[type]);
    routes = { KB: 'capabilitiesKbPartTwo', Activities: 'activitiesPartTwo', Capabilities: 'capabilitiesPartTwo' };
    this.FunctionalAssessmentPaths.partTwo = '/ltss/pae/paeStart/' + routes[type];
    this.functionalAssessmentRoutes.push(routes[type]);
  }
  getFunctionalRoutes(): any {
    let result = null;
    if (this.functionalAssessmentRoutes != null) {
      result = this.functionalAssessmentRoutes.join(',').split(',');
      this.functionalAssessmentRoutes = null;
    }
    return result;
  }

  async saveIddDetails(paeIntelDisabilityDetailsForm: PaeIntelDisabilityDetailsForm): Promise<HttpResponse<any>> {
    const response = await this.http.post<any>(this.serverApiUrl.API_URL + '/pae/savePaeIntelDisabilityDetails',
      paeIntelDisabilityDetailsForm, { observe: 'response' }).toPromise();
    return response;
  }

  async saveNonFebrileSeizures(paeNonFebrileSeizuresForm: PaeNonFebrileSeizuresForm): Promise<HttpResponse<any>> {
    const response = await this.http.post<any>(this.serverApiUrl.API_URL + '/pae/addNonFebrileSeizuresInfo',
      paeNonFebrileSeizuresForm, { observe: 'response' }).toPromise();
    return response;
  }

  async saveAggressiveBehavior(request: PaePhysicallyAggressiveBehaviorRequest): Promise<HttpResponse<any>> {
    const response = await this.http.post<any>(this.serverApiUrl.API_URL + '/pae/physicalAggressive',
      request, { observe: 'response' }).toPromise();
    return response;
  }
  getAggresiveBehaviorDetails(paeId){
    return this.http.get<any>(this.serverApiUrl.API_URL + '/pae/physicalAggressiveDetails?paeId='+paeId);
  }
  async getWelcomeByTaskId(taskId: string) {

    let paramss = new HttpParams();
    paramss = paramss.append('taskId', taskId);
    return await this.http.get<any>(this.serverApiUrl.API_URL + '/pae/welcomeByTaskId',
      { params: paramss }).toPromise();

  }

  async savePaeApplicant(paeApplicant: PaeApplicant): Promise<HttpResponse<any>> {
    const response = await this.http.post<any>(this.serverApiUrl.API_URL + '/pae/addApplicantInfo',
    paeApplicant, { observe: 'response', params: {progress: 'no' } }).toPromise();
    this.paeId = response.body.paeId;
    console.log(response.body);
    this.personId = response.body.applicantVO.prsnId;
    this.paeCommonService.setPaeId(this.paeId);
    this.paeCommonService.setPersonId(this.personId);
    return response;
  }

  async saveLivingArrangement(paeLivingArrangement: PaeLivingArrangement): Promise<HttpResponse<any>> {
    const response = await this.http.post<any>(this.serverApiUrl.API_URL + '/pae/addPaeLivingArrangement',
      paeLivingArrangement, { observe: 'response', params: {progress: 'no' } }).toPromise();
    this.paeId = response.body.refId;
    return response;
  }

  async saveSafetyDetermination(paeSafetyDetermination: PaeSafetyDeterminationSummary): Promise<HttpResponse<any>> {
    const response = await this.http.post<any>(this.serverApiUrl.API_URL + '/pae/saveSafetyDeterminationSummary',
      paeSafetyDetermination, { observe: 'response' }).toPromise();
    this.paeId = response.body.paeId;
    return response;
  }

  async saveContactInformation(paeContactInformation: PaeContactInformation): Promise<HttpResponse<any>> {
    const response = await this.http.post<any>(this.serverApiUrl.API_URL + '/pae/savePaeApplicantContactInfo',
      paeContactInformation, { observe: 'response', params: {progress: 'no' } }).toPromise();
    return response;
  }

  async savePae(paeAppointment: PaeAppointment): Promise<HttpResponse<any>> {
    const response = await this.http.post<any>(this.serverApiUrl.API_URL + '/pae/addPaeAppoinement',
      paeAppointment, { observe: 'response' }).toPromise();
    return response;
  }

  async getSearchPerson(searchPersonObject: SearchPerson): Promise<HttpResponse<any>> {
    const response = await this.http.get<any>(this.serverApiUrl.API_URL + '/pae/searchPerson', { observe: 'response', params: { firstName: searchPersonObject.firstName, lastName: searchPersonObject.lastName, ssn: searchPersonObject.ssn, dobDt: searchPersonObject.dobDt, midInitial: searchPersonObject.midInitial, suffix: searchPersonObject.suffix, genderCd: searchPersonObject.genderCd } }).toPromise();
    return response;
  }

  postSearchPerson(applicant: Applicant): Observable<any[]> {
    return this.http.post<any[]>(this.serverApiUrl.API_URL + '/invokemdm/searchForPerson', applicant);
  }

  async getApplicantAddress(personId: number) {
    const response = await this.http.get<any>(this.serverApiUrl.API_URL + '/pae/getApplicantAddress', { observe: 'response', params: { personId: personId.toString() } }).toPromise();
    return response;
  }

  async getPaeAppoinement(paeId: string) {
    const response = await this.http.get<any>(this.serverApiUrl.API_URL + '/pae/getPaeAppoinement', { observe: 'response', params: { paeId } }).toPromise();
    return response;
  }

  async savePaeNutritionFeeding(paeNutritionFeeding: PaeNutritionFeeding): Promise<HttpResponse<any>> {
    const response = await this.http.post<any>(this.serverApiUrl.API_URL + 'pae/prior/NutritionFeeding',
      paeNutritionFeeding, { observe: 'response' }).toPromise();
    return response;
  }

  async savePaeAssesmentCapabilitiesNeed(paeAssesmentCapabilitiesNeed: PaeAssesmentCapabilitiesNeed) {
    const response = await this.http.post<any>(this.serverApiUrl.API_URL + '/pae/savePaeAssesmentCapabilitiesNeed',
    paeAssesmentCapabilitiesNeed, { observe: 'response' }).toPromise();
    return response;
  }

  async savePaeActivities(request) {
    const response = await this.http.post<any>(this.serverApiUrl.API_URL + '/pae/savePaeActivitiesLiving',
      request, { observe: 'response' }).toPromise();
    return response;
  }

  async savePaeActivitiesPart2(activityDailyPartTwo: ActivityDailyPartTwo): Promise<HttpResponse<any>> {
    const response = await this.http.post<any>(this.serverApiUrl.API_URL + '/pae/savePaeActivitiesLiving',
    activityDailyPartTwo, { observe: 'response' }).toPromise();
    return response;
  }


  deletePaeActivityDailyPartTwo(id, isDeletedSw, medicationTypeCd, paeId, selfAdmDesc, selfAdmSw): Observable<any> {
    let body: any; body = { 'id': id,'isDeletedSw': isDeletedSw, 'medicationTypeCd': medicationTypeCd, 'paeId': paeId, 'selfAdmDesc': selfAdmDesc, 'selfAdmSw': selfAdmSw };
    return this.http.post<Observable<any>>(this.serverApiUrl.API_URL + `/pae/removePaeMedicationDtl`, body);
  }

  async getPaeActivities(paeId: string) {
    const response = await this.http.get<any>(this.serverApiUrl.API_URL + '/pae/getPaeActivitiesLivingByPaeId',
      { observe: 'response', params: { paeId } }).toPromise();
    return response;
  }

  // async savePaeKbCapabilities(request) {
  //   const response = await this.http.post<any>(this.serverApiUrl.API_URL + '/pae/savePaeActivitiesLiving',
  //     request, { observe: 'response' }).toPromise();
  //   return response;
  // }
  // async savePaeCapabilities(request) {
  //   const response = await this.http.post<any>(this.serverApiUrl.API_URL + '/pae/savePaeActivitiesLiving',
  //     request, { observe: 'response' }).toPromise();
  //   return response;
  // }
  async getPaeMedicalPrognosis(paeId: string) {
    const response = await this.http.get<any>(this.serverApiUrl.API_URL + '/pae/findPaePriorMedicalPrognsis', { observe: 'response', params: { paeId } }).toPromise();
    return response;
  }

  async savePaeMedicalPrognosis(paePriorMedicalPrognsis: PaeMedPrognosis): Promise<HttpResponse<any>> {
    const response = await this.http.post<any>(this.serverApiUrl.API_URL + '/pae/savePaePriorMedicalPrognsis',
      paePriorMedicalPrognsis, { observe: 'response' }).toPromise();
    return response;
  }

  async getPaeTransportationSpeciality(paeId: string) {
    const response = await this.http.get<any>(this.serverApiUrl.API_URL + '/pae/getTransportSpecialityCareInfo',
      { observe: 'response', params: { paeId } }).toPromise();
    return response;
  }

  async savePaeTransportationSpeciality(paeTransportationSpeciality: PaeTransportationSpeciality): Promise<HttpResponse<any>> {
    const response = await this.http.post<any>(this.serverApiUrl.API_URL + '/pae/addTransportSpecialityCareInfo',
      paeTransportationSpeciality, { observe: 'response' }).toPromise();
    return response;
  }
  async getPaeAdditionalQualifier(paeId: string) {
    const response = await this.http.get<any>(this.serverApiUrl.API_URL + '/pae/getPaeBehaviourQualifier',
      { observe: 'response', params: { paeId } }).toPromise();
    return response;
  }

  async savePaeAdditionalQualifier(paeAdditionalBehavioural: PaeAdditionalBehavioural): Promise<HttpResponse<any>> {
    const response = await this.http.post<any>(this.serverApiUrl.API_URL + '/pae/savePaeBehaviourQualifier',
      paeAdditionalBehavioural, { observe: 'response' }).toPromise();
    return response;
  }

  getFieldsByTableName(dataNameKey: any): Observable<any[]> {
    let paramss = new HttpParams();
    paramss = paramss.append('dataNameKey', String(dataNameKey));
    return this.http.get<any[]>(this.serverApiUrl.API_URL + '/api/staticData/getStaticDataValue', { params: paramss });
  }
  async saveServiceSystems(paeServiceSystemReq): Promise<HttpResponse<any>> {
    const response = await this.http.post<any>(this.serverApiUrl.API_URL + '/pae/savePaeBehSupServiceSystems',
      paeServiceSystemReq, { observe: 'response' }).toPromise();
    return response;
  }
  getSummaryData(pageId, paeId): Observable<any> {

    let paramss = new HttpParams();
    paramss = paramss.append('pageId', pageId);
    paramss = paramss.append('paeId', paeId);

    return this.http.get<Observable<any>>(this.serverApiUrl.API_URL + '/paeSummary/getSummaryData', { params: paramss });
  }

  getPaeAssesmentCapabilitiesNeed( paeId): Observable<any> {
    let paramss = new HttpParams();
    paramss = paramss.append('paeId', paeId);
    return this.http.get<Observable<any>>(this.serverApiUrl.API_URL + '/pae/getPaeAssesmentCapabilitiesNeed', { params: paramss });
  }

  getSubmitSummaryData( paeId ): Observable<any> {
    let paramss = new HttpParams();
    paramss = paramss.append('paeId', paeId);
    return this.http.get<Observable<any>>(this.serverApiUrl.API_URL + '/pae/getPaeMenuPageStatus', { params: paramss });
  }


  async savePaeUploadDocument(paeDiagnosisSummaryDocument: PaeDiagnosisSummaryDocument): Promise<HttpResponse<any>> {
    const response = await this.http.post<any>(this.serverApiUrl.API_URL + '/doc/uploadMultipleDocument ',
      paeDiagnosisSummaryDocument, { observe: 'response' }).toPromise();
    return response;
  }

  /*  async deletedSelectedDocument(documentId: string) {
     const response = await this.http.delete<any>(this.serverApiUrl.API_URL + '/doc/deleteDocument?DocumentId=' + documentId,
     { observe: 'response' }).toPromise();
     return response;
   }*/

  async savePaeReviewAndSubmit(paeReviewSubmit: PaeReviewSubmit): Promise<HttpResponse<any>> {
    console.log('paeReviewSubmit====', paeReviewSubmit);
    const response = await this.http.post<any>(this.serverApiUrl.API_URL + '/pae/savePaeReviewAndSubmit',
      paeReviewSubmit, { observe: 'response' }).toPromise();
    return response;
  }

  async getCertificationOfAssessment(paeId: string) {
    let paramss = new HttpParams();
    paramss = paramss.append('paeId', paeId);
    return await this.http.get<any>(this.serverApiUrl.API_URL + '/pae/getCertificationOfAssessment',
      { params: paramss }).toPromise();
  }
  addCertificationData(paeCert: PaeCertData): Observable<any> {
    return this.http.post<Observable<any>>(this.serverApiUrl.API_URL + '/pae/addCertificationOfAssessment', paeCert);
  }


  async getSafetyDeterminationForm(paeId: string) {
    const paramss = new HttpParams();
    return await this.http.get<any>(this.serverApiUrl.API_URL + '/pae/safetyDetermination/form?paeId=' + paeId,
      { params: paramss }).toPromise();
  }

  async saveSafetyDeterminationForm(paeSafetyDeterminationForm: PaeSafetyDeterminationSummaryForm): Promise<HttpResponse<any>> {
    const response = await this.http.post<any>(this.serverApiUrl.API_URL + '/pae/safetyDetermination/form',
      paeSafetyDeterminationForm, { observe: 'response' }).toPromise();
    this.paeId = response.body.paeId;
    return response;
  }
  async getSafetyAttestionPopUpForm(paeId: string) {
    const paramss = new HttpParams();
    return await this.http.get<any>(this.serverApiUrl.API_URL + '/pae/safetyDetermination/form?paeId=' + paeId,
      { params: paramss }).toPromise();
  }

  async saveSafetyAttestionPopUpForm(safetyAttestationForm: SafetyAttestationForm): Promise<HttpResponse<any>> {
    const response = await this.http.post<any>(this.serverApiUrl.API_URL + '/pae/safetyDetermination/form',
    safetyAttestationForm, { observe: 'response' }).toPromise();
    this.paeId = response.body.paeId;
    return response;
  }


  getSummaryNextPage(paeId, pageId): Observable<any> {
    let paramss = new HttpParams();
    paramss = paramss.append('paeId', paeId);
    paramss = paramss.append('reqPageId', pageId);
    // paramss = paramss.append('progress', progress);
    return this.http.get<Observable<any>>(this.serverApiUrl.API_URL + '/pae/findPaeNextSummaryPage', { params: paramss });
  }
  getChidPageNavigation(paeId, pageId): Observable<any> {
    let paramss = new HttpParams();
    paramss = paramss.append('paeId', paeId);
    paramss = paramss.append('reqPageId', pageId);
    return this.http.get<Observable<any>>(this.serverApiUrl.API_URL + '/pae/findPaeRoutePages', { params: paramss });
  }

  async getFallHist(paeId: string) {
    const response = await this.http.get<any>(this.serverApiUrl.API_URL + '/pae/getsafetyDetrminationFallHist',
      { observe: 'response', params: { paeId } }).toPromise();
    return response;
  }

  async setFallHist(paeFallHistory: PaeFallHistory): Promise<HttpResponse<any>> {
    const response = await this.http.post<any>(this.serverApiUrl.API_URL + '/pae/addsafetyDetrminationFallHist',
      paeFallHistory, { observe: 'response' }).toPromise();
    this.paeId = response.body.paeId;
    return response;
  }

  async getPaeDocumentSummary(paeId): Promise<HttpResponse<any>> {
    const response = await this.http.get<any>(this.serverApiUrl.API_URL + '/pae/getPaeDocumentSummary',
      { observe: 'response', params: { paeId } }).toPromise();
    return response;
  }

  async getPaeSafetySummary(pageId: string, paeId: string): Promise<HttpResponse<any>> {
    let paramss = new HttpParams();
    paramss = paramss.append('pageId', pageId);
    paramss = paramss.append('paeId', paeId);
    console.log('/paeSummary/getSummaryData: ' + JSON.stringify(paramss, null, ' '));
    return this.http.get<any>(this.serverApiUrl.API_URL + '/paeSummary/getSummaryData', { params: paramss, observe: 'response' }).toPromise();
  }

  async findPaeSafetySummary(paeId: string): Promise<HttpResponse<any>> {
    let paramss = new HttpParams();
    paramss = paramss.append('paeId', paeId);
    console.log('/pae/findSafetyDeterminationSummary: ' + JSON.stringify(paramss, null, ' '));
    return this.http.get<any>(this.serverApiUrl.API_URL + '/pae/findSafetyDeterminationSummary', { params: paramss, observe: 'response' }).toPromise();
  }

  async savePaeCostNeutralityDetail(data: any): Promise<HttpResponse<any>> {
    const response = await this.http.post<any>(this.serverApiUrl.API_URL + '/pae/savePaeCostNeuDetail',
      data, { observe: 'response' }).toPromise();
    return response;
  }

  async deletePaeCostNeutralityDetail(data: any): Promise<HttpResponse<any>> {
    const response = await this.http.post<any>(this.serverApiUrl.API_URL + '/pae/deletePaeCostNeuDetail',
      data, { observe: 'response' }).toPromise();
    return response;
  }

  getPaeCostNeuCalcAnnualAmt(paeId): Observable<any> {
    let paramss = new HttpParams();
    paramss = paramss.append('paeId', paeId);
    return this.http.get<Observable<any>>(this.serverApiUrl.API_URL + `/pae/findPaeCostNeuSummary`, { params: paramss });
  }

  async findPaeFunctionalAssessmentAcuityScore(paeId: string): Promise<HttpResponse<any>> {
    let paramss = new HttpParams();
    paramss = paramss.append('paeId', paeId);
    console.log('/pae/findPaeFunctionalAssessmentAcuityScore: ' + JSON.stringify(paramss, null, ' '));
    return this.http.get<any>(this.serverApiUrl.API_URL + '/pae/findPaeFunctionalAssessmentAcuityScore', { params: paramss, observe: 'response' }).toPromise();
  }
  async getPaeCostNeutralityDetails(paeId: string): Promise<HttpResponse<any>> {
    let paramss = new HttpParams();
    paramss = paramss.append('paeId', paeId);
    const response = await this.http.get<any>(this.serverApiUrl.API_URL + '/pae/findPaeCostNeuDetails',
      { params: paramss, observe: 'response' }).toPromise();
    return response;
  }

  async getPaeApplicantContactInfo(paeId: string): Promise<HttpResponse<any>> {
    let paramss = new HttpParams();
    paramss = paramss.append('paeId', paeId);
    console.log('/pae/findPaeApplicantContactInfo: ' + JSON.stringify(paramss, null, ' '));
    return this.http.get<any>(this.serverApiUrl.API_URL + '/pae/findPaeApplicantContactInfo', { params: paramss, observe: 'response' }).toPromise();
  }

  async getPaeLivArrngmnt(paeId: string): Promise<HttpResponse<any>> {
    let paramss = new HttpParams();
    paramss = paramss.append('paeId', paeId);
    console.log('/pae/getPaeLivingArrangement: ' + JSON.stringify(paramss, null, ' '));
    return this.http.get<any>(this.serverApiUrl.API_URL + '/pae/getPaeLivingArrangement', { params: paramss, observe: 'response' }).toPromise();
  }

  navigateToChildPreviousPage(pageId) {
    this.paeId = this.paeCommonService.paeId;
    this.getChidPageNavigation(this.paeId, pageId).subscribe((response) => {
      const backPath = PaeFlowSeq[response.prevPageId];
      this.router.navigate(['/ltss/pae/paeStart/' + backPath]);
    }, err => {
      console.log(err);
    });
  }

  // async getChildPreviousPage(pageId) :Promise<string> {
  //   let path = ''
  //   this.paeId =this.paeCommonService.paeId;
  // await this.getChidPageNavigation(this.paeId, pageId).subscribe((response) =>
  //   {
  //     const backPath = PaeFlowSeq[response.prevPageId];
  //     path =  '/ltss/pae/paeStart/' + backPath
  //   }, err => {
  //     console.log(err);
  //   });
  //   return Promise.resolve(path)
  // }

  navigateToChildNextPage(pageId) {
    this.paeId = this.paeCommonService.paeId;
    this.getChidPageNavigation(this.paeId, pageId).subscribe((response) => {
      const backPath = PaeFlowSeq[response.nextPageId];
      this.router.navigate(['/ltss/pae/paeStart/' + backPath]);
    }, err => {
      console.log(err);
    });
  }

  async getPaeApplicantInformation(paeId: string, requestPageId: string): Promise<HttpResponse<any>> {
    let paramss = new HttpParams();
    paramss = paramss.append('paeId', paeId);
    paramss = paramss.append('requestPageId', requestPageId);
    console.log('/pae/getApplicantDetails: ' + JSON.stringify(paramss, null, ' '));
    return this.http.get<any>(this.serverApiUrl.API_URL + '/pae/getApplicantDetails', { params: paramss, observe: 'response' }).toPromise();
  }

  async getQualifierInfo(entityId: string): Promise<HttpResponse<any>> {
    let paramss = new HttpParams();
    paramss = paramss.append('entityId', entityId);
    console.log('/api/getAssessors: ' + JSON.stringify(paramss, null, ' '));
    return this.http.get<any>(this.serverApiUrl.API_URL + '/api/getAssessors', { params: paramss, observe: 'response' }).toPromise();
  }

  async getAcuteCondInfo(paeId: string): Promise<HttpResponse<any>> {
    let paramss = new HttpParams();
    paramss = paramss.append('paeId', paeId);
    console.log('/pae/getPaeSafetyDeterAcuteCond: ' + JSON.stringify(paramss, null, ' '));
    return this.http.get<any>(this.serverApiUrl.API_URL + '/pae/getPaeSafetyDeterAcuteCond', { params: paramss, observe: 'response' }).toPromise();
  }

  async setAcuteConditions(paeAcuteOrChronicVO: PaeAcuteOrChronicConditionsVO): Promise<HttpResponse<any>> {
    const response = await this.http.post<any>(this.serverApiUrl.API_URL + '/pae/savePaeSafetyDeterAcuteCond',
      paeAcuteOrChronicVO, { observe: 'response' }).toPromise();
    return response;
  }

  async savePaeCareGiverDeatils(paeCareGiverDeatils: PaeCareGiverDeatils): Promise<HttpResponse<any>> {
    const response = await this.http.post<any>(this.serverApiUrl.API_URL + '/pae/savePaePriorCaregiverDetail',
    paeCareGiverDeatils, { observe: 'response' }).toPromise();
    this.paeId = response.body.paeId;
    return response;
  }

  getPaeCareGiverDeatils(paeId): Observable<any> {
    let paramss = new HttpParams();
    paramss = paramss.append('paeId', paeId);
    return this.http.get<Observable<any>>(this.serverApiUrl.API_URL + '/pae/findPaePriorCaregiverDetail', { params: paramss });
  }

  getAdjDescision(adjId): Observable<any>{
    let paramss = new HttpParams();
    paramss = paramss.append('adjId', adjId);
    return this.http.get<Observable<any>>(this.serverApiUrl.API_URL + `/adj/adjDetermination`, {params: paramss});
  }

  async createPdf(): Promise<HttpResponse<any>> {
    let paramss = new HttpParams();
    paramss = paramss.append('paeId', this.paeCommonService.getPaeId());
    paramss = paramss.append('personId', this.personId);
    console.log('/referral/generatePdf: ' + JSON.stringify(paramss, null, ' '));
    return this.http.get<any>(this.serverApiUrl.API_URL + `/referral/generatePdf`, {params: paramss, observe: 'response'}).toPromise();
  }

}
