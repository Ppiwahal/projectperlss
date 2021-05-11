import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { AppealService } from '../../services/appeal.service';
import * as customValidation from '../../../_shared/constants/validation.constants';

const ELEMENT_DATA: any[] = [];

@Component({
  selector: 'app-onsite-assessment-request',
  templateUrl: './onsite-assessment-request.component.html',
  styleUrls: ['./onsite-assessment-request.component.scss']
})
export class OnsiteAssessmentRequestComponent implements OnInit {

  panelOpenState = false;
  yesOrNo :any[] = [{"code": "Y", "value":"Yes"},{"code": "N", "value":"No"}];
  showTennCareContrReq: boolean;
  showSafJustiInfo: boolean;
  displayedColumns: string[] = ['safJustificationCriteria','informatinRequired', 'userActions'];
  safetyJustificationInfoData: any[] = [];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  justificationCriteria: any[] = [];
  showTable: boolean;
  @Output() emitOnsiteAssessmentRequest: EventEmitter<any> = new EventEmitter<any>();
  @Input() appealType: string;
  disableAccordion: boolean = true;
  @Input() toEnableAccordion: any;
  @Input() appealTimely: boolean;
  passrLevel: string;
  payorSource: string;
  showOnsiteAssessmentAccordion: boolean;
  @Input() appealReviewOnLoad: any; 
  onsiteAssessmentRequestForm: FormGroup;
  customValidation: any = customValidation;
  isSubmitted: boolean;
  @Output() emitOnSubmitOnAssessmentRequest: EventEmitter<any> = new EventEmitter<{value:boolean, res:any}>();
  @Input() enableOnsiteAssessment: any;
  @Input() appealId: any;


  pasrr_reason: any = [{"name": "HE", "value":"Level I Positive","activateSW":"Y"},
  {"name": "LC", "value":"Level II- LOC","activateSW":"Y"},
  {"name": "NC", "value":"Level II- Non LOC","activateSW":"Y"}]
  payor_source: any = [{"code": "HS", "value":"Hospice","activateSW":"Y"},
  {"code": "MD", "value":"Medicaid","activateSW":"Y"},
  {"code": "ME", "value":"Medicare","activateSW":"Y"},
  {"code": "AP", "value":"Medicaid Pending","activateSW":"Y"},
  {"code": "SP", "value":"Self-pay/ Private","activateSW":"Y"}]
  rep_verification:any = [{"name": "HE", "value":"Medicaid/Medicaid pending -denied NF LOC and at risk LOC","activateSW":"Y"},
  {"name": "DC", "value":"Medicaid/Medicaid pending-denied NF LOC approved at risk LOC with-out end date","activateSW":"Y"},
  {"name": "RS", "value":"Medicaid/Medicaid pending-denied NF LOC approved at risk LOC with end date","activateSW":"Y"},
  {"name": "TL", "value":"Denied LOC (Non Medicaid or Non Medicaid Pending)","activateSW":"Y"},
  {"name": "SL", "value":"PASRR- Approved NF services with SS","activateSW":"Y"},
  {"name": "DE", "value":"PASRR- Approved NF services with NO SS","activateSW":"Y"},
  {"name": "LC", "value":"PASRR- Approved NF services with SS Short Term","activateSW":"Y"},
  {"name": "NC", "value":"PASRR- Approved NF services with NO SS Short Term","activateSW":"Y"},
  {"name": "HE", "value":"PASRR-Denied- Requires Inpatient Psychiatric Services","activateSW":"Y"},
  {"name": "DC", "value":"PASRR-Resident Review Approved Cont. Stay 30 month rule","activateSW":"Y"},
  {"name": "RS", "value":"Level I Positive- 30 Day Hosp Exemption","activateSW":"Y"},
  {"name": "TL", "value":"Level I Positive- 60 Day Convalescence","activateSW":"Y"},
  {"name": "SL", "value":"Level I Positive- Respite","activateSW":"Y"},
  {"name": "DE", "value":"Level I Positive- Terminal Illness","activateSW":"Y"},
  {"name": "SL", "value":"Level I Positive- Sever Illness","activateSW":"Y"},
  {"name": "DE", "value":"Level I Positive- Dementia Exempt","activateSW":"Y"},
  {"name": "OT", "value":"Other","activateSW":"Y"}]
  

