/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ReferralEnterIntakeOutcomeComponent } from './referral-enter-intake-outcome.component';

describe('ReferralEnterIntakeOutcomeComponent', () => {
  let component: ReferralEnterIntakeOutcomeComponent;
  let fixture: ComponentFixture<ReferralEnterIntakeOutcomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferralEnterIntakeOutcomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferralEnterIntakeOutcomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
