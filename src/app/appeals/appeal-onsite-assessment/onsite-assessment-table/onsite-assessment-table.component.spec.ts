import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnsiteAssessmentTableComponent } from './onsite-assessment-table.component';

describe('OnsiteAssessmentTableComponent', () => {
  let component: OnsiteAssessmentTableComponent;
  let fixture: ComponentFixture<OnsiteAssessmentTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnsiteAssessmentTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnsiteAssessmentTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
