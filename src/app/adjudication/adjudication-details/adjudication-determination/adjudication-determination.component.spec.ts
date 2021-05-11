import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdjudicationDeterminationComponent } from './adjudication-determination.component';

describe('AdjudicationDeterminationComponent', () => {
  let component: AdjudicationDeterminationComponent;
  let fixture: ComponentFixture<AdjudicationDeterminationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdjudicationDeterminationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdjudicationDeterminationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
