import { PaeMedicalRegimen } from './../../../../_shared/model/PaeMedicalRegimen';
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { EnvService } from '../../../../_shared/utility/env.service';

@Injectable({
  providedIn: 'root'
})
export class PaeMedicalRegimenService {

  serverApiUrl: any;
  constructor(public http: HttpClient,
              private envService: EnvService) {
    this.serverApiUrl = this.envService.apiUrl();
  }

  async saveMedicalRegimenForm(paeMedicalRegimen: PaeMedicalRegimen): Promise<HttpResponse<any>> {
    console.log(paeMedicalRegimen);
    return await this.http.post<any>(this.serverApiUrl.API_URL + `/pae/addMedicalRegimenInfo`,
    paeMedicalRegimen, { observe: 'response' }).toPromise();
  }

}
