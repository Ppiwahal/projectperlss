import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http/';
import { AppointmentAddUpdate } from '../../_shared/model/AppointmentAddUpdate';
import {Observable, of} from 'rxjs';
import { EnvService } from '../../_shared/utility/env.service';
import {HttpParams} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AppointmentsService {
  id: string;
  createdBy:string;
  response: any;
  public serverApiUrl: any;
  constructor(private http: HttpClient,
    private envService: EnvService) {
      this.serverApiUrl = this.envService.apiUrl();
     }

  async addAppointment(appointmentAddUpdate: any): Promise<HttpResponse<any>> {
    return await this.http.post<any>(this.serverApiUrl.API_URL +`/appointment/addAppointment`, appointmentAddUpdate, { observe: 'response' }).toPromise();
  }

  async getAppointment(id: string): Promise<HttpResponse<any>> {
    return await this.http.get<any>(this.serverApiUrl.API_URL +`/appointment/getAppointment?id=${id}`, { observe: 'response' }).toPromise();
  }

  async updateAppointment(appointmentAddUpdate: any): Promise<HttpResponse<any>> {
    return await this.http.post<any>(this.serverApiUrl.API_URL +`/appointment/updateAppointment`, appointmentAddUpdate, { observe: 'response' }).toPromise();
  }

  async getAppointments(createdBy: string): Promise<HttpResponse<any>> {
    return await this.http.get<any>(this.serverApiUrl.API_URL +`/appointment/countAppointments?cntctUser=${createdBy}`, { observe: 'response' }).toPromise();
  }

  cancelAppointment(payload: any): Observable<any> {
    return this.http.post<any>(this.serverApiUrl.API_URL +`/appointment/cancelAppointment`, payload);
  }

  getAppointmentSummary(appointmentId: string): Observable<any>{
    return  this.http.get<any>(this.serverApiUrl.API_URL +`/appointment/getAppointment?id=${appointmentId}`);
  }

  getCancellationReasonCodes(): Observable<any[]>{
    return this.http.get<any[]>(this.serverApiUrl.API_URL +`/api/staticData/getStaticDataValue?dataNameKey=APPOINTMENT_STATUS`);
  }

  getAppointmentType(): Observable<any[]>{
    return this.http.get<any[]>(this.serverApiUrl.API_URL +`/api/staticData/getStaticDataValue?dataNameKey=APPOINTMENT_TYPE`);
  }

  getContactMethod(): Observable<any[]>{
    return this.http.get<any[]>(this.serverApiUrl.API_URL +`/api/staticData/getStaticDataValue?dataNameKey=CONTACT_METHOD`);
  }

  getStateForAddress(): Observable<any[]> {
    return this.http.get<any[]>(this.serverApiUrl.API_URL +`/api/staticData/getStaticDataValue?dataNameKey=STATE`);
  }

  getCounties(): Observable<any[]> {
    return this.http.get<any[]>(this.serverApiUrl.API_URL +`/api/staticData/getStaticDataValue?dataNameKey=COUNTY`);
  }

  getAppointmentCancelReason(): Observable<any[]>{
    return this.http.get<any[]>(this.serverApiUrl.API_URL +`/api/staticData/getStaticDataValue?dataNameKey=APPOINTMENT_CANCEL_REASON`);
  }

  getRefType(): Observable<any[]>{
    return this.http.get<any[]>(this.serverApiUrl.API_URL +`/api/staticData/getStaticDataValue?dataNameKey=REF_TYPE`);
  }

  getPersonDetails(searchText, entityId): Observable<any[]> {
    return this.http.get<any[]>(`${this.serverApiUrl.API_URL}/api/es-user/personSearch?searchText=${searchText}&entityId=${entityId}`);
  }

  async searchAppointment(queryString): Promise<HttpResponse<any>> {
    console.log(queryString);
    return await this.http.get<any>(this.serverApiUrl.API_URL +`/appointment/searchAppointment${queryString}`, { observe: 'response' }).toPromise();
  }

  async searchAllAppointments(): Promise<HttpResponse<any>> {
    return await this.http.get<any>(this.serverApiUrl.API_URL +`/appointment/searchAll`, { observe: 'response' }).toPromise();
  }

  async getPersonAddress(id: string): Promise<HttpResponse<any>> {
    return await this.http.get<any>(this.serverApiUrl.API_URL +`/applicant/getApplicantAddress?id=${id}`, { observe: 'response' }).toPromise();
  }

}
