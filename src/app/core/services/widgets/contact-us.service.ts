import { EnvService } from './../../../_shared/utility/env.service';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
const PATH_TO_MOCK_JSON = '../../../../assets/data/mock-contact-us.json';

@Injectable({
  providedIn: 'root'
})
export class ContactUsService {
  serverApiUrl: any;

  constructor(private http: HttpClient,
              private envService: EnvService) {
                this.serverApiUrl = this.envService.apiUrl();
              }


  async getContactUsDetails(): Promise<HttpResponse<any>> {
    return await this.http.get<any>(PATH_TO_MOCK_JSON, { observe: 'response' }).toPromise();
  }
}
