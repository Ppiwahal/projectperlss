import { Component, ComponentFactoryResolver, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-appeals-review-of-onsite',
  templateUrl: './appeals-review-of-onsite.component.html',
  styleUrls: ['./appeals-review-of-onsite.component.scss']
})
export class AppealsReviewOfOnsiteComponent implements OnInit {

  @Input() appealReviewAplId: any;
  isCorrectionReqOnsite: boolean = true;
  appealDecisionEmittedVal: any;
  showSubmit: boolean;

  constructor() { }

  ngOnInit(): void {
    console.log(this.appealReviewAplId)
  }

  ngOnChanges(){
    console.log(this.appealReviewAplId)
  }

  emitOnsiteAssesCorrection(event){
    if(event === 'Y'){
      this.isCorrectionReqOnsite = true;
    } else {
      this.isCorrectionReqOnsite = false;
    }
  }


  emitAppealDecision(value){
    if(value === "HO"){
      this.showSubmit = true;
    } else {
      this.showSubmit = false;
    }
}
}

let reviewOfOnsiteOnLoad = {
  "appealOnsiteAssesmentResponseVO": {
      "onholdRsnCd": "UC",
      "onholdDeniedComments": null,
      "onsiteAssmntSw": "Y",
      "faceFaceAssmntSw": "Y",
      "finalLocEligDeterSw": "Y",
      "safetyRefFormSw": "Y",
      "addInfoComments": "Srav testing",
      "onsiteDueDt": "2021-02-05",
      "onsiteStatusCd": "ET",
      "createdBy": "admin",
      "createdDt": "2021-01-28T00:05:40.434+00:00",
      "lastModifiedDt": "2021-02-15T18:02:24.665+00:00",
      "onsiteReturnedDt": "2021-01-27",
      "amendedDt": null,
      "appealOnSiteAssesmentHstryResponseVOs": [],
      "aplNursHrngAddDocVO": null,
      "appealOnsiteEvaluationVO": null,
      "appealOnsiteSafetyJustificationVOs": [
          {
              "id": 91765,
              "safetyJustCrtrCd": "OR",
              "safetyDtls": "string",
              "docsUploadedSw": null,
              "infoObtainedSw": null,
              "safetyJustReqByLtssSw": "Y"
          }
      ],
      "appealOnsiteAssesmentResultsVO": null,
      "onholdConctrNotes": "string",
      "onholdApproveSw": null
  },
  "totalNofbusinessDaysForOnsiteCompletion": 1,
  "totalNofbusinessDaysOutOfCompliance": 0,
  "appealOnsiteAssesmentReviewResponseVO": {
      "corctnRqstdSw": "N",
      "agreeAcutyScoreCd": null,
      "corctnComments": null,
      "corctnReturnedDt": "2021-01-27",
      "corctnRqstdDt": null
  },
  "appealOnsiteReviewTargetPopResponseVO": {
      "orTrgtPopltnHrngAddrSw": "Y",
      "orApplntMeetTrgtPopltnSw": "Y",
      "orTrgtPopltnDenialIddSw": "Y",
      "orTrgtPopltnDenialLsaSw": "Y",
      "orTrgtPopltnDenialNodefSw": "Y",
      "orTrgtPopltnDenialNoChrncPhyclDisblySw": "Y",
      "orAddInfoRcvdSw": "Y",
      "orAddInfoApprovedTrgtPopltnSw": "Y",
      "aplTrgtPopltnCaptureCd": null,
      "trgtPopltnHrngAddrSw": "Y",
      "applntMeetTrgtPopltnSw": "N",
      "trgtPopltnDenialIddSw": null,
      "trgtPopltnDenialLsaSw": null,
      "trgtPopltnDenialNodefSw": "N",
      "trgtPopltnDenialNoChrncPhyclDisblySw": "N",
      "addInfoRcvdSw": "Y",
      "addInfoApprovedTrgtPopltnSw": "Y"
  },
  "locationDetermineCd": "ARD",
  "nursOnsiteReviewComments": "string",
  "appealResolutionResponseVO": {
      "resolutionRsnCd": "AP",
      "denialRsnCd": "TNM"
  },
  "aplNursHrngRefncFormResponseVO": null,
  "aplNursHrngAddDocResponseVO": null
}