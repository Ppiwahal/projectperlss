/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PatientLiabilityService } from './patient-liability.service';

describe('Service: PatientLiability', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PatientLiabilityService]
    });
  });

  it('should ...', inject([PatientLiabilityService], (service: PatientLiabilityService) => {
    expect(service).toBeTruthy();
  }));
});
