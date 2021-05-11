import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PaeService } from 'src/app/core/services/pae/pae.service';
import { PaeCommonService } from 'src/app/core/services/pae/pae-common/pae-common.service';
import { SavePopupComponent } from 'src/app/savePopup/savePopup.component';
import { PaeRequestDatePopupComponent } from './pae-request-date-popup/pae-request-date-popup.component';
import { PaeRequestDate } from '../../_shared/model/PaeRequestDate';
import { PaeProgramSelectService } from '../../core/services/pae/pae-program-select/pae-program-select.service';
import { PaeFlowSeq } from 'src/app/_shared/utility/PaeFlowSeq';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { RightnavToggleService } from 'src/app/_shared/services/rightnav-toggle.service';

@Component({
  selector: 'app-pae-select-program',
  templateUrl: './pae-select-program.component.html',
  styleUrls: ['./pae-select-program.component.scss'],
})
export class PaeSelectProgramComponent implements OnInit, OnDestroy {
  submitted = false;
  programName: any;
  paeAge: any;
  livingArrangement: any;
  paeId: any;
  isKbProgram: boolean = localStorage.getItem('isKbProgram') == 'true';
  isKbProgramSelected = false;
  isChoicesGroupOne = false;
  isChoicesGroupOneSelected = false;
  isIcfIid = false;
  isIcfIidSelected = false;
  isEcfChoiceFive = false;
  isEcfChoiceSix = false;
  isEcfChoiceEight = false;
  isEcfChoiceFiveSelected = false;
  isEcfChoiceSixSelected = false;
  isEcfChoiceEightSelected = false;
  isChoicesHcbs = false;
  isChoicesHcbsSelected = false;
  isEcfChoiceSeven = false;
  isEcfChoiceSevenSelected = false;
  isEcfChoiceFour = false;
  isEcfChoiceFourSelected = false;
  enrollmentNote = false;
  cac = false;
  cacSelected = false;
  county: any;
  isPace = false;
  isPaceSelected = false;
  applicantName: any;
  selectedProgram: any;
  elementRow: any;
  personId: any;
  nextPage: any;
  pageId: string;
  taskMasterId: any;
  subscription1$: Subscription;
  subscription2$: Subscription;
  subscriptions: Subscription[] = [];

  constructor(private paeCommonService: PaeCommonService,
              private paeService: PaeService,
              private dialog: MatDialog,
              private router: Router,
              private paeProgramSelectService: PaeProgramSelectService,
              private rightnavToggleService: RightnavToggleService) {}

  ngOnInit() {
    this.pageId='PPPSP';
    this.taskMasterId = null;
    this.elementRow = this.paeCommonService.getRowElement();
    this.paeId = this.paeCommonService.getPaeId();
    this.programName = this.paeCommonService.getProgramName();
    this.personId = this.paeCommonService.getPersonId();
    this.paeAge = this.paeCommonService.getAge();
    this.livingArrangement = this.paeCommonService.getLivingArrangement();
    this.county = this.paeCommonService.getCounty();
    if (this.elementRow) {
      this.taskMasterId = this.elementRow.taskQueue;
    }
    if (this.paeCommonService.getApplicantName() === null || this.paeCommonService.getApplicantName() === '' || this.paeCommonService.getApplicantName() === undefined){
		this.getApplicantName();
	} else {
		this.applicantName =  this.paeCommonService.getApplicantName();
	}
    this.getProgramSelection();
  }

  getApplicantName(){
    this.paeService.getPaeApplicantInformation(this.paeCommonService.getPaeId(),this.pageId).then((response)=> {
      console.log("reponseforName"+JSON.stringify(response.body.firstName));
      this.applicantName =  response.body.firstName+" "+response.body.lastName;
	  this.paeCommonService.setApplicantName(this.applicantName);
    });
  }

