import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReferralListManagementService } from '../services/referral-list-management.service'


@Component({
  selector: 'app-referral-dashboard',
  templateUrl: './referral-dashboard.component.html',
  styleUrls: ['./referral-dashboard.component.scss']
})
export class ReferralDashboardComponent implements OnInit, OnDestroy{

  intakeOutComeData: any[] = [];
  agedCareGiverData: any[] = [];
  ecfReferralCountData: any;
  taskQueueData: any[] = [];
  searchResultData: any[] = [];
  referralListStatus: any[] = [];
  intakeOutCome: any[] = [];
  outReachDue: any[] = []; 
  taskQueue: any[] = [];
  taskStatus: any[] = [];
  showNoRecordsFound: boolean;
  subscriptions$:any[] = [];
  taskTableShowResult: boolean = false;
  constructor(private referralListManagementService: ReferralListManagementService) { }

  ngOnInit(): void {
    this.loadDashBoardData();
  }

  loadDashBoardData(){

     const statusDropDownData$ = this.referralListManagementService.getReferralListStatus().subscribe( res=>{
        this.referralListStatus = res.sort(function (a, b) {
            return a.value < b.value ? -1 : 1;
          });
          this.referralListManagementService.referralListCodes=this.referralListStatus;
      });
      this.subscriptions$.push(statusDropDownData$);

      const intakeOutCome$ = this.referralListManagementService.getIntakeOutCome().subscribe( res=>{
        this.intakeOutCome = res.sort(function (a, b) {
            return a.value < b.value ? -1 : 1;
          });
          this.referralListManagementService.intakeOutcomeCodes=this.intakeOutCome;
      });
      this.subscriptions$.push(intakeOutCome$);

      const outReachDueDate$ = this.referralListManagementService.getOutreacDue().subscribe( res=>{
        this.outReachDue = res;
      });
      this.subscriptions$.push(outReachDueDate$);

      const taskQueue$ = this.referralListManagementService.getTaskQueue().subscribe( res=>{
        this.taskQueue = res.sort(function (a, b) {
            return a.value < b.value ? -1 : 1;
          });
          this.referralListManagementService.taskQueueCodes=this.taskQueue;

      });
      this.subscriptions$.push(taskQueue$);

      const taskStatus$ = this.referralListManagementService.getTaskStatus().subscribe( res=>{
        this.taskStatus = res;
        this.referralListManagementService.taskStatusCodes=this.taskStatus;

      });

      this.subscriptions$.push(taskStatus$);

    const inTakeOutcomeCount$ = this.referralListManagementService.getInTakeOutcomeCount().subscribe( res=>{
      this.getIntakeOutComeDate(res);

      });
      this.subscriptions$.push(inTakeOutcomeCount$);

      const agedCareGiver$ = this.referralListManagementService.getEvaluatedAgedCaregiver().subscribe( res=>{
    this.getAgedCareGiver(res);

      });
      this.subscriptions$.push(agedCareGiver$);

      const ecfReferralList$ = this.referralListManagementService.getECFRefererralList().subscribe( (res:any) =>{
        this.modifyTaskDetails(res.referalSearchResults)
        this.ecfReferralCountData = res;
      });
      this.subscriptions$.push(ecfReferralList$);    

      const referralListQueue$ = this.referralListManagementService.getReferralListQueue().subscribe( (res:any) =>{
        this.getTaskQueueData(res);
        this.taskTableShowResult = true;

      });
      this.subscriptions$.push(referralListQueue$);    

  };

