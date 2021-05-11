import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import * as Constants from '../../../_shared/constants/application.constants';
import * as CryptoJS from 'crypto-js';


const ELEMENT_DATA: any[] = [
  {
    documentName: 'Onsite Assessment',
    isUploaded: true
  }
];


@Component({
  selector: 'app-documents-received-post-noh',
  templateUrl: './documents-received-post-noh.component.html',
  styleUrls: ['./documents-received-post-noh.component.scss']
})
export class DocumentsReceivedPostNOHComponent implements OnInit {

  dataSource: MatTableDataSource<any> = new MatTableDataSource(ELEMENT_DATA);
  columnsToDisplay: string[] = ['documentName','userActions'];
  isUploaded: boolean = true;
  startDate = new Date();

  constructor() { }

  ngOnInit(): void {
    const timeTravelData = localStorage.getItem('TIME_TRAVEL_DATA');
    if(timeTravelData) {
      const timeTravelDataJson = JSON.parse(CryptoJS.AES.decrypt(timeTravelData, Constants.APP_ENC_DECRYPT_KEY).toString(CryptoJS.enc.Utf8));
      console.log("timeTravelDataJson ", timeTravelDataJson);
      if(timeTravelDataJson.timeTravelFlag && timeTravelDataJson.currentDate) {
        this.startDate = new Date(timeTravelDataJson.currentDate);
      }
    }
  }

  upload(file: File, element){
    console.log(file);
    element.isUploaded = false;
  }

  removeDoc(element){
    element.isUploaded = true;
  }

  addDocuments(){
    ELEMENT_DATA.push({
      documentName: 'Onsite Assessment',
      isUploaded: true
    })
    this.dataSource = new MatTableDataSource(ELEMENT_DATA);
  }

}
