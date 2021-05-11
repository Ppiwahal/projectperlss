import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessorHistoryComponent } from './assessor-history.component';

describe('AssessorHistoryComponent', () => {
  let component: AssessorHistoryComponent;
  let fixture: ComponentFixture<AssessorHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssessorHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessorHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
