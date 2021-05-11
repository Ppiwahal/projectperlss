import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRolesTableComponent } from './user-roles-table.component';

describe('UserRolesTableComponent', () => {
  let component: UserRolesTableComponent;
  let fixture: ComponentFixture<UserRolesTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserRolesTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRolesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
