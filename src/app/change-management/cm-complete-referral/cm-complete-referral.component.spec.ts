import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmCompleteReferral } from './cm-complete-referral.component';

describe('CmCompleteReferral', () => {
  let component: CmCompleteReferral;
  let fixture: ComponentFixture<CmCompleteReferral>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CmCompleteReferral ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CmCompleteReferral);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
