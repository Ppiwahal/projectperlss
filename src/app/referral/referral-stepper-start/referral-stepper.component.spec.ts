import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferralStepperComponent } from './referral-stepper.component';

describe('ReferralStepperComponent', () => {
  let component: ReferralStepperComponent;
  let fixture: ComponentFixture<ReferralStepperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferralStepperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferralStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
