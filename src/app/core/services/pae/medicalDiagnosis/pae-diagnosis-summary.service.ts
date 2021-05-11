/* import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaeDiagnosisSummaryDocument } from '../../../../_shared/model/paeDiagnosis/PaeDiagnosisSummaryDocument'
import { EnvService } from '../../../../_shared/utility/env.service';

@Injectable({
    providedIn: 'root'
})
export class PaeDiagnosisSummaryService {
    serverApiUrl: any;
    constructor(public http: HttpClient,
                private envService: EnvService) {
        this.serverApiUrl = this.envService.apiUrl();
    }

    async savePaeDiagnosisSummary(paeDiagnosisSummaryDocument: PaeDiagnosisSummaryDocument): Promise<HttpResponse<any>> {

        return await this.http.post<any>(this.serverApiUrl.API_URL + `/doc/uploadMultipleDocument`,
            paeDiagnosisSummaryDocument, { observe: 'response' }).toPromise();
    }
    async getDiagnosisSummary(pageId, paeId): Promise<HttpResponse<any>> {
  const response = await this.http.get<any>(this.serverApiUrl.API_URL + `/paeSummary/getSummaryData`,
  { observe: 'response', params: {pageId, paeId} }).toPromise();
  return response;
}
}
 */
