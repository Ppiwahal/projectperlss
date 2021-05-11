import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonSummaryComponent } from './common-summary.component';

describe('CommonSummaryComponent', () => {
  let component: CommonSummaryComponent;
  let fixture: ComponentFixture<CommonSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
