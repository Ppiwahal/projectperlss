import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http/';
import { Observable, of } from 'rxjs';
import { EnvService } from '../../_shared/utility/env.service';

@Injectable({
  providedIn: 'root'
})

export class RightNavTaskService {

  public serverApiUrl: any;

  constructor(private http: HttpClient,
              private envService: EnvService) {
    this.serverApiUrl = this.envService.apiUrl();
  }

  updateTaskClosure(taskId: number, closureDetaildesc: string): Observable<any>{
    return  this.http.post<any>(`${this.serverApiUrl.ADMIN_API_URL}/closeTask?taskId=${taskId}&closuredetaildesc=${closureDetaildesc}`, null, {
      headers: {'Content-Type': 'application/json'}
    });
  }

  getAssignedTasks(userId, personId, searchId) {
    return this.http.get<any[]>(`${this.serverApiUrl.API_URL}/supportFunctions/getAssignedTasks?userId=${userId}&personId=${personId}&${searchId}`, {
      headers : {'Content-Type': 'application/json'}
    });
  }

  getPersonDetailsByPersonId(userId, personId, refId) {
    return this.http.get<any[]>(`${this.serverApiUrl.API_URL}/supportFunctions/getPrsnDetails?personId=${personId}&refId=${refId}&userId=${userId}`, {
      headers : {'Content-Type': 'application/json'}
    });
  }

  getNotes(input): Observable<any> {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/api/getNotes?${input}`, {
      headers : {'Content-Type': 'application/json'}
    });
  }

  saveNotes(payload) {
    return this.http.post<any>(`${this.serverApiUrl.API_URL}/api/addNotes`, payload, {
      headers : {'Content-Type': 'application/json'}
    });
  }

  getNotesType(input): Observable<any> {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/api/staticData/getStaticDataValue?dataNameKey=${input}`, {
      headers : {'Content-Type': 'application/json'}
    });
  }

  getDocumentsDropdown() {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/api/staticData/getStaticDataValue?dataNameKey=DOCUMENT_TYPE`, {
      headers : {'Content-Type': 'application/json'}
    });
  }

  getRequiredDocumentsDropdown(categoryCd, programCd): Observable<any>{
    let paramss = new HttpParams();
    paramss = paramss.append('categoryCd', categoryCd);
    paramss = paramss.append('programCd', programCd);
    return this.http.get<Observable<any>>(this.serverApiUrl.API_URL + `/getDocumentsTypesByProgram`,
    {params: paramss});
  }

  getPAEStatus() {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/api/staticData/getStaticDataValue?dataNameKey=PAE_STATUS`, {
      headers : {'Content-Type': 'application/json'}
    });
  }

  uploadFile(payload) {
    return this.http.post<any>(`${this.serverApiUrl.API_URL}/doc/uploadMultipleDocument`, payload);
  }

  getDocByPersonId(personId, searchId) {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/supportFunctions/getDocByPersonId?personId=` + personId + `&` + searchId, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  getDocByDocId(docId) {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/doc/getDocByDocId?docId=` + docId, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  getApplicantRecords(personId, documentId) {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/supportFunctions/getApplicantRecords/` + personId + `/` + documentId, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  getDocTypesandDocCats(input): Observable<any> {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/doc/getDocTypesandDocCats?` + input, {
      headers : {'Content-Type': 'application/json'}
    });
  }

  getSearchDropdowns(input): Observable<any> {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/api/staticData/getStaticDataValue?dataNameKey=` + input, {
      headers : {'Content-Type': 'application/json'}
    });
  }

  changeDocumentType(payload) {
    return this.http.post<any>(`${this.serverApiUrl.API_URL}/supportFunctions/changeDocumentType`, payload);
  }

  addDocToRecord(payload) {
    return this.http.post<any>(`${this.serverApiUrl.API_URL}/supportFunctions/addDocToRecord`, payload);
  }

  deleteDocument(input) {
    return this.http.post<any>(`${this.serverApiUrl.API_URL}/doc/deleteDocument?DocumentId=` + input, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json'})
    });
  }

  searchNoticeRecordByPrsnId(personId): Observable<any[]>{
    return this.http.get<any[]>(this.serverApiUrl.NOTICES_API_URL + `/noticeDashboard/searchByPerson/personId/${personId}`);
  }

  getPdfDocument(langCd,corId): Observable<any>{
    return this.http.get<any[]>(this.serverApiUrl.NOTICES_API_URL + `/viewNotice?langCd=${langCd}&corId=${corId}`);
  }

  getAllTaskNames(userId): Observable<any[]> {
    return this.http.get<any[]>(`${this.serverApiUrl.ADMIN_API_URL}/getAllTaskMaster?userId=${userId}`);
  }

  getTaskPriorityCodes(): Observable<any[]>{
    return this.http.get<any[]>(this.serverApiUrl.API_URL + `/api/staticData/getStaticDataValue?dataNameKey=TASK_PRIORITY`);
  }

  mcochecklist(payload): Observable<any>{
    return this.http.post<any>(`${this.serverApiUrl.API_URL}/mco/mcochecklist`, payload);
  }

  createTask(payload: any): Observable<any>{
    return  this.http.post<any>(`${this.serverApiUrl.ADMIN_API_URL}/createTask`, payload);
  }

  getTaskStatusCodes(): Observable<any[]>{
    return this.http.get<any[]>(this.serverApiUrl.API_URL +`/api/staticData/getStaticDataValue?dataNameKey=TASK_STATUS`);
 }

}
