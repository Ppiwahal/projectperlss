import { Component, Inject, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
import { ElementRef } from '@angular/core';
import { fromEvent } from 'rxjs';
import { StaticDataMapService } from '../../core/helpers/static.data.map.service';

@Component({
  selector: 'app-slot-update-popup',
  templateUrl: './slot-update-popup.component.html',
  styleUrls: ['./slot-update-popup.component.scss'],
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

export class SlotUpdatePopupComponent implements OnInit, OnDestroy {
  @Input('searchrst') searchresults: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('applicantNameInput', { static: true }) applicantNameInput: ElementRef;
  searchReferralClicked = false;
  @ViewChild('accordion', { static: true }) Accordion: MatAccordion;
  referralFilterData = [];
  displayedColumns = [
    'firstName',
    'refId',
    'refRcvdDate',
    'intakeOutcomeCd',
    'transitionFrom',
    'transitionTo',
    'paeId',
    'slotStatusCd',
    'keySw',
    'actionCd',
  ];
  subscriptions$: any[] = [];
  dataSource: MatTableDataSource<any>;
  expandedElement;
  slotUpdate: FormGroup;
  slotValue;
  personOptions:any[] = [];
  personDisplayName: string;
  selectedPersonId:number;
  additionalSerachName: string = '';
  intakeOutcomeList: any[] = [];
  refProgramsList:any[] = [];
  slotStatusList:any[] = [];
  transitionValues:any[] = [];
  localStorageLocal = localStorage.getItem('APP_STORAGE_TOKEN');
  userId = JSON.parse(this.localStorageLocal).userName;
  entityId = JSON.parse(this.localStorageLocal).entityId;

constructor(public dialogRef: MatDialogRef<SlotUpdatePopupComponent>, 
            private fb: FormBuilder, 
            private router: Router, 
            private slotManagmentService: SlotManagmentService, 
            private staticDataService: StaticDataMapService,
            private toastr: ToastrService, @Inject(MAT_DIALOG_DATA) public data: any ) { }

ngOnInit(): void {
  this.referralFilterData = this.searchresults;
  this.slotUpdate = this.fb.group({
    personDisplayName:[null],
    searchFilter: [null],

  });
  this.slotValue=this.data.slotValue;
  const ecfSlotDetails$ = this.getECFSlotUpdateDetails();
  this.getAllPersonDetails();
  this.intakeOutcomeList = this.slotManagmentService.intakeOutcomeList;
  this.refProgramsList = this.slotManagmentService.refProgramsList;
  this.slotStatusList =this.slotManagmentService.slotStatusList;
  this.transitionValues = this.slotManagmentService.transitionValues;
}

getFormData() {
  return this.slotUpdate.controls;
}

close() {
  this.dialogRef.close();
}

onEdit(refId: string) {
  this.slotManagmentService.refid=refId;
  this.close();
  this.router.navigate(['ltss/slotDetail']);

}

private getECFSlotUpdateDetails() {
  const ecfSlotDetails$ = this.slotManagmentService.getECFSlotDetails(this.data.slotType.toString(), this.data.slotCode.toString()).subscribe(res => {
    if (res) {
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.paginator = this.paginator;
    }
  });
  this.subscriptions$.push(ecfSlotDetails$);

}

referralAdditionalSearch() {
  this.searchReferralClicked = true;
  const searchText = this.additionalSerachName;
  const searchResults$ = this.slotManagmentService.getSearchResults(searchText, this.data.slotType.toString(), this.data.slotCode.toString()).subscribe(res => {
    if (res) {
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.paginator = this.paginator;
    }
  });
  this.subscriptions$.push(searchResults$);

}

getCountyName(personCountycd) {
  const countyCds = this.staticDataService.getStaticDataKeyValue('COUNTY');
  const filterCountyCds = countyCds.filter(item => item.code === personCountycd);
  return filterCountyCds.length > 0 ? filterCountyCds[0].value : ' ';
}

handleSelection(option){
  this.personDisplayName = "Applicant Name: " + option.prsnDetail.firstName+" "+option.prsnDetail.lastName+", DOB: "+option.prsnDetail.dobDt+", SSN: "+option.prsnDetail.ssn +", Person ID: "+option.prsnDetail.prsnId+", County: "+option.prsnDetail.prsnCountyName;
  this.selectedPersonId = option.prsnDetail.prsnId;
  this.slotUpdate.controls.personDisplayName.setValue(this.personDisplayName);
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

applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();
}

getNameByCode(code: string, entity: string) {
  if (entity === 'IOC' && code) {
    const result = this.intakeOutcomeList.filter(item => item.code === code);
    return result.length > 0 ? result[0].value : code;
  }
  if (entity === 'RPM' && code) {
    const refPM = this.refProgramsList.filter(item => item.code === code);
    return refPM.length > 0 ? refPM[0].value : code;
  }
  if (entity === 'SLTS' && code) {
    const slotStatus = this.slotStatusList.filter(item => item.code === code);
    return slotStatus.length > 0 ? slotStatus[0].value : code;
  }
  if (entity === 'TRS' && code) {
    const transitionValues = this.transitionValues.filter(item => item.code === code);
    return transitionValues.length > 0 ? transitionValues[0].value : code;
  }
}

keySwitch(event, refId,slotStatus) {
  const checked = event.checked === true ? 'Y' : 'N';
  const keySwitch$ = this.slotManagmentService.updateSlotKeySwitch(refId, checked,slotStatus).subscribe(res => {
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
