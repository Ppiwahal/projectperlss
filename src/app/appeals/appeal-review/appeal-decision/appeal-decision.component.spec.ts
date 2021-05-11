import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppealDecisionComponent } from './appeal-decision.component';

describe('AppealDecisionComponent', () => {
  let component: AppealDecisionComponent;
  let fixture: ComponentFixture<AppealDecisionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppealDecisionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppealDecisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
