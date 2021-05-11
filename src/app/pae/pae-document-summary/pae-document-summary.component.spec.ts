import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaeDocumentSummaryComponent } from './pae-document-summary.component';

describe('PaeDocumentSummaryComponent', () => {
  let component: PaeDocumentSummaryComponent;
  let fixture: ComponentFixture<PaeDocumentSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaeDocumentSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaeDocumentSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
