import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppealReviewComponent } from './appeal-review.component';

describe('AppealReviewComponent', () => {
  let component: AppealReviewComponent;
  let fixture: ComponentFixture<AppealReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppealReviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppealReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
