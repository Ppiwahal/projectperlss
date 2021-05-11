import {Component, OnInit, OnDestroy, Inject, DoCheck} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RightnavToggleService } from 'src/app/_shared/services/rightnav-toggle.service';
import { AppealService } from '../services/appeal.service';

@Component({
  selector: 'app-hearing-summary',
  templateUrl: './hearing-summary.component.html',
  styleUrls: ['./hearing-summary.component.scss']
})
export class HearingSummaryComponent implements OnInit, OnDestroy, DoCheck {

  hearingSummary: any;
  hearingSummaryResponse: any;
  isHearingSummary = false;
  languages: any;
  appealStatus: any;
  appealHearingtime: any;
  continuanceReason: any;
  nohStatus: any;
  isApproved = false;
  subscriptions$ = [];

  constructor(private appealService: AppealService,
              private router: Router,
              private rightnavToggleService: RightnavToggleService,
              public dialogRef: MatDialogRef<HearingSummaryComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.language();
    this.getNohStatus();
    this.getAppealStatus();
    this.getHearingSummary();
    this.getContinuanceReason();
  }

  ngDoCheck() {
    if (this.isHearingSummary && this.languages && this.appealStatus && this.nohStatus && this.continuanceReason) {
      this.formatText();
    }
  }

  getContinuanceReason() {
    const ContinuanceReasonSubscriptions$ = this.appealService.getStaticDataValue('CONTINUANCE_REASON').subscribe(response => {
      this.continuanceReason = response;
    });
    this.subscriptions$.push(ContinuanceReasonSubscriptions$);
  }

  getNohStatus() {
    const GetNohStatusSubscriptions = this.appealService.getStaticDataValue('NOH_STATUS').subscribe(response => {
      this.nohStatus = response;
    });
    this.subscriptions$.push(GetNohStatusSubscriptions);
  }

  getAppealStatus() {
    const AppealStatusSubscription$ = this.appealService.getStaticDataValue('APPEAL_STATUS').subscribe(response => {
      this.appealStatus = response;
    });
    this.subscriptions$.push(AppealStatusSubscription$);
  }

  language() {
    const LanguageSubscriptions = this.appealService.getAppealDropdowns('LANGUAGE').subscribe(response => {
      this.languages = response;
    });
    this.subscriptions$.push(LanguageSubscriptions);
  }

  getHearingSummary() {
    const GetHearingSummarySubscriptions$ = this.appealService.getHearingSummary(this.data.appealId).subscribe(response => {
      this.hearingSummaryResponse = response;
      this.isHearingSummary = true;
    });
    this.subscriptions$.push(GetHearingSummarySubscriptions$);
  }

  formatText() {
    this.languages.forEach(element => {
      if (element.code === this.hearingSummaryResponse.interprtLang) {
        this.hearingSummaryResponse.interpreterLanguage = element.value;
      }
    });
    this.appealStatus.forEach(element => {
      if (element.code === this.hearingSummaryResponse.aplStatusCd) {
        this.hearingSummaryResponse.appealStatus = element.value;
      }
    });
    if (this.hearingSummaryResponse.ahrngDtTime) {
      const date = new Date(this.hearingSummaryResponse.ahrngDtTime);
      if (date.getHours() > 12) {
        if (date.getMinutes().toString().length === 1) {
          this.appealHearingtime = (date.getHours() - 12) + ':' + date.getMinutes() + '0 PM';
        } else {
          this.appealHearingtime = (date.getHours() - 12) + ':' + date.getMinutes() + ' PM';
        }
      } else {
        if (date.getMinutes().toString().length === 1) {
          this.appealHearingtime = date.getHours() + ':' + date.getMinutes() + '0 AM';
        } else {
          this.appealHearingtime = date.getHours() + ':' + date.getMinutes() + ' AM';
        }
      }
    }
    if (this.hearingSummaryResponse.rschlngRsnCd) {
      this.continuanceReason.forEach(element => {
        if (this.hearingSummaryResponse.rschlngRsnCd === element.code) {
          this.hearingSummaryResponse.reasonForContinuance = element.value;
        }
      });
    }
    if (this.hearingSummaryResponse.nohStatusCd) {
      this.nohStatus.forEach(element => {
        if (this.hearingSummaryResponse.nohStatusCd === element.code) {
          this.hearingSummaryResponse.nohStatus = element.value;
          if (this.hearingSummaryResponse.nohStatus === 'Approved') {
            this.isApproved = true;
          }
        }
      });
    }
    this.hearingSummary = this.hearingSummaryResponse;
    this.isHearingSummary = false;
  }

  closeDialog() {
    this.dialogRef.close();
  }

  continue() {
    this.getAppellantDetails();
  }

  getAppellantDetails() {
    const GetAppealDetailsSubscriptions = this.appealService.getAppealDetails(this.hearingSummary.aplId).subscribe(response => {
      if (response) {
        this.dialogRef.close();
        const tempObj = {
          aplId: response.aplId ? response.aplId : null,
          paeId: response.paeId ? response.paeId : null,
          applicantName: response.firstName + ' ' + response.lastName,
          prsnId: response.prsnId ? response.prsnId : null,
          refId: response.refId ? response.refId : null
        };
        this.rightnavToggleService.setRightnavFlag(true);
        this.rightnavToggleService.setRightNavCategoryCode('APL');
        this.rightnavToggleService.setRightNavProgramCode('APL');
        this.rightnavToggleService.setRightnavData(tempObj);
        this.router.navigate(['/ltss/appeals/appealsStepper'], { state: { continueHearingSummaryData: response } });
      }
    });
    this.subscriptions$.push(GetAppealDetailsSubscriptions);
  }

  viewDoc() {
    const DocByIdSubscriptions = this.appealService.getDocByDocId(this.hearingSummary.docId).subscribe(response => {
      if (response && response.document) {
        this.debugBase64('data:application/pdf;base64,' + response.document);
      }
    });
    this.subscriptions$.push(DocByIdSubscriptions);
  }

  debugBase64(base64URL) {
    const win = window.open();
    win.document.write('<iframe src="' + base64URL + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>');
  }

  ngOnDestroy() {
    if (this.subscriptions$ && this.subscriptions$.length > 0) {
      this.subscriptions$.forEach(subscription$ => subscription$.unsubscribe());
    }
  }

}
