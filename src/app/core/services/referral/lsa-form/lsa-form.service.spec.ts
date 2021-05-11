import { TestBed } from '@angular/core/testing';

import { LsaFormService } from './lsa-form.service';

describe('LsaFormService', () => {
  let service: LsaFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LsaFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
