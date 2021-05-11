import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaeCertificationOfAssessmentComponent } from './pae-certification-of-assessment.component';

describe('PaeCertificationOfAssessmentComponent', () => {
  let component: PaeCertificationOfAssessmentComponent;
  let fixture: ComponentFixture<PaeCertificationOfAssessmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaeCertificationOfAssessmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaeCertificationOfAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
