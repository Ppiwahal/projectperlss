import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { PatientLiabilityService } from '../../core/services/enrollment/patient-liability/patient-liability.service';

@Component({
  selector: 'app-liability-popup',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './liability-popup.component.html',
  styleUrls: ['./liability-popup.component.scss'],
})
export class LiabilityPopupComponent implements OnInit, OnDestroy {
  liabilityData = [
    {
      amount: 10,
      endDt: '2020-12-12',
      startDt: '2020-06-06',
    },
    {
      amount: 10,
      endDt: '2020-11-12',
      startDt: '2020-05-06',
    },
    {
      amount: 10,
      endDt: '2020-10-12',
      startDt: '2020-04-06',
    },
    {
      amount: 10,
      endDt: '2020-09-12',
      startDt: '2020-03-06',
    },
  ];
  patientLiabilityData: any;
  subscription: Subscription;

  constructor(
    public dialogRef: MatDialogRef<LiabilityPopupComponent>,
    public patientLiabilityService: PatientLiabilityService
  ) {}

  ngOnInit() {
    this.getPatientLiability();
  }

  getPatientLiability() {
    this.subscription = this.patientLiabilityService
      .getPersonLiability()
      .subscribe((response) => {
        this.patientLiabilityData = response;
        console.log(this.patientLiabilityData);
      }); 
  }

  closePopup() {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    console.log('Leftnav Unsubscribed');
  }
}
