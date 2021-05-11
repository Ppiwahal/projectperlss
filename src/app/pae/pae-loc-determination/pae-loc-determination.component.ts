import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomvalidationService } from '../../_shared/utility/customvalidation.service';
import * as customValidation from '../../_shared/constants/validation.constants';
import { Subscription } from 'rxjs/internal/Subscription';
import { PaeService } from 'src/app/core/services/pae/pae.service';
import * as Constants from '../../_shared/constants/application.constants';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-pae-loc-determination',
  templateUrl: './pae-loc-determination.component.html',
  styleUrls: ['./pae-loc-determination.component.scss']
})
export class PaeLocDeterminationComponent implements OnInit {
  pageId: 'PPLOC';
  constructor(private paeService: PaeService) {}

  dataMap: any = [
    ['APPLICANT NAME', 'applicantDetails.firstName|midInitial|lastName'], ['REFERRAL STATUS', 'locData.refStatus'],
    ['PERSON ID', 'locData.personId'], ['PAE ID', 'locData.paeId', 'date'],
    ['DATE OF BIRTH', 'locData.dobDt', "date"], ['PAE STATUS', 'locData.paeStatus'],
    ['SSN', 'locData.ssn'], ['REASSESSMENT DUE DATE', 'locData.reassessmentDueDt'],
    ['ASSIGNED ENTITY', 'locData.assignedEntity'], ['NEXT ACTION REQUIRED', 'locData.nxtActnRequired']
  ];

  dataMap2: any = [
    ['FINANCIAL ELIGIBILITY STATUS', 'financialDetails.finEligibilityStatus'], ['FINANCIAL ELIGIBILITY APPEAL STATUS', 'financialDetails.finEligibilityAppealStatus'],
    ['PREMIUM PAYMENT STATUS', 'financialDetails.premiumPaymentStatus'], ['','']
  ];  

  dataMap3: any = [
    ['PART B SLOT STATUS', 'partBslotDetails.partBslotStatus'], ['PART B SLOT DATE HELD', 'partBslotDetails.partBslotDateHeld'],
    ['PART B SLOT DATE FILLED', 'partBslotDetails.partBslotDateFilled']
  ]; 

  dataMap4: any = [
    ['PART A SLOT STATUS', 'partAslotDetails.partAslotStatus'], ['PART A SLOT DATE HELD', 'partAslotDetails.partAslotDateHeld'],
    ['PART A SLOT DATE FILLED', 'partAslotDetails.partAslotDateFilled']
  ];

  dataMap5: any = [
    ['PART B PAE STATUS', 'partBpaeDetails.partBpaeStatus'], ['ASSESSOR LOC DETERMINATION', 'partBpaeDetails.assessorLOCDetermination'],
    ['REQUESTED EVALUATION FOR PART A', 'partBpaeDetails.requestedEvalForPartA'], 
    ['ASSESSOR NAME (ORG.)', 'partBpaeDetails.assessorName'],  ['SUPERVISOR LOC DETERMINATION', 'partBpaeDetails.supervisorLOCDetermination'],
    ['SUPERVISOR NAME (ORG.)', 'partBpaeDetails.supervisorName']
  ];

  dataMap6: any = [
    ['PART B LOC APPEAL FILED', 'partBlocDetails.partBlocAppealFiled'], 
    ['PART B LOC APPEAL STATUS', 'partBlocDetails.partBlocappealStatus'],
    ['POST APPEAL LOC DETERMINATION', 'partBlocDetails.postAppealLocDetermination'],  
    ['APPEAL RESOLUTION DATE', 'partBlocDetails.appealResolutionDate'],
    ['LTSS APPEAL WORKER', 'partBlocDetails.ltssAppealWorker']
  ];

  dataMap7: any = [
    ['PART A PAE STATUS', 'partAPaeDetails.partApaeStatus'], 
    ['PART A PRIORITIZATION SCORE', 'partAPaeDetails.partAPrioritizationScore'],
    ['ASSESSOR LOC DETERMINATION', 'partAPaeDetails.assessorLOCDetermination'],  
    ['ASSESSOR NAME (ORG.)', 'partAPaeDetails.assessorName'],
    ['PHYSICIAN LOC DETERMINATION', 'partAPaeDetails.physicianLocDetermination'],
    ['PHYSICIAN NAME (ORG.)', 'partAPaeDetails.physicianName'],
    ['LTSS NURSE LOC DETERMINATION', 'partAPaeDetails.ltssNurseLocDetermination'],
    ['LTSS NURSE NAME (ORG.)', 'partAPaeDetails.ltssNurseName']
  ];

