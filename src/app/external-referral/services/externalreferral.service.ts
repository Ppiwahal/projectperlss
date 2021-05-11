import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpParams } from '@angular/common/http/';
import {Observable, Subject, of, BehaviorSubject} from 'rxjs';
import { EnvService } from '../../_shared/utility/env.service';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { RefApplicantDetail } from '../../_shared/model/RefApplicantDetail';
import { RefSchAndWork } from '../../_shared/model/RefSchAndWork';
import { RefSubmission } from '../../_shared/model/RefSubmission';
import { RefAppContact } from '../../_shared/model/RefAppContact';
import { RefCareAndSupport } from '../../_shared/model/RefCareAndSupport';
import { Applicant } from '../../_shared/model/Applicant';
import { ApplicantAddress } from '../../_shared/model/ApplicantAddress';
import { ExtRefApplicant } from '../../_shared/model/ExtRefApplicant';


@Injectable({
  providedIn: 'root'
})
export class ExternalreferralService {
  
 
  id: string;
  response: any;
  public serverApiUrl: any;
  applicantAdd : ApplicantAddress;
  refId;
  refId$$ = new BehaviorSubject<any>('');
  startInfoData$$ = new BehaviorSubject<any>(null);
  applicantInfoData$$ = new BehaviorSubject<any>(null);
  careSupportData$$ =  new BehaviorSubject<any>(null);
  schoolWorkData$$ = new BehaviorSubject<any>(null);
  contactInfoData$$ =  new BehaviorSubject<any>(null);
  livingArrangementType$$ = new BehaviorSubject<any>(null);
  
 

  private startReferralSource: Subject<FormGroup> = new Subject();
  stepOne: Observable<FormGroup> = this.startReferralSource.asObservable();

  private applicantInfoSource: Subject<FormGroup> = new Subject();
  stepTwo: Observable<FormGroup> = this.applicantInfoSource.asObservable();

  private contactInfoSource: Subject<FormGroup> = new Subject();
  stepThree: Observable<FormGroup> = this.contactInfoSource.asObservable();

  private schoolWorkSource: Subject<FormGroup> = new Subject();
  stepFour: Observable<FormGroup> = this.schoolWorkSource.asObservable();

  private careSupportSource: Subject<FormGroup> = new Subject();
  stepFive: Observable<FormGroup> = this.careSupportSource.asObservable();

  private submitReferralSource: Subject<FormGroup> = new Subject();
  stepSix: Observable<FormGroup> = this.submitReferralSource.asObservable();

  private paramSource = new BehaviorSubject(null);
  sharedParam = this.paramSource.asObservable();

  mainForm: FormGroup = this._formBuilder.group({
    refStartVO: RefApplicantDetail,
    refApplicantVO: ExtRefApplicant,
    refAppContactDtlVO: RefAppContact,
    refSchAndWorkVO:RefSchAndWork,
    refCareAndSupportVO:RefCareAndSupport,
    refSubmissionVO:RefSubmission
  })


  constructor(private http: HttpClient,
    private envService: EnvService,
    private _formBuilder: FormBuilder) {
      this.serverApiUrl = this.envService.apiUrl();

      this.stepOne.subscribe(form =>
        form.valueChanges.subscribe(val => {
          this.mainForm.controls.refStartVO.patchValue(val);
          //this.myForm.controls.appointmentAddressVO.patchValue(value);
           //console.log(this.mainForm.value);
        })
      )
      this.stepTwo.subscribe(form =>
        form.valueChanges.subscribe(val => {
          this.mainForm.controls.refApplicantVO.patchValue(val);
          //console.log(this.mainForm.value);
        })
      )
      this.stepThree.subscribe(form =>
        form.valueChanges.subscribe(val => {
          this.mainForm.controls.refAppContactDtlVO.patchValue(val);
          //console.log(this.mainForm.value);
        })
      )
      this.stepFour.subscribe(form =>
        form.valueChanges.subscribe(val => {
          this.mainForm.controls.refSchAndWorkVO.patchValue(val);
          //console.log(this.mainForm.value);
        })
      )
      this.stepFive.subscribe(form =>
        form.valueChanges.subscribe(val => {
          this.mainForm.controls.refCareAndSupportVO.patchValue(val);
          //console.log(this.mainForm.value);
        })
      )
      this.stepSix.subscribe(form =>
        form.valueChanges.subscribe(val => {
          this.mainForm.controls.refSubmissionVO.patchValue(val);
          //console.log(this.mainForm.value);
        })
      )
     }

     saveExtReferralSubmission(reqBody: any): Observable<any> {
        return this.http.post<any>(`${this.serverApiUrl.API_URL}/referral/externalReferral/submitExternalReferral`, reqBody,
        { headers: { 'Content-Type': 'application/json' } });
    } 
   
    changeParam(param: number) {
    this.paramSource.next(param)
    }
    

    getRefId(){
      if (this.refId == null) {
        console.log("Warning: null refId requested");
      }
      return this.refId;
    }
  
   public setRefId(refId){
      this.refId = refId;
    }
     stepReady(form: FormGroup, part) {
      switch (part) {
        case 'one': { this.startReferralSource.next(form) }
        case 'two': { this.applicantInfoSource.next(form) }
        case 'three': { this.contactInfoSource.next(form) }
        case 'four': { this.schoolWorkSource.next(form) }
        case 'five': { this.careSupportSource.next(form) }
        case 'six': { this.submitReferralSource.next(form) }
      }
    }

    getGenderList(): Observable<any[]> {
      return this.http.get<any[]>(this.serverApiUrl.API_URL + `/api/staticData/externalReferral/getStaticDataValue?dataNameKey=GENDER`);
    }

    getSearchDropdowns(input): Observable<any> {
      return this.http.get<any>(`${this.serverApiUrl.API_URL}/api/staticData/externalReferral/getStaticDataValue?dataNameKey=${input}`, {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    postSearchPerson(applicant: Applicant): Observable<any[]> {
      return this.http.post<any[]>(this.serverApiUrl.API_URL + `/referral/externalReferral/searchPerson`, applicant);
    }
}
