import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferralListManagementComponent } from './referral-list-management.component';

describe('ReferralListManagementComponent', () => {
  let component: ReferralListManagementComponent;
  let fixture: ComponentFixture<ReferralListManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferralListManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferralListManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
