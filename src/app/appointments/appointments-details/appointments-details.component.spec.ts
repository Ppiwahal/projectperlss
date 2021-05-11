import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentsDetailsComponent } from './appointments-details.component';

describe('AppointmentsDetailsComponent', () => {
  let component: AppointmentsDetailsComponent;
  let fixture: ComponentFixture<AppointmentsDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppointmentsDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppointmentsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
