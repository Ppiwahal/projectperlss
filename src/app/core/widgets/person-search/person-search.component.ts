import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, ViewChild, ElementRef, OnInit, OnDestroy, Inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { fromEvent } from 'rxjs';
import { RightnavToggleService } from 'src/app/_shared/services/rightnav-toggle.service';
import {PersonSearchService } from '../../services/personsSearch/person-search.service'
import { FormBuilder, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { PaeFilter } from 'src/app/_shared/model/PaeFilter';
import { AppealService } from 'src/app/appeals/services/appeal.service';

interface personInfo{
  Name:string,
  dobDt:Date,
  SSN:number,
  personID:number,
  County:any
}
@Component({
  selector: 'app-person-search',
  templateUrl: './person-search.component.html',
  styleUrls: ['./person-search.component.scss']
})
export class PersonSearchComponent implements OnInit {
  personProfile:personInfo[]=[];
  filteredProfiles:personInfo[] = [];
  personDisplayName: any;
  personId: any;
  personOptions = [];
  subscriptions$: any;
  localStorageLocal = localStorage.getItem('APP_STORAGE_TOKEN');
  entityId = JSON.parse(this.localStorageLocal).entityId;
  displayedColumns =[
    'name',
    'DOB',
    'SSN',
    'Person ID',
    'county'
  ]
  personSearch:FormGroup;
  dataSource: MatTableDataSource<any>;
  isRowSelected:boolean=false;
  selectedelement:any;
  @ViewChild('personSearchInput', { static: true }) personSearchInput: ElementRef;
  selectedRow: any;
  recordId: any;
  paeId: any;
  refId: any;
  paeFilterRequest: any;
  records: any;
  appealStatus = [];
  appealType = [];
  queueName = [];
  taskStatus = [];
  cobStatus = [];
  dashboardResponse: any;
  searchName = '';
  isSearchName = false;
  searchAppeal: boolean;
  appealsFound:any;
  constructor(private matDialogRef: MatDialogRef<PersonSearchComponent>,
    private router: Router,
    private fb: FormBuilder,
    private rightnavToggleService: RightnavToggleService,
    private personSearchService: PersonSearchService,
    private appealService:AppealService,
    @Inject(MAT_DIALOG_DATA) private data) { }


  ngOnInit(): void {
    this.rightnavToggleService.setRightnavFlag(false);
    this.personSearchService.getPersonDetails('',this.entityId).subscribe(res => {
      this.personProfile = res;
    }
    );
    this.personSearch=this.fb.group({
      personDisplayName:[''],
      searchText: [''],
      name:[''],
      dob:[''],
      ssn:[''],
      personId:[''],
      county:['']
    })
    if (this.data && this.data.personProfile) {
      this.personProfile = [];
      this.filteredProfiles = [];
      this.data.personProfile.forEach(element => {
        this.personProfile.push({
          Name: (element.firstName ? element.firstName + ' ' : '') + (element.mi ? element.mi + ' ' : '') + (element.lastName ? element.lastName : ''),
          dobDt:element.dobDt,
          SSN: element.ssn,
          personID: element.personID,
          County: element.County
        })
      });
      this.filteredProfiles = this.personProfile;
  }
}

  formatResults(response) {
    response.forEach(element => {
      this.appealStatus.forEach(ele => {
        if (element.aplStatusCd === ele.code) {
          this.appealsFound.aplStatusCd = ele.value;
        }
      });
    });
  }

  public ageFromDateOfBirthday(dateOfBirth: any): number {
    return moment().diff(dateOfBirth, 'years');
  }

  getFormData() {
    return this.personSearch.controls;
  }

  validateInput(event) {
    const regex = new RegExp("^[a-z0-9-', ]{1,65}$");
    if (event && !regex.test(event.key)) {
      event.preventDefault();
      return false;
    }
  }
  filterByValue(array, string) {
    return array.filter(o =>
        Object.keys(o).some(k => o[k].toLowerCase().includes(string.toLowerCase())));
  }
  getAllPersonDetails() {
    fromEvent(this.personSearchInput.nativeElement, 'keyup').pipe(
      map((event: any) => {
        return event.target.value;
      })
      , filter(res => res.length >= 1)
      , debounceTime(500)
      , distinctUntilChanged()
    ).subscribe((text: string) => {
      const PersonDetailsSubscriptions = this.personSearchService.getPersonDetails(text ,this.entityId).subscribe((res) => {
        this.personOptions = []
        if (res && res.length > 0) {
          res.forEach(personDetail => {
            this.personOptions.push({
              personId: personDetail.prsnId,
              prsnDetail: personDetail
            });
            this.dataSource = new MatTableDataSource(this.personOptions);
          });            var filterRespose:any = this.personOptions;

                 text.split(',').forEach(value => {
              filterRespose = filterRespose.filter(res => {
                return (
                  (res.Name.toLowerCase().indexOf(value.toLowerCase()) !== -1) ||
                  (res.dobDt)||
                  (res.SSN !== -1) ||
                  (res.personID !== -1) ||
                  (res.County.toLowerCase().startsWith(value.toLowerCase()))
                )
              })
            });
        }
      });
      this.subscriptions$.push(PersonDetailsSubscriptions);
    });
  }

  onSearch(searchValue) {
    this.getAllPersonDetails();

  }
  onrowSelect(element) {
    this.recordId = this.paeId ? this.paeId : this.refId;
    const recordType =  this.paeId ? "PAE" : "REFERRAL";
    this.selectedRow=element;
    this.isRowSelected=true;
    const date = this.dateFormat(element.prsnDetail.dobDt);
    this.personDisplayName = 'Name: ' + element.prsnDetail.firstName + ' ' + element.prsnDetail.lastName + ', DOB: ' + date + ', SSN: '
    + element.prsnDetail.ssn + ', PersonId: ' + element.prsnDetail.prsnId;
    if (element.prsnDetail.cntyCd) {
      this.personDisplayName = this.personDisplayName + ', CountyCode: ' + element.prsnDetail.cntyCd;
    }
    this.personId = element.prsnDetail.prsnId;
    this.selectedelement= this.personDisplayName;
    this.personSearch.controls.personDisplayName.setValue(this.personDisplayName);
    this.getAppealsByPersonId();
    this.viewDetails();
  }
  viewDetails(){
    this.paeFilterRequest = new PaeFilter(
      this.personId,
      '',
      '',
      '',
      '',
      '',
    );
     const record = this.personSearchService
     .getSearchData(this.paeFilterRequest,this.entityId)
     .subscribe((res)=>{
       this.records=res;
       console.log("res"+res);
     });
     console.log("records" +JSON.stringify(record));
  }
  getAppealStatus() {
    const AppealStatusSubscription$ = this.appealService.getStaticDataValue('APPEAL_STATUS').subscribe(response => {
      this.appealStatus = response;
    });
    this.subscriptions$.push(AppealStatusSubscription$);
  }
  getAppealsByPersonId(){
    const objSearch = {};

    const searcText = 'prsnId=' + this.personId;
    if (this.personDisplayName && this.personDisplayName !== '') {
      Object.assign(objSearch, { prsnId: this.personId });
    }
    if (searcText) {
      this.appealService.searchAppeals(searcText).subscribe(response => {
        if (response.appealDashboardSearchVOs && response.appealDashboardSearchVOs.length > 0) {
          response.appealDashboardSearchVOs.forEach(element => {
            if (element.aplTypeCd) {
              if (element.aplTypCd === 'EN' || element.aplTypCd === 'DE' || element.aplTypCd === 'PA') {
                element.linkedRecord = element.paeId;
              } else if (element.aplTypCd === 'PR') {
                if (element.clientId) {
                  element.linkedRecord = element.clientId;
                } else if (element.episodeId) {
                  element.linkedRecord = element.episodeId;
                } else {
                  element.linkedRecord = null;
                }
              } else if (element.aplTypCd === 'RF') {
                element.linkedRecord = element.refId;
              } else {
                element.linkedRecord = null;
              }
            }

            this.appealStatus.forEach(ele => {
              if (element.aplStatusCd === ele.code) {
                element.aplStatus = ele.value;
              }
            });
          });

          const searchResponse = [];
          for (const res of response.appealDashboardSearchVOs) {
            if (this.partialContains(res, objSearch)) {
              searchResponse.push(res);
              this.appealsFound=searchResponse;
            }
          }
          this.searchAppeal = true;
        }
      });
    }

  }
  partialContains(object, subObject) {
    const objProps = Object.getOwnPropertyNames(object);
    const subProps = Object.getOwnPropertyNames(subObject);
    if (subProps.length > objProps.length) {
      return false;
    }
    for (const subProp of subProps) {
      if (!object.hasOwnProperty(subProp)) {
        return false;
      }
      if (object[subProp] !== subObject[subProp]) {
        return false;
      }
    }
    return true;
  }
 dateFormat(date) {
    const previousDate = new Date(date);
    const dobDate = String(previousDate.getDate()).padStart(2, '0');
    const dobMonth = String(previousDate.getMonth() + 1).padStart(2, '0');
    const dobYear = previousDate.getFullYear();
    return dobMonth + '/' + dobDate + '/' + dobYear;
  }


  closePopup() {
    this.matDialogRef.close();
  }

}
