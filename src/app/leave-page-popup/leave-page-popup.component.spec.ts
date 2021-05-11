import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeavePagePopupComponent } from './leave-page-popup.component';

describe('LeavePagePopupComponent', () => {
  let component: LeavePagePopupComponent;
  let fixture: ComponentFixture<LeavePagePopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeavePagePopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeavePagePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
