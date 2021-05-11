import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TargetPopulationDeterminationComponent } from './target-population-determination.component';

describe('TargetPopulationDeterminationComponent', () => {
  let component: TargetPopulationDeterminationComponent;
  let fixture: ComponentFixture<TargetPopulationDeterminationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TargetPopulationDeterminationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TargetPopulationDeterminationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
