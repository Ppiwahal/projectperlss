import { TestBed } from '@angular/core/testing';

import { TransitionDashboardService } from './transition-dashboard.service';

describe('TransitionDashboardService', () => {
  let service: TransitionDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransitionDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
