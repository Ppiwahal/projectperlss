import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticeUploadPdfComponent } from './notice-upload-pdf.component';

describe('NoticeUploadPdfComponent', () => {
  let component: NoticeUploadPdfComponent;
  let fixture: ComponentFixture<NoticeUploadPdfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoticeUploadPdfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoticeUploadPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
