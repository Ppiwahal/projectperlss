import { Component, Input, OnDestroy, OnChanges, OnInit, ViewChild, SimpleChanges, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { MatTableDataSource } from '@angular/material/table';
import { MatAccordion } from '@angular/material/expansion';
import { SlotManagmentService } from '../services/slot-managment.service';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { StaticDataMapService } from '../../core/helpers/static.data.map.service';

@Component({
  selector: 'app-slot-dashboard-search',
  templateUrl: './slot-dashboard-search.component.html',
  styleUrls: ['./slot-dashboard-search.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})

export class SlotDashboardSearchComponent implements OnInit, OnChanges, OnDestroy {
  searchTableResultsReady: boolean = false;
  subscriptions$: any[] = [];
  subscription1$: Subscription;
  @Input() searchResult: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  searchReferralClicked = false;
  @ViewChild('accordion', { static: true }) Accordion: MatAccordion;
  displayedColumns = [
    'firstName',
    'ssn',
    'refId',
    'rcvdDate',
    'transId',
    'programType',
    'intakeOutcomeCd',
    'sltStatusCd'
  ];
  dataSource: MatTableDataSource<any>;
  expandedElement;
  referralSearch: FormGroup;
  slotStatusList: any;
  enrollmentGroupList: any;
  referralWaitingList: any;
  intakeOutcomeList: any;
  referralList: any;
  programType: any;
  personId: any;
  personOptions: any;
  additionalSerachName = '';
  personDisplayName: string;
  localStorageLocal = localStorage.getItem('APP_STORAGE_TOKEN');
  userId = JSON.parse(this.localStorageLocal).userName;
  entityId = JSON.parse(this.localStorageLocal).entityId;
  @ViewChild('applicantNameInput', { static: true }) applicantNameInput: ElementRef;

  constructor(
    private fb: FormBuilder,
    private slotManagmentService: SlotManagmentService,
    private staticDataService: StaticDataMapService,
    private router: Router ) { }

  ngOnInit() {
    this.getAllPersonDetails();
    this.searchReferralClicked = false;
    this.referralSearch = this.fb.group({
      personDisplayName: [''],
      enrollmentGroup: [''],
      slotStatus: [''],
      intakeOutcome: [''],
      referralWaiting: [''],
    });
    this.slotManagmentService.getAdditionalFilterValues().subscribe(res => {
      this.slotStatusList = res[0];
      this.slotManagmentService.slotStatusList = res[0];
      this.enrollmentGroupList = res[1];
      this.slotManagmentService.refProgramsList = res[1];

      this.referralWaitingList = res[2];
      this.slotManagmentService.refWaitingList = res[2];
      this.intakeOutcomeList = res[3];
      this.slotManagmentService.intakeOutcomeList = res[3];

      this.referralList = res[4];
      this.slotManagmentService.refListStatusList = res[4];
      this.programType = res[1];
      this.slotManagmentService.yesNoList = res[5];
      this.slotManagmentService.taskStatusList = res[6];
      this.slotManagmentService.transitionValues = res[7];
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.searchResult.currentValue) {
      this.dataSource = new MatTableDataSource(changes.searchResult.currentValue);
       setTimeout(() => this.dataSource.paginator = this.paginator);
      this.searchTableResultsReady = true;
      this.searchReferralClicked = true;
    }
  }

  getNameByCode(code: string, entity: string) {
    if (entity === 'PT' && code) {
      const programType = this.programType.filter(item => item.code === code);
      return programType.length > 0 ? programType[0].value : code;
    }
    if (entity === 'RFL' && code) {
      const refList = this.referralList.filter(item => item.code === code);
      return refList.length > 0 ? refList[0].value : code;
    }
    if (entity === 'SLTS' && code) {
      const slts = this.slotStatusList.filter(item => item.code === code);
      return slts.length > 0 ? slts[0].value : code;
    }
    if (entity === 'IOC' && code) {
      const result = this.intakeOutcomeList.filter(item => item.code === code);
      return result.length > 0 ? result[0].value : code;
    }
    if (entity === 'TS' && code) {
      const result = this.slotManagmentService.taskStatusList.filter(item => item.code === code);
      return result.length > 0 ? result[0].value : code;
    }
    if (entity === 'TRS' && code) {
      const result = this.slotManagmentService.transitionValues.filter(item => item.code === code);
      return result.length > 0 ? result[0].value : code;
    }
  }

  getCountyName(personCountycd) {
    const countyCds = this.staticDataService.getStaticDataKeyValue('COUNTY');
    const filterCountyCds = countyCds.filter(item => item.code === personCountycd);
    return filterCountyCds.length > 0 ? filterCountyCds[0].value : ' ';
  }

  handleSelection(option) {
    const date = this.dateFormat(option.prsnDetail.dobDt);
    this.personDisplayName = 'Name: ' + option.prsnDetail.firstName + ' ' + option.prsnDetail.lastName + ', DOB: ' + date + ', SSN: '
    + option.prsnDetail.ssn + ', PersonId: ' + option.prsnDetail.prsnId;
    if (option.prsnDetail.prsnCountyName) {
      this.personDisplayName = this.personDisplayName + ', County: ' + option.prsnDetail.prsnCountyName;
    }
    this.personId = option.prsnDetail.prsnId;
    this.referralSearch.controls.personDisplayName.setValue(this.personDisplayName);
    this.additionalSerachName = option.prsnDetail.firstName;
  }

  dateFormat(date) {
    const previousDate = new Date(date);
    const dobDate = String(previousDate.getDate()).padStart(2, '0');
    const dobMonth = String(previousDate.getMonth() + 1).padStart(2, '0');
    const dobYear = previousDate.getFullYear();
    return dobMonth + '/' + dobDate + '/' + dobYear;
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
      const PersonDetailsSubscriptions = this.slotManagmentService.getPersonDetails(text, this.entityId).subscribe((res) => {
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
  getFormData() {
    return this.referralSearch.controls;
  }
  referralAdditionalSearch() {
    const searchText = this.additionalSerachName;
    const slotStatus = this.getFormData().slotStatus.value;
    const enrollmentGroup = this.getFormData().enrollmentGroup.value;
    const referralWaiting = this.getFormData().referralWaiting.value;
    const intakeOutcome = this.getFormData().intakeOutcome.value;
    const searchResults$ = this.slotManagmentService.getSearchResultsByFilters(searchText, slotStatus, enrollmentGroup, referralWaiting, intakeOutcome).subscribe(res => {
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.paginator = this.paginator;
      this.searchReferralClicked = true;
      this.searchTableResultsReady = true;
    });
    this.subscriptions$.push(searchResults$);
    if (this.getFormData().personDisplayName.value === '') {
      this.Accordion.closeAll();
      this.searchReferralClicked = true;
    }
  }

  getSSNMask(ssn: string) {
    if (ssn) {
      const formstring = ssn.substr(0,3) + '-' + ssn.substr(3,2) + '-' + ssn.substr(5,4);
      return formstring;
    }
  }

  viewDetailsClicked(refId: string, prsnId: string, sltDetailsId: string, taskId: string,taskMasterId: string) {
    this.slotManagmentService.refid=refId;
    this.slotManagmentService.prsnId=prsnId;
    this.slotManagmentService.slotDetailsId=sltDetailsId;
    this.slotManagmentService.taskId=taskId?taskId:'';
    this.slotManagmentService.taskMasterId=taskMasterId?taskMasterId:'';
    this.router.navigate(['ltss/slotDetail']);
    // if (taskId != null) {
    //   this.router.navigate(['ltss/slotDetail', refId, prsnId, sltDetailsId, taskId]);
    // } else {
    //   this.router.navigate(['ltss/slotDetail', refId, prsnId, sltDetailsId]);
    // }

  }

  continueClicked(refId: string, prsnId: string, sltDetailsId: string, taskId: string, userId,taskMasterId: string){
    this.slotManagmentService.refid=refId;
    this.slotManagmentService.prsnId=prsnId;
    this.slotManagmentService.slotDetailsId=sltDetailsId;
    this.slotManagmentService.taskId=taskId?taskId:'';
    this.slotManagmentService.taskMasterId=taskMasterId?taskMasterId:'';
    this.router.navigate(['ltss/slotDetail']);
  }

  initiateSlotClicked(refId: string, prsnId: string, sltDetailsId: string, taskId: string, userId,taskMasterId: string) {
    this.slotManagmentService.refid=refId;
    this.slotManagmentService.prsnId=prsnId;
    this.slotManagmentService.slotDetailsId=sltDetailsId;
    this.slotManagmentService.taskId=taskId?taskId:'';
    this.slotManagmentService.taskMasterId=taskMasterId?taskMasterId:'';
    this.subscription1$ = this.slotManagmentService
      .updateTaskStatus(taskId, this.userId)
      .subscribe((initiateResponse) => {
        console.log('initiateIntakeResponse', initiateResponse);
      });
      this.router.navigate(['ltss/slotDetail']);
    // if (taskId != null) {
    //   this.router.navigate(['ltss/slotDetail', refId, prsnId, sltDetailsId, taskId]);
    // } else {
    //   this.router.navigate(['ltss/slotDetail', refId, prsnId, sltDetailsId]);
    // }
  }
  ngOnDestroy() {
    if (this.subscriptions$ && this.subscriptions$.length > 0) {
      this.subscriptions$.forEach(subscription$ => subscription$.unsubscribe());
    }
  }

}

