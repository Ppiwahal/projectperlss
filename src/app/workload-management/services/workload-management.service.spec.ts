import { TestBed } from '@angular/core/testing';

import { WorkloadManagementService } from './workload-management.service';

describe('WorkloadManagementService', () => {
  let service: WorkloadManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkloadManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
