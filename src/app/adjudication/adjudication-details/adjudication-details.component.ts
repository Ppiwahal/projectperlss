import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AdjudicationDetailsService } from 'src/app/core/services/adjudication/adjudication-details.service';
import { PaeCommonService } from 'src/app/core/services/pae/pae-common/pae-common.service';
import { PaeAdjudicationDenialDetailsComponent } from 'src/app/pae/pae-adjudication-denial-details/pae-adjudication-denial-details.component';



@Component({
  selector: 'app-adjudication-details',
  templateUrl: './adjudication-details.component.html',
  styleUrls: ['./adjudication-details.component.scss']
})
export class AdjudicationDetailsComponent implements OnInit {
  subscriptions$: any[] = [];
  adj_id: any;
  paeId: any;
  assigned_user: any;
  person_id: any;
  task_queue: any;
  taskStatus: any;
  row_element: any;
  task_id: any;
  program_name_cd: any;
  applicantDetailsForm: FormGroup;
  programNameCdList: any;
  program_name: any;
  taskId: number;
  taskMasterId: any;
  certificateDt: any;
  dobDt: any;
  submitDt: any;
  ssn: any;
  adjStatusCd: any;
  grandfatheredSw = null;
  rqstdEnrGrpCd: any;
  interimSw = null;
  assignedMcoSw = null;
  transitionPae = null;
  tnsFromCd: any;
  tnsToCd: any;
  revisedPaeSw = null;
  sltStatusCd: any;
  appealField: any;
  firstName: any;
  lastName: any;
  midInitial: any;
  name: any;
  adjudicationStatusList: any;
  adjStatus: any;
  program_approved: any;
  submittedEnrGrpCd: string;
  slotStatusList: any[];
  sltStatus: string;
  transFrom: any;
  transTo: any;
  sbmttrAcuityScoreNum: any;
  skilledServicesRequested: any;
  submittedFunDeficits: any;
  iqTestScore: any;
  programNameFromPae: any;
  tnsId: any;
  intakeOutcomeList: any;
  refId: any;
  finalIntakeOutcome: any;
  intakeOutcome: any;
  savedPassr = false;
  savedSdoc = false
  savedFa = false
  savedSkilled = false
  savedSafety = false
  savedDetermn = false
  savedDetermnOverride = false;
  fromChangeManagement = false;
  savedFac = false;
  displaySafety = true;
  entityId: any;
  programCd: any;
  sltEnrGrpCd: any;

  constructor(private matDialog: MatDialog,
    private adjudicationDetailsService: AdjudicationDetailsService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private paeCommonService: PaeCommonService) { }

  ngOnInit(): void {
    this.getDataFromPaeCommonService();
    this.getAdjudicationDetails(this.paeId, this.entityId);
  }

  buildApplicantDetailsForm() {
    this.applicantDetailsForm = this.fb.group({
      adjId: [''],
      firstName: [''],
      lastName: [''],
      midInitial: [''],
      dobDt: [''],
      ssn: [''],
      paeId: [''],
      prsnId: [''],
      tnsId: [''],
      adjStatusCd: [''],
      revisedPaeSw: [''],
      submitDt: [''],
      certificateDt: [''],
      rqstdEnrGrpCd: [''],
      submittedEnrGrpCd: [''],
      grandfatheredSw: [''],
      interimSw: [''],
      sltStatusCd: [''],
      appealField: [''],
      assignedMcoSw: [''],
      transitionPae: [''],
      tnsFromCd: [''],
      tnsToCd: [''],
      acuityScore: [''],
      sbmttrAcuityScoreNum: [''],
      skilledServicesRequested: [''],
      submittedFunDeficits: [''],
      iqTestScore: ['']
    })
  }

  getDataFromPaeCommonService() {
    this.paeId = this.paeCommonService.getPaeId();
    this.adj_id = this.paeCommonService.getAdjId();
    this.assigned_user = this.paeCommonService.getAssignedUser();
    this.person_id = this.paeCommonService.getPersonId();
    this.task_queue = this.paeCommonService.getTaskQueue();
    this.taskStatus = this.paeCommonService.getTaskStatus();
    this.row_element = this.paeCommonService.getRowElement();
    this.task_id = this.paeCommonService.getTaskId();
    this.paeId = this.paeCommonService.getPaeId();
    this.program_name_cd = this.paeCommonService.getProgramName();
    this.entityId = this.paeCommonService.getEntityId();
    this.programCd = this.paeCommonService.getProgramCd();
    this.fromChangeManagement = this.paeCommonService.getFromChngMgmt();
  }

