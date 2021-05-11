import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferralDashboardFilterComponent } from './referral-dashboard-filter.component';

describe('ReferralDashboardFilterComponent', () => {
  let component: ReferralDashboardFilterComponent;
  let fixture: ComponentFixture<ReferralDashboardFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferralDashboardFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferralDashboardFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
