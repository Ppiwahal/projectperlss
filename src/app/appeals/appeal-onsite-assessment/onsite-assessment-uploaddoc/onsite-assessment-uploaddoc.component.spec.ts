import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnsiteAssessmentUploaddocComponent } from './onsite-assessment-uploaddoc.component';

describe('OnsiteAssessmentUploaddocComponent', () => {
  let component: OnsiteAssessmentUploaddocComponent;
  let fixture: ComponentFixture<OnsiteAssessmentUploaddocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnsiteAssessmentUploaddocComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnsiteAssessmentUploaddocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
