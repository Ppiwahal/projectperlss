import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaeSafetyDeterminationComponent } from './pae-safety-determination.component';

describe('PaeSafetyDeterminationComponent', () => {
  let component: PaeSafetyDeterminationComponent;
  let fixture: ComponentFixture<PaeSafetyDeterminationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaeSafetyDeterminationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaeSafetyDeterminationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
