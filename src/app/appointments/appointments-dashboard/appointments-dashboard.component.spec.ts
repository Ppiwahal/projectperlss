import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentsDashboardComponent } from './appointments-dashboard.component';

describe('AppointmentsDashboardComponent', () => {
  let component: AppointmentsDashboardComponent;
  let fixture: ComponentFixture<AppointmentsDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppointmentsDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppointmentsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
