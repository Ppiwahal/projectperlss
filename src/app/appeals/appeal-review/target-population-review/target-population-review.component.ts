import { EventEmitter, Input, Output } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import * as Constants from '../../../_shared/constants/application.constants';
import * as CryptoJS from 'crypto-js';

const ELEMENT_DATA: any[] = [
  {
    documentType: 'LSA',
    selection: 'hjhdfj',
    isSelected:false,
    name:'lsaSw'
  },
  {
    documentType: 'IEP',
    selection: 'hjhdfj',
    isSelected:false,
    name:'iepSw'
  },
  {
    documentType: 'FSIQ Prior to the age of 18',
    selection: 'hjhdfj',
    isSelected:false,
    name:'fsiqPriorSw'
  },
  {
    documentType: 'Medical documentation that includes diagnosis',
    selection: 'hjhdfj',
    isSelected:false,
    name:'medDocumentationSw'
  },
  {
    documentType: 'Current FSIQ',
    selection: 'hjhdfj',
    isSelected:false,
    name:'fsiqCurrSw'
  },
  {
    documentType: 'Family attestations describing the individual during the developmental years',
    selection: 'hjhdfj',
    isSelected:false,
    name:'fmlyAttestationSw'
  },
  {
    documentType: 'Other',
    selection: 'hjhdfj',
    isSelected:false,
    name:'othrSw'
  }
];

@Component({
  selector: 'app-target-population-review',
  templateUrl: './target-population-review.component.html',
  styleUrls: ['./target-population-review.component.scss']
})
export class TargetPopulationReviewComponent implements OnInit {

