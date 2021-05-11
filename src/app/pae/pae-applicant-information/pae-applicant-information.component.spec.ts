import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaeApplicantInformationComponent } from './pae-applicant-information.component';

describe('PaeApplicantInformationComponent', () => {
  let component: PaeApplicantInformationComponent;
  let fixture: ComponentFixture<PaeApplicantInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaeApplicantInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaeApplicantInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
