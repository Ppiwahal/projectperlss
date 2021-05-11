import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MmisVerifyEligibilityLookupPopupComponent } from './mmis-verify-eligibility-lookup-popup.component';

describe('MmisVerifyEligibilityLookupPopupComponent', () => {
  let component: MmisVerifyEligibilityLookupPopupComponent;
  let fixture: ComponentFixture<MmisVerifyEligibilityLookupPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MmisVerifyEligibilityLookupPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MmisVerifyEligibilityLookupPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
