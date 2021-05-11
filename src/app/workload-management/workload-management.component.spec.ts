import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkloadManagementComponent } from './workload-management.component';

describe('WorkloadManagementComponent', () => {
  let component: WorkloadManagementComponent;
  let fixture: ComponentFixture<WorkloadManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkloadManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkloadManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
