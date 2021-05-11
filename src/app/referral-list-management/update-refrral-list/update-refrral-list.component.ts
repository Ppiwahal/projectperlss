import { Component, OnInit, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ReferralListManagementService } from '../services/referral-list-management.service';
import { forkJoin } from 'rxjs';
import * as customValidation from '../../_shared/constants/validation.constants';
import {ToastrService} from 'ngx-toastr';

export interface PeriodicElement {
  personauthorizedremoval: string;
  relationship: string;
  dateandtime: string;
  typeofcontact: string;
  contactedby: string;
}

export interface PeriodicElementforSecond {
  id: number;
  cntctDtTime: string;
  cntctTypeCd: string;
  cntctedBy: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { personauthorizedremoval: 'Hydrogen', relationship: 'Hydrogen', dateandtime: 'Hydrogen', typeofcontact: 'Hydrogen', contactedby: 'H' }
];

const ELEMENT_DATA_Second: PeriodicElementforSecond[] = [
  { id: 1, cntctDtTime: '', cntctTypeCd: '', cntctedBy: '' },
  { id: 2, cntctDtTime: '', cntctTypeCd: '', cntctedBy: '' },
  { id: 3, cntctDtTime: '', cntctTypeCd: '', cntctedBy: '' }
]


@Component({
  selector: 'app-update-refrral-list',
  templateUrl: './update-refrral-list.component.html',
  styleUrls: ['./update-refrral-list.component.scss']
})
export class UpdateRefrralListComponent implements OnInit {
  createTaskForm: FormGroup;
  updateStatusCodes: any[];
  enrollmentCodes: any[];
  reasonCodes: any[];
  relationshipCodes: any[];
  contactMethodCodes: any[];
  displayedColumns: string[] = ['personauthorizedremoval', 'relationship', 'dateandtime', 'typeofcontact', 'contactedby'];
  displayedColumnsforsecondtable: string[] = ['contactattempt', 'dateandtime', 'typeofcontact', 'contactedby'];
  dataSource = ELEMENT_DATA;
  secondtabledataSource = ELEMENT_DATA_Second;
  customValidation = customValidation;
  formData;
  @Input() referralId: any;
  @Input() refProgram:any;
  rows:FormArray =this.fb.array([]);
  minDate: any;
  maxDate: Date;
  today = this.toDateTimeLocal(new Date());
  toDateTimeLocal(date: Date) {
    const checkDate = (i) => {
      return (i < 10 ? '0' : '') + i;
    };
    return date.getFullYear() + '-' + checkDate(date.getMonth() + 1) + '-' + checkDate(date.getDate()) + 'T' + checkDate(date.getHours()) + ':' + checkDate(date.getMinutes());
  }
   uocRow1=this.fb.group({
    id:['1'],
    cntctDtTime:[''],
    cntctTypeCd:['', Validators.required],
    cntctedBy:['']
  });
  uocRow2=this.fb.group({
    id:['2'],
    cntctDtTime:[''],
    cntctTypeCd:['', Validators.required],
    cntctedBy:['']
  });
  uocRow3=this.fb.group({
    id:['3'],
    cntctDtTime:[''],
    cntctTypeCd:['', Validators.required],
    cntctedBy:['']
  })

  constructor(private fb: FormBuilder,
              private toastr: ToastrService,
              private referralListManagementService: ReferralListManagementService) { }

  ngOnInit(): void {
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 119, 0, 1).toISOString().substring(0,16);
    this.maxDate = new Date();
    this.rows.push(this.uocRow1);
    this.rows.push(this.uocRow2);
    this.rows.push(this.uocRow3);
    this.createTaskForm = this.fb.group({
      refListStatusCd: ['', Validators.required],
      intrstdEnrGroupCd: ['', Validators.required],
      rmvlRsnCd: ['', Validators.required],
      rmvlAuthName:[''],
      rmvlAuthReltshpCd:[''],
      rmvlDtTime:[''],
      rmvlAuthCntctTypeCd:[''],
      rmvlAuthCntctBy:[''],
      comments:['',Validators.required],
      refListOutreachCntctVO:this.rows
    });
    let observables = [];
    observables.push(this.referralListManagementService.getUpdateStatusCodes());
    observables.push(this.referralListManagementService.getReasonCodes());
    observables.push(this.referralListManagementService.getRelationshipValues());
    observables.push(this.referralListManagementService.getContactMethodValues());
    forkJoin(observables).subscribe((res: any) => {
      this.updateStatusCodes = res[0];
      this.enrollmentCodes = this.refProgram;
      this.reasonCodes = res[1];
      this.relationshipCodes = res[2];
      this.contactMethodCodes = res[3];
    });
  }
  get f() {
    return this.createTaskForm.controls;
  }

  referralListStatus() {
    console.log(this.secondtabledataSource);
    this.formData = this.createTaskForm.value;
    this.formData = {...this.formData, ...{refId: this.referralId}};
    if(this.createTaskForm.controls.rmvlRsnCd.value  != 'UTC'){
      this.formData.refListOutreachCntctVO=[];
        }
    this.referralListManagementService.updateReferralList(this.formData).subscribe(res => {

      this.toastr.success(res.successMsgDescription);
      console.log("res ",res);
    }, err => {
      this.toastr.error(err.errorCode.description);
    })
  }

}
