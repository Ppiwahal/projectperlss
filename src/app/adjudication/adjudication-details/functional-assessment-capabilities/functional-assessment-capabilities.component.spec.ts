import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FunctionalAssessmentCapabilitiesComponent } from './functional-assessment-capabilities.component';

describe('FunctionalAssessmentCapabilitiesComponent', () => {
  let component: FunctionalAssessmentCapabilitiesComponent;
  let fixture: ComponentFixture<FunctionalAssessmentCapabilitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FunctionalAssessmentCapabilitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FunctionalAssessmentCapabilitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
