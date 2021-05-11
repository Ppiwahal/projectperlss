import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppealOnsiteAssessmentComponent } from './appeal-onsite-assessment.component';

describe('AppealOnsiteAssessmentComponent', () => {
  let component: AppealOnsiteAssessmentComponent;
  let fixture: ComponentFixture<AppealOnsiteAssessmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppealOnsiteAssessmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppealOnsiteAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
