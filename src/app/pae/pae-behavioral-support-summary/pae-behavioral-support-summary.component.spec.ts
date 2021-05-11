import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaeBehavioralSupportSummaryComponent } from './pae-behavioral-support-summary.component';

describe('PaeBehavioralSupportSummaryComponent', () => {
  let component: PaeBehavioralSupportSummaryComponent;
  let fixture: ComponentFixture<PaeBehavioralSupportSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaeBehavioralSupportSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaeBehavioralSupportSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
