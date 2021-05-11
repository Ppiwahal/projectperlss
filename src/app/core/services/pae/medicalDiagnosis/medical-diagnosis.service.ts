import { EnvService } from './../../../../_shared/utility/env.service';
import { HttpClient, HttpResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaeMedicalDiagnosis } from '../../../../_shared/model/PaeMedicalDiagnosis'
import { PaeMedical } from 'src/app/_shared/model/PaeMedicalDiagnosis/PaeMedical';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { PaeFlowSeq } from 'src/app/_shared/utility/PaeFlowSeq';
import { PaeCommonService } from '../pae-common/pae-common.service';
import { PaeService } from '../pae.service';
@Injectable({
  providedIn: 'root'
})
export class MedicalDiagnosisService {
  serverApiUrl: any;
  constructor(public http: HttpClient, private router:Router,
    private paeCommonService: PaeCommonService, private paeService: PaeService,
              private envService: EnvService) {
              this.serverApiUrl = this.envService.apiUrl();
  }

  async saveMedicalDiagnosis(paeMedical: PaeMedical): Promise<HttpResponse<any>> {
    return await this.http.post<any>(this.serverApiUrl.API_URL + `/pae/addMedicalDiagnosis`,
    paeMedical, { observe: 'response' }).toPromise();
  }

  getMedicalDiagnosisData(paeId): Observable<any>{
    let paramss = new HttpParams();
    paramss = paramss.append('paeId', paeId);
    return this.http.get<Observable<any>>(this.serverApiUrl.API_URL + `/pae/getMedicalDiagnosis`, {params: paramss});
  }
}
