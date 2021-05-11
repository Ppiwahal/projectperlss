import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisenrollmentDetailsComponent } from './disenrollment-details.component';

describe('DisenrollmentDetailsComponent', () => {
  let component: DisenrollmentDetailsComponent;
  let fixture: ComponentFixture<DisenrollmentDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisenrollmentDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisenrollmentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
