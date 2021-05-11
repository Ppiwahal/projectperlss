import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnsiteOutcomeComponent } from './onsite-outcome.component';

describe('OnsiteOutcomeComponent', () => {
  let component: OnsiteOutcomeComponent;
  let fixture: ComponentFixture<OnsiteOutcomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnsiteOutcomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnsiteOutcomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
