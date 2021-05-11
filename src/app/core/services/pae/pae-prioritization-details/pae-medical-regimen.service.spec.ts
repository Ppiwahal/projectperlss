/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PaeMedicalRegimenService } from './pae-medical-regimen.service';

describe('Service: PaeMedicalRegimen', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PaeMedicalRegimenService]
    });
  });

  it('should ...', inject([PaeMedicalRegimenService], (service: PaeMedicalRegimenService) => {
    expect(service).toBeTruthy();
  }));
});