  getProgramSelection(){
    if ( this.paeId ){
      this.subscription2$ = this.paeProgramSelectService.getPaeProgramName(this.paeId).subscribe((paeSelectedProgram) =>
    {
      console.log(paeSelectedProgram.programTypeCd);
      if(paeSelectedProgram.programTypeCd !== null && paeSelectedProgram.programTypeCd !== undefined){
        this.programName = paeSelectedProgram.programTypeCd;
      }
      this.filterProgramNames();
    }, err => {
      console.log('Error');
    });
      this.subscriptions.push(this.subscription2$);
    }
  }

  filterProgramNames(){
    if (this.programName !== undefined && this.programName === 'KB' && this.taskMasterId === 21) {
      this.isKbProgram = this.getPhaseProgramComparison('KB');
      this.isKbProgramSelected = true;
      this.selectedProgram = 'KB';
    } else {
      console.log(this.taskMasterId);
      if (this.taskMasterId === 17 || this.taskMasterId === undefined || this.taskMasterId === null) {
        this.isChoicesGroupOne = this.getPhaseProgramComparison('CG1');
      }
      if (this.taskMasterId === 20 || this.taskMasterId === undefined || this.taskMasterId === null){
        this.isIcfIid = this.getPhaseProgramComparison('ICF');
      }
      if (this.programName !== undefined && this.programName === 'CG1') {
          this.isChoicesGroupOneSelected = true;
          this.selectedProgram = 'CG1';
      } else if (this.programName !== undefined && this.programName === 'ICF') {
          this.isIcfIidSelected = true;
          this.selectedProgram = 'ICF';
      }

      if (this.paeAge >= 20) {
        if (this.taskMasterId === 18 || this.taskMasterId === undefined || this.taskMasterId === null) {
          this.isChoicesHcbs = this.getPhaseProgramComparison('CG2');
          if(this.programName !== undefined && this.programName === 'CG2'){
            this.isChoicesHcbsSelected = true;
            this.selectedProgram = 'CG2';
          }
        }
      }
      if (this.paeAge >= 18 && (this.taskMasterId === 7 || this.taskMasterId === 16)) {
        this.isEcfChoiceFive = this.getPhaseProgramComparison('EC5');
        this.isEcfChoiceSix = this.getPhaseProgramComparison('EC6');
        this.isEcfChoiceEight = this.getPhaseProgramComparison('EC8');
        if (this.programName !== undefined && this.programName === 'EC5') {
          this.isEcfChoiceFiveSelected = true;
          this.selectedProgram = 'EC5';
        } else if (this.programName !== undefined && this.programName === 'EC6') {
          this.isEcfChoiceSixSelected = true;
          this.selectedProgram = 'EC6';
        } else if (this.programName !== undefined && this.programName === 'EC8') {
          this.isEcfChoiceEightSelected = true;
          this.selectedProgram = 'EC8';
        }
      }
      if (this.livingArrangement === 'HOM' && (this.taskMasterId === 7 || this.taskMasterId === 16)) {
        
        this.isEcfChoiceFour = this.getPhaseProgramComparison('EC4');
        if (this.programName !== undefined && this.programName === 'EC4') {
          this.isEcfChoiceFourSelected = true;
          this.selectedProgram = 'EC4';
        }
      }
      if (this.livingArrangement === 'HJC' && (this.taskMasterId === 19 || this.taskMasterId === undefined || this.taskMasterId === null)) {
        this.cac = this.getPhaseProgramComparison('CAC');
        if (this.programName !== undefined && this.programName === 'CAC') {
          this.cacSelected = true;
          this.selectedProgram = 'CAC';
        }
      }
      if (this.paeAge >= 55 && this.county === '033'
      && (this.taskMasterId === 22 || this.taskMasterId === undefined || this.taskMasterId === null)) {
        this.isPace = this.getPhaseProgramComparison('PACE');
        if (this.programName !== undefined && this.programName === 'PACE') {
          this.isPaceSelected = true;
          this.selectedProgram = 'PACE';
        }
      }
      if (this.paeAge <= 20 && (this.taskMasterId === 7 || this.taskMasterId === 16)) {
        this.isEcfChoiceSeven = this.getPhaseProgramComparison('EC7');
        if (this.programName !== undefined && this.programName === 'EC7') {
          this.isEcfChoiceSevenSelected = true;
          this.selectedProgram = 'EC7';
        }
      }
    }
  }

