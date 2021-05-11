import { LoaderService } from './../../../../loader/loader.service';
import { CustomvalidationService } from './../../../../_shared/utility/customvalidation.service';
import { LsaFormService } from './../../../../core/services/referral/lsa-form/lsa-form.service';
import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ReferralService } from 'src/app/core/services/referral/referral.service';
import { MatAccordion, MatExpansionPanel } from '@angular/material/expansion';
import * as customValidation from '../../../../_shared/constants/validation.constants';
@Component({
  selector: 'app-lsa-form',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './lsa-form.component.html',
  styleUrls: ['./lsa-form.component.scss']
})
export class LsaFormComponent implements OnInit {

  informantForm: FormGroup;
  submitted = false;
  showHeader = false;
  hideForm = false;
  saveInformantData: any;
  submitLsaForm: any;
  refId: string;
  lsaRqstId: string;
  selfCareData: any;
  subscription1$: Subscription;
  subscription2$: Subscription;
  subscription3$: Subscription;
  subscription4$: Subscription;
  subscriptions: Subscription[] = [];
  getLsaFormRequestData: any = [];
  getSLCRQuestionTypeCd: any = [];
  getRECPQuestionTypeCd: any = [];
  getLERNQuestionTypeCd: any = [];
  getMBLTQuestionTypeCd: any = [];
  getSEDRQuestionTypeCd: any = [];
  getCPIDQuestionTypeCd: any = [];
  getECSLQuestionTypeCd: any = [];
  getLsaQuestionDefault: any = [];
  id: any;
  code: any;
  value: any;
  description: any;
  options: any;
  answerSCCount = 0;
  answerRecpCount = 0;
  answerLernCount = 0;
  answerMbltCount = 0;
  answerSedrCount = 0;
  answerCpidCount = 0;
  answerEcslCount = 0;
  saveScAccordionDisable = true;
  editSCAccordionDisable = false;
  saveRecpAccordionDisable = true;
  editRecpAccordionDisable = false;
  saveLernAccordionDisable = true;
  editLernAccordionDisable = false;
  saveMbltAccordionDisable = true;
  editMbltAccordionDisable = false;
  saveSedrAccordionDisable = true;
  editSedrAccordionDisable = false;
  saveCpidAccordionDisable = true;
  editCpidAccordionDisable = false;
  saveEcslAccordionDisable = true;
  editEcslAccordionDisable = false;
  editInformantDisable = true;
  saveSubmissionForm = true;
  saveInformantDisable = true;
  numberofInformantsCount = 0;
  isAccordionOpen = false;
  isScAnswerSelected = false;
  isRecpAnswerSelected = false;
  isLernAnswerSelected = false;
  isMbltAnswerSelected = false;
  isSedrAnswerSelected = false;
  isCpidAnswerSelected = false;
  isEcslAnswerSelected = false;
  isScAnswerFinished = false;
  isRecpAnswerFinished = false;
  isLernAnswerFinished = false;
  isMbltAnswerFinished = false;
  isSedrAnswerFinished = false;
  isCpidAnswerFinished = false;
  isEcslAnswerFinished = false;
  customValidation = customValidation;
  minDate: Date;
  maxDate: Date;
  submitFormFail: any;
  isLsaFormLoad: boolean = false;

  relationShipCdList = [
    {code: 'AUN', description: 'Aunt', activateSW:'Y'},
    {code: 'BRO', description: 'Brother', activateSW:'Y'},
    {code: 'DAU', description: 'Daughter', activateSW:'Y'},
    {code: 'FAO', description: 'Father', activateSW:'Y'},
    {code: 'FCO', description: 'First cousin', activateSW:'Y'},
    {code: 'GDO', description: 'Granddaughter', activateSW:'Y'},
    {code: 'GFO', description: 'Grandfather', activateSW:'Y'},
    {code: 'GMO', description: 'Grandmother', activateSW:'Y'},
    {code: 'MOO', description: 'Mother', activateSW:'Y'},
    {code: 'NEP', description: 'Nephew', activateSW:'Y'},
    {code: 'NIE', description: 'Niece', activateSW:'Y'},
    {code: 'NRT', description: 'Not related', activateSW:'Y'},
    {code: 'SON', description: 'Son', activateSW:'Y'},
    {code: 'SBR', description: 'Stepbrother', activateSW:'Y'},
    {code: 'SDA', description: 'Stepdaughter', activateSW:'Y'},
    {code: 'SFA', description: 'Stepfather', activateSW:'Y'},
    {code: 'SPO', description: 'Spouse', activateSW:'Y'},
    {code: 'SMO', description: 'Stepmother', activateSW:'Y'},
    {code: 'SSI', description: 'Stepsister', activateSW:'Y'},
    {code: 'SSO', description: 'Stepson', activateSW:'Y'},
    {code: 'UNC', description: 'Uncle', activateSW:'Y'},
    {code: 'RIO', description: 'Relted in another way', activateSW:'Y'},
    {code: 'SIS', description: 'Sister', activateSW:'Y'},
    {code: 'GSO', description: 'Grandson', activateSW:'Y'},
    {code: 'HOS', description: 'Holding out spouse', activateSW:'Y'},
  ];

