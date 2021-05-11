import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmLocReassignmentComponent } from './cm-loc-reassignment.component';

describe('CmLocReassignmentComponent', () => {
  let component: CmLocReassignmentComponent;
  let fixture: ComponentFixture<CmLocReassignmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CmLocReassignmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CmLocReassignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
