import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseReferralPacketComponent } from './case-referral-packet.component';

describe('CaseReferralPacketComponent', () => {
  let component: CaseReferralPacketComponent;
  let fixture: ComponentFixture<CaseReferralPacketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaseReferralPacketComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseReferralPacketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
