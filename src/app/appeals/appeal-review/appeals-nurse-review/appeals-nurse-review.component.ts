import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppealService } from '../../services/appeal.service';
import * as customValidation from '../../../_shared/constants/validation.constants';
import { MatTableDataSource } from '@angular/material/table';
import * as Constants from '../../../_shared/constants/application.constants';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-appeals-nurse-review',
  templateUrl: './appeals-nurse-review.component.html',
  styleUrls: ['./appeals-nurse-review.component.scss']
})
export class AppealsNurseReviewComponent implements OnInit {
   customValidation = customValidation;
   panelOpenState = false
   displayedColumnsforSecondTable = ['anrStartDt', 'anrDueDt','anrStatusCd', 'anrCompletedDt','createdBy'];
   nurseReviewStatus: any[] = []
   maxDate: Date;
   @Input() appealType: string;
   disableAccordion:boolean = false;
   @Input() toEnableAccordion: any;
   appealNurseReviewForm: FormGroup;
   @Output() emitAppealNurseReviewSaved: EventEmitter<any> = new EventEmitter<any>();
   showAppealNurseReviewAccordion: boolean;
   dataSourceSecond: MatTableDataSource<any> = new MatTableDataSource();
   @Input() appealId: any;
  appealNurseTableData: any[] = [];
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
    this.initializeAppealOverviewForm();
    this.maxDate = new Date();
    this.appealService.getAppealDropdowns('NURSEREVIEW_STATUS').subscribe(res => {
      this.nurseReviewStatus = res;
    });
  }

  initializeAppealOverviewForm(){
    this.appealNurseReviewForm = this.formBuilder.group({
      appealComments:['', Validators.required],
      safetyRevComments:['', Validators.required],
      additionalInfoReq:[''],
      addInfoRequestDate:[''],
      addInfoReturnedDate:[''],
      appealNursRevStatus:['', Validators.required],
    })
   }

   
  ngOnChanges(){
    if(this.appealId){
      this.appealService.getAppealNurseRev(this.appealId).subscribe(res => {
        this.setNurseReviewHistoryTable();
      }); 
    }
    if(this.appealType){
      if(this.appealType == 'PA' || this.appealType == 'RF' || this.appealType == 'PR'){
        this.showAppealNurseReviewAccordion = true;
      } else {
        this.showAppealNurseReviewAccordion = false;
      }
    }
    if(this.toEnableAccordion  == 'Y'){
     this.disableAccordion = false;
    } else {
     this.disableAccordion = true;
    }
   }

   saveAppealurseReview(appealNurseReviewForm){
    const nurseReview = appealNurseReviewForm.value;
    const payLoad = {
      addInfoReturnedDt: nurseReview.addInfoReturnedDate,
      addInfoRqstd: nurseReview.additionalInfoReq,
      addInfoRqstdDt: nurseReview.addInfoRequestDate,
      anrStatusCd: nurseReview.appealNursRevStatus,
      reviewAplComments: nurseReview.appealComments,
      safetyReviewComments: nurseReview.safetyRevComments
    };
      if(appealNurseReviewForm.valid){
         this.appealService.saveAppealNurseReview(this.appealId, payLoad).subscribe(res => {
             this.setNurseReviewHistoryTable();
             this.emitAppealNurseReviewSaved.emit(true);
          });
      }
   }

   setNurseReviewHistoryTable(){
      this.appealService.getNurseReviewHistoryData(this.appealId).subscribe(res => {
        const historydata = res;
        this.nurseReviewStatus.forEach( ele => {
              if(historydata.status === ele.code){
                historydata.status = ele.value;
              }
        });
        this.dataSourceSecond = new MatTableDataSource(historydata);
    });
   }

}
