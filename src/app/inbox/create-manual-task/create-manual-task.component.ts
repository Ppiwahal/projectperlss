import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AssignUserComponent} from '../assign-user/assign-user.component';
import * as customValidation from '../../_shared/constants/validation.constants';
import {InboxService} from '../services/inbox.service';
import {forkJoin, fromEvent} from 'rxjs';
import {debounceTime, distinctUntilChanged, filter, map} from "rxjs/operators";
import {ToastrService} from 'ngx-toastr';
import { StaticDataMapService } from '../../core/helpers/static.data.map.service';
import * as Constants from '../../_shared/constants/application.constants';
import * as CryptoJS from 'crypto-js';

const ID_MAPPINGS = {"paeIdSw": "PAE",
  "refIdSw": "REF",
  "trnstnIdSw": "IND",
  "aplIdSw": "APL"};

const TYPE_MAPPINGS = {"PAE": "paeId",
  "REF": "referalId",
  "IND": "transitionId",
  "APL": "appealId"
};

@Component({
  selector: 'app-create-manual-task',
  templateUrl: './create-manual-task.component.html',
  styleUrls: ['./create-manual-task.component.scss']
})
export class CreateManualTaskComponent implements OnInit {
  createManualNotice: FormGroup;
  customValidation = customValidation;
  taskQueuesOptions:any[] = [];
  moduleOptions:any[] = [];
  recordTypes:any[] = [];
  taskPrioritys:any[] = [];
  personOptions: any[];
  subscriptions$: any[] = [];
  selectedPrsnId: any;
  allTaskRecords:any[];
  totalObjects:any[] = [{recordTypeName: 'selectRecordType0', recordIdName:'selectRecordId0'}];
  selectedRecord: any;
  showDueDate = false;
  minDate: Date;
  maxDate: Date;
  startDate = new Date();
  today = this.toDateTimeLocal(new Date());
  localStorageLocal = localStorage.getItem('APP_STORAGE_TOKEN');
  userId = JSON.parse(this.localStorageLocal).userName;
  entityId = JSON.parse(this.localStorageLocal).entityId;
  toDateTimeLocal(date: Date) {
    const checkDate = (i) => {
      return (i < 10 ? '0' : '') + i;
    };
    return date.getFullYear() + '-' + checkDate(date.getMonth() + 1) + '-' + checkDate(date.getDate()) + 'T' + checkDate(date.getHours()) + ':' + checkDate(date.getMinutes());
  }

  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;

  constructor(private formBuilder: FormBuilder,
              private matDialog: MatDialog,
              private inboxService: InboxService,
              private staticDataService: StaticDataMapService,
              private toastr: ToastrService) { }

