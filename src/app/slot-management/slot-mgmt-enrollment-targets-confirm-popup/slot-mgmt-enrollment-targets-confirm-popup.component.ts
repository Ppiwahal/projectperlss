import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SlotManagmentService } from '../services/slot-managment.service';
@Component({
  selector: 'app-slot-mgmt-enrollment-targets-confirm-popup',
  templateUrl: './slot-mgmt-enrollment-targets-confirm-popup.component.html',
  styleUrls: ['./slot-mgmt-enrollment-targets-confirm-popup.component.scss']
})
export class SlotMgmtEnrollmentTargetsConfirmPopupComponent implements OnInit, OnDestroy {
  moveslotsubvalue;
  movesSlotsaddValue;
  ecfCapacity;
  subscriptions$: any[] = [];
  constructor(private fb: FormBuilder,
    public dialogRef: MatDialogRef<SlotMgmtEnrollmentTargetsConfirmPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
    private toastr: ToastrService, private slotManagmentService: SlotManagmentService) { }
  ngOnInit(): void {
    console.log(this.data);
    if (this.data.actionToBePerformed === 'MS') {
      this.moveslotsubvalue = Number.parseFloat(this.data.moveslot.reserveCapacity.toString()) - Number.parseFloat(this.data.moveslot.moveSlotsFrom.toString());
      this.movesSlotsaddValue = Number.parseFloat(this.data.moveslot.slotToReserveCapacity.toString()) + Number.parseFloat(this.data.moveslot.moveSlotsFrom.toString());
    if(this.data.moveslot.selectedslottype[0].ENR_GROUP === 'EC6' && (this.data.moveslot.selectedslotTotype[0].ENR_GROUP === 'EC7' || this.data.moveslot.selectedslotTotype[0].ENR_GROUP === 'EC8')){
       this.movesSlotsaddValue = Number.parseFloat(this.data.moveslot.slotToReserveCapacity.toString())+(Number.parseFloat(this.data.moveslot.moveSlotsFrom.toString())*(1/1.5));
    }
    if((this.data.moveslot.selectedslottype[0].ENR_GROUP === 'EC7' || this.data.moveslot.selectedslottype[0].ENR_GROUP === 'EC8') && (this.data.moveslot.selectedslotTotype[0].ENR_GROUP === 'EC6')){
      this.movesSlotsaddValue = Number.parseFloat(this.data.moveslot.slotToReserveCapacity.toString())+(Number.parseFloat(this.data.moveslot.moveSlotsFrom.toString())*(1.5/1));
   }
    }

    if (this.data.actionToBePerformed === 'ARS') {
      const ecfCapacities$ = this.slotManagmentService.getECFCapacities(this.data.programtype.selectedprogramtype[0].ENR_GROUP, this.data.programtype.selectedprogramtype[0].code, this.data.programtype.enrolltargetvalue).
        subscribe(res => {
          this.ecfCapacity = res;
        });
      this.subscriptions$.push(ecfCapacities$);

    }

  }
  onConfirm() {
    let payload;
    if (this.data.actionToBePerformed === 'ARS') {
      payload =
      {
        "sltActionCd": this.data.actionToBePerformed,
        "enrGroupCd": this.data.programtype.selectedprogramtype[0].ENR_GROUP,
        "sltTypeCd": this.data.programtype.selectedprogramtype[0].code,
        "curEnrCapacity": this.data.programtype.reserveCapacity,
        "newEnrCapacity": this.data.programtype.enrolltargetvalue
      }
      const slotOnAddRemove$ = this.slotManagmentService.updateSlotOnAddRemove(payload).
        subscribe(res => {

          if (res.errorCode) {
            this.toastr.warning(res.errorCode[0].description);
          } else {
            this.toastr.success(res.successMsgDescription);
            this.close();
          }
        });
      this.subscriptions$.push(slotOnAddRemove$);

    }
    if (this.data.actionToBePerformed === 'MS') {
      payload =
      {
        "sltActionCd": this.data.actionToBePerformed,
        "enrGroupCd1": this.data.moveslot.selectedslottype[0].ENR_GROUP,
        "sltTypeCd1": this.data.moveslot.selectedslottype[0].code,
        "curEnrCapacity1": this.data.moveslot.reserveCapacity,
        //"newEnrCapacity1": this.data.moveslot.moveSlotsFrom,// this.moveslotsubvalue
        "enrGroupCd2": this.data.moveslot.selectedslotTotype[0].ENR_GROUP,
        "sltTypeCd2": this.data.moveslot.selectedslotTotype[0].code,
        "curEnrCapacity2": this.data.moveslot.slotToReserveCapacity,
        "slotsMoved": this.data.moveslot.moveSlotsFrom
        //"newEnrCapacity2": this.movesSlotsaddValue
      }
      const updateSlot$ = this.slotManagmentService.updateSlotOnMove(payload).
        subscribe(res => {
          if (res.errorCode) {
            this.toastr.warning(res.errorCode.description);
          } else {
            this.toastr.success(res.successMsgDescription);
            this.close();
            this.router.navigate(['/ltss/slotManagement']);
          }
        });
      this.subscriptions$.push(updateSlot$);

    }
  }
  close() {
    this.dialogRef.close();
  }
  ngOnDestroy() {
    if (this.subscriptions$ && this.subscriptions$.length > 0) {
      this.subscriptions$.forEach(subscription$ => subscription$.unsubscribe());
    }
  }
}
