import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnsiteAssessmentCorrectionComponent } from './onsite-assessment-correction.component';

describe('OnsiteAssessmentCorrectionComponent', () => {
  let component: OnsiteAssessmentCorrectionComponent;
  let fixture: ComponentFixture<OnsiteAssessmentCorrectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnsiteAssessmentCorrectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnsiteAssessmentCorrectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
