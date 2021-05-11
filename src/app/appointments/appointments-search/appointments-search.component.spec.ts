import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentsSearchComponent } from './appointments-search.component';

describe('AppointmentsSearchComponent', () => {
  let component: AppointmentsSearchComponent;
  let fixture: ComponentFixture<AppointmentsSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppointmentsSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppointmentsSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
