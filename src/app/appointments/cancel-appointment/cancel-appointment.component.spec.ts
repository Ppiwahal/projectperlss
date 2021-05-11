import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import {MatDialogRef} from '@angular/material/dialog';
import { CancelAppointmentComponent } from './cancel-appointment.component';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import {AppointmentService} from '../../core/services/appointment/appointment.service';
import {of} from 'rxjs';

const MatDialogMock = {
  close() {}
};

const MockAppointmentService = {
  getCancellationReasonCodes() {
    return of([{"name": "SC", "value": "Scheduled", "activateSW": "Y"},
      {"name": "CA", "value": "Cancelled", "activateSW": "Y"},
      {"name": "CM", "value": "Completed", "activateSW": "Y"},
      {"name": "UC", "value": "Unable to contact", "activateSW": "Y"},
      {"name": "RE", "value": "Rescheduled", "activateSW": "Y"}]);
  },
  cancelAppointment(payload: string) {}
};

describe('CancelAppointmentComponent', () => {
  let component: CancelAppointmentComponent;
  let fixture: ComponentFixture<CancelAppointmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancelAppointmentComponent ],
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

  beforeEach( inject([FormBuilder], (fb: FormBuilder) => {
    fixture = TestBed.createComponent(CancelAppointmentComponent);
    component = fixture.componentInstance;
    component.cancelForm = fb.group({
      cancellationReason:  ['', Validators.required],
      notes: ['', Validators.required]
    });
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close dialog', () => {
    spyOn(component.dialogRef,'close');
    component.close();
    expect(component.dialogRef.close).toHaveBeenCalled();
  });

  it('should not submit form if it is invalid', () => {
    component.cancelAppointment();
    expect(component.cancelForm.invalid).toBe(true);
  });

  it('should submit form if it is valid', () => {
    component.cancelForm.controls.cancellationReason.setValue('CA');
    spyOn(component['appointmentService'],'cancelAppointment');
    component.cancelAppointment();
    expect(component['appointmentService'].cancelAppointment).toHaveBeenCalled();
  });

  it('should set cancel form on init ', () => {
    component.cancellationReasons = [];
    component.ngOnInit();
    expect(component.cancelForm).not.toBe(null);
    expect(component.cancellationReasons.length).toBe(5);
  });

  it('should get form controls ', () => {
    expect(component.f).not.toBe(null);
  });

});
