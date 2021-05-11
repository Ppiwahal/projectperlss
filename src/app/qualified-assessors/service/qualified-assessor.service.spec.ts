import { TestBed } from '@angular/core/testing';

import { QualifiedAssessorService } from './qualified-assessor.service';

describe('QualifiedAssessorService', () => {
  let service: QualifiedAssessorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QualifiedAssessorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
