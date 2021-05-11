import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaeMedicalRegimenComponent } from './pae-medical-regimen.component';

describe('PaeMedicalRegimenComponent', () => {
  let component: PaeMedicalRegimenComponent;
  let fixture: ComponentFixture<PaeMedicalRegimenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaeMedicalRegimenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaeMedicalRegimenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
