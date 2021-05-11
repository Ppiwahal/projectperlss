import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtrefStepperStartComponent } from './extref-stepper-start.component';

describe('ExtrefStepperStartComponent', () => {
  let component: ExtrefStepperStartComponent;
  let fixture: ComponentFixture<ExtrefStepperStartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtrefStepperStartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtrefStepperStartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
