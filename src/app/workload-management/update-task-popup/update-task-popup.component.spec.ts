import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateTaskPopupComponent } from './update-task-popup.component';

describe('UpdateTaskPopupComponent', () => {
  let component: UpdateTaskPopupComponent;
  let fixture: ComponentFixture<UpdateTaskPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateTaskPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateTaskPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
