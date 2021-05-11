import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Form, FormBuilder, FormControl, FormGroup, FormArray, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomvalidationService } from '../../_shared/utility/customvalidation.service';
import * as customValidation from '../../_shared/constants/validation.constants';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { PaeFlowSeq } from 'src/app/_shared/utility/PaeFlowSeq';
import { PaeService } from '../../core/services/pae/pae.service';
import { PaeCommonService } from 'src/app/core/services/pae/pae-common/pae-common.service';
import { MedicalDiagnosisService } from 'src/app/core/services/pae/medicalDiagnosis/medical-diagnosis.service';
import { PaeSkilledServicesSummaryService } from 'src/app/core/services/pae/pae-skilled-services/pae-skilled-services-summary/pae-skilled-services-summary.service';
import { MedicalDiagonsis } from '../Diagnosisdata';
import { SavePopupComponent } from 'src/app/savePopup/savePopup.component';
import { DatePipe } from '@angular/common';
import { ComponentCanDeactivate } from 'src/app/core/helpers/pending-change.guard';


@Component({
  selector: 'app-pae-summary',
  templateUrl: './pae-summary.component.html',
  styleUrls: ['./pae-summary.component.scss']
})
export class PaeSummaryComponent implements OnInit, ComponentCanDeactivate {
  referralActivitiesCommunityLivingFormGroup: FormGroup;
  customValidation = customValidation;
  dateOfBirth = '05/04/2010';
  currentAge: any;
  pageId: string;
  applicationDetails: any = {};
  applicationAddress: any = {};
  contactDetails: any = [];
  functionalAssessmentDetails: any = {};
  skilledservicescore: any = [];
  summaryList: any;
  displayedColumnsDiagnosis: string[] = ['medicalDiagnosis', 'persistedMonth', 'expectedMonth'];
  displayedColumnsDiagnosisMed: string[] = ['medicalDiagnosis'];
  medicalDiagnosisDataSource = [];
  meidicalDiagnosis: any = [];
  hideMedicalDiagnosisTab = false;
  totalAnnualCost: any = 0;
  paeId: any;
  backSubscription$: Subscription;
  subscriptions: any;
  selectedMenu: any;
  interprtLang: any;
  emailId: any;
  livingArrangement: any;
  livArrgmntDisplayed: any;
  programRequestedDisplayed: any;
  emailAddress: any;
  homePhone: any;
  cellPhNum: any;
  applicantName: any;
  mapForLivingArrangement = new Map();
  mapForlangList = new Map();
  langList = [
    { code: 'EN', value: 'English', activateSW: 'Y' },
    { code: 'ES', value: 'Spanish', activateSW: 'Y' },
    { code: 'RU', value: 'Russian', activateSW: 'Y' },
    { code: 'OT', value: 'Other', activateSW: 'Y' },
    { code: 'FR', value: 'French', activateSW: 'Y' },
    { code: 'GM', value: 'German', activateSW: 'Y' },
    { code: 'VT', value: 'Vietnamese', activateSW: 'Y' },
    { code: 'LO', value: 'Laotian', activateSW: 'Y' },
    { code: 'AR', value: 'Arabic', activateSW: 'Y' },
    { code: 'KU', value: 'Kurdish', activateSW: 'Y' },
    { code: 'CH', value: 'Chinese', activateSW: 'Y' },
    { code: 'KO', value: 'Korean', activateSW: 'Y' },
    { code: 'AM', value: 'Amharic', activateSW: 'Y' },
    { code: 'GU', value: 'Gujarati', activateSW: 'Y' },
    { code: 'TG', value: 'Tagalog', activateSW: 'Y' },
    { code: 'HI', value: 'Hindi', activateSW: 'Y' },
    { code: 'SC', value: 'Serbo-Croatian', activateSW: 'Y' },
    { code: 'PE', value: 'Persian', activateSW: 'Y' },
    { code: 'NP', value: 'Nepali', activateSW: 'Y' }
  ];
  livingArrangementList = [
    {code: 'LTC', value:'Long-term care facility - e.g., nursing home, ICF', activateSW:'Y'},
    {code: 'HJC', value:'Harold Jordan Center', activateSW:'Y'},
    {code: 'MEN', value:'Mental health residence---behavioral health group home', activateSW:'Y'},
    {code: 'HOM', value:'Family member\'s home/own home', activateSW:'Y'},
    {code: 'NON', value:'Living with non-relative e.g. apartment or house with friend or roommate(s)', activateSW:'Y'},
    {code: 'JAL', value:'Jail', activateSW:'Y'},
    {code: 'FOS', value:'Foster Home', activateSW:'Y'},
    {code: 'MED', value:'Medical Hospital', activateSW:'Y'},
    {code: 'SHL', value:'Homeless/Shelter ', activateSW:'Y'},
    {code: 'HLS', value:'Psychiatric hospital or unit', activateSW:'Y'},
    {code: 'RMH', value:'Regional Mental Health Institute', activateSW:'Y'},
    {code: 'RTC', value:'Residential Treatment Center for youth', activateSW:'Y'},
    {code: 'SCH', value:'Specialized school - e.g., school for deaf, blind', activateSW:'Y'},
    {code: 'OTH', value:'Other', activateSW:'Y'}
  ];
  mapForProgramRequested = new Map();
  programRequestedList = [
    {code: 'CG1', value:'CHOICES Group 1', activateSW:'Y'},
    {code: 'CG2', value:'CHOICES Group 2', activateSW:'Y'},
    {code: 'CG3', value:'CHOICES Group 3', activateSW:'Y'},
    {code: 'EC4', value:'ECF CHOICES Group 4', activateSW:'Y'},
    {code: 'EC5', value:'ECF CHOICES Group 5', activateSW:'Y'},
    {code: 'EC6', value:'ECF CHOICES Group 6', activateSW:'Y'},
    {code: 'EC7', value:'ECF CHOICES Group 7', activateSW:'Y'},
    {code: 'EC8', value:'ECF CHOICES Group 8', activateSW:'Y'},
    {code: 'PACE', value:'PACE', activateSW:'Y'},
    {code: 'ICF', value:'ICF/IID', activateSW:'Y'},
    {code: 'CAC', value:'CAC', activateSW:'Y'},
    {code: 'KBA', value:'Katie Beckett Part A', activateSW:'Y'},
    {code: 'KBB', value:'Katie Beckett Part B', activateSW:'Y'},
    {code: 'SED', value:'Self-Determination Waiver', activateSW:'Y'},
    {code: 'STW', value:'Statewide Waiver', activateSW:'Y'}
  ];
  medDetailsvlaue: Subscription;
  safetyScore: any;
  isSamePageNavigation: boolean;
  constructor(public dialog: MatDialog, private router: Router, private paeService: PaeService, private paeCommonService: PaeCommonService,
              private medicalDiagnosisService: MedicalDiagnosisService, private datePipe: DatePipe,
              private paeSkilledServicesSummaryService: PaeSkilledServicesSummaryService,
              fb: FormBuilder, private customValidator: CustomvalidationService, private medicalDiagonsis: MedicalDiagonsis) {
    this.referralActivitiesCommunityLivingFormGroup = fb.group({
      assessorName: [null],
      assessorCode: [null]
    });
    this.currentAge = this.ageFromDateOfBirthday(this.dateOfBirth);
    console.log(' this.currentAge : ' + this.currentAge);
  }

