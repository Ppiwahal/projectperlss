import { Component, OnInit,ViewChild, EventEmitter, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ReferralListManagementService } from '../services/referral-list-management.service';
import {forkJoin} from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { OnDestroy } from '@angular/core';


@Component({
  selector: 'app-referral-list-details',
  templateUrl: './referral-list-details.component.html',
  styleUrls: ['./referral-list-details.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class ReferralListDetailsComponent implements OnInit,OnDestroy {
  displayedColumns: string[] = ['waitingliststatus', 'reassessmentdate', 'reassessmentresult', 'reasonforchange', 'updatedate', 'updateuser'];
  dataSource: MatTableDataSource<any>;
  expandedElement;
  referralListDetails:any;
  subscriptions$:any[] = [];
  referralId;
  personId;
  refPrograms;
  slotStatus;
  intakeOutcome;
  paestatus;
  refStatus;
  annualCodes;
  reasonCodes;
  relationCodes;
  contactCodes;
  @Output() emitTasksCount = new EventEmitter();
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private referralListManagementService: ReferralListManagementService) { }

  ngOnInit(): void {
    this.referralId = history.state.data.refId;
    this.personId = history.state.data.personId;
    console.log('+=',this.personId);
    this.loadReferalListDetails();
    this.getReferralListHistory();
  let observables = [];
  observables.push(this.referralListManagementService.getEnrollmentCodes());
  observables.push(this.referralListManagementService.getSlotCodes());
  observables.push(this.referralListManagementService.getIntakeOutcomeCodes());
  observables.push(this.referralListManagementService.getPaeStatusCodes());
  observables.push(this.referralListManagementService.getReferralListStatus());
  observables.push(this.referralListManagementService.getAnnualOutreachCodes());
  observables.push(this.referralListManagementService.getReasonCodes());
  observables.push(this.referralListManagementService.getRelationshipValues());
  observables.push(this.referralListManagementService.getContactMethodValues());
  forkJoin(observables).subscribe((res: any) => {
    this.refPrograms = res[0];
    this.slotStatus = res[1];
    this.intakeOutcome = res[2];
    this.paestatus = res[3];
    this.refStatus = res[4];
    this.annualCodes = res[5];
    this.reasonCodes = res[6];
    this.relationCodes = res[7];
    this.contactCodes = res[8];
  });
  }


  getNameByCode(code: string, entity: string) {
    if (entity === 'PT' && code) {
      const result = this.refPrograms.filter(item => item.code === code);
      return result.length > 0 ? result[0].value : code;
    }
    if (entity === 'SS' && code) {
      const result = this.slotStatus.filter(item => item.code === code);
      return result.length > 0 ? result[0].value : code;
    }
    if (entity === 'IOC' && code) {
      const result = this.intakeOutcome.filter(item => item.code === code);
      return result.length > 0 ? result[0].value : code;
    }
    if (entity === 'PAE' && code) {
      const result = this.paestatus.filter(item => item.code === code);
      return result.length > 0 ? result[0].value : code;
    }
    if (entity === 'REFS' && code) {
      const result = this.refStatus.filter(item => item.code === code);
      return result.length > 0 ? result[0].value : code;
    }
    if (entity === 'AC' && code) {
      const result = this.annualCodes.filter(item => item.code === code);
      return result.length > 0 ? result[0].value : code;
    }
    if (entity === 'RC' && code) {
      const result = this.reasonCodes.filter(item => item.code === code);
      return result.length > 0 ? result[0].value : code;
    }
    if (entity === 'RLC' && code) {
      const result = this.relationCodes.filter(item => item.code === code);
      return result.length > 0 ? result[0].value : code;
    }
    if (entity === 'CC' && code) {
      const result = this.contactCodes.filter(item => item.code === code);
      return result.length > 0 ? result[0].value : code;
    }
  }

  loadReferalListDetails(){
    let refId = history.state.data.refId;
    //let personId = history.state.data.personId;
    const refDetails$ = this.referralListManagementService.getReferalListDetails(refId).subscribe( res=>{
      this.referralListDetails = res;
    });
    this.subscriptions$.push(refDetails$);
  }
  getReferralListHistory(){
    let refId = history.state.data.refId;
     //let personId = history.state.data.personId;
    const refHistory$ = this.referralListManagementService.getReferalListHistory(refId).subscribe(res => {
      if (res) {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
      }
    });
    this.subscriptions$.push(refHistory$);

  }


  ngOnDestroy() {
    if (this.subscriptions$ && this.subscriptions$.length > 0) {
      this.subscriptions$.forEach(subscription$ => subscription$.unsubscribe());
    }
  }
}
