/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PaePrioritizationSummaryService } from './pae-prioritization-summary.service';

describe('Service: PaePrioritizationSummary', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PaePrioritizationSummaryService]
    });
  });

  it('should ...', inject([PaePrioritizationSummaryService], (service: PaePrioritizationSummaryService) => {
    expect(service).toBeTruthy();
  }));
});
