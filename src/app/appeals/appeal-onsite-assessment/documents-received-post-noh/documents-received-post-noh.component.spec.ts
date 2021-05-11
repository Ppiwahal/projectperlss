import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentsReceivedPostNOHComponent } from './documents-received-post-noh.component';

describe('DocumentsReceivedPostNOHComponent', () => {
  let component: DocumentsReceivedPostNOHComponent;
  let fixture: ComponentFixture<DocumentsReceivedPostNOHComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentsReceivedPostNOHComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentsReceivedPostNOHComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
