import { Component, OnInit, OnDestroy, ViewChild, Input, AfterViewInit } from '@angular/core';
import { MapBusinessFunctionsService } from '../services/map-business-functions.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-map-business-functions-list',
  templateUrl: './map-business-functions-list.component.html',
  styleUrls: ['./map-business-functions-list.component.scss'],
})

export class MapBusinessFunctionsListComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input() roleIdList: any;
  @Input() userRoleName: any;
  @Input() accessLevelResponse: any;
  @Input() selectedAccess: any;
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator: MatPaginator;

  public functionData: any;
  ELEMENT_MODULE_DATA = [];
  subscriptions$ = [];
  displayedColumns = [
    'functionName', 'moduleCd', 'accessLevelCd', 'isAssigned'
  ];
  public payload: any = [];
  public moduletabindex = 0;
  public accesstabindex = 0;
  public moduletabcode = '';
  public accesstabcode = '';
  closeButtonhits = 0;
  filterText;
  moduleResponse = [];

  constructor(private mapBusinessFunctionsService: MapBusinessFunctionsService,
              private toastrService: ToastrService) { }

  ngOnInit() {
    this.getModule();
    this.functionData = this.roleIdList;
    this.functionData = this.functionData.sort((a, b) => (a.isAssigned > b.isAssigned) ? 1 : -1);
    this.functionData.reverse();
    this.dataSource = new MatTableDataSource(this.functionData);
    this.dataSource.paginator = this.paginator;
    if (this.selectedAccess !== '') {
      if (this.selectedAccess === 'Read') {
        this.filterFunction('R', 'AC', 1);
      } else if (this.selectedAccess === 'Read/Write') {
        this.filterFunction('RW', 'AC', 2);
      }
    }
  }

  getModule() {
    const ModuleSubscription = this.mapBusinessFunctionsService.getSearchDropdowns('MODULE').subscribe(response => {
      if (response && response.length > 0) {
        const newItemModuleData = { code: 'ALL', value: 'ALL', activateSW: 'Y' };
        this.moduleResponse = response;
        this.ELEMENT_MODULE_DATA = [newItemModuleData, ...response];
      }
    });
    this.subscriptions$.push(ModuleSubscription);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filterText = filterValue;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  toggleAccess(element: any, action: string) {
    element.isAssigned = !element.isAssigned;
    if (this.payload.find(e => e.businessFunctionId === element.businessFunctionId)) {
      this.payload = this.payload.filter(obj => obj !== element);
    } else {
      this.payload.push(element);
    }
  }

  getNameByCode(code: string, entity: string) {
    if (entity === 'MD' && code) {
      const module = this.moduleResponse.filter(item => item.code === code);
      return module.length > 0 ? module[0].value : code;
    }
    if (entity === 'AL' && code) {
      const accessLevel = this.accessLevelResponse.filter(item => item.code === code);
      return accessLevel.length > 0 ? accessLevel[0].value : code;
    }
  }

  filterFunction(code: string, mode: string, clickIndex: number) {
    let filterByText = false;
    if (this.filterText !== undefined && this.filterText != null && this.filterText !== '') {
      filterByText = true;
    }
    if (mode === 'AC') {
      this.accesstabindex = clickIndex;
      this.accesstabcode = code.toUpperCase();
      if (code.toUpperCase() === 'ALL' && (this.moduletabcode === 'ALL' || this.moduletabcode === '')) {
        this.dataSource = new MatTableDataSource(this.functionData);
        if (filterByText) {
          this.dataSource.filter = this.filterText.trim().toLowerCase();
        }
      } else if (this.moduletabcode === 'ALL' || this.moduletabcode === '') {
        const filtereddata = this.functionData.filter(
          fun => (fun.accessLevelCd.toUpperCase() === code.toLocaleUpperCase()));
        this.dataSource = new MatTableDataSource(filtereddata);
        if (filterByText) {
          this.dataSource.filter = this.filterText.trim().toLowerCase();
        }
      }
      else if (code.toUpperCase() === 'ALL') {
        const filtereddata = this.functionData.filter(
          fun => (fun.moduleCd.toUpperCase() === this.moduletabcode));
        this.dataSource = new MatTableDataSource(filtereddata);
        if (filterByText) {
          this.dataSource.filter = this.filterText.trim().toLowerCase();
        }
      } else {
        const filtereddata = this.functionData.filter(
          fun => (fun.accessLevelCd.toUpperCase() === code.toUpperCase() && fun.moduleCd.toUpperCase() === this.moduletabcode));
        this.dataSource = new MatTableDataSource(filtereddata);
        if (filterByText) {
          this.dataSource.filter = this.filterText.trim().toLowerCase();
        }
      }
    }
    if (mode === 'MD') {
      this.moduletabindex = clickIndex;
      this.moduletabcode = code.toUpperCase();
      if (code.toUpperCase() === 'ALL' && (this.accesstabcode === 'ALL' || this.accesstabcode === '')) {
        this.dataSource = new MatTableDataSource(this.functionData);
        if (filterByText) {
          this.dataSource.filter = this.filterText.trim().toLowerCase();
        }
      } else if (this.accesstabcode === 'ALL' || this.accesstabcode === '') {
        const filtereddata = this.functionData.filter(
          fun => (fun.moduleCd.toUpperCase() === code.toLocaleUpperCase()));
        this.dataSource = new MatTableDataSource(filtereddata);
        if (filterByText) {
          this.dataSource.filter = this.filterText.trim().toLowerCase();
        }
      }
      else if (code.toUpperCase() === 'ALL') {
        const filtereddata = this.functionData.filter(
          fun => (fun.accessLevelCd.toUpperCase() === this.accesstabcode));
        this.dataSource = new MatTableDataSource(filtereddata);
        if (filterByText) {
          this.dataSource.filter = this.filterText.trim().toLowerCase();
        }
      }
      else {
        const filtereddata = this.functionData.filter(
          fun => (fun.moduleCd.toUpperCase() === code.toUpperCase() && fun.accessLevelCd.toUpperCase() === this.accesstabcode));
        this.dataSource = new MatTableDataSource(filtereddata);
        if (filterByText) {
          this.dataSource.filter = this.filterText.trim().toLowerCase();
        }
      }
    }
    this.dataSource.paginator = this.paginator;
  }

  onSave() {
    if (this.payload.length > 0) {
      this.mapBusinessFunctionsService.mapFunctions(this.payload).subscribe(response => {
      }, error => {
        if (error === 'OK') {
          this.payload = [];
          this.toastrService.success('Saved Successfully');
        }
      });
    }
  }

  ngOnDestroy() {
    if (this.subscriptions$ && this.subscriptions$.length > 0) {
      this.subscriptions$.forEach(subscription$ => subscription$.unsubscribe());
    }
  }

}
