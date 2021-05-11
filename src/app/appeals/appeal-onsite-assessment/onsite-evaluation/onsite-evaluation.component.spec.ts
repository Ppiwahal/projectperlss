import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnsiteEvaluationComponent } from './onsite-evaluation.component';

describe('OnsiteEvaluationComponent', () => {
  let component: OnsiteEvaluationComponent;
  let fixture: ComponentFixture<OnsiteEvaluationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnsiteEvaluationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnsiteEvaluationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
