import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferralSchoolWorkComponent } from './referral-school-work.component';

describe('ReferralSchoolWorkComponent', () => {
  let component: ReferralSchoolWorkComponent;
  let fixture: ComponentFixture<ReferralSchoolWorkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferralSchoolWorkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferralSchoolWorkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
