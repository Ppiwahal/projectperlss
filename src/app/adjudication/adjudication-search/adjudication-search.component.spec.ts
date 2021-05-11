import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdjudicationSearchComponent } from './adjudication-search.component';

describe('AdjudicationSearchComponent', () => {
  let component: AdjudicationSearchComponent;
  let fixture: ComponentFixture<AdjudicationSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdjudicationSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdjudicationSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
