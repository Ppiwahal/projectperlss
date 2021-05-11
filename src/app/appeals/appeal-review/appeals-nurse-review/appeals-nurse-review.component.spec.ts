import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppealsNurseReviewComponent } from './appeals-nurse-review.component';

describe('AppealsNurseReviewComponent', () => {
  let component: AppealsNurseReviewComponent;
  let fixture: ComponentFixture<AppealsNurseReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppealsNurseReviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppealsNurseReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
