import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmRecertificationComponent } from './cm-recertification.component';

describe('CmRecertificationComponent', () => {
  let component: CmRecertificationComponent;
  let fixture: ComponentFixture<CmRecertificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CmRecertificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CmRecertificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
