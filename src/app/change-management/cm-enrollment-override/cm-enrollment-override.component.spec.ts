import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmEnrollmentOverrideComponent } from './cm-enrollment-override.component';

describe('CmEnrollmentOverrideComponent', () => {
  let component: CmEnrollmentOverrideComponent;
  let fixture: ComponentFixture<CmEnrollmentOverrideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CmEnrollmentOverrideComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CmEnrollmentOverrideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
