import { Component, OnInit, ViewChild, EventEmitter, Output, Inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { UserRolesService } from '../services/user-roles.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-edit-task-queues',
  templateUrl: './edit-task-queues.component.html',
  styleUrls: ['./edit-task-queues.component.scss']
})
export class EditTaskQueuesComponent implements OnInit,  OnDestroy {
  subscriptions$:any[] = [];
  public queueData: any;
  ELEMENT_DASHBOARD_DATA: any=[];
  displayedColumns: string[] = ['taskName', 'dashboardCd', 'isAssigned'];
  public payload: any = [];
  public queuetabindex = 0;
  filterText;
  closeButtonhits: number = 0;

  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Output() emitTasksCount = new EventEmitter();

  constructor(private fb: FormBuilder, 
              public dialogRef: MatDialogRef<EditTaskQueuesComponent>, 
              @Inject(MAT_DIALOG_DATA) public data: any, 
              private userRoleService: UserRolesService, 
              private toastr: ToastrService ) { }

  ngOnInit(): void {
    const newItemModuleData = {"code": "ALL", "value":"ALL","activateSW":"Y"};
    this.ELEMENT_DASHBOARD_DATA=[newItemModuleData,...this.userRoleService.dashboardcode];
    const mapQueues$=this.userRoleService.getMapQueuesByRoleId(this.data.roleId).subscribe(res => {
      this.queueData = res;
      this.queueData = this.queueData.sort(function (a, b) {return a.isAssigned - b.isAssigned });
      this.queueData.reverse();
      this.dataSource = new MatTableDataSource(this.queueData);
      this.dataSource.paginator = this.paginator;
    });
    this.subscriptions$.push(mapQueues$);
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    setTimeout(() => {
      this.emitTasksCount.emit(this.dataSource.data.length);
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filterText=filterValue;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  close() {
    if (this.payload.length > 0 && this.closeButtonhits == 0) {
      this.closeButtonhits++;
      this.toastr.warning('You have unsaved changes. Please confirm before continuing changes');
    }
    else {
      this.dialogRef.close();
    }
  }
  toggleAccess(element: any, action: string) {
    element['isAssigned'] = !element['isAssigned'];
    if (this.payload.find(e => e['taskMasterId'] === element['taskMasterId'])) {
      this.payload = this.payload.filter(obj => obj != element);
    } else {
      this.payload.push(element);
    }
  }
  getNameByCode(code: string, entity: string) {
    if (entity === 'DC' && code) {
      const module = this.userRoleService.dashboardcode.filter(item => item.code === code);
      return module.length > 0 ? module[0].value : code;
    }
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
  onSave() {
    if (this.payload.length > 0) {
      this.userRoleService.mapQueues(this.payload).subscribe((res) =>
        this.toastr.success('Saved Successfully'));
        this.payload = [];

      }
  }
  ngOnDestroy(){
    if(this.subscriptions$ && this.subscriptions$.length > 0) {
      this.subscriptions$.forEach(subscription$ => subscription$.unsubscribe());
    }
   }
}
