import { TestBed } from '@angular/core/testing';

import { PaeDocumentSummaryService } from './pae-document-summary.service';

describe('PaeDocumentSummaryService', () => {
  let service: PaeDocumentSummaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaeDocumentSummaryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
