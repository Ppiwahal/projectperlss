import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadDocumentsPopupComponent } from './upload-documents-popup.component';

describe('AddNotesPopupComponent', () => {
  let component: UploadDocumentsPopupComponent;
  let fixture: ComponentFixture<UploadDocumentsPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadDocumentsPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadDocumentsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