  getPhaseProgramComparison(programCode){
    const phaseInformation = JSON.parse(localStorage.getItem('PHASE'));
    if (phaseInformation.programCodes.includes(programCode)){
      return true;
    }
    else{
      return false;
    }
  }

  saveAndExit() {
    this.selectProgramNext(true)
  }

  selectProgramNext(showPopup?: boolean){
      this.submitted = true;
      if (this.selectedProgram === 'CG1' || this.selectedProgram === 'EC4' || this.selectedProgram === 'ICF' || this.selectedProgram === 'PACE') {
        const dialogRef = this.dialog.open(PaeRequestDatePopupComponent,
        { height: '80vh', data: { selectedProgram: this.selectedProgram, paeId: this.paeId }});
        dialogRef.afterClosed().subscribe(nextPage => {
          if (nextPage) {
            console.log(nextPage);
            if(showPopup){
              const dialogConfig = new MatDialogConfig();
              dialogConfig.data = { route: 'ltss/pae' };
             // dialogConfig.data = { route: 'ltss/pae' , nextRoute: '/ltss/pae/paeStart/' + this.nextPath };
              dialogConfig.panelClass = 'exp_popup';
              dialogConfig.width = '648px';
              dialogConfig.height = '360px';
              this.dialog.open(SavePopupComponent, dialogConfig );
            } else {
            this.nextPage = nextPage;
            this.callMenuService();
            }
          }
        });
      }
      else {
        const pageId = 'PPPSP';
        const requestPayload = new PaeRequestDate(
          pageId,
          null,
          null,
          null,
          this.selectedProgram,
          this.paeId
        );
        const response = this.paeProgramSelectService.savePaeProgramRequestDate(
          requestPayload
        );
        response.then((data) => {
          this.paeCommonService.setProgramName(this.selectedProgram);
          this.nextPage = data.headers.get('next');
          if(showPopup){
            const dialogConfig = new MatDialogConfig();
            dialogConfig.data = { route: 'ltss/pae' };
           // dialogConfig.data = { route: 'ltss/pae' , nextRoute: '/ltss/pae/paeStart/' + this.nextPath };
            dialogConfig.panelClass = 'exp_popup';
            dialogConfig.width = '648px';
            dialogConfig.height = '360px';
            this.dialog.open(SavePopupComponent, dialogConfig );
          } else {
            this.callMenuService();
          }
        });
      }
    }

  callMenuService(){
    const nextPath = PaeFlowSeq[this.nextPage];
    this.subscription1$ = this.paeProgramSelectService.getPaeDisplayPages(this.paeId).subscribe((paeMenuItems) =>
    {
      console.log(paeMenuItems.paeDisplayPages);
      this.paeCommonService.setPaeDisplayMenu(paeMenuItems.paeDisplayPages);
      this.paeCommonService.setProgramName(this.selectedProgram);
      const tempObj = {
        aplId: null,
        paeId: this.paeId ? this.paeId : null,
        applicantName: this.applicantName,
        prsnId: this.personId ? this.personId : null,
        refId: null
      };
      this.rightnavToggleService.setRightnavFlag(true);
      this.rightnavToggleService.setRightNavCategoryCode('PAE');
      this.rightnavToggleService.setRightNavProgramCode(this.selectedProgram);
      this.rightnavToggleService.setRightnavData(tempObj);
      this.router.navigate(['/ltss/pae/paeStart/' + nextPath]);
    }, err => {
      console.log('Error');
    });
    this.subscriptions.push(this.subscription1$);


  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    console.log('pae-select-Program Unsubscribed');
  }

