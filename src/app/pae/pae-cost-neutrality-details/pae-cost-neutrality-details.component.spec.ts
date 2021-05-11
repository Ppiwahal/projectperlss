import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaeCostNeutralityDetailsComponent } from './pae-cost-neutrality-details.component';

describe('PaeCostNeutralityDetailsComponent', () => {
  let component: PaeCostNeutralityDetailsComponent;
  let fixture: ComponentFixture<PaeCostNeutralityDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaeCostNeutralityDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaeCostNeutralityDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
