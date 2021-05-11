import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { WorkflowAnalyticsService } from "../../../core/services/widgets/workflow-analytics.service"
import * as ValidationMessages from '../../../_shared/constants/validation.constants';
@Component({
  selector: 'app-workflow-analytics-popup',
  templateUrl: './workflow-analytics-popup.component.html',
  styleUrls: ['./workflow-analytics-popup.component.scss']
})
export class WorkflowAnalyticsPopupComponent implements OnInit {
  showSearchResults = false;
  name = "test tooltip"
  route = null;
  refId = "";
  paeId = "";
  appealId = "";
  dateRangeFrom ;
  dateRangeTo;
  activity = "";
  @ViewChild('stepper') stepper: MatStepper;
  data = [];
  activities = [];
  topLevelData ;
  navgationTexts = [
    "Referral Submission",
    "Intake Outcome Submission",
    "Intake Nurse Review",
    "Intake IARC Review",
    "PAE Submission"
  ]
  today = new Date();
  minDate = new Date("01/01/1901");
  noResults = false;
  maxDateError = ValidationMessages.A5;
  minDateError = ValidationMessages.A6;
  noResultError = ValidationMessages.D1;
  constructor(private dialogRef: MatDialogRef<WorkflowAnalyticsPopupComponent>,
    private workflowAnalyticsService: WorkflowAnalyticsService,
    public dialog: MatDialog, private _formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.refId = "RF100002377";  // for testig
    this.getActivity();
  }

  getPath(activityName){
    if(activityName === "PAE Submission"){
      return  ""
    }
    else if(activityName === "Intake Outcome Submission"){
      return  "/ltss/referral/referralIntakeOutcome";
    }
    else if(activityName === "Intake Nurse Review"){
      return ""
    }
    else if(activityName === "Intake IARC Review"){
      return ""
    }
    else if(activityName === "PAE Submission"){
    return  "/ltss/referral/referralIntakeOutcome";
    }
  }
  getActivity() {
    this.workflowAnalyticsService.getActivityData().subscribe(res => {
      this.activities = res;
    })
  }
  onSearch() {
    const request = {
      refId: this.refId,
      paeId: this.paeId,
      activity: this.activity
    }
    this.workflowAnalyticsService.getWorkflowAnalyticsData(request).subscribe((res: any) => {
      if(res && res.workflowVO) {
        this.topLevelData = res.workflowVO
      }
      if (res && res.workflowObjectVO && res.workflowObjectVO.length) {
        this.data = res.workflowObjectVO;
        this.data.map(item => {
          const matchData = this.activities.find(dropdownItem => dropdownItem["code"] === item.actionTypeCd)
          item.activityName = matchData ? matchData["value"] : "";
        })
        console.log(this.data)
      } else {
        this.noResults = true;
      }
    })
    this.showSearchResults = true;
  }
  ngAfterViewInit() {
    console.log(this.stepper)

  }

  close() {
    this.dialog.closeAll();
    this.dialogRef.close({ data: false });
  }

}
