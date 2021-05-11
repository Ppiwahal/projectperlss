import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { ComponentCanDeactivate } from 'src/app/core/helpers/pending-change.guard';
import { PaeCommonService } from '../../../../app/core/services/pae/pae-common/pae-common.service';
import { PaeService } from '../../../core/services/pae/pae.service';
import { PaeSkilledServicesDetailsOtherComponent } from './pae-skilled-details-other/pae-skilled-services-details-other.component';

@Component({
  selector: 'app-pae-skilled-services-details',
  templateUrl: './pae-skilled-services-details.component.html',
  styleUrls: ['./pae-skilled-services-details.component.scss']
})
export class PaeSkilledServicesDetailsComponent implements OnInit, ComponentCanDeactivate {
  programName: any;
  isKbProgram = false;
  pageId: string = 'PPSSD'; 
  applicantName: any;
  @ViewChild(PaeSkilledServicesDetailsOtherComponent) otherComponent: PaeSkilledServicesDetailsOtherComponent;
  constructor(private paeCommonService: PaeCommonService,
              private paeService: PaeService,) { }

  ngOnInit() {
    this.programName = this.paeCommonService.getProgramName();
    if (this.paeCommonService.getApplicantName() === null || this.paeCommonService.getApplicantName() === '' || this.paeCommonService.getApplicantName() === undefined){
		this.getApplicantName();
	} else {
		this.applicantName =  this.paeCommonService.getApplicantName();
	}
    // if (this.programName !== 'KB'){
    //   this.isKbProgram = true;
    // }
    // else {
    //   this.isKbProgram = false;
    // }
  }

  getApplicantName(){
    this.paeService.getPaeApplicantInformation(this.paeCommonService.getPaeId(),this.pageId).then((response)=> {
      console.log("reponseforName"+JSON.stringify(response.body.firstName));
      this.applicantName =  response.body.firstName+" "+response.body.lastName;
	  this.paeCommonService.setApplicantName(this.applicantName);
    });
  }

  switchKb(){
    this.isKbProgram = !this.isKbProgram;
  }

  
@HostListener('window:beforeunload')
canDeactivate(): Observable<boolean> | boolean {
 return this.otherComponent.isSamePageNavigation ? true : !this.otherComponent.isFormDirty();
}
resetForm(){
  this.otherComponent.resetForms();
}
}
