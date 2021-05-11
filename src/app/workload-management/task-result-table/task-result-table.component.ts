import { Component,Input, OnInit, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { UpdateTaskPopupComponent } from '../update-task-popup/update-task-popup.component'
import * as customValidation from '../../_shared/constants/validation.constants';
import { ViewTaskPopupComponent } from '../view-task-popup/view-task-popup.component';
import { AssignUserComponent } from '../assign-user/assign-user.component';


@Component({
  selector: 'app-task-result-table',
  templateUrl: './task-result-table.component.html',
  styleUrls: ['./task-result-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class TaskResultTableComponent implements OnInit {
  columnsToDisplay: string[] = ['taskType', 'taskAge', 'status', 'priority', 'dueDate', 'userName', 'userActions'];
  expandedElement: any | null;
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  showTable: boolean = false;
  @Input() taskResultTableData:any;
  @Input() isDataFromPendingTaskType: boolean;
  @Input() isDataFromTaskSearch: boolean;
  @Input() taskQueueCodes;
  @Input() taskStatusCodes;
  @Input() taskPiorityCodes;
  checkboxColumn: string = 'select';
  checkboxColumnHeader:string = 'Select';
  selectableCheckbox: string[] = ['Assigned','New'];
  selection = new SelectionModel<any>(true, []);
  isAnyTaskSelected: boolean = false;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  customValidation = customValidation;
  noRecordsFound: boolean = false;
  @Input() searchSelected: boolean = false;

  constructor(private matDialog: MatDialog) { }

  ngOnInit(): void {
  }

  loadTaskResultTable(){

    if(this.taskResultTableData.length > 0){
      if(this.searchSelected){
        this.noRecordsFound = false;
      }
      this.showTable = true;
      this.taskResultTableData.forEach( element => {
        let todayDate = new Date().getTime();
        let creationDate = new Date(element.taskResponseVO.taskCreateDate).getTime();
        element.taskAge = Math.round((todayDate - creationDate)/(1000 * 3600 * 24)) + " Days";
        element["statusValue"] = this.getNameByCode(element.status,'TS');
        element["priorityValue"] = this.getNameByCode(element.priority,'TP');
        Object.keys(element.taskResponseVO).forEach(key => {
          element[key] = element.taskResponseVO[key];
        });
        this.taskQueueCodes.forEach( data => {
          if(element.taskMasterId == data.code){
            element.taskName = data.value;
          }
        })
      })
     this.taskResultTableData.sort(
        function(a, b) {
           return a.taskAge > b.taskAge ? 1 : -1;
       });
      this.dataSource = new MatTableDataSource(this.taskResultTableData);
      setTimeout(() => this.dataSource.paginator = this.paginator);
    } else {
      if(this.searchSelected){
        this.noRecordsFound = true;
      }
      this.showTable = false;
    }
  }

  getNameByCode(code: string, entity: string) {
    if (entity === 'TS' && code) {
      const result = this.taskStatusCodes.filter(item => item.code === code);
      return result.length > 0 ? result[0].value : code;
    }
    if (entity === 'TP' && code) {
      const result = this.taskPiorityCodes.filter(item => item.code === code);
      return result.length > 0 ? result[0].value : code;
    }

  }

  ngOnChanges(){
    this.loadTaskResultTable()
  }

  // applyFilter(filterValue: string) {
  //   filterValue = filterValue.trim();
  //   filterValue = filterValue.toLowerCase();
  //   this.dataSource.filter = filterValue;
  // }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    console.log('filterValue ', filterValue);
    console.log("dataSource ",this.dataSource);
    this.dataSource.filter = filterValue.trim();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.filter(row => this.selectableCheckbox.indexOf(row.statusValue) !== -1).length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => {
        if(this.selectableCheckbox.indexOf(row.statusValue) !== -1) {
          this.selection.select(row);
        }
      });
    this.isAnyTaskSelected = this.selection.selected && this.selection.selected.length > 0;
  }

  handleSelection(event, row) {
    if(event) {
      this.selection.toggle(row);
      this.isAnyTaskSelected = this.selection.selected && this.selection.selected.length > 0;
    }
  }

  toggleSelectDisplay() {
    if(this.columnsToDisplay.indexOf(this.checkboxColumn) > -1) {
      this.columnsToDisplay.shift();
      this.checkboxColumnHeader = 'Select';
      this.selection.clear();
      this.isAnyTaskSelected = false;
    } else {
      this.columnsToDisplay = [...[this.checkboxColumn],...this.columnsToDisplay];
      this.checkboxColumnHeader = 'Hide';
    }
  }


  showAssignTaskDialog() {
    var inputData = {selection: this.selection.selected,source:'showAssignTask'};
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.minWidth = '800px';
    dialogConfig.minHeight = '405px';
    dialogConfig.data = {
      data:inputData
    }
    this.matDialog.open(AssignUserComponent, dialogConfig);
  }


  openUpdateTask(element){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "650px"
    dialogConfig.data = {
      data:element
    }
    this.matDialog.open(UpdateTaskPopupComponent, dialogConfig);
  }
  openViewTask(element){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "650px"
    dialogConfig.data = {
      data:element
    }
    this.matDialog.open(ViewTaskPopupComponent, dialogConfig);
  }


}
