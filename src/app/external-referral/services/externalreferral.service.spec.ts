import { TestBed } from '@angular/core/testing';

import { ExternalreferralService } from './externalreferral.service';

describe('ExternalreferralService', () => {
  let service: ExternalreferralService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExternalreferralService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
