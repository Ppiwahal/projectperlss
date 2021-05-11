import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AdjudicationDetailsService } from 'src/app/core/services/adjudication/adjudication-details.service';
import { PaeCommonService } from 'src/app/core/services/pae/pae-common/pae-common.service';
export interface Task {
  module: string;
  recordId: string;
  taskQueue: string;
  dueDate: string;
  status: string;
  priority: string;
  }

@Component({
  selector: 'app-supporting-documents',
  templateUrl: './supporting-documents.component.html',
  styleUrls: ['./supporting-documents.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class SupportingDocumentsComponent implements OnInit {
  dataSource: MatTableDataSource<Task> = new MatTableDataSource([]);
  expandedElement;
  displayedColumns: string[] = ['module'];
  icon = true;
  adj_id : any ;
 
  constructor(private adjudicationDetailsService: AdjudicationDetailsService, private paeCommonService: PaeCommonService) { }

  ngOnInit(): void {
    this.adj_id = this.paeCommonService.getAdjId();
    this.getSupportingDocuments(this.adj_id);
  }

  getSupportingDocuments(adjId) {
    this.adjudicationDetailsService.getSupportingDocuments(adjId).subscribe(
      res => {
        this.dataSource = new MatTableDataSource(res.appDocumentVO);
        },
      error => { }
    )
  }

  onArrowChange():void{
    this.icon = !this.icon;
  }

  generatePdf(){
    const response = this.adjudicationDetailsService.createPdf();
    response.then(resp => {
      if(resp){
        console.log(resp);
        this.debugBase64('data:application/pdf;base64,' + resp.body[0].document);
      }      
    });
  }

  debugBase64(base64URL) {
    console.log(base64URL);
    const win = window.open();
    win.document.write('<iframe src="' + base64URL + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>');
  }
}