  getAdjudicationDetails(paeId, entityId) {
    this.adjudicationDetailsService.getAdjApplicantDetails(paeId, entityId).subscribe(res => {
      this.dobDt = res.dobDt
      this.submitDt = res.submitDt
      this.ssn = this.getSSNMask(res.ssn);
      this.adjStatusCd = res.adjStatusCd
      this.grandfatheredSw = res.grandfatheredSw
      this.rqstdEnrGrpCd = this.program_name_cd;
      this.submittedEnrGrpCd = res.submittedEnrGrpCd
      this.interimSw = res.interimSw
      this.assignedMcoSw = res.assignedMcoSw
      this.transitionPae = res.transitionPae
      this.tnsFromCd = res.tnsFromCd
      this.tnsToCd = res.tnsToCd
      this.revisedPaeSw = res.revisedPaeSw
      this.sltStatusCd = res.sltStatusCd
      this.appealField = res.appealField
      this.firstName = res.firstName
      this.lastName = res.lastName
      this.midInitial = res.midInitial
      this.certificateDt = res.certificateDt
      this.sbmttrAcuityScoreNum = res.sbmttrAcuityScoreNum
      this.skilledServicesRequested = res.skilledServicesRequested
      this.submittedFunDeficits = res.submittedFunDeficits
      this.iqTestScore = res.iqTestScore
      this.tnsId = res.tnsId
      this.refId = res.refId
      this.finalIntakeOutcome = res.finalIntakeOutcome
      this.sltEnrGrpCd = res.sltEnrGrpCd
      this.getValuesfromRT();
      this.adjudicationDetailsService.rqstdEnrGrpCd$$.next(this.programCd);
      this.adjudicationDetailsService.sltEnrGrpCd$$.next(this.sltEnrGrpCd);
      this.adjudicationDetailsService.grandFatheredSw$$.next(this.grandfatheredSw);
    });
  }
  getName(fn, ln, mn) {
    this.name = fn && fn + " " + (mn ? mn + " " : "") + " " + ln && ln;

  }
  getFormData(): any {
    return this.applicantDetailsForm.controls;
  }

  getSSNMask(ssn: string) {
    if (ssn) {
      const formstring = ssn.substr(0, 3) + '-' + ssn.substr(3, 2) + '-' + ssn.substr(5, 4);
      return formstring;
    }
  }

  getValuesfromRT(): void {
    this.getName(this.firstName, this.lastName, this.midInitial);
    this.getEnrProgramNameValues();
    this.getAdjudicationStatusValues();
    this.getSlotValues();
  }

  getEnrProgramNameValues(): void {
    const getProgramName$ = this.adjudicationDetailsService.getSearchDropdowns('ENROLLMENT_GROUP').subscribe(res => {
      this.programNameCdList = res;
      const prgRqst = this.programNameCdList?.filter(element => {
        return element.code === this.programCd;
      })
      this.program_name = prgRqst[0] && prgRqst[0]?.value;

      const prgSubb = this.programNameCdList?.filter(element => {
        return element.code === this.submittedEnrGrpCd;
      })
      this.program_approved = prgSubb[0] && prgSubb[0]?.value;

      const transFrom = this.programNameCdList?.filter(element => {
        return element.code === this.tnsFromCd;
      })
      this.transFrom = transFrom[0] && transFrom[0]?.value;

      const transTo = this.programNameCdList?.filter(element => {
        return element.code === this.tnsToCd;
      })
      this.transTo = transTo[0] && transTo[0]?.value;
    })
    this.subscriptions$.push(getProgramName$);
  }

  getProgramName(): void {
    const getProgramName$ = this.adjudicationDetailsService.getSearchDropdowns('PROGRAM_NAME').subscribe(res => {
      const element = res.filter(element => {
        return element.code === this.program_name_cd;
      })
      this.programNameFromPae = element[0] && element[0]?.value;
    })
    this.subscriptions$.push(getProgramName$);
  }

  getAdjudicationStatusValues(): void {
    const getAdjudicationStatusValues$ = this.adjudicationDetailsService.getSearchDropdowns('ADJUDICATION_STATUS').subscribe(res => {
      this.adjudicationStatusList = res;
      const element = this.adjudicationStatusList.filter(element => {
        return element.code === this.adjStatusCd;
      })
      this.adjStatus = element[0] && element[0]?.value;
    })
    this.subscriptions$.push(getAdjudicationStatusValues$);
  }

  getSlotValues(): void {
    const getSlotValues$ = this.adjudicationDetailsService.getSearchDropdowns('SLOT_STATUS').subscribe(res => {
      this.slotStatusList = res;
      const element = this.slotStatusList.filter(element => {
        return element.code === this.sltStatusCd;
      })
      this.sltStatus = element[0] && element[0]?.value;
    })
    this.subscriptions$.push(getSlotValues$);
  }
  getIntakeOutcomeValues(): void {
    const getIntakeOutcomeValues$ = this.adjudicationDetailsService.getSearchDropdowns('INTAKE_EVALUATION').subscribe(res => {
      this.intakeOutcomeList = res;
      const element = this.intakeOutcomeList.filter(element => {
        return element.code === this.finalIntakeOutcome;
      })
      this.intakeOutcome = element[0] && element[0]?.value;
    })
    this.subscriptions$.push(getIntakeOutcomeValues$);
  }

  displayPopup() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '1080px';
    dialogConfig.height = '720px';
    this.matDialog.open(PaeAdjudicationDenialDetailsComponent, dialogConfig);
  }

  changeSavedFa(val: boolean) {
    this.savedFa = val;
  }
  changeSavedDetermn(val: boolean) {
    this.savedDetermn = val;
  }
  changeOverrideSavedDetermn(val: boolean) {
    this.savedDetermnOverride = val;
  }
  changeSavedPassr(val: boolean) {
    this.savedPassr = val;
  }
  changeSavedSafety(val: boolean) {
    this.savedSafety = val;
  }
  changeSavedSkilled(val: boolean) {
    this.savedSkilled = val;
  }
  changeSavedFac(val: boolean) {
    this.savedFac = val;
  }

  changeDisplaySafety(val: boolean) {
    this.displaySafety = val;
  }


  onDestroy(): void {
    if (this.subscriptions$ && this.subscriptions$.length > 0) {
      this.subscriptions$.forEach(subscription$ => subscription$.unsubscribe());
    }
  }

}
