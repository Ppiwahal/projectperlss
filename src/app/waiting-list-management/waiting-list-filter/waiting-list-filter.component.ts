import { Component, OnDestroy, ElementRef, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { WaitingListService } from '../services/waiting-list.service';
import { forkJoin, fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from "rxjs/operators";
import { StaticDataMapService } from '../../core/helpers/static.data.map.service';


@Component({
  selector: 'app-waiting-list-filter',
  templateUrl: './waiting-list-filter.component.html',
  styleUrls: ['./waiting-list-filter.component.scss']
})
export class WaitingListFilterComponent implements OnInit, OnDestroy {
  referralPersonSearch: FormGroup;
  waitingListStatus: any[] = [];
  programTypes: any[] = [];
  reassessmentDates: any[] = [];
  taskQueues: any[] = [];
  taskStatus: any[] = [];
  personOptions: any[];
  subscriptions$: any[] = [];
  selectedPrsnId: any;
  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;
  @Output() emitSearchRequest = new EventEmitter();
  localStorageLocal = localStorage.getItem('APP_STORAGE_TOKEN');
  userId = JSON.parse(this.localStorageLocal).userName;
  entityId = JSON.parse(this.localStorageLocal).entityId;

constructor(private formBuilder: FormBuilder, 
            private staticDataService: StaticDataMapService,
            private waitingListService : WaitingListService ) { }

ngOnInit(): void {
  this.referralPersonSearch = this.formBuilder.group({
    searchText: [''],
    refId: [''],
    waitingListStatus: [''],
    programType: [''],
    reassessmentDate: [''],
    taskQueue: [''],
    taskStatus: ['']
  });
  this.getWaitingListStatus();
  this.getAllPersonDetails();
}

getWaitingListStatus(){
  const observables = [];
  observables.push(this.waitingListService.getWaitingListStatusValues());
  observables.push(this.waitingListService.getReassessmentDates());
  observables.push(this.waitingListService.getTaskQueues());
  observables.push(this.waitingListService.getTaskStatusValues());
  const waitingListStatus$ = forkJoin(observables).subscribe((res: any) => {
    this.waitingListStatus = res[0];
    this.programTypes = [ {code: "PA", value: "Part A", activateSW: "Y"},
    {code: "PB", value: "Part B", activateSW: "Y"}];
    this.reassessmentDates = res[1];
    this.taskQueues = res[2];
    this.taskStatus = res[3];
  });
  this.subscriptions$.push(waitingListStatus$)
}

getCountyName(personCountycd) {
  const countyCds = this.staticDataService.getStaticDataKeyValue('COUNTY');
  const filterCountyCds = countyCds.filter(item => item.code === personCountycd);
  return filterCountyCds.length > 0 ? filterCountyCds[0].value : ' ';
}

getAllPersonDetails() {
  fromEvent(this.searchInput.nativeElement, 'keyup').pipe(
    map((event: any) => {
      return event.target.value;
    })
    , filter(res => res.length >= 1)
    , debounceTime(500)
    , distinctUntilChanged()
  ).subscribe((text: string) => {
    const personDetailsSubscription$ = this.waitingListService.getPersonDetails(text, this.entityId).subscribe((res) => {
      this.personOptions =[];
      if(res && res.length > 0) {
        res.forEach( data => {
          const prsnCountyName = this.getCountyName(data.cntyCd);
          data = {...data, ...prsnCountyName}
          let dob = data.dobDt.substring(0, 10);
          this.personOptions.push({
            personId: data.prsnId,
            prsnDetail: data,
            prsnDetailTxt: "Applicant Name: "+data.firstName+" "+data.lastName+", Date of Birth: "+dob+", SSN: "+data.ssn+", Person ID: "+data.prsnId+", County: "+prsnCountyName,
            prsnDetailHtmlTxt: "<b>Applicant Name:</b> "+data.firstName+" "+data.lastName+", <b>Date of Birth:</b> "+dob+",<b> SSN:</b> "+data.ssn+", <b>Person ID:</b> "+data.prsnId+", <b>County:</b> "+prsnCountyName
          })
        })
      } else {

      }
      console.log("res ",res);
    }, (err) => {
      console.log('error', err);
    });
    this.subscriptions$.push(personDetailsSubscription$)
  });

}

handleSelection(selectedId){
  this.selectedPrsnId = selectedId;
}

get f() {
  return  this.referralPersonSearch.controls;
}

search(): void{
  console.log(this.referralPersonSearch.value);
  const keys = Object.keys(this.referralPersonSearch.value);
  const queryParam = keys.find(key => this.referralPersonSearch.value[key] !== '');
  let queryValue;
  if(queryParam === 'searchText') {
    queryValue = this.selectedPrsnId;
  } else {
    queryValue = this.referralPersonSearch.value[queryParam];
  }
  console.log("queryParam ",queryParam);
  console.log("queryValue ",queryValue);
  const searchPerson$ = this.waitingListService.searchPerson(queryParam,queryValue).subscribe(res => {
    console.log("searh res ",res);
    this.emitSearchRequest.emit(res);
  })
  this.subscriptions$.push(searchPerson$)
}

ngOnDestroy() {
  if(this.subscriptions$ && this.subscriptions$.length > 0) {
    this.subscriptions$.forEach(subscription$ => subscription$.unsubscribe());
  }
}

}
