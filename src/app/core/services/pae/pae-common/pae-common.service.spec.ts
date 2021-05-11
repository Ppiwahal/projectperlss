/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PaeCommonService } from './pae-common.service';

describe('Service: PaeCommon', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PaeCommonService]
    });
  });

  it('should ...', inject([PaeCommonService], (service: PaeCommonService) => {
    expect(service).toBeTruthy();
  }));
});