  informantCountDisplay = [
    {code: 1, description: 'One (1)'},
    {code: 2, description: 'Two (2)'},
    {code: 3, description: 'Three (3)'},
  ];
  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<LsaFormComponent>,
    private fb: FormBuilder,
    private referralService: ReferralService,
    private lsaformService: LsaFormService,
    private customValidator: CustomvalidationService
    ) {

  }
  ngOnInit(): void {
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 119, 0, 1);
    this.maxDate = new Date();
    this.refId = this.referralService.getRefId();
    this.getLsaRequest();
    this.informantForm = this.fb.group({
      numberOfInformants: [
        '',
        [
          Validators.required,
        ],
      ],
      refIntLsaSubmsnVO: this.fb.group ({
        id: '',
        comments: [''],
        comptnDt: [
          '',
          [
            Validators.required,
            // this.customValidator.dateInFuture(),
            // this.customValidator.datePriorToInitialDate()
          ],
        ],
        elecSign: [
          '',
          [
            Validators.required,
          ],
        ],
        qualAssessorNameCd: [
          '',
          [
            Validators.required,
          ],
        ],
        reqPageId: "PRILP"
        }),
      refIntLsaInfrmntVOList: this.fb.array([]),
    })
  }

  @ViewChild('selfCareAccordion', {static: true, read: MatExpansionPanel}) selfCareAccordion: MatExpansionPanel;
  @ViewChild('recpAccordion', {static: true, read: MatExpansionPanel}) recpAccordion: MatExpansionPanel;
  @ViewChild('learnAccordion', {static: true, read: MatExpansionPanel}) learnAccordion: MatExpansionPanel;
  @ViewChild('mobilityAccordion', {static: true, read: MatExpansionPanel}) mobilityAccordion: MatExpansionPanel;
  @ViewChild('sedrAccordion', {static: true, read: MatExpansionPanel}) sedrAccordion: MatExpansionPanel;
  @ViewChild('capacityAccordion', {static: true, read: MatExpansionPanel}) capacityAccordion: MatExpansionPanel;
  @ViewChild('economicAccordion', {static: true, read: MatExpansionPanel}) economicAccordion: MatExpansionPanel;

  closeSelfCareAccordion() {
    this.selfCareAccordion.close();
  }
  closeRecpAccordion() {
    this.recpAccordion.close();
  }

  closeLearnAccordion() {
    this.learnAccordion.close();
  }

  closeMobilityAccordion() {
    this.mobilityAccordion.close();
  }

  closeSedrAccordion() {
    this.sedrAccordion.close();
  }

  closeCapacityAccordion() {
    this.capacityAccordion.close();
  }

  closeEconomicAccordion() {
    this.economicAccordion.close();
  }

  get f() {
    return this.informantForm.controls.refIntLsaSubmsnVO['controls'];
  }

  onChangeInformants(value:number) {
    console.log("informants length on load ", value);
    this.numberofInformantsCount = value || 0;
    let numberOfInformantsOnChange = value || 0;
    if(numberOfInformantsOnChange > 0) {
        this.showHeader = true;
    }
      else {
        this.showHeader = false;
    }
    this.refIntLsaInfrmntVOList().clear();
    this.addInformantsDisplay();
    if(numberOfInformantsOnChange == this.getLsaFormRequestData.refIntLsaInfrmntVOList.length ){
      return false;
    }
    let infromantNewId = this.getLsaFormRequestData.refIntLsaInfrmntVOList.length;
     numberOfInformantsOnChange = numberOfInformantsOnChange - this.getLsaFormRequestData.refIntLsaInfrmntVOList.length;
    for(let i=0; i < numberOfInformantsOnChange; i++) {
      infromantNewId++;
      this.addInformants({
        lsaInfrmntId: infromantNewId,
        reqPageId: '',
        fullName:  '',
        reltshpCd: '',
        id: '',
        deleteFlag: '',
        deleteInformant: false
      });
    }
    console.log("after for loop", this.informantForm.controls.refIntLsaInfrmntVOList['controls'])
    this.saveInformantDisable = false;
  }

  // On load Service when click on LSA form
  getLsaRequest() {
    this.subscription2$ = this.lsaformService
    .getLsaFormRequest(this.refId)
    .subscribe((getLsaFormData) => {
      this.getLsaFormRequestData = getLsaFormData;
      this.isLsaFormLoad = true;
      this.lsaRqstId = this.getLsaFormRequestData.refIntLsaRqstVO.id;
      this.numberofInformantsCount = this.getLsaFormRequestData.informantCount;
      this.informantForm.controls.numberOfInformants.setValue(this.numberofInformantsCount);
      this.informantForm.controls.refIntLsaSubmsnVO['controls'].comments.setValue(this.getLsaFormRequestData.refIntLsaSubmsnVO.comments);
      var completionDate = new Date(this.getLsaFormRequestData.refIntLsaSubmsnVO.comptnDt);
      completionDate.setDate(completionDate.getDate() + 1);
      this.informantForm.controls.refIntLsaSubmsnVO['controls'].comptnDt.setValue(completionDate);
      this.informantForm.controls.refIntLsaSubmsnVO['controls'].elecSign.setValue(this.getLsaFormRequestData.refIntLsaSubmsnVO.elecSign);
      this.informantForm.controls.refIntLsaSubmsnVO['controls'].qualAssessorNameCd.setValue(this.getLsaFormRequestData.refIntLsaSubmsnVO.qualAssessorNameCd);
      this.addInformantsDisplay();
      this.getSelfCareAccordionData();
      this.getReceptiveAccordionData();
      this.getLearningAccordionData();
      this.getMobilityAccordionData();
      this.getSelfDirectionAccordionData();
      this.getCapacityAccordionData();
      this.getEconomicAccordionData();
    });
  this.subscriptions.push(this.subscription2$);
  }

  addInformantsDisplay(){
    for(let i=0; i < this.getLsaFormRequestData.refIntLsaInfrmntVOList.length; i++) {
      this.addInformants(this.getLsaFormRequestData.refIntLsaInfrmntVOList[i]);
      this.showHeader = true;

      this.informantForm.controls.refIntLsaInfrmntVOList['controls'][i].controls['fullName'].disable();
      this.informantForm.controls.refIntLsaInfrmntVOList['controls'][i].controls['reltshpCd'].disable();

    }
  }
  //Display Self-Care Accordion
  getSelfCareAccordionData() {
    for(let questionTypeCd of this.getLsaFormRequestData.refIntLsaQustnVOList){
      if(questionTypeCd.lsaTypeCd === "SLCR"){
        this.answerSCCount += 2;
        this.getSLCRQuestionTypeCd.push({
          "code": questionTypeCd.id,
          "value": questionTypeCd.lsaTypeCd,
          "options": [
            {name: "Observation", value: null, id:'OBS'},
            {name: "Applicant", value: null, id:'APL'}],
          "description": questionTypeCd.qustnsTxt
        })
      }
    }
    this.selfCareInformants('load');

    if(this.getLsaFormRequestData.refIntLsaInfrmntVOList.length > 0 ) {
        this.editInformantDisable = false;
      }

      if(this.getLsaFormRequestData.refIntLsaInfrmntVOList.length > 0 ) {
        this.saveInformantDisable = true;
      }

      for(let answerCode of this.getLsaFormRequestData.refIntLsaRspVOList ){
        for(let i =0; i < this.getSLCRQuestionTypeCd.length; i++){
          if(answerCode.lsaQustnsId == this.getSLCRQuestionTypeCd[i].code){
            for(let k = 0; k < this.getSLCRQuestionTypeCd[i].options.length; k++){
              if(answerCode.infrmntTypeCd == this.getSLCRQuestionTypeCd[i].options[k].id){
                this.getSLCRQuestionTypeCd[i].options[k].value = answerCode.rspCd;
                this.isScAnswerFinished = true;
              }
            }
          }
        }
      }
      if(this.getLsaFormRequestData.refIntLsaRspVOList.length != 0 ) {
        this.isScAnswerSelected = true;
        this.saveScAccordionDisable = false;
        this.editSCAccordionDisable = true;
        this.saveSubmissionForm = true;
      }
  }

  //Display Receptive and Expressive Language Accordion
  getReceptiveAccordionData() {
    for(let questionTypeCd of this.getLsaFormRequestData.refIntLsaQustnVOList){
      if(questionTypeCd.lsaTypeCd === "RECP"){
        this.answerRecpCount += 2;
        this.getRECPQuestionTypeCd.push({
          "code": questionTypeCd.id,
          "value": questionTypeCd.lsaTypeCd,
          "options": [
            {name: "Observation", value: null, id:'OBS'},
            {name: "Applicant", value: null, id:'APL'}],
          "description": questionTypeCd.qustnsTxt
        })
      }
    }
    this.receptiveInformants('load');

      if(this.getLsaFormRequestData.refIntLsaInfrmntVOList.length > 0 ) {
        this.editInformantDisable = false;
      }

      if(this.getLsaFormRequestData.refIntLsaInfrmntVOList.length > 0 ) {
        this.saveInformantDisable = true;
      }

      for(let answerCode of this.getLsaFormRequestData.refIntLsaRspVOList ){
        for(let i =0; i < this.getRECPQuestionTypeCd.length; i++){
          if(answerCode.lsaQustnsId == this.getRECPQuestionTypeCd[i].code){
            for(let k = 0; k < this.getRECPQuestionTypeCd[i].options.length; k++){
              if(answerCode.infrmntTypeCd == this.getRECPQuestionTypeCd[i].options[k].id){
                this.getRECPQuestionTypeCd[i].options[k].value = answerCode.rspCd;
                this.isRecpAnswerFinished = true;
              }
            }
          }
        }
      }
      if(this.getLsaFormRequestData.refIntLsaRspVOList.length != 0 ) {
        this.isRecpAnswerSelected = true;
        this.saveRecpAccordionDisable = false;
        this.editRecpAccordionDisable = true;
        this.saveSubmissionForm = true;
      }
  }

  //Display Learning Accordion
  getLearningAccordionData() {
    for(let questionTypeCd of this.getLsaFormRequestData.refIntLsaQustnVOList){
      if(questionTypeCd.lsaTypeCd === "LERN"){
        this.answerLernCount += 2;
        this.getLERNQuestionTypeCd.push({
          "code": questionTypeCd.id,
          "value": questionTypeCd.lsaTypeCd,
          "options": [
            {name: "Observation", value: null, id:'OBS'},
            {name: "Applicant", value: null, id:'APL'}],
          "description": questionTypeCd.qustnsTxt
        })
      }
    }
    this.getLsaQuestionDefault = this.getLERNQuestionTypeCd;
    this.learningInformants('load');

      if(this.getLsaFormRequestData.refIntLsaInfrmntVOList.length > 0 ) {
        this.editInformantDisable = false;
      }

      if(this.getLsaFormRequestData.refIntLsaInfrmntVOList.length > 0 ) {
        this.saveInformantDisable = true;
      }

      for(let answerCode of this.getLsaFormRequestData.refIntLsaRspVOList ){
        for(let i =0; i < this.getLERNQuestionTypeCd.length; i++){
          if(answerCode.lsaQustnsId == this.getLERNQuestionTypeCd[i].code){
            for(let k = 0; k < this.getLERNQuestionTypeCd[i].options.length; k++){
              if(answerCode.infrmntTypeCd == this.getLERNQuestionTypeCd[i].options[k].id){
                this.getLERNQuestionTypeCd[i].options[k].value = answerCode.rspCd;
                this.isLernAnswerFinished = true;
              }
            }
          }
        }
      }
      if(this.getLsaFormRequestData.refIntLsaRspVOList.length != 0 ) {
        this.isLernAnswerSelected = true;
        this.saveLernAccordionDisable = false;
        this.editLernAccordionDisable = true;
        this.saveSubmissionForm = true;
      }
  }

  //Display Mobility Accordion
  getMobilityAccordionData() {
    for(let questionTypeCd of this.getLsaFormRequestData.refIntLsaQustnVOList){
      if(questionTypeCd.lsaTypeCd === "MBLT"){
        this.answerMbltCount += 2;
        this.getMBLTQuestionTypeCd.push({
          "code": questionTypeCd.id,
          "value": questionTypeCd.lsaTypeCd,
          "options": [
            {name: "Observation", value: null, id:'OBS'},
            {name: "Applicant", value: null, id:'APL'}],
          "description": questionTypeCd.qustnsTxt
        })
      }
    }
    this.getLsaQuestionDefault = this.getMBLTQuestionTypeCd;
    this.mobilityInformants('load');

      if(this.getLsaFormRequestData.refIntLsaInfrmntVOList.length > 0 ) {
        this.editInformantDisable = false;
      }

      if(this.getLsaFormRequestData.refIntLsaInfrmntVOList.length > 0 ) {
        this.saveInformantDisable = true;
      }

      for(let answerCode of this.getLsaFormRequestData.refIntLsaRspVOList ){
        for(let i =0; i < this.getMBLTQuestionTypeCd.length; i++){
          if(answerCode.lsaQustnsId == this.getMBLTQuestionTypeCd[i].code){
            for(let k = 0; k < this.getMBLTQuestionTypeCd[i].options.length; k++){
              if(answerCode.infrmntTypeCd == this.getMBLTQuestionTypeCd[i].options[k].id){
                this.getMBLTQuestionTypeCd[i].options[k].value = answerCode.rspCd;
                this.isMbltAnswerFinished = true;
              }
            }
          }
        }
      }
      if(this.getLsaFormRequestData.refIntLsaRspVOList.length != 0 ) {
        this.isMbltAnswerSelected = true;
        this.saveMbltAccordionDisable = false;
        this.editMbltAccordionDisable = true;
        this.saveSubmissionForm = true;
      }
  }

  //Display Self-Direction Accordion
  getSelfDirectionAccordionData() {
    for(let questionTypeCd of this.getLsaFormRequestData.refIntLsaQustnVOList){
      if(questionTypeCd.lsaTypeCd === "SEDR"){
        this.answerSedrCount += 2;
        this.getSEDRQuestionTypeCd.push({
          "code": questionTypeCd.id,
          "value": questionTypeCd.lsaTypeCd,
          "options": [
            {name: "Observation", value: null, id:'OBS'},
            {name: "Applicant", value: null, id:'APL'}],
          "description": questionTypeCd.qustnsTxt
        })
      }
    }
    this.getLsaQuestionDefault = this.getSEDRQuestionTypeCd;
    this.selfDirectionInformants('load');

      if(this.getLsaFormRequestData.refIntLsaInfrmntVOList.length > 0 ) {
        this.editInformantDisable = false;
      }

      if(this.getLsaFormRequestData.refIntLsaInfrmntVOList.length > 0 ) {
        this.saveInformantDisable = true;
      }

      for(let answerCode of this.getLsaFormRequestData.refIntLsaRspVOList ){
        for(let i =0; i < this.getSEDRQuestionTypeCd.length; i++){
          if(answerCode.lsaQustnsId == this.getSEDRQuestionTypeCd[i].code){
            for(let k = 0; k < this.getSEDRQuestionTypeCd[i].options.length; k++){
              if(answerCode.infrmntTypeCd == this.getSEDRQuestionTypeCd[i].options[k].id){
                this.getSEDRQuestionTypeCd[i].options[k].value = answerCode.rspCd;
                this.isSedrAnswerFinished = true;
              }
            }
          }
        }
      }
      if(this.getLsaFormRequestData.refIntLsaRspVOList.length != 0 ) {
        this.isSedrAnswerSelected = true;
        this.saveSedrAccordionDisable = false;
        this.editSedrAccordionDisable = true;
        this.saveSubmissionForm = true;
      }
    }

  //Display Capacity for Independent Living Accordion
  getCapacityAccordionData() {
    for(let questionTypeCd of this.getLsaFormRequestData.refIntLsaQustnVOList){
      if(questionTypeCd.lsaTypeCd === "CPID"){
        this.answerCpidCount += 2;
        this.getCPIDQuestionTypeCd.push({
          "code": questionTypeCd.id,
          "value": questionTypeCd.lsaTypeCd,
          "options": [
            {name: "Observation", value: null, id:'OBS'},
            {name: "Applicant", value: null, id:'APL'}],
          "description": questionTypeCd.qustnsTxt
        })
      }
    }
    this.getLsaQuestionDefault = this.getCPIDQuestionTypeCd;
    this.capacityInformants('load');

      if(this.getLsaFormRequestData.refIntLsaInfrmntVOList.length > 0 ) {
        this.editInformantDisable = false;
      }

      if(this.getLsaFormRequestData.refIntLsaInfrmntVOList.length > 0 ) {
        this.saveInformantDisable = true;
      }

      for(let answerCode of this.getLsaFormRequestData.refIntLsaRspVOList ){
        for(let i =0; i < this.getCPIDQuestionTypeCd.length; i++){
          if(answerCode.lsaQustnsId == this.getCPIDQuestionTypeCd[i].code){
            for(let k = 0; k < this.getCPIDQuestionTypeCd[i].options.length; k++){
              if(answerCode.infrmntTypeCd == this.getCPIDQuestionTypeCd[i].options[k].id){
                this.getCPIDQuestionTypeCd[i].options[k].value = answerCode.rspCd;
                this.isCpidAnswerFinished = true;
              }
            }
          }
        }
      }
      if(this.getLsaFormRequestData.refIntLsaRspVOList.length != 0 ) {
        this.isCpidAnswerSelected = true;
        this.saveCpidAccordionDisable = false;
        this.editCpidAccordionDisable = true;
        this.saveSubmissionForm = true;
      }
  }

  //Display Economic Self Sufficienty Accordion
  getEconomicAccordionData() {
    for(let questionTypeCd of this.getLsaFormRequestData.refIntLsaQustnVOList){
      if(questionTypeCd.lsaTypeCd === "ECSL"){
        this.answerEcslCount += 2;
        this.getECSLQuestionTypeCd.push({
          "code": questionTypeCd.id,
          "value": questionTypeCd.lsaTypeCd,
          "options": [
            {name: "Observation", value: null, id:'OBS'},
            {name: "Applicant", value: null, id:'APL'}],
          "description": questionTypeCd.qustnsTxt
        })
      }
    }
    this.getLsaQuestionDefault = this.getECSLQuestionTypeCd;
    this.ecomonicInformants('load');

      if(this.getLsaFormRequestData.refIntLsaInfrmntVOList.length > 0 ) {
        this.editInformantDisable = false;
      }

      if(this.getLsaFormRequestData.refIntLsaInfrmntVOList.length > 0 ) {
        this.saveInformantDisable = true;
      }

      for(let answerCode of this.getLsaFormRequestData.refIntLsaRspVOList ){
        for(let i =0; i < this.getECSLQuestionTypeCd.length; i++){
          if(answerCode.lsaQustnsId == this.getECSLQuestionTypeCd[i].code){
            for(let k = 0; k < this.getECSLQuestionTypeCd[i].options.length; k++){
              if(answerCode.infrmntTypeCd == this.getECSLQuestionTypeCd[i].options[k].id){
                this.getECSLQuestionTypeCd[i].options[k].value = answerCode.rspCd;
                this.isEcslAnswerFinished = true;
              }
            }
          }
        }
      }
      if(this.getLsaFormRequestData.refIntLsaRspVOList.length != 0 ) {
        this.isEcslAnswerSelected = true;
        this.saveEcslAccordionDisable = false;
        this.editEcslAccordionDisable = true;
        this.saveSubmissionForm = false;
      }
  }

  refIntLsaInfrmntVOList(): FormArray {
    return this.informantForm.controls.refIntLsaInfrmntVOList as FormArray
  }

  newInformants(row): FormGroup {
    return this.fb.group ({
      reqPageId: row.reqPageId,
      fullName:  row.fullName,
      lsaInfrmntId: row.lsaInfrmntId,
      reltshpCd: row.reltshpCd,
      id: row.id,
      deleteFlag: row.deleteFlag ? row.deleteFlag : 'N',
      deleteInformant: row.deleteInformant ? row.deleteInformant : false
    })
  }

  //Add Informants
  addInformants(row) {
    const addNewInformant =  this.informantForm.controls.refIntLsaInfrmntVOList as FormArray
    addNewInformant.push(this.newInformants(row));
  }

  trackFn(index) {
    return index;
  }

  //remove or delete the informants from the form
  removeInformants(i:number) {
    if(this.getLsaFormRequestData.refIntLsaInfrmntVOList.length == 0) {
      this.editInformantDisable = true;
    }
    this.informantForm.controls.refIntLsaInfrmntVOList['controls'][i].controls['deleteFlag'].setValue('Y');
    this.informantForm.controls.refIntLsaInfrmntVOList['controls'][i].controls['deleteInformant'].setValue(true);
    this.saveInformantDisable = false;
  }

  //clear out the informants
  clearInformants(i:number) {
    console.log("EDIT ", i);
    if(this.getLsaFormRequestData.refIntLsaInfrmntVOList.length == 0) {
      this.editInformantDisable = true;
    }
    this.informantForm.controls.refIntLsaInfrmntVOList['controls'][i].controls['fullName'].enable();
    this.informantForm.controls.refIntLsaInfrmntVOList['controls'][i].controls['reltshpCd'].enable();
    this.saveInformantDisable = false;
  }

  selfCareInformants(eventLoad){
    if(eventLoad == 'load'){
      for(let informantId of this.getLsaFormRequestData.refIntLsaInfrmntVOList ) {
        for(let informantName of this.getSLCRQuestionTypeCd) {
        let id = null;
            if(informantId.lsaInfrmntId == 1){
              id = 'IF1';
              this.answerSCCount++;
            }
            else if(informantId.lsaInfrmntId == 2){
              id = 'IF2';
              this.answerSCCount++;
            }
            else if(informantId.lsaInfrmntId == 3){
              id = 'IF3';
              this.answerSCCount++;
            }
            informantName['options'].push({name:informantId.fullName, value:null, id:id});
          }
        }
    }
    else if(eventLoad == 'submit'){
      for(let informantName of this.getSLCRQuestionTypeCd) {
        informantName['options'] = [];
        informantName['options'].push({name: "Observation", value: null, id:'OBS'});
        informantName['options'].push({name: "Applicant", value: null, id:'APL'});
        for(let informant of this.saveInformantData.refIntLsaInfrmntVOList){
          let id = null;
          if(informant.lsaInfrmntId == 1){
            id = 'IF1';
            this.answerSCCount++;
          }
          else if(informant.lsaInfrmntId == 2){
            id = 'IF2';
            this.answerSCCount++;
          }
          else if(informant.lsaInfrmntId == 3){
            id = 'IF3';
            this.answerSCCount++;
          }
          informantName['options'].push({name:informant.fullName, value:null, id:id});
        }
      }

      for(let answerCode of this.saveInformantData.refIntLsaRspVOList ){
        for(let i =0; i < this.getSLCRQuestionTypeCd.length; i++){
          if(answerCode.lsaQustnsId == this.getSLCRQuestionTypeCd[i].code){
            for(let k = 0; k < this.getSLCRQuestionTypeCd[i].options.length; k++){
              if(answerCode.infrmntTypeCd == this.getSLCRQuestionTypeCd[i].options[k].id){
                this.getSLCRQuestionTypeCd[i].options[k].value = answerCode.rspCd;
              }
            }
          }
        }
      }
    }

  }

  receptiveInformants(eventLoad){
    if(eventLoad == 'load'){
    for(let informantId of this.getLsaFormRequestData.refIntLsaInfrmntVOList ) {
      for(let informantName of this.getRECPQuestionTypeCd) {
      let id = null;
          if(informantId.lsaInfrmntId == 1){
            id = 'IF1';
            this.answerRecpCount++;
          }
          else if(informantId.lsaInfrmntId == 2){
            id = 'IF2';
            this.answerRecpCount++;
          }
          else if(informantId.lsaInfrmntId == 3){
            id = 'IF3';
            this.answerRecpCount++;
          }
          informantName['options'].push({name:informantId.fullName, value:null, id:id});
        }
      }
    }
      else if(eventLoad == 'submit'){
        for(let informantName of this.getRECPQuestionTypeCd) {
          informantName['options'] = [];
          informantName['options'].push({name: "Observation", value: null, id:'OBS'});
          informantName['options'].push({name: "Applicant", value: null, id:'APL'});
          for(let informant of this.saveInformantData.refIntLsaInfrmntVOList){
            let id = null;
            if(informant.lsaInfrmntId == 1){
              id = 'IF1';
              this.answerRecpCount++;
            }
            else if(informant.lsaInfrmntId == 2){
              id = 'IF2';
              this.answerRecpCount++;
            }
            else if(informant.lsaInfrmntId == 3){
              id = 'IF3';
              this.answerRecpCount++;
            }
            informantName['options'].push({name:informant.fullName, value:null, id:id});
          }
        }

        for(let answerCode of this.saveInformantData.refIntLsaRspVOList ){
          for(let i =0; i < this.getRECPQuestionTypeCd.length; i++){
            if(answerCode.lsaQustnsId == this.getRECPQuestionTypeCd[i].code){
              for(let k = 0; k < this.getRECPQuestionTypeCd[i].options.length; k++){
                if(answerCode.infrmntTypeCd == this.getRECPQuestionTypeCd[i].options[k].id){
                  this.getRECPQuestionTypeCd[i].options[k].value = answerCode.rspCd;
                }
              }
            }
          }
        }
      }
  }

  learningInformants(eventLoad){
    if(eventLoad == 'load'){
    for(let informantId of this.getLsaFormRequestData.refIntLsaInfrmntVOList ) {
      for(let informantName of this.getLERNQuestionTypeCd) {
      let id = null;
          if(informantId.lsaInfrmntId == 1){
            id = 'IF1';
            this.answerLernCount++;
          }
          else if(informantId.lsaInfrmntId == 2){
            id = 'IF2';
            this.answerLernCount++;
          }
          else if(informantId.lsaInfrmntId == 3){
            id = 'IF3';
            this.answerLernCount++;
          }
          informantName['options'].push({name:informantId.fullName, value:null, id:id});
        }
      }
    }

    else if(eventLoad == 'submit'){
        for(let informantName of this.getLERNQuestionTypeCd) {
          informantName['options'] = [];
          informantName['options'].push({name: "Observation", value: null, id:'OBS'});
          informantName['options'].push({name: "Applicant", value: null, id:'APL'});
          for(let informant of this.saveInformantData.refIntLsaInfrmntVOList){
            let id = null;
            if(informant.lsaInfrmntId == 1){
              id = 'IF1';
              this.answerLernCount++;
            }
            else if(informant.lsaInfrmntId == 2){
              id = 'IF2';
              this.answerLernCount++;
            }
            else if(informant.lsaInfrmntId == 3){
              id = 'IF3';
              this.answerLernCount++;
            }
            informantName['options'].push({name:informant.fullName, value:null, id:id});
          }
        }

        for(let answerCode of this.saveInformantData.refIntLsaRspVOList ){
          for(let i =0; i < this.getLERNQuestionTypeCd.length; i++){
            if(answerCode.lsaQustnsId == this.getLERNQuestionTypeCd[i].code){
              for(let k = 0; k < this.getLERNQuestionTypeCd[i].options.length; k++){
                if(answerCode.infrmntTypeCd == this.getLERNQuestionTypeCd[i].options[k].id){
                  this.getLERNQuestionTypeCd[i].options[k].value = answerCode.rspCd;
                }
              }
            }
          }
        }
      }
  }

  mobilityInformants(eventLoad){
    if(eventLoad == 'load'){
    for(let informantId of this.getLsaFormRequestData.refIntLsaInfrmntVOList ) {
      for(let informantName of this.getMBLTQuestionTypeCd) {
      let id = null;
          if(informantId.lsaInfrmntId == 1){
            id = 'IF1';
            this.answerMbltCount++;
          }
          else if(informantId.lsaInfrmntId == 2){
            id = 'IF2';
            this.answerMbltCount++;
          }
          else if(informantId.lsaInfrmntId == 3){
            id = 'IF3';
            this.answerMbltCount++;
          }
          informantName['options'].push({name:informantId.fullName, value:null, id:id});
        }
      }
    }
      else if(eventLoad == 'submit'){
        for(let informantName of this.getMBLTQuestionTypeCd) {
          informantName['options'] = [];
          informantName['options'].push({name: "Observation", value: null, id:'OBS'});
          informantName['options'].push({name: "Applicant", value: null, id:'APL'});
          for(let informant of this.saveInformantData.refIntLsaInfrmntVOList){
            let id = null;
            if(informant.lsaInfrmntId == 1){
              id = 'IF1';
              this.answerMbltCount++;
            }
            else if(informant.lsaInfrmntId == 2){
              id = 'IF2';
              this.answerMbltCount++;
            }
            else if(informant.lsaInfrmntId == 3){
              id = 'IF3';
              this.answerMbltCount++;
            }
            informantName['options'].push({name:informant.fullName, value:null, id:id});
          }
        }

        for(let answerCode of this.saveInformantData.refIntLsaRspVOList ){
          for(let i =0; i < this.getMBLTQuestionTypeCd.length; i++){
            if(answerCode.lsaQustnsId == this.getMBLTQuestionTypeCd[i].code){
              for(let k = 0; k < this.getMBLTQuestionTypeCd[i].options.length; k++){
                if(answerCode.infrmntTypeCd == this.getMBLTQuestionTypeCd[i].options[k].id){
                  this.getMBLTQuestionTypeCd[i].options[k].value = answerCode.rspCd;
                }
              }
            }
          }
        }
      }
  }

  selfDirectionInformants(eventLoad){
    if(eventLoad == 'load'){
    for(let informantId of this.getLsaFormRequestData.refIntLsaInfrmntVOList ) {
      for(let informantName of this.getSEDRQuestionTypeCd) {
      let id = null;
          if(informantId.lsaInfrmntId == 1){
            id = 'IF1';
            this.answerSedrCount++;
          }
          else if(informantId.lsaInfrmntId == 2){
            id = 'IF2';
            this.answerSedrCount++;
          }
          else if(informantId.lsaInfrmntId == 3){
            id = 'IF3';
            this.answerSedrCount++;
          }
          informantName['options'].push({name:informantId.fullName, value:null, id:id});
        }
      }
    }
      else if(eventLoad == 'submit'){
        for(let informantName of this.getSEDRQuestionTypeCd) {
          informantName['options'] = [];
          informantName['options'].push({name: "Observation", value: null, id:'OBS'});
          informantName['options'].push({name: "Applicant", value: null, id:'APL'});
          for(let informant of this.saveInformantData.refIntLsaInfrmntVOList){
            let id = null;
            if(informant.lsaInfrmntId == 1){
              id = 'IF1';
              this.answerSedrCount++;
            }
            else if(informant.lsaInfrmntId == 2){
              id = 'IF2';
              this.answerSedrCount++;
            }
            else if(informant.lsaInfrmntId == 3){
              id = 'IF3';
              this.answerSedrCount++;
            }
            informantName['options'].push({name:informant.fullName, value:null, id:id});
          }
        }

        for(let answerCode of this.saveInformantData.refIntLsaRspVOList ){
          for(let i =0; i < this.getSEDRQuestionTypeCd.length; i++){
            if(answerCode.lsaQustnsId == this.getSEDRQuestionTypeCd[i].code){
              for(let k = 0; k < this.getSEDRQuestionTypeCd[i].options.length; k++){
                if(answerCode.infrmntTypeCd == this.getSEDRQuestionTypeCd[i].options[k].id){
                  this.getSEDRQuestionTypeCd[i].options[k].value = answerCode.rspCd;
                }
              }
            }
          }
        }
      }
  }

  capacityInformants(eventLoad){
    if(eventLoad == 'load'){
    for(let informantId of this.getLsaFormRequestData.refIntLsaInfrmntVOList ) {
      for(let informantName of this.getCPIDQuestionTypeCd) {
      let id = null;
          if(informantId.lsaInfrmntId == 1){
            id = 'IF1';
            this.answerCpidCount++;
          }
          else if(informantId.lsaInfrmntId == 2){
            id = 'IF2';
            this.answerCpidCount++;
          }
          else if(informantId.lsaInfrmntId == 3){
            id = 'IF3';
            this.answerCpidCount++;
          }
          informantName['options'].push({name:informantId.fullName, value:null, id:id});
        }
      }
    }
      else if(eventLoad == 'submit'){
        for(let informantName of this.getCPIDQuestionTypeCd) {
          informantName['options'] = [];
          informantName['options'].push({name: "Observation", value: null, id:'OBS'});
          informantName['options'].push({name: "Applicant", value: null, id:'APL'});
          for(let informant of this.saveInformantData.refIntLsaInfrmntVOList){
            let id = null;
            if(informant.lsaInfrmntId == 1){
              id = 'IF1';
              this.answerCpidCount++;
            }
            else if(informant.lsaInfrmntId == 2){
              id = 'IF2';
              this.answerCpidCount++;
            }
            else if(informant.lsaInfrmntId == 3){
              id = 'IF3';
              this.answerCpidCount++;
            }
            informantName['options'].push({name:informant.fullName, value:null, id:id});
          }
        }

        for(let answerCode of this.saveInformantData.refIntLsaRspVOList ){
          for(let i =0; i < this.getCPIDQuestionTypeCd.length; i++){
            if(answerCode.lsaQustnsId == this.getCPIDQuestionTypeCd[i].code){
              for(let k = 0; k < this.getCPIDQuestionTypeCd[i].options.length; k++){
                if(answerCode.infrmntTypeCd == this.getCPIDQuestionTypeCd[i].options[k].id){
                  this.getCPIDQuestionTypeCd[i].options[k].value = answerCode.rspCd;
                }
              }
            }
          }
        }
      }
  }

  ecomonicInformants(eventLoad){
    if(eventLoad == 'load'){
    for(let informantId of this.getLsaFormRequestData.refIntLsaInfrmntVOList ) {
      for(let informantName of this.getECSLQuestionTypeCd) {
      let id = null;
          if(informantId.lsaInfrmntId == 1){
            id = 'IF1';
            this.answerEcslCount++;
          }
          else if(informantId.lsaInfrmntId == 2){
            id = 'IF2';
            this.answerEcslCount++;
          }
          else if(informantId.lsaInfrmntId == 3){
            id = 'IF3';
            this.answerEcslCount++;
          }
          informantName['options'].push({name:informantId.fullName, value:null, id:id});
        }
      }
    }
      else if(eventLoad == 'submit'){
        for(let informantName of this.getECSLQuestionTypeCd) {
          informantName['options'] = [];
          informantName['options'].push({name: "Observation", value: null, id:'OBS'});
          informantName['options'].push({name: "Applicant", value: null, id:'APL'});
          for(let informant of this.saveInformantData.refIntLsaInfrmntVOList){
            let id = null;
            if(informant.lsaInfrmntId == 1){
              id = 'IF1';
              this.answerEcslCount++;
            }
            else if(informant.lsaInfrmntId == 2){
              id = 'IF2';
              this.answerEcslCount++;
            }
            else if(informant.lsaInfrmntId == 3){
              id = 'IF3';
              this.answerEcslCount++;
            }
            informantName['options'].push({name:informant.fullName, value:null, id:id});
          }
        }

        for(let answerCode of this.saveInformantData.refIntLsaRspVOList ){
          for(let i =0; i < this.getECSLQuestionTypeCd.length; i++){
            if(answerCode.lsaQustnsId == this.getECSLQuestionTypeCd[i].code){
              for(let k = 0; k < this.getECSLQuestionTypeCd[i].options.length; k++){
                if(answerCode.infrmntTypeCd == this.getECSLQuestionTypeCd[i].options[k].id){
                  this.getECSLQuestionTypeCd[i].options[k].value = answerCode.rspCd;
                }
              }
            }
          }
        }
      }
  }

  // Informants Save
  onSaveInformants(){
    this.informantForm.controls.refIntLsaInfrmntVOList.enable();
    let postInformants = {refId: this.refId, numberOfInformants: this.numberofInformantsCount};
    postInformants['refIntLsaInfrmntVOList'] = this.informantForm.value.refIntLsaInfrmntVOList;
    this.subscription1$ = this.lsaformService
    .lsaFormInformant(postInformants)
    .subscribe((informantStatus) => {
      this.saveInformantData = informantStatus;
      this.informantForm.controls.refIntLsaInfrmntVOList.disable();
      this.saveInformantDisable = true;
      this.editInformantDisable = false;
      this.lsaRqstId = this.saveInformantData.lsaRqstId;
      this.informantForm.controls['lsaRqstId'].setValue(this.saveInformantData.lsaRqstId);
      this.selfCareInformants('submit');
      this.receptiveInformants('submit');
      this.learningInformants('submit');
      this.mobilityInformants('submit');
      this.selfDirectionInformants('submit');
      this.capacityInformants('submit');
      this.ecomonicInformants('submit');
    });
  this.subscriptions.push(this.subscription1$);
  }

  accordionRequest(reqData) {
    let post = {refId: this.refId, reqPageId:'PRILP'};
    post['refIntLsaRspVOList'] = [];
    for(let informantName of reqData) {
        for(let informant of informantName.options) {
       post['refIntLsaRspVOList'].push({
          lsaRqstId: this.lsaRqstId,
          lsaQustnsId: informantName.code,
          infrmntTypeCd: informant.id,
          rspCd: informant.value,
          reqPageId: 'PRILP'
        });
      }
    }
    return post;
  }

  //self care Accordion Service Save
  saveSelfCareResponse() {
    if(this.editSCAccordionDisable == true){
      this.saveScAccordionDisable = false;
      this.editSCAccordionDisable = false;
      this.isScAnswerSelected = false;
      return false;
    }
    this.subscription3$ = this.lsaformService
    .informantQuestionsResponse(this.accordionRequest(this.getSLCRQuestionTypeCd))
    .subscribe((informantStatus) => {
      this.selfCareData = informantStatus;
      this.togglePanel();
      this.isScAnswerSelected = true;
      this.isScAnswerFinished = true;
      this.saveScAccordionDisable = true;
      this.editSCAccordionDisable = true;
      this.saveSubmissionForm = true;
    });
  this.subscriptions.push(this.subscription3$);
  }

  //receptive accordion service
  saveRecpResponse() {
    if(this.editRecpAccordionDisable  == true){
      this.saveRecpAccordionDisable = false;
      this.editRecpAccordionDisable = false;
      this.isRecpAnswerSelected = false;
      return false;
    }
    this.subscription3$ = this.lsaformService
    .informantQuestionsResponse(this.accordionRequest(this.getRECPQuestionTypeCd))
    .subscribe((informantStatus) => {
      this.selfCareData = informantStatus;
      this.togglePanel();
      this.isRecpAnswerSelected = true;
      this.isRecpAnswerFinished = true;
      this.saveRecpAccordionDisable = true;
      this.editRecpAccordionDisable = true;
      this.saveSubmissionForm = true;
    });
  this.subscriptions.push(this.subscription3$);
  }

  //learning accrdion service
  saveLernResponse() {
    if(this.editLernAccordionDisable == true){
      this.saveLernAccordionDisable = false;
      this.editLernAccordionDisable = false;
      this.isLernAnswerSelected = false;
      return false;
    }
    this.subscription3$ = this.lsaformService
    .informantQuestionsResponse(this.accordionRequest(this.getLERNQuestionTypeCd))
    .subscribe((informantStatus) => {
      this.selfCareData = informantStatus;
      this.togglePanel();
      this.isLernAnswerSelected = true;
      this.isLernAnswerFinished = true;
      this.saveLernAccordionDisable = true;
      this.editLernAccordionDisable = true;
      this.saveSubmissionForm = true;
    });
  this.subscriptions.push(this.subscription3$);
  }

  //mobility accordion service
  saveMbltResponse() {
    if(this.editMbltAccordionDisable == true){
      this.saveMbltAccordionDisable = false;
      this.editMbltAccordionDisable = false;
      this.isMbltAnswerSelected = false;
      return false;
    }
    this.subscription3$ = this.lsaformService
    .informantQuestionsResponse(this.accordionRequest(this.getMBLTQuestionTypeCd))
    .subscribe((informantStatus) => {
      this.selfCareData = informantStatus;
      this.togglePanel();
      this.isMbltAnswerSelected = true;
      this.isMbltAnswerFinished = true;
      this.saveMbltAccordionDisable = true;
      this.editMbltAccordionDisable = true;
      this.saveSubmissionForm = true;
    });
  this.subscriptions.push(this.subscription3$);
  }

  //self-direction accrdion service
  saveSedrResponse() {
    if(this.editSedrAccordionDisable == true){
      this.saveSedrAccordionDisable = false;
      this.editSedrAccordionDisable = false;
      this.isSedrAnswerSelected = false;
      return false;
    }
    this.subscription3$ = this.lsaformService
    .informantQuestionsResponse(this.accordionRequest(this.getSEDRQuestionTypeCd))
    .subscribe((informantStatus) => {
      this.selfCareData = informantStatus;
      this.togglePanel();
      this.isSedrAnswerSelected = true;
      this.isSedrAnswerFinished = true;
      this.saveSedrAccordionDisable = true;
      this.editSedrAccordionDisable = true;
      this.saveSubmissionForm = true;
    });
  this.subscriptions.push(this.subscription3$);
  }

  //capacity accordion service
  saveCpidResponse() {
    if(this.editCpidAccordionDisable == true){
      this.saveCpidAccordionDisable = false;
      this.editCpidAccordionDisable = false;
      this.isCpidAnswerSelected = false;
      return false;
    }
    this.subscription3$ = this.lsaformService
    .informantQuestionsResponse(this.accordionRequest(this.getCPIDQuestionTypeCd))
    .subscribe((informantStatus) => {
      this.selfCareData = informantStatus;
      this.togglePanel();
      this.isCpidAnswerSelected = true;
      this.isCpidAnswerFinished = true;
      this.saveCpidAccordionDisable = true;
      this.editCpidAccordionDisable = true;
      this.saveSubmissionForm = true;
    });
  this.subscriptions.push(this.subscription3$);
  }

  //economic accordion service
  saveEcslResponse() {
    if(this.editEcslAccordionDisable == true){
      this.saveEcslAccordionDisable = false;
      this.editEcslAccordionDisable = false;
      this.isEcslAnswerSelected = false;
      return false;
    }
    this.subscription3$ = this.lsaformService
    .informantQuestionsResponse(this.accordionRequest(this.getECSLQuestionTypeCd))
    .subscribe((informantStatus) => {
      this.selfCareData = informantStatus;
      this.togglePanel();
      this.isEcslAnswerSelected = true;
      this.isEcslAnswerFinished = true;
      this.saveEcslAccordionDisable = true;
      this.editEcslAccordionDisable = true;
      this.saveSubmissionForm = false;
    });
  this.subscriptions.push(this.subscription3$);
  }

  // Accordion Toggle
  togglePanel() {
    this.isAccordionOpen = false;
  }

  onButtonSelection(rspCd, outerIndex, innerIndex, lsaTypeCd){
    if(lsaTypeCd == "SLCR"){
      this.getSLCRQuestionTypeCd[outerIndex].options[innerIndex].value = rspCd;
      this.answerSCCount--;
      if(this.answerSCCount == 0){
        this.saveScAccordionDisable = false;
        this.editSCAccordionDisable = false;
      }
    }
    else if(lsaTypeCd == "RECP"){
      this.getRECPQuestionTypeCd[outerIndex].options[innerIndex].value = rspCd;
      this.answerRecpCount--;
      if(this.answerRecpCount == 0){
        this.saveRecpAccordionDisable = false;
        this.editRecpAccordionDisable = false;
      }
    }
    else if(lsaTypeCd == "LERN"){
      this.getLERNQuestionTypeCd[outerIndex].options[innerIndex].value = rspCd;
      this.answerLernCount--;
      if(this.answerLernCount == 0){
        this.saveLernAccordionDisable = false;
        this.editLernAccordionDisable = false;
      }
    }
    else if(lsaTypeCd == "MBLT"){
      this.getMBLTQuestionTypeCd[outerIndex].options[innerIndex].value = rspCd;
      this.answerMbltCount--;
      if(this.answerMbltCount == 0){
        this.saveMbltAccordionDisable = false;
        this.editMbltAccordionDisable = false;
      }
    }
    else if(lsaTypeCd == "SEDR"){
      this.getSEDRQuestionTypeCd[outerIndex].options[innerIndex].value = rspCd;
      this.answerSedrCount--;
      if(this.answerSedrCount == 0){
        this.saveSedrAccordionDisable = false;
        this.editSedrAccordionDisable = false;
      }
    }
    else if(lsaTypeCd == "CPID"){
      this.getCPIDQuestionTypeCd[outerIndex].options[innerIndex].value = rspCd;
      this.answerCpidCount--;
      if(this.answerCpidCount == 0){
        this.saveCpidAccordionDisable = false;
        this.editCpidAccordionDisable = false;
      }
    }
    else if(lsaTypeCd == "ECSL"){
      this.getECSLQuestionTypeCd[outerIndex].options[innerIndex].value = rspCd;
      this.answerEcslCount--;
      if(this.answerEcslCount == 0){
        this.saveEcslAccordionDisable = false;
        this.editEcslAccordionDisable = false;
      }
    }
   }

   //Last Submit call
  submitLsaFormResponse() {
    this.informantForm.controls.refIntLsaSubmsnVO.enable();
    let submitLsaForm = {
      refId: this.refId,
      lsaRqstId: this.lsaRqstId,
      reqPageId:'PRILP',
    };
    submitLsaForm['refIntLsaSubmsnVO'] = this.informantForm.value.refIntLsaSubmsnVO;
    this.subscription4$ = this.lsaformService
    .lsaFormSubmissionRequest(submitLsaForm)
    .subscribe(informantStatus => {
      this.submitLsaForm = informantStatus;
      this.confirm();
    }, error => {
      this.submitFormFail = error;
    });
    this.subscriptions.push(this.subscription4$);
   }

   close() {
    this.dialog.closeAll();
  }
  confirm() {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    console.log('referral-Lsa form pop up Unsubscribed');
  }
}
