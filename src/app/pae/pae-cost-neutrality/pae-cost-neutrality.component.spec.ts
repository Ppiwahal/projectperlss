import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaeCostNeutralityComponent } from './pae-cost-neutrality.component';

describe('PaeCostNeutralityComponent', () => {
  let component: PaeCostNeutralityComponent;
  let fixture: ComponentFixture<PaeCostNeutralityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaeCostNeutralityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaeCostNeutralityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
