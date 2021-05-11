import {Component, Inject, OnInit, ViewEncapsulation, OnDestroy} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material/dialog';
import {AppointmentsService} from '../services/appointments.service';
import {Router} from "@angular/router";
import {forkJoin} from 'rxjs';
import {CancelAppointmentComponent} from '../cancel-appointment/cancel-appointment.component';

@Component({
  selector: 'app-appointment-summary',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './appointment-summary.component.html',
  styleUrls: ['./appointment-summary.component.scss']
})
export class AppointmentSummaryComponent implements OnInit, OnDestroy {

  appointmentSummary:any;
  subscriptions$:any[] = [];

  constructor( private matDialog: MatDialog, public dialogRef: MatDialogRef<AppointmentSummaryComponent>,  private appointmentService: AppointmentsService, private router: Router,  @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    if(this.data.appointmentId) {
      const observables  = [];
      observables.push(this.appointmentService.getAppointmentSummary(this.data.appointmentId));
      observables.push(this.appointmentService.getContactMethod());
      observables.push(this.appointmentService.getAppointmentType());
      observables.push(this.appointmentService.getCancellationReasonCodes());
      observables.push(this.appointmentService.getRefType());
      const appointmentSummary$ = forkJoin(observables).subscribe((res: any) => {
        this.appointmentSummary = res[0];
        const contactMethodType = res[1].filter(contactMethod => contactMethod.code === this.appointmentSummary.contactMethodCd);
        if(contactMethodType && contactMethodType.length > 0) {
          this.appointmentSummary.contactMethodValue = contactMethodType[0].value;
        } else {
          this.appointmentSummary.contactMethodValue = '---';
        }
        const appointmentType = res[2].filter(aptMentType => aptMentType.code === this.appointmentSummary.appointmentTypeCd);
        if(appointmentType && appointmentType.length > 0) {
          this.appointmentSummary.appointmentTypeValue = appointmentType[0].value;
        } else {
          this.appointmentSummary.appointmentTypeValue = '---';
        }
        const statusCodeVal = res[3].filter(statusCodes => statusCodes.code === this.appointmentSummary.appointmentStatusCd);
        if(statusCodeVal && statusCodeVal.length > 0) {
          this.appointmentSummary.statusCodeValue = statusCodeVal[0].value;
        } else {
          this.appointmentSummary.statusCodeValue = '---';
        }
        const refType = res[4].filter(programCode => programCode.code === this.appointmentSummary.programCd);
        if(refType && refType.length > 0) {
          this.appointmentSummary.programCd = refType[0].value;
        } else {
          this.appointmentSummary.programCd = '---';
        }
        this.appointmentSummary.address = [];
        if(this.appointmentSummary.appointmentAddressVO.addrLine1) {
          this.appointmentSummary.address.push(this.appointmentSummary.appointmentAddressVO.addrLine1+",");
        }

        if(this.appointmentSummary.appointmentAddressVO.city && this.appointmentSummary.appointmentAddressVO.stateCd) {
          this.appointmentSummary.address.push(this.appointmentSummary.appointmentAddressVO.city+", "+this.appointmentSummary.appointmentAddressVO.stateCd+",");
        } else if(this.appointmentSummary.appointmentAddressVO.city && !this.appointmentSummary.appointmentAddressVO.stateCd) {
          this.appointmentSummary.address.push(this.appointmentSummary.appointmentAddressVO.city+", ");
        } else if(!this.appointmentSummary.appointmentAddressVO.city && this.appointmentSummary.appointmentAddressVO.stateCd) {
          this.appointmentSummary.address.push(this.appointmentSummary.appointmentAddressVO.stateCd+", ");
        }

        if(this.appointmentSummary.appointmentAddressVO.zip && this.appointmentSummary.appointmentAddressVO.extsn) {
          this.appointmentSummary.address.push(this.appointmentSummary.appointmentAddressVO.zip+" - "+this.appointmentSummary.appointmentAddressVO.extsn);
        } else if(this.appointmentSummary.appointmentAddressVO.zip && !this.appointmentSummary.appointmentAddressVO.extsn) {
          this.appointmentSummary.address.push(this.appointmentSummary.appointmentAddressVO.zip);
        } else if(!this.appointmentSummary.appointmentAddressVO.zip && this.appointmentSummary.appointmentAddressVO.extsn) {
          this.appointmentSummary.address.push(this.appointmentSummary.appointmentAddressVO.extsn);
        }

    });
  this.subscriptions$.push(appointmentSummary$);
  }
}

  cancelAppointment() {
  	this.closeDialog();
    this.showCancelDialog();
  }

  showCancelDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.minHeight = '405px';
    dialogConfig.panelClass = 'dialog-container';
    dialogConfig.data = { appointmentId: this.data.appointmentId };
    this.matDialog.open(CancelAppointmentComponent, dialogConfig);
  }

  closeDialog(){
  	this.dialogRef.close();
  }

   formatPhoneNumber(phoneNumberString) {
    const cleaned = ('' + phoneNumberString).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    } else {
      return '---'
    }
  }

  updateAppointment() {
    this.closeDialog();
    this.router.navigate([`/ltss/appointments/detail/${this.data.appointmentId}`]);
  }


  passTheSalt() {
    alert("Hello! I am John Doe");
  }

  ngOnDestroy() {
    if(this.subscriptions$ && this.subscriptions$.length > 0) {
      this.subscriptions$.forEach(subscription$ => subscription$.unsubscribe());
    }
  }

}
