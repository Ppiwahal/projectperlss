import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNotesPopupComponent } from './add-notes-popup.component';

describe('AddNotesPopupComponent', () => {
  let component: AddNotesPopupComponent;
  let fixture: ComponentFixture<AddNotesPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNotesPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNotesPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
