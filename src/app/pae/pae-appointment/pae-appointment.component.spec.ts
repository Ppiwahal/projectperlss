import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaeAppointmentComponent } from './pae-appointment.component';

describe('PaeAppointmentComponent', () => {
  let component: PaeAppointmentComponent;
  let fixture: ComponentFixture<PaeAppointmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaeAppointmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaeAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
