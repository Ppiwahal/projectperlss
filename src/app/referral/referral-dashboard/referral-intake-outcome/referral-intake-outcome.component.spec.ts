import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferralIntakeOutcomeComponent } from './referral-intake-outcome.component';

describe('ReferralIntakeOutcomeComponent', () => {
  let component: ReferralIntakeOutcomeComponent;
  let fixture: ComponentFixture<ReferralIntakeOutcomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReferralIntakeOutcomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferralIntakeOutcomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
