import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { AppealService } from '../../services/appeal.service';
import * as Constants from '../../../_shared/constants/application.constants';
import * as CryptoJS from 'crypto-js';


const ELEMENT_DATA: any[] = [
  {
    documentName: 'Additional Documents Post NOH',
    isUploaded: true
  }
];


@Component({
  selector: 'app-onsite-outcome',
  templateUrl: './onsite-outcome.component.html',
  styleUrls: ['./onsite-outcome.component.scss']
})
export class OnsiteOutcomeComponent implements OnInit {

  locDeterminationData: any[] = [];
  appealDecision: any[] = [];
  denielReason:any[] = [];
  dataSource: MatTableDataSource<any> = new MatTableDataSource(ELEMENT_DATA);
  columnsToDisplay: string[] = ['documentName','userActions'];
  isUploaded: boolean = true;
  denielSelected: boolean;
  @Output() emitAppealDecision: EventEmitter<any> = new EventEmitter<any>();
  onsiteOutcomeForm: FormGroup;
  startDate = new Date();

  constructor(private appealService: AppealService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    const timeTravelData = localStorage.getItem('TIME_TRAVEL_DATA');
    if(timeTravelData) {
      const timeTravelDataJson = JSON.parse(CryptoJS.AES.decrypt(timeTravelData, Constants.APP_ENC_DECRYPT_KEY).toString(CryptoJS.enc.Utf8));
      console.log("timeTravelDataJson ", timeTravelDataJson);
      if(timeTravelDataJson.timeTravelFlag && timeTravelDataJson.currentDate) {
        this.startDate = new Date(timeTravelDataJson.currentDate);
      }
    }
    this.appealService.getAppealDropdowns('AP_LOCDETERMINATIONS').subscribe(res => {
      this.locDeterminationData = res;
    });
    this.appealService.getAppealDropdowns('DENIAL_REASONS').subscribe(res => {
      this.denielReason = res;
    });
    this.appealService.getAppealDropdowns('APPEAL_DECISION').subscribe(res => {
      this.appealDecision = res;
    });

    this.onsiteOutcomeForm = this.formBuilder.group({
      locationDetermineCd:[''],
      nursOnsiteReviewComments:[''],
      resolutionRsnCd: [''],
      denialRsnCd: [''],
      reviewOriginalPaeSw:[''],
      docSubmittedAplRqstSw:[''],
      safetyReviewedSw:[''],
      safetyNotReviewedSw:[''],
      orignlPaeDenialRightSw:[''],
      atRiskLocationSw:[''],
      comments:['']
    });
  }

  appealDecisinChanged(value){
    this.emitAppealDecision.emit(value);
    if(value === 'HO'){
      this.denielSelected = true
    } else {
      this.denielSelected = false
    }

  }

  
  upload(file: File, element){
    console.log(file);
    element.isUploaded = false;
  }

  removeDoc(element){
    element.isUploaded = true;
  }

  addDocuments(){
    ELEMENT_DATA.push({
      documentName: 'Onsite Assessment',
      isUploaded: true
    })
    this.dataSource = new MatTableDataSource(ELEMENT_DATA);
  }

  submitForm(onsiteOutcomeForm){
    console.log(onsiteOutcomeForm)
  }

}