  getIntakeOutComeDate(res){
    this.intakeOutComeData = [];
    res.forEach( data => {
      this.modifyTaskDetails(data.referralSearchRespVO);
    })
    const reserveCapacity= res.filter(x=>x.intakeOutcome === "RC");
    if(reserveCapacity.length>0){
      reserveCapacity[0].value = "Reserve Capacity(RC)";
      this.intakeOutComeData=[...this.intakeOutComeData, reserveCapacity[0]]
    }
    const priorityGroup= res.filter(x=>x.intakeOutcome === "PG");
    if(priorityGroup.length>0){
      priorityGroup[0].value = "Priority Group(PG)";
      this.intakeOutComeData=[...this.intakeOutComeData, priorityGroup[0]]

    }
    const noPriorityGroup= res.filter(x=>x.intakeOutcome === "NOPG");
    if(noPriorityGroup.length>0){
      noPriorityGroup[0].value = "No RC/PG/Aged Caregiver";
      this.intakeOutComeData=[...this.intakeOutComeData, noPriorityGroup[0]]

    }
    const deffered= res.filter(x=>x.intakeOutcome === "DEF");
    if(deffered.length>0){
      deffered[0].value = "Deferred";
      this.intakeOutComeData=[...this.intakeOutComeData, deffered[0]]

    }
  }

  getAgedCareGiver(res){
    this.agedCareGiverData = [];
        res.forEach( (element:any) =>{
            if(element.evaluateAgedCareGiver === "ID"){
              element.value = "Intellectual Disability (ID)";
              this.agedCareGiverData.push(element)
           } else if(element.evaluateAgedCareGiver === "DD") {
            element.value = "Developmental Disability (DD)";
            this.agedCareGiverData.push(element)
           }
          }); 
         
          var idItem=this.agedCareGiverData.filter(x=>x.evaluateAgedCareGiver === "ID");
          if(idItem == null || idItem=== undefined || idItem.length===0){
            var newItem={value : "Intellectual Disability (ID)",evaluateAgedCareGiver:"ID",count:0,referralSearchRespVO:[]};
            this.agedCareGiverData.push(newItem);
          }
          var ddItem=this.agedCareGiverData.filter(x=>x.evaluateAgedCareGiver === "DD");
          if(ddItem == null || ddItem=== undefined || ddItem.length===0){
            var newItem={value : "Developmental Disability (DD)",evaluateAgedCareGiver:"DD",count:0,referralSearchRespVO:[]};
            this.agedCareGiverData.push(newItem);
          }
  }

  modifyTaskDetails(res){
    res.forEach( data => {
       if(data.taskDetails !== undefined){
        let modifiedRes = data.taskDetails.reduce( (a, b) => { return new Date(a.createdDt) < new Date(b.createdDt) ? a : b; }); 
        data.taskDetails = modifiedRes;
       }
     })
   }

   getTaskQueueData(res){
    this.taskQueueData = [];
    let waitingListQueueKeys = Object.keys(res);
    waitingListQueueKeys.forEach( key =>{
      this.taskQueue.forEach( data => {
          if(key == data.code){
            this.taskQueueData.push({value: data.value, code:key, queueArray:res[key].referralListQueue})
          }
      })
    })
  }
  emitReferralTile(event){
    this.searchResultData = [];
    if(event.referralSearchRespVO !== undefined){
      this.searchResultData = event.referralSearchRespVO;
    } else {
      this.searchResultData = event.referalSearchResults;
    }
  }
  emitReferralQueue(event){
    if( Object.prototype.toString.call(event) === '[object Array]' ) {
      this.searchResultData = [];
      event.forEach( element =>{
        element.queueArray.forEach( data =>{
          this.searchResultData.push(data);
        });
      })
  } else {
    this.searchResultData = [];
    this.searchResultData = event.queueArray;
  }
  }
  emitSearchQueryParam(queryParam){
    const referralSearchResult$  = this.referralListManagementService.getReferralSearhResult(queryParam).subscribe( res => {
      this.searchResultData = [];
        if(res.length > 0){
          this.searchResultData = res;
            this.showNoRecordsFound = true;
          } else {
            this.showNoRecordsFound = false;
          }
      }, error =>{
          this.searchResultData = [];
          this.showNoRecordsFound = true;
      });
      this.subscriptions$.push(referralSearchResult$);
  }
  ngOnDestroy() {
    if(this.subscriptions$ && this.subscriptions$.length > 0) {
      this.subscriptions$.forEach(subscription$ => subscription$.unsubscribe());
    }
  }

}