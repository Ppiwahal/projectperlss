import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AppealService } from '../../services/appeal.service';

const ELEMENT_DATA: any[] = [
  {personName: 'Jessica Jones', ssn: '235-24-1414', dateOfBirth: '05/12/2019', personId: 234567676, 
  county:'Knox', aliasName:'Jessica Moris', physicalAddress:'1012 Washington Av, Nashville. TN 37201',
  mailingAddress:'333 Commerce St.. Suite xx, Nashville, TN 37201'}
];

@Component({
  selector: 'app-person-table',
  templateUrl: './person-table.component.html',
  styleUrls: ['./person-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class PersonTableComponent implements OnInit {

  expandedElement: any | null;
  columnsToDisplay: string[] = ['personName', 'ssn', 'dateOfBirth', 'personId', 'county'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  isNotFoundSelected: boolean = false;
  isPersonSelected: boolean = false;
  @Output() emitAddIndividual: EventEmitter<any> = new EventEmitter<{isSelected: boolean, data: any}>();
  @Input() searchPersonTableData: any[] = [];
  showTable: boolean = false;
  showButton: boolean = false;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  selectPersonButton: boolean = false;
  addIndividualButton: boolean = false;
  countyData: any;

  constructor(private appealService: AppealService) { }

  ngOnInit(): void {
    this.appealService.getAppealDropdowns('COUNTY').subscribe(res => {
      this.countyData = res;
      this.setTableData();
    });
  }

  ngOnChanges(){
  }

  setTableData(){
    if(this.searchPersonTableData.length > 0){
      this.showTable = true;
      this.showButton = true;
      this.searchPersonTableData.forEach((data, i) => {
        if(data.addresses !== undefined){
          data.addresses.forEach( address => {
            if(address.addrType === 'residential'){
              data.physicalAddress = address;
              this.countyData.forEach( county => {
                if(county.code == address.countyCode){
                  data.countyCd = county.value;
                }
              })
            } else if(address.addrType === 'mailing'){
              data.mailingAddress = address;
            }
          })
        }
        if(data.aliases){
          data.aliasFirstName = data.aliases[0].name.firstName
          data.aliasLastName =  data.aliases[0].name.lastName
        }
       
      })
      console.log(this.searchPersonTableData)
      this.dataSource = new MatTableDataSource(this.searchPersonTableData);
      setTimeout(() => this.dataSource.paginator = this.paginator);
    } else {
      this.showTable = false;
      this.showButton = true;
    }
  }



  isPersonNotFoundSelected(){
    this.isNotFoundSelected = !this.isNotFoundSelected
    if(this.isNotFoundSelected){
      this.selectPersonButton = true;
      this.emitAddIndividual.emit({isSelected: true, data: undefined});
    } else {
      this.selectPersonButton = false;
      this.emitAddIndividual.emit({isSelected: false, data: undefined});
    }
  }

  selectedPerson(data){
    this.searchPersonTableData.forEach( person => {
      if(data.index === person.index){
        data.isSelected = !data.isSelected;      }
    })
    if(data.isSelected){
      this.addIndividualButton = true;
      this.emitAddIndividual.emit({isSelected: true, data: data});
    } else {
      this.addIndividualButton = false;
      this.emitAddIndividual.emit({isSelected: false, data: data});
    }
  }


 
  

}
