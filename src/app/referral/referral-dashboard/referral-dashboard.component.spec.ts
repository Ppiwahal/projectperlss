import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferralDashboardComponent } from './referral-dashboard.component';

describe('ReferralDashboardComponent', () => {
  let component: ReferralDashboardComponent;
  let fixture: ComponentFixture<ReferralDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReferralDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferralDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
