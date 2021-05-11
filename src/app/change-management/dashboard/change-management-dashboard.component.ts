import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChangeManagementService } from '../../core/services/change-management/change-management.service';
@Component({
  selector: 'app-change-management-dashboard',
  templateUrl: './change-management-dashboard.component.html',
  styleUrls: ['./change-management-dashboard.component.scss']
})
export class ChangeManagementDashboardComponent implements OnInit {
  changeMgnt: any;
  personPhase: any[];
  prgoramCD: any;
  prgoramCd: any;
  hidden: boolean;
  localStorageLocal = localStorage.getItem('PHASE');
  phaseName = JSON.parse(this.localStorageLocal).phaseName;
  constructor(
    private router: Router, private changeManagementService: ChangeManagementService
  ) { }
  subscriptions$: any[] = [];
  public data: any;
  public buttonData: any[] = [];

  status: any = {
    isLtssGroup: true
  };

  ngOnInit(): void {

    this.changeManagementService.getUserProfilesPhaseID().subscribe(res => {
      this.personPhase = res;
      this.prgoramCd = res['programCodes']
      for (const valueType of this.prgoramCd) {
        console.log('valueType', valueType, this.personPhase);
        if (valueType === 'ECF7'){
          this.buttonData[2].buttons.push({
            text: 'Recertification (ECF 7, ECF 8)',
            action: 'recertification',
            code: this.getTextName('RECT').code,
          });
        }
        else if (valueType === 'ECF8'){
          this.buttonData[2].buttons.push({
            text: 'Recertification (ECF 7, ECF 8)',
            action: 'recertification',
            code: this.getTextName('RECT').code,
          });
        }
        else if (valueType === 'PACE'){
          this.buttonData[2].buttons.push({
            text: 'Recertification (PACE)',
            action: 'recertification',
            code: this.getTextName('RECT').code,
        });
        }
      }
      if (this.phaseName === 'P2'){
        console.log("this.phaseName", this.phaseName);
        this.buttonData[3].buttons.push( {
          text: this.getTextName('UHED').value,
          action: 'hospiceDate',
          code: this.getTextName('UHED').code
        });
      }
      console.log("this.personPhase", res['programCodes']);
    });

    const chmSubscription$ = this.changeManagementService.getStaticDataValue().subscribe(res => {
      this.data = res;
      this.bindButtonData(this.data);
    });
    this.subscriptions$.push(chmSubscription$);
  }

  bindButtonData(data: any) {
    this.buttonData = [{
      text: 'Changes to Applicant Details',
      buttons: [
        {
          text: this.getTextName('UPDI').value,
          action: 'updateDemoInfo',
          code: this.getTextName('UPDI').code
        }, {
          text: this.getTextName('UPAF').value,
          action: 'updateAddressOnFile',
          code: this.getTextName('UPAF').code
        }, {
          text: this.getTextName('FITR').value,
          action: 'facilityTransfer',
          code: this.getTextName('FITR').code
        }, {
          text: this.getTextName('MAEA').value,
          action: 'entityAssociation',
          filter: ['isLtssGroup'],
          code: this.getTextName('MAEA').code
        }
      ]
    }, {
      text: 'Changes to Referral',
      buttons: [
        {
          text: this.getTextName('CRFI').value,
          action: 'completeReferral',
          code: this.getTextName('CRFI').code
        }
      ]
    }, {
      text: 'Changes to PAE',
      buttons: [
        {
          text: this.getTextName('RPAE').value,
          action: 'revisePae',
          code: this.getTextName('RPAE').code
        },
        {
          text: this.getTextName('LOCR').value,
          action: 'locReassignment',
          code: this.getTextName('LOCR').code

        }, {
          text: this.getTextName('AUES').value,
          action: 'updateErc',
          code: this.getTextName('AUES').code

        }, {
          text: this.getTextName('AOUM').value,
          action: 'addUpdateMopd',
          code: this.getTextName('AOUM').code

        }, {
          text: this.getTextName('LVON').value,
          action: 'levelOfNeed',
          code: this.getTextName('LVON').code

        }, {
          text: this.getTextName('SCER').value,
          action: 'costCapException',
          code: this.getTextName('SCER').code

        }, {
          text: this.getTextName('CFDI').value,
          action: 'changeDdId',
          code: this.getTextName('CFDI').code

        }, {
          text: this.getTextName('SISA')?.value,
          action: 'sisAssessment',
          code: this.getTextName('SISA')?.code

        }, {
          text: this.getTextName('OAJR').value,
          action: 'adjudication',
          filter: ['isLtssGroup'],
          code: this.getTextName('OAJR').code
        }
      ]
    }, {
      text: 'Changes to Enrollment',
      buttons: [{
        text: this.getTextName('DSER').value,
        action: 'disenrollment',
        code: this.getTextName('DSER').code

      }, {
        text: this.getTextName('RIMR').value,
        action: 'reinstateMember',
        code: this.getTextName('RIMR').code

      }, {
        text: this.getTextName('WAER').value,
        action: 'withdrawEnrollment',
        code: this.getTextName('WAER').code

      }, {
        text: this.getTextName('ASDT').value,
        action: 'addServiceDates',
        style: 'fullWidth',
        code: this.getTextName('ASDT').code

      }, {
        text: this.getTextName('ORER').value,
        action: 'enrollmentOverride',
        filter: ['isLtssGroup'],
        code: this.getTextName('ORER').code
      }]
    }];
  }
  getTextName(filterVal) {
    return this.data.find(a => a.code.trim().toLowerCase() === filterVal.trim().toLowerCase());
  }

  showButton(config: any): boolean {
    if (!config.filter) {
      return true;
    }
    let match = false;
    for (let i = 0; i < config.filter.length && !match; i++) {
      match = this.status[config.filter[i]];

    }
    return match;
  }

}


