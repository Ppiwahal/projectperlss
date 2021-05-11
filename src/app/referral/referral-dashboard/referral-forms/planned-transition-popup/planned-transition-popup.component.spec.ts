import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlannedTransitionComponent } from './planned-transition-popup.component';

describe('PlannedTransitionPopupComponent', () => {
  let component: PlannedTransitionComponent;
  let fixture: ComponentFixture<PlannedTransitionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlannedTransitionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlannedTransitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});