import { Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as customValidation from '../../_shared/constants/validation.constants';
import { AppointmentsService } from '../services/appointments.service';
import { Router } from "@angular/router";
import { ToastrService } from 'ngx-toastr';

interface ReferenceTable {
  code: string;
  description: string;
}

@Component({
  selector: 'app-cancel-appointment',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './cancel-appointment.component.html',
  styleUrls: ['./cancel-appointment.component.scss']
})
export class CancelAppointmentComponent implements OnInit, OnDestroy {
  cancelForm: FormGroup;
  cancellationReasons: any[] = [{ "name": "", "value": "Select an option", "activateSW": "Y" }];
  customValidation = customValidation;
  subscriptions$: any[] = [];
  constructor(
    public dialogRef: MatDialogRef<CancelAppointmentComponent>,
    private fb: FormBuilder,
    private appointmentService: AppointmentsService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    const cancellationReasonCode$ = this.appointmentService.getAppointmentCancelReason().subscribe(res => {
      if (res && res.length > 0) {
        this.cancellationReasons = [...this.cancellationReasons, ...res];
      }
    });
    this.subscriptions$.push(cancellationReasonCode$);
    this.cancelForm = this.fb.group({
      cancellationReason: ['', [Validators.required]],
      notes: ['']

    });
  }

  get f() { return this.cancelForm.controls; }

  close() {
    this.dialogRef.close();
  }

  cancelAppointment() {
    if (this.cancelForm.invalid) {
      return;
    }
    if (this.data.appointmentId) {
      let payload = {
        id: this.data.appointmentId,
        cancelReasonCd: this.f.cancellationReason.value,
        cancelReasonNotes: this.f.notes.value
      };

      const cancelAppointmentDetails$ = this.appointmentService.cancelAppointment(payload).subscribe(res => {
        this.toastr.success(res.successMsgDescription);
        this.close();
        this.router.navigate([`/ltss/appointments/detail/${this.data.appointmentId}`]);
      }, err => {
        this.toastr.error('Service Error!');
      });
      this.subscriptions$.push(cancelAppointmentDetails$);
    }

  }

  ngOnDestroy() {
    if (this.subscriptions$ && this.subscriptions$.length > 0) {
      this.subscriptions$.forEach(subscription$ => subscription$.unsubscribe());
    }
  }

}