  onKBClicked() {
    this.isKbProgramSelected = true;
    this.selectedProgram = 'KB';
    this.isChoicesGroupOneSelected = false;
    this.isChoicesHcbsSelected = false;
    this.isEcfChoiceFourSelected = false;
    this.isEcfChoiceFiveSelected = false;
    this.isEcfChoiceSixSelected = false;
    this.isEcfChoiceSevenSelected = false;
    this.isEcfChoiceEightSelected = false;
    this.isPaceSelected = false;
    this.cacSelected = false;
    this.isIcfIidSelected = false;
    if(this.programName){
      if(this.programName === this.selectedProgram){
        this.enrollmentNote = true;
      }
    }

  }
  onChoicesGroupOneClicked() {
    this.isKbProgramSelected = false;
    this.isChoicesGroupOneSelected = true;
    this.selectedProgram = 'CG1';
    this.isChoicesHcbsSelected = false;
    this.isEcfChoiceFourSelected = false;
    this.isEcfChoiceFiveSelected = false;
    this.isEcfChoiceSixSelected = false;
    this.isEcfChoiceSevenSelected = false;
    this.isEcfChoiceEightSelected = false;
    this.isPaceSelected = false;
    this.cacSelected = false;
    this.isIcfIidSelected = false;

  }
  onChoicesHcbsClicked(){
    this.isKbProgramSelected = false;
    this.isChoicesGroupOneSelected = false;
    this.isChoicesHcbsSelected = true;
    this.selectedProgram = 'CG2';
    this.isEcfChoiceFourSelected = false;
    this.isEcfChoiceFiveSelected = false;
    this.isEcfChoiceSixSelected = false;
    this.isEcfChoiceSevenSelected = false;
    this.isEcfChoiceEightSelected = false;
    this.isPaceSelected = false;
    this.cacSelected = false;
    this.isIcfIidSelected = false;

  }

  onEcfChoiceFourClicked(){
    this.isKbProgramSelected = false;
    this.isChoicesGroupOneSelected = false;
    this.isChoicesHcbsSelected = false;
    this.isEcfChoiceFourSelected = true;
    this.selectedProgram = 'EC4';
    this.isEcfChoiceFiveSelected = false;
    this.isEcfChoiceSixSelected = false;
    this.isEcfChoiceSevenSelected = false;
    this.isEcfChoiceEightSelected = false;
    this.isPaceSelected = false;
    this.cacSelected = false;
    this.isIcfIidSelected = false;
    if(this.programName){
      if(this.programName !== this.selectedProgram){
        this.enrollmentNote = true;
      }else{
        this.enrollmentNote = false;
      }
    }
  }

  onEcfChoiceFiveClicked() {
    this.isKbProgramSelected = false;
    this.isChoicesGroupOneSelected = false;
    this.isChoicesHcbsSelected = false;
    this.isEcfChoiceFourSelected = false;
    this.isEcfChoiceFiveSelected = true;
    this.selectedProgram = 'EC5';
    this.isEcfChoiceSixSelected = false;
    this.isEcfChoiceSevenSelected = false;
    this.isEcfChoiceEightSelected = false;
    this.isPaceSelected = false;
    this.cacSelected = false;
    this.isIcfIidSelected = false;
    if(this.programName){
      if(this.programName !== this.selectedProgram){
        this.enrollmentNote = true;
      }else{
        this.enrollmentNote = false;
      }
    }
  }

  onEcfChoiceSixClicked() {
    this.isKbProgramSelected = false;
    this.isChoicesGroupOneSelected = false;
    this.isChoicesHcbsSelected = false;
    this.isEcfChoiceFourSelected = false;
    this.isEcfChoiceFiveSelected = false;
    this.isEcfChoiceSixSelected = true;
    this.selectedProgram = 'EC6';
    this.isEcfChoiceSevenSelected = false;
    this.isEcfChoiceEightSelected = false;
    this.isPaceSelected = false;
    this.cacSelected = false;
    this.isIcfIidSelected = false;
    if(this.programName){
      if(this.programName !== this.selectedProgram){
        this.enrollmentNote = true;
      }else{
        this.enrollmentNote = false;
      }
    }

  }

