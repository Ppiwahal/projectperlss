import { Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import{MapTaskService} from './services/map-task-queues.service'
import {forkJoin} from 'rxjs';


@Component({
  selector: 'app-map-task-queues',
  templateUrl: './map-task-queues.component.html',
  styleUrls: ['./map-task-queues.component.scss']
})
export class MapTaskQueuesComponent implements OnInit,OnDestroy {
  @Input() selectedRow: any;
  public queueData: any;
  taskQueueForm: FormGroup;
  // classifications:any[];
  entityTypes: any[];
  entities:any[];
  userRole:any[];
  entityNames:any[];
  userRoles:any[];
  filterText;
  ELEMENT_MODULE_DATA: any=[];
  isShowList = false;
  subscriptions$: any[] = [];
  public queuetabindex = 0;
  displayedColumns: string[] = ['functionName', 'moduleCd', 'isAssigned'];
  ELEMENT_DASHBOARD_DATA: any=[];
  public moduletabindex = 0;
  public accesstabindex = 0;
  public moduletabcode = '';
  public accesstabcode = '';
  public functionData: any;
  public payload: any = [];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Output() emitTasksCount = new EventEmitter();

  constructor(private fb: FormBuilder,
    private toastr: ToastrService, private mapQueuesService:MapTaskService) { }

  ngOnInit(): void {
    this.taskQueueForm = this.fb.group({
      entityType: [''],
      entity:[''],
      userRole:['',Validators.required],
      classification:[''],
    });
    this.loadFormValues();
   
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    setTimeout(() => {
      this.emitTasksCount.emit(this.dataSource.data.length);
    });
  }
  loadFormValues() {
    const observables = [];
    observables.push(this.mapQueuesService.getStaticDataValues());
    observables.push(this.mapQueuesService.getEntityNames());
    observables.push(this.mapQueuesService.getUserRoles());
    const mapTaskQueue$ = forkJoin(observables).subscribe((res:any) => {
        this.entityTypes = res[0][0];
        // this.classifications =res[1];
        this.ELEMENT_MODULE_DATA = res[0][2];
        this.entityNames = res[1];
        this.userRoles = res[2];
    }, err => {
    })

    this.subscriptions$.push(mapTaskQueue$);
  }
  OnEntityTypeChange() {
    let entityTypeIds:any[] = [];
    this.entities = this.entityNames.filter(item=>{
      if (item.entityType===this.f.entityType.value.code) {
        entityTypeIds.push(item.entityTypeId);
        return item;
      }
    });
    this.userRole = this.userRoles.filter(item=>(entityTypeIds.includes(item.entityTypeId)));
  }
  OnEntityChange(){
      this.userRole = this.userRoles.filter(item=>(item.entityId===this.f.entity.value.entityId));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
 
  filterFunction(code: string, clickIndex: number) {
    let filterByText=false;
    if(this.filterText!=undefined ||this.filterText!=null|| this.filterText!=''){
      filterByText=true;
    }
    this.queuetabindex = clickIndex;
    if (code.toUpperCase() === 'ALL') {
      this.dataSource = new MatTableDataSource(this.queueData);
      this.dataSource.paginator = this.paginator;
      if(filterByText){
        this.dataSource.filter = this.filterText.trim().toLowerCase();
      }
    } else {
      const filtereddata = this.queueData.filter(
        fun => (fun['dashboardCd'].toUpperCase() === code.toUpperCase()));
      this.dataSource = new MatTableDataSource(filtereddata);
      this.dataSource.paginator = this.paginator;
      if(filterByText){
        this.dataSource.filter = this.filterText.trim().toLowerCase();
      }
    }
    this.dataSource.paginator = this.paginator;
    setTimeout(() => {
      this.emitTasksCount.emit(this.dataSource.data.length);
    });
  }

  toggleAccess(element: any, action: string) {
    element['isAssigned'] = !element['isAssigned'];
    if (this.payload.find(e => e['taskMasterId'] === element['taskMasterId'])) {
      this.payload = this.payload.filter(obj => obj != element);
    } else {
      this.payload.push(element);
    }
  }

  onSave() {
    if (this.payload.length > 0) {
      this.mapQueuesService.mapQueues(this.payload).subscribe((res) =>
        this.toastr.success('Saved Successfully'));
        this.payload = [];

      }
  }
  getNameByCode(code: string, entity: string) {
    if (entity === 'DC' && code) {
      const module = this.ELEMENT_MODULE_DATA.filter(item => item.code === code);
      return module.length > 0 ? module[0].value : code;
    }
  }

  executeSearch() {
    if (this.taskQueueForm.valid){
    this.isShowList = true;
    const newItemModuleData = {"code": "ALL", "value":"ALL","activateSW":"Y"};
    this.ELEMENT_DASHBOARD_DATA=[newItemModuleData,...this.ELEMENT_MODULE_DATA];
    const roleId = this.taskQueueForm.value.userRole.roleId;
    const mapQueues$=this.mapQueuesService.getMapQueuesByRoleId(roleId).subscribe(res => {
      this.queueData = res;
      this.queueData = this.queueData.sort(function (a, b) {return a.isAssigned - b.isAssigned });
      this.queueData.reverse();
      this.dataSource = new MatTableDataSource(this.queueData);
      this.dataSource.paginator = this.paginator;
    });
    this.subscriptions$.push(mapQueues$);
    }
}
 
  get f() { return this.taskQueueForm.controls; }

  ngOnDestroy() {
    if (this.subscriptions$ && this.subscriptions$.length > 0) {
      this.subscriptions$.forEach(subscription$ => subscription$.unsubscribe());
    }
  }
}









