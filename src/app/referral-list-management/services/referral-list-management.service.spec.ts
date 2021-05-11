import { TestBed } from '@angular/core/testing';

import { ReferralListManagementService } from './referral-list-management.service';

describe('ReferralListManagementService', () => {
  let service: ReferralListManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReferralListManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
