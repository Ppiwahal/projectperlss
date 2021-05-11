import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnsiteReviewTableComponent } from './onsite-review-table.component';

describe('OnsiteReviewTableComponent', () => {
  let component: OnsiteReviewTableComponent;
  let fixture: ComponentFixture<OnsiteReviewTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnsiteReviewTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnsiteReviewTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