  onEcfChoiceSevenClicked() {
    this.isKbProgramSelected = false;
    this.isChoicesGroupOneSelected = false;
    this.isChoicesHcbsSelected = false;
    this.isEcfChoiceFourSelected = false;
    this.isEcfChoiceFiveSelected = false;
    this.isEcfChoiceSixSelected = false;
    this.isEcfChoiceSevenSelected = true;
    this.selectedProgram = 'EC7';
    this.isEcfChoiceEightSelected = false;
    this.isPaceSelected = false;
    this.cacSelected = false;
    this.isIcfIidSelected = false;
    if(this.programName){
      if(this.programName !== this.selectedProgram){
        this.enrollmentNote = true;
      }else{
        this.enrollmentNote = false;
      }
    }

  }

  onEcfChoiceEightClicked() {
    this.isKbProgramSelected = false;
    this.isChoicesGroupOneSelected = false;
    this.isChoicesHcbsSelected = false;
    this.isEcfChoiceFourSelected = false;
    this.isEcfChoiceFiveSelected = false;
    this.isEcfChoiceSixSelected = false;
    this.isEcfChoiceSevenSelected = false;
    this.isEcfChoiceEightSelected = true;
    this.selectedProgram = 'EC8';
    this.isPaceSelected = false;
    this.cacSelected = false;
    this.isIcfIidSelected = false;
    if(this.programName){
      if(this.programName !== this.selectedProgram){
        this.enrollmentNote = true;
      }else{
        this.enrollmentNote = false;
      }
    }

  }

  onPaceClicked() {
    this.isKbProgramSelected = false;
    this.isChoicesGroupOneSelected = false;
    this.isChoicesHcbsSelected = false;
    this.isEcfChoiceFourSelected = false;
    this.isEcfChoiceFiveSelected = false;
    this.isEcfChoiceSixSelected = false;
    this.isEcfChoiceSevenSelected = false;
    this.isEcfChoiceEightSelected = false;
    this.isPaceSelected = true;
    this.selectedProgram = 'PACE';
    this.cacSelected = false;
    this.isIcfIidSelected = false;

  }

  onIcfIidClicked(){
    this.isKbProgramSelected = false;
    this.isChoicesGroupOneSelected = false;
    this.isChoicesHcbsSelected = false;
    this.isEcfChoiceFourSelected = false;
    this.isEcfChoiceFiveSelected = false;
    this.isEcfChoiceSixSelected = false;
    this.isEcfChoiceSevenSelected = false;
    this.isEcfChoiceEightSelected = false;
    this.isPaceSelected = false;
    this.cacSelected = false;
    this.isIcfIidSelected = true;
    this.selectedProgram = 'ICF';

  }

  onCacClicked() {
    this.isKbProgramSelected = false;
    this.isChoicesGroupOneSelected = false;
    this.isChoicesHcbsSelected = false;
    this.isEcfChoiceFourSelected = false;
    this.isEcfChoiceFiveSelected = false;
    this.isEcfChoiceSixSelected = false;
    this.isEcfChoiceSevenSelected = false;
    this.isEcfChoiceEightSelected = false;
    this.isPaceSelected = false;
    this.cacSelected = true;
    this.selectedProgram = 'CAC';
    this.isIcfIidSelected = false;

  }
  back(){
    if(this.selectedProgram === 'KB'){
      this.router.navigate(['/ltss/pae/paeStart/appointment']);
    } else {
    this.router.navigate(['/ltss/pae/paeStart/livingArrangement']);
    }
  }
}
