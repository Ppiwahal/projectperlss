import { Injectable } from '@angular/core';
import { EnvService } from 'src/app/_shared/utility/env.service';
import { HttpClient, HttpHeaders } from '@angular/common/http/';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocumentsService {
  public serverApiUrl: any;
  public dataToHistory: any;

  constructor(private http: HttpClient, private envService: EnvService) {
    this.serverApiUrl = this.envService.apiUrl();
  }

  setHistoryData(dataToHistory) {
    this.dataToHistory = dataToHistory;
  }

  getHistoryData() {
    return this.dataToHistory;
  }

  getSearchDropdowns(input): Observable<any> {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/api/staticData/getStaticDataValue?dataNameKey=` + input, {
      headers : {'Content-Type': 'application/json'}
    });
  }

  getDocTypesandDocCats(input): Observable<any> {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/doc/getDocTypesandDocCats?` + input, {
      headers : {'Content-Type': 'application/json'}
    });
  }

  getSearchResultsBySearchCriteria(searchId, entityId) {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/docDashboard/getSearchResultsBySearchCriteria?` +
     searchId + `&` + `entityId=` + entityId, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  getPersonDetails(searchText, entityId): Observable<any[]> {
    return this.http.get<any[]>(`${this.serverApiUrl.API_URL}/api/es-user/personSearch?searchText=${searchText}&entityId=${entityId}`);
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

  uploadFile(payload) {
    return this.http.post<any>(`${this.serverApiUrl.API_URL}/doc/uploadMultipleDocument`, payload);
  }

  getApplicantRecords(personId, documentId) {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/supportFunctions/getApplicantRecords/` + personId + `/` + documentId, {
      headers: { 'Content-Type': 'application/json' }
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

}