  dataMap8: any = [
    ['PART A LOC APPEAL FILED', 'partAlocDetails.partAlocAppealFiled'], 
    ['PART A LOC APPEAL STATUS', 'partAlocDetails.partAlocappealStatus'],
    ['POST APPEAL LOC DETERMINATION', 'partAlocDetails.postAppealLocDetermination'],  
    ['APPEAL RESOLUTION DATE', 'partAlocDetails.appealResolutionDate'],
    ['LTSS APPEAL WORKER', 'partAlocDetails.ltssAppealWorker']
  ];

  dataMap9: any = [
    ['DISENROLLMENT PROGRAM', 'disenrollment1Details.disenrollmentProgram'], 
    ['DISENROLLMENT DATE', 'disenrollment1Details.disenrollmentDate'],
    ['DISENROLLMENT REASON', 'disenrollment1Details.disenrollmentReason'],  
    ['DISENROLLMENT USER', 'disenrollment1Details.disenrollmentUser']
  ];

  dataMap10: any = [
    ['DISENROLLMENT APPEAL FILED', 'disenrollment2Details.appealFiled'], 
    ['DISENROLLMENT APPEAL OUTCOME', 'disenrollment2Details.appealOutcome'],
    ['POST APPEAL LOC DETERMINATION', 'disenrollment2Details.postAppealLocDetermination'],  
    ['APPEAL RESOLUTION DATE', 'disenrollment2Details.appealResolutionDate']
  ];

  fakeData = {
    applicantDetails: {
      firstName: 'George',
      midInitial: 'C',
      lastName: 'Meadows'

    },
    locData: {
      refStatus: 'Complete',
      personId: '1234565',
      paeId: 'PAE687890',
      dobDt: '2000-06-05T17:38:23.936+00:00',
      paeStatus: "Pending Submission",
      ssn: 'XXX-XX-4421',
      nxtActnRequired: 'LTSS NURSE REVIEW',
      reassessmentDueDt: '',
      assignedEntity: 'Amerigroup'
    },
  }

  fakeData2 = {
    financialDetails: {
      finEligibilityStatus: 'Approved',
      finEligibilityAppealStatus: '',
      premiumPaymentStatus: 'Meadows'
    }
  }

  fakeData3 = {
    partBslotDetails: {
      partBslotStatus: 'Held',
      partBslotDateHeld: '03/03/2020',
      partBslotDateFilled: ''
    }
  }

  fakeData4 = {
    partAslotDetails: {
      partAslotStatus: '',
      partAslotDateHeld: '',
      partAslotDateFilled: ''
    }
  }

  fakeData5 = {
    partBpaeDetails: {
      partBpaeStatus: 'Approved',
      assessorLOCDetermination: 'At-Risk Medical',
      requestedEvalForPartA: 'Yes',
      assessorName: 'Tyrone Calico (DIDD)',
      supervisorLOCDetermination: 'At-Risk Medical',
      supervisorName: 'Jon Snow (DIDD)'
    }
  }

  fakeData6 = {
    partBlocDetails: {
      partBlocAppealFiled: '',
      partBlocappealStatus: '',
      postAppealLocDetermination: '',
      appealResolutionDate: '',
      ltssAppealWorker: ''
    }
  }

  fakeData7 = {
    partAPaeDetails: {
      partApaeStatus: 'Approved',
      partAPrioritizationScore: '81',
      assessorLOCDetermination: 'Tier 2 Standard 1',
      assessorName: 'Al Greco (ASCEND)',
      physicianLocDetermination: '',
      physicianName: '',
      ltssNurseLocDetermination: '',
      ltssNurseName: ''
    }
  }

  fakeData8 = {
    partAlocDetails: {
      partAlocAppealFiled: '',
      partAlocappealStatus: '',
      postAppealLocDetermination: '',
      appealResolutionDate: '',
      ltssAppealWorker: ''
    }
  }

  fakeData9 = {
    disenrollment1Details: {
      disenrollmentProgram: '',
      disenrollmentDate: '',
      disenrollmentReason: '',
      disenrollmentUser: ''
    }
  }

  fakeData10 = {
    disenrollment2Details: {
      appealFiled: '',
      appealOutcome: '',
      postAppealLocDetermination: '',
      appealResolutionDate: ''
    }
  }

