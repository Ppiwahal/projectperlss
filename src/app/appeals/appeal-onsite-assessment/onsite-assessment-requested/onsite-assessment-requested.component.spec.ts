import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnsiteAssessmentRequestedComponent } from './onsite-assessment-requested.component';

describe('OnsiteAssessmentRequestedComponent', () => {
  let component: OnsiteAssessmentRequestedComponent;
  let fixture: ComponentFixture<OnsiteAssessmentRequestedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnsiteAssessmentRequestedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnsiteAssessmentRequestedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
