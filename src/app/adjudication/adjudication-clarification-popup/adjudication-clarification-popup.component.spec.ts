import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdjudicationClarificationPopupComponent } from './adjudication-clarification-popup.component';

describe('AdjudicationClarificationPopupComponent', () => {
  let component: AdjudicationClarificationPopupComponent;
  let fixture: ComponentFixture<AdjudicationClarificationPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdjudicationClarificationPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdjudicationClarificationPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
