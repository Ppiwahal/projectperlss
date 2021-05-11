import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SafetyDeterminationComponent } from './safety-determination.component';

describe('SafetyDeterminationComponent', () => {
  let component: SafetyDeterminationComponent;
  let fixture: ComponentFixture<SafetyDeterminationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SafetyDeterminationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SafetyDeterminationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
