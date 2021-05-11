import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppealsStepperComponent } from './appeals-stepper.component';

describe('AppealsStepperComponent', () => {
  let component: AppealsStepperComponent;
  let fixture: ComponentFixture<AppealsStepperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppealsStepperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppealsStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
