import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TargetPopulationReviewComponent } from './target-population-review.component';

describe('TargetPopulationReviewComponent', () => {
  let component: TargetPopulationReviewComponent;
  let fixture: ComponentFixture<TargetPopulationReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TargetPopulationReviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TargetPopulationReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
