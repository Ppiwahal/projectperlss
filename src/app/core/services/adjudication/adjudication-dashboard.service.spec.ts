import { TestBed } from '@angular/core/testing';

import { AdjudicationDashboardService } from './adjudication-dashboard.service';

describe('AdjudicationDashboardService', () => {
  let service: AdjudicationDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdjudicationDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
