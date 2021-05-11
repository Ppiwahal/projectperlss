import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { WorkloadManagementService } from './services/workload-management.service'
import { ToastrService } from 'ngx-toastr';
import {forkJoin} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
@Component({
  selector: 'app-workload-management',
  templateUrl: './workload-management.component.html',
  styleUrls: ['./workload-management.component.scss']
})
export class WorkloadManagementComponent implements OnInit, OnDestroy {

  dataToOverAllTask: any[] = [];
  datatToPendingTask = [];
  buttonNamestoPendingTask = [];
  taskResultTableData = [];
  taskQueue:any[];
  module: any[];
  recordType: any[];
  taskPriority: any[];
  responseFromBackend: any;
  subscriptions$:any[] = [];
  dashBoardCodes: any[] = [];
  taskQueueCodes: any[] = [];
  searchSelected: boolean;
  taskStatusCodes : any[] = [];
  taskPiorityCodes: any[] = [];
  userId;
  entityId;

  constructor(private workloadManagementService: WorkloadManagementService,
              private toastr: ToastrService) {
    this.workloadManagementService.reloadWorkfloadComponent$$.subscribe((res) => {
      if(res) {
        this.ngOnInit();
        this.taskResultTableData = [];
      }

    });
  }

  ngOnInit(): void {
    const localStorageforLocal = localStorage.getItem('APP_STORAGE_TOKEN');
    this.userId= JSON.parse(localStorageforLocal).userName;
    this.entityId = JSON.parse(localStorageforLocal).entityId;
    const dashBoardSubscription$ = this.workloadManagementService.getDropDownValues('DASHBOARD').subscribe( res=>{
      this.dashBoardCodes = res;
    });
    this.subscriptions$.push(dashBoardSubscription$)

    const taskStatusSubscription$ = this.workloadManagementService.getDropDownValues('TASK_STATUS').subscribe( res=>{
      this.taskStatusCodes = res;
      this.workloadManagementService.taskStatus = res;
    });
    this.subscriptions$.push(taskStatusSubscription$);
    const taskPioritySubscription$ = this.workloadManagementService.getDropDownValues('TASK_PRIORITY').subscribe( res=>{
      this.taskPiorityCodes=res;
      this.workloadManagementService.priority= res;

    });
    this.subscriptions$.push(taskPioritySubscription$);
    const yrsnoSubscription$ = this.workloadManagementService.getDropDownValues('YES_NO').subscribe( res=>{
      this.workloadManagementService.yesNo= res;

    });
    this.subscriptions$.push(yrsnoSubscription$);
    const grandRegionSubscription$ = this.workloadManagementService.getDropDownValues('GRAND_REGION').subscribe( res=>{
      this.workloadManagementService.grandRegion= res;

    });
    this.subscriptions$.push(grandRegionSubscription$);
    const taskQueueSubscription$ = this.workloadManagementService.getDropDownValues('TASK_QUEUE').subscribe( res=>{
      this.taskQueueCodes = res;
      this.taskQueue = res.sort(function (a, b) {
        return a.value < b.value ? -1 : 1;
      });
    });
    this.subscriptions$.push(taskQueueSubscription$)

    const observables = [];
    observables.push(this.workloadManagementService.getTaskPerformancedDetails( this.userId, this.entityId));
    //observables.push(this.workloadManagementService.getPastDueTaskPerformanceDetails(this.userId, this.entityId));
    observables.push(this.workloadManagementService.getOpenTaskPerformanceDetails(this.userId, this.entityId));
    const taskPerformanceSubscription$ = forkJoin(observables).subscribe((res: any) =>{
      if(res[0] && res[0].errorCode && res[0].errorCode.length > 0 && res[0].errorCode[0].description){
        this.toastr.error( res[0].errorCode[0].description);
      } else {
        this.dataToOverAllTaskComp(res[0]);
        //const openAndPendingTaskList = [...res[1], ...res[2]];
        //this.populateDataForPendingTask(res[1]);
        this.dataToOverAllTask = res[0].pastDueTaskGroupByQue;
        this.modifyDataInPendingTaskType(res[1]);
      }
    }, (error:any) => {
      this.toastr.error("Internal Server Error");
    });
    this.subscriptions$.push(taskPerformanceSubscription$)

      const moduleSubscription$ = this.workloadManagementService.getDropDownValues('MODULE').subscribe( res=>{
        this.module = res.sort(function (a, b) {
          return a.value < b.value ? -1 : 1;
        });
      });
      this.subscriptions$.push(moduleSubscription$)

      const recordTypeSubscription$ = this.workloadManagementService.getDropDownValues('RECORD_TYPE').subscribe( res=>{
        this.recordType = res.sort(function (a, b) {
          return a.value < b.value ? -1 : 1;
        });
      });
      this.subscriptions$.push(recordTypeSubscription$)

      const taskPrioritySubscription$ = this.workloadManagementService.getDropDownValues('TASK_PRIORITY').subscribe( res=>{
        this.taskPriority = res;
      });
      this.subscriptions$.push(taskPrioritySubscription$)

  }

  // populateDataForPendingTask(res) {
  //   const groupedData = res.reduce((acc, obj) => {
  //     const key = obj.taskMasterId;
  //     if (!acc[key]) {
  //       acc[key] = [];
  //     }
  //     acc[key].push(obj);
  //     return acc;
  //   }, {});
  //   this.dataToOverAllTask = [];
  //   const taskMasterArr = Object.keys(groupedData);
  //   taskMasterArr.forEach(masterId => {
  //     const taskMasterArrObj = groupedData[masterId];
  //     this.dataToOverAllTask.push({value: taskMasterArrObj[0].taskName, newArrayData: taskMasterArrObj });
  //   });
  // }

