import { Component, HostListener, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Form, FormBuilder, FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import * as customValidation from '../../_shared/constants/validation.constants';
import { MatRadioChange, MatRadioButton } from '@angular/material/radio';
import { CustomvalidationService } from '../../_shared/utility/customvalidation.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SafetyDeterminationAdmissionPopupComponent } from 'src/app/_shared/modal/safety-determination-admission-popup/safety-determination-admission-popup.component';
import { PaeSafetyDeterminationSummaryForm } from 'src/app/_shared/model/PaeSafetyDeterminationForm';
import { Pae } from 'src/app/_shared/model/Pae';
import { PaeService } from 'src/app/core/services/pae/pae.service';
import { HttpResponse } from '@angular/common/http';
import { PaeFlowSeq } from '../../_shared/utility/PaeFlowSeq';
import { Router } from '@angular/router';
import { PaeCommonService } from './../../core/services/pae/pae-common/pae-common.service';
import { PaeAcuteOrChronicConditionsComponent } from '../pae-acute-or-chronic-conditions/pae-acute-or-chronic-conditions.component';
import { SavePopupComponent } from 'src/app/savePopup/savePopup.component';
import { ComponentCanDeactivate } from 'src/app/core/helpers/pending-change.guard';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-pae-safety-determination',
  templateUrl: './pae-safety-determination.component.html',
  styleUrls: ['./pae-safety-determination.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class PaeSafetyDeterminationComponent implements OnInit, ComponentCanDeactivate {
  show1 = false;
  show2 = false;
  show3 = false;
  show4 = false;
  show5 = false;
  show6 = false;
  show7 = false;
  show8 = false;
  show9 = false;
  show10 = false;
  show11 = false;
  show12 = false;
  show13 = false;
  show14 = false;
  show15 = false;
  incorrectCode: boolean = false;
  nextPath: string;
  dataSource: any = [];
  filteredData: any = [];
  uniqueCredentialsArray: any = [];
  departure: string;
  paeSafetyDeterminationForm: FormGroup;
  safetyAttestations = [
    { selected: false, text: 'I do NOT believe this individual can be safely served in the community in CHOICES Group 5.', name: 'donotBelieveSw' },
    { selected: false, text: 'I believe this individual CAN be safely served in the community in CHOICES Group 5.', name: 'doBelieveSw' },
    { selected: false, text: 'This safety determination form was completed at the request of the applicant / representative.', name: 'reqApplcntSw' },
  ];

  credentials = [
    { code: "PH", value: "Physician", "activateSW": "Y" },
    { code: "NP", value: "Nurse Practitioner / Advanced Nurse Practitioner", "activateSW": "Y" },
    { code: "PA", value: "Physician Assistant", "activateSW": "Y" },
    { code: "RN", value: "Registered or Licensed Nurse", "activateSW": "Y" },
    { code: "LS", value: "Licensed Social Worker", "activateSW": "Y" },
    { code: "PS", value: "Licensed Clinical Psychologist", "activateSW": "Y" }
  ];
  customValidation = customValidation;
  safetyJustificationList = [];
  pageId: string = 'PPSDF';
  applicantName: any;
  qualifiedAssessorNameMap = new Map();
  isSamePageNavigation: boolean;

  constructor(private fb: FormBuilder,
              private paeService: PaeService,
              private paeCommonService: PaeCommonService,
              private router: Router,
              private customValidationService: CustomvalidationService,
              private dialog: MatDialog)
  { }

  ngOnInit() {

    this.paeSafetyDeterminationForm = this.fb.group({
      // safetyJustifications: [null, [Validators.required]],
      safetyJustifications: [null],
      // credentialsCd: [''],
      // qualifiedAssessorId: ['', [Validators.required, this.customValidationService.specialCharacterValidator()]],
      // qualifiedAssessorName: [''],
      intlctlDisbltySw: ['', [Validators.required]],
      // icapScore: ['', [Validators.required, this.customValidationService.specialCharacterValidator()]],
      icapScore: ['', [this.customValidationService.specialCharacterValidator()]],
      acutyScr2behavSw: [''],
      acutyScr2toiletingSw: [''],
      acutyScr3mobTrnsfrSw: [''],
      acutyScr5Less8Sw: [''],
      archivedDt: [null],
      changPhyclBehvPrimaryCareSw: [''],
      changPhyclBehvSw: [''],
      cmpxChrncSw: [''],
      intelDisMalaIndex12Sw: [''],
      mcoDetemiationGrp5Sw: [''],
      mcoDetemiationGrp3Sw: [''],
      noCriteriaMetGrp5Sw: [''],
      noCriteriaMetGrp3Sw: [''],
      rcntDischargeSw: [''],
      rcntEmergtHospAdmsnSw: [''],
      rcntFallSw: [''],
      acutyScr3orinetSw: [''],
      selfNegliSw: [''],
      doBelieveSw: [''],
      donotBelieveSw: [''],
      reqApplcntSw: [''],
    });
    if (this.paeCommonService.getApplicantName() === null || this.paeCommonService.getApplicantName() === '' || this.paeCommonService.getApplicantName() === undefined){
		this.getApplicantName();
	} else {
		this.applicantName =  this.paeCommonService.getApplicantName();
	}

    if (this.paeCommonService.getPaeId() !== null && this.paeCommonService.getPaeId() !== undefined) {
      this.getSafetyDeterminationForm();
    }

  }

  getFormData() {
    return this.paeSafetyDeterminationForm.controls;
  }

  getApplicantName(){
    this.paeService.getPaeApplicantInformation(this.paeCommonService.getPaeId(),this.pageId).then((response)=> {
      console.log("reponseforName"+JSON.stringify(response.body.firstName));
      this.applicantName =  response.body.firstName+" "+response.body.lastName;
	  this.paeCommonService.setApplicantName(this.applicantName);
    });
  }

  getSafetyDeterminationForm() {
    const localStorageLocal = localStorage.getItem('APP_STORAGE_TOKEN');
    const entityId = JSON.parse(localStorageLocal).entityId;
    const that = this;
    const getQualifier = this.paeService.getQualifierInfo(entityId);
    getQualifier.then(function (getQualifier: HttpResponse<any>) {
      console.log("getQualifier Info===>" + JSON.stringify(getQualifier));
      that.dataSource = getQualifier.body;
      console.log(JSON.stringify(getQualifier.body));
      const key = 'credentialsCd';
      that.uniqueCredentialsArray = [...new Map(getQualifier.body.map(item =>
        [item[key], item])).values()];
      console.log(that.uniqueCredentialsArray);

	  that.qualifiedAssessorNameMap.clear();
		for(const data of that.dataSource){
			that.qualifiedAssessorNameMap.set(data.assessorId, data.firstName + " " + data.lastName);
		}


	  const resp = that.paeService.getSafetyDeterminationForm(that.paeCommonService.getPaeId());
	  resp.then(function(resp: HttpResponse<any>) {
      console.log("response===>" + JSON.stringify(resp));
      that.paeSafetyDeterminationForm.patchValue(resp);

	  for(const items of that.safetyAttestations)
		{

			if(items.name==='doBelieveSw'){
				if(that.getFormData().doBelieveSw.value==='Y'){
					items.selected=true;
				}
			}
			if(items.name==='donotBelieveSw'){
				if(that.getFormData().donotBelieveSw.value==='Y'){
					items.selected=true;
				}
			}
			if(items.name==='reqApplcntSw'){
				if(that.getFormData().reqApplcntSw.value==='Y'){
					items.selected=true;
				}
			}

		}

		that.credChanged(that.getFormData().credentialsCd.value);
		that.getFormData().qualifiedAssessorName.patchValue(that.getFormData().qualifiedAssessorId.value);

    });
    });
  }

  credChanged(value) {
    this.filteredData = [];
    this.filteredData = this.dataSource.filter(item => item.credentialsCd === value);
	console.log(this.filteredData);
  }

  sendingYorN(input: boolean) {
    if (input === true) {
      return 'Y';
    } else if (input === false) {
      return 'N';
    }
  }

  saveSafetyDeterminationForm(showPopup?: boolean) {
    if(this.paeSafetyDeterminationForm.get('intlctlDisbltySw').value === 'Y'){
      this.paeCommonService.setReqIcap(true);
    }
    this.isSamePageNavigation =  true;
    //console.log(this.getFormData().qualifiedAssessorName.value);
    // if(this.getFormData().qualifiedAssessorId.value === this.getFormData().qualifiedAssessorName.value){

		let doBelieveSw='N';
		let donotBelieveSw='N';
		let reqApplcntSw='N';
		for(const items of this.safetyAttestations)
		{
			if(items.selected===true){
				if(items.name==='doBelieveSw'){
					doBelieveSw='Y';
				}
				if(items.name==='donotBelieveSw'){
					donotBelieveSw='Y';
				}
				if(items.name==='reqApplcntSw'){
					reqApplcntSw='Y';
				}
			}
		}

      //const name = this.qualifiedAssessorNameMap.get(this.getFormData().qualifiedAssessorName.value);
	  this.incorrectCode = false;
      console.log("yes");
      const paeSafetyDeterminationFormVO = new PaeSafetyDeterminationSummaryForm(
        this.pageId,
        this.paeCommonService.getPaeId(),
        this.sendingYorN(this.getFormData().acutyScr2behavSw.value),
        this.sendingYorN(this.getFormData().acutyScr2toiletingSw.value),
        this.sendingYorN(this.getFormData().acutyScr3mobTrnsfrSw.value),
        this.sendingYorN(this.getFormData().acutyScr3orinetSw.value),
        this.sendingYorN(this.getFormData().acutyScr5Less8Sw.value),
        null,
        this.sendingYorN(this.getFormData().changPhyclBehvPrimaryCareSw.value),
        this.sendingYorN(this.getFormData().changPhyclBehvSw.value),
        this.sendingYorN(this.getFormData().cmpxChrncSw.value),
        'admin',
        '2021-01-05T00:00:00.000+00:00',
        //this.getFormData().credentialsCd.value,
        doBelieveSw,
        donotBelieveSw,
        this.getFormData().icapScore.value,
        this.sendingYorN(this.getFormData().intelDisMalaIndex12Sw.value),
        this.getFormData().intlctlDisbltySw.value,
        null,
        null,
        this.sendingYorN(this.getFormData().mcoDetemiationGrp3Sw.value),
        this.sendingYorN(this.getFormData().mcoDetemiationGrp5Sw.value),
        this.sendingYorN(this.getFormData().noCriteriaMetGrp3Sw.value),
        this.sendingYorN(this.getFormData().noCriteriaMetGrp5Sw.value),
        //this.getFormData().qualifiedAssessorId.value,
        //name,
        this.sendingYorN(this.getFormData().rcntDischargeSw.value),
        this.sendingYorN(this.getFormData().rcntEmergtHospAdmsnSw.value),
        this.sendingYorN(this.getFormData().rcntFallSw.value),
        '0',
        reqApplcntSw,
        this.sendingYorN(this.getFormData().selfNegliSw.value),
      );

      const response = this.paeService.saveSafetyDeterminationForm(paeSafetyDeterminationFormVO);
      let nextPage = '';
      const that = this;
      response.then(function (response: HttpResponse<any>) {
        nextPage = response.headers.get('next');
        console.log(nextPage);
        response = response.body;
        that.nextPath = PaeFlowSeq[nextPage];
        console.log(that.nextPath);
        if (showPopup) {
          const dialogConfig = new MatDialogConfig();
          dialogConfig.data = { route: 'ltss/pae' };
          // dialogConfig.data = { route: 'ltss/pae' , nextRoute: '/ltss/pae/paeStart/' + this.nextPath };
          dialogConfig.panelClass = 'exp_popup';
          dialogConfig.width = '36vw';
          dialogConfig.height = '20vw';
          that.dialog.open(SavePopupComponent, dialogConfig);
        } else {
          that.router.navigate(['/ltss/pae/paeStart/' + that.nextPath]);
        }
      });
    }
  //   else {
  //     this.incorrectCode = true;
  //     console.log("no");
  //   }

  // }

  back() {
    this.isSamePageNavigation =  true;
    this.paeService.navigateToChildPreviousPage(this.pageId);

  }

  next() {
    this.paeService.navigateToChildNextPage(this.pageId);
  }

  option1() {
    this.show1 = !this.show1;
    if (this.show1) {
      this.show1 = true;
    }
    else {
      this.show1 = false;
    }
  }

  option2() {
    this.show2 = !this.show2;
    if (this.show2) {
      this.show2 = true;
    }
    else {
      this.show2 = false;
    }
  }

  option3() {
    this.show3 = !this.show3;
    if (this.show3) {
      this.show3 = true;
    }
    else {
      this.show3 = false;
    }
  }

  option4() {
    this.show4 = !this.show4;
    if (this.show4) {
      this.show4 = true;
    }
    else {
      this.show4 = false;
    }
  }

  option5() {
    this.show5 = !this.show5;
    if (this.show5) {
      this.show5 = true;
    }
    else {
      this.show5 = false;
    }
  }

  option6() {
    this.show6 = !this.show6;
    if (this.show6) {
      this.show6 = true;
    }
    else {
      this.show6 = false;
    }
  }

  option7() {
    this.show7 = !this.show7;
    if (this.show7) {
      this.show7 = true;
    }
    else {
      this.show7 = false;
    }
  }

  option8() {
    this.show8 = !this.show8;
    if (this.show8) {
      this.show8 = true;
    }
    else {
      this.show8 = false;
    }
  }

  option9() {
    this.show9 = !this.show9;
    if (this.show9) {
      this.show9 = true;
    }
    else {
      this.show9 = false;
    }
  }

  option10() {
    this.show10 = !this.show10;
    if (this.show10) {
      this.show10 = true;
    }
    else {
      this.show10 = false;
    }
  }

  option11() {
    this.show11 = !this.show11;
    if (this.show11) {
      this.show11 = true;
    }
    else {
      this.show11 = false;
    }
  }

  option12() {
    this.show12 = !this.show12;
    if (this.show12) {
      this.show12 = true;
    }
    else {
      this.show12 = false;
    }
  }

  option13() {
    this.show13 = !this.show13;
    if (this.show13) {
      this.show13 = true;
    }
    else {
      this.show13 = false;
    }
    this.dialog.open(PaeAcuteOrChronicConditionsComponent, {
        width: '1200px',
        height: '500px'
    });
  }

  option14() {
    this.show14 = !this.show14;
    if (this.show14) {
      this.show14 = true;
    }
    else {
      this.show14 = false;
    }
  }

  option15() {
    this.show15 = !this.show15;
    if (this.show15) {
      this.show15 = true;
    }
    else {
      this.show15 = false;
    }
  }

  isQualifiedAccessorNameCodeMatch(control: string) {
    //TODO: Logic to check code and name match
    this.paeSafetyDeterminationForm.controls[control].setErrors({ error: true })
    return true;
  }
  isAccessorCodeValid(control: string) {
    //TODO: Logic to check code and name match
    this.paeSafetyDeterminationForm.controls[control].setErrors({ error: true })
    return true;
  }
  isAccessorCodeExpired(control: string) {
    //TODO: Logic to check code and name match
    this.paeSafetyDeterminationForm.controls[control].setErrors({ error: true })
    return true;
  }
  markFormGroupTouched = (formGroup) => {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  };
  callTestModal() {
    // this.dialog.open(SafetyDeterminationAdmissionPopupComponent, {
    //     width: '850px',
    //     height: '500px'
    //   });
    if (this.paeSafetyDeterminationForm.valid) {
      this.saveSafetyDeterminationForm(true)
    }
  }
  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    console.log(this.paeSafetyDeterminationForm)
   return this.isSamePageNavigation ? true : !this.paeSafetyDeterminationForm.dirty;
  }

  resetForm(){
    this.paeSafetyDeterminationForm.reset();
  }
}
