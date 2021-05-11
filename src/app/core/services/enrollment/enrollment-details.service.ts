import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EnvService } from 'src/app/_shared/utility/env.service';

@Injectable({
  providedIn: 'root'
})
export class EnrollmentDetailsService {

  serverApiUrl: any;
  response: any;
  constructor(private http: HttpClient, private envService: EnvService) {
    this.serverApiUrl = this.envService.apiUrl();
   }

  

  async getEnrollmentApplicantData(paeId: string) {
    let responseData;
      let response = await this.http.get(this.serverApiUrl.API_URL + `/enrollment/getEnrollmentApplicantDetails/`+paeId).toPromise().then(data => {
        responseData = data;
        console.log(data);
      });
      return responseData;
  }

  getEnrollmentAppData(paeId: string): Observable<any>{
    let params = new HttpParams();
        params = params.append('paeId', paeId);
    return this.http.get<Observable<any>>(this.serverApiUrl.API_URL + `/enrollment/getEnrollmentApplicantDetails/PAE1000308`);
  }

  getFinancialEligibility(enrId: string): Observable<any>{
    //enrId='558';
    return this.http.get<Observable<any>>(this.serverApiUrl.API_URL + `/enrollment/getFinancialEligibilityLookUp/`+enrId);
  }
  checkFinancialEligibility(enrId: string): Observable<any>{
    //enrId='558';
    return this.http.get<Observable<any>>(this.serverApiUrl.API_URL + `/enrollment/checkFinancialEligibilityLookUp/`+enrId);
  }

  getEnrollmentSummary(enrId: string): Observable<any>{
    //enrId='558';
    return this.http.get<Observable<any>>(this.serverApiUrl.API_URL + `/enrollment/getEnrDetailsSummary/`+enrId);
  }

  getPateintLiabilityDetails(financialEligID: string): Observable<any>{
    financialEligID='142861';
    return this.http.get<Observable<any>>(this.serverApiUrl.API_URL + `/enrollment/getPatientLiabilityDetails/`+financialEligID);
  }

  getEnrollmentData(paeId: string): Observable<any>{
    //enrId='558';
    return this.http.get<Observable<any>>(this.serverApiUrl.API_URL + `/enrollment/getAllEnrDetails/`+paeId);
  }
  
  getEnrollmentSummaryDetails(enrId: string): Observable<any>{
    //enrId='558';
    return this.http.get<Observable<any>>(this.serverApiUrl.API_URL + `/enrollment/getEnrollmentSummaryTableDetails/`+enrId);
  }

  async editFinancialEligibilityDetails(request: any) {
    const response = await this.http.post<Observable<any>>(this.serverApiUrl.API_URL + '/enrollment/updatePatientLiabilityDetails', request, { observe: 'response' }).toPromise();
    return response;
  }

  async saveDisEnrollmentDetails(request: any) {
    const response = await this.http.post<Observable<any>>(this.serverApiUrl.API_URL + '/enrollment/saveDisEnrollmentDetails', request, { observe: 'response' }).toPromise();
    return response;
  }

  getEnrollmentOPADetails(paeId: string): Observable<any>{
    return this.http.get<Observable<any>>(this.serverApiUrl.API_URL + `/enrollment/getEnrollmentOPADetails/`+paeId);
  }

  // async getChmDisenrollmentDetails(enrId: string){
  //   return this.http.get<Observable<any>>(this.serverApiUrl.API_URL + `/enrollment/getChmDisenrollmentDetails/`+enrId);
  // }

 getChmDisenrollmentDetails(enrId): any {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/enrollment/getChmDisenrollmentDetails/${enrId}`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  async authorizeEnrollment(request: any) {
    const response = await this.http.post<Observable<any>>(this.serverApiUrl.API_URL + '/enrollment/saveEnrollmentDetail', request, { observe: 'response' }).toPromise();
    return response;
  }
  getMmisLookupData(request: any) {
    return this.http.post<Observable<any>>(this.serverApiUrl.API_URL + '/mmis-lookup-service/retrieve-data', request)
  }
  getEntityAssociation(personId) {
    return this.http.get<Observable<any>>(this.serverApiUrl.API_URL + '/changeManagement/entityAssociation/getEntityAssociation?personId='+ personId);    
  }
  getMCOInfo(personId) {
    return this.http.get<Observable<any>>(this.serverApiUrl.API_URL + '/enrollment/getMCOInfo/'+ personId);    
  }
}