  public ageFromDateOfBirthday(dateOfBirth: any): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  ngOnInit(): void {
    // this.countPaeSubmissions();
    this.pageId = 'PPSPS';
    this.paeId = this.paeCommonService.getPaeId();
    this.getPaeDiagnosisSummaryData();
    this.getPaeApplicantInfo();
    this.getPaeContactInfoDetails();
    this.getFunctionalAssessmentAcuityScore();
    this.getPaeSkilledSeriveData();
    this.PaeCostNeuCalcAnnualAmt();
    this.getSafetyDeterminationForm();
    this.selectedMenu = this.paeCommonService.getProgramName();
    console.log('this.selectedMenu)===', this.selectedMenu);

    for (const preffereLang of this.langList) {
      this.mapForlangList.set(preffereLang.code, preffereLang.value);
    }
    this.interprtLang = this.mapForlangList.get( this.interprtLang);

    for (const progReqstd of this.programRequestedList) {
      this.mapForProgramRequested.set(progReqstd.code, progReqstd.value);
    }
    this.programRequestedDisplayed = this.mapForProgramRequested.get(this.selectedMenu);
    this.livingArrangement = this.paeCommonService.getLivingArrangement();

    for (const livArrngmnt of this.livingArrangementList) {
      this.mapForLivingArrangement.set(livArrngmnt.code, livArrngmnt.value);
    }
    this.livArrgmntDisplayed = this.mapForLivingArrangement.get(this.livingArrangement);
    console.log(':::::'+ this.livArrgmntDisplayed);
    console.log(JSON.stringify(this.livArrgmntDisplayed));
    this.meidicalDiagnosis = this.medicalDiagonsis.data;
    if (this.paeCommonService.getApplicantName() === null || this.paeCommonService.getApplicantName() === '' || this.paeCommonService.getApplicantName() === undefined){
		this.getApplicantName();
	} else {
		this.applicantName =  this.paeCommonService.getApplicantName();
	}
  }

  getApplicantName(){
    this.paeService.getPaeApplicantInformation(this.paeCommonService.getPaeId(), this.pageId).then((response) => {
      console.log('reponseforName'+ JSON.stringify(response.body.firstName));
      this.applicantName =  response.body.firstName +' '+ response.body.lastName;
	     this.paeCommonService.setApplicantName(this.applicantName);
    });
  }

  getSafetyDeterminationForm(){
    this.paeService.getSafetyDeterminationForm('PAE100000769').then((response) => {
      this.safetyScore = response.countSafety;
      console.log('reponseforName', response, this.safetyScore );
    });
  }

