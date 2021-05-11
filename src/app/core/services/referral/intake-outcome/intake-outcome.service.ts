import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { EnvService } from 'src/app/_shared/utility/env.service';

@Injectable({
  providedIn: 'root'
})
export class IntakeOutcomeService {
  serverApiUrl: any;
  dialogResult = new Subject<any>();
  response: any;

  constructor(
    private http: HttpClient,
    private envService: EnvService
  ) {
    this.serverApiUrl = this.envService.apiUrl();
  }

  private intakeOutcomeId: string;

  public setIntakeOutcomeId(id: string) {
    this.intakeOutcomeId = id;
  }

  public getIntakeOutcomeId(): string {
    return this.intakeOutcomeId;
  }

  private docExists: boolean;

  public setDocExists(exists: boolean) {
    this.docExists = exists;
  }

  public getDocExists(): boolean {
    return this.docExists;
  }

  async getIntakeOutcome(refId: string) {
    const response = await this.http.get<Observable<any>>(this.serverApiUrl.API_URL + '/intakeOutcome/getIntakeOutcome',
      { observe: 'response', params: { refId } }).toPromise();
    return response;
  }

  public setDialogResult(formName: string, result: boolean) {
    this.dialogResult.next({formName: formName, result: result});
  }

  public dialogResult$ = this.dialogResult.asObservable();

  async getLsaTabledata(lsaRqstId: string) {
    return this.http.get<Observable<any>>(this.serverApiUrl.API_URL + '/intakeOutcome/getLSATabledata',
      { observe: 'response', params: { lsaRqstId } }).toPromise();
  }

  async getReferrals(refId: string, personId: string) {
    let params = new HttpParams();
    params = params.append('refId', refId);
    params = params.append('personId', personId);
    const response = await this.http.get<Observable<any>>(this.serverApiUrl.API_URL + '/intakeOutcome/getReferrals',
      { observe: 'response', params: params }).toPromise();
    return response;
  }

  async getRefPlannedTransitionFormData(refIntakeOutcomeId: string) {
    const response = await this.http.get<Observable<any>>(this.serverApiUrl.API_URL + '/intakeOutcome/getRefPlannedTransitionFormData',
      { observe: 'response', params: { refIntakeOutcomeId } }).toPromise();
    return response;
  }

  async getHeader(refId: string, taskId: string) {
    let params = new HttpParams();
    params = params.append('refId', refId);
    params = params.append('taskId', taskId);
    const response = await this.http.get<Observable<any>>(this.serverApiUrl.API_URL + '/referral/intakeAction/header',
      { observe: 'response', params: params }).toPromise();
    return response;
  }

  async lsaFormQuestions(request: any) {
    const response = await this.http.post<Observable<any>>(this.serverApiUrl.API_URL + '/intakeOutcome/lsaFormQuestions', request, { observe: 'response' }).toPromise();
    return response;
  }

  async lsaFormRequest(request: any) {
    const response = await this.http.post<Observable<any>>(this.serverApiUrl.API_URL + '/intakeOutcome/lsaFormQuestions', request, { observe: 'response' }).toPromise();
    return response;
  }

  async refPlannedTransitionForm(request: any) {
    const response = await this.http.post<Observable<any>>(this.serverApiUrl.API_URL + '/intakeOutcome/refPlannedTransitionFormVO', request, { observe: 'response' }).toPromise();
    return response;
  }

  async saveEditIntValidation(request: any) {
    const response = await this.http.post<Observable<any>>(this.serverApiUrl.API_URL + '/intakeOutcome/savEditIntValidation', request, { observe: 'response' }).toPromise();
    return response;
  }

  async updateIntakeOutcome(request: any) {
    const response = await this.http.post<Observable<any>>(this.serverApiUrl.API_URL + '/intakeOutcome/updateintakeOutcome', request, { observe: 'response' }).toPromise();
    return response;
  }

  public program: Array<any> = [
    { code: 'CHOICES', desc: 'CHOICES' },
    { code: 'ECF', desc: 'Employment and Community First CHOICES' },
    { code: 'PACE', desc: 'Program for All-inclusive Care for the Elderly (PACE)' },
    { code: 'ICF', desc: 'Intermediate Care Facility for Individuals with an Intellectual Disability (ICF/IID)' },
    { code: 'CAC', desc: 'Comprehensive Aggregate Cap (CAC)' },
    { code: 'KB', desc: 'Katie Beckett' }
  ];

