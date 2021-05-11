import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http/';
import {Observable, of, Subject} from 'rxjs';
import { EnvService } from '../../_shared/utility/env.service';


@Injectable({
  providedIn: 'root'
})
export class NoticesService {
  public serverApiUrl: any;
  submitStep3 = new Subject<boolean>();

  constructor(private http: HttpClient,
    private envService: EnvService) {
    this.serverApiUrl = this.envService.apiUrl();
  }

  getPrintTypes(): Observable<any[]> {
    return this.http.get<any[]>(this.serverApiUrl.API_URL +`/api/staticData/getStaticDataValue?dataNameKey=PRINT_TYPE`);
  }

  getFormAttachmentCodes(): Observable<any[]> {
    return this.http.get<any[]>(this.serverApiUrl.API_URL +`/api/staticData/getStaticDataValue?dataNameKey=NOTICES_ATTACHMENTS_FORMS`);
  }

  getRecipientTypes(): Observable<any[]> {
    return this.http.get<any[]>(this.serverApiUrl.API_URL +`/api/staticData/getStaticDataValue?dataNameKey=RECIPIENT_TYPE`);
  }

  getPersonDetails(searchText, entityId): Observable<any[]> {
    return this.http.get<any[]>(`${this.serverApiUrl.API_URL}/api/es-user/personSearch?searchText=${searchText}&entityId=${entityId}`);
  }

  getProgramTypes(): Observable<any[]>{
    return this.http.get<any[]>(this.serverApiUrl.API_URL +`/api/staticData/getStaticDataValue?dataNameKey=PROGRAM_NAME`);
  }

  getNoticeTypes(): Observable<any[]>{
    return this.http.get<any[]>(this.serverApiUrl.API_URL +`/api/staticData/getStaticDataValue?dataNameKey=NOTICE_TYPE`);
  }

  getPrintType(): Observable<any[]>{
    return this.http.get<any[]>(this.serverApiUrl.API_URL +`/api/staticData/getStaticDataValue?dataNameKey=PRINT_TYPE`);
  }

  getNoticeStatus(): Observable<any[]>{
   return this.http.get<any[]>(this.serverApiUrl.API_URL +`/api/staticData/getStaticDataValue?dataNameKey=STATUS`);
  }
  getNoticeCounty(): Observable<any[]>{
    return this.http.get<any[]>(this.serverApiUrl.API_URL +`/api/staticData/getStaticDataValue?dataNameKey=COUNTY`);
   }

  getAppealStatus(): Observable<any[]>{
    return this.http.get<any[]>(this.serverApiUrl.API_URL +`/api/staticData/getStaticDataValue?dataNameKey=APPEAL_STATUS`);
  }

  getPaeStatus(): Observable<any[]>{
    return this.http.get<any[]>(this.serverApiUrl.API_URL +`/api/staticData/getStaticDataValue?dataNameKey=PAE_STATUS`);
  }

  getKbReferralStatus(): Observable<any[]>{
    return this.http.get<any[]>(this.serverApiUrl.API_URL +`/api/staticData/getStaticDataValue?dataNameKey=KB_REFERRAL_STATUS`);
  }

  getReferralStatus(): Observable<any[]>{
    return this.http.get<any[]>(this.serverApiUrl.API_URL +`/api/staticData/getStaticDataValue?dataNameKey=REFERRAL_STATUS`);
  }

  uploadFile(payload) {
    return this.http.post<any>(`${this.serverApiUrl.API_URL}/doc/uploadMultipleDocument`, payload);
  }

  getReturnMailOptions(): Observable<any[]> {
    return this.http.get<any[]>(this.serverApiUrl.API_URL +`/api/staticData/getStaticDataValue?dataNameKey=RETURN_MAIL_OPTIONS`);
  }

  getEnrollmentStatus(): Observable<any[]>{
    return this.http.get<any[]>(this.serverApiUrl.API_URL +`/api/staticData/getStaticDataValue?dataNameKey=ENROLLMENT_STATUS`);
  }

  searchNoticeRecords(queryParams): Observable<any[]>{
    return this.http.get<any[]>(this.serverApiUrl.NOTICES_API_URL +`/noticeDashboard/getAdvancedSearchResults?${queryParams}`);
  }

  searchNoticeRecordByPrsnId(personId): Observable<any[]>{
    return this.http.get<any[]>(this.serverApiUrl.NOTICES_API_URL +`/noticeDashboard/searchByPerson/personId/${personId}`);
  }

  getNoticeRecords(personId): Observable<any[]> {
    return this.http.get<any[]>(this.serverApiUrl.API_URL +`/appeal/${personId}/notices`);
  }

  getRecipientDetails(queryParams): Observable<any[]> {
    return this.http.get<any[]>(this.serverApiUrl.NOTICES_API_URL +`/manualnotice/recipientDtls?${queryParams}`);
  }


  createManualNotice(payload): Observable<any> {
    return this.http.post<any>(this.serverApiUrl.NOTICES_API_URL +`/manualnotice`,payload);
  }

  getEnrollmentGroup(): Observable<any[]> {
    return this.http.get<any[]>(this.serverApiUrl.API_URL +`/api/staticData/getStaticDataValue?dataNameKey=ENROLLMENT_GROUP`);
  }

  updateCorrectionLetter(payload): Observable<any[]> {
    return this.http.post<any>(this.serverApiUrl.NOTICES_API_URL +`/noticeDashboard/correctionLetter`,payload);
  }

  updateNoticeStatus(payload): Observable<any> {
    return this.http.post<any>(this.serverApiUrl.NOTICES_API_URL +`/noticeDashboard/updateNoticeStatus`,payload);
  }

  getNoticeIdDetails(corId, userId): Observable<any[]> {
    return this.http.get<any[]>(this.serverApiUrl.NOTICES_API_URL +`/noticeDashboard/getNoticeDetails?corId=${corId}&createdBy=${userId}`);
  }

  getGenerateNoticeType(): Observable<any[]> {
    return this.http.get<any[]>(this.serverApiUrl.API_URL +`/api/staticData/getStaticDataValue?dataNameKey=GENERATE_NOTICE_TYPE`);
  }

  getNoticeTemplate(): Observable<any[]>{
    return this.http.get<any[]>(this.serverApiUrl.API_URL +`/api/staticData/getStaticDataValue?dataNameKey=NOTICE_TEMPLATE`);
  }

  getPdfDocument(langCd,corId): Observable<any>{
    //corId='401';
    return this.http.get<any[]>(this.serverApiUrl.NOTICES_API_URL +`/viewNotice?langCd=${langCd}&corId=${corId}`);
  }

  getReturnMailAddress(mailPieceId): Observable<any> {
    return this.http.get<any[]>(this.serverApiUrl.NOTICES_API_URL +`/returnmail/populateAddress/mailPieceId/${mailPieceId}`);
  }

  updateReturnMail(payload): Observable<any> {
    return this.http.post<any>(this.serverApiUrl.NOTICES_API_URL +`/returnmail`,payload);
  }


  manualNotice(payload): Observable<any> {
    return this.http.post<any>(this.serverApiUrl.NOTICES_API_URL +`/manualnotice`,payload);
  }


}
