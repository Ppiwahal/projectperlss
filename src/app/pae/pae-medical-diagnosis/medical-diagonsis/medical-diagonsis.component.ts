import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { ComponentCanDeactivate } from 'src/app/core/helpers/pending-change.guard';
import { PaeCommonService } from 'src/app/core/services/pae/pae-common/pae-common.service';
import { MedicalDiagnosisEcfApplicationComponent } from '../medical-diagnosis-ecf-application/medical-diagnosis-ecf-application.component';
import { MedicalDiagnosisHcbsApplicationComponent } from '../medical-diagnosis-hcbs-application/medical-diagnosis-hcbs-application.component';
import { MedicalDiagnosisICFComponent } from '../medical-diagnosis-icf-application/medical-diagnosis-icf-application.component';
import { MedicalDiagnosisKbApplicationComponent } from '../medical-diagnosis-kb-application/medical-diagnosis-kb-application.component';
@Component({
  selector: 'app-medical-diagonsis',
  templateUrl: './medical-diagonsis.component.html',
  styleUrls: ['./medical-diagonsis.component.scss']
})
export class MedicalDiagonsisComponent implements OnInit, ComponentCanDeactivate {
  selectedMenu: any;
  selectedProgram: any;
  @ViewChild(MedicalDiagnosisKbApplicationComponent) kbComponent: MedicalDiagnosisKbApplicationComponent;
  @ViewChild(MedicalDiagnosisHcbsApplicationComponent) hcbsComponent: MedicalDiagnosisHcbsApplicationComponent;
  @ViewChild(MedicalDiagnosisICFComponent) icfComponent: MedicalDiagnosisICFComponent;
  @ViewChild(MedicalDiagnosisEcfApplicationComponent)ecfComponent: MedicalDiagnosisEcfApplicationComponent;
  constructor( private paeCommonService: PaeCommonService) { }

  ngOnInit(): void {
     /* this.shareService.currentMessage.subscribe((data)=>{
       this.selectedMenu = data;
       console.log("datata===", data)
     }) */
      this.selectedMenu = this.paeCommonService.getProgramName();
      console.log("datata===", this.selectedMenu);
  }
  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean { 
    if(this.selectedMenu == 'ICF'){
      return this.icfComponent.isSamePageNavigation ? true :!this.icfComponent.medicalDiagnosis.dirty;
    } else if (this.selectedMenu == 'EC4' || this.selectedMenu == 'EC5' || this.selectedMenu == 'EC6' || this.selectedMenu == 'EC7' || this.selectedMenu == 'EC8' ) {
      return this.ecfComponent.isSamePageNavigation ? true :!this.ecfComponent.medicalDiagnosis.dirty;
    } else if (this.selectedMenu == 'CG1' || this.selectedMenu == 'CG2') {      
      return this.hcbsComponent.isSamePageNavigation ? true :!this.hcbsComponent.medicalDiagnosis.dirty;
    } else if (this.selectedMenu == 'KB') {
      return this.kbComponent.isSamePageNavigation ? true :!this.kbComponent.medicalDiagnosis.dirty;
    } 
    return true;
  }

  resetForm(){
    if(this.selectedMenu == 'ICF'){
      this.icfComponent.medicalDiagnosis.reset();
    } else if (this.selectedMenu == 'EC4' || this.selectedMenu == 'EC5' || this.selectedMenu == 'EC6' || this.selectedMenu == 'EC7' || this.selectedMenu == 'EC8' ) {
      this.ecfComponent.medicalDiagnosis.reset();
    } else if (this.selectedMenu == 'CG1' || this.selectedMenu == 'CG2') {
      this.hcbsComponent.medicalDiagnosis.reset();
    } else if (this.selectedMenu == 'KB') {
      this.kbComponent.medicalDiagnosis.reset();
    } 
  }
}
