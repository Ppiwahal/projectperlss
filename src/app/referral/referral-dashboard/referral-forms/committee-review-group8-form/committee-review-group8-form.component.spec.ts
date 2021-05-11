import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommitteeReviewGroup8FormComponent } from './committee-review-group8-form.component';

describe('CommitteeReviewGroup8FormComponent', () => {
  let component: CommitteeReviewGroup8FormComponent;
  let fixture: ComponentFixture<CommitteeReviewGroup8FormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommitteeReviewGroup8FormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommitteeReviewGroup8FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
