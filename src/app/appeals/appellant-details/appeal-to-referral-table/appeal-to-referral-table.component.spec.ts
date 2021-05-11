import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppealToReferralTableComponent } from './appeal-to-referral-table.component';

describe('AppealToReferralTableComponent', () => {
  let component: AppealToReferralTableComponent;
  let fixture: ComponentFixture<AppealToReferralTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppealToReferralTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppealToReferralTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
