import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadDocumentCardComponent } from './upload-document-card.component';

describe('DocumentsDashboardComponent', () => {
  let component: UploadDocumentCardComponent;
  let fixture: ComponentFixture<UploadDocumentCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadDocumentCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadDocumentCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
