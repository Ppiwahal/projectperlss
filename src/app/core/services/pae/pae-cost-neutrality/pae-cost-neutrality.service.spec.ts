/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PaeCostNeutralityService } from './pae-cost-neutrality.service';

describe('Service: PaeCostNeutrality', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PaeCostNeutralityService]
    });
  });

  it('should ...', inject([PaeCostNeutralityService], (service: PaeCostNeutralityService) => {
    expect(service).toBeTruthy();
  }));
});
