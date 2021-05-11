import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkedRecordSummaryComponent } from './linked-record-summary.component';

describe('LinkedRecordSummaryComponent', () => {
  let component: LinkedRecordSummaryComponent;
  let fixture: ComponentFixture<LinkedRecordSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LinkedRecordSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkedRecordSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
