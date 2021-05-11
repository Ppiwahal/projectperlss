import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http/';
import { forkJoin, Observable, of } from 'rxjs';
import { EnvService } from '../../_shared/utility/env.service';

@Injectable({
  providedIn: 'root'
})
export class SlotManagmentService {
  intakeOutcomeList;
  refProgramsList;
  slotStatusList;
  refWaitingList;
  refListStatusList;
  yesNoList;
  taskStatusList;
  transitionValues;
  refid;
  prsnId;
  slotDetailsId;
  taskId;
  taskMasterId;

  public serverApiUrl: any;
  public requestOptions: Object = {
    responseType: 'text'
  }
  constructor(private http: HttpClient,
    private envService: EnvService
  ) {
    this.serverApiUrl = this.envService.apiUrl();
  }
  getStaticDataValue(tableName: string): Observable<any> {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/api/staticData/getStaticDataValue?dataNameKey=` + tableName, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  public getAdditionalFilterValues(): Observable<any[]> {
    let response1 = this.http.get<any>(`${this.serverApiUrl.API_URL}/api/staticData/getStaticDataValue?dataNameKey=SLOT_STATUS`, {
      headers: { 'Content-Type': 'application/json' }
    });
    let response2 = this.http.get<any>(`${this.serverApiUrl.API_URL}/api/staticData/getStaticDataValue?dataNameKey=REF_PROGRAMS`, {
      headers: { 'Content-Type': 'application/json' }
    });
    let response3 = this.http.get<any>(`${this.serverApiUrl.API_URL}/api/staticData/getStaticDataValue?dataNameKey=REFERRAL_WAITINGLIST`, {
      headers: { 'Content-Type': 'application/json' }
    });
    let response4 = this.http.get<any>(`${this.serverApiUrl.API_URL}/api/staticData/getStaticDataValue?dataNameKey=INTAKE_EVALUATION`, {
      headers: { 'Content-Type': 'application/json' }

    });
    let response5 = this.http.get<any>(`${this.serverApiUrl.API_URL}/api/staticData/getStaticDataValue?dataNameKey=REFERRAL_LIST_STATUS`, {
      headers: { 'Content-Type': 'application/json' }

    });

    let response6 = this.http.get<any>(`${this.serverApiUrl.API_URL}/api/staticData/getStaticDataValue?dataNameKey=YES_NO`, {
      headers: { 'Content-Type': 'application/json' }

    });
    let response7 = this.http.get<any>(`${this.serverApiUrl.API_URL}/api/staticData/getStaticDataValue?dataNameKey=TASK_STATUS`, {
      headers: { 'Content-Type': 'application/json' }

    });
    let response8 = this.http.get<any>(`${this.serverApiUrl.API_URL}/api/staticData/getStaticDataValue?dataNameKey=GROUP_NAME`, {
      headers: { 'Content-Type': 'application/json' }

    });
    return forkJoin([response1, response2, response3, response4, response5, response6, response7,response8]);
  }

  public getslotEvaluationValues(): Observable<any[]> {
   return this.http.get<any>(`${this.serverApiUrl.API_URL}/api/staticData/getStaticDataValue?dataNameKey=SLOT_UPDATE_ACTION`, {
      headers: { 'Content-Type': 'application/json' }

    });
  }

  public getslotDetailsCodeValues(): Observable<any[]> {

    let response1 = this.http.get<any>(`${this.serverApiUrl.API_URL}/api/staticData/getStaticDataValue?dataNameKey=REFERRAL_STATUS`, {
      headers: { 'Content-Type': 'application/json' }

    });
    let response2 = this.http.get<any>(`${this.serverApiUrl.API_URL}/api/staticData/getStaticDataValue?dataNameKey=ENROLLMENT_GROUP`, {
      headers: { 'Content-Type': 'application/json' }

    });


    return forkJoin([response1, response2]);
  }
  public getslotQueueList( userId: string, entityId: string): Observable<any[]> {
    let response1 = this.http.get<any>(`${this.serverApiUrl.API_URL}/slotDashboard/slotQueues?userId=` + userId + `&entityId=` + entityId, {
      headers: { 'Content-Type': 'application/json' }
    });
    let response2 = this.http.get<any>(`${this.serverApiUrl.API_URL}/api/staticData/getStaticDataValue?dataNameKey=TASK_QUEUE`, {
      headers: { 'Content-Type': 'application/json' }
    });
    return forkJoin([response1, response2]);
  }


  getSlotSummaryDetails(): Observable<any> {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/slotDashboard/getSlotSummaryDetails`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  getKBDetails(): Observable<any> {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/slotDashboard/getKBDetails`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  getECFACDetails(): Observable<any> {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/slotDashboard/getECFACDetails`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  getECFRCDetails(): Observable<any> {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/slotDashboard/getECFRCDetails`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  getECFOtherRCDetails(): Observable<any> {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/slotDashboard/getECFOtherRCDetails`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  getECFPGDetails(): Observable<any> {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/slotDashboard/getECFPGDetails`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  getOCAndTIPDetails(): Observable<any> {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/slotDashboard/getOCAndTIPDetails`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  getReferralAndWaitingListCount(): Observable<any> {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/slotDashboard/getReferralAndWaitingListCount`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  getSearchResultsBySltStatus(statusCD: any): Observable<any> {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/slotDashboard/getSearchResultsBySltStatus?sltStatusCd=` + statusCD, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  getSearchResultsByFilters(searchText: string, sltStatus: string, enrGroup: string, refWtngList: string, intakeOutcome: string): Observable<any> {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/slotDashboard/getSearchResultsByFilters?searchText=` + searchText + `&sltStatusCd=` + sltStatus + `&enrGroupCd=` + enrGroup + `&refWtngListCd=` + refWtngList + `&intakeOutcomeCd=` + intakeOutcome, {
      headers: { 'Content-Type': 'application/json' }

     
    });
  }
  getSlotInformation(enrGroupCd: string, sltStatusCd: string): Observable<any> {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/slotEnrollment/getSlotInformation?enrGroupCd=` + enrGroupCd + `&sltStatusCd=` + sltStatusCd, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  addOrRemoveSlot(total: number, heldOrFilled: number, available: number, slotField: number): Observable<any> {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/slotEnrollment/addOrRemoveSlot?total=` + total + `&heldOrFilled=` + heldOrFilled + `&available=` + available + `&slotField=` + slotField, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  moveSlot(totalFrom: number, heldOrFilledFrom: number, availableFrom: number, totalTo: number, heldOrFilledTo: number, availableTo: number, slotField: number): Observable<any> {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/slotEnrollment/moveSlot?totalFrom=` + totalFrom + `&heldOrFilledFrom=` + heldOrFilledFrom + `&availableFrom=` + availableFrom + `&totalTo=` + totalTo + `&heldOrFilledTo=` + heldOrFilledTo + `&availableTo=` + availableTo + `&slotField=` + slotField, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  slotCapacityHistory(sltActionCd: string, enrGroupCd: string, sltTypeCd: string): Observable<any> {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/slotEnrollment/slotCapacityHistory?sltActionCd=` + sltActionCd + `&enrGroupCd=` + enrGroupCd + `&sltTypeCd=` + sltTypeCd, {
      headers: { 'Content-Type': 'application/json' }
    });
  }



  getEnrollmentSlotType(mode: string) {
    const enrollmentSlotType: any = [{ "code": "RC", "ENR_GROUP": "EC4", "value": "ECF CHOICES 4 - Reserve Capacity", "activateSW": "Y" },
    { "code": "PG", "ENR_GROUP": "EC4", "value": "ECF CHOICES 4 - Priority Group", "activateSW": "Y" },
    { "code": "AC", "ENR_GROUP": "EC4", "value": "ECF CHOICES 4 - DD Aged Caregiver", "activateSW": "Y" },
    { "code": "RC", "ENR_GROUP": "EC5", "value": "ECF CHOICES 5 - Reserve Capacity", "activateSW": "Y" },
    { "code": "PG", "ENR_GROUP": "EC5", "value": "ECF CHOICES 5 - Priority Group", "activateSW": "Y" },
    { "code": "AC", "ENR_GROUP": "EC5", "value": "ECF CHOICES 5 - DD Aged Caregiver", "activateSW": "Y" },
    { "code": "RC", "ENR_GROUP": "EC6", "value": "ECF CHOICES 6 - Reserve Capacity", "activateSW": "Y" },
    { "code": "PG", "ENR_GROUP": "EC6", "value": "ECF CHOICES 6 - Priority Group", "activateSW": "Y" },
    { "code": "AC", "ENR_GROUP": "EC6", "value": "ECF CHOICES 6 - DD Aged Caregiver", "activateSW": "Y" },
    { "code": "RC", "ENR_GROUP": "EC7", "value": "ECF CHOICES 7 - Reserve Capacity", "activateSW": "Y" },
    { "code": "RC", "ENR_GROUP": "EC8", "value": "ECF CHOICES 8 - Reserve Capacity", "activateSW": "Y" },
    { "code": "KBA", "ENR_GROUP": "KBA", "value": "Katie Beckett Part A", "activateSW": "Y" },
    { "code": "KBB", "ENR_GROUP": "KBB", "value": "Katie Beckett Part B", "activateSW": "Y" }]

    if (mode === 'programTypeECF') {
      const removeValFromIndex = [11, 12];
      const indexSet = new Set(removeValFromIndex);
      const arrayWithValuesRemoved = enrollmentSlotType.filter((value, i) => !indexSet.has(i));
      const programTypeECF = arrayWithValuesRemoved;
      return programTypeECF;
    } else if (mode === 'moveSlotsECF') {
      const removeValFromIndex = [11, 12];
      const indexSet = new Set(removeValFromIndex);
      const arrayWithValuesRemoved = enrollmentSlotType.filter((value, i) => !indexSet.has(i));
      const moveSlotsECF = arrayWithValuesRemoved;
      return moveSlotsECF;
    } else if (mode === 'moveSlotsKT') {
      const removeValFromIndex = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const indexSet = new Set(removeValFromIndex);
      const arrayWithValuesRemoved = enrollmentSlotType.filter((value, i) => !indexSet.has(i));
      const moveSlotsKT = arrayWithValuesRemoved;
      return moveSlotsKT;
    } else if (mode === 'programTypeKT') {
      const removeValFromIndex = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const indexSet = new Set(removeValFromIndex);
      const arrayWithValuesRemoved = enrollmentSlotType.filter((value, i) => !indexSet.has(i));
      const programTypeKT = arrayWithValuesRemoved;
      return programTypeKT;
    } else if (mode === 'programTypeChoices') {
      const programTypeChoices = [{ "code": "", "ENR_GROUP": "CH2", "value": "CHOICES 2", "activateSW": "Y" }];
      return programTypeChoices;
    } else {
      return enrollmentSlotType;


    }
  }
  getECFCapacities(enrGroupCd: string, sltTypeCd: string, newEnrCapacity: number): Observable<any> {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/slotConfirmation/getECFCapacities?enrGroupCd=` + enrGroupCd + `&sltTypeCd=` + sltTypeCd + `&newEnrCapacity=` + newEnrCapacity, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  updateSlotOnAddRemove(payload: any): Observable<any> {
    return this.http.post<any>(`${this.serverApiUrl.API_URL}/slotConfirmation/updateSlotOnAddRemove`, payload,
      { headers: { 'Content-Type': 'application/json' } });
  }

  updateSlotOnMove(payload: any): Observable<any> {
    return this.http.post<any>(`${this.serverApiUrl.API_URL}/slotConfirmation/updateSlotOnMove`, payload,
      { headers: { 'Content-Type': 'application/json' } });
  }


  getSlotDetails(refId: string, prsnId: string,id:string): Observable<any> {
    let slotDetail = this.http.get<any>(`${this.serverApiUrl.API_URL}/slot/getSlotDetails?refId=` + refId + `&prsnId=` + prsnId+`&id=` +id, {
      headers: { 'Content-Type': 'application/json' }
    });

    let enrollmentGroup = this.http.get<any>(`${this.serverApiUrl.API_URL}/slot/getEnrGrpCodes?refId=` + refId + `&prsnId=` + prsnId, {
      headers: { 'Content-Type': 'application/json' }
    });
    let slotAvailability = this.http.get<any>(`${this.serverApiUrl.API_URL}/slot/getSlotsAvailable?refId=` + refId, {
      headers: { 'Content-Type': 'application/json' }
    });

    return forkJoin([slotDetail, enrollmentGroup, slotAvailability]);
  }
  getSlotDetailHistory(refId: string, prsnId: string, id: string): Observable<any> {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/slot/getSlotHistory?refId=` + refId + `&prsnId=` + prsnId + `&id=` + id, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  updateSlot(payload: any): Observable<any> {
    return this.http.post<any>(`${this.serverApiUrl.API_URL}/slot/updateSlot` , payload,
      { headers: { 'Content-Type': 'application/json' } });
  }

  getECFReferralListDetails(): Observable<any> {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/slotECFReferral/getECFReferralListDetails`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  getReferralSearchResultsByFilters(searchText: string, refListStatusCd: string, intakeOutcomeCd: string, diddWaitList: string): Observable<any> {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/slotECFReferral/getSearchResultsByFilters?searchText=` + searchText + `&refListStatusCd=` + refListStatusCd + `&intakeOutcomeCd=` + intakeOutcomeCd + `&diddWaitList=` + diddWaitList, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  updateTaskStatus(taskId: string, userId: string): Observable<any> {
    return this.http.post<any>(`${this.serverApiUrl.API_URL}/slotDashboard/updateTaskStatus?taskId=` + taskId + `&userId=` + userId, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  removeECFReferral(payload: any): Observable<any> {
    return this.http.post<any>(`${this.serverApiUrl.API_URL}/slotECFReferral/removeECFReferral`, payload,
      { headers: { 'Content-Type': 'application/json' } });
  }
  updateKeySwitch(refId: string, keySwitch: string): Observable<any> {
    return this.http.post<any>(`${this.serverApiUrl.API_URL}/slotECFReferral/updateKeySwitch?refId=` + refId + `&keySwitch=` + keySwitch,
      { headers: { 'Content-Type': 'application/json' } });
  }
  getPersonDetails(searchText, entityId): Observable<any[]> {
    return this.http.get<any[]>(`${this.serverApiUrl.API_URL}/api/es-user/personSearch?searchText=${searchText}&entityId=${entityId}`);
  }


  getChoice2WaitingList(): Observable<any> {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/slotChoice2Waiting/getChoice2WaitingList`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  getECFSlotDetails(enrGroupCd: string, sltTypeCd: string): Observable<any> {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/slotUpdate/getECFSlotDetails?enrGroupCd=` + enrGroupCd + `&sltTypeCd=` + sltTypeCd, 
    {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  getSearchResults(searchText: string, enrGroupCd: string, sltTypeCd: string): Observable<any> {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/slotUpdate/getSearchResults?searchText=` + searchText + `&enrGroupCd=` + enrGroupCd + `&sltTypeCd=` + sltTypeCd, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  updateSlotKeySwitch(refId: string, keySwitch: string,sltStatus: string): Observable<any> {
    return this.http.post<any>(`${this.serverApiUrl.API_URL}/slotUpdate/updateKeySwitch?refId=` + refId + `&keySwitch=` + keySwitch + `&sltStatus=` +sltStatus,
      { headers: { 'Content-Type': 'application/json' } });
  }

  getKBPartaWaitingListDetails(): Observable<any> {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/slotKBParta/getKBWaitingListDetails`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  getKBPartaSearchResults(searchText: string): Observable<any> {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/slotKBParta/getSearchResults?searchText=` + searchText, 
    {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  removeKBParta(payload: any): Observable<any> {
    return this.http.post<any>(`${this.serverApiUrl.API_URL}/slotKBParta/removeKB`, payload,
      { headers: { 'Content-Type': 'application/json' } });
  }

  updateRankParta(payload: any): Observable<any> {
    return this.http.post<any>(`${this.serverApiUrl.API_URL}/slotKBParta/updateRank`, payload,
      { headers: { 'Content-Type': 'application/json' } });
  }

  getKBPartbWaitingListDetails(): Observable<any> {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/slotKBPartb/getKBWaitingListDetails`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  getKBPartbSearchResults(searchText: string): Observable<any> {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/slotKBPartb/getSearchResults?searchText=` + searchText, 
    {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  removeKBPartb(payload: any): Observable<any> {
    return this.http.post<any>(`${this.serverApiUrl.API_URL}/slotKBPartb/removeKB`, payload,
      { headers: { 'Content-Type': 'application/json' } });
  }

  updateRankPartb(payload: any): Observable<any> {
    return this.http.post<any>(`${this.serverApiUrl.API_URL}/slotKBPartb/updateRank`, payload,
      { headers: { 'Content-Type': 'application/json' } });
  }



}