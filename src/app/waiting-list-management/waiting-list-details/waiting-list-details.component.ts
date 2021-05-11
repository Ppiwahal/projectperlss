import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { animate, state, style, transition, trigger } from '@angular/animations';
import {forkJoin, observable} from 'rxjs';
import {WaitingListService} from '../services/waiting-list.service';
import {ActivatedRoute} from '@angular/router';
import * as customValidation from '../../_shared/constants/validation.constants';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';

export interface Notification {
  waitingliststatus: string;
  reassessmentdate: string;
  reassessmentresult: string;
  reasonforchange: string;
  updatedate: string;
  updateuser: string;
}

export interface PeriodicElement {
  personauthorizedremoval: string;
  relationship: string;
  dateandtime: string;
  typeofcontact: string;
  contactedby: string;
}

export interface PeriodicElementforThird {
  contactAttmpts: number;
  contactDt: string;
  typeOfContact: string;
  contactedBy: string;
}

const ELEMENT_DATA: Notification[] = [
  { waitingliststatus: 'To Be Removed', reassessmentdate: '07/24/2020', reassessmentresult: 'Unable to Contact', reasonforchange: '--', updatedate: '07/25/2020', updateuser: 'James collins' },
  { waitingliststatus: 'Active', reassessmentdate: '03/22/2021', reassessmentresult: 'No Change', reasonforchange: 'Requested Removal', updatedate: '03/22/2020', updateuser: 'Mary Blige' },
  { waitingliststatus: 'Active', reassessmentdate: '03/05/2021', reassessmentresult: '--', reasonforchange: '--', updatedate: '03/05/2020', updateuser: 'System' }
];

const ELEMENT_DATA1: PeriodicElement[] = [
  { personauthorizedremoval: 'Hydrogen', relationship: 'Hydrogen', dateandtime: 'Hydrogen', typeofcontact: 'Hydrogen', contactedby: 'H' }
];

const ELEMENT_DATA_ThirdTable: PeriodicElementforThird[] = [
  { contactAttmpts: 1, contactDt: '', typeOfContact: '', contactedBy: '' },
  { contactAttmpts: 2, contactDt: '', typeOfContact: '', contactedBy: '' },
  { contactAttmpts: 3, contactDt: '', typeOfContact: '', contactedBy: '' }
]

