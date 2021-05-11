import { EnvService } from './../../../_shared/utility/env.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkflowAnalyticsService {
  serverApiUrl: any;

  constructor(private http: HttpClient,
    private envService: EnvService) {
    this.serverApiUrl = this.envService.apiUrl();
  }
  getWorkflowAnalyticsData(request:any) {
    return this.http.get(this.serverApiUrl.API_URL + "/search?refId=" + request.refId)
  }
  getActivityData() {
    // return this.http.get(this.serverApiUrl.API_URL + "/<url>")

    return of(
      [{ "code": "REFS", "value": "Referral Submission", "activateSW": "Y" },
      { "code": "REFU", "value": "Referral Update", "activateSW": "Y" },
      { "code": "IRCR", "value": "Intake IARC Review", "activateSW": "Y" },
      { "code": "INUR", "value": "Intake Nurse Review", "activateSW": "Y" },
      { "code": "IOUS", "value": "Intake Outcome Submission", "activateSW": "Y" },
      { "code": "REFC", "value": "Referral Closed", "activateSW": "Y" },
      { "code": "REFW", "value": "Referral Withdrawn", "activateSW": "Y" },
      { "code": "SLER", "value": "Slot Evaluation Results", "activateSW": "Y" },
      { "code": "APL", "value": "Appeal", "activateSW": "Y" },
      { "code": "PAES", "value": "PAE Submission", "activateSW": "Y" },
      { "code": "RPAE", "value": "Revise PAE", "activateSW": "Y" },
      { "code": "PAEW", "value": "PAE Withdrawn", "activateSW": "Y" },
      { "code": "ADJN", "value": "Nurse Adjudication", "activateSW": "Y" },
      { "code": "ADJU", "value": "Adjudication Update", "activateSW": "Y" },
      { "code": "ENRC", "value": "Enrollment Complete", "activateSW": "Y" },
      { "code": "ENRU", "value": "Enrollment Update", "activateSW": "Y" },
      { "code": "TRNR", "value": "Transition Requested", "activateSW": "Y" },
      { "code": "TRNC", "value": "Transition Complete", "activateSW": "Y" },
      { "code": "SARC", "value": "Safety Request Completed", "activateSW": "Y" },
      { "code": "SISC", "value": "SIS Assessment Completed", "activateSW": "Y" },
      { "code": "G3IR", "value": "Group 3 Interest Response", "activateSW": "Y" },
      { "code": "SIND", "value": "Service Initiation Date", "activateSW": "Y" },
      { "code": "CCER", "value": "Cost Cap Exception Request", "activateSW": "Y" },
      { "code": "ATRD", "value": "Actual Transition Date", "activateSW": "Y" },
      { "code": "RECR", "value": "Recertification", "activateSW": "Y" },
      { "code": "LOCR", "value": "LOC Reassessment", "activateSW": "Y" },
      { "code": "MEAS", "value": "Manage Entity Association", "activateSW": "Y" },
      { "code": "ERCU", "value": "Add or Update ERC Services", "activateSW": "Y" },
      { "code": "MOPU", "value": "Add or Update MOPD", "activateSW": "Y" },
      { "code": "DENR", "value": "Disenrollment", "activateSW": "Y" },
      { "code": "UDEI", "value": "Update Demographic Information", "activateSW": "Y" },
      { "code": "UAOF", "value": "Update Address on File", "activateSW": "Y" },
      { "code": "FATR", "value": "Facility Transfer", "activateSW": "Y" },
      { "code": "LONC", "value": "Level of Need Change", "activateSW": "Y" },
      { "code": "CDID", "value": "Change from DD to ID", "activateSW": "Y" },
      { "code": "WENR", "value": "Withdrawn Enrollment Request", "activateSW": "Y" },
      { "code": "RIME", "value": "Reinstate Member", "activateSW": "Y" },
      { "code": "UHOE", "value": "Update Hospice Effective Date", "activateSW": "Y" }]
    )
  }
}
