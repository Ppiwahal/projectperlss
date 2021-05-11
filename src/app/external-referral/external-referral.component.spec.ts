import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalReferralComponent } from './external-referral.component';

describe('ExternalReferralComponent', () => {
  let component: ExternalReferralComponent;
  let fixture: ComponentFixture<ExternalReferralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExternalReferralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalReferralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