@Component({
  selector: 'app-waiting-list-details',
  templateUrl: './waiting-list-details.component.html',
  styleUrls: ['./waiting-list-details.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class WaitingListDetailsComponent implements OnInit {
  displayedColumns: string[] = ['waitingliststatus', 'reassessmentdate', 'reassessmentresult', 'reasonforchange', 'updatedate', 'updateuser'];
  updateDisplayedColumns: string[] = ['personauthorizedremoval', 'relationship', 'dateandtime', 'typeofcontact', 'contactedby'];
  displayedColumnsforThirdTable: string[] = ['contactattempt', 'dateandtime', 'typeofcontact', 'contactedby'];
  updateStatusValues: any[] = [];
  reasonValues: any[] = [];
  relationshipValues: any[] = [];
  typeOfContactValues: any[] = [];
  dataSource;
  expandedElement;
  dataSourceforsecondary = ELEMENT_DATA1;
  thirdTableDataSource =ELEMENT_DATA_ThirdTable;
  updateWaitingListForm: FormGroup;
  subscriptions$:any[] = [];
  waitingListDetails:any;
  customValidation = customValidation;
  partBRank;
  formData;
  progtypeParam;
  minDate: Date;
  maxDate: Date;
  rows:FormArray =this.formBuilder.array([]);
  today = this.toDateTimeLocal(new Date());
  toDateTimeLocal(date: Date) {
    const checkDate = (i) => {
      return (i < 10 ? '0' : '') + i;
    };
    return date.getFullYear() + '-' + checkDate(date.getMonth() + 1) + '-' + checkDate(date.getDate()) + 'T' + checkDate(date.getHours()) + ':' + checkDate(date.getMinutes());
  }
  uocRow1=this.formBuilder.group({
    contactAttmpts:['1'],
    contactDt:[''],
    typeOfContact:['', Validators.required],
    contactedBy:['']
  });
  uocRow2=this.formBuilder.group({
    contactAttmpts:['2'],
    contactDt:[''],
    typeOfContact:['', Validators.required],
    contactedBy:['']
  });
  uocRow3=this.formBuilder.group({
    contactAttmpts:['3'],
    contactDt:[''],
    typeOfContact:['', Validators.required],
    contactedBy:['']
  })
  constructor(private waitingListService: WaitingListService, private formBuilder: FormBuilder,  private route: ActivatedRoute,private toastr: ToastrService,) { }

  ngOnInit(): void {
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 119, 0, 1);
    this.maxDate = new Date();
    this.rows.push(this.uocRow1);
    this.rows.push(this.uocRow2);
    this.rows.push(this.uocRow3);
    this.route.queryParams
      .subscribe(params => {
        // Defaults to 0 if no query param provided.
        const personid =  params['prsnid'];
        if(personid) {
          this.waitingListService.getWaitingListDetails(personid).subscribe(res => {
            this.waitingListDetails = res;
            console.log("waitingListDetails ", this.waitingListDetails);
          });

        }
         const progtype =  params['progtype'];
          this.progtypeParam= progtype;
        if(progtype) {
          const entityid = 101;
          this.waitingListService.getWaitingListHistory(progtype, entityid).subscribe(res => {
            this.dataSource = res;
          });
          this.waitingListService.getWaitingListHistoryContact(progtype, entityid).subscribe(res => {
           // this.thirdTableDataSource = res;
          });
        }
        const refId =  params['refId'];
        if(refId) {
          this.waitingListService.getPartBRank(refId).subscribe(res => {
            this.partBRank = res;
          })
        }
      });
    this.getUpdateDetails();
    this.updateWaitingListForm = this.formBuilder.group({
      updateStatus: ['',Validators.required],
      updateRank: [''],
      reasonCd: [''],
      comments:['',Validators.required],
      rmvlAuthCntctBy:[''],
      rmvlAuthCntctTypeCd:[''],
      rmvlAuthName:[''],
      rmvlAuthReltshpCd:[''],
      rmvlAuthDt:[''],
      waitingListCntctList:this.rows
    });
  }
  
  getUpdateDetails(){
    const observables = [];
    observables.push(this.waitingListService.getUpdateActionValues());
    observables.push(this.waitingListService.getReasonValues());
    observables.push(this.waitingListService.getRelationshipValues());
    observables.push(this.waitingListService.getTypeOfContactValues());
    const TaskDetailsSubscriptions$ = forkJoin(observables).subscribe((res: any) => {
      this.updateStatusValues = res[0];
      if(this.progtypeParam=== 'PART A'){
        this.updateStatusValues=this.updateStatusValues.filter(x=>x.program==='KBA')
      }
      if(this.progtypeParam=== 'PART B'){
        this.updateStatusValues=this.updateStatusValues.filter(x=>x.program==='KBB')
      }
    
    this.reasonValues = res[1];
    this.relationshipValues = res[2];
    this.typeOfContactValues = res[3];
    });
    this.subscriptions$.push(TaskDetailsSubscriptions$);
  }

  handleWaitingListUpdate() {
    this.formData = this.updateWaitingListForm.value;
    this.formData = {...this.formData, ...{refId:'',prsnId:'',paeId:'',waitingList:''}};
    console.log("vaue ",this.formData);
    if(this.updateWaitingListForm.controls.reasonCd.value  != 'UTC'){
      this.formData.waitingListCntctList=[];
        }
        this.waitingListService.updateWaitingListDetails(this.formData).subscribe(res => {

          this.toastr.success(res.successMsgDescription);
          console.log("res ",res);
        }, err => {
          this.toastr.error(err.errorCode.description);
        })
  }

  get f() {
    return this.updateWaitingListForm.controls;
  }

  ngOnDestroy() {
    if(this.subscriptions$ && this.subscriptions$.length > 0) {
      this.subscriptions$.forEach(subscription$ => subscription$.unsubscribe());
    }
  }

}
