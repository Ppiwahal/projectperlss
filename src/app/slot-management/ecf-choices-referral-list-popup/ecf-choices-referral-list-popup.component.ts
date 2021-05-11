import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { SlotManagmentService } from '../services/slot-managment.service';
import { debounceTime, map, distinctUntilChanged, filter } from 'rxjs/operators';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { MatTableDataSource } from '@angular/material/table';
import { MatAccordion } from '@angular/material/expansion';
import { ToastrService } from 'ngx-toastr';
import { fromEvent } from 'rxjs';
import { StaticDataMapService } from '../../core/helpers/static.data.map.service';

@Component({
  selector: 'app-ecf-choices-referral-list-popup',
  templateUrl: './ecf-choices-referral-list-popup.component.html',
  styleUrls: ['./ecf-choices-referral-list-popup.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ]
})
export class EcfChoicesReferralListPopupComponent implements OnInit, OnDestroy {
  @Input('searchrst') searchresults: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('applicantNameInput', { static: true }) applicantNameInput: ElementRef;
  searchReferralClicked = false;
  @ViewChild('accordion', { static: true }) Accordion: MatAccordion;
  displayedColumns = [
    'firstName',
    'refId',
    'refRcvdDate',
    'intakeOutcomeCd',
    'dateAdded',
    'outreachDate',
    'keySw',
    'actionCd',
  ];


  intakeOutcomeList: any[] = [];
  referralListStatus: any[] = [];
  ddidList: any[] = [];
  dataSource: MatTableDataSource<any>;
  expandedElement;
  referralSearch: FormGroup;
  comments: any[] = [];
  subscriptions$: any[] = [];
  additionalSerachName: string = '';
  toggleButton: boolean = false;
  personOptions:any[] = [];
  personDisplayName: string;
  selectedPersonId:number;
  localStorageLocal = localStorage.getItem('APP_STORAGE_TOKEN');
  userId = JSON.parse(this.localStorageLocal).userName;
  entityId = JSON.parse(this.localStorageLocal).entityId;

  constructor(public dialogRef: MatDialogRef<EcfChoicesReferralListPopupComponent>, 
              private fb: FormBuilder, 
              private router: Router,
              private staticDataService: StaticDataMapService, 
              private slotManagmentService: SlotManagmentService, 
              private toastr: ToastrService,) { }

  ngOnInit(): void {
    this.referralSearch = this.fb.group({
      personDisplayName: [''],
      intakeOutcome: [''],
      refstatus: [''],
      ddidstatus: [''],
    });
    this.ddidList = this.slotManagmentService.yesNoList;
    this.referralListStatus = this.slotManagmentService.refListStatusList;
    this.intakeOutcomeList = this.slotManagmentService.intakeOutcomeList;
    const searchResults$ = this.getECFReferralList();
    this.getAllPersonDetails();

  }
  private getECFReferralList() {
    const ecfReferralList$ = this.slotManagmentService.getECFReferralListDetails().subscribe(res => {
      if (res) {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
      }
    });
    this.subscriptions$.push(ecfReferralList$);

  }

  getFormData() {
    return this.referralSearch.controls;
  }

  getCountyName(personCountycd) {
    const countyCds = this.staticDataService.getStaticDataKeyValue('COUNTY');
    const filterCountyCds = countyCds.filter(item => item.code === personCountycd);
    return filterCountyCds.length > 0 ? filterCountyCds[0].value : ' ';
  }

  handleSelection(option){
    this.personDisplayName = "Applicant Name: " + option.prsnDetail.firstName+" "+option.prsnDetail.lastName+", DOB: "+option.prsnDetail.dobDt+", SSN: "+option.prsnDetail.ssn +", Person ID: "+option.prsnDetail.prsnId+", County: "+option.prsnDetail.prsnCountyName;
    this.selectedPersonId = option.prsnDetail.prsnId;
    this.referralSearch.controls.personDisplayName.setValue(this.personDisplayName);
    this.additionalSerachName = option.prsnDetail.firstName;
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
      this.slotManagmentService.getPersonDetails(text, this.entityId).subscribe((res) => {
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

        }
        console.log("res ",res);
      }, (err) => {
        console.log('error', err);
      });

    });
  }

  close() {
    this.dialogRef.close();
  }
  referralAdditionalSearch() {
    this.searchReferralClicked = true;
    const searchText = this.additionalSerachName;
    const refstatus = this.getFormData().refstatus.value;
    const intakeOutcome = this.getFormData().intakeOutcome.value;
    const ddidstatus = this.getFormData().ddidstatus.value;
    const searchResults$ = this.slotManagmentService.getReferralSearchResultsByFilters(searchText, refstatus, intakeOutcome, ddidstatus).subscribe(res => {
      if (res) {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
      }
    });
    this.subscriptions$.push(searchResults$);

  }
  clearForm() {
    this.referralSearch.reset();
    this.getECFReferralList();
  }
  onEdit(refId: string, prsnId: string,slotDetailsId: string) {
    this.slotManagmentService.refid=refId;
    this.slotManagmentService.prsnId=prsnId;
    this.slotManagmentService.slotDetailsId=slotDetailsId?slotDetailsId:'';

    this.close();
    this.router.navigate(['ltss/slotDetail']);

  }
  onRemove(comment: any, refID: any) {
    const payload = { refId: refID, comments: comment }
    const removeEcf$ = this.slotManagmentService.removeECFReferral(payload).
      subscribe(res => {

        if (res.errorCode) {
          this.toastr.warning(res.errorCode.description);
        } else {
          this.toastr.success(res.successMsgDescription);
          this.referralAdditionalSearch();
        }
      });
    this.subscriptions$.push(removeEcf$);
  }
  onDelete() {
    this.toggleButton = true;

  }
  getNameByCode(code: string, entity: string) {
    if (entity === 'IOC' && code) {
      const result = this.intakeOutcomeList.filter(item => item.code === code);
      return result.length > 0 ? result[0].value : code;
    }
    if (entity === 'RFLS' && code) {
      const result = this.referralListStatus.filter(item => item.code === code);
      return result.length > 0 ? result[0].value : code;
    }
    if (entity === 'DDID' && code) {
      const result = this.ddidList.filter(item => item.code === code);
      return result.length > 0 ? result[0].value : code;
    }
  }
  keySwitch(event, refId) {
    const checked = event.checked === true ? 'Y' : 'N';
    const keySwitch$ = this.slotManagmentService.updateKeySwitch(refId, checked).subscribe(res => {
      if (res.errorCode) {
        this.toastr.warning(res.errorCode.description);
      } else {
        this.toastr.success(res.successMsgDescription);
      }
    });
    this.subscriptions$.push(keySwitch$);
  }
  ngOnDestroy() {
    if (this.subscriptions$ && this.subscriptions$.length > 0) {
      this.subscriptions$.forEach(subscription$ => subscription$.unsubscribe());
    }
  }

}
