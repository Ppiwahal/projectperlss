import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalDiagnosisHcbsApplicationComponent } from './medical-diagnosis-hcbs-application.component';

describe('MedicalDiagnosisHcbsApplicationComponent', () => {
  let component: MedicalDiagnosisHcbsApplicationComponent;
  let fixture: ComponentFixture<MedicalDiagnosisHcbsApplicationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MedicalDiagnosisHcbsApplicationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicalDiagnosisHcbsApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
