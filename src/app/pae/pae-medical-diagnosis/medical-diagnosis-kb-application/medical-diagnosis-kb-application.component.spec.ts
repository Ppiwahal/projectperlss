import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalDiagnosisKbApplicationComponent } from './medical-diagnosis-kb-application.component';

describe('MedicalDiagnosisKbApplicationComponent', () => {
  let component: MedicalDiagnosisKbApplicationComponent;
  let fixture: ComponentFixture<MedicalDiagnosisKbApplicationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MedicalDiagnosisKbApplicationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicalDiagnosisKbApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
