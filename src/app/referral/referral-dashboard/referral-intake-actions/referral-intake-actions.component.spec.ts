import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferralIntakeActionsComponent } from './referral-intake-actions.component';

describe('ReferralIntakeActionsComponent', () => {
  let component: ReferralIntakeActionsComponent;
  let fixture: ComponentFixture<ReferralIntakeActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReferralIntakeActionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferralIntakeActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
