import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmergentCircumstancesReviewFormComponent } from './emergent-circumstances-review-form.component';

describe('EmergentCircumstancesReviewFormComponent', () => {
  let component: EmergentCircumstancesReviewFormComponent;
  let fixture: ComponentFixture<EmergentCircumstancesReviewFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmergentCircumstancesReviewFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmergentCircumstancesReviewFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
