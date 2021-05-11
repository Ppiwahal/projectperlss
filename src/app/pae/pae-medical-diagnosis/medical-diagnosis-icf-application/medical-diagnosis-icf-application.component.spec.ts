import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalDiagnosisComponent } from './medical-diagnosis.component';

describe('MedicalDiagnosisComponent', () => {
  let component: MedicalDiagnosisComponent;
  let fixture: ComponentFixture<MedicalDiagnosisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MedicalDiagnosisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicalDiagnosisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
