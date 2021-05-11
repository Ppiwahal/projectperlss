import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageViewUserRolesComponent } from './manage-view-user-roles.component';

describe('ManageViewUserRolesComponent', () => {
  let component: ManageViewUserRolesComponent;
  let fixture: ComponentFixture<ManageViewUserRolesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageViewUserRolesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageViewUserRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