  constructor(private appealService: AppealService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {

    this.onsiteAssessmentRequestForm = this.formBuilder.group({
      onsiteAssmntSw:[''],
      faceFaceAssmntSw:['Y'],
      finalLocEligDeterSw:['Y'],
      safetyRefFormSw:[''],
      addInfoComments:['', Validators.required],
      aplOnsiteSafetyJustificationRequestVOs: this.formBuilder.array([])
    });


    console.log(this.appealType)
    this.appealService.getAppealDropdowns('SAFETYJUST_CRITERIA').subscribe(res => {
      this.justificationCriteria = res.sort(function (a, b) {
        return a.value < b.value ? -1 : 1;
      });
    });
  }

  getFormData() {
    return this.onsiteAssessmentRequestForm.controls;
  }

  get safteyJustificationArray(){
    return this.onsiteAssessmentRequestForm.get('aplOnsiteSafetyJustificationRequestVOs') as FormArray;
  }

  ngOnChanges(){
    if(this.appealType && this.appealReviewOnLoad){
      if(this.appealType == 'PA' || 
        (this.appealType === 'PR' && this.appealReviewOnLoad.linkedRecordPasVO.pasrrRsnCd === 'LC' && (this.appealReviewOnLoad.linkedRecordPasVO.payorSourceCd === "MD" || this.appealReviewOnLoad.linkedRecordPasVO.payorSourceCd === "AP")) || 
        (this.appealType === 'PR' && this.appealReviewOnLoad.linkedRecordPasVO.pasrrRsnCd === 'NC')){
          this.showOnsiteAssessmentAccordion = true;
        } else {
          this.showOnsiteAssessmentAccordion = false;
        }
    }

      if(this.toEnableAccordion == 'N'){
        this.disableAccordion = false;
      } else {
        this.disableAccordion = true;
      }

      if(this.enableOnsiteAssessment){
        this.disableAccordion = false;
      }
  }

  onsiteAssessReqChange(value){
    if(value === 'Y'){
      this.showTennCareContrReq = true;
      this.emitOnsiteAssessmentRequest.emit(false)
    } else {
      this.showTennCareContrReq = false;
      this.emitOnsiteAssessmentRequest.emit(true)
    }
  }

  safetyRefFormChecked(value){
    if(value.checked){
      this.showSafJustiInfo = true;
    } else {
      this.showSafJustiInfo = false;
      this.showTable = false;
    }
  }

  onAddCriteriaClick(){
    this.showTable= true;
    this.safteyJustificationArray.push(this.formBuilder.group({
          safetyJustCrtrCd:['', Validators.required],
          safetyDtls: ['', Validators.required]
    }));
    this.safetyJustificationInfoData.push({constant:'x'})
    this.safetyJustificationInfoData.forEach( (data, i) => {
      data.index = i;
    })
    this.dataSource = new MatTableDataSource(this.safetyJustificationInfoData);
  }

  edit(element){
    console.log(element)
  }

  delete(element){
    this.safteyJustificationArray.removeAt(element.index);
    const newArray = [];
    this.safetyJustificationInfoData.forEach( data => {
     if(  element.index !== data.index){
        newArray.push(data)
     } 
    })
    this.safetyJustificationInfoData = newArray;
    this.dataSource = new MatTableDataSource(this.safetyJustificationInfoData);
    if(this.safetyJustificationInfoData.length === 0){
      this.showTable= false;
    }
  }

  saveOnsiteAssessmentRequest(form){
    this.isSubmitted = true;
    let payLoad = form.value;
    if(payLoad.safetyRefFormSw){
      payLoad.safetyRefFormSw = 'Y'
    } else {
      payLoad.safetyRefFormSw = 'N'
    }
    if(form.valid){
      this.appealService.saveReviewOnsiteAssessmentRequest(this.appealId, payLoad).subscribe(res => {
        this.emitOnSubmitOnAssessmentRequest.emit({value:true, res:res})
      });
    }
  }

}
