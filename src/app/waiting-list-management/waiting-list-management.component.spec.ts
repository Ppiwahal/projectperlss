import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaitingListManagementComponent } from './waiting-list-management.component';

describe('WaitingListManagementComponent', () => {
  let component: WaitingListManagementComponent;
  let fixture: ComponentFixture<WaitingListManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaitingListManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaitingListManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
