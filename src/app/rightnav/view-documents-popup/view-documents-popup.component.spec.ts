import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDocumentsPopupComponent } from './view-documents-popup.component';

describe('AddNotesPopupComponent', () => {
  let component: ViewDocumentsPopupComponent;
  let fixture: ComponentFixture<ViewDocumentsPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewDocumentsPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDocumentsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
