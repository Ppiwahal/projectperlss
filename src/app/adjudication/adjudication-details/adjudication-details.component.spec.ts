import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdjudicationDetailsComponent } from './adjudication-details.component';

describe('AdjudicationDetailsComponent', () => {
  let component: AdjudicationDetailsComponent;
  let fixture: ComponentFixture<AdjudicationDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdjudicationDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdjudicationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
