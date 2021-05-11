import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { SlotManagmentService } from '../services/slot-managment.service';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { debounceTime, map, distinctUntilChanged, filter } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { MatAccordion } from '@angular/material/expansion';
import { ToastrService } from 'ngx-toastr';
import { fromEvent } from 'rxjs';
import { StaticDataMapService } from '../../core/helpers/static.data.map.service';

@Component({
  selector: 'app-katie-beckett-part-a-popup',
  templateUrl: './katie-beckett-part-a-popup.component.html',
  styleUrls: ['./katie-beckett-part-a-popup.component.scss'],
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

export class KatieBeckettPartAPopupComponent implements OnInit, OnDestroy {
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
    'locDetermination',
    'priorityScore',
    'actionCd',
  ];
  dataSource: MatTableDataSource<any>;
  expandedElement;
  referralSearch: FormGroup;
  comments: any[] = [];
  ranks: any[] = [];
  subscriptions$: any[] = [];
  additionalSerachName: string = '';
  toggleButton: boolean = false;
  updateButton: boolean = false;
  removeButton: boolean = false;
  personOptions: any[] = [];
  personDisplayName: string;
  selectedPersonId: number;
  kBPartAWaitingList;
  localStorageLocal = localStorage.getItem('APP_STORAGE_TOKEN');
  userId = JSON.parse(this.localStorageLocal).userName;
  entityId = JSON.parse(this.localStorageLocal).entityId;

  constructor(public dialogRef: MatDialogRef<KatieBeckettPartAPopupComponent>, 
              private fb: FormBuilder, 
              private staticDataService: StaticDataMapService,
              private router: Router, 
              private slotManagmentService: SlotManagmentService, 
              private toastr: ToastrService ) { }

  ngOnInit(): void {
    this.referralSearch = this.fb.group({
      personDisplayName: [''],
    });
    const searchResults$ = this.getKBPartaWaitingListDetails();
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
      this.slotManagmentService.getPersonDetails(text, this.entityId).subscribe((res) => {
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

  private getKBPartaWaitingListDetails() {
    const KBPartaWaitingListDetails$ = this.slotManagmentService.getKBPartaWaitingListDetails().subscribe(res => {
      if (res) {
        this.kBPartAWaitingList = res;
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
      }
    });
    this.subscriptions$.push(KBPartaWaitingListDetails$);

  }

  getFormData() {
    return this.referralSearch.controls;
  }
  close() {
    this.dialogRef.close();
  }
  KBPartaWaitingListDetailsSearch() {
    this.searchReferralClicked = true;
    const searchText = this.additionalSerachName;
    const searchResults$ = this.slotManagmentService.getKBPartaSearchResults(searchText).subscribe(res => {
      if (res) {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
      }
    });
    this.subscriptions$.push(searchResults$);
  }


  onEdit() {
    this.toggleButton = true;
    this.updateButton = true;
  }
  onUpdate(updatedRank: any, CurrentRank: any) {
    let currentRecord = this.kBPartAWaitingList.filter(x => x.rank === CurrentRank);
    let toUpdateRecord = this.kBPartAWaitingList.filter(x => x.rank === Number(updatedRank));
    let positionTwoRecord;
    let curPositionTwo;
    let direction;

    if (Number(updatedRank) > CurrentRank) {
      let positionTwoRecord = this.kBPartAWaitingList.filter(x => x.rank === (Number(updatedRank) + 1));
      const maxRank = Math.max(...this.kBPartAWaitingList.map(o => o.rank), 0);
      if (Number(updatedRank) === maxRank) {
        curPositionTwo = "";
        direction = "B"
      } else {
        curPositionTwo = positionTwoRecord[0].currPosition;
        direction = "D"
      }
    } else {
      let positionTwoRecord = this.kBPartAWaitingList.filter(x => x.rank === (Number(updatedRank) - 1));
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
    const removeEcf$ = this.slotManagmentService.updateRankParta(payload).
      subscribe(res => {

        if (res.errorCode) {
          this.toastr.warning(res.errorCode.description);
        } else {
          this.toastr.success(res.successMsgDescription);
          this.getKBPartaWaitingListDetails();
        }
      });
    this.subscriptions$.push(removeEcf$);
  }

  onDelete() {
    this.toggleButton = true;
    this.removeButton = true;
  }
  onRemove(comment: any, refID: any) {
    const payload = { refId: refID, comments: comment }
    const removeEcf$ = this.slotManagmentService.removeKBParta(payload).
      subscribe(res => {

        if (res.errorCode) {
          this.toastr.warning(res.errorCode.description);
        } else {
          this.toastr.success(res.successMsgDescription);
          this.getKBPartaWaitingListDetails();
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
