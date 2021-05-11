import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowAnalyticsPopupComponent } from './workflow-analytics-popup.component';

describe('WorkflowAnalyticsPopupComponent', () => {
  let component: WorkflowAnalyticsPopupComponent;
  let fixture: ComponentFixture<WorkflowAnalyticsPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkflowAnalyticsPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowAnalyticsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
