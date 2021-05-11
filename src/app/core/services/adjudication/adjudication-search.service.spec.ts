import { TestBed } from '@angular/core/testing';

import { AdjudicationSearchService } from './adjudication-search.service';

describe('AdjudicationSearchService', () => {
  let service: AdjudicationSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdjudicationSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
