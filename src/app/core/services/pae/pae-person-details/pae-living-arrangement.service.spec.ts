/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PaeLivingArrangementService } from './pae-living-arrangement.service';

describe('Service: PaeLivingArrangement', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PaeLivingArrangementService]
    });
  });

  it('should ...', inject([PaeLivingArrangementService], (service: PaeLivingArrangementService) => {
    expect(service).toBeTruthy();
  }));
});
