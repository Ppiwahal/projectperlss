import { TestBed } from '@angular/core/testing';

import { PaeSkilledServicesDetailsService } from './pae-skilled-services-details.service';

describe('PaeSkilledServicesDetailsService', () => {
  let service: PaeSkilledServicesDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaeSkilledServicesDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
