/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ChangeManagementService } from './change-management.service';

describe('Service: ChangeManagement', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChangeManagementService]
    });
  });

  it('should ...', inject([ChangeManagementService], (service: ChangeManagementService) => {
    expect(service).toBeTruthy();
  }));
});
