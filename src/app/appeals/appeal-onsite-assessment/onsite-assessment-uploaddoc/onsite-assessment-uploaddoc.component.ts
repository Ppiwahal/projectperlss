import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { RightnavToggleService } from 'src/app/_shared/services/rightnav-toggle.service';
import { AppealService } from '../../services/appeal.service';

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
  selector: 'app-onsite-assessment-uploaddoc',
  templateUrl: './onsite-assessment-uploaddoc.component.html',
  styleUrls: ['./onsite-assessment-uploaddoc.component.scss']
})
export class OnsiteAssessmentUploaddocComponent implements OnInit {

  dataSource = ELEMENT_DATA;
  columnsToDisplay: string[] = ['documentName','userActions'];
  isUploaded: boolean = true;
  index: any;
  @Input() aplRqstDocObtainSw: any;
  @Output() emitUploadDocStatus: EventEmitter<any> = new EventEmitter<any>();
  constructor(private rightnavToggleService: RightnavToggleService, private appealService: AppealService) {

   }

  ngOnInit(): void {
    this.rightnavToggleService.currentAppealOnsiteDocData().subscribe((res: any) => {
      if (res) {
        this.dataSource[this.index].isUploaded = false;
        this.dataSource[this.index].documentId = res[0].documentId;
        this.enableSubmit();
      }
    });
  }

  ngOnChanges(){
    if(this.aplRqstDocObtainSw){
      if(this.aplRqstDocObtainSw === 'Y'){
          let duplicateArray = ELEMENT_DATA.slice(0)
          duplicateArray.splice(1,1)
          this.dataSource = duplicateArray;
          this.enableSubmit()
      }  else {
          this.dataSource = ELEMENT_DATA;
          this.enableSubmit();
      }
    }
  }

  upload(element, i){
    this.index = i;
    this.rightnavToggleService.setRightNavCategoryCode('APL');
    this.rightnavToggleService.setRightNavProgramCode('APL');
    this.rightnavToggleService.setAppealOnsiteassessmentDocData(null);
    this.rightnavToggleService.setAppealSelectUploadFlag(true);
  }
  removeDoc(element){
    element.isUploaded = true;
    element.documentId = null;
    this.enableSubmit();
  }

  showPdf(element){
    if(element.documentId){
      this.appealService.getDocByDocId(element.documentId).subscribe( response => {
        if (response && response.document) {
          this.convertBase64toPdf(response.document, element);
        } 
      })
    }
  }

  convertBase64toPdf(base64, element) {
    const linkSource = 'data:application/pdf;base64,' + base64;
    const downloadLink = document.createElement("a");
    const fileName = element.documentName;
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
}

enableSubmit(){
  if(this.aplRqstDocObtainSw){
    if( (this.aplRqstDocObtainSw === 'Y' && ELEMENT_DATA[0].isUploaded === false) || 
        (this.aplRqstDocObtainSw === 'N' && ELEMENT_DATA[0].isUploaded === false && ELEMENT_DATA[1].isUploaded === false) ){
          this.emitUploadDocStatus.emit(true)
    } else {
          this.emitUploadDocStatus.emit(false)
    }
  }
  
}

}
