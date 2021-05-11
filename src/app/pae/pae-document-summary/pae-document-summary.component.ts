import { PaeService } from 'src/app/core/services/pae/pae.service';
import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomvalidationService } from '../../_shared/utility/customvalidation.service';
import * as customValidation from '../../_shared/constants/validation.constants';
import { Subscription } from 'rxjs/internal/Subscription';
import { MatRadioChange, MatRadioButton } from '@angular/material/radio';
import { FileUploadComponent } from '../../_shared/modal/file-upload/file-upload.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { UploadDocumentsPopupComponent } from '../../rightnav/upload-documents-popup/upload-documents-popup.component'
import { PaeCommonService } from 'src/app/core/services/pae/pae-common/pae-common.service';
import { PaeFlowSeq } from 'src/app/_shared/utility/PaeFlowSeq';
import { PaeDocumentSummaryService } from '../../core/services/pae/pae-document-Summary/pae-document-summary.service';
import { RightnavToggleService } from 'src/app/_shared/services/rightnav-toggle.service';
import { physicalHisdetails } from 'src/app/_shared/model/phyHisDetails'
import { SavePopupComponent } from 'src/app/savePopup/savePopup.component';
import { PaeSisInformantComponent } from 'src/app/pae/pae-sis-informant/pae-sis-informant.component'
import { PaeCertificationOfAssessmentComponent } from '../pae-certification-of-assessment/pae-certification-of-assessment.component';
import { ComponentCanDeactivate } from 'src/app/core/helpers/pending-change.guard';
import { Observable } from 'rxjs';
import { Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { SafetyAttestationPopOpComponent } from '../safety-attestation-pop-op/safety-attestation-pop-op.component';


@Component({
  selector: 'app-pae-document-summary',
  templateUrl: './pae-document-summary.component.html',
  styleUrls: ['./pae-document-summary.component.scss']
})



export class paeDocumentSummaryComponent implements OnInit, OnDestroy, ComponentCanDeactivate {
  @ViewChild(FileUploadComponent) fileUpload: FileUploadComponent

  subscribed: Array<Subscription> = [];
  showResult: boolean = true;
  applicantName: any;
  sampleDocument: "https://www.antennahouse.com/hubfs/xsl-fo-sample/pdf/basic-link-1.pdf?hsLang=en"

  locDeterminationData = [];
  financialData = [];
  partBslotData = [];
  partAslotData = [];
  partBPaeData = [];
  partBlocData = [];
  partAPaeData = [];
  partAlocData = [];
  disenrollment1Data = [];
  disenrollment2Data = [];
  customValidation = customValidation;
  paeFormGroup: FormGroup;
  documentSummary: any;
  isskillUploaded = false;
  isfunUploaded = false;
  ismedUploaded = false;
  isPhyUploaded = false;
  issafetyUploaded = false;
  iscertUploaded = false;
  isCertUploadeddesc = false;
  isphyhisUploaded = false;
  isIcapUploaded = false;
  docLinkMap: any;

  // docLinks: Array<any> = [{
  //     title: 'SIS Informant Form',
  //     saved: false,
  //     type: 'popup',
  //     id: 'sisFormEfill'
  // }];

  supportingDocuments = [
    { name: 'Upload Documents', icon: 'cloud_upload', class: "blue" },
    { name: 'Uploaded Successully', icon: 'done', class: "green" },
    { name: 'View Documents', icon: 'email', class: "blue" }
  ];

  Document_Type =
  [{"code": "SIS", "value":"SIS Assessment","activateSW":"Y"},
  {"code": "MDR", "value":"Medical Records","activateSW":"Y"},
  {"code": "HAP", "value":"Recent History and Physical","activateSW":"Y"},
  {"code": "COA", "value":"Certification of Assessment","activateSW":"Y"},
  {"code": "HCA", "value":"HCBS Applicant Tool","activateSW":"Y"},
  {"code": "HCC", "value":"HCBS Collateral Tool","activateSW":"Y"},
  {"code": "PSY", "value":"Psychological Evaluation","activateSW":"Y"},
  {"code": "FPA", "value":"Family Participation Agreement","activateSW":"Y"},
  {"code": "7CF", "value":"Group 7 Certification Form","activateSW":"Y"},
  {"code": "8CF", "value":"Group 8 Certification Form","activateSW":"Y"},
  {"code": "CRT", "value":"Physician Certification of LOC","activateSW":"Y"},
  {"code": "REQ", "value":"Request Form ","activateSW":"Y"},
  {"code": "EFP", "value":"Eating or Feeding Plan","activateSW":"Y"},
  {"code": "PHO", "value":"Physician's Order","activateSW":"Y"},
  {"code": "LAB", "value":"Lab Report","activateSW":"Y"},
  {"code": "WND", "value":"Wound Assessment","activateSW":"Y"},
  {"code": "BGM", "value":"Blood Glucose Monitoring","activateSW":"Y"},
  {"code": "THE", "value":"OT/PT Evaluation","activateSW":"Y"},
  {"code": "SUC", "value":"Suctioning Frequency","activateSW":"Y"},
  {"code": "TEP", "value":"Teaching Plan","activateSW":"Y"},
  {"code": "TCP", "value":"Treatment/Care Plan","activateSW":"Y"},
  {"code": "5SC", "value":"Score 5-8 with Safety Concerns","activateSW":"Y"},
  {"code": "P6M", "value":"Prior 6 Months","activateSW":"Y"},
  {"code": "RCE", "value":"Recent Events","activateSW":"Y"},
  {"code": "SFE", "value":"Safety Explanation","activateSW":"Y"},
  {"code": "CIN", "value":"Change in Needs","activateSW":"Y"},
  {"code": "CIC", "value":"Change in Primary Caregiver Status","activateSW":"Y"},
  {"code": "DOF", "value":"Documentation of Falls","activateSW":"Y"},
  {"code": "IAD", "value":"Inpatient Admissions/ER Visits","activateSW":"Y"},
  {"code": "APS", "value":"APS/Police Involvement","activateSW":"Y"},
  {"code": "CBR", "value":"CBRA Discharge","activateSW":"Y"},
  {"code": "OSC", "value":"Other Safety Concerns","activateSW":"Y"},
  {"code": "CAN", "value":"Comprehensive Needs Assessment","activateSW":"Y"},
  {"code": "POC", "value":"Plan of Care or Support Plan","activateSW":"Y"},
  {"code": "MLB", "value":"Maladaptive Behavior Assessment (MBA and MBI)","activateSW":"Y"},
  {"code": "IAR", "value":"Interagency Review and Decision","activateSW":"Y"},
  {"code": "FOC", "value":"Freedom of Choice Form ","activateSW":"Y"},
  {"code": "ILA", "value":"SAMS ILA Assessment","activateSW":"Y"},
  {"code": "DOR", "value":"Doctor's office records (notes)","activateSW":"Y"},
  {"code": "TON", "value":"Therapy orders and notes","activateSW":"Y"},
  {"code": "HNN", "value":"Home health or nursing orders and notes","activateSW":"Y"},
  {"code": "EOB", "value":"EOBs from your insurance company","activateSW":"Y"},
  {"code": "PON", "value":"Physician's Orders for NF Service","activateSW":"Y"},
  {"code": "LNF", "value":"Level of NF Reimbursement Requested","activateSW":"Y"},
  {"code": "PC", "value":"Plan of Care","activateSW":"Y"},
  {"code": "RAG", "value":"Risk Agreement","activateSW":"Y"},
  {"code": "CON", "value":"Cost Neutrality","activateSW":"Y"},
  {"code": "REC", "value":"ECF Recertification Form","activateSW":"Y"},
  {"code": "REP", "value":"Recertification Paper Form","activateSW":"Y"},
  {"code": "RET", "value":"PAE Recertification","activateSW":"Y"},
  {"code": "DIS", "value":"Disenrollment Form","activateSW":"Y"},
  {"code": "CEA", "value":"CEA Determination","activateSW":"Y"},
  {"code": "GRP", "value":"Request to Enroll in Group 4","activateSW":"Y"},
  {"code": "ENR", "value":"Enrollment Request Form","activateSW":"Y"},
  {"code": "APR", "value":"Appeal Request","activateSW":"Y"},
  {"code": "DOC", "value":"Doctors Note","activateSW":"Y"},
  {"code": "APL", "value":"Appellant Letters","activateSW":"Y"},
  {"code": "MED", "value":"Medical Documentation","activateSW":"Y"},
  {"code": "ONS", "value":"Onsite Assessment","activateSW":"Y"},
  {"code": "HOS", "value":"Hospital Records","activateSW":"Y"},
  {"code": "NUR", "value":"Nursing Notes","activateSW":"Y"},
  {"code": "HHR", "value":"Home Health Records","activateSW":"Y"},
  {"code": "ADL", "value":"ADL Flow Chart","activateSW":"Y"},
  {"code": "HPO", "value":"H&P","activateSW":"Y"},
  {"code": "MAR", "value":"MARs","activateSW":"Y"},
  {"code": "ONH", "value":"On Hold- Call Logs","activateSW":"Y"},
  {"code": "PER", "value":"Person centered support plan","activateSW":"Y"},
  {"code": "COT", "value":"Cost Neutrality","activateSW":"Y"},
  {"code": "CCN", "value":"CC Notes","activateSW":"Y"},
  {"code": "IRP", "value":"Indecent Reports- Provider  ","activateSW":"Y"},
  {"code": "POL", "value":"Indecent Reports- Police","activateSW":"Y"},
  {"code": "WIT", "value":"Withdrawal letter","activateSW":"Y"},
  {"code": "RES", "value":"Reschedule letter","activateSW":"Y"},
  {"code": "NOH", "value":"Notice of Hearing","activateSW":"Y"},
  {"code": "NOA", "value":"Notice of appeal of Initial Order","activateSW":"Y"},
  {"code": "NHE", "value":"Nurse hearing reference form","activateSW":"Y"},
  {"code": "BAL", "value":"Briefs as requested by ALJ","activateSW":"Y"},
  {"code": "BCD", "value":"Briefs as requested by CD","activateSW":"Y"},
  {"code": "MOT", "value":"Motion to Dismiss","activateSW":"Y"},
  {"code": "SUG", "value":"Notices of suggestion of death","activateSW":"Y"},
  {"code": "ORD", "value":"Orders","activateSW":"Y"},
  {"code": "PET", "value":"Petition Request to CD for Final Order","activateSW":"Y"},
  {"code": "JUD", "value":"Petition Request to Judge for Initial Order","activateSW":"Y"},
  {"code": "SUP", "value":"Supplemental","activateSW":"Y"},
  {"code": "MCO", "value":"MCO Checklist","activateSW":"Y"},
  {"code": "OTH", "value":"Other","activateSW":"Y"},
  {"code": "MDL", "value":"Mailed Letter","activateSW":"Y"},
  {"code": "TPD", "value":"TP Documents","activateSW":"Y"},
  {"code": "ICAP", "value":"ICAP","activateSW":"Y"},
  {"code": "OSD", "value":"Other Supporting Documents","activateSW":"Y"},
  {"code": "RHMR", "value":"Recent History and Physical or Recent Medical Records","activateSW":"Y"},
  {"code": "HACT", "value":"HCBS Applicant/Collateral Tools","activateSW":"Y"},
  {"code": "PSE", "value":"Psychological Evaluation","activateSW":"Y"},
  {"code": "PCL", "value":"Physician Certification of LOC","activateSW":"Y"},
  {"code": "G7CF", "value":"Group 7 Certification Form","activateSW":"Y"},
  {"code": "G8CF", "value":"Group 8 Certification Form","activateSW":"Y"},
  {"code": "EMD", "value":"Evidence of Medical Diagnosis","activateSW":"Y"},
  {"code": "EFA", "value":"Evidence of Functional Assessment","activateSW":"Y"},
  {"code": "ESS", "value":"Evidence of Skilled Services","activateSW":"Y"},
  {"code": "ESA", "value":"Evidence of Safety Assessment","activateSW":"Y"},
  {"code": "REG4", "value":"Request to Enroll in Group 4","activateSW":"Y"},
  {"code": "RCF", "value":"Recertification Form","activateSW":"Y"},
  {"code": "SNS", "value":"Skilled Nursing Services","activateSW":"Y"},
  {"code": "AOB", "value":"Aggressive and Offensive Behaviors","activateSW":"Y"},
  {"code": "CMHS", "value":"Crisis Mental Health Services","activateSW":"Y"},
  {"code": "ITS", "value":"Intensity Therapy Services","activateSW":"Y"},
  {"code": "HRB", "value":"High-Risk Behaviors","activateSW":"Y"},
  {"code": "CJS", "value":"Criminal Justice System","activateSW":"Y"},
  {"code": "SIB", "value":"Self-Injurious Behaviors","activateSW":"Y"},
  {"code": "LBC", "value":"Lack of Behavioral Control","activateSW":"Y"},
  {"code": "CPS", "value":"Child Protective Services","activateSW":"Y"},
  {"code": "IDD", "value":"Intellectual and/or Developmental Disability","activateSW":"Y"},
  {"code": "PRD", "value":"Physician Review Documents","activateSW":"Y"},
  {"code": "DEF", "value":"Disenrollment Form","activateSW":"Y"},
  {"code": "ONSA", "value":"Onsite Assessment","activateSW":"Y"},
  {"code": "AHD", "value":"Appeal Hearing Documents","activateSW":"Y"},
  {"code": "ADP", "value":"Attestation of the Developmental Period","activateSW":"Y"}]
  nextPage: any;
  pageId: any;
  paeId = this.paeCommonService.getPaeId();
  subscription1$: Subscription;
  subscriptions: Subscription[] = [];
  backSubscription$: Subscription;
  refId: any;
  aplId: any;
  docTypes: any;
  rightnavData: any;
  programCd: any;
  isSisInformant = false;
  isSamePageNavigation: boolean;
  uploadData: any;
  programCode: any;
  isEC5Program: boolean = false;
  valueSubmittedinthecomponent: any;
  isAssessment: boolean;
  subscription: Subscription;
  dialogRef : any;
   isReqForIcap: boolean = false;
  isSaUploaded = false;
  isSisInformantFormFinished = false;


  constructor(
    fb: FormBuilder,
    private router: Router,
    private paeService: PaeService,
    private customValidator: CustomvalidationService,
    private paeCommonService: PaeCommonService,
    private customValidationService: CustomvalidationService,
    private paeDocummentSummaryService: PaeDocumentSummaryService,
    private rightnavToggleService: RightnavToggleService,
    public dialog: MatDialog,
    public matDialogRef: MatDialogRef <any>
  ) {

    this.paeFormGroup = fb.group({
      //pageChoice: ['', [Validators.required]],
      pageChoice: [''],
      locCertifierName: ['', [Validators.required, this.customValidationService.specialCharacterValidator(), Validators.max(45)]],
      // nPI: ['', [Validators.required, this.customValidationService.specialCharacterValidator(), Validators.max(45)]],
      nPI: [''],
      medicaidId: ['', [Validators.required, this.customValidationService.specialCharacterValidator(), Validators.max(45)]],
      credentials: ['', [Validators.required]],
    });

    this.getDocumentData();

  }

  ngOnInit() {
    this.pageId = 'PPSDD';
    this.paeId = this.paeCommonService.getPaeId();
    this.rightnavData = this.rightnavToggleService.getRightnavData();
    this.programCd = this.paeCommonService.getProgramName()
    if(this.programCd === 'EC6')
    {
      this.isSisInformant = true;
    }
    this.getPaeDocumentSummaryData();
    if (this.paeCommonService.getApplicantName() === null || this.paeCommonService.getApplicantName() === '' || this.paeCommonService.getApplicantName() === undefined){
		this.getApplicantName();
	} else {
		this.applicantName =  this.paeCommonService.getApplicantName();
  }
  this.programCode = this.paeCommonService.getProgramName();
    if (this.programCode === 'EC5') {
       this.isEC5Program = true;
     }
  console.log(" program=" +this.isEC5Program);
this.isReqForIcap = this.paeCommonService.getReqIcap();
  this.paeService.getCertificationOfAssessment(this.paeCommonService.getPaeId()).then((response)=> {

    if(response.id !== null && response.id !== undefined && response.id !== '')
    {
      this.iscertUploaded = true
    }
    else{
      this.iscertUploaded = false;
    }
  });

    }

  // get isEC5ProgramVisible() : boolean {
  //   return this.paeCommonService.getProgramName() === 'EC5';
  // }
  getApplicantName(){
    this.paeService.getPaeApplicantInformation(this.paeCommonService.getPaeId(),this.pageId).then((response)=> {
      console.log("reponseforName"+JSON.stringify(response.body.firstName));
      this.applicantName =  response.body.firstName+" "+response.body.lastName;
	  this.paeCommonService.setApplicantName(this.applicantName);
    });
  }

  openForm()
  {
    const dialogConfig = new MatDialogConfig();
      dialogConfig.data = { route: 'ltss/pae' };
      dialogConfig.panelClass = 'exp_popup';
      dialogConfig.width = '60vw';
      dialogConfig.height = '40vw';
       this.dialogRef = this.dialog.open(PaeCertificationOfAssessmentComponent, dialogConfig);
       this.dialogRef.afterClosed().subscribe((data) => {
         if(data.isUploaded)
         {
           this.iscertUploaded = true;
         }
         else{
           this.iscertUploaded = false;
         }
       });


  }

  closePopup(){
    this.paeCommonService.getisCertUploded();
    //this.PaeCertificationOfAssessmentComponent.emit();
    console.log('tested');
  }


  openFormSa()
    {
      const dialogConfig = new MatDialogConfig();
        dialogConfig.data = { route: 'ltss/pae' };
        // console.log(" progrAM" +this.programCode);
        // this.programCode=='EC5';
        dialogConfig.panelClass = 'exp_popup';
        dialogConfig.width = '55vw';
        dialogConfig.height = '40vw';
        this.dialogRef=  this.dialog.open(SafetyAttestationPopOpComponent, dialogConfig);
        this.dialogRef.afterClosed().subscribe((data) => {
          if(data.isUploaded)
          {
            this.isSaUploaded = true;
          }
          else{
            this.isSaUploaded = false;
          }
        });
  }

  getPaeDocumentSummaryData() {
    // const paeId = this.paeService.getPaeId();
    const pageId = 'PPBBS';
    // const paeId = this.paeCommonService.getPaeId();
    this.paeService.getPaeDocumentSummary(this.paeId).then((response) => {
      console.log('response===', response);
      if (response.status === 200) {
        this.documentSummary = response.body;
        console.log(this.documentSummary);
      }
    });
  }




  // postPhyData()
  // {
  //   const phyHistoryData = [];
  //   phyHistoryData.push({
  //   'locCertifierName': this.paeFormGroup.controls.locCertifierName.value,
  //   'nPI' :this.paeFormGroup.controls.nPI.value,
  //   'medicaidId': this.paeFormGroup.controls.medicaidId.value,
  //   'credentials': this.paeFormGroup.controls.credentials.value
  //   });

  //   if(this.isPhyUploaded === true) {

  //     const phyHisdetails  = new physicalHisdetails(
  //     this.paeId,
  //     phyHistoryData
  //     );

  //     const that = this;
  //     this.paeDocummentSummaryService.postPhyData(phyHisdetails).subscribe((res) => {
  //     console.log('res', res);
  //     });

  //   }
  // }

  openDocument(url) {
    window.open("http://www.africau.edu/images/default/sample.pdf", '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes');
  }

  sisInformantPopup() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'exp_popup';
    dialogConfig.width = '70vw';
    dialogConfig.height = '85vh'
    dialogConfig.autoFocus = false;
    this.dialogRef = this.dialog.open(PaeSisInformantComponent, dialogConfig);

    this.dialogRef.afterClosed().subscribe((data) => {
      if(data.isUploaded)
      {
        this.isSisInformantFormFinished = true;
      }
      else{
        this.isSisInformantFormFinished = false;
      }
    });
  }

  openUploadDocument() {
    this.rightnavToggleService.emitToRightNavComp$.next('UPLOAD_DOC');
  }

  getDocumentData()
  {
    this.paeDocummentSummaryService.getDocumentSummary(this.paeId)
    .subscribe((response) => {
      console.log(response);
      console.log(response[0].documentType);
      console.log(response.length);
      for(let i=0;i<= response.length; i++)
      {
        //console.log(response[i].documentType);
      if(response[i].documentType[0] === 'EMD')
      {
        this.ismedUploaded = true;
      }
      if(response[i].documentType[0] === 'EFA')
      {
        this. isfunUploaded= true;
      }
      if(response[i].documentType[0] === 'ESS')
      {
        this.isskillUploaded = true;
      }
      if(response[i].documentType[0] === 'ESA')
      {
        this.issafetyUploaded = true;
      }
      if(response[i].documentType[0] === 'HAP')
      {
        this.isphyhisUploaded = true;
      }
      if(response[i].documentType[0] === 'CRT')
      {
        this.isPhyUploaded = true;
      }
      if(response[i].documentType[0] === 'ICAP')
      {
        this.isIcapUploaded = true;
      }
    }
    });

  }

  uploadDocument() {
    this.openUploadDocument();
    console.log("upload document");
  }

  onSubmit() {
    //tbd
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  next(showPopup?:boolean) {
    this.isSamePageNavigation =  true;
    this.subscription1$ = this.paeService.getSummaryNextPage(this.paeId, this.pageId).subscribe((response) => {
      console.log(response);
      const nextPath = PaeFlowSeq[response.nextSummaryPage];
      if(showPopup){
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = { route: 'ltss/pae' };
       // dialogConfig.data = { route: 'ltss/pae' , nextRoute: '/ltss/pae/paeStart/' + this.nextPath };
        dialogConfig.panelClass = 'exp_popup';
        dialogConfig.width = '648px';
        dialogConfig.height = '360px';
        this.dialog.open(SavePopupComponent, dialogConfig );
      } else {
        this.router.navigate(['/ltss/pae/paeStart/' + nextPath]);
      }
    }, err => {
      console.log(err);
    });
    this.subscriptions.push(this.subscription1$);
  }
  gotoback() {
    this.isSamePageNavigation =  true;
    // this.router.navigate(['/dashboard/pae/paeStart/IddDeterminationSummary']);
    this.backSubscription$ = this.paeService.getSummaryNextPage(this.paeId, this.pageId).subscribe((response) =>
  {
    const backPath = PaeFlowSeq[response.prevSummaryPage];
    this.router.navigate(['/ltss/pae/paeStart/' + backPath]);
  }, err => {
    console.log(err);
  });
  this.subscriptions.push(this.backSubscription$);
  }
  saveAndExit() {
      this.next(true);
  }

  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    console.log(this.paeFormGroup)
   return this.isSamePageNavigation ? true : !this.paeFormGroup.dirty;
  }

  resetForm(){
    this.paeFormGroup.reset();
  }
}
