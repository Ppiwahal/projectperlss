import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppealsReviewOfOnsiteComponent } from './appeals-review-of-onsite.component';

describe('AppealsReviewOfOnsiteComponent', () => {
  let component: AppealsReviewOfOnsiteComponent;
  let fixture: ComponentFixture<AppealsReviewOfOnsiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppealsReviewOfOnsiteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppealsReviewOfOnsiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
