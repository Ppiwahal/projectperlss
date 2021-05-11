import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentsHistoryComponent } from './documents-history.component';

describe('DocumentsHistoryComponent', () => {
  let component: DocumentsHistoryComponent;
  let fixture: ComponentFixture<DocumentsHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentsHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentsHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
