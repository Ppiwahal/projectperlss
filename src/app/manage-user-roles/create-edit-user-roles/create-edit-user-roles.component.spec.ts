import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditUserRolesComponent } from './create-edit-user-roles.component';

describe('CreateEditUserRolesComponent', () => {
  let component: CreateEditUserRolesComponent;
  let fixture: ComponentFixture<CreateEditUserRolesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateEditUserRolesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEditUserRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
