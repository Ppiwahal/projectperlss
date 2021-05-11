import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReassignDocumentPopupComponent } from './reassign-document-popup.component';

describe('ReassignDocumentPopupComponent', () => {
  let component: ReassignDocumentPopupComponent;
  let fixture: ComponentFixture<ReassignDocumentPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReassignDocumentPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReassignDocumentPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
