import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AppealService } from '../../services/appeal.service';


@Component({
  selector: 'app-appeal-type',
  templateUrl: './appeal-type.component.html',
  styleUrls: ['./appeal-type.component.scss']
})
export class AppealTypeComponent implements OnInit {

  nameSuffix: any[] = [];
  @Input() appealType: any[] = [];
  code:string = '';
  @Output() emitAppealType: EventEmitter<any> = new EventEmitter<any>();
  @Output() emitDataToLink: EventEmitter<any> = new EventEmitter<any>();
  @Input() appealTypeData:any;
  @Input() pasrrReason:any;
  @Input() payorSource:any;
  @Output() emitAddPasrr: EventEmitter<any> = new EventEmitter<any>();
  @Input() pasrrAdverseReason:any;
  referralStatusData: any;
  intakeOutcomeData: any;
  enrollGroupData: any;
  paeStatusData: any;
  enrollStatusData:any;
  slotStatusData:any;
  yes_no:any;
  enrolDenialReasData: any;
  tpDiagnosisData: any;

  constructor(private appealService: AppealService) { }

  ngOnInit(): void {
    this.appealService.getAppealDropdowns('REFERRAL_STATUS').subscribe(res => {
      this.referralStatusData = res;
    });
    this.appealService.getAppealDropdowns('INTAKE_OUTCOME').subscribe(res => {
      this.intakeOutcomeData = res;
    });
    this.appealService.getAppealDropdowns('ENROLLMENT_GROUP').subscribe(res => {
      this.enrollGroupData = res;
    });
    this.appealService.getAppealDropdowns('PAE_STATUS').subscribe(res => {
      this.paeStatusData = res;
    });
    this.appealService.getAppealDropdowns('ENROLLMENT_STATUS').subscribe(res => {
      this.enrollStatusData = res;
    });
    this.appealService.getAppealDropdowns('SLOT_STATUS').subscribe(res => {
      this.slotStatusData = res;
    });
    this.appealService.getAppealDropdowns('YES_NO').subscribe(res => {
      this.yes_no = res;
    });
    this.appealService.getAppealDropdowns('ENROLLMENT_DENIAL_REASON').subscribe(res => {
      this.enrolDenialReasData = res;
    });
    this.appealService.getAppealDropdowns('TP_DIAGNOSIS').subscribe(res => {
      this.tpDiagnosisData = res;
    });
  }

  onAppealTypeChange(value){
    if(value == 'DE' || value == 'PA' || value == 'EN'){
      this.code = 'Show'
    } else {
      this.code = value;
    }
    this.emitAppealType.emit(value);
  }

  emitLinkAppealReferral(data){
    this.emitDataToLink.emit(data);
  }

  addPasrr(data){
    this.emitAddPasrr.emit(data);
  }

}
