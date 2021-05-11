import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OverallTaskPerformanceComponent } from './overall-task-performance.component';

describe('OverallTaskPerformanceComponent', () => {
  let component: OverallTaskPerformanceComponent;
  let fixture: ComponentFixture<OverallTaskPerformanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OverallTaskPerformanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverallTaskPerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
