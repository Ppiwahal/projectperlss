import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { QualifiedAssessorService } from '../service/qualified-assessor.service';

@Component({
  selector: 'app-edit-assessor-popup',
  templateUrl: './edit-assessor-popup.component.html',
  styleUrls: ['./edit-assessor-popup.component.scss']
})
export class EditAssessorPopupComponent implements OnInit,  OnDestroy{

  assessorHistoryData: any;
  statusOptions: any;
  editAssessorData: any;
  credentialOptions: any;
  entityData: any;
  subscriptions$: any[] = [];

  constructor(private qualifiedAssessorService: QualifiedAssessorService,
              public dialogRef: MatDialogRef<EditAssessorPopupComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private toastrService: ToastrService) { }

  ngOnInit(): void {
    this.getEditAssessorData();
    this.editAssessorData = this.data.assessorData;
    this.entityData = this.data.entityDropDownData;
    this.statusOptions = this.data.statusData;
    this.credentialOptions = this.data.credentialData;
  }

  getEditAssessorData(){
    const assessorId = this.data.assessorData.assessorId;
    const getAssessorById$ = this.qualifiedAssessorService.getAssessorPopUpData(assessorId).subscribe(res => {
      let index: number;
      const assessorToEdit = res.filter((obj, i) =>
      {
        if (obj.effectiveEndDate === null) {
          index = i;
        }
        return obj.effectiveEndDate === null;
      });
      this.editAssessorData = assessorToEdit[0];
      this.assessorHistoryData = this.moveArrayIndex(res, index, 0);
    });
    this.subscriptions$.push(getAssessorById$);
  }

  moveArrayIndex(arr, old_index, new_index) {
    while (old_index < 0) {
        old_index += arr.length;
    }
    while (new_index < 0) {
        new_index += arr.length;
    }
    if (new_index >= arr.length) {
        let k = new_index - arr.length;
        while ((k--) + 1) {
            arr.push(undefined);
        }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr;
}




  updateAccessorData(editAssessorData) {
    let entityCd = '';
    this.entityData.forEach( data => {
      if (editAssessorData.entity === data.entityId){
        entityCd = data.entityType;
      }
    });
    if (editAssessorData.recertificationDate !== null && editAssessorData.recertificationDate !== '') {
      editAssessorData.endDate = editAssessorData.endDate.toISOString();
      editAssessorData.recertificationDate = new Date(editAssessorData.recertificationDate).toISOString();
    }
    const payLoad = {
      assessorId: editAssessorData.assessorCode,
      credentialsCd : editAssessorData.credentials,
      endDt: editAssessorData.endDate,
      createdBy: editAssessorData.createdBy,
      entityId: parseInt(editAssessorData.entity),
      firstName: editAssessorData.firstName,
      lastName:  editAssessorData.lastName,
      statusCd: editAssessorData.status,
      lastModifiedBy: editAssessorData.lastModifiedBy,
      recertificationDate: editAssessorData.recertificationDate,
      programCd: editAssessorData.program,
      entityCd
    };
    const updateAssossor$ = this.qualifiedAssessorService.updateAssessor(payLoad).subscribe(res => {
      if (res && res.successMsgDescription) {
        this.toastrService.success(res.successMsgDescription);
        this.dialogRef.close(true);
      } else {
        this.toastrService.error('Error updating the Assessor');
      }
      this.getEditAssessorData();
    }, error => {
      this.toastrService.error('Error updating the Assessor');
    });
    this.subscriptions$.push(updateAssossor$);
  }

  closeDialog() {
    this.dialogRef.close();
  }


  ngOnDestroy() {
    if (this.subscriptions$ && this.subscriptions$.length > 0) {
      this.subscriptions$.forEach(subscription$ => subscription$.unsubscribe());
    }
  }

}

