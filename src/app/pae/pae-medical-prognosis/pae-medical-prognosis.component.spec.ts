import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaeMedicalPrognosisComponent } from './pae-medical-prognosis.component';

describe('PaeMedicalPrognosisComponent', () => {
  let component: PaeMedicalPrognosisComponent;
  let fixture: ComponentFixture<PaeMedicalPrognosisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaeMedicalPrognosisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaeMedicalPrognosisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
