import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferralDashboardQueueComponent } from './referral-dashboard-queue.component';

describe('ReferralDashboardQueueComponent', () => {
  let component: ReferralDashboardQueueComponent;
  let fixture: ComponentFixture<ReferralDashboardQueueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferralDashboardQueueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferralDashboardQueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
