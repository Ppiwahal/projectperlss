import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaeSafetyAssessmentSummaryComponent } from './pae-safety-assessment-summary.component';

describe('PaeSafetyAssessmentSummaryComponent', () => {
  let component: PaeSafetyAssessmentSummaryComponent;
  let fixture: ComponentFixture<PaeSafetyAssessmentSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaeSafetyAssessmentSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaeSafetyAssessmentSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