  ngOnInit(): void {
    const timeTravelData = localStorage.getItem('TIME_TRAVEL_DATA');
    if(timeTravelData) {
      const timeTravelDataJson = JSON.parse(CryptoJS.AES.decrypt(timeTravelData, Constants.APP_ENC_DECRYPT_KEY).toString(CryptoJS.enc.Utf8));
      console.log("timeTravelDataJson ", timeTravelDataJson);
      if(timeTravelDataJson.timeTravelFlag && timeTravelDataJson.currentDate) {
        this.startDate = new Date(timeTravelDataJson.currentDate);
      }
    }
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 119, 0, 1);
    this.maxDate = new Date();
    this.createManualNotice = this.formBuilder.group({
      searchText: [''],
      selecttaskQueuesOption: ['', Validators.required],
      selectModuleOption: ['', Validators.required],
      selectRecordType0:'',
      assignUser: '',
      selectRecordId0:'',
      personId1: ['',Validators.required],
      personId2: ['',Validators.required],
      dueDate: ['',Validators.required],
      taskDetails:['',Validators.required],
      priorityCode:['', Validators.required]
    });
    this.getCreateTaskDetails();
    this.getAllPersonDetails();
  }

  getCountyName(personCountycd) {
    const countyCds = this.staticDataService.getStaticDataKeyValue('COUNTY');
    const filterCountyCds = countyCds.filter(item => item.code === personCountycd);
    return filterCountyCds.length > 0 ? filterCountyCds[0].value : ' ';
  }

  getAllPersonDetails() {
    fromEvent(this.searchInput.nativeElement, 'keyup').pipe(
      map((event: any) => {
        return event.target.value;
      })
      , filter(res => res.length >= 1)
      , debounceTime(500)
      , distinctUntilChanged()
    ).subscribe((text: string) => {
      const personDetailsSubscription$ = this.inboxService.getPersonDetails(text, this.entityId).subscribe((res: any) => {
        this.personOptions =[];
        if(res && res.length > 0) {
          res.forEach( data => {
            const prsnCountyName = this.getCountyName(data.cntyCd);
            data = {...data, ...prsnCountyName}
            let dob = data.dobDt.substring(0, 10);
            this.personOptions.push({
              personId: data.prsnId,
              prsnDetail: data,
              prsnDetailTxt: "Applicant Name: "+data.firstName+" "+data.lastName+", Date of Birth: "+dob+", SSN: "+data.ssn+", Person ID: "+data.prsnId+", County: "+prsnCountyName,
              prsnDetailHtmlTxt: "<b>Applicant Name:</b> "+data.firstName+" "+data.lastName+", <b>Date of Birth:</b> "+dob+",<b> SSN:</b> "+data.ssn+", <b>Person ID:</b> "+data.prsnId+", <b>County:</b> "+prsnCountyName
            })
          })
        } else {
          this.toastr.error( res.errorCode[0].description);
        }
      }, (err) => {
      });
      this.subscriptions$.push(personDetailsSubscription$)
    });
  }

  getCreateTaskDetails(){
     let observables = [];
     observables.push( this.inboxService.getAllTaskNames(this.userId));
     observables.push( this.inboxService.getModuleValues());
     observables.push( this.inboxService.getRecordType());
     observables.push( this.inboxService.getTaskPriorityCodes());
     const TaskDetailsSubscriptions$ = forkJoin(observables).subscribe((res : any) => {
       this.allTaskRecords = res[0].filter(task => task.manualSw === 'Y');
       this.taskQueuesOptions = this.allTaskRecords.map(taskRec => taskRec.taskName);
      this.moduleOptions = res[1];
      this.recordTypes = res[2];
      this.taskPrioritys = res[3];
     })
  }

  handleTaskQueueChange() {
    const selectedTaskQueue = this.createManualNotice.controls["selecttaskQueuesOption"].value;
    const selectedRecord = this.allTaskRecords.filter(taskRec => taskRec.taskName === selectedTaskQueue);
    if (selectedRecord && selectedRecord.length > 0) {
      this.selectedRecord = selectedRecord[0];
      this.selectedRecord.dueDateCd === "O" ? this.showDueDate = true : this.showDueDate = false;
      if(this.selectedRecord.prsn2IdSw === 'Y') {
        this.createManualNotice.controls.personId2.setValidators(Validators.required);
      } else {
        this.createManualNotice.controls.personId2.patchValue('');
        this.createManualNotice.controls.personId2.clearValidators();
      }
      this.createManualNotice.controls.selectModuleOption.patchValue(this.selectedRecord.dashboardCd);
      let cnt = 0;
      this.totalObjects = [{recordTypeName: 'selectRecordType'+cnt, recordIdName:'selectRecordId'+cnt}];
      Object.keys(ID_MAPPINGS).forEach((key) => {
        if(this.selectedRecord[key] === 'Y') {
          if (cnt === 0) {
            this.createManualNotice.controls['selectRecordType' + cnt].setValidators(Validators.required);
            this.createManualNotice.controls['selectRecordId' + cnt].setValidators(Validators.required);
          }
          if(cnt >= 1) {
            this.totalObjects.push({recordTypeName: 'selectRecordType'+cnt, recordIdName:'selectRecordId'+cnt});
              this.createManualNotice.addControl('selectRecordType' + cnt, new FormControl('', Validators.required));
              this.createManualNotice.addControl('selectRecordId' + cnt, new FormControl('', Validators.required));
          }
          this.createManualNotice.controls['selectRecordType'+cnt].patchValue(ID_MAPPINGS[key]);
          cnt++;
        }

      });
      if(cnt === 0) {
        this.createManualNotice.controls['selectRecordType0'].patchValue('');
        this.createManualNotice.get('selectRecordType0').clearValidators();
        this.createManualNotice.get('selectRecordId0').clearValidators();
        this.createManualNotice.get('selectRecordType0').updateValueAndValidity();
        this.createManualNotice.get('selectRecordId0').updateValueAndValidity();
      }
    }
  }

  handleCreateTask() {
    if(this.createManualNotice.errors != null) {
      return;
    }
    const assignedUser = this.f.assignUser.value;
    let userId = '';
    if(assignedUser) {
      userId = assignedUser.split(";")[0].split("=")[1].trim();
    }
    let payload = {
      "adminDocVO": {
        "taskMasterId":  this.selectedRecord.taskMasterId
        },
      "appealId": null,
      "assignedUserId": userId ? userId : null,
      "mergedPersonId":  this.f.personId2.value ? this.f.personId2.value : null,
      "moduleCode": this.f.selectModuleOption.value,
      "paeId": null,
      "personId":  this.f.personId1.value,
      "priorityCd": this.f.priorityCode.value,
      "referalId": null,
      "taskDetailDesc": this.f.taskDetails.value,
      "transitionId": null,
      "dueDate" :  this.f.dueDate ? this.f.dueDate.value : null
     };

    this.totalObjects.forEach(obj => {
      let key = obj.recordTypeName;
      let value = obj.recordIdName;
      payload[TYPE_MAPPINGS[this.f[key].value]] = this.f[value].value;
    })
    this.inboxService.createTask(payload).subscribe(res => {
      if(res.errorCode && res.errorCode.description) {
        this.toastr.error(res.errorCode.description);
      } else {
        this.toastr.success(res.successMsgDescription);
      }
    }, err => {
      this.toastr.error('Service Error!');
    })
  }

  handleSelection(selectedId){
    this.selectedPrsnId = selectedId;
    if(!this.createManualNotice.get('personId1').value) {
      this.createManualNotice.get('personId1').patchValue(this.selectedPrsnId);
    } else {
      if(this.createManualNotice.get('personId2') && !this.createManualNotice.get('personId2').value) {
        this.createManualNotice.get('personId2').patchValue(this.selectedPrsnId);
      }
    }
  }

  get f() {
   return this.createManualNotice.controls;
  }

  isPersonIdsFilled() {
    if((this.f.personId1.value !== '' && !this.createManualNotice.get('personId2')) || (this.f.personId1.value !== '' && this.f.personId2.value !== '')) {
      return false;
    }
  }

  showAssignUserDialog() {
    const dialogConfig =  new MatDialogConfig();
    dialogConfig.minWidth = '800px';
    dialogConfig.minHeight = '405px';
    dialogConfig.panelClass = 'edit-profile-container';
    dialogConfig.data = {
      taskMasterId :  this.selectedRecord.taskMasterId
    }
    const dialogRef = this.matDialog.open(AssignUserComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      const assignUser = "userid = "+result.userId+" ; "+"roleId = "+result.roleId;
      this.createManualNotice.controls.assignUser.patchValue(assignUser);
    });
  }

  ngOnDestroy(){
    if(this.subscriptions$ && this.subscriptions$.length > 0) {
      this.subscriptions$.forEach(subscription$ => subscription$.unsubscribe());
    }
  }

}
