import { Component, OnInit, OnDestroy } from '@angular/core';
import {QualifiedAssessorService} from './service/qualified-assessor.service';
import { MatDialog } from '@angular/material/dialog';
import { AddAssessorPopupComponent } from './add-assessor-popup/add-assessor-popup.component';

@Component({
  selector: 'app-qualified-assessors',
  templateUrl: './qualified-assessors.component.html',
  styleUrls: ['./qualified-assessors.component.scss']
})
export class QualifiedAssessorsComponent implements OnInit, OnDestroy {

  searchAssessorsTableData:any = [];
  entityDropdownData:any=[];
  subscriptions$:any[] = [];
  programDropDownDataData:any = [];
  credentialDropDownDataData:any = [];
  statusDropDownData:any = [];
  showNoRecordsFound: boolean;
  payloadData: any;

  constructor(private qualifiedAssessorService: QualifiedAssessorService, private matDialog: MatDialog) { }

  ngOnInit(): void {
    const entityDropdownData$ = this.qualifiedAssessorService.getEntityDropdown().subscribe(res => {
      this.entityDropdownData = res.sort(function (a, b) {
        return a.entityName < b.entityName ? -1 : 1;
      });
    });
    this.subscriptions$.push(entityDropdownData$);

    const assessorProgramData$ = this.qualifiedAssessorService.getDropDownValues('ASSESSOR_PROGRAM').subscribe( res=>{
      this.programDropDownDataData = res
    });
    this.subscriptions$.push(assessorProgramData$);

    const assessorTypeData$ =  this.qualifiedAssessorService.getDropDownValues('ASSESSOR_TYPE').subscribe( res=>{
      this.credentialDropDownDataData = res
    });
    this.subscriptions$.push(assessorTypeData$);

    const getUserStatus$ = this.qualifiedAssessorService.getDropDownValues('ASSESSOR_STATUS').subscribe( res =>{
      this.statusDropDownData = res;
    });
    this.subscriptions$.push(getUserStatus$);

  }

  searchCallback(param){
    this.payloadData = param;
    const getAssessorData$ = this.qualifiedAssessorService.getAssessorData(param).subscribe( res =>{
      this.searchAssessorsTableData = [];
      this.searchAssessorsTableData = res;
      if(res.length === 0){
        this.showNoRecordsFound = true;
      } else {
        this.showNoRecordsFound = false;
      }
    });
    this.subscriptions$.push(getAssessorData$); 
  }

      openAddAssessor(data){
        const dialogRef = this.matDialog.open(AddAssessorPopupComponent, {
        width: '600px',
        data :{
            entityData:data.entityData,
            programData:data.programData,
            credentialData:data.credentialData
          }
      });
      dialogRef.afterClosed().subscribe( result => {
        if(result !== undefined){
          this.searchAssessorsTableData = [];
          this.searchAssessorsTableData.push(result.assessorVO);
        }
      })

    }

  ngOnDestroy() {
    if(this.subscriptions$ && this.subscriptions$.length > 0) {
      this.subscriptions$.forEach(subscription$ => subscription$.unsubscribe());
    }
  }

}
