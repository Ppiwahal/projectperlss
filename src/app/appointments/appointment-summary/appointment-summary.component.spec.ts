import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentSummaryComponent } from './appointment-summary.component';
import {FormBuilder} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';
import {AppointmentService} from '../../core/services/appointment/appointment.service';
import {of} from 'rxjs';

const MatDialogMock = {
  close() {}
};

const MockAppointmentService = {
  getAppointmentSummary(personId: string) {
    return of({
      "applicantName": "John Doe",
      "appointmentStatus": "Intake Visit",
      "dobDt": "2020-10-07T01:23:49.619Z"
    })
  }
};

describe('AppointmentSummaryComponent', () => {
  let component: AppointmentSummaryComponent;
  let fixture: ComponentFixture<AppointmentSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppointmentSummaryComponent ],
      providers: [FormBuilder, {
        provide: MatDialogRef,
        useValue: MatDialogMock
      },  {
        provide: AppointmentService,
        useValue: MockAppointmentService
      }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppointmentSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close dialog', () => {
    spyOn(component.dialogRef,'close');
    component.close();
    expect(component.dialogRef.close).toHaveBeenCalled();
  });

  it('should get appointment summary details', () => {
    component.ngOnInit();
    expect(component.appointmentSummary.applicantName).toBe('John Doe');
  });
});
