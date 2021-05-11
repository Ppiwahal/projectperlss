import { TestBed } from '@angular/core/testing';

import { TransitionsDetailsService } from './transitions-details.service';

describe('TransitionsDetailsService', () => {
  let service: TransitionsDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransitionsDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
