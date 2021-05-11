import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation  } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { forkJoin } from 'rxjs';
import { fromEvent } from 'rxjs';
import { NoticesService } from '../services/notices.service';
import { debounceTime, map, distinctUntilChanged, filter } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { StaticDataMapService } from '../../core/helpers/static.data.map.service';
import * as Constants from '../../_shared/constants/application.constants';
import * as CryptoJS from 'crypto-js';



const ELEMENT_DATA: any[] = [];

@Component({
  selector: 'app-notices-dashboard',
  templateUrl: './notices-dashboard.component.html',
  styleUrls: ['./notices-dashboard.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class NoticesDashboardComponent implements OnInit {
  noticeForm: FormGroup;
  displayedColumns: string[] = ['personName', 'ssn', 'noticesType', 'programType', 'generateDate', 'noticeStatus','printType'];
  dataSource: MatTableDataSource<Notification> = new MatTableDataSource(ELEMENT_DATA);
  expandedElement;
  @ViewChild('applicantNameInput', { static: true }) applicantNameInput: ElementRef;
  programTypes:any[];
  noticeTypes:any[];
  printTypes:any[];
  noticeStatus:any[];
  personOptions:any[] = [];
  personDisplayName: string;
  selectedPersonId:number;
  noticeRecords:any[];
  subscriptions$:any[] = [];
  generateNotices:any[];
  noticesTemplate:any[];
  recipientTypes:any[];
  localStorageLocal = localStorage.getItem('APP_STORAGE_TOKEN');
  userId = JSON.parse(this.localStorageLocal).userName;
  entityId = JSON.parse(this.localStorageLocal).entityId;
  startDate = new Date();

  constructor(private fb: FormBuilder, 
              private noticesService: NoticesService,
              private staticDataService: StaticDataMapService, 
              private toastr: ToastrService) { }

  sortData(data) {
    if(data) {
     return data.sort(function (a, b){
        return a.value < b.value ? -1 : 1;
      });
    }
    return data;
  }

  ngOnInit(): void {
    const timeTravelData = localStorage.getItem('TIME_TRAVEL_DATA');
    if(timeTravelData) {
      const timeTravelDataJson = JSON.parse(CryptoJS.AES.decrypt(timeTravelData, Constants.APP_ENC_DECRYPT_KEY).toString(CryptoJS.enc.Utf8));
      console.log("timeTravelDataJson ", timeTravelDataJson);
      if(timeTravelDataJson.timeTravelFlag && timeTravelDataJson.currentDate) {
        this.startDate = new Date(timeTravelDataJson.currentDate);
      }
    }
    this.noticeForm = this.fb.group({
      personSearch: [''],
      referralId: [''],
      paeId: [''],
      programType: [''],
      noticeType: [''],
      noticeStatus: [''],
      printType: [''],
      noticeGeneratedate: [''],
      noticeEffectivedate: [''],
      apealId: ['']
    });
    let observables = [];
    observables.push(this.noticesService.getProgramTypes());
    observables.push(this.noticesService.getNoticeTypes());
    observables.push(this.noticesService.getPrintType());
    observables.push(this.noticesService.getNoticeStatus());
    observables.push(this.noticesService.getRecipientTypes());
    forkJoin(observables).subscribe((res: any) => {
      this.programTypes = this.sortData(res[0]);
      this.noticeTypes = this.sortData(res[1]);
      this.printTypes = this.sortData(res[2]);
      this.noticeStatus = this.sortData(res[3]);
      this.recipientTypes = this.sortData(res[4]);
    });
    this.getAllPersonDetails();
  }

  getCountyName(personCountycd) {
    const countyCds = this.staticDataService.getStaticDataKeyValue('COUNTY');
    const filterCountyCds = countyCds.filter(item => item.code === personCountycd);
    return filterCountyCds.length > 0 ? filterCountyCds[0].value : ' ';
  }

  handleSelection(option){
    this.personDisplayName = "Applicant Name: " + option.prsnDetail.firstName+" "+option.prsnDetail.lastName+", DOB: "+option.prsnDetail.dobDt+", SSN: "+option.prsnDetail.ssn +", Person ID: "+option.prsnDetail.prsnId+", County: "+option.prsnDetail.prsnCountyName;
    this.selectedPersonId = option.prsnDetail.prsnId;
  }

  getAllPersonDetails() {
    fromEvent(this.applicantNameInput.nativeElement, 'keyup').pipe(
      map((event: any) => {
        return event.target.value;
      })
      , filter(res => res.length >= 1)
      , debounceTime(500)
      , distinctUntilChanged()
    ).subscribe((text: string) => {
      this.noticesService.getPersonDetails(text, this.entityId).subscribe((res:any) => {
        this.personOptions =[];
        if(res && res.length > 0) {
          res.forEach(personDetail => {
            const prsnCountyName = this.getCountyName(personDetail.cntyCd);
            personDetail = {...personDetail, ...{prsnCountyName}};
            this.personOptions.push({
              personId: personDetail.personId,
              prsnDetail: personDetail
            })
          })
        } else {
          this.toastr.error( res.errorCode[0].description);
        }
        console.log("res ",res);
      }, (err) => {
        console.log('error', err);
      });

    });
  }


  get f() {
    return this.noticeForm.controls;
  }

  search(): void{
    this.noticeRecords = [];
    let queryParam:string = "";
   if(this.f.referralId.value || this.f.paeId.value || this.f.programType.value ||
              this.f.noticeType.value || this.f.noticeStatus.value || this.f.printType.value
               || this.f.noticeGeneratedate.value || this.f.noticeEffectivedate.value || this.f.apealId.value) {

      if(this.f.personSearch.value){
        queryParam += "searchText="+this.selectedPersonId+"&";
      }
      if(this.f.referralId.value){
        queryParam += "refId="+this.f.referralId.value+"&";
      }
      if(this.f.paeId.value){
        queryParam += "paeId="+this.f.paeId.value+"&";
      }
      if(this.f.programType.value){
        queryParam += "programType="+this.f.programType.value+"&";
      }
      if(this.f.noticeType.value){
        queryParam += "noticeType="+this.f.noticeType.value+"&";
      }
      if(this.f.noticeStatus.value){
        queryParam += "noticeStatus="+this.f.noticeStatus.value+"&";
      }
      if(this.f.printType.value){
        queryParam += "printType="+this.f.printType.value+"&";
      }
      if(this.f.noticeGeneratedate.value){
        const  noticeGeneratedate = new Date(this.f.noticeGeneratedate.value).toISOString().slice(0,10);
        queryParam += "noticeGeneratedate="+noticeGeneratedate+"&";
      }
      if(this.f.noticeEffectivedate.value){
        const noticeEffectivedate = new Date(this.f.noticeEffectivedate.value).toISOString().slice(0,10);
        queryParam += "noticeEffectivedate="+noticeEffectivedate+"&";
      }
      if(this.f.apealId.value){
        queryParam += "aplId="+this.f.apealId.value+"&";
      }
     let newQueryParam = queryParam.slice(0, queryParam.length - 1);
      this.noticesService.searchNoticeRecords(newQueryParam).subscribe((res :any) => {
        console.log("search res ", res);
        if(res && res.errorCode && res.errorCode.length > 0 && res.errorCode[0].description){
          this.toastr.error( res.errorCode[0].description);
        } else {
          this.noticeRecords = this.transform(res);
        }
      }, (error:any) => {
        this.toastr.error("Internal Server Error");

      });
    } else if(this.f.personSearch.value && this.selectedPersonId){
     this.noticesService.searchNoticeRecordByPrsnId(this.selectedPersonId).subscribe((res: any) => {
       console.log("search res ", res);
       if(res && res.errorCode && res.errorCode.length > 0 && res.errorCode[0].description){
         this.toastr.error( res.errorCode[0].description);
         return;
       }
       res = res.filter(rec => rec.recipientType === 'APP');
       this.noticeRecords = this.transform(res);
       console.log("noticeRecords ", this.noticeRecords);
     }, (error) => {
        this.toastr.error("Internal Server Error");
     });
    }
    else {
    }
  }

  transform(response) {
    response.forEach(res => {
      const matchedNoticeStatus = this.noticeStatus.filter(noticeStatus => noticeStatus.name === res['noticeStatus']);
      if(matchedNoticeStatus && matchedNoticeStatus.length > 0) {
        res['noticeStatus'] = matchedNoticeStatus[0].value;
      } else {
        res['noticeStatus'] = '---';
      }
      const matchedPrintType = this.printTypes.filter(printType => printType.name === res['printType']);
      if(matchedPrintType && matchedPrintType.length > 0) {
        res['printType'] = matchedPrintType[0].value;
      } else {
        res['printType'] = '---';
      }
      const matchedProgramType = this.programTypes.filter(programType => programType.code === res['programType']);
      if(matchedProgramType && matchedProgramType.length > 0) {
        res['programType'] = matchedProgramType[0].name;
      } else {
        res['programType'] = '---';
      }

      const matchedNoticeType = this.noticeTypes.filter(noticeType => noticeType.code === res['noticesType']);
      if(matchedNoticeType && matchedNoticeType.length > 0) {
        res['noticesType'] = matchedNoticeType[0].value;
      } else {
        res['noticesType'] = '---';
      }

      const matchedRecipientType = this.recipientTypes.filter(recipientType => recipientType.code === res['recipientType']);
      if( matchedRecipientType &&  matchedRecipientType.length > 0) {
        res['recipientType'] =  matchedRecipientType[0].value;
      } else {
        res['recipientType'] = '---';
      }

     })
    return response;
  }

}
