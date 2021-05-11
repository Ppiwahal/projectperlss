import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefApplicantComponent } from './ref-applicant.component';

describe('RefApplicantComponent', () => {
  let component: RefApplicantComponent;
  let fixture: ComponentFixture<RefApplicantComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefApplicantComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefApplicantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
