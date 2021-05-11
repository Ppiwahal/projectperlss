import {  Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReferralListManagementService } from '../services/referral-list-management.service';
import {
  debounceTime,
  map,
  distinctUntilChanged,
  filter
} from 'rxjs/operators';
import { fromEvent } from 'rxjs';
import { StaticDataMapService } from '../../core/helpers/static.data.map.service';

@Component({
  selector: 'app-referral-dashboard-filter',
  templateUrl: './referral-dashboard-filter.component.html',
  styleUrls: ['./referral-dashboard-filter.component.scss']
})
export class ReferralDashboardFilterComponent implements OnInit {
  referralPersonSearch: FormGroup;
  panelOpenState = false;
  @Input() referralListStatus;
  @Input() intakeOutCome;
  @Input() outReachDue
  @Input() taskQueue
  @Input() taskStatus
  @ViewChild('applicantNameInput', { static: true }) applicantNameInput: ElementRef;
  personOptions:any[] = [];
  personName:string = "";
  @Output() emitSearchQueryParam: EventEmitter<any> = new EventEmitter<any>();
  localStorageLocal = localStorage.getItem('APP_STORAGE_TOKEN');
  userId = JSON.parse(this.localStorageLocal).userName;
  entityId = JSON.parse(this.localStorageLocal).entityId;

  constructor(private formBuilder: FormBuilder,
              private staticDataService: StaticDataMapService,
              private referralListManagementService: ReferralListManagementService) { }

  ngOnInit(): void {
    this.referralPersonSearch = this.formBuilder.group({
      personSearch: [''],
      referralId: [''],
      referralStatus: [''],
      intakeOutcome: [''],
      outreachDueDate: [''],
      taskQueue: [''],
      taskStatus: ['']
    });
    this.getAllPersonDetails();
  }

  get f() {
    return this.referralPersonSearch.controls;
  }

  getCountyName(personCountycd) {
    const countyCds = this.staticDataService.getStaticDataKeyValue('COUNTY');
    const filterCountyCds = countyCds.filter(item => item.code === personCountycd);
    return filterCountyCds.length > 0 ? filterCountyCds[0].value : ' ';
  }

  getAllPersonDetails() {
    this.personName = "";
    fromEvent(this.applicantNameInput.nativeElement, 'keyup').pipe(
      map((event: any) => {
        return event.target.value;
      })
      , filter(res => res.length >= 1)
      , debounceTime(500)
      , distinctUntilChanged()
    ).subscribe((text: string) => {
       const personDetailsSubscription$ = this.referralListManagementService.getPersonDetails(text, this.entityId).subscribe((res) => {
        this.personOptions =[];
        if(res && res.length > 0) {
          res.forEach( data => {
            const prsnCountyName = this.getCountyName(data.cntyCd);
            data = {...data, prsnCountyName};
            let formattedDate = this.dateFormat(data.dobDt);
            this.personOptions.push({
              personName: data.firstName+" "+data.lastName,
              prsnDetail: data,
              prsnDetailTxt: "Name: "+data.firstName+" "+data.lastName+", DOB: "+formattedDate+", SSN: "+data.ssn+", Person ID: "+data.prsnId+", County: "+data.prsnCountyName
            })
            console.log(this.personOptions)
          })
        } else {

        }
        console.log("res ",res);
      }, (err) => {
        console.log('error', err);
      });

    });

  }

  handleSelection(option){
    this.referralPersonSearch.controls['personSearch'].setValue(option.prsnDetailTxt);
    this.personName = option.personName;
  }  

  dateFormat(date) {
    const previousDate = new Date(date);
    const dobDate = String(previousDate.getDate()).padStart(2, '0');
    const dobMonth = String(previousDate.getMonth() + 1).padStart(2, '0');
    const dobYear = previousDate.getFullYear();
    return dobMonth + '/' + dobDate + '/' + dobYear;
  }

  search(): void{
    let queryParam:string = "";
   if("" !== this.f.personSearch.value || this.f.referralId.value || this.f.referralStatus.value || this.f.intakeOutcome.value ||
              this.f.outreachDueDate.value || this.f.taskQueue.value || this.f.taskStatus.value) {
      if(this.f.personSearch.value !== "" && this.f.personSearch.value !== null){
        queryParam += "searchReferral?searchText="+this.personName+"&";
      }
      if(this.f.referralId.value !== ""){
        queryParam += "searchReferral?refId="+this.f.referralId.value+"&";
      }
      if(this.f.referralStatus.value !== ""){
        queryParam += "searchReferral?refStatus="+this.f.referralStatus.value+"&";
      }
      if(this.f.intakeOutcome.value !== ""){
        queryParam += "searchReferral?intakeOutcome="+this.f.intakeOutcome.value+"&";
      }
      if(this.f.outreachDueDate.value !== ""){
        queryParam += "searchReferral?outreachDueDt="+this.f.outreachDueDate.value+"&";
      }
      if(this.f.taskQueue.value !== ""){
        queryParam += "searchReferral?taskQueue="+this.f.taskQueue.value+"&";
      }
      if(this.f.taskStatus.value !== ""){
        queryParam += "searchReferral?taskStatus="+this.f.taskStatus.value+"&";
      }
     let newQueryParam = queryParam.slice(0, -1)
     this.emitSearchQueryParam.emit(newQueryParam);
    } else {
      let newQueryParam = "searchReferral";
      this.emitSearchQueryParam.emit(newQueryParam);
    }
  }

  updatePersnSearch(){
    this.f.personSearch.setValue(null);
    this.personName = "";
  }

}
