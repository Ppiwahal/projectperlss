import { Component, Input, OnChanges, OnInit } from '@angular/core';

@Component({
  selector: 'app-appellant-info',
  templateUrl: './appellant-info.component.html',
  styleUrls: ['./appellant-info.component.scss']
})
export class AppellantInfoComponent implements OnInit, OnChanges {

  @Input() appellantInfo: any;
  @Input() appealStartData: any;
  @Input() appellantInfoStatus: any;

  programType: any;
  cobStatus: any;
  appealType: any;
  onsiteAssessmentStatus: any;
  appealHearingStatus: any;
  appealStatus: any;
  showAppealDateFrmStartScrn: boolean;
  appealReceivedtDate: any;

  constructor() { }

  ngOnInit() { }

  ngOnChanges() {
    if (this.appealStartData) {
      this.showAppealDateFrmStartScrn = true;
      if (this.appealStartData.filingMethod === 'PH') {
        this.appealReceivedtDate = new Date();
      } else if (this.appealStartData.filingMethod === 'FX' || this.appealStartData.filingMethod === 'ML') {
        this.appealReceivedtDate = new Date(this.appealStartData.appealRecievedDate);
      } else {
        this.showAppealDateFrmStartScrn = false;
      }
    } else {
      this.showAppealDateFrmStartScrn = false;
    }
    if (this.appellantInfo && Object.keys(this.appellantInfoStatus).length !== 0) {
      this.formatData();
    }
  }

  formatData() {
    this.appellantInfoStatus.programType.forEach(data => {
      if (this.appellantInfo.programType === data.code) {
        this.programType = data.value;
      }
    });
    this.appellantInfoStatus.cobStatus.forEach(data => {
      if (this.appellantInfo.cobStatus === data.code) {
        this.cobStatus = data.value;
      }
    });

    this.appellantInfoStatus.appealType.forEach(data => {
      if (this.appellantInfo.aplTypCd === data.code) {
        this.appealType = data.value;
      }
    });

    this.appellantInfoStatus.onsiteAssessmentStatus.forEach(data => {
      if (this.appellantInfo.onsiteAssmnt === data.code) {
        this.onsiteAssessmentStatus = data.value;
      }
    });

    this.appellantInfoStatus.appealHearingStatus.forEach(data => {
      if (this.appellantInfo.aplHearing === data.code) {
        this.appealHearingStatus = data.value;
      }
    });
    this.appellantInfoStatus.appealStatus.forEach(data => {
      if (this.appellantInfo.aplStatus === data.code) {
        this.appealStatus = data.value;
      }
    });
    if (this.appellantInfo.aplTypeCd) {
      if (this.appellantInfo.aplTypCd === 'EN' || this.appellantInfo.aplTypCd === 'DE' || this.appellantInfo.aplTypCd === 'PA') {
        this.appellantInfo.linkedRecord = this.appellantInfo.paeId;
      } else if (this.appellantInfo.aplTypCd === 'PR') {
        if (this.appellantInfo.clientId) {
          this.appellantInfo.linkedRecord = this.appellantInfo.clientId;
        } else if (this.appellantInfo.episodeId) {
          this.appellantInfo.linkedRecord = this.appellantInfo.episodeId;
        } else {
          this.appellantInfo.linkedRecord = null;
        }
      } else if (this.appellantInfo.aplTypCd === 'RF') {
        this.appellantInfo.linkedRecord = this.appellantInfo.refId;
      } else {
        this.appellantInfo.linkedRecord = null;
      }
    }
  }

}