  subscribed: Array<Subscription> = [];
  showResult: boolean = true;
  startDate = new Date();
  applicantName: string = "Jessica Jones";

  locDeterminationData = [];
  financialData = [];
  partBslotData = [];
  partAslotData = [];
  partBPaeData = [];
  partBlocData = [];
  partAPaeData = [];
  partAlocData = [];
  disenrollment1Data = [];
  disenrollment2Data = [];


  ngOnInit(): void {

    const timeTravelData = localStorage.getItem('TIME_TRAVEL_DATA');
    if(timeTravelData) {
      const timeTravelDataJson = JSON.parse(CryptoJS.AES.decrypt(timeTravelData, Constants.APP_ENC_DECRYPT_KEY).toString(CryptoJS.enc.Utf8));
      console.log("timeTravelDataJson ", timeTravelDataJson);
      if(timeTravelDataJson.timeTravelFlag && timeTravelDataJson.currentDate) {
        this.startDate = new Date(timeTravelDataJson.currentDate);
      }
    }

    this.makeRows(this.fakeData, this.dataMap, this.locDeterminationData);
    this.makeRows(this.fakeData2, this.dataMap2, this.financialData);
    this.makeRowsForSingleColumn(this.fakeData3, this.dataMap3, this.partBslotData);
    this.makeRowsForSingleColumn(this.fakeData4, this.dataMap4, this.partAslotData);
    this.makeRowsForSingleColumn(this.fakeData5, this.dataMap5, this.partBPaeData);
    this.makeRowsForSingleColumn(this.fakeData6, this.dataMap6, this.partBlocData);
    this.makeRowsForSingleColumn(this.fakeData7, this.dataMap7, this.partAPaeData);
    this.makeRowsForSingleColumn(this.fakeData8, this.dataMap8, this.partAlocData);
    this.makeRowsForSingleColumn(this.fakeData9, this.dataMap9, this.disenrollment1Data);
    this.makeRowsForSingleColumn(this.fakeData10, this.dataMap10, this.disenrollment2Data);
  }

  addDashes(x: string) {
    return x === "" ? "\u2508" : x;
  }

  makeRows(data: any, dataMap: any, outData: Array<any>) {
    let row = new Array<any>();
    dataMap.forEach(element => {

      let textValue: string = null;

      try {
        if (element[1].length > 0) {
          let split = element[1].split(".");
          let dataRef = data;
          for (let i = 0; i < split.length - 1; i++) {
            dataRef = dataRef[split[i]];
          }
          let text = [];
          split = split.pop().split("|");
          split.forEach(x => { text.push(dataRef[x]); });
          textValue = text.join(' ');

          if (element[2] && textValue.length > 9 && element[2] == "date") {
            let d = textValue.substring(0, 10).split('-');
            textValue = d[1] + "/" + d[2] + "/" + d[0];
          }
        }
      } catch (e) {
        textValue = "Error: " + element[1];
      }

      row.push({ label: element[0], value: this.addDashes(textValue) });
      if (row.length == 2) {
        outData.push(row);
        row = new Array<any>();
      }
    });
  }

  makeRowsForSingleColumn(data: any, dataMap: any, outData: Array<any>) {
    let row = new Array<any>();
    dataMap.forEach(element => {

      let textValue: string = null;

      try {
        if (element[1].length > 0) {
          let split = element[1].split(".");
          let dataRef = data;
          for (let i = 0; i < split.length - 1; i++) {
            dataRef = dataRef[split[i]];
          }
          let text = [];
          split = split.pop().split("|");
          split.forEach(x => { text.push(dataRef[x]); });
          textValue = text.join(' ');

          if (element[2] && textValue.length > 9 && element[2] == "date") {
            let d = textValue.substring(0, 10).split('-');
            textValue = d[1] + "/" + d[2] + "/" + d[0];
          }
        }
      } catch (e) {
        textValue = "Error: " + element[1];
      }

      row.push({ label: element[0], value: this.addDashes(textValue) });
        outData.push(row);
        row = new Array<any>();
    });
  }

  onSubmit() {
    //tbd
  }
 
  ngOnDestroy() {
    this.subscribed.forEach(subscription => { subscription.unsubscribe(); });
  }
  back(){
    this.paeService.navigateToChildPreviousPage(this.pageId);
  }
}
