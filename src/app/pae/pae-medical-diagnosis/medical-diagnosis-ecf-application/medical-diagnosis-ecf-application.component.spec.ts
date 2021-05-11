import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalDiagnosisEcfApplicationComponent } from './medical-diagnosis-ecf-application.component';

describe('MedicalDiagnosisEcfApplicationComponent', () => {
  let component: MedicalDiagnosisEcfApplicationComponent;
  let fixture: ComponentFixture<MedicalDiagnosisEcfApplicationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MedicalDiagnosisEcfApplicationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicalDiagnosisEcfApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
