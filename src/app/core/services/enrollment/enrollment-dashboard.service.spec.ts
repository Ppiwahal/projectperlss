import { TestBed } from '@angular/core/testing';

import { EnrollmentDashboardService } from './enrollment-dashboard.service';

describe('EnrollmentDashboardService', () => {
  let service: EnrollmentDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnrollmentDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
