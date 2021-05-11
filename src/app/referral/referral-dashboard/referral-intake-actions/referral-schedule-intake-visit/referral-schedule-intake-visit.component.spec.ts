/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ReferralScheduleIntakeVisitComponent } from './referral-schedule-intake-visit.component';

describe('ReferralScheduleIntakeVisitComponent', () => {
  let component: ReferralScheduleIntakeVisitComponent;
  let fixture: ComponentFixture<ReferralScheduleIntakeVisitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferralScheduleIntakeVisitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferralScheduleIntakeVisitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