  public whoIsSubmitting: Array<any> = 
  [{code: "NO", desc:"None","activateSW":"Y"},
  {code: "SE", desc:"Self (person who wants services)","activateSW":"Y"},
  {code: "FR", desc:"Friend","activateSW":"Y"},
  {code: "CLR", desc:"Conservator or legal representative","activateSW":"Y"},
  {code: "FM", desc:"Family Member","activateSW":"Y"},
  {code: "DI", desc:"DIDD","activateSW":"Y"},
  {code: "MCO", desc:"MCO","activateSW":"Y"},
  {code: "DCS", desc:"Department of Child Services","activateSW":"Y"},
  {code: "APS", desc:"APS","activateSW":"Y"},
  {code: "RM", desc:"RMHI","activateSW":"Y"},
  {code: "SP", desc:"Service Provider","activateSW":"Y"},
  {code: "OTH", desc:"Other","activateSW":"Y"}];

  public enrollmentGroup: Array<any> = [
    { code: 'CG1', desc: 'CHOICES Group 1' },
    { code: 'CG2', desc: 'CHOICES Group 2' },
    { code: 'CG3', desc: 'CHOICES Group 3' },
    { code: 'EC4', desc: 'ECF CHOICES Group 4' },
    { code: 'EC5', desc: 'ECF CHOICES Group 5' },
    { code: 'EC6', desc: 'ECF CHOICES Group 6' },
    { code: 'EC7', desc: 'ECF CHOICES Group 7' },
    { code: 'EC8', desc: 'ECF CHOICES Group 8' },
    { code: 'PACE', desc: 'PACE' },
    { code: 'ICF', desc: 'ICF/IID' },
    { code: 'CAC', desc: 'CAC' },
    { code: 'KBA', desc: 'Katie Beckett Part A' },
    { code: 'KBB', desc: 'Katie Beckett Part B' },
    { code: 'SED', desc: 'Self-Determination Waiver' },
    { code: 'STW', desc: 'Statewide Waiver' }
  ];

  public map(tableFrom: any, tableTo: any, fieldFrom: string, fieldTo: string, fieldToColumn: string, renameAs: string = '') {

    let map = {};
    if (!tableFrom) {
      console.log('map error tableFrom is null');
      return;
    }
    if (!tableTo) {
      console.log('map error tableTo is null');
      return;
    }

    for (var i = 0; i < tableFrom.length; i++) {
      let lookUpValue = tableFrom[i][fieldFrom];
      if (lookUpValue) {
        map[lookUpValue] = tableFrom[i][fieldTo];
      }
    }
    for (var i = 0; i < tableTo.length; i++) {
      let value = tableTo[i][fieldToColumn];
      if (value && typeof value !== 'string') {
        for (var j = 0; j < value.length; j++) {
          var newValue = map[value[j]];
          if (newValue) {
            value[j] = newValue;
          }
          else {
            value[j] = value + '*'
          }
        }
      } else if (value) {
        var newValue = map[value];
        tableTo[i][fieldToColumn + renameAs] = newValue ? newValue : value + '*';
      }
    }
  }