  panelOpenState = false;
  @Input() selectedAppealsRev: any;
  yesOrNo :any[] = [{"code": "Y", "value":"Yes"},{"code": "N", "value":"No"}]
  showDenialReasonSec: boolean;
  dataSource = ELEMENT_DATA;
  displayedColumns: string[] = ['documentType','selection'];
  showOtherDocComments: boolean;
  @Input() appealType: string;
  disableAccordion: boolean = false;
  @Input() toEnableAccordion: any;
  @Input() appealTimely: boolean;
  showTargetPopulatiDenReas: boolean;
  showApprTargetPopu: boolean;
  displayedColumnsforSecondTable = ['documentRequestDate', 'documentStatus','dueDate', 'documentsReturned','requestingUser','userAction'];
  showSecondTable: boolean;
  dataSourceSecond : MatTableDataSource<any> = new MatTableDataSource();
  choiceProgram: string;
  payorSource: string;
  targetPopulationForm: FormGroup;
  @Input() appellantInfo: any;
  showTragetPopulationAccordion: boolean;
  @Input() appealReviewOnLoad: any;
  @Output() emitTargetPopulationSaved: EventEmitter<any> = new EventEmitter<any>();
  secondTabledataSource: any[] = [{
    documentRequestDate: null,
    documentStatus: {code:null, value:null},
    dueDate:null,
    documentsReturned:null,
    requestingUser:null,
    userAction:'CANCEL REQUEST',
    othrComments: null
  }];
  @Input() programTypeCd: any;
  payorSourceCd: any;
  startDate = new Date();


  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    const timeTravelData = localStorage.getItem('TIME_TRAVEL_DATA');
    if(timeTravelData) {
      const timeTravelDataJson = JSON.parse(CryptoJS.AES.decrypt(timeTravelData, Constants.APP_ENC_DECRYPT_KEY).toString(CryptoJS.enc.Utf8));
      console.log("timeTravelDataJson ", timeTravelDataJson);
      if(timeTravelDataJson.timeTravelFlag && timeTravelDataJson.currentDate) {
        this.startDate = new Date(timeTravelDataJson.currentDate);
      }
    }
    this.initializeTargetPopulationForm();
  }

  
  calculateAge(event) {
    let birthDate: any = new Date(event)
    let ageDifMs = Date.now() - birthDate;
    let ageDate = new Date(ageDifMs);
    return  Math.abs(ageDate.getUTCFullYear() - 1970);
  }


  ngOnChanges(){
      if(this.appealType && this.appealReviewOnLoad){
        console.log(this.programTypeCd)
          if(this.appealReviewOnLoad?.linkedRecordPasVO !== null){
              this.payorSourceCd = this.appealReviewOnLoad.linkedRecordPasVO.payorSourceCd;
            }
          // let age = this.calculateAge(this.appellantInfo.dobDt);
          if(this.appealType == 'PA' || this.appealType == 'RF' || 
              (this.appealType == 'PR' && this.programTypeCd == 'CG3' && (this.payorSourceCd == 'ME' || this.payorSourceCd == 'AP'))){
              this.showTragetPopulationAccordion = true
          } else {
              this.showTragetPopulationAccordion = false
          }
      }
      if(this.toEnableAccordion == 'Y'){
          this.disableAccordion = false;
        } else {
          this.disableAccordion = true;
      }
   }
   
  initializeTargetPopulationForm(){
    this.targetPopulationForm = this.formBuilder.group({
      appellantMeetTargPopu:['', Validators.required],
      IntellectualDisability:[false],
      lsaScore:[false],
      noDeficits:[false],
      noChronicPhyDisab:[false],
      otherDocComments:[''],
      dueDatesDocReq:[''],
      additionalInfoReceived:[''],
      addiInfoApproTrgetPopu:[''],
      targetPopuNeedToAddr:['']
    })
   }


  targetPopulationChanged(value){
      if(value === 'N'){
        this.showDenialReasonSec = true;
      } else {
        this.showDenialReasonSec = false;
      }
  }

  documentSelected(element){ 
    element.isSelected = !element.isSelected;
    if(element.documentType === 'Other'){
      if(element.isSelected){
        this.showOtherDocComments = true;
      } else {
        this.showOtherDocComments = false;
      }
    }
 }

 submitRequestForDoc(){
  this.secondTabledataSource = [{
    documentRequestDate: new Date(),
    documentStatus:  {code:'RQ', value:'Request Submitted'},
    dueDate:this.targetPopulationForm.controls.dueDatesDocReq.value,
    documentsReturned:'---',
    requestingUser:'LTSSNurse3',
    userAction:'CANCEL REQUEST',
    othrComments:this.targetPopulationForm.controls.otherDocComments.value,
  }]
  this.dataSourceSecond = new MatTableDataSource(this.secondTabledataSource);
  this.showSecondTable = true;
 }

 cancelRequest(){
    this.secondTabledataSource = [{
      documentRequestDate: null,
      documentStatus: {code:null, value:null},
      dueDate:null,
      documentsReturned:null,
      requestingUser:null,
      userAction:'CANCEL REQUEST'
    }];
    this.showSecondTable = false;
 }

  saveTragetPopulationForm(form){
      if(form.valid){
        let payLoad = {
          "applntMeetTrgtPopltnSw": form.value.appellantMeetTargPopu,
          "trgtPopltnDenialIddSw": form.value.IntellectualDisability ? 'Y': 'N',
          "trgtPopltnDenialLsaSw": form.value.lsaScore? 'Y': 'N',
          "trgtPopltnDenialNodefSw": form.value.noDeficits ? 'Y': 'N',
          "trgtPopltnDenialNoChrncPhyclDisblySw": form.value.noChronicPhyDisab ? 'Y': 'N',
          "othrComments": this.secondTabledataSource[0].othrComments,
          "docsDueDt": this.secondTabledataSource[0].dueDate,
          "aplTrgtPopltnCaptureCd": null,
          "addInfoRcvdSw": form.value.additionalInfoReceived,
          "addInfoApprovedTrgtPopltnSw":form.value.addiInfoApproTrgetPopu,
          "trgtPopltnHrngAddrSw": form.value.targetPopuNeedToAddr,
          "docsRqstDt": null,
          "docsLsaReturnedDt": null,
          "docsLsaStatusCd": null,
          "docsNonLsaReturnedDt": null,
          "docsNonLsaStatusCd": null
        }
        this.dataSource.forEach( data => {
          payLoad[data.name] = data.isSelected ? 'Y' : 'N'
        })
        this.emitTargetPopulationSaved.emit(payLoad)
      }
  }
}
