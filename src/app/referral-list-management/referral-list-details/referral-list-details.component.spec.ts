import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferralListDetailsComponent } from './referral-list-details.component';

describe('ReferralListDetailsComponent', () => {
  let component: ReferralListDetailsComponent;
  let fixture: ComponentFixture<ReferralListDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferralListDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferralListDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
