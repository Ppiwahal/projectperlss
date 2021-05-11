import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAssessorPopupComponent } from './edit-assessor-popup.component';

describe('EditAssessorPopupComponent', () => {
  let component: EditAssessorPopupComponent;
  let fixture: ComponentFixture<EditAssessorPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditAssessorPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAssessorPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
