import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafetyAttestationPopOpComponent } from './safety-attestation-pop-op.component';

describe('SafetyAttestationPopOpComponent', () => {
  let component: SafetyAttestationPopOpComponent;
  let fixture: ComponentFixture<SafetyAttestationPopOpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SafetyAttestationPopOpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafetyAttestationPopOpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
