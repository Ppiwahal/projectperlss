import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalDiagonsisComponent } from './medical-diagonsis.component';

describe('MedicalDiagonsisComponent', () => {
  let component: MedicalDiagonsisComponent;
  let fixture: ComponentFixture<MedicalDiagonsisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MedicalDiagonsisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicalDiagonsisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
