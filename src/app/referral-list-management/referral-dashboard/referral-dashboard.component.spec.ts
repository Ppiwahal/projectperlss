import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferralDashboardTableComponent } from './referral-dashboard.component';

describe('ReferralDashboardTableComponent', () => {
  let component: ReferralDashboardTableComponent;
  let fixture: ComponentFixture<ReferralDashboardTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferralDashboardTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferralDashboardTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
