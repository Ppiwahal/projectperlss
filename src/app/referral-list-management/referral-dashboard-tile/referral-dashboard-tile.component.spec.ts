import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferralDashboardTileComponent } from './referral-dashboard-tile.component';

describe('ReferralDashboardTileComponent', () => {
  let component: ReferralDashboardTileComponent;
  let fixture: ComponentFixture<ReferralDashboardTileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferralDashboardTileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferralDashboardTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
