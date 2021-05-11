import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAssessorPopupComponent } from './add-assessor-popup.component';

describe('AddAssessorPopupComponent', () => {
  let component: AddAssessorPopupComponent;
  let fixture: ComponentFixture<AddAssessorPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAssessorPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAssessorPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
