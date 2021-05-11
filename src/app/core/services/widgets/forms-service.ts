import { EnvService } from './../../../_shared/utility/env.service';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SupportFunctionsForms } from '../../../_shared/model/SupportFunctionsForms';
const PATH_TO_MOCK_JSON = '../../../../assets/data/mock-forms.json';

@Injectable({
  providedIn: 'root'
})
export class FormsService {
  serverApiUrl: any;

  constructor(private http: HttpClient,
              private envService: EnvService) {
                this.serverApiUrl = this.envService.apiUrl();
              }


  async getFormsDetails(): Promise<HttpResponse<any>> {
    return await this.http.get<any>(this.serverApiUrl.API_URL + `/supportFunctions/getFormDocuments`).toPromise();
  }

  async saveSupportFunctionsForm(supportFunctionsForms: SupportFunctionsForms): Promise<HttpResponse<any>> {
    return await this.http.post<any>(this.serverApiUrl.API_URL + `/supportFunctions/modifyformDocuments`,
    supportFunctionsForms, { observe: 'response' }).toPromise();
  }
   
}
