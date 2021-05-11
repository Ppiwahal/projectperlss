import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-pending-task',
  templateUrl: './pending-task.component.html',
  styleUrls: ['./pending-task.component.scss']
})
export class PendingTaskComponent implements OnInit {

  @Input() buttonNames;
  @Input() pendingTaskData;
  displayedColumns: string[] = ['taskType','count'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  dateButtons: any[] = [{'code':'A', 'value':'All', 'isSelected':true}, {'code':'P', 'value':'Past Due', 'isSelected':false},
                              {'code':'C', 'value':'Coming Due', 'isSelected':false}, {'code':'O', 'value':'Other','isSelected':false}]
  @Output() pendingTaskDataTable: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild(MatPaginator) paginator: MatPaginator;

  filteredData = [];

  constructor() { }

  ngOnInit(): void {
  }

  addSelectedKey(){
    this.buttonNames.unshift({'code':'all', 'value':'All', 'isSelected':true});
    this.buttonNames.forEach( (element,i) => {
      if(i !== 0){
        element.isSelected = false;
      }
    });
  }
  ngOnChanges(){
   if(this.pendingTaskData.length > 0){
    this.dataSource = new MatTableDataSource(this.pendingTaskData);
    this.dataSource.paginator = this.paginator;
    this.addSelectedKey();
    this.filteredData = this.pendingTaskData.map(a => ({...a}));
   }
  }

  onModuleSelected(code){
    console.log("code ",code);
    this.setSelectedtoButton(code)
    this.setSelectedtoDateButton('A');
    this.filteredData = this.pendingTaskData.map(a => ({...a}));
    if(code === 'all'){
        this.dataSource = new MatTableDataSource(this.filteredData);
        this.dataSource.paginator = this.paginator;
    } else {
        this.filteredData.forEach( (element, i) => {
          console.log("element.taskMasterArray ",element.taskMasterArray);
        let filteredArray =  element.taskMasterArray.filter( ele => {
        return code === ele.dashBoardCd;
      })
        element.taskMasterArray = filteredArray;
    });
       let filterArray = [];
       this.filteredData.forEach( element => {
        if(element.taskMasterArray.length > 0){
          filterArray.push(element)
        }
       })
       this.filteredData = filterArray;
       this.dataSource = new MatTableDataSource(this.filteredData);
       this.dataSource.paginator = this.paginator;
    }
    console.log(this.filteredData)

  }

  setSelectedtoButton(code){
    this.buttonNames.forEach( element => {
      if(element.code === code){
        element.isSelected = true;
      } else {
        element.isSelected = false;
      }
    })
  }

  onDateModuleSelected(code){
    this.setSelectedtoDateButton(code);
    const dateFilterData = this.filteredData.map(a => ({...a}));
    if(code === 'A'){
      this.dataSource = new MatTableDataSource(this.filteredData);
      this.dataSource.paginator = this.paginator;
    } else if(code === 'P'){
      dateFilterData.forEach( (element, i) => {
        let filteredArray =  element.taskMasterArray.filter( ele => {
          if(ele.dueDate) {
          let dueDate = new Date(ele.dueDate);
          let todayDate = new Date();

            return todayDate > dueDate;
          }
      })
        element.taskMasterArray = filteredArray;
      });
      this.filterByTaskMasterArrayLength(dateFilterData)
    } else if(code === 'C'){
        dateFilterData.forEach( (element, i) => {
        const filteredArray =  element.taskMasterArray.filter( ele => {
          if(ele.dueDate) {
            const dueDate = new Date(ele.dueDate);
            const createdDate = new Date(ele.taskResponseVO.taskCreateDate);
            const todaysDate = new Date();
            if (dueDate >= todaysDate) {
              const taskCompletion = (dueDate.getDate() - createdDate.getDate());
              const percentageDays = Math.round((taskCompletion * 80) / 100);
              const reminderDate = new Date(createdDate.setDate(createdDate.getDate() + percentageDays));
              return (todaysDate >= reminderDate) && (todaysDate <= dueDate);
            }
          }
      })
        element.taskMasterArray = filteredArray;
      });
      this.filterByTaskMasterArrayLength(dateFilterData);
    } else if(code === 'O'){
      dateFilterData.forEach( (element, i) => {
        let filteredArray =  element.taskMasterArray.filter( ele => {
          if(ele.dueDate) {
            const dueDate = new Date(ele.dueDate);
            const createdDate = new Date(ele.taskResponseVO.taskCreateDate);
            const todaysDate = new Date();
              const taskCompletion = (dueDate.getDate() - createdDate.getDate());
              const percentageDays = Math.round((taskCompletion * 80) / 100);
              const reminderDate = new Date(createdDate.setDate(createdDate.getDate() + percentageDays));
              return (todaysDate < reminderDate);
          }
          return true;
      })
        element.taskMasterArray = filteredArray;
      });
      this.filterByTaskMasterArrayLength(dateFilterData)
    }
  }

  filterByTaskMasterArrayLength(dateFilterData){
    let filterArray = [];
    dateFilterData.forEach( element => {
      if(element.taskMasterArray.length > 0){
        filterArray.push(element)
      }
     })
     dateFilterData = filterArray;
    this.dataSource = new MatTableDataSource(dateFilterData);
    this.dataSource.paginator = this.paginator;
  }


  setSelectedtoDateButton(code){
    this.dateButtons.forEach( element => {
      if(element.code === code){
        element.isSelected = true;
      } else {
        element.isSelected = false;
      }
    })
  }

  showTaskResults(element,){
    this.pendingTaskDataTable.emit(element);
  }


}