  dataToOverAllTaskComp(res){
    this.responseFromBackend = res;

  }

  modifyDataInPendingTaskType(openAndPendingTaskList){
    this.datatToPendingTask = [];
    const taskMasterIdCodes = [];
    const dashBoardData = openAndPendingTaskList;
    const dashBoardValues = this.getDashBoardValues(dashBoardData);
    this.buttonNamestoPendingTask = dashBoardValues.map(a => ({...a}));
    openAndPendingTaskList.forEach( ele => {
      taskMasterIdCodes.push(ele.taskMasterId);
    });
    const uniqueMasterIdCodes = [...new Set(taskMasterIdCodes)];
    uniqueMasterIdCodes.forEach( ele => {
      this.taskQueueCodes.filter( filData => {
        if( ele == filData.code){
          this.datatToPendingTask.push({'code':ele, 'value':filData.value})
        }
      })
    })
    this.datatToPendingTask.forEach( ele =>{
      const taskMasterDataArray: any = [];
      openAndPendingTaskList.filter( filData =>{
        if(ele.code === filData.taskMasterId){
          taskMasterDataArray.push(filData)
        }
      });
      ele.taskMasterArray = taskMasterDataArray;
      ele.count = taskMasterDataArray.length;
    })
  }

  getDashBoardValues(data){
    let dashBoardValues = []
    let pastduetaskCodes = [];
    data.forEach( element => {
      pastduetaskCodes.push(element.dashBoardCd)
    })
    let uniqueArray = [...new Set(pastduetaskCodes)];
    uniqueArray.forEach( Uniquecode => {
      this.dashBoardCodes.filter( ele => {
        if( Uniquecode === ele.code ){
          dashBoardValues.push({"code":Uniquecode, "value":ele.value })
        }
      })
    })
    return dashBoardValues;
  }

  pendingTaskDataTable(event){
    this.taskResultTableData = [];
    this.taskResultTableData = event.taskMasterArray;
  }

  taskSearch(data){
    this.taskResultTableData = [];
    const localStorageforLocal = localStorage.getItem('APP_STORAGE_TOKEN');
    this.entityId = JSON.parse(localStorageforLocal).entityId;
  let formValues = data.formValues;
  const teaskSearchSubscription$ = this.workloadManagementService.getTaskSearchData(data.value, this.entityId).subscribe( res =>{
    this.filterDataToTaskSearch(res, formValues);
    // this.searchSelected = true;
    // this.taskResultTableData = res;
  });
  this.subscriptions$.push(teaskSearchSubscription$)
  }

  filterDataToTaskSearch(res, formValues){
    this.searchSelected = true;
    this.taskResultTableData = res;
    if(formValues.personId !== ''){
      this.taskResultTableData = this.taskResultTableData.filter( element => {
        if(element.taskResponseVO.personId == formValues.personId){
          return Object.assign({}, element);
        }
      });
    }
      if(formValues.taskQueue !== ''){
        this.taskResultTableData = this.taskResultTableData.filter( element => {
          if(element.taskMasterId == formValues.taskQueue){
            return Object.assign({}, element);
          }
        });
      }

      if(formValues.module !== ''){
        this.taskResultTableData = this.taskResultTableData.filter( element => {
          if(element.dashBoardCd == formValues.module){
            return Object.assign({}, element);
          }
        });
      }

      if(formValues.recordType !== '' && formValues.recordId !== ''){
        this.taskResultTableData = this.taskResultTableData.filter( element => {
          return Object.assign({}, element);
        });
      }

    if(formValues.recordId !== ''){
      this.taskResultTableData = this.taskResultTableData.filter( element => {
        const recordIds = [];
        if (element.userIdResponseVO.paeId) { recordIds.push(element.userIdResponseVO.paeId); }
        if (element.userIdResponseVO.referralId) { recordIds.push(element.userIdResponseVO.referralId); }
        if (element.userIdResponseVO.appealId) { recordIds.push(element.userIdResponseVO.appealId); }
        if (element.userIdResponseVO.transitionId) { recordIds.push(element.userIdResponseVO.transitionId); }
        if (element.userIdResponseVO.enrollmentId) { recordIds.push(element.userIdResponseVO.enrollmentId); }
        if(recordIds.indexOf(formValues.recordId) > -1) {
          return Object.assign({}, element);
        }
      });
    }

      if(formValues.assignUser !== ''){
        this.taskResultTableData = this.taskResultTableData.filter( element => {
          if(element.assignedUserId == formValues.assignUser){
            return Object.assign({}, element);
          }
        });
      }
      if(formValues.taskPriority !== ''){
        this.taskResultTableData = this.taskResultTableData.filter( element => {
          if(element.priority == formValues.taskPriority){
            return Object.assign({}, element);
          }
        });
      }
      if(formValues.dueDate !== ''){
        this.taskResultTableData = this.taskResultTableData.filter( element => {
          let dueDate = new Date(formValues.dueDate).toISOString().substring(0, 10);
          if(element.dueDate == dueDate){
            return Object.assign({}, element);
          }
        });
      }

  }

  ngOnDestroy(){
    if(this.subscriptions$ && this.subscriptions$.length > 0) {
      this.subscriptions$.forEach(subscription$ => subscription$.unsubscribe());
    }
   }

}
