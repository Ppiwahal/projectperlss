import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaeSafetyDeterminationFallHistoryComponent } from './pae-safety-determination-fall-history.component';

describe('PaeSafetyDeterminationFallHistoryComponent', () => {
  let component: PaeSafetyDeterminationFallHistoryComponent;
  let fixture: ComponentFixture<PaeSafetyDeterminationFallHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaeSafetyDeterminationFallHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaeSafetyDeterminationFallHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
