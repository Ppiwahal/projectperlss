import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

const ELEMENT_DATA: any[] = [
  {
    documentName: 'Onsite Assessment',
    isUploaded: true
  },
  {
    documentName: 'Addendum of Attempts',
    isUploaded: true
  }
];

@Component({
  selector: 'app-documentation-required',
  templateUrl: './documentation-required.component.html',
  styleUrls: ['./documentation-required.component.scss']
})
export class DocumentationRequiredComponent implements OnInit {

  
  dataSource: MatTableDataSource<any> = new MatTableDataSource(ELEMENT_DATA);
  columnsToDisplay: string[] = ['documentName','userActions'];

  constructor() { }

  ngOnInit(): void {
  }

}
