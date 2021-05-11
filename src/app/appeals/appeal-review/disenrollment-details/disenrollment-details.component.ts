import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { AppealService } from '../../services/appeal.service';
import * as customValidation from '../../../_shared/constants/validation.constants';
import * as Constants from '../../../_shared/constants/application.constants';
import * as CryptoJS from 'crypto-js';

const ELEMENT_DATA: any[] = [
  {
    documentType: 'Plan of Care',
    selection: 'hjhdfj',
    isSelected:false,
    name:'docsReqPlancareSw'
  },
  {
    documentType: 'Risk Agreement',
    selection: 'hjhdfj',
    isSelected:false,
    name: 'docsReqRiskAgrmtSw'
  },
  {
    documentType: 'Cost Neutrality',
    selection: 'hjhdfj',
    isSelected:false,
    name: 'docsReqCostNeuSw'
  },
  {
    documentType: 'CC Notes',
    selection: 'hjhdfj',
    isSelected:false,
    name: 'docsReqCcnotesSw'
  },
  {
    documentType: 'Incident Reports (Provider/Police)',
    selection: 'hjhdfj',
    isSelected:false,
    name: 'incidentReportSw'
  },
  {
    documentType: 'Other',
    selection: 'hjhdfj',
    isSelected:false,
    name:'othrSw'
  }
];

@Component({
  selector: 'app-disenrollment-details',
  templateUrl: './disenrollment-details.component.html',
  styleUrls: ['./disenrollment-details.component.scss']
})
export class DisenrollmentDetailsComponent implements OnInit {

  yesOrNo: any[] = [{code:'Y', value:'Yes'},{code:'N', value:'No'}]
  disenrollmentDetailsForm: FormGroup;
  showLetterMailed: boolean;
  showMcoDocuments: boolean;
  dataSource = ELEMENT_DATA;
  isDocumentSelected: boolean;
  panelOpenState: boolean;
  dataSourceSecond: MatTableDataSource<any> = new MatTableDataSource();
  displayedColumns: string[] = ['documentType','selection'];
  showOtherDocComments: boolean;
  displayedColumnsforSecondTable = ['documentRequestDate', 'documentStatus','dueDate', 'documentsReturned','requestingUser'];
  showSecondTable: boolean;
  @Output() emitSaveDisenrollment: EventEmitter<any> = new EventEmitter<any>();
  @Input() showDisenrollOrEnroll: boolean;
  showMCOoffNFCare: boolean;
  @Input() appellantInfo: any;
  @Input() appealReviewOnLoad: any;
  secondTabledataSource: any[] = [{
    documentRequestDate: null,
    documentStatus: {code:null, value:null},
    dueDate:null,
    documentsReturned:null,
    requestingUser:null,
    userAction:'CANCEL REQUEST',
    othrComments: null
  }];
  requestSubmitted: boolean;
  submitted: boolean;
  customValidation = customValidation;
  docValidation: boolean;
  startDate = new Date();

  constructor(private formBuilder: FormBuilder, private appealService: AppealService) { }

  ngOnInit(): void {
    const timeTravelData = localStorage.getItem('TIME_TRAVEL_DATA');
    if(timeTravelData) {
      const timeTravelDataJson = JSON.parse(CryptoJS.AES.decrypt(timeTravelData, Constants.APP_ENC_DECRYPT_KEY).toString(CryptoJS.enc.Utf8));
      console.log("timeTravelDataJson ", timeTravelDataJson);
      if(timeTravelDataJson.timeTravelFlag && timeTravelDataJson.currentDate) {
        this.startDate = new Date(timeTravelDataJson.currentDate);
      }
    }
    this.initializeDisenrollmentDetailsForm();
  }

  ngOnChanges(){
    if(this.appellantInfo){
      if(this.appellantInfo.programType == 'CG2' || this.appellantInfo.programType == 'CG3' ){  
        this.showMCOoffNFCare =  true;
      } else {
        this.showMCOoffNFCare =  false;
      }
    }
    
  }

  initializeDisenrollmentDetailsForm(){
    this.disenrollmentDetailsForm = this.formBuilder.group({
      disEnrollReasRadio:['', Validators.required],
      letterMailedRadio:['N'],
      nfCareRadio:['N'],
      mcoRadio:['', Validators.required],
      otherDocuments:[''],
      docReqDueDate:[''],
      documentSelected:[null]
    })
   }

   
  getFormData() {
    return this.disenrollmentDetailsForm.controls;
  }


   disenrollReaChange(value){
     if(value == 'N'){
      this.disenrollmentDetailsForm.get('letterMailedRadio').setValidators([Validators.required]);
      this.showLetterMailed = true;
     } else {
      this.showLetterMailed = false;
      this.disenrollmentDetailsForm.get('letterMailedRadio').setValidators(null);
     }
     this.disenrollmentDetailsForm.get('letterMailedRadio').updateValueAndValidity();
   }

   mcoChange(value){
    if(value == 'Y'){
      this.disenrollmentDetailsForm.get('docReqDueDate').setValidators([Validators.required]);
      this.showMcoDocuments = true;
    } else {
      this.disenrollmentDetailsForm.get('docReqDueDate').setValidators(null);
      this.showMcoDocuments = false;
      this.showOtherDocComments = false;
    }
    this.disenrollmentDetailsForm.get('docReqDueDate').updateValueAndValidity();
   }

   documentSelected(element){
      element.isSelected = !element.isSelected;
      if(element.documentType === 'Other'){
        if(element.isSelected){
          this.showOtherDocComments = true;
        } else {
          this.showOtherDocComments = false;
        }
      }
      let docSelected = this.dataSource.some( data => data.isSelected === true);
      if(docSelected){
        this.docValidation = false;
      } else {
        this.docValidation = true;
      }
   }

    saveDisenrollmentDetails(disenrollmentDetailsForm){
      this.submitted = true;
      let docSelected = this.dataSource.some( data => data.isSelected === true)
      if( this.showMcoDocuments && !docSelected){
        this.docValidation = true;
        return;
      } else {
        this.docValidation = false;
      }
      let formValues  = disenrollmentDetailsForm.value;
      if(disenrollmentDetailsForm.valid){
        let payLoad = {
          "corctnLtrMailedSw": formValues.letterMailedRadio,
          "disenrRsnCorctnSw": formValues.disEnrollReasRadio,
          "docsReqFromMcoSw": formValues.mcoRadio,
          "mcoNfcareOfferSw": formValues.nfCareRadio,
          "docsDueDt":formValues.docReqDueDate,
          "docsReturnedDt":null,
          "docsStatusCd":null,
          "othrComments":formValues.otherDocuments,
          "createdBy":null,
          "docsRqstDt":new Date()
        }
        this.dataSource.forEach( data => {
          payLoad[data.name] = data.isSelected ? 'Y' : 'N'
        })
        this.appealService.saveDisenrollment(this.appellantInfo.aplId, payLoad).subscribe(res => {
            this.emitSaveDisenrollment.emit(true);
         this.getDisenrollHistory();
         });
      } else {
        return;
      }
    }

   getDisenrollHistory(){
    this.appealService.getDisenrollHistoryData(this.appellantInfo.aplId).subscribe( res => {
      const historyTableData = res;
      console.log(historyTableData);
      this.showSecondTable = true;
      this.dataSourceSecond = new MatTableDataSource(historyTableData);
     });
   }
    
}
