import { TestBed } from '@angular/core/testing';

import { PaeSisInformantService } from './pae-sis-informant.service';

describe('PaeSisInformantService', () => {
  let service: PaeSisInformantService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaeSisInformantService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
