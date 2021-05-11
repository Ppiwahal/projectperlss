import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserEntityStatusTableComponent } from './user-entity-status-table.component';

describe('UserEntityStatusTableComponent', () => {
  let component: UserEntityStatusTableComponent;
  let fixture: ComponentFixture<UserEntityStatusTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserEntityStatusTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserEntityStatusTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
