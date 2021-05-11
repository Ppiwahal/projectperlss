import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeManagementCommonComponent } from './change-management-common.component';

describe('ChangeManagementCommonComponent', () => {
  let component: ChangeManagementCommonComponent;
  let fixture: ComponentFixture<ChangeManagementCommonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeManagementCommonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeManagementCommonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
