import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmSisAssessmentComponent } from './cm-sis-assessment.component';

describe('CmSisAssessmentComponent', () => {
  let component: CmSisAssessmentComponent;
  let fixture: ComponentFixture<CmSisAssessmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CmSisAssessmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CmSisAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
