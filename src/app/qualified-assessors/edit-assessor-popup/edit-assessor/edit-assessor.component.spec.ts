import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAssessorComponent } from './edit-assessor.component';

describe('EditAssessorComponent', () => {
  let component: EditAssessorComponent;
  let fixture: ComponentFixture<EditAssessorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditAssessorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAssessorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
