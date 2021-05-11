import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { WorkloadManagementService } from '../services/workload-management.service';
import {
  debounceTime,
  map,
  distinctUntilChanged,
  filter
} from 'rxjs/operators';
import { fromEvent } from 'rxjs';
import { StaticDataMapService } from '../../core/helpers/static.data.map.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import {AssignUserComponent} from '../../inbox/assign-user/assign-user.component';
import * as Constants from '../../_shared/constants/application.constants';
import * as CryptoJS from 'crypto-js';
@Component({
  selector: 'app-task-search',
  templateUrl: './task-search.component.html',
  styleUrls: ['./task-search.component.scss']
})

export class TaskSearchComponent implements OnInit , OnDestroy{
  taskSearch: FormGroup;
  panelOpenState = false;
  @Input() taskQueueData: any[];
  @Input() moduleData: any[];
  @Input() dashBoardCodes: any[];
  @Input() recordTypeData: any[];
  @Input() taskPriorityData: any[];
  elasticSearchData: any[] = []
  @Output() emitTaskSearch: EventEmitter<any> = new EventEmitter<{value:string, formValues:any}>();
  @ViewChild('applicantNameInput', { static: true }) applicantNameInput: ElementRef;
  subscriptions$: any[] = [];
  personDisplayName: string;
  personOptions:any[] = [];
  selectedPersonId:number;
  localStorageLocal = localStorage.getItem('APP_STORAGE_TOKEN');
  userId = JSON.parse(this.localStorageLocal).userName;
  entityId = JSON.parse(this.localStorageLocal).entityId;
  startDate = new Date();
  constructor(private formBuilder: FormBuilder,
              private matDialog: MatDialog,
              private workloadManagementService: WorkloadManagementService,
              private staticDataService: StaticDataMapService) { }

  ngOnInit(): void {
    const timeTravelData = localStorage.getItem('TIME_TRAVEL_DATA');
    if(timeTravelData) {
      const timeTravelDataJson = JSON.parse(CryptoJS.AES.decrypt(timeTravelData, Constants.APP_ENC_DECRYPT_KEY).toString(CryptoJS.enc.Utf8));
      console.log("timeTravelDataJson ", timeTravelDataJson);
      if(timeTravelDataJson.timeTravelFlag && timeTravelDataJson.currentDate) {
        this.startDate = new Date(timeTravelDataJson.currentDate);
      }
    }
    this.taskSearch = this.formBuilder.group({
      personSearch: [''],
      taskQueue: [''],
      module: [''],
      recordType: [''],
      recordId: [''],
      assignUser: [''],
      taskPriority: [''],
      personId: [''],
      dueDate: ['']
    });
    this.getAllPersonDetails();
  }

  getCountyName(personCountycd) {
    const countyCds = this.staticDataService.getStaticDataKeyValue('COUNTY');
    const filterCountyCds = countyCds.filter(item => item.code === personCountycd);
    return filterCountyCds.length > 0 ? filterCountyCds[0].value : ' ';
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
       const personDetailsSubscription$ = this.workloadManagementService.getPersonDetails(text, this.entityId).subscribe((res) => {
        this.personOptions =[];
        if(res && res.length > 0) {
          res.forEach( data => {
            const prsnCountyName = this.getCountyName(data.cntyCd);
            data = {...data, prsnCountyName};
            let dob = data.dobDt.substring(0, 10);
            this.personOptions.push({
              personId: data.prsnId,
              prsnDetail: data,
              prsnDetailTxt: "Name: "+data.firstName+" "+data.lastName+", DOB: "+dob+", SSN: "+data.ssn+", Person ID: "+data.prsnId+", County: "+data.prsnCountyName
            })
          })
        } else {

        }
        console.log("res ",res);
      }, (err) => {
        console.log('error', err);
      });
      this.subscriptions$.push(personDetailsSubscription$)
    });

  }

  showAssignUserDialog() {
    const dialogConfig =  new MatDialogConfig();
    dialogConfig.minWidth = '800px';
    dialogConfig.minHeight = '405px';
    dialogConfig.panelClass = 'edit-profile-container';
    dialogConfig.data = {
      taskMasterId :  this.taskSearch.value.taskQueue
    }
    const dialogRef = this.matDialog.open(AssignUserComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      const assignUser = "userid = "+result.userId+" ; "+"roleId = "+result.roleId;
      this.taskSearch.controls.assignUser.patchValue(assignUser);
    });
  }

  handleSelection(option){
    this.taskSearch.controls['personSearch'].setValue(option.prsnDetailTxt);
    this.taskSearch.controls['personId'].setValue(option.personId);
  }

  get f() {
    return  this.taskSearch.controls;
   }


  search(){
    let formValues = this.taskSearch.value;
    if(this.taskSearch.value.personId !== ''){
      let value = "personId="+this.taskSearch.value.personId;
      this.emitTaskSearch.emit({value:value, formValues:formValues});
      return;
    } else if(this.taskSearch.value.taskQueue !== ''){
        let value = "taskMasterId="+this.taskSearch.value.taskQueue;
        this.emitTaskSearch.emit({value:value, formValues:formValues});
        return;
    } else if(this.taskSearch.value.module !== ''){
      let value = "dashBoardCd="+this.taskSearch.value.module;
      this.emitTaskSearch.emit({value:value, formValues:formValues});
      return;
    } else if(this.taskSearch.value.recordType !== '' && this.taskSearch.value.recordId !== ''){
      let value = "recordtype="+this.taskSearch.value.recordType+"&recordId="+this.taskSearch.value.recordId;
      this.emitTaskSearch.emit({value:value, formValues:formValues});
      return;
    }else if(this.taskSearch.value.assignUser !== ''){
      let value = "userId="+this.taskSearch.value.assignUser;
      this.emitTaskSearch.emit({value:value, formValues:formValues});
      return;
    } else if(this.taskSearch.value.taskPriority !== ''){
      let value = "taskPriority="+this.taskSearch.value.taskPriority;
      this.emitTaskSearch.emit({value:value, formValues:formValues});
      return;
    } else if(this.taskSearch.value.dueDate !== ''){
      let dueDate = this.taskSearch.value.dueDate;
      let modifiedDueDate = new Date(dueDate).toISOString().substring(0, 10);;
      let value = "dueDate="+modifiedDueDate;
      this.emitTaskSearch.emit({value:value, formValues:formValues});
      return;
    }
  }

  ngOnDestroy(){
    if(this.subscriptions$ && this.subscriptions$.length > 0) {
      this.subscriptions$.forEach(subscription$ => subscription$.unsubscribe());
    }
   }

}
