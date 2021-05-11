import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaeCostNeutralityPlanOfCareComponent } from './pae-cost-neutrality-plan-of-care.component';

describe('PaeCostNeutralityPlanOfCareComponentSummary', () => {
  let component: PaeCostNeutralityPlanOfCareComponent;
  let fixture: ComponentFixture<PaeCostNeutralityPlanOfCareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaeCostNeutralityPlanOfCareComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaeCostNeutralityPlanOfCareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
