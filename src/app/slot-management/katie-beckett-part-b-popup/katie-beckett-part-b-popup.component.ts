import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { SlotManagmentService } from '../services/slot-managment.service';
import { debounceTime, map, distinctUntilChanged, filter } from 'rxjs/operators';
import { fromEvent } from 'rxjs';
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
import { StaticDataMapService } from '../../core/helpers/static.data.map.service';

@Component({
  selector: 'app-katie-beckett-part-b-popup',
  templateUrl: './katie-beckett-part-b-popup.component.html',
  styleUrls: ['./katie-beckett-part-b-popup.component.scss'],
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

export class KatieBeckettPartBPopupComponent implements OnInit,OnDestroy  {
  @Input('searchrst') searchresults: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('applicantNameInput', { static: true }) applicantNameInput: ElementRef;
  searchReferralClicked = false;
  @ViewChild('accordion', { static: true }) Accordion: MatAccordion;
  displayedColumns = [
    'rank',
    'firstName',
    'refId',
    'refRcvdDate',
    'paeId',
    'actionCd',
  ];


  dataSource: MatTableDataSource<any>;
  expandedElement;
  referralSearch: FormGroup;
  comments: any[] = [];
  ranks: any[] = [];
  subscriptions$: any[] = [];
  toggleButton: boolean = false;
  additionalSerachName: string = '';
  updateButton: boolean = false;
  removeButton: boolean = false;
  personOptions: any[] = [];
  personDisplayName: string;
  selectedPersonId: number;
  kBPartBWaitingList;
  localStorageLocal = localStorage.getItem('APP_STORAGE_TOKEN');
  userId = JSON.parse(this.localStorageLocal).userName;
  entityId = JSON.parse(this.localStorageLocal).entityId;

  constructor(public dialogRef: MatDialogRef<KatieBeckettPartBPopupComponent>, 
              private fb: FormBuilder, 
              private router: Router, 
              private slotManagmentService: SlotManagmentService,
              private staticDataService: StaticDataMapService, 
              private toastr: ToastrService) { }

  ngOnInit(): void {
    this.referralSearch = this.fb.group({
      personDisplayName: [''],
    });
    const searchResults$ = this.getKBPartbWaitingListDetails();
    this.getAllPersonDetails();
  }

  getCountyName(personCountycd) {
    const countyCds = this.staticDataService.getStaticDataKeyValue('COUNTY');
    const filterCountyCds = countyCds.filter(item => item.code === personCountycd);
    return filterCountyCds.length > 0 ? filterCountyCds[0].value : ' ';
  }

  handleSelection(option) {
    this.personDisplayName = "Applicant Name: " + option.prsnDetail.firstName + " " + option.prsnDetail.lastName + ", DOB: " + option.prsnDetail.dobDt + ", SSN: " + option.prsnDetail.ssn + ", Person ID: " + option.prsnDetail.prsnId + ", County: " + option.prsnDetail.prsnCountyName;
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
      this.slotManagmentService.getPersonDetails(text,this.entityId).subscribe((res) => {
        this.personOptions = [];
        if (res && res.length > 0) {
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
        console.log("res ", res);
      }, (err) => {
        console.log('error', err);
      });

    });
  }
  private getKBPartbWaitingListDetails() {
    const ecfReferralList$ = this.slotManagmentService.getKBPartbWaitingListDetails().subscribe(res => {
      if (res) {
        this.kBPartBWaitingList = res;
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
      }
    });
    this.subscriptions$.push(ecfReferralList$);

  }


  getFormData() {
    return this.referralSearch.controls;
  }
  close() {
    this.dialogRef.close();
  }
  KBPartbWaitingListDetailsSearch() {
    this.searchReferralClicked = true;
    const searchText = this.additionalSerachName;
    const searchResults$ = this.slotManagmentService.getKBPartbSearchResults(searchText).subscribe(res => {
      if (res) {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
      }
    });
    this.subscriptions$.push(searchResults$);
  }
  referralAdditionalSearch() {
    this.searchReferralClicked = true;
  }

  onEdit() {
    this.toggleButton = true;
    this.updateButton = true;
  }

  onDelete() {
    this.toggleButton = true;
    this.removeButton = true;
  }
  onUpdate(updatedRank: any, CurrentRank: any) {
    let currentRecord = this.kBPartBWaitingList.filter(x => x.rank === CurrentRank);
    let toUpdateRecord = this.kBPartBWaitingList.filter(x => x.rank === Number(updatedRank));
    let positionTwoRecord;
    let curPositionTwo;
    let direction;

    if (Number(updatedRank) > CurrentRank) {
      let positionTwoRecord = this.kBPartBWaitingList.filter(x => x.rank === (Number(updatedRank) + 1));
      const maxRank = Math.max(...this.kBPartBWaitingList.map(o => o.rank), 0);
      if (Number(updatedRank) === maxRank) {
        curPositionTwo = "";
        direction = "B"
      } else {
        curPositionTwo = positionTwoRecord[0].currPosition;
        direction = "D"
      }
    } else {
      let positionTwoRecord = this.kBPartBWaitingList.filter(x => x.rank === (Number(updatedRank) - 1));
      if (Number(updatedRank) === 1) {
        curPositionTwo = "201123000000";
        direction = "T"
      } else {
        curPositionTwo = positionTwoRecord[0].currPosition;
        direction = "U"
      }
    }
    const payload =
    {
      "curRankSelected": Number(updatedRank),
      "refIdSelected": currentRecord[0].refId,
      "curPositionSelected": currentRecord[0].currPosition,
      "curPosition1": toUpdateRecord[0].currPosition,
      "curPosition2": curPositionTwo,
      "direction": direction
    }
    console.log(payload);
    const removeEcf$ = this.slotManagmentService.updateRankPartb(payload).
      subscribe(res => {

        if (res.errorCode) {
          this.toastr.warning(res.errorCode.description);
        } else {
          this.toastr.success(res.successMsgDescription);
          this.getKBPartbWaitingListDetails();
        }
      });
    this.subscriptions$.push(removeEcf$);
  }
  onRemove(comment: any, refID: any) {
    const payload = { refId: refID, comments: comment }
    const removeEcf$ = this.slotManagmentService.removeKBPartb(payload).
      subscribe(res => {

        if (res.errorCode) {
          this.toastr.warning(res.errorCode.description);
        } else {
          this.toastr.success(res.successMsgDescription);
          this.getKBPartbWaitingListDetails();
        }
      });
    this.subscriptions$.push(removeEcf$);
  }

  ngOnDestroy() {
    if (this.subscriptions$ && this.subscriptions$.length > 0) {
      this.subscriptions$.forEach(subscription$ => subscription$.unsubscribe());
    }
  }

}
