import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnsiteAssessmentRequestComponent } from './onsite-assessment-request.component';

describe('OnsiteAssessmentRequestComponent', () => {
  let component: OnsiteAssessmentRequestComponent;
  let fixture: ComponentFixture<OnsiteAssessmentRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnsiteAssessmentRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnsiteAssessmentRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
