import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvService } from '../utility/env.service';

@Injectable({
    providedIn: 'root'
})
export class AddressService {

    public serverApiUrl: any;

    constructor(private http: HttpClient, private envService: EnvService) {
        this.serverApiUrl = this.envService.apiUrl();
    }

    getDropdownValues(input): Observable<any> {
        return this.http.get<any>(`${this.serverApiUrl.API_URL}/api/staticData/getStaticDataValue?dataNameKey=${input}`, {
            headers: { 'Content-Type': 'application/json' }
        });
    }

    validateAddress(payload) {
        return this.http.post<any>(`${this.serverApiUrl.API_URL}/experian/validateAddress`, payload);
      }

      validateextrefAddress(payload) {
        return this.http.post<any>(`${this.serverApiUrl.API_URL}/experian/externalReferral/validateAddress`, payload);
      }
}
