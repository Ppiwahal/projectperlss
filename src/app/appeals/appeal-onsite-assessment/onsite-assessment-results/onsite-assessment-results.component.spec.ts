import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnsiteAssessmentResultsComponent } from './onsite-assessment-results.component';

describe('OnsiteAssessmentResultsComponent', () => {
  let component: OnsiteAssessmentResultsComponent;
  let fixture: ComponentFixture<OnsiteAssessmentResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnsiteAssessmentResultsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnsiteAssessmentResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
