import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtrefApplicantInformationComponent } from './extref-applicant-information.component';

describe('ExtrefApplicantInformationComponent', () => {
  let component: ExtrefApplicantInformationComponent;
  let fixture: ComponentFixture<ExtrefApplicantInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtrefApplicantInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtrefApplicantInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
