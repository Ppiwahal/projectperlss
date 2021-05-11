import { TestBed } from '@angular/core/testing';

import { EnrollmentDetailsService } from '../enrollment/enrollment-details.service';

describe('EnrollmentDetailsService', () => {
  let service: EnrollmentDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnrollmentDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
