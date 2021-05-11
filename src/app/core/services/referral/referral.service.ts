import { Injectable } from '@angular/core';
import { RefApplicantDetail } from '../../../_shared/model/RefApplicantDetail';
import { SearchPerson } from '../../../_shared/model/SearchPerson';
import { Applicant } from '../../../_shared/model/Applicant';
import { RefCoreDtl } from '../../../_shared/model/RefCoreDtl';
import { HttpClient, HttpResponse, HttpParams } from '@angular/common/http/';
import { RefSchAndWork } from '../../../_shared/model/RefSchAndWork';
import { RefSubmission } from '../../../_shared/model/RefSubmission';
import { RefAppContact } from '../../../_shared/model/RefAppContact';
import { RefCareAndSupport } from '../../../_shared/model/RefCareAndSupport';
import { Observable } from 'rxjs';
import { EnvService } from '../../../_shared/utility/env.service';

@Injectable({
  providedIn: 'root'
})
export class ReferralService {
  age: number;
  refId: string;
  referralId: string;
  personId: string;
  response: any;
  refApplicantDetail: RefApplicantDetail;
  serverApiUrl: any;
  taskStatus: any;
  taskQueue: any;
  assignedUser: any;
  taskId: number;
  assignedEntity: any;
  intakeOutcomeId: any;
  rowElement: any;
  userTypeCd: any;
  ChmType:any;
  currentLivingArrangement: string;

  constructor(private http: HttpClient,
              private envService: EnvService) {
                this.serverApiUrl = this.envService.apiUrl();
  }

  setRefApplicantDetail( refApplicantDetail: RefApplicantDetail){
    this.refApplicantDetail = refApplicantDetail;
  }

  getRefApplicantDetail(){
    return this.refApplicantDetail;
  }

  getUserProfilesByEntityId(entityId): Observable<any[]>{
    return this.http.get<any[]>(this.serverApiUrl.API_URL +`/supportFunctions/getUserProfileByEntityId?entityId=${entityId}`);
  }

  getPersonId(){
    if (this.personId == null) {
      console.log("Warning: null personId requested");
    }
    return this.personId;
  }

  setPersonId(personId){
    this.personId = personId;
  }

  getAssignedUser(){
    return this.assignedUser;
  }

  setAssignedEntity(assignedEntity){
    this.assignedEntity = assignedEntity;
  }

  getAssignedEntity(){
    return this.assignedEntity;
  }

  setAssignedUser(assignedUser){
    this.assignedUser = assignedUser;
  }

  getRefId(){
    if (this.refId == null) {
      console.log("Warning: null refId requested");
    }
    return this.refId;
  }

  setRefId(refId){
    this.refId = refId;
  }

  setTaskStatus(taskStatus){
    this.taskStatus = taskStatus;
  }
  getTaskStatus(){
    return this.taskStatus;
  }

  setTaskQueue(taskQueue){
    this.taskQueue = taskQueue;
  }
  getTaskQueue(){
    return this.taskQueue;
  }

  setTaskId(taskId){
    this.taskId = taskId;
  }
  getTaskId(){
    return this.taskId;
  }

  setAge(age: number) {
    this.age = age;
  }
  getAge(){
    return this.age;
  }

  getIntakeOutcomeId(){
    return this.intakeOutcomeId;
  }

  setIntakeOutcomeId(intakeOutcomeId){
    this.intakeOutcomeId = intakeOutcomeId;
  }

  setRowElement(rowElement){
    this.rowElement = rowElement;
  }

  getRowElement(){
    return this.rowElement;
  }

  setUserTypeCd(userType){
    this.userTypeCd = userType;
  }
  getChmType(){
    return this.ChmType;
  }

  setChmTypeCd(typeCd){
    this.ChmType = typeCd;
  }

  getUserTypeCd(){
    return this.userTypeCd;
  }

  setCurrentLivingArrangementCd(currentLivingArrangement){
    this.currentLivingArrangement = currentLivingArrangement;
  }

  getCurrentLivingArrangementCd(){
    return this.currentLivingArrangement;
  }

  async saveReferral(refCoreDtl: RefCoreDtl): Promise<HttpResponse<any>> {
   const response =  await this.http.post<any>(this.serverApiUrl.API_URL + `/referral/addReferral`,
                    refCoreDtl, { observe: 'response' }).toPromise();
   this.refId = response.body.refId;
   this.personId = response.body.applcantVO.prsnId;
   return response;
  }

  async saveReferralSchAndWork(refSchAndWork: RefSchAndWork): Promise<HttpResponse<any>> {
    return await this.http.post<any>(this.serverApiUrl.API_URL + `/referral/addSchoolAndWrokInfo`,
          refSchAndWork, { observe: 'response' }).toPromise();
  }

  async savePlannedTransition(data: any): Promise<HttpResponse<any>> {
    return await this.http.post<any>(this.serverApiUrl.API_URL + `/intakeOutcome/refPlannedTransistionFormData `,
          data, { observe: 'response' }).toPromise();
  }

  async getApplicantDetails(refId: string, requestPageId: string): Promise<HttpResponse<any>> {
    let paramss = new HttpParams();
    paramss = paramss.append('refId', refId);
    paramss = paramss.append('requestPageId', requestPageId);
    console.log('/referral/getApplicantDetails: ' + JSON.stringify(paramss, null, ' '));
    return this.http.get<any>(this.serverApiUrl.API_URL + `/referral/getApplicantDetails`, {params: paramss, observe: 'response'}).toPromise();
  }