  getPaeDiagnosisSummaryData() {
    this.medicalDiagnosisService
      .getMedicalDiagnosisData(this.paeId)
      .subscribe((diagnosisResponse) => {
        if (diagnosisResponse.medicalDiagnosisCdList) {
          const sampleArrayMedDiagns = [];
          if (diagnosisResponse.medicalDiagnosisCdList[0].persist6MonthsSw === '' &&
            diagnosisResponse.medicalDiagnosisCdList[0].expctd12MonthsSw === '' &&
            diagnosisResponse.medicalDiagnosisCdList[0].medDiagnsCd === '') {
            this.hideMedicalDiagnosisTab = true;
          }
          else {
            this.hideMedicalDiagnosisTab = true;
            for (let i = 0; i < this.meidicalDiagnosis.length; i++) {
              for (let j = 0; j < diagnosisResponse.medicalDiagnosisCdList.length; j++) {
                if (diagnosisResponse.medicalDiagnosisCdList[j].medDiagnsCd == this.meidicalDiagnosis[i].id) {
                  diagnosisResponse.medicalDiagnosisCdList[j].medDiagnsCd = this.meidicalDiagnosis[i].name;
                }

              }
            }
            this.medicalDiagnosisDataSource = diagnosisResponse.medicalDiagnosisCdList;
          }

        }
        console.log('diagnosisResponse.medicalDiagnosisCdList===', diagnosisResponse.medicalDiagnosisCdList);
      });
  }

  getPaeSkilledSeriveData() {
    this.paeSkilledServicesSummaryService
      .getSkilledServicesSummaryScore(this.paeId)
      .subscribe((diagnosisResponse) => {
        this.skilledservicescore = diagnosisResponse.paeSkilledSummaryScoreVOs;
        console.log('skilledservicescore====', diagnosisResponse);
      });
  }

  getPaeApplicantInfo() {
    this.paeService.getPaeApplicantInformation(this.paeId, this.pageId).then((response) => {
      this.applicationDetails = response.body;
      this.emailAddress = this.applicationDetails.emailAddr;
      this.homePhone = this.applicationDetails.homePhNum;
      this.cellPhNum = this.applicationDetails.cellPhNum;
      this.interprtLang = this.applicationDetails.interprtLang;
      this.applicationAddress = this.applicationDetails.addressVO;
      console.log('applicationAddress===>', this.applicationDetails);
    });
  }

  getPaeContactInfoDetails() {
    this.paeService.getPaeApplicantContactInfo(this.paeId).then((response) => {
      this.contactDetails = response.body;
    });
  }


  getFunctionalAssessmentAcuityScore() {
    this.paeService.findPaeFunctionalAssessmentAcuityScore(this.paeId).then((response) => {
      this.functionalAssessmentDetails = response.body;
      console.log('functionalAssessmentDetails===>', response.body);
    });
  }
  covertDate(date: string): string{
    if (date == null || date == ''){
      return '';
    }
    const convertedDate: string = this.datePipe.transform(date, 'MM/dd/yyyy');

    return convertedDate;
  }

  getSSNMask(ssn: string) {
    if (ssn) {
      const formstring = ssn.substr(0, 3) + '-' + ssn.substr(3, 2) + '-' + ssn.substr(5, 4);
      return formstring;
    }
  }
  getPhoneMask(homePhone: string) {
    const num = (homePhone.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3'));
    return num;
  }

  getCellMask(cellPhone: string) {
    const num = (cellPhone.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3'));
    return num;
  }

  PaeCostNeuCalcAnnualAmt() {
    this.paeService.getPaeCostNeuCalcAnnualAmt(
      this.paeId).subscribe((response) => {
        console.log(' PaeCostNeuCalcAnnualAmt response===', response);
        if (response != null) {
          this.totalAnnualCost = response.totalAnnualCost;
        } else {
          this.totalAnnualCost = 0;
        }

      });
  }

  next(showPopup?: boolean) {
    this.isSamePageNavigation =  true;
    if (this.referralActivitiesCommunityLivingFormGroup.valid) {
      if (showPopup) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = { route: 'ltss/pae' };
        // dialogConfig.data = { route: 'ltss/pae' , nextRoute: '/ltss/pae/paeStart/' + this.nextPath };
        dialogConfig.panelClass = 'exp_popup';
        dialogConfig.width = '648px';
        dialogConfig.height = '360px';
        this.dialog.open(SavePopupComponent, dialogConfig);
      } else {
        this.router.navigate(['/ltss/pae/paeStart/paeReviewSubmit']);
      }
    }
  }

  saveAndExit() {
    this.next(true);
  }
  back() {
    this.isSamePageNavigation =  true;
    this.backSubscription$ = this.paeService.getSummaryNextPage(this.paeId, this.pageId).subscribe((response) => {
      const backPath = PaeFlowSeq[response.prevSummaryPage];
      this.router.navigate(['/ltss/pae/paeStart/' + backPath]);
    }, err => {
      console.log(err);
    });
    this.subscriptions.push(this.backSubscription$);
  }

  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    console.log(this.referralActivitiesCommunityLivingFormGroup);
    return this.isSamePageNavigation ? true : !this.referralActivitiesCommunityLivingFormGroup.dirty;
  }

  resetForm(){
    this.referralActivitiesCommunityLivingFormGroup.reset();
  }
}
