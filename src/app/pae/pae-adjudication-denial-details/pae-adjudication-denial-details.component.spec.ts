import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaeAdjudicationDenialDetailsComponent } from './pae-adjudication-denial-details.component';

describe('PaeAdjudicationDenialDetailsComponent', () => {
  let component: PaeAdjudicationDenialDetailsComponent;
  let fixture: ComponentFixture<PaeAdjudicationDenialDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaeAdjudicationDenialDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaeAdjudicationDenialDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
