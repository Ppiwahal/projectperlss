import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaeCaregiverDetailsComponent } from './pae-caregiver-details.component';

describe('PaeCaregiverDetailsComponent', () => {
  let component: PaeCaregiverDetailsComponent;
  let fixture: ComponentFixture<PaeCaregiverDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaeCaregiverDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaeCaregiverDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
