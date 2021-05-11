import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaeIddDeterminationSummaryComponent } from './pae-idd-determination-summary.component';

describe('PaeIddDeterminationSummaryComponent', () => {
  let component: PaeIddDeterminationSummaryComponent;
  let fixture: ComponentFixture<PaeIddDeterminationSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaeIddDeterminationSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaeIddDeterminationSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
