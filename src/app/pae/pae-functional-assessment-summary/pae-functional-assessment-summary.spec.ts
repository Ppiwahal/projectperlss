import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaeFunctionalAssessmentSummaryComponent} from './pae-functional-assessment-summary.component';

describe('paeFunctionalAssessmentSummaryComponent', () => {
  let component: PaeFunctionalAssessmentSummaryComponent;
  let fixture: ComponentFixture<PaeFunctionalAssessmentSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaeFunctionalAssessmentSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaeFunctionalAssessmentSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
