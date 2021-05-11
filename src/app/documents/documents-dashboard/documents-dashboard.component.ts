import { Component, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatPaginator } from '@angular/material/paginator';
import { DocumentsService } from '../../core/services/documents/documents.service';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { fromEvent } from 'rxjs';
import { RightnavToggleService } from 'src/app/_shared/services/rightnav-toggle.service';
import { StaticDataMapService } from '../../core/helpers/static.data.map.service';


@Component({
  selector: 'app-documents-dashboard',
  templateUrl: './documents-dashboard.component.html',
  styleUrls: ['./documents-dashboard.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class DocumentsDashboardComponent implements OnInit, OnDestroy {

  subscriptions$ = [];
  displayedColumns: string[] = ['name', 'ssn', 'referralId', 'paeId', 'appointmentType', 'appointmentStatus'];
  dataSource: MatTableDataSource<any>;
  expandedElement;
  isSearchCompleted = true;
  errorMessage: string;
  showError = false;
  personDisplayName: string;
  personOptions: any;
  referralId = '';
  appealId = '';
  paeId = '';
  personId: any;
  paeStatus: any;
  paeStatusDropDown = [];
  appealStatusDropDown = [];
  referralStatusDropDown = [];
  localStorageLocal = localStorage.getItem('APP_STORAGE_TOKEN');
  userId = JSON.parse(this.localStorageLocal).userName;
  entityId = JSON.parse(this.localStorageLocal).entityId;

  @ViewChild('applicantNameInput', { static: true }) applicantNameInput: ElementRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private router: Router, 
              private documentsService: DocumentsService, 
              private staticDataService: StaticDataMapService,
              private rightnavToggleService: RightnavToggleService) { }

  ngOnInit(): void {
    this.rightnavToggleService.setRightnavFlag(false);
    this.getAllPersonDetails();
    this.getPAEStatusDropdowns();
    this.getAppealStatusDropdowns();
    this.getReferralStatusDropdowns();
  }

  getPAEStatusDropdowns() {
    const input = 'PAE_STATUS';
    const PAEStatusDropdownSubscriptions = this.documentsService.getSearchDropdowns(input).subscribe(response => {
      this.paeStatusDropDown = response.sort((a, b) => (a.value > b.value) ? 1 : -1);
    });
    this.subscriptions$.push(PAEStatusDropdownSubscriptions);
  }

  getAppealStatusDropdowns() {
    const input = 'APPEAL_STATUS';
    const AppealStatusDropdownSubscriptions = this.documentsService.getSearchDropdowns(input).subscribe(response => {
      this.appealStatusDropDown = response;
    });
    this.subscriptions$.push(AppealStatusDropdownSubscriptions);
  }

  getReferralStatusDropdowns() {
    const input = 'REFERRAL_STATUS';
    const ReferralStatusDropdownSubscriptions = this.documentsService.getSearchDropdowns(input).subscribe(response => {
      this.referralStatusDropDown = response;
    });
    this.subscriptions$.push(ReferralStatusDropdownSubscriptions);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getCountyName(personCountycd) {
    const countyCds = this.staticDataService.getStaticDataKeyValue('COUNTY');
    const filterCountyCds = countyCds.filter(item => item.code === personCountycd);
    return filterCountyCds.length > 0 ? filterCountyCds[0].value : ' ';
  }

  handleSelection(option) {
    this.personDisplayName = `Applicant Name: ${option.prsnDetail.firstName} ${option.prsnDetail.lastName}, Date Of Birth: ${option.prsnDetail.dobDt}, SSN: ${option.prsnDetail.ssn}, Person ID: ${option.prsnDetail.prsnId}, County: ${option.prsnDetail.prsnCountyName}`;
    this.personId = option.prsnDetail.prsnId;
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
      const PersonDetailsSubscriptions = this.documentsService.getPersonDetails(text, this.entityId).subscribe((res) => {
        this.personOptions = [];
        if (res && res.length > 0) {
          res.forEach(personDetail => {
            const prsnCountyName = this.getCountyName(personDetail.cntyCd);
            personDetail = {...personDetail, ...{prsnCountyName}};
            this.personOptions.push({
              personId: personDetail.personId,
              prsnDetail: personDetail
            });
          });
        }
      });
      this.subscriptions$.push(PersonDetailsSubscriptions);
    });
  }

  statusChange(event) {
    this.paeStatus = null;
    if (event.value !== '') {
      this.paeStatus = event.value;
    }
  }

  formatSSN(val) {
    if (val) {
      const formstring = 'XXX-XX-' + val.slice(5, val.length);
      return formstring;
    } else {
      return '---';
    }
  }

  executeSearch() {
    let searchId = '';
    const entityId = '9001';
    const objSearch = {};
    this.showError = false;
    this.isSearchCompleted = true;
    if (this.personId && this.personDisplayName) {
      searchId = 'personId=' + this.personId;
    } else if (this.referralId) {
      searchId = 'refId=' + this.referralId;
    } else if (this.paeId) {
      searchId = 'paeId=' + this.paeId;
    } else if (this.appealId) {
      searchId = 'aplId=' + this.appealId;
    } else if (this.paeStatus) {
      searchId = 'paeStatus=' + this.paeStatus;
    }
    if (searchId === '') {
      this.showError = true;
      this.errorMessage = 'Please select at least one serach criteria.';
    }
    if (this.personId && this.personDisplayName) {
      Object.assign(objSearch, { prsnId: this.personId });
    }
    if (this.referralId) {
      Object.assign(objSearch, { refId: this.referralId });
    }
    if (this.paeId) {
      Object.assign(objSearch, { paeId: this.paeId });
    }
    if (this.appealId) {
      Object.assign(objSearch, { aplId: this.appealId });
    }
    if (this.paeStatus) {
      this.paeStatusDropDown.forEach(element => {
        if (element.code === this.paeStatus) {
          Object.assign(objSearch, { paeStatus: element.value });
        }
      });
    }
    const SearchResultsSubscriptions = this.documentsService.getSearchResultsBySearchCriteria(searchId.toString(), entityId)
      .subscribe(response => {
        if (response && !response.errorCode && response.length > 0) {
          this.showError = false;
          this.isSearchCompleted = false;
          const formattedResponse = [];
          for (const res of response) {
            this.paeStatusDropDown.forEach(element => {
              if (element.code === res.paeStatus) {
                res.paeStatus = element.value;
              }
            });
            this.appealStatusDropDown.forEach(element => {
              if (element.code === res.aplStatus) {
                res.aplStatus = element.value;
              }
            });
            this.referralStatusDropDown.forEach(element => {
              if (element.code === res.refStatus) {
                res.refStatus = element.value;
              }
            });
          }
          for (const res of response) {
            if (this.partialContains(res, objSearch)) {
              formattedResponse.push(res);
            }
          }
          if (formattedResponse.length !== 0) {
            this.dataSource = new MatTableDataSource(formattedResponse);
            this.dataSource.paginator = this.paginator;
          } else {
            this.isSearchCompleted = true;
            this.showError = true;
            this.errorMessage = 'No records found with given search criteria.';
          }
        } else if (response.errorCode) {
          const lengthOfSearch = Object.keys(objSearch);
          if (lengthOfSearch.length > 1) {
            this.showError = true;
            this.errorMessage = 'No records found with given search criteria.';
          } else {
            this.showError = true;
            if (this.personId) {
              this.errorMessage = 'No records found with Person ID ' + this.personId;
            }
            if (this.paeId) {
              this.errorMessage = 'No records found with PAE ID ' + this.paeId;
            }
            if (this.appealId) {
              this.errorMessage = 'No records found with Appeal ID ' + this.appealId;
            }
            if (this.referralId) {
              this.errorMessage = 'No records found with Referral ID ' + this.referralId;
            }
            if (this.paeStatus) {
              const messagePrefix = 'No records found with given PAE Status ';
              this.paeStatusDropDown.forEach(element => {
                if (element.code === this.paeStatus) {
                  this.errorMessage = messagePrefix + element.value;
                }
              });
            }
          }
        }
      });
    this.subscriptions$.push(SearchResultsSubscriptions);
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

  navigateToHistory(element) {
    this.documentsService.setHistoryData(element);
    const tempObj = {
      aplId: element.aplId,
      paeId: element.paeId,
      applicantName: element.firstName + ' ' + element.lastName,
      prsnId: element.prsnId,
      refId: element.refId,
      ssn: element.ssn,
      paeStatus: element.paeStatus
    };
    this.rightnavToggleService.setRightnavFlag(true);
    this.rightnavToggleService.setRightnavData(tempObj);
    this.router.navigate(['/ltss/documents/history']);
  }

  ngOnDestroy() {
    if (this.subscriptions$ && this.subscriptions$.length > 0) {
      this.subscriptions$.forEach(subscription$ => subscription$.unsubscribe());
    }
  }

}
