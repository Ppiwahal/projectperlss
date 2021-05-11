import { TestBed } from '@angular/core/testing';

import { AdjudicationDetailsService } from './adjudication-details.service';

describe('AdjudicationDetailsService', () => {
  let service: AdjudicationDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdjudicationDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
