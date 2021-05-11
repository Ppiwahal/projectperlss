import { Component, OnInit, ViewChild, EventEmitter, Output, Inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { UserRolesService } from '../services/user-roles.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-edit-business-functions',
  templateUrl: './edit-business-functions.component.html',
  styleUrls: ['./edit-business-functions.component.scss']
})
export class EditBusinessFunctionsComponent implements OnInit, OnDestroy {
  public functionData: any;
  ELEMENT_MODULE_DATA: any=[];
  subscriptions$: any[] = [];
  displayedColumns: string[] = ['functionName', 'moduleCd', 'accessLevelCd', 'isAssigned'];
  public payload: any = [];
  public moduletabindex = 0;
  public accesstabindex = 0;
  public moduletabcode = '';
  public accesstabcode = '';
  closeButtonhits: number = 0;
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Output() emitTasksCount = new EventEmitter();
  filterText;

  constructor(private fb: FormBuilder, 
              public dialogRef: MatDialogRef<EditBusinessFunctionsComponent>, 
              @Inject(MAT_DIALOG_DATA) public data: any, 
              private userRoleService: UserRolesService, 
              private toastr: ToastrService) { }

  ngOnInit(): void {
    const newItemModuleData = {"code": "ALL", "value":"ALL","activateSW":"Y"};
    this.ELEMENT_MODULE_DATA=[newItemModuleData,...this.userRoleService.module];
    const mapFunctions$ = this.userRoleService.getMapFunctionsByRoleId(this.data.roleId).subscribe(res => {
      this.functionData = res;
      this.functionData = this.functionData.sort(function (a, b) {return a.isAssigned - b.isAssigned });
      this.functionData.reverse();
      this.dataSource = new MatTableDataSource(this.functionData);
      this.dataSource.paginator = this.paginator;
    });
    this.subscriptions$.push(mapFunctions$);

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
    if (this.payload.find(e => ( e['businessFunctionId'] === element['businessFunctionId'] && e['moduleCd'] === element['moduleCd'] &&  e['accessLevelCd'] === element['accessLevelCd']))) {

      this.payload = this.payload.filter(obj => obj != element);
    } else {
      this.payload.push(element);
    }
  }
  getNameByCode(code: string, entity: string) {
    if (entity === 'MD' && code) {
      const module = this.userRoleService.module.filter(item => item.code === code);
      return module.length > 0 ? module[0].value : code;
    }
    if (entity === 'AL' && code) {
      const accessLevel = this.userRoleService.accessLevel.filter(item => item.code === code);
      return accessLevel.length > 0 ? accessLevel[0].value : code;
    }
  }

  filterFunction(code: string, mode: string, clickIndex: number) {
    console.log(this.filterText);
    let filterByText=false;
    if(this.filterText!=undefined ||this.filterText!=null|| this.filterText!=''){
      filterByText=true;
    }
    if (mode === 'AC') {
      this.accesstabindex = clickIndex;
      this.accesstabcode = code.toUpperCase();
      if (code.toUpperCase() === 'ALL' && (this.moduletabcode === 'ALL' || this.moduletabcode === '')) {
        this.dataSource = new MatTableDataSource(this.functionData);
        this.dataSource.paginator = this.paginator;
        if(filterByText){
          this.dataSource.filter = this.filterText.trim().toLowerCase();
        }
      } else if (this.moduletabcode === 'ALL' || this.moduletabcode === '') {
        const filtereddata = this.functionData.filter(
          fun => (fun['accessLevelCd'].toUpperCase() === code.toLocaleUpperCase()));
        this.dataSource = new MatTableDataSource(filtereddata);
        this.dataSource.paginator = this.paginator;
        if(filterByText){
          this.dataSource.filter = this.filterText.trim().toLowerCase();
        }
      }
      else if (code.toUpperCase() === 'ALL') {
        const filtereddata = this.functionData.filter(
          fun => (fun['moduleCd'].toUpperCase() === this.moduletabcode));
        this.dataSource = new MatTableDataSource(filtereddata);
        this.dataSource.paginator = this.paginator;
        if(filterByText){
          this.dataSource.filter = this.filterText.trim().toLowerCase();
        }
      } else {
        const filtereddata = this.functionData.filter(
          fun => (fun['accessLevelCd'].toUpperCase() === code.toUpperCase() && fun['moduleCd'].toUpperCase() === this.moduletabcode));
        this.dataSource = new MatTableDataSource(filtereddata);
        this.dataSource.paginator = this.paginator;
        if(filterByText){
          this.dataSource.filter = this.filterText.trim().toLowerCase();
        }
      }
    }
    if (mode === 'MD') {
      this.moduletabindex = clickIndex;
      this.moduletabcode = code.toUpperCase();
      if (code.toUpperCase() === 'ALL' && (this.accesstabcode === 'ALL' || this.accesstabcode === '')) {
        this.dataSource = new MatTableDataSource(this.functionData);
        this.dataSource.paginator = this.paginator;
        if(filterByText){
          this.dataSource.filter = this.filterText.trim().toLowerCase();
        }
      } else if (this.accesstabcode === 'ALL' || this.accesstabcode === '') {
        const filtereddata = this.functionData.filter(
          fun => (fun['moduleCd'].toUpperCase() === code.toLocaleUpperCase()));
        this.dataSource = new MatTableDataSource(filtereddata);
        this.dataSource.paginator = this.paginator;
        if(filterByText){
          this.dataSource.filter = this.filterText.trim().toLowerCase();
        }
      }
      else if (code.toUpperCase() === 'ALL') {
        const filtereddata = this.functionData.filter(
          fun => (fun['accessLevelCd'].toUpperCase() === this.accesstabcode));
        this.dataSource = new MatTableDataSource(filtereddata);
        this.dataSource.paginator = this.paginator;
        if(filterByText){
          this.dataSource.filter = this.filterText.trim().toLowerCase();
        }
      }
      else {
        const filtereddata = this.functionData.filter(
          fun => (fun['moduleCd'].toUpperCase() === code.toUpperCase() && fun['accessLevelCd'].toUpperCase() === this.accesstabcode));
        this.dataSource = new MatTableDataSource(filtereddata);
        this.dataSource.paginator = this.paginator;
        if(filterByText){
          this.dataSource.filter = this.filterText.trim().toLowerCase();
        }
      }
    }
    this.dataSource.paginator = this.paginator;
    setTimeout(() => {
      this.emitTasksCount.emit(this.dataSource.data.length);
    });

  }
  onSave() {
    if (this.payload.length > 0) {
      const mapfunctions$ = this.userRoleService.mapFunctions(this.payload).subscribe(res =>{
        let resp = JSON.parse(res);
      if (resp.errorCode) {
        this.toastr.warning(resp.errorCode[0].description);
      } else {
        this.payload = [];
        this.toastr.success("Saved Sucessfully");
      }
      
    });
    this.subscriptions$.push(mapfunctions$);
  }
}
  ngOnDestroy() {
    if (this.subscriptions$ && this.subscriptions$.length > 0) {
      this.subscriptions$.forEach(subscription$ => subscription$.unsubscribe());
    }
  }
}
