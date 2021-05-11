import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdjudicationDenialPopupComponent } from './adjudication-denial-popup.component';

describe('AdjudicationDenialPopupComponent', () => {
  let component: AdjudicationDenialPopupComponent;
  let fixture: ComponentFixture<AdjudicationDenialPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdjudicationDenialPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdjudicationDenialPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
