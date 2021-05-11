import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskResultTableComponent } from './task-result-table.component';

describe('TaskResultTableComponent', () => {
  let component: TaskResultTableComponent;
  let fixture: ComponentFixture<TaskResultTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskResultTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskResultTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
