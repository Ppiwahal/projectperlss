import { TestBed } from '@angular/core/testing';

import { AuditDetailsService } from './audit-details.service';

describe('AuditDetailsService', () => {
  let service: AuditDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuditDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
