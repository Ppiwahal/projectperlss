import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferralStartComponent } from './referral-start.component';

describe('ReferralStartComponent', () => {
  let component: ReferralStartComponent;
  let fixture: ComponentFixture<ReferralStartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReferralStartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferralStartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