  public entity: Array<any> = [
    {
      'type': 'AAAD',
      'code': 'FTAD',
      'desc': 'First Tennessee AAAD',
      'counties': [
        '010',
        '030',
        '034',
        '037',
        '046',
        '082',
        '086',
        '090'
      ],
      'info': 'Area Agency on Aging and Disability'
    },
    {
      'type': 'AAAD',
      'code': 'ETAD',
      'desc': 'East Tennessee AAAD',
      'counties': [
        '001',
        '005',
        '007',
        '013',
        '015',
        '029',
        '032',
        '045',
        '047',
        '053',
        '060',
        '063',
        '073',
        '076',
        '078',
        '087'
      ],
      'info': 'Area Agency on Aging and Disability'
    },
    {
      'type': 'AAAD',
      'code': 'STAD',
      'desc': 'Southeast Tennessee AAAD',
      'counties': [
        '004',
        '006',
        '031',
        '033',
        '056',
        '064',
        '059',
        '070',
        '072',
        '077'
      ],
      'info': 'Area Agency on Aging and Disability'
    },
    {
      'type': 'AAAD',
      'code': 'UCAD',
      'desc': 'Upper 018 AAAD',
      'counties': [
        '008',
        '014',
        '018',
        '021',
        '025',
        '044',
        '054',
        '067',
        '069',
        '071',
        '080',
        '088',
        '089',
        '093'
      ],
      'info': 'Area Agency on Aging and Disability'
    },
    {
      'type': 'AAAD',
      'code': 'GNAD',
      'desc': 'Greater Nashville AAAD',
      'counties': [
        '011',
        '019',
        '022',
        '042',
        '043',
        '061',
        '074',
        '075',
        '081',
        '083',
        '085',
        '094',
        '095'
      ],
      'info': 'Area Agency on Aging and Disability'
    },
    {
      'type': 'AAAD',
      'code': 'SCAD',
      'desc': 'South Central TN AAAD',
      'counties': [
        '002',
        '016',
        '026',
        '028',
        '041',
        '050',
        '051',
        '052',
        '057',
        '058',
        '062',
        '068',
        '091'
      ],
      'info': 'Area Agency on Aging and Disability'
    },
    {
      'type': 'AAAD',
      'code': 'NWAD',
      'desc': 'Northwest AAAD',
      'counties': [
        '003',
        '009',
        '017',
        '023',
        '027',
        '040',
        '048',
        '066',
        '092'
      ],
      'info': 'Area Agency on Aging and Disability'
    },
    {
      'type': 'AAAD',
      'code': 'SWAD',
      'desc': 'Southwest AAAD',
      'counties': [
        '012',
        '020',
        '035',
        '036',
        '038',
        '039',
        '065',
        '055'
      ],
      'info': 'Area Agency on Aging and Disability'
    },
    {
      'type': 'AAAD',
      'code': 'MSAD',
      'desc': 'Aging Commission of the Mid-South AAAD',
      'counties': [
        '024',
        '049',
        '084'
      ],
      'cities': [
        'Memphis',
        'Shelby'
      ],
      'info': 'Area Agency on Aging and Disability'
    },
    {
      'type': 'Contractor',
      'code': 'ASCA',
      'desc': 'scend',
      'counties': null,
      'info': 'Ascend Users'
    },
    {
      'type': 'ICF/IID',
      'code': 'TBD-A',
      'desc': 'TBD-A',
      'counties': null,
      'info': 'The Intermediate Care Facilities for Individuals with an Intellectual Disability'
    },
    {
      'type': 'MCO',
      'code': 'AMG',
      'desc': 'Amerigroup',
      'counties': null,
      'info': 'Managed Care Organization - Amerigroup'
    },
    {
      'type': 'MCO',
      'code': 'BLU',
      'desc': 'BlueCare',
      'counties': null,
      'info': 'Managed Care Organization - BlueCare'
    },
    {
      'type': 'MCO',
      'code': 'UHC',
      'desc': 'UnitedHealthcare',
      'counties': null,
      'info': 'Managed Care Organization - UnitedHealthcare'
    },
    {
      'type': 'Nursing Facilities and Hospitals',
      'code': 'TBD-B',
      'desc': 'TBD-B',
      'counties': null,
      'info': 'Nursing Facilities and Hospitals'
    },
    {
      'type': 'PACE',
      'code': 'ABT',
      'desc': 'Alexian Brothers of Tennessee',
      'counties': null,
      'info': 'Programs of All-Inclusive Care for the Elderly'
    },
    {
      'type': 'Sister State Agencies',
      'code': 'DIDD',
      'desc': 'DIDD',
      'counties': null,
      'info': 'Department of Intellectual and Developmental Disabilities'
    },
    {
      'type': 'Sister State Agencies',
      'code': 'DMHS',
      'desc': 'DMHSAS',
      'counties': null,
      'info': 'Department of Mental Health and Substance Abuse Services'
    },
    {
      'type': 'TennCare',
      'code': 'LTSS',
      'desc': 'LTSS',
      'counties': null,
      'info': 'Long-term services and supports'
    },
    {
      'type': 'TennCare',
      'code': 'TRO',
      'desc': 'TennCare - Read Only',
      'counties': null,
      'info': 'Other TennCare Users'
    },
    {
      'type': 'TennCare',
      'code': 'MSVC',
      'desc': 'Member Services',
      'counties': null,
      'info': 'TennCare Member Services'
    },
    {
      'type': 'TennCare',
      'code': 'OGC',
      'desc': 'OGC',
      'counties': null,
      'info': 'Office of General Counsel'
    }
  ];

}
