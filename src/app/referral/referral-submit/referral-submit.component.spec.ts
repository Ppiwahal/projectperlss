import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferralSubmitComponent } from './referral-submit.component';

describe('ReferralSubmitComponent', () => {
  let component: ReferralSubmitComponent;
  let fixture: ComponentFixture<ReferralSubmitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferralSubmitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferralSubmitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
