import { TestBed } from '@angular/core/testing';

import { PaeService } from './pae.service';

describe('PaeService', () => {
  let service: PaeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