  async saveReferralSubmission(refSubmission: RefSubmission): Promise<HttpResponse<any>> {
    return await this.http.post<any>(this.serverApiUrl.API_URL + `/referral/submitReferral`,
          refSubmission, { observe: 'response' }).toPromise();
  }

  async saveRefContact(refAppContact: RefAppContact): Promise<HttpResponse<any>> {
    return await this.http.post<any>(this.serverApiUrl.API_URL + `/referral/addReferralContact`,
          refAppContact, { observe: 'response' }).toPromise();
  }

  async saveRefCareAndSupport(refCareAndSupport: RefCareAndSupport): Promise<HttpResponse<any>> {
    return await this.http.post<any>(this.serverApiUrl.API_URL + `/referral/addRefCareAndSupport`,
          refCareAndSupport, { observe: 'response' }).toPromise();
  }

  updateUserId(request){
    return this.http.post<any>(this.serverApiUrl.ADMIN_API_URL + '/reassignTask', request)
  }

  getReferral(): Observable<any[]> {
    let paramss = new HttpParams();
    paramss = paramss.append('refId', this.refId);
    return this.http.get<any[]>(this.serverApiUrl.API_URL + `/referral/getReferral`, {params: paramss});
   }

  getSearchPerson(searchPerson: SearchPerson): Observable<any[]> {
  let paramss = new HttpParams();
  paramss = paramss.append('firstName', searchPerson.firstName);
  paramss = paramss.append('lastName', searchPerson.lastName);
  paramss = paramss.append('dobDt', searchPerson.dobDt);
  console.log(searchPerson);
  return this.http.get<any[]>(this.serverApiUrl.API_URL + `/pae/searchPerson`, {params: paramss});
  }

  postSearchPerson(applicant: Applicant): Observable<any[]> {
    return this.http.post<any[]>(this.serverApiUrl.API_URL + `/referral/searchPerson`, applicant);
  }

  getRefApplicantDetails(refId: string, requestPageId: string):Observable<any> {
    let paramss = new HttpParams();
    paramss = paramss.append('refId', refId);
    paramss = paramss.append('requestPageId', requestPageId);
    return this.http.get<any>(this.serverApiUrl.API_URL + `/referral/getRefApplicantDetails`, {params: paramss});
  }

  async getRefContactDetails(refId: string, requestPageId: string): Promise<HttpResponse<any>> {
    let paramss = new HttpParams();
    paramss = paramss.append('refId', refId);
    paramss = paramss.append('requestPageId', requestPageId);
    console.log('/referral/getReferralContact: ' + JSON.stringify(paramss, null, ' '));
    return this.http.get<any>(this.serverApiUrl.API_URL + `/referral/getReferralContact`, {params: paramss, observe: 'response'}).toPromise();
  }

  async getRefSchWrkDetails(refId: string, requestPageId: string): Promise<HttpResponse<any>> {
    let paramss = new HttpParams();
    paramss = paramss.append('refId', refId);
    paramss = paramss.append('requestPageId', requestPageId);
    console.log('/referral/getRefSchAndWork: ' + JSON.stringify(paramss, null, ' '));
    return this.http.get<any>(this.serverApiUrl.API_URL + `/referral/getRefSchAndWork`, {params: paramss, observe: 'response'}).toPromise();
  }

  async getRefCareSuprtDetails(refId: string, requestPageId: string): Promise<HttpResponse<any>> {
    let paramss = new HttpParams();
    paramss = paramss.append('refId', refId);
    paramss = paramss.append('requestPageId', requestPageId);
    console.log('/referral/getRefCareAndSupport: ' + JSON.stringify(paramss, null, ' '));
    return this.http.get<any>(this.serverApiUrl.API_URL + `/referral/getRefCareAndSupport`, {params: paramss, observe: 'response'}).toPromise();
  }

  async getRefSubmitDetails(refId: string, requestPageId: string): Promise<HttpResponse<any>> {
    let paramss = new HttpParams();
    paramss = paramss.append('refId', refId);
    paramss = paramss.append('requestPageId', requestPageId);
    console.log('/referral/getSubmitReferral: ' + JSON.stringify(paramss, null, ' '));
    return this.http.get<any>(this.serverApiUrl.API_URL + `/referral/getSubmitReferral`, {params: paramss, observe: 'response'}).toPromise();
  }
  
  async getIntakeOutcomeValidation(refId: string): Promise<HttpResponse<any>> {
    let paramss = new HttpParams();
    paramss = paramss.append('refId', refId);
    console.log('/intakeOutcome/getIntakeValidation: ' + JSON.stringify(paramss, null, ' '));
    return this.http.get<any>(this.serverApiUrl.API_URL + `/intakeOutcome/getIntakeValidation`, {params: paramss, observe: 'response'}).toPromise();
  }

  async createPdf(): Promise<HttpResponse<any>> {
    let paramss = new HttpParams();
    paramss = paramss.append('refId', this.refId);
    paramss = paramss.append('personId', this.personId);
    console.log('/referral/generatePdf: ' + JSON.stringify(paramss, null, ' '));
    return this.http.get<any>(this.serverApiUrl.API_URL + `/referral/generatePdf`, {params: paramss, observe: 'response'}).toPromise();
  }

}
