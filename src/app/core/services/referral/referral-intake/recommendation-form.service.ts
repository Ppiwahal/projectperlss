import { EnvService } from './../../../../_shared/utility/env.service';
import { HttpClient, HttpResponse, HttpParams } from '@angular/common/http';
import { RecommendationForm } from './../../../../_shared/model/Forms/RecommendationForm';
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
@Injectable({
  providedIn: 'root'
})

export class RecommendationFormService {
  serverApiUrl: any;
  constructor(public http: HttpClient,
              private envService: EnvService) {
    this.serverApiUrl = this.envService.apiUrl();
  }

  // tslint:disable-next-line: no-shadowed-variable
  async saveRecommendationForm(recommedationForm: RecommendationForm): Promise<HttpResponse<any>> {
    // console.log('saveRecommendationForm : ' + JSON.stringify(recommedationForm));
    return await this.http.post<any>(this.serverApiUrl.API_URL + `/referral/eform/recomdFormPopup`,
      recommedationForm, { observe: 'response' }).toPromise();
  }

    getRecommendationDetails(refId: any): Observable<any[]> {
    let paramss = new HttpParams();
    paramss = paramss.append('dataNameKey', String(refId));
    return this.http.get<any[]>(this.serverApiUrl.API_URL + "/api/staticData/getStaticDataValue", {params: paramss});
  }

    async updateRecommendationForm(recommedationForm: RecommendationForm): Promise<HttpResponse<any>> {
       // console.log('updateRecommendationForm : ' + JSON.stringify(recommedationForm));
    return await this.http.put<any>(this.serverApiUrl.API_URL + `/referral/eform/recomdFormPopup`,
      recommedationForm, { observe: 'response' }).toPromise();
  }

}
