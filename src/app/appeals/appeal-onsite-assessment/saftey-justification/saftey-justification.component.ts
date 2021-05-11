import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { AppealService } from '../../services/appeal.service';

@Component({
  selector: 'app-saftey-justification',
  templateUrl: './saftey-justification.component.html',
  styleUrls: ['./saftey-justification.component.scss']
})
export class SafteyJustificationComponent implements OnInit {

  safetyJustificationInfoData: any[] = [];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  showTable: boolean;
  justificationCriteria: any[] = [];
  yesOrNo :any[] = [{"code": "Y", "value":"Yes"},{"code": "N", "value":"No"}];
  displayedColumns: string[] = ['safJustificationCriteria','safetyDetails', 'informationObtained', 'documentUploaded', 'userActions'];
  @Input() onsiteAssessmentOnLoad: any;
  safetyJustiForm: FormGroup;
  @Output() emitSafetyJustification: EventEmitter<any> = new EventEmitter<any>();
  @Input() dataFromReview: any;

  constructor(private formBuilder: FormBuilder,private appealService: AppealService) { }

  ngOnInit(): void {
    this.safetyJustiForm= this.formBuilder.group({
      safetyJustiFormArray: this.formBuilder.array([])
    });
    this.appealService.getAppealDropdowns('SAFETYJUST_CRITERIA').subscribe(res => {
      this.justificationCriteria = res.sort(function (a, b) {
        return a.value < b.value ? -1 : 1;
      });
    });
  }

  get safetyJustiFormArray(){
    return this.safetyJustiForm.get('safetyJustiFormArray') as FormArray;
  }
     

  ngOnChanges(){
    if(this.onsiteAssessmentOnLoad){
      if( this.onsiteAssessmentOnLoad.appealOnsiteSafetyJustificationVOs && this.onsiteAssessmentOnLoad.appealOnsiteSafetyJustificationVOs.length > 0){
        this.onsiteAssessmentOnLoad.appealOnsiteSafetyJustificationVOs.forEach( data => {
          this.safetyJustiFormArray.push(this.formBuilder.group({
            safetyJustCrtrCd:[{value: data.safetyJustCrtrCd, disabled: true}, Validators.required],
            safetyDtls: [{value: data.safetyDtls, disabled: true}, Validators.required],
            infoObtainedSw: [{value: data.infoObtainedSw, disabled: true}, Validators.required],
            docsUploadedSw:[{value: data.docsUploadedSw, disabled: true}, Validators.required]
          }));
          console.log(this.safetyJustiFormArray)
        this.safetyJustificationInfoData.push({constant:'x'});
        })
        this.safetyJustificationInfoData.forEach( (data, i) => {
          data.index = i;
        })
        this.dataSource = new MatTableDataSource(this.safetyJustificationInfoData);
      } else {
        this.onsiteAssessmentOnLoad.appealOnsiteSafetyJustificationVOs = [];
      }
    }
  }
 

  onAddCriteriaClick(){
    this.safetyJustificationInfoData.push({constant:'y', showSaveButton: true})
    this.safetyJustificationInfoData.forEach( (data, i) => {
      data.index = i;
    })
    this.safetyJustiFormArray.push(this.formBuilder.group({
      safetyJustCrtrCd:['', Validators.required],
      safetyDtls: ['', Validators.required],
      infoObtainedSw: ['', Validators.required],
      docsUploadedSw:['', Validators.required]
    }));
    this.dataSource = new MatTableDataSource(this.safetyJustificationInfoData);
  }

  saveRowDetails(element, safetyJustiFormArray, index){
    if(safetyJustiFormArray.controls[index].valid){
      safetyJustiFormArray.controls[index].controls["safetyJustCrtrCd"].disable();
      safetyJustiFormArray.controls[index].controls["safetyDtls"].disable();
      safetyJustiFormArray.controls[index].controls["infoObtainedSw"].disable();
      safetyJustiFormArray.controls[index].controls["docsUploadedSw"].disable();
      safetyJustiFormArray.controls[index].controls["safetyJustCrtrCd"].updateValueAndValidity();
      safetyJustiFormArray.controls[index].controls["safetyDtls"].updateValueAndValidity();
      safetyJustiFormArray.controls[index].controls["infoObtainedSw"].updateValueAndValidity();
      safetyJustiFormArray.controls[index].controls["docsUploadedSw"].updateValueAndValidity();
      element.showSaveButton = false;
      if(this.onsiteAssessmentOnLoad.appealOnsiteSafetyJustificationVOs && this.onsiteAssessmentOnLoad.appealOnsiteSafetyJustificationVOs[index]){
        this.onsiteAssessmentOnLoad.appealOnsiteSafetyJustificationVOs[index].safetyJustCrtrCd = safetyJustiFormArray.value[index].safetyJustCrtrCd;
        this.onsiteAssessmentOnLoad.appealOnsiteSafetyJustificationVOs[index].safetyDtls = safetyJustiFormArray.value[index].safetyDtls;
        this.onsiteAssessmentOnLoad.appealOnsiteSafetyJustificationVOs[index].infoObtainedSw = safetyJustiFormArray.value[index].infoObtainedSw;
        this.onsiteAssessmentOnLoad.appealOnsiteSafetyJustificationVOs[index].docsUploadedSw = safetyJustiFormArray.value[index].docsUploadedSw;
      } else {

        this.onsiteAssessmentOnLoad.appealOnsiteSafetyJustificationVOs.push(safetyJustiFormArray.value[index])
      }
      this.emitSafetyJustification.emit(this.onsiteAssessmentOnLoad.appealOnsiteSafetyJustificationVOs)
    }
  }

  edit(element, safetyJustiFormArray, index){
    if(element.constant === 'x'){
      safetyJustiFormArray.controls[index].controls["infoObtainedSw"].enable();
      safetyJustiFormArray.controls[index].controls["docsUploadedSw"].enable();
    } else {
      safetyJustiFormArray.controls[index].controls["safetyJustCrtrCd"].enable();
      safetyJustiFormArray.controls[index].controls["safetyDtls"].enable();
      safetyJustiFormArray.controls[index].controls["infoObtainedSw"].enable();
      safetyJustiFormArray.controls[index].controls["docsUploadedSw"].enable();
    }
    safetyJustiFormArray.controls[index].controls["safetyJustCrtrCd"].updateValueAndValidity();
    safetyJustiFormArray.controls[index].controls["safetyDtls"].updateValueAndValidity();
    safetyJustiFormArray.controls[index].controls["infoObtainedSw"].updateValueAndValidity();
    safetyJustiFormArray.controls[index].controls["docsUploadedSw"].updateValueAndValidity();
    element.showSaveButton = true;
  }

  delete(element, i){
    const newArray = [];
    this.safetyJustificationInfoData.forEach( data => {
     if(  element.index !== data.index){
        newArray.push(data)
     } 
    })
    this.safetyJustificationInfoData = newArray;
    this.safetyJustiFormArray.removeAt(i)
    this.onsiteAssessmentOnLoad.appealOnsiteSafetyJustificationVOs.splice(i, 1)
    this.dataSource = new MatTableDataSource(this.safetyJustificationInfoData);
    this.emitSafetyJustification.emit(this.onsiteAssessmentOnLoad.appealOnsiteSafetyJustificationVOs)
  }
}
