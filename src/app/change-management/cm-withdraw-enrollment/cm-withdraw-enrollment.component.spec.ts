import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmWithdrawEnrollmentComponent } from './cm-withdraw-enrollment.component';

describe('CmWithdrawEnrollmentComponent', () => {
  let component: CmWithdrawEnrollmentComponent;
  let fixture: ComponentFixture<CmWithdrawEnrollmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CmWithdrawEnrollmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CmWithdrawEnrollmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